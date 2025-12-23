/**
 * ============================================
 * MEAL SERVICE - GESTIONE CONSUMI UTENTI
 * ============================================
 * 
 * Servizio per la gestione dei pasti/consumi nel database.
 * Implementa:
 * - Registrazione pasti con calcolo automatico valori nutrizionali
 * - Diario giornaliero
 * - Statistiche periodo
 * 
 * Pattern DynamoDB:
 * - PK = "USER#{user_id}"
 * - SK = "{date}#{meal_type}#{sequence}"
 */

import { 
  putItem, 
  queryItems, 
  deleteItem,
  generateId,
  formatDateForSK,
  PK_PREFIX,
  MEAL_TYPES,
  type MealTypeDB
} from './dynamodb'

// =========== TYPES ===========

export interface MealEntryDB {
  id: string
  user_id: string
  food_id: string
  food_name: string
  quantity_grams: number
  total_calories: number
  total_proteins: number
  total_carbs: number
  total_fats: number
  total_fiber?: number
  meal_type: MealTypeDB
  date: string // YYYY-MM-DD
  timestamp: string // ISO string completo
  notes?: string
  source?: 'CREA' | 'OpenFoodFacts' | 'custom'
}

export interface DailyDiaryDB {
  date: string
  meals: MealEntryDB[]
  totals: {
    calories: number
    proteins: number
    carbs: number
    fats: number
    fiber: number
  }
}

export interface MealInput {
  food_id: string
  food_name: string
  quantity_grams: number
  calories_per_100g: number
  proteins_per_100g: number
  carbs_per_100g: number
  fats_per_100g: number
  fiber_per_100g?: number
  meal_type: MealTypeDB
  notes?: string
  source?: 'CREA' | 'OpenFoodFacts' | 'custom'
}

// =========== CALCOLI NUTRIZIONALI ===========

/**
 * Calcola valori nutrizionali per la quantità specificata
 * Formula: (valore_per_100g * quantità_grammi) / 100
 */
function calculateNutrients(
  quantity_grams: number,
  per100g: {
    calories: number
    proteins: number
    carbs: number
    fats: number
    fiber?: number
  }
): { calories: number; proteins: number; carbs: number; fats: number; fiber: number } {
  // Validazione: quantità deve essere > 0
  if (quantity_grams <= 0) {
    throw new Error('La quantità deve essere maggiore di 0')
  }

  // Validazione: valori nutrizionali >= 0
  if (per100g.calories < 0 || per100g.proteins < 0 || per100g.carbs < 0 || per100g.fats < 0) {
    throw new Error('I valori nutrizionali non possono essere negativi')
  }

  const multiplier = quantity_grams / 100

  return {
    calories: Math.round(per100g.calories * multiplier),
    proteins: Math.round(per100g.proteins * multiplier * 10) / 10,
    carbs: Math.round(per100g.carbs * multiplier * 10) / 10,
    fats: Math.round(per100g.fats * multiplier * 10) / 10,
    fiber: Math.round((per100g.fiber || 0) * multiplier * 10) / 10
  }
}

// =========== FUNZIONI CRUD ===========

/**
 * Registra un nuovo pasto nel diario
 */
export async function addMeal(
  userId: string,
  meal: MealInput,
  date?: Date
): Promise<MealEntryDB> {
  const mealDate = date || new Date()
  const dateStr = formatDateForSK(mealDate)
  const id = generateId()
  const timestamp = new Date().toISOString()

  // Calcola valori nutrizionali
  const nutrients = calculateNutrients(meal.quantity_grams, {
    calories: meal.calories_per_100g,
    proteins: meal.proteins_per_100g,
    carbs: meal.carbs_per_100g,
    fats: meal.fats_per_100g,
    fiber: meal.fiber_per_100g
  })

  // Costruisci sort key: {date}#{meal_type}#{id}
  const sk = `${dateStr}#${meal.meal_type}#${id}`

  const entry: MealEntryDB = {
    id,
    user_id: userId,
    food_id: meal.food_id,
    food_name: meal.food_name,
    quantity_grams: meal.quantity_grams,
    total_calories: nutrients.calories,
    total_proteins: nutrients.proteins,
    total_carbs: nutrients.carbs,
    total_fats: nutrients.fats,
    total_fiber: nutrients.fiber,
    meal_type: meal.meal_type,
    date: dateStr,
    timestamp,
    notes: meal.notes,
    source: meal.source
  }

  const item = {
    PK: `${PK_PREFIX.USER}${userId}`,
    SK: sk,
    ...entry
  }

  await putItem(item)

  return entry
}

/**
 * Ottiene il diario giornaliero di un utente
 */
export async function getDailyDiary(
  userId: string,
  date: Date
): Promise<DailyDiaryDB> {
  const dateStr = formatDateForSK(date)

  const result = await queryItems(
    `${PK_PREFIX.USER}${userId}`,
    { beginsWith: dateStr }
  )

  const meals: MealEntryDB[] = (result.Items || []).map(item => {
    const { PK, SK, ...meal } = item
    return meal as MealEntryDB
  })

  // Calcola totali giornalieri
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.total_calories,
      proteins: acc.proteins + meal.total_proteins,
      carbs: acc.carbs + meal.total_carbs,
      fats: acc.fats + meal.total_fats,
      fiber: acc.fiber + (meal.total_fiber || 0)
    }),
    { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 }
  )

  return {
    date: dateStr,
    meals,
    totals: {
      calories: Math.round(totals.calories),
      proteins: Math.round(totals.proteins * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fats: Math.round(totals.fats * 10) / 10,
      fiber: Math.round(totals.fiber * 10) / 10
    }
  }
}

