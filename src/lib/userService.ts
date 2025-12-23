/**
 * ============================================
 * USER SERVICE - GESTIONE UTENTI DYNAMODB
 * ============================================
 * 
 * Servizio per la gestione degli utenti nel database.
 * Implementa:
 * - Registrazione con hash password
 * - Verifica email con token
 * - Login e sessioni
 * - Storico peso utente
 * 
 * Pattern DynamoDB:
 * - PK = "USER#{user_id}" per dati utente
 * - PK = "EMAIL#{email}" per lookup veloce
 * - PK = "TOKEN#{token}" per verifica email
 * - SK = "WEIGHT#{date}" per storico peso
 */

import bcrypt from 'bcryptjs'
import { 
  putItem, 
  getItem, 
  queryItems,
  deleteItem,
  generateId,
  formatDateForSK
} from './dynamodb'

// =========== CONSTANTS ===========

const SALT_ROUNDS = 12 // Bcrypt salt rounds per sicurezza
const TOKEN_EXPIRY_HOURS = 24 // Token verifica valido 24h

// =========== TYPES ===========

export interface UserDB {
  id: string
  email: string
  password_hash: string
  name: string
  email_verified: boolean
  verification_token?: string
  verification_expires?: string
  created_at: string
  updated_at?: string
  // Dati profilo (opzionali, compilati dopo onboarding)
  profile?: {
    gender?: 'male' | 'female'
    birth_date?: string
    height_cm?: number
    current_weight_kg?: number
    target_weight_kg?: number
    activity_level?: string
    goal?: string
    daily_calories?: number
    daily_proteins?: number
    daily_carbs?: number
    daily_fats?: number
  }
}

export interface WeightEntryDB {
  user_id: string
  date: string
  weight_kg: number
  notes?: string
  created_at: string
}

export interface CreateUserInput {
  email: string
  password: string
  name: string
}

// =========== PASSWORD UTILITIES ===========

/**
 * Hash password con bcrypt
 * IMPORTANTE: Mai salvare password in chiaro!
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verifica password contro hash salvato
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Genera token sicuro per verifica email
 * Usa approccio compatibile con Edge Runtime
 */
function generateVerificationToken(): string {
  // Genera token usando caratteri random
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  // Aggiungi timestamp per unicità
  return token + Date.now().toString(36)
}

// =========== USER CRUD ===========

/**
 * Crea nuovo utente con email non verificata
 * Genera token per verifica email
 */
export async function createUser(input: CreateUserInput): Promise<{
  user: Omit<UserDB, 'password_hash'>
  verificationToken: string
}> {
  const { email, password, name } = input
  
  // Normalizza email (lowercase)
  const normalizedEmail = email.toLowerCase().trim()
  
  // Verifica che email non sia già registrata
  const existing = await getUserByEmail(normalizedEmail)
  if (existing) {
    throw new Error('Email già registrata')
  }
  
  // Genera dati utente
  const userId = generateId()
  const passwordHash = await hashPassword(password)
  const verificationToken = generateVerificationToken()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)
  
  const user: UserDB = {
    id: userId,
    email: normalizedEmail,
    password_hash: passwordHash,
    name: name.trim(),
    email_verified: false,
    verification_token: verificationToken,
    verification_expires: expiresAt.toISOString(),
    created_at: now.toISOString()
  }
  
  // Salva utente in DynamoDB
  await putItem({
    PK: `USER#${userId}`,
    SK: 'PROFILE',
    ...user
  })
  
  // Salva lookup per email (per trovare utente rapidamente)
  await putItem({
    PK: `EMAIL#${normalizedEmail}`,
    SK: 'LOOKUP',
    user_id: userId
  })
  
  // Salva token verifica (per validazione rapida)
  await putItem({
    PK: `TOKEN#${verificationToken}`,
    SK: 'VERIFICATION',
    user_id: userId,
    email: normalizedEmail,
    expires_at: expiresAt.toISOString()
  })
  
  // Ritorna utente senza password hash
  const { password_hash, ...safeUser } = user
  return { user: safeUser, verificationToken }
}

/**
 * Trova utente per email
 */
