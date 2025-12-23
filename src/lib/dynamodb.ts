/**
 * ============================================
 * AWS DYNAMODB CLIENT - NUTRIFIT
 * ============================================
 * 
 * Client DynamoDB con:
 * - Retry automatico con exponential backoff
 * - Rate limiting client-side (max 4 req/sec)
 * - Connection pooling
 * - Error handling per throttling
 * 
 * Tabella: FoodDiary
 * Partition Key: PK (String)
 * Sort Key: SK (String)
 * Regione: eu-north-1
 * Capacità: 5 RCU, 5 WCU
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  QueryCommand, 
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
  BatchWriteCommand,
  type GetCommandInput,
  type PutCommandInput,
  type QueryCommandInput,
  type DeleteCommandInput,
  type ScanCommandInput,
  type UpdateCommandInput,
  type BatchWriteCommandInput
} from '@aws-sdk/lib-dynamodb'

// =========== CONFIGURAZIONE ===========

const REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1'
const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMODB_TABLE || 'FoodDiary'

// Rate limiting: max 4 richieste/secondo (sicurezza per 5 RCU/WCU)
const MAX_REQUESTS_PER_SECOND = 4
const REQUEST_INTERVAL_MS = 1000 / MAX_REQUESTS_PER_SECOND // 250ms

// Retry configuration
const MAX_RETRIES = 5
const BASE_DELAY_MS = 100

// =========== RATE LIMITER ===========

/**
 * Rate limiter semplice per limitare le richieste client-side
 * Previene il throttling alla fonte
 */
class RateLimiter {
  private lastRequestTime = 0
  private queue: Array<() => void> = []
  private processing = false

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push(resolve)
      this.processQueue()
    })
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequestTime
      
      if (timeSinceLastRequest < REQUEST_INTERVAL_MS) {
        await this.sleep(REQUEST_INTERVAL_MS - timeSinceLastRequest)
      }
      
      this.lastRequestTime = Date.now()
      const resolve = this.queue.shift()
      if (resolve) resolve()
    }
    
    this.processing = false
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

const rateLimiter = new RateLimiter()

// =========== DYNAMODB CLIENT ===========

/**
 * Crea il client DynamoDB con configurazione ottimizzata
 * Le credenziali vengono lette automaticamente da:
 * - Variabili d'ambiente (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
 * - File credentials (~/.aws/credentials)
 * - IAM Role (in produzione su AWS)
 */
const createDynamoDBClient = () => {
  const client = new DynamoDBClient({
    region: REGION,
    // Credenziali: lette automaticamente dall'ambiente
    // In produzione su AWS Lambda/EC2, usa IAM Role
    ...(process.env.AWS_ACCESS_KEY_ID && {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      }
    }),
    // Retry config base (noi aggiungiamo exponential backoff custom)
    maxAttempts: 1, // Gestiamo noi i retry
  })

  // Document client per lavorare con oggetti JS nativi
  return DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  })
}

// Singleton del client
let docClient: DynamoDBDocumentClient | null = null

const getDocClient = (): DynamoDBDocumentClient => {
  if (!docClient) {
    docClient = createDynamoDBClient()
  }
  return docClient
}

// =========== RETRY WITH EXPONENTIAL BACKOFF ===========

/**
 * Esegue un'operazione con retry automatico e exponential backoff
 * Gestisce specificamente ProvisionedThroughputExceededException
 * 
 * @param operation - Funzione async da eseguire
 * @param operationName - Nome operazione per logging
 * @returns Risultato dell'operazione
 */
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Applica rate limiting prima di ogni richiesta
      await rateLimiter.acquire()
      
      // Esegui l'operazione
      return await operation()
      
    } catch (error: any) {
      lastError = error
      
      // Verifica se è un errore di throttling
      const isThrottlingError = 
        error.name === 'ProvisionedThroughputExceededException' ||
        error.name === 'ThrottlingException' ||
        error.$metadata?.httpStatusCode === 400 && error.message?.includes('throughput')

      if (isThrottlingError && attempt < MAX_RETRIES - 1) {
        // Calcola delay con exponential backoff + jitter
        const baseDelay = BASE_DELAY_MS * Math.pow(2, attempt)
        const jitter = Math.random() * baseDelay * 0.1 // 10% jitter
        const delay = baseDelay + jitter

        console.warn(
          `[DynamoDB] Throttling su ${operationName}, ` +
          `tentativo ${attempt + 1}/${MAX_RETRIES}, ` +
          `retry tra ${Math.round(delay)}ms...`
        )

        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // Se non è throttling o abbiamo esaurito i retry, rilancia
      console.error(`[DynamoDB] Errore ${operationName}:`, error.name, error.message)
      throw error
    }
  }

  throw lastError || new Error(`Operazione ${operationName} fallita dopo ${MAX_RETRIES} tentativi`)
}

