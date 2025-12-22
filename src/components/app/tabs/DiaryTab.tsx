'use client'

/**
 * ============================================
 * DIARY TAB - DIARIO ALIMENTARE AVANZATO
 * ============================================
 * 
 * Tab principale con:
 * - Navigazione date
 * - Contatore calorie con progress circolare
 * - 6 tipi di pasto (come app Android)
 * - Tracker acqua interattivo
 * - Contapassi con calcolo calorie
 * - Attività fisiche del giorno
 * - Macronutrienti breakdown
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Minus,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Apple,
  Sandwich,
  Droplets,
  Footprints,
  Flame,
  Target,
  Activity,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Trash2
} from 'lucide-react'
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns'
import { it } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { 
  MealType, 
  MealTypeInfo, 
  type FoodItem,
  type Meal,
  calculateCalorieGoal,
  calculateStepsCalories,
  getTodayDate
} from '@/types'
import { AddFoodModal } from '@/components/app/AddFoodModal'
import { AddActivityModal } from '@/components/app/AddActivityModal'
import { CopyMealsDialog } from '@/components/app/CopyMealsDialog'
import { SaveMealsDialog } from '@/components/app/SaveMealsDialog'
import { CalorieGauge } from '@/components/app/CalorieGauge'
import { MacroCircles } from '@/components/app/MacroGauge'

// =========== TYPES ===========

interface MealCardProps {
  type: MealType
  meals: Meal[]
  onAddFood: (type: MealType) => void
  onRemoveFood?: (mealId: string, foodId: string) => void
}

// =========== MEAL TYPE CONFIG ===========

const MEAL_CONFIGS: Record<MealType, { 
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  iconColor: string
}> = {
  BREAKFAST: { icon: Coffee, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
  MORNING_SNACK: { icon: Apple, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  LUNCH: { icon: Sun, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  AFTERNOON_SNACK: { icon: Sandwich, bgColor: 'bg-teal-100', iconColor: 'text-teal-600' },
  DINNER: { icon: Moon, bgColor: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  EXTRA_SNACKS: { icon: Cookie, bgColor: 'bg-pink-100', iconColor: 'text-pink-600' },
}

// =========== COMPONENT ===========

export function DiaryTab() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddFoodModal, setShowAddFoodModal] = useState(false)
  const [showAddActivityModal, setShowAddActivityModal] = useState(false)
  const [showCopyMealsDialog, setShowCopyMealsDialog] = useState(false)
  const [showSaveMealsDialog, setShowSaveMealsDialog] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null)
  
  // Store
  const { 
    profile, 
    getDailyData, 
    addWaterGlass, 
    removeWaterGlass,
    setSteps,
    removeFoodFromMeal,
    deleteActivity
  } = useAppStore()
  
  // Data for selected date
  const dateString = format(selectedDate, 'yyyy-MM-dd')
  const dailyData = getDailyData(dateString)
  
  // Calcola calorie obiettivo
  const targetCalories = useMemo(() => {
    if (profile.onboardingCompleted) {
      return calculateCalorieGoal(profile)
    }
    return 2000
  }, [profile])
  
  // Calcola calorie consumate da tutti i pasti
  const consumedCalories = useMemo(() => {
    return dailyData.meals.reduce((total, meal) => total + meal.totalCalories, 0)
  }, [dailyData.meals])
  
  // Calcola calorie bruciate (attività + passi)
  const burnedCalories = useMemo(() => {
    const activityCals = dailyData.activities.reduce((total, act) => total + act.caloriesBurned, 0)
    const stepCals = calculateStepsCalories(dailyData.steps, profile.weightKg || 70)
    return activityCals + stepCals
  }, [dailyData.activities, dailyData.steps, profile.weightKg])
  
  const remainingCalories = targetCalories - consumedCalories + burnedCalories
  const calorieProgress = (consumedCalories / targetCalories) * 100
  
  // Calcola macronutrienti totali
  const totalMacros = useMemo(() => {
    return dailyData.meals.reduce((acc, meal) => ({
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat
    }), { protein: 0, carbs: 0, fat: 0 })
  }, [dailyData.meals])
  
  // Target macros (basati su TDEE)
  const macroTargets = useMemo(() => ({
    protein: Math.round((targetCalories * 0.25) / 4), // 25% proteine
    carbs: Math.round((targetCalories * 0.50) / 4),   // 50% carboidrati  
    fat: Math.round((targetCalories * 0.25) / 9)      // 25% grassi
  }), [targetCalories])
  
  // Controlla eccessi macro (>120% del target)
  const macroExcesses = useMemo(() => {
    const excesses: { macro: string; percentage: number; label: string }[] = []
    
    const proteinPct = (totalMacros.protein / macroTargets.protein) * 100
    const carbsPct = (totalMacros.carbs / macroTargets.carbs) * 100
    const fatPct = (totalMacros.fat / macroTargets.fat) * 100
    
    if (proteinPct > 120) excesses.push({ macro: 'protein', percentage: Math.round(proteinPct), label: 'Proteine' })
    if (carbsPct > 120) excesses.push({ macro: 'carbs', percentage: Math.round(carbsPct), label: 'Carboidrati' })
    if (fatPct > 120) excesses.push({ macro: 'fat', percentage: Math.round(fatPct), label: 'Grassi' })
    
    return excesses
  }, [totalMacros, macroTargets])

  const goToPreviousDay = () => setSelectedDate(prev => subDays(prev, 1))
  const goToNextDay = () => setSelectedDate(prev => addDays(prev, 1))
  const goToToday = () => setSelectedDate(new Date())

  // Filtra pasti per tipo
  const getMealsForType = (type: MealType): Meal[] => {
    return dailyData.meals.filter(meal => meal.type === type)
  }

  // Apri modal per aggiungere cibo
  const handleAddFood = (type: MealType) => {
    setSelectedMealType(type)
    setShowAddFoodModal(true)
  }

  // Water handlers
  const handleAddWater = () => addWaterGlass(dateString)
  const handleRemoveWater = () => removeWaterGlass(dateString)

  return (
    <div className="space-y-6">
      {/* Date Navigator */}
      <motion.div 
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <button 
            onClick={goToToday}
            className="text-center hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
          >
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {isToday(selectedDate) ? 'Oggi' : format(selectedDate, 'EEEE', { locale: it })}
            </p>
            <p className="text-sm text-gray-500">
              {format(selectedDate, 'd MMMM yyyy', { locale: it })}
            </p>
          </button>
          
          <button
            onClick={goToNextDay}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Calorie Summary Card */}
      <motion.div 
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Obiettivo</p>
            <p className="text-2xl font-bold text-gray-900">{targetCalories}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Consumate</p>
            <p className="text-2xl font-bold text-primary">{consumedCalories}</p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rimanenti</p>
            <p className={cn(
              "text-2xl font-bold",
              remainingCalories >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {remainingCalories}
            </p>
            <p className="text-xs text-gray-400">kcal</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              calorieProgress <= 100 
                ? "bg-gradient-to-r from-primary to-primary-dark" 
                : "bg-gradient-to-r from-red-400 to-red-500"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          {Math.round(calorieProgress)}% del tuo obiettivo giornaliero
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Bruciate</p>
              <p className="font-semibold text-gray-900">{burnedCalories} kcal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <Target className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Bilancio</p>
              <p className={cn(
                "font-semibold",
                remainingCalories >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {remainingCalories >= 0 ? '+' : ''}{remainingCalories} kcal
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Macronutrients Summary */}
      <motion.div 
        className="glass-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">Macronutrienti</h3>
        <MacroCircles data={{
          protein: { current: totalMacros.protein, target: macroTargets.protein },
          carbs: { current: totalMacros.carbs, target: macroTargets.carbs },
          fat: { current: totalMacros.fat, target: macroTargets.fat }
        }} />
        
        {/* Avviso eccesso macro */}
        {macroExcesses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-sm font-medium text-red-700">
                  Attenzione: stai esagerando con
                </p>
                <ul className="text-xs text-red-600 mt-1">
                  {macroExcesses.map(exc => (
                    <li key={exc.macro}>
                      <strong>{exc.label}</strong>: {exc.percentage}% del target
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 6 Meal Cards - Grid Layout */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-semibold text-gray-900">Pasti del giorno</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCopyMealsDialog(true)}
              className="text-xs px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              📋 Copia
            </button>
            <button
              onClick={() => setShowSaveMealsDialog(true)}
              className="text-xs px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
            >
              💾 Salva
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(MealTypeInfo) as MealType[]).map((type, index) => (
            <MealCard
              key={type}
              type={type}
              meals={getMealsForType(type)}
              onAddFood={handleAddFood}
              onRemoveFood={(mealId, foodId) => removeFoodFromMeal(dateString, mealId, foodId)}
            />
          ))}
        </div>
      </div>

      {/* Water & Steps Trackers */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Water Tracker */}
        <motion.div 
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-xl">
                <Droplets className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Idratazione</h3>
                <p className="text-sm text-gray-500">
                  {dailyData.waterGlasses} / 8 bicchieri ({dailyData.waterGlasses * 200}ml)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleRemoveWater}
                disabled={dailyData.waterGlasses === 0}
                className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={handleAddWater}
                className="p-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  'flex-1 h-8 rounded-lg transition-colors cursor-pointer',
                  i < dailyData.waterGlasses ? 'bg-cyan-400' : 'bg-gray-100 hover:bg-cyan-100'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Click to set water to that level
                  const newLevel = i + 1
                  if (newLevel > dailyData.waterGlasses) {
                    for (let j = dailyData.waterGlasses; j < newLevel; j++) {
                      addWaterGlass(dateString)
                    }
                  }
                }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Clicca per aggiungere bicchieri • Obiettivo: 1.6L
          </p>
        </motion.div>

        {/* Step Counter */}
        <motion.div 
          className="glass-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Footprints className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Passi</h3>
                <p className="text-sm text-gray-500">
                  {dailyData.steps.toLocaleString('it-IT')} / 10.000
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                const steps = prompt('Inserisci il numero di passi:', String(dailyData.steps))
                if (steps && !isNaN(parseInt(steps))) {
                  setSteps(dateString, parseInt(steps))
                }
              }}
              className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dailyData.steps / 10000) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            ~{calculateStepsCalories(dailyData.steps, profile.weightKg || 70)} kcal bruciate camminando
          </p>
        </motion.div>
      </div>

      {/* Activities Section */}
      <motion.div 
        className="glass-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Attività fisiche</h3>
              <p className="text-sm text-gray-500">
                {dailyData.activities.length > 0 
                  ? `${dailyData.activities.reduce((sum, a) => sum + a.caloriesBurned, 0)} kcal bruciate`
                  : 'Nessuna attività registrata'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddActivityModal(true)}
            className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {dailyData.activities.length > 0 ? (
          <div className="space-y-2">
            {dailyData.activities.map((activity, index) => (
              <div key={activity.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group">
                <div>
                  <p className="font-medium text-gray-900">{activity.name}</p>
                  <p className="text-sm text-gray-500">{activity.durationMinutes} min</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-orange-500">-{activity.caloriesBurned} kcal</span>
                  <button
                    onClick={() => deleteActivity(dateString, activity.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aggiungi la tua prima attività</p>
            <button 
              onClick={() => setShowAddActivityModal(true)}
              className="mt-2 text-purple-500 text-sm font-medium hover:underline"
            >
              + Registra attività
            </button>
          </div>
        )}
      </motion.div>
      
      {/* Add Food Modal */}
      {selectedMealType && (
        <AddFoodModal
          isOpen={showAddFoodModal}
          onClose={() => {
            setShowAddFoodModal(false)
            setSelectedMealType(null)
          }}
          mealType={selectedMealType}
          date={dateString}
        />
      )}
      
      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        date={dateString}
      />
      
      {/* Copy Meals Dialog */}
      <CopyMealsDialog
        isOpen={showCopyMealsDialog}
        onClose={() => setShowCopyMealsDialog(false)}
        targetDate={dateString}
        onMealsCopied={() => {
          // Refresh avviene automaticamente tramite store
        }}
      />
      
      {/* Save Meals Dialog */}
      <SaveMealsDialog
        isOpen={showSaveMealsDialog}
        onClose={() => setShowSaveMealsDialog(false)}
        sourceDate={dateString}
        onMealsSaved={() => {
          // Notifica salvato
        }}
      />
    </div>
  )
}

// =========== MEAL CARD COMPONENT ===========

function MealCard({ type, meals, onAddFood, onRemoveFood }: MealCardProps) {
  const config = MEAL_CONFIGS[type]
  const info = MealTypeInfo[type]
  const Icon = config.icon
  
  // Calcola totale calorie per questo tipo di pasto
  const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0)
  
  // Ottieni tutti gli alimenti da tutti i pasti di questo tipo con riferimento al meal
  const allFoodItems = meals.flatMap(meal => 
    meal.foodItems.map(food => ({ ...food, mealId: meal.id }))
  )
  const isEmpty = allFoodItems.length === 0

  return (
    <motion.div
      className="glass-card p-4 group hover:shadow-soft-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-xl', config.bgColor)}>
            <Icon className={cn('w-5 h-5', config.iconColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{info.label}</h3>
            <p className="text-xs text-gray-500">{totalCalories} kcal</p>
          </div>
        </div>
        <button 
          onClick={() => onAddFood(type)}
          className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="text-center py-3 text-gray-400">
          <p className="text-xs mb-1">Nessun alimento</p>
          <button 
            onClick={() => onAddFood(type)}
            className="text-primary text-xs font-medium hover:underline"
          >
            + Aggiungi
          </button>
        </div>
      ) : (
        <ul className="space-y-1.5 max-h-32 overflow-y-auto">
          {allFoodItems.slice(0, 4).map((food, index) => (
            <li key={food.id || index} className="flex items-center justify-between text-xs group/item">
              <div className="flex items-center gap-2 text-gray-600 truncate">
                <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                <span className="truncate">{food.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 flex-shrink-0">
                  {Math.round((food.calories * food.quantity) / 100)} kcal
                </span>
                {onRemoveFood && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveFood(food.mealId, food.id) }}
                    className="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </li>
          ))}
          {allFoodItems.length > 4 && (
            <li className="text-xs text-gray-400 text-center pt-1">
              +{allFoodItems.length - 4} altri alimenti
            </li>
          )}
        </ul>
      )}
    </motion.div>
  )
}