export async function getUserByEmail(email: string): Promise<UserDB | null> {
  const normalizedEmail = email.toLowerCase().trim()
  
  // Prima trova user_id dal lookup email
  const lookupResult = await getItem(`EMAIL#${normalizedEmail}`, 'LOOKUP')
  if (!lookupResult.Item) return null
  
  const userId = lookupResult.Item.user_id
  
  // Poi carica dati utente completi
  const userResult = await getItem(`USER#${userId}`, 'PROFILE')
  if (!userResult.Item) return null
  
  const { PK, SK, ...user } = userResult.Item
  return user as UserDB
}

/**
 * Trova utente per ID
 */
export async function getUserById(userId: string): Promise<UserDB | null> {
  const result = await getItem(`USER#${userId}`, 'PROFILE')
  if (!result.Item) return null
  
  const { PK, SK, ...user } = result.Item
  return user as UserDB
}

/**
 * Verifica email con token
 */
export async function verifyEmail(token: string): Promise<{
  success: boolean
  message: string
  userId?: string
}> {
  // Trova token
  const tokenResult = await getItem(`TOKEN#${token}`, 'VERIFICATION')
  if (!tokenResult.Item) {
    return { success: false, message: 'Token non valido o già utilizzato' }
  }
  
  const { user_id, email, expires_at } = tokenResult.Item
  
  // Verifica scadenza
  if (new Date(expires_at) < new Date()) {
    // Elimina token scaduto
    await deleteItem(`TOKEN#${token}`, 'VERIFICATION')
    return { success: false, message: 'Token scaduto. Richiedi un nuovo link di verifica.' }
  }
  
  // Aggiorna utente come verificato
  const user = await getUserById(user_id)
  if (!user) {
    return { success: false, message: 'Utente non trovato' }
  }
  
  // Aggiorna profilo utente
  await putItem({
    PK: `USER#${user_id}`,
    SK: 'PROFILE',
    ...user,
    email_verified: true,
    verification_token: undefined,
    verification_expires: undefined,
    updated_at: new Date().toISOString()
  })
  
  // Elimina token usato
  await deleteItem(`TOKEN#${token}`, 'VERIFICATION')
  
  return { success: true, message: 'Email verificata con successo!', userId: user_id }
}

/**
 * Login utente (verifica credenziali)
 */
export async function loginUser(email: string, password: string): Promise<{
  success: boolean
  message: string
  user?: Omit<UserDB, 'password_hash'>
}> {
  const user = await getUserByEmail(email)
  
  if (!user) {
    return { success: false, message: 'Email o password non corretti' }
  }
  
  // Verifica password
  const validPassword = await verifyPassword(password, user.password_hash)
  if (!validPassword) {
    return { success: false, message: 'Email o password non corretti' }
  }
  
  // Verifica che email sia verificata
  if (!user.email_verified) {
    return { success: false, message: 'Email non verificata. Controlla la tua casella di posta.' }
  }
  
  // Login riuscito
  const { password_hash, ...safeUser } = user
  return { success: true, message: 'Login effettuato', user: safeUser }
}

/**
 * Rigenera token verifica (per utenti con token scaduto)
 */
export async function regenerateVerificationToken(email: string): Promise<{
  success: boolean
  message: string
  token?: string
}> {
  const user = await getUserByEmail(email)
  
  if (!user) {
    return { success: false, message: 'Email non registrata' }
  }
  
  if (user.email_verified) {
    return { success: false, message: 'Email già verificata' }
  }
  
  // Elimina vecchio token se esiste
  if (user.verification_token) {
    await deleteItem(`TOKEN#${user.verification_token}`, 'VERIFICATION')
  }
  
  // Genera nuovo token
  const newToken = generateVerificationToken()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)
  
  // Aggiorna utente
  await putItem({
    PK: `USER#${user.id}`,
    SK: 'PROFILE',
    ...user,
    verification_token: newToken,
    verification_expires: expiresAt.toISOString(),
    updated_at: now.toISOString()
  })
  
  // Salva nuovo token
  await putItem({
    PK: `TOKEN#${newToken}`,
    SK: 'VERIFICATION',
    user_id: user.id,
    email: user.email,
    expires_at: expiresAt.toISOString()
  })
  
  return { success: true, message: 'Nuovo link di verifica inviato', token: newToken }
}

