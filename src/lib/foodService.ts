/**
 * ============================================
 * FOOD SERVICE - GESTIONE ALIMENTI DYNAMODB
 * ============================================
 * 
 * Servizio per la gestione degli alimenti nel database.
 * Implementa:
 * - Ricerca alimenti con debounce (min 2 caratteri)
 * - CRUD alimenti
 * - Cache locale per ridurre query
 * 
 * Pattern DynamoDB:
 * - PK = "FOOD#{food_id}"
 * - SK = "METADATA"
 */

import { 
  putItem, 
  getItem, 
  deleteItem, 
  scanWithFilter,
  generateId,
  PK_PREFIX 
} from './dynamodb'

// =========== TYPES ===========

export interface FoodItemDB {
  id: string
  name: string
  calories_per_100g: number
  proteins_per_100g: number
  carbs_per_100g: number
  fats_per_100g: number
  fiber_per_100g: number
  sugar_per_100g?: number
  category: string
  brand?: string
  barcode?: string
  source: 'CREA' | 'OpenFoodFacts' | 'custom'
  country?: string
  created_at: string
  updated_at?: string
}

export interface FoodSearchResult {
  items: FoodItemDB[]
  count: number
  scannedCount: number
}

// =========== CACHE LOCALE ===========

/**
 * Cache semplice per ridurre query ripetute
 * TTL: 5 minuti
 */
class FoodCache {
  private cache = new Map<string, { data: FoodItemDB[]; timestamp: number }>()
  private TTL = 5 * 60 * 1000 // 5 minuti

  get(key: string): FoodItemDB[] | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  set(key: string, data: FoodItemDB[]): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }
}

const foodCache = new FoodCache()

// =========== DEBOUNCE ===========

/**
 * Debounce per la ricerca - evita troppe query
 * Aspetta 300ms dopo l'ultima digitazione
 */
let debounceTimer: NodeJS.Timeout | null = null

export function debounceSearch<T>(
  fn: () => Promise<T>,
  delay: number = 300
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }, delay)
  })
}

// =========== FUNZIONI CRUD ===========

/**
 * Crea un nuovo alimento nel database
 */
export async function createFood(food: Omit<FoodItemDB, 'id' | 'created_at'>): Promise<FoodItemDB> {
  const id = generateId()
  const now = new Date().toISOString()

  const item = {
    PK: `${PK_PREFIX.FOOD}${id}`,
    SK: 'METADATA',
    id,
    ...food,
    created_at: now
  }

  await putItem(item)
  
  // Invalida cache
  foodCache.clear()

  return {
    id,
    ...food,
    created_at: now
  }
}

/**
 * Ottiene un alimento per ID
 */
export async function getFoodById(foodId: string): Promise<FoodItemDB | null> {
  const result = await getItem(`${PK_PREFIX.FOOD}${foodId}`, 'METADATA')
  
  if (!result.Item) return null

  const { PK, SK, ...food } = result.Item
  return food as FoodItemDB
}

/**
 * Aggiorna un alimento esistente
 */
export async function updateFood(
  foodId: string, 
  updates: Partial<Omit<FoodItemDB, 'id' | 'created_at'>>
): Promise<FoodItemDB | null> {
  const existing = await getFoodById(foodId)
  if (!existing) return null

  const updatedFood = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString()
  }

  const item = {
    PK: `${PK_PREFIX.FOOD}${foodId}`,
    SK: 'METADATA',
    ...updatedFood
  }

  await putItem(item)
  
  // Invalida cache
  foodCache.clear()

  return updatedFood
}

/**
 * Elimina un alimento
 */
export async function deleteFood(foodId: string): Promise<boolean> {
  try {
    await deleteItem(`${PK_PREFIX.FOOD}${foodId}`, 'METADATA')
    foodCache.clear()
    return true
  } catch (error) {
    console.error('Errore eliminazione alimento:', error)
    return false
  }
}

/**
 * Cerca alimenti per nome
 * 
 * IMPORTANTE: La ricerca inizia solo con >= 2 caratteri
 * per evitare troppe query al database
 * 
 * Implementa:
 * - Cache locale per query ripetute
 * - Limite risultati per ridurre consumo RCU
 */