// =========== OPERAZIONI DATABASE ===========

/**
 * Ottiene un singolo item dal database
 */
export async function getItem(pk: string, sk: string) {
  const params: GetCommandInput = {
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk }
  }

  return retryWithBackoff(
    () => getDocClient().send(new GetCommand(params)),
    `getItem(${pk}, ${sk})`
  )
}

/**
 * Inserisce o aggiorna un item nel database
 */
export async function putItem(item: Record<string, any>) {
  const params: PutCommandInput = {
    TableName: TABLE_NAME,
    Item: item
  }

  return retryWithBackoff(
    () => getDocClient().send(new PutCommand(params)),
    `putItem(${item.PK})`
  )
}

/**
 * Query items con partition key e opzionale sort key condition
 */
export async function queryItems(
  pk: string, 
  skCondition?: { beginsWith?: string; between?: [string, string] }
) {
  let keyConditionExpression = 'PK = :pk'
  const expressionAttributeValues: Record<string, any> = { ':pk': pk }

  if (skCondition?.beginsWith) {
    keyConditionExpression += ' AND begins_with(SK, :skPrefix)'
    expressionAttributeValues[':skPrefix'] = skCondition.beginsWith
  } else if (skCondition?.between) {
    keyConditionExpression += ' AND SK BETWEEN :skStart AND :skEnd'
    expressionAttributeValues[':skStart'] = skCondition.between[0]
    expressionAttributeValues[':skEnd'] = skCondition.between[1]
  }

  const params: QueryCommandInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues
  }

  return retryWithBackoff(
    () => getDocClient().send(new QueryCommand(params)),
    `queryItems(${pk})`
  )
}

/**
 * Elimina un item dal database
 */
export async function deleteItem(pk: string, sk: string) {
  const params: DeleteCommandInput = {
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk }
  }

  return retryWithBackoff(
    () => getDocClient().send(new DeleteCommand(params)),
    `deleteItem(${pk}, ${sk})`
  )
}

/**
 * Scansione con filtro (usare con cautela - costoso!)
 * Implementa debounce lato chiamante per ricerche
 */
export async function scanWithFilter(
  filterExpression: string,
  expressionAttributeValues: Record<string, any>,
  expressionAttributeNames?: Record<string, string>,
  limit?: number
) {
  const params: ScanCommandInput = {
    TableName: TABLE_NAME,
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
    ...(limit && { Limit: limit })
  }

  return retryWithBackoff(
    () => getDocClient().send(new ScanCommand(params)),
    `scanWithFilter`
  )
}

/**
 * Aggiorna attributi specifici di un item
 */
export async function updateItem(
  pk: string, 
  sk: string,
  updateExpression: string,
  expressionAttributeValues: Record<string, any>,
  expressionAttributeNames?: Record<string, string>
) {
  const params: UpdateCommandInput = {
    TableName: TABLE_NAME,
    Key: { PK: pk, SK: sk },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(expressionAttributeNames && { ExpressionAttributeNames: expressionAttributeNames }),
    ReturnValues: 'ALL_NEW'
  }

  return retryWithBackoff(
    () => getDocClient().send(new UpdateCommand(params)),
    `updateItem(${pk}, ${sk})`
  )
}

/**
 * Scrittura batch (max 25 items per chiamata)
 * Utile per inserimenti multipli
 */
export async function batchWriteItems(items: Record<string, any>[]) {
  // DynamoDB limita a 25 items per batch
  const BATCH_SIZE = 25
  const batches: Record<string, any>[][] = []

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    batches.push(items.slice(i, i + BATCH_SIZE))
  }

  const results = []
  for (const batch of batches) {
    const params: BatchWriteCommandInput = {
      RequestItems: {
        [TABLE_NAME]: batch.map(item => ({
          PutRequest: { Item: item }
        }))
      }
    }

    const result = await retryWithBackoff(
      () => getDocClient().send(new BatchWriteCommand(params)),
      `batchWriteItems(${batch.length} items)`
    )
    results.push(result)
  }

  return results
}

// =========== UTILITY ===========

/**
 * Genera un ID univoco per nuovi items
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Formatta la data per la sort key (YYYY-MM-DD)
 */
export function formatDateForSK(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Costanti per i prefissi delle partition key
 */
export const PK_PREFIX = {
  FOOD: 'FOOD#',
  USER: 'USER#'
} as const

/**
 * Costanti per i tipi di pasto
 */
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  MORNING_SNACK: 'morning_snack',
  LUNCH: 'lunch',
  AFTERNOON_SNACK: 'afternoon_snack',
  DINNER: 'dinner',
  EXTRA: 'extra'
} as const

export type MealTypeDB = typeof MEAL_TYPES[keyof typeof MEAL_TYPES]

// Export del nome tabella per riferimento
export { TABLE_NAME }
