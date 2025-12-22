/**
 * ============================================
 * TYPES - DEFINIZIONI TIPI TYPESCRIPT
 * ============================================
 * 
 * Tutti i tipi e interfacce dell'applicazione NutriFit
 * Basati sulla struttura dell'app Android originale
 */

// ============================================
// USER PROFILE TYPES
// ============================================

/** Genere utente */
export type Gender = 'M' | 'F' | 'O'

/** Obiettivo nutrizionale */
export type Goal = 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT'

/** Livello di attività fisica */
export type ActivityLevel = 'SEDENTARY' | 'ACTIVE'

/** Stile alimentare */
export type DietStyle = 'OMNIVORE' | 'VEGETARIAN' | 'VEGAN'

/** Tasso di variazione peso settimanale */
export type WeightChangeRate = 'RATE_025' | 'RATE_05' | 'RATE_075' | 'RATE_1'

/** Profilo utente completo */
export interface UserProfile {
  name: string
  age: number
  gender: Gender
  heightCm: number
  weightKg: number
  goal: Goal
  activityLevel: ActivityLevel
  dietStyle: DietStyle
  weightChangeRate: WeightChangeRate
  profileImageBase64?: string
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

// ============================================
// MEAL & FOOD TYPES
// ============================================

/** Tipo di pasto */
export type MealType = 
  | 'BREAKFAST' 
  | 'MORNING_SNACK' 
  | 'LUNCH' 
  | 'AFTERNOON_SNACK' 
  | 'DINNER' 
  | 'EXTRA_SNACKS'

/** Informazioni sul tipo di pasto */
export const MealTypeInfo: Record<MealType, { label: string; icon: string; order: number }> = {
  BREAKFAST: { label: 'Colazione', icon: '☕', order: 0 },
  MORNING_SNACK: { label: 'Spuntino Mattina', icon: '🍎', order: 1 },
  LUNCH: { label: 'Pranzo', icon: '🍝', order: 2 },
  AFTERNOON_SNACK: { label: 'Spuntino Pomeriggio', icon: '🥪', order: 3 },
  DINNER: { label: 'Cena', icon: '🍽️', order: 4 },
  EXTRA_SNACKS: { label: 'Extra', icon: '🍪', order: 5 },
}

/** Singolo alimento */
export interface FoodItem {
  id: string
  name: string
  calories: number // kcal per 100g
  protein: number // g per 100g
  carbs: number // g per 100g
  fat: number // g per 100g
  fiber: number // g per 100g
  quantity: number // grammi consumati
  source: 'local' | 'openfoodfacts' | 'manual'
  barcode?: string
}

/** Pasto con alimenti */
export interface Meal {
  id: string
  type: MealType
  date: string // formato YYYY-MM-DD
  foodItems: FoodItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  totalFiber: number
  createdAt: string
}

// ============================================
// PHYSICAL ACTIVITY TYPES
// ============================================

/** Attività fisica */
export interface PhysicalActivity {
  id: string
  name: string
  metValue: number // Metabolic Equivalent of Task
  durationMinutes: number
  caloriesBurned: number
  date: string // formato YYYY-MM-DD
  createdAt: string
}

/** Attività dal database */
export interface ActivityFromDB {
  metValue: number
  name: string
}

// ============================================
// WATER & STEPS TYPES
// ============================================

/** Dati idratazione giornaliera */
export interface WaterData {
  date: string
  glasses: number // bicchieri da 200ml
  totalMl: number
  goal: number // ml obiettivo
}

/** Dati passi giornalieri */
export interface StepsData {
  date: string
  steps: number
  goal: number
  caloriesBurned: number
}

// ============================================
// WEIGHT HISTORY TYPES
// ============================================

/** Registrazione peso */
export interface WeightEntry {
  id: string
  date: string
  weightKg: number
  note?: string
}

// ============================================
// AI CHAT TYPES
// ============================================

/** Messaggio chat */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

/** Conversazione */
export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

// ============================================
// DAILY DATA AGGREGATED
// ============================================

/** Dati giornalieri aggregati */
export interface DailyData {
  date: string
  meals: Meal[]
  activities: PhysicalActivity[]
  water: WaterData
  steps: StepsData
  caloriesConsumed: number
  caloriesBurned: number
  caloriesNet: number
}

// ============================================
// ONBOARDING TYPES
// ============================================

/** Step dell'onboarding */
export type OnboardingStep = 
  | 'NAME'
  | 'AGE'
  | 'HEIGHT'
  | 'WEIGHT'
  | 'GENDER'
  | 'GOAL'
  | 'ACTIVITY'
  | 'DIET'
  | 'WEIGHT_CHANGE_RATE'
  | 'TERMS'
  | 'WELCOME'

/** Configurazione step onboarding */
export const OnboardingSteps: OnboardingStep[] = [
  'NAME',
  'AGE', 
  'HEIGHT',
  'WEIGHT',
  'GENDER',
  'GOAL',
  'ACTIVITY',
  'DIET',
  'WEIGHT_CHANGE_RATE',
  'TERMS',
  'WELCOME'
]

// ============================================
// CALCULATION HELPERS - FORMULE MEDICHE VERIFICATE
// ============================================
// IMPORTANTE: Queste formule sono state sviluppate con la consulenza
// di un medico nutrizionista. NON modificare senza verifica medica.
// ============================================

/**
 * Calcola il BMI (Body Mass Index)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

/**
 * Normalizza il peso in base al BMI per il calcolo calorico.
 * FORMULA MEDICA VERIFICATA:
 * - Donne: se BMI > 23 → peso normalizzato = 23 × altezza²
 * - Uomini: se BMI > 25 → peso normalizzato = 25 × altezza²
 */
export function getNormalizedWeight(profile: UserProfile): number {
  const { gender, weightKg, heightCm } = profile
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  
  if (gender === 'F' && bmi > 23) {
    // Donne con BMI > 23: normalizza a BMI 23
    return 23 * (heightM * heightM)
  } else if (gender === 'M' && bmi > 25) {
    // Uomini con BMI > 25: normalizza a BMI 25
    return 25 * (heightM * heightM)
  }
  
  // Peso normale, usa il peso reale
  return weightKg
}

/**
 * Ottiene il moltiplicatore calorico in base a genere, attività e obiettivo.
 * TABELLA MEDICA VERIFICATA:
 * 
 *            SEDENTARIO              ATTIVO
 *            Perdere|Mantenere|Aumentare  Perdere|Mantenere|Aumentare
 * DONNA:       26   |   31    |   36        30   |   35    |   40
 * UOMO:        25   |   30    |   35        35   |   40    |   45
 */
export function getCalorieMultiplier(profile: UserProfile): number {
  const { gender, activityLevel, goal } = profile
  
  // DONNA SEDENTARIA
  if (gender === 'F' && activityLevel === 'SEDENTARY') {
    if (goal === 'LOSE_WEIGHT') return 26
    if (goal === 'MAINTAIN') return 31
    if (goal === 'GAIN_WEIGHT') return 36
  }
  
  // DONNA ATTIVA
  if (gender === 'F' && activityLevel === 'ACTIVE') {
    if (goal === 'LOSE_WEIGHT') return 30
    if (goal === 'MAINTAIN') return 35
    if (goal === 'GAIN_WEIGHT') return 40
  }
  
  // UOMO SEDENTARIO
  if (gender === 'M' && activityLevel === 'SEDENTARY') {
    if (goal === 'LOSE_WEIGHT') return 25
    if (goal === 'MAINTAIN') return 30
    if (goal === 'GAIN_WEIGHT') return 35
  }
  
  // UOMO ATTIVO
  if (gender === 'M' && activityLevel === 'ACTIVE') {
    if (goal === 'LOSE_WEIGHT') return 35
    if (goal === 'MAINTAIN') return 40
    if (goal === 'GAIN_WEIGHT') return 45
  }
  
  // Default per genere non specificato
  return 30
}

/**
 * Calcola il fabbisogno calorico giornaliero stimato.
 * FORMULA MEDICA VERIFICATA:
 * Calorie = (Peso normalizzato × Moltiplicatore) - 150
 * 
 * Il -150 compensa un pasto libero settimanale (circa 1000 kcal / 7 giorni)
 */
export function calculateDailyCalories(profile: UserProfile): number {
  const normalizedWeight = getNormalizedWeight(profile)
  const multiplier = getCalorieMultiplier(profile)
  
  // Formula: (Peso × moltiplicatore) - 150
  return Math.round((normalizedWeight * multiplier) - 150)
}

/**
 * Calcola il BMR (Metabolismo Basale) con formula Harris-Benedict.
 * Usato solo per visualizzazione, non per il calcolo dell'obiettivo calorico.
 */
export function calculateBMR(profile: UserProfile): number {
  const { gender, weightKg, heightCm, age } = profile
  
  switch (gender) {
    case 'M':
      return Math.round(88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age))
    case 'F':
      return Math.round(447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age))
    default:
      return Math.round(66.473 + (13.7516 * weightKg) + (5.0033 * heightCm) - (6.7550 * age))
  }
}