/**
 * Ottiene tutti i pasti di un utente in un range di date
 */
export async function getMealsInRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<MealEntryDB[]> {
  const startStr = formatDateForSK(startDate)
  const endStr = formatDateForSK(endDate) + '#~' // ~ è dopo z in ASCII

  const result = await queryItems(
    `${PK_PREFIX.USER}${userId}`,
    { between: [startStr, endStr] }
  )

  return (result.Items || []).map(item => {
    const { PK, SK, ...meal } = item
    return meal as MealEntryDB
  })
}

/**
 * Modifica un pasto esistente
 */
export async function updateMeal(
  userId: string,
  mealId: string,
  date: string,
  mealType: MealTypeDB,
  updates: Partial<MealInput>
): Promise<MealEntryDB | null> {
  // Ricostruisci la sort key
  const sk = `${date}#${mealType}#${mealId}`
  const pk = `${PK_PREFIX.USER}${userId}`

  // Prima ottieni il pasto esistente
  const result = await queryItems(pk, { beginsWith: `${date}#${mealType}#${mealId}` })
  
  if (!result.Items || result.Items.length === 0) {
    return null
  }

  const existing = result.Items[0]
  const { PK, SK, ...existingMeal } = existing

  // Ricalcola nutrienti se cambia quantità
  let nutrients = {
    calories: existingMeal.total_calories,
    proteins: existingMeal.total_proteins,
    carbs: existingMeal.total_carbs,
    fats: existingMeal.total_fats,
    fiber: existingMeal.total_fiber || 0
  }

  if (updates.quantity_grams && updates.quantity_grams !== existingMeal.quantity_grams) {
    nutrients = calculateNutrients(updates.quantity_grams, {
      calories: updates.calories_per_100g || existingMeal.total_calories * 100 / existingMeal.quantity_grams,
      proteins: updates.proteins_per_100g || existingMeal.total_proteins * 100 / existingMeal.quantity_grams,
      carbs: updates.carbs_per_100g || existingMeal.total_carbs * 100 / existingMeal.quantity_grams,
      fats: updates.fats_per_100g || existingMeal.total_fats * 100 / existingMeal.quantity_grams,
      fiber: updates.fiber_per_100g
    })
  }

  const updatedMeal: MealEntryDB = {
    ...existingMeal as MealEntryDB,
    quantity_grams: updates.quantity_grams || existingMeal.quantity_grams,
    total_calories: nutrients.calories,
    total_proteins: nutrients.proteins,
    total_carbs: nutrients.carbs,
    total_fats: nutrients.fats,
    total_fiber: nutrients.fiber,
    notes: updates.notes !== undefined ? updates.notes : existingMeal.notes
  }

  await putItem({
    PK: pk,
    SK: sk,
    ...updatedMeal
  })

  return updatedMeal
}

/**
 * Elimina un pasto
 */
export async function deleteMeal(
  userId: string,
  mealId: string,
  date: string,
  mealType: MealTypeDB
): Promise<boolean> {
  try {
    const sk = `${date}#${mealType}#${mealId}`
    await deleteItem(`${PK_PREFIX.USER}${userId}`, sk)
    return true
  } catch (error) {
    console.error('Errore eliminazione pasto:', error)
    return false
  }
}

/**
 * Ottiene statistiche per un periodo
 */
export async function getPeriodStats(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  days: number
  totalCalories: number
  avgCalories: number
  avgProteins: number
  avgCarbs: number
  avgFats: number
  mealsCount: number
}> {
  const meals = await getMealsInRange(userId, startDate, endDate)

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.total_calories,
      proteins: acc.proteins + meal.total_proteins,
      carbs: acc.carbs + meal.total_carbs,
      fats: acc.fats + meal.total_fats
    }),
    { calories: 0, proteins: 0, carbs: 0, fats: 0 }
  )

  // Conta giorni unici
  const uniqueDays = new Set(meals.map(m => m.date)).size
  const days = uniqueDays || 1

  return {
    days,
    totalCalories: Math.round(totals.calories),
    avgCalories: Math.round(totals.calories / days),
    avgProteins: Math.round(totals.proteins / days * 10) / 10,
    avgCarbs: Math.round(totals.carbs / days * 10) / 10,
    avgFats: Math.round(totals.fats / days * 10) / 10,
    mealsCount: meals.length
  }
}

/**
 * Copia pasti da un giorno ad un altro
 */
export async function copyMealsFromDay(
  userId: string,
  sourceDate: Date,
  targetDate: Date,
  mealTypes?: MealTypeDB[]
): Promise<number> {
  const sourceDiary = await getDailyDiary(userId, sourceDate)
  
  let copiedCount = 0
  
  for (const meal of sourceDiary.meals) {
    // Filtra per tipo pasto se specificato
    if (mealTypes && !mealTypes.includes(meal.meal_type)) {
      continue
    }

    await addMeal(userId, {
      food_id: meal.food_id,
      food_name: meal.food_name,
      quantity_grams: meal.quantity_grams,
      calories_per_100g: meal.total_calories * 100 / meal.quantity_grams,
      proteins_per_100g: meal.total_proteins * 100 / meal.quantity_grams,
      carbs_per_100g: meal.total_carbs * 100 / meal.quantity_grams,
      fats_per_100g: meal.total_fats * 100 / meal.quantity_grams,
      fiber_per_100g: (meal.total_fiber || 0) * 100 / meal.quantity_grams,
      meal_type: meal.meal_type,
      notes: meal.notes,
      source: meal.source
    }, targetDate)

    copiedCount++
  }

  return copiedCount
}

// Export tipi pasto per comodità
export { MEAL_TYPES, type MealTypeDB }
