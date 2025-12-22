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
// CALCULATION HELPERS
// ============================================

/**
 * Calcola il BMR (Metabolismo Basale) con formula Harris-Benedict
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
 * Calcola il TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile)
  const multiplier = profile.activityLevel === 'ACTIVE' ? 1.55 : 1.2
  return Math.round(bmr * multiplier)
}

/**
 * Calcola l'obiettivo calorico giornaliero
 */
export function calculateCalorieGoal(profile: UserProfile): number {
  const tdee = calculateTDEE(profile)
  
  // Calcola il deficit/surplus in base al tasso di variazione
  const weeklyChangeKg = {
    'RATE_025': 0.25,
    'RATE_05': 0.5,
    'RATE_075': 0.75,
    'RATE_1': 1.0
  }[profile.weightChangeRate]
  
  // 1 kg di grasso = ~7700 kcal
  const dailyChange = (weeklyChangeKg * 7700) / 7
  
  switch (profile.goal) {
    case 'LOSE_WEIGHT':
      return Math.round(tdee - dailyChange)
    case 'GAIN_WEIGHT':
      return Math.round(tdee + dailyChange)
    default:
      return tdee
  }
}

/**
 * Calcola il BMI
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
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