/**
 * Calcola il TDEE (Total Daily Energy Expenditure) con Harris-Benedict.
 * Usato solo per visualizzazione, non per il calcolo dell'obiettivo calorico.
 */
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  const multiplier = profile.activityLevel === 'ACTIVE' ? 1.55 : 1.2
  return Math.round(bmr * multiplier)
}

/**
 * Calcola l'obiettivo calorico giornaliero.
 * USA LE FORMULE MEDICHE VERIFICATE, non Harris-Benedict.
 */
export function calculateCalorieGoal(profile: UserProfile): number {
  return calculateDailyCalories(profile)
}

/**
 * Ottiene la categoria BMI
 */
export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Sottopeso', color: '#3B82F6' }
  if (bmi < 25) return { label: 'Normopeso', color: '#22C55E' }
  if (bmi < 30) return { label: 'Sovrappeso', color: '#F59E0B' }
  if (bmi < 35) return { label: 'Obesità I', color: '#EF4444' }
  if (bmi < 40) return { label: 'Obesità II', color: '#DC2626' }
  return { label: 'Obesità III', color: '#991B1B' }
}

/**
 * Calcola le calorie bruciate da attività fisica
 * Formula: Kcal = MET × Massa Magra (kg) × tempo (h)
 */
export function calculateActivityCalories(
  metValue: number,
  durationMinutes: number,
  profile: UserProfile
): number {
  const durationHours = durationMinutes / 60
  const { gender, weightKg, heightCm, age } = profile
  
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  
  // Calcola massa magra in base a genere, BMI ed età
  let leanMass: number
  
  if (gender === 'F') {
    if (bmi < 18) {
      leanMass = weightKg
    } else if (bmi > 23) {
      const normalizedWeight = 23 * heightM * heightM
      leanMass = normalizedWeight * (age < 40 ? 0.80 : 0.75)
    } else {
      leanMass = weightKg * (age < 40 ? 0.80 : 0.75)
    }
  } else {
    if (bmi < 18) {
      leanMass = weightKg
    } else if (bmi > 25) {
      const normalizedWeight = 25 * heightM * heightM
      leanMass = normalizedWeight * (age < 40 ? 0.85 : 0.80)
    } else {
      leanMass = weightKg * (age < 40 ? 0.85 : 0.80)
    }
  }
  
  return Math.round(metValue * leanMass * durationHours)
}

/**
 * Calcola le calorie bruciate dai passi
 * Approssimazione: 0.04 kcal per passo per kg di peso
 */
export function calculateStepsCalories(steps: number, weightKg: number): number {
  return Math.round(steps * 0.04 * (weightKg / 70))
}

/**
 * Genera un ID univoco
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Formatta una data in formato italiano
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
}

/**
 * Ottiene la data corrente in formato YYYY-MM-DD
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}