export async function searchFoods(
  query: string,
  limit: number = 50
): Promise<FoodSearchResult> {
  // Validazione: minimo 2 caratteri
  if (!query || query.trim().length < 2) {
    return { items: [], count: 0, scannedCount: 0 }
  }

  const normalizedQuery = query.trim().toLowerCase()
  
  // Controlla cache
  const cached = foodCache.get(normalizedQuery)
  if (cached) {
    console.log(`[FoodService] Cache hit per "${normalizedQuery}"`)
    return { 
      items: cached.slice(0, limit), 
      count: cached.length, 
      scannedCount: 0 
    }
  }

  console.log(`[FoodService] Ricerca DB per "${normalizedQuery}"`)

  try {
    // Scan con filtro sul nome (case-insensitive)
    // NOTA: In produzione con molti dati, considera GSI su name
    const result = await scanWithFilter(
      'begins_with(PK, :foodPrefix) AND contains(#name_lower, :query)',
      { 
        ':foodPrefix': PK_PREFIX.FOOD,
        ':query': normalizedQuery 
      },
      { '#name_lower': 'name_lower' }, // Per ricerca case-insensitive
      limit * 2 // Leggiamo più del limite per avere margine
    )

    // Se name_lower non esiste, facciamo fallback su name
    let items: FoodItemDB[] = []
    
    if (result.Items && result.Items.length > 0) {
      items = result.Items.map(item => {
        const { PK, SK, name_lower, ...food } = item
        return food as FoodItemDB
      })
    } else {
      // Fallback: ricerca su name originale
      const fallbackResult = await scanWithFilter(
        'begins_with(PK, :foodPrefix)',
        { ':foodPrefix': PK_PREFIX.FOOD },
        undefined,
        500 // Limite per evitare timeout
      )

      if (fallbackResult.Items) {
        items = fallbackResult.Items
          .filter(item => 
            item.name?.toLowerCase().includes(normalizedQuery)
          )
          .map(item => {
            const { PK, SK, ...food } = item
            return food as FoodItemDB
          })
          .slice(0, limit)
      }
    }

    // Salva in cache
    foodCache.set(normalizedQuery, items)

    return {
      items: items.slice(0, limit),
      count: items.length,
      scannedCount: result.ScannedCount || 0
    }
  } catch (error) {
    console.error('[FoodService] Errore ricerca:', error)
    throw error
  }
}

/**
 * Cerca alimento per barcode
 */
export async function searchByBarcode(barcode: string): Promise<FoodItemDB | null> {
  if (!barcode || barcode.length < 8) return null

  try {
    const result = await scanWithFilter(
      'barcode = :barcode',
      { ':barcode': barcode },
      undefined,
      1 // Solo 1 risultato
    )

    if (result.Items && result.Items.length > 0) {
      const { PK, SK, ...food } = result.Items[0]
      return food as FoodItemDB
    }

    return null
  } catch (error) {
    console.error('[FoodService] Errore ricerca barcode:', error)
    return null
  }
}

/**
 * Ottiene alimenti per categoria
 */
export async function getFoodsByCategory(
  category: string,
  limit: number = 50
): Promise<FoodItemDB[]> {
  const cacheKey = `category:${category}`
  const cached = foodCache.get(cacheKey)
  if (cached) return cached.slice(0, limit)

  try {
    const result = await scanWithFilter(
      'begins_with(PK, :foodPrefix) AND category = :category',
      { 
        ':foodPrefix': PK_PREFIX.FOOD,
        ':category': category 
      },
      undefined,
      limit
    )

    const items = (result.Items || []).map(item => {
      const { PK, SK, ...food } = item
      return food as FoodItemDB
    })

    foodCache.set(cacheKey, items)
    return items
  } catch (error) {
    console.error('[FoodService] Errore caricamento categoria:', error)
    return []
  }
}

/**
 * Importa alimenti dal database locale CREA
 * Utile per popolamento iniziale
 */
export async function importFoodsFromLocal(
  foods: Array<{
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar?: number
  }>
): Promise<{ imported: number; errors: number }> {
  let imported = 0
  let errors = 0

  for (const food of foods) {
    try {
      await createFood({
        name: food.name,
        calories_per_100g: food.calories,
        proteins_per_100g: food.protein,
        carbs_per_100g: food.carbs,
        fats_per_100g: food.fat,
        fiber_per_100g: food.fiber,
        sugar_per_100g: food.sugar,
        category: 'imported',
        source: 'CREA',
        country: 'Italia'
      })
      imported++
      
      // Pausa tra le scritture per rispettare rate limit
      if (imported % 4 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`Errore import "${food.name}":`, error)
      errors++
    }
  }

  return { imported, errors }
}