/**
 * Aggiorna profilo utente
 */
export async function updateUserProfile(
  userId: string, 
  profile: Partial<UserDB['profile']>
): Promise<UserDB | null> {
  const user = await getUserById(userId)
  if (!user) return null
  
  const updatedUser = {
    ...user,
    profile: {
      ...user.profile,
      ...profile
    },
    updated_at: new Date().toISOString()
  }
  
  await putItem({
    PK: `USER#${userId}`,
    SK: 'PROFILE',
    ...updatedUser
  })
  
  return updatedUser
}

// =========== WEIGHT HISTORY ===========

/**
 * Aggiungi peso allo storico
 */
export async function addWeightEntry(
  userId: string,
  weightKg: number,
  date?: Date,
  notes?: string
): Promise<WeightEntryDB> {
  const entryDate = date || new Date()
  const dateStr = formatDateForSK(entryDate)
  
  const entry: WeightEntryDB = {
    user_id: userId,
    date: dateStr,
    weight_kg: Math.round(weightKg * 10) / 10, // Arrotonda a 1 decimale
    notes,
    created_at: new Date().toISOString()
  }
  
  await putItem({
    PK: `USER#${userId}`,
    SK: `WEIGHT#${dateStr}`,
    ...entry
  })
  
  // Aggiorna anche peso corrente nel profilo
  const user = await getUserById(userId)
  if (user) {
    await updateUserProfile(userId, { current_weight_kg: weightKg })
  }
  
  return entry
}

/**
 * Ottieni storico peso utente
 */
export async function getWeightHistory(
  userId: string,
  limit: number = 90 // Default: ultimi 90 giorni
): Promise<WeightEntryDB[]> {
  const result = await queryItems(
    `USER#${userId}`,
    { beginsWith: 'WEIGHT#' }
  )
  
  const entries = (result.Items || [])
    .map(item => {
      const { PK, SK, ...entry } = item
      return entry as WeightEntryDB
    })
    .sort((a, b) => b.date.localeCompare(a.date)) // Più recenti prima
    .slice(0, limit)
  
  return entries
}

/**
 * Ottieni peso per una data specifica
 */
export async function getWeightByDate(
  userId: string,
  date: Date
): Promise<WeightEntryDB | null> {
  const dateStr = formatDateForSK(date)
  
  const result = await getItem(`USER#${userId}`, `WEIGHT#${dateStr}`)
  if (!result.Item) return null
  
  const { PK, SK, ...entry } = result.Item
  return entry as WeightEntryDB
}

/**
 * Elimina peso per una data
 */
export async function deleteWeightEntry(
  userId: string,
  date: string
): Promise<boolean> {
  try {
    await deleteItem(`USER#${userId}`, `WEIGHT#${date}`)
    return true
  } catch {
    return false
  }
}

/**
 * Ottieni statistiche peso (min, max, media, trend)
 */
export async function getWeightStats(userId: string): Promise<{
  current: number | null
  min: number | null
  max: number | null
  average: number | null
  change7d: number | null
  change30d: number | null
  entries: number
}> {
  const history = await getWeightHistory(userId, 365) // Ultimo anno
  
  if (history.length === 0) {
    return {
      current: null,
      min: null,
      max: null,
      average: null,
      change7d: null,
      change30d: null,
      entries: 0
    }
  }
  
  const weights = history.map(h => h.weight_kg)
  const current = weights[0] // Più recente
  
  // Trova peso 7 e 30 giorni fa
  const now = new Date()
  const date7dAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const date30dAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const entry7d = history.find(h => new Date(h.date) <= date7dAgo)
  const entry30d = history.find(h => new Date(h.date) <= date30dAgo)
  
  return {
    current,
    min: Math.min(...weights),
    max: Math.max(...weights),
    average: Math.round(weights.reduce((a, b) => a + b, 0) / weights.length * 10) / 10,
    change7d: entry7d ? Math.round((current - entry7d.weight_kg) * 10) / 10 : null,
    change30d: entry30d ? Math.round((current - entry30d.weight_kg) * 10) / 10 : null,
    entries: history.length
  }
}
