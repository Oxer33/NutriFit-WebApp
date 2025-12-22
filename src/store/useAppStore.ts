/**
 * ============================================
 * APP STORE - ZUSTAND STATE MANAGEMENT
 * ============================================
 * 
 * Store principale dell'applicazione che gestisce:
 * - Profilo utente
 * - Dati diario alimentare
 * - Contapassi
 * - Idratazione
 * - Conversazioni AI
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  UserProfile as NewUserProfile,
  MealType,
  FoodItem as NewFoodItem,
  Meal as NewMeal,
  PhysicalActivity as NewPhysicalActivity
} from '@/types'

// =========== TYPES ===========
// Re-export types from @/types for compatibility
export type { UserProfile, MealType, FoodItem, Meal, PhysicalActivity } from '@/types'

// Store-specific DailyData type using new types
export interface DailyData {
  date: string
  meals: NewMeal[]
  activities: NewPhysicalActivity[]
  steps: number
  waterGlasses: number
  weight?: number
}

export interface WeightEntry {
  date: string
  weight: number
  note?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

// =========== STORE STATE ===========

interface AppState {
  // Profilo utente
  profile: NewUserProfile
  setProfile: (profile: NewUserProfile | Partial<NewUserProfile>) => void
  
  // Data selezionata nel calendario
  selectedDate: string
  setSelectedDate: (date: string) => void
  
  // Dati giornalieri
  dailyData: Record<string, DailyData>
  getDailyData: (date: string) => DailyData
  
  // Pasti
  addMeal: (meal: NewMeal) => void
  updateMeal: (mealId: string, meal: Partial<NewMeal>) => void
  deleteMeal: (date: string, mealId: string) => void
  addFoodToMeal: (date: string, mealId: string, food: NewFoodItem) => void
  removeFoodFromMeal: (date: string, mealId: string, foodId: string) => void
  
  // Attività fisica
  addActivity: (activity: NewPhysicalActivity) => void
  deleteActivity: (date: string, activityId: string) => void
  
  // Contapassi
  setSteps: (date: string, steps: number) => void
  addSteps: (date: string, stepsToAdd: number) => void
  
  // Idratazione
  addWaterGlass: (date: string) => void
  removeWaterGlass: (date: string) => void
  setWaterGlasses: (date: string, glasses: number) => void
  
  // Storico peso
  weightHistory: WeightEntry[]
  addWeightEntry: (entry: WeightEntry) => void
  deleteWeightEntry: (date: string) => void
  
  // Conversazioni AI
  conversations: Conversation[]
  currentConversationId: string | null
  addConversation: (conversation: Conversation) => void
  setCurrentConversation: (id: string | null) => void
  addMessageToConversation: (conversationId: string, message: ChatMessage) => void
  deleteConversation: (id: string) => void
  
  // Promemoria acqua
  waterReminderEnabled: boolean
  waterReminderInterval: number // minuti
  setWaterReminderEnabled: (enabled: boolean) => void
  setWaterReminderInterval: (minutes: number) => void
  
  // UI State
  isSplashVisible: boolean
  setSplashVisible: (visible: boolean) => void
}

// =========== HELPER FUNCTIONS ===========

const getTodayString = () => {
  return new Date().toISOString().split('T')[0]
}

const createEmptyDailyData = (date: string): DailyData => ({
  date,
  meals: [],
  activities: [],
  steps: 0,
  waterGlasses: 0,
})

const defaultProfile: NewUserProfile = {
  name: '',
  age: 30,
  gender: 'M',
  heightCm: 170,
  weightKg: 70,
  activityLevel: 'SEDENTARY',
  goal: 'MAINTAIN',
  dietStyle: 'OMNIVORE',
  weightChangeRate: 'RATE_05',
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// =========== CREATE STORE ===========

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ===== PROFILO =====
      profile: defaultProfile,
      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      // ===== DATA SELEZIONATA =====
      selectedDate: getTodayString(),
      setSelectedDate: (date) => set({ selectedDate: date }),

      // ===== DATI GIORNALIERI =====
      dailyData: {},
      getDailyData: (date) => {
        const data = get().dailyData[date]
        return data || createEmptyDailyData(date)
      },

      // ===== PASTI =====
      addMeal: (meal) =>
        set((state) => {
          const date = meal.date
          const existing = state.dailyData[date] || createEmptyDailyData(date)
          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...existing,
                meals: [...existing.meals, meal],
              },
            },
          }
        }),

      updateMeal: (mealId, updates) =>
        set((state) => {
          const newDailyData = { ...state.dailyData }
          for (const date in newDailyData) {
            const dayData = newDailyData[date]
            const mealIndex = dayData.meals.findIndex((m) => m.id === mealId)
            if (mealIndex !== -1) {
              dayData.meals[mealIndex] = { ...dayData.meals[mealIndex], ...updates }
              break
            }
          }
          return { dailyData: newDailyData }
        }),

      deleteMeal: (date, mealId) =>
        set((state) => {
          const existing = state.dailyData[date]
          if (!existing) return state
          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...existing,
                meals: existing.meals.filter((m) => m.id !== mealId),
              },
            },
          }
        }),

      addFoodToMeal: (date, mealId, food) =>
        set((state) => {
          const existing = state.dailyData[date]
          if (!existing) return state
          const meals = existing.meals.map((meal) => {
            if (meal.id !== mealId) return meal
            const foodItems = [...meal.foodItems, food]
            return {
              ...meal,
              foodItems,
              totalCalories: foodItems.reduce((sum: number, f: NewFoodItem) => sum + Math.round((f.calories * f.quantity) / 100), 0),
              totalProtein: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.protein * f.quantity) / 100, 0),
              totalCarbs: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.carbs * f.quantity) / 100, 0),
              totalFat: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.fat * f.quantity) / 100, 0),
              totalFiber: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.fiber * f.quantity) / 100, 0),
            }
          })
          return {
            dailyData: {
              ...state.dailyData,
              [date]: { ...existing, meals },
            },
          }
        }),

      removeFoodFromMeal: (date, mealId, foodId) =>
        set((state) => {
          const existing = state.dailyData[date]
          if (!existing) return state
          const meals = existing.meals.map((meal) => {
            if (meal.id !== mealId) return meal
            const foodItems = meal.foodItems.filter((f: NewFoodItem) => f.id !== foodId)
            return {
              ...meal,
              foodItems,
              totalCalories: foodItems.reduce((sum: number, f: NewFoodItem) => sum + Math.round((f.calories * f.quantity) / 100), 0),
              totalProtein: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.protein * f.quantity) / 100, 0),
              totalCarbs: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.carbs * f.quantity) / 100, 0),
              totalFat: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.fat * f.quantity) / 100, 0),
              totalFiber: foodItems.reduce((sum: number, f: NewFoodItem) => sum + (f.fiber * f.quantity) / 100, 0),
            }
          })
          return {
            dailyData: {
              ...state.dailyData,
              [date]: { ...existing, meals },
            },
          }
        }),

      // ===== ATTIVITÀ FISICA =====
      addActivity: (activity) =>
        set((state) => {
          const date = activity.date
          const existing = state.dailyData[date] || createEmptyDailyData(date)
          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...existing,
                activities: [...existing.activities, activity],
              },
            },
          }
        }),

      deleteActivity: (date, activityId) =>
        set((state) => {
          const existing = state.dailyData[date]
          if (!existing) return state
          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...existing,
                activities: existing.activities.filter((a) => a.id !== activityId),
              },
            },
          }
        }),

      // ===== CONTAPASSI =====
      setSteps: (date, steps) =>
        set((state) => {
          const existing = state.dailyData[date] || createEmptyDailyData(date)
          return {
            dailyData: {
              ...state.dailyData,
              [date]: { ...existing, steps },
            },
          }
        }),

      addSteps: (date, stepsToAdd) =>
        set((state) => {
          const existing = state.dailyData[date] || createEmptyDailyData(date)
          return {
            dailyData: {
              ...state.dailyData,
              [date]: { ...existing, steps: existing.steps + stepsToAdd },
            },
          }
        }),

      // ===== IDRATAZIONE =====
      addWaterGlass: (date) =>
        set((state) => {
          const existing = state.dailyData[date] || createEmptyDailyData(date)
          return {
            dailyData: {
              ...state.dailyData,
              [date]: { ...existing, waterGlasses: existing.waterGlasses + 1 },
            },
          }
        }),

      removeWaterGlass: (date) =>
        set((state) => {
          const existing = state.dailyData[date] || createEmptyDailyData(date)
          return {
            dailyData: {
              ...state.dailyData,
              [date]: {
                ...existing,
                waterGlasses: Math.max(0, existing.waterGlasses - 1),
              },
            },
          }
        }),

      setWaterGlasses: (date, glasses) =>
        set((state) => {
          const existing = state.dailyData[date] || createEmptyDailyData(date)
          return {
            dailyData: {
              ...state.dailyData,
              [date]: { ...existing, waterGlasses: glasses },
            },
          }
        }),

      // ===== STORICO PESO =====
      weightHistory: [],
      addWeightEntry: (entry) =>
        set((state) => ({
          weightHistory: [
            ...state.weightHistory.filter((e) => e.date !== entry.date),
            entry,
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        })),

      deleteWeightEntry: (date) =>
        set((state) => ({
          weightHistory: state.weightHistory.filter((e) => e.date !== date),
        })),

      // ===== CONVERSAZIONI AI =====
      conversations: [],
      currentConversationId: null,

      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: conversation.id,
        })),

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      addMessageToConversation: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: Date.now(),
                }
              : conv
          ),
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        })),

      // ===== PROMEMORIA ACQUA =====
      waterReminderEnabled: false,
      waterReminderInterval: 60,
      setWaterReminderEnabled: (enabled) => set({ waterReminderEnabled: enabled }),
      setWaterReminderInterval: (minutes) => set({ waterReminderInterval: minutes }),

      // ===== UI STATE =====
      isSplashVisible: true,
      setSplashVisible: (visible) => set({ isSplashVisible: visible }),
    }),
    {
      name: 'nutrifit-storage',
      partialize: (state) => ({
        profile: state.profile,
        dailyData: state.dailyData,
        weightHistory: state.weightHistory,
        conversations: state.conversations,
        waterReminderEnabled: state.waterReminderEnabled,
        waterReminderInterval: state.waterReminderInterval,
      }),
    }
  )
)
