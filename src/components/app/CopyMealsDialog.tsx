'use client'

/**
 * ============================================
 * COPY MEALS DIALOG - COPIA PASTI DA ALTRO GIORNO
 * ============================================
 * 
 * Dialog per copiare i pasti da un giorno precedente
 * al giorno corrente selezionato.
 * Replica la funzionalità CopyMealsDialog dell'app Android.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Copy, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Utensils
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { format, subDays, isSameDay } from 'date-fns'
import { it } from 'date-fns/locale'
import { MealTypeInfo, type MealType, type Meal, type FoodItem } from '@/types'

// =========== PROPS ===========

interface CopyMealsDialogProps {
  isOpen: boolean
  onClose: () => void
  targetDate: string // Data di destinazione (formato yyyy-MM-dd)
  onMealsCopied: () => void // Callback quando i pasti sono stati copiati
}

// =========== COMPONENT ===========

export function CopyMealsDialog({ 
  isOpen, 
  onClose, 
  targetDate,
  onMealsCopied 
}: CopyMealsDialogProps) {
  // Store
  const { getDailyData, addMeal } = useAppStore()
  
  // State per la data sorgente selezionata
  const [selectedSourceDate, setSelectedSourceDate] = useState<string | null>(null)
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([])
  const [step, setStep] = useState<'selectDate' | 'selectMeals'>('selectDate')
  
  // Genera lista degli ultimi 14 giorni (escludendo la data target)
  const availableDates = useMemo(() => {
    const dates: { date: string; label: string; hasMeals: boolean; totalCalories: number }[] = []
    const target = new Date(targetDate)
    
    for (let i = 1; i <= 14; i++) {
      const date = subDays(target, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayData = getDailyData(dateStr)
      const totalCalories = dayData.meals.reduce((sum, m) => sum + m.totalCalories, 0)
      const hasMeals = dayData.meals.some(m => m.foodItems.length > 0)
      
      dates.push({
        date: dateStr,
        label: format(date, 'EEEE d MMMM', { locale: it }),
        hasMeals,
        totalCalories
      })
    }
    
    return dates
  }, [targetDate, getDailyData])
  
  // Pasti della data sorgente selezionata
  const sourceMeals = useMemo(() => {
    if (!selectedSourceDate) return []
    const dayData = getDailyData(selectedSourceDate)
    return dayData.meals.filter(m => m.foodItems.length > 0)
  }, [selectedSourceDate, getDailyData])
  
  // Toggle selezione tipo pasto
  const toggleMealType = (type: MealType) => {
    setSelectedMealTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }
  
  // Seleziona tutti i pasti
  const selectAllMeals = () => {
    setSelectedMealTypes(sourceMeals.map(m => m.type))
  }
  
  // Copia i pasti selezionati
  const handleCopyMeals = () => {
    if (!selectedSourceDate || selectedMealTypes.length === 0) return
    
    const sourceData = getDailyData(selectedSourceDate)
    
    // Per ogni tipo di pasto selezionato, copia i dati
    selectedMealTypes.forEach(mealType => {
      const sourceMeal = sourceData.meals.find(m => m.type === mealType)
      if (sourceMeal && sourceMeal.foodItems.length > 0) {
        // Crea nuovo pasto con la data target
        const newMeal: Meal = {
          id: `${targetDate}-${mealType}-${Date.now()}`,
          type: mealType,
          date: targetDate,
          foodItems: sourceMeal.foodItems.map(item => ({
            ...item,
            id: `${item.id}-copy-${Date.now()}`
          })),
          totalCalories: sourceMeal.totalCalories,
          totalProtein: sourceMeal.totalProtein,
          totalCarbs: sourceMeal.totalCarbs,
          totalFat: sourceMeal.totalFat,
          totalFiber: sourceMeal.totalFiber,
          createdAt: new Date().toISOString()
        }
        
        addMeal(newMeal)
      }
    })
    
    // Callback e chiudi
    onMealsCopied()
    handleClose()
  }
  
  // Reset e chiudi
  const handleClose = () => {
    setSelectedSourceDate(null)
    setSelectedMealTypes([])
    setStep('selectDate')
    onClose()
  }
  
  // Passa allo step successivo
  const handleSelectDate = (date: string) => {
    setSelectedSourceDate(date)
    setStep('selectMeals')
  }
  
  // Torna indietro
  const handleBack = () => {
    setStep('selectDate')
    setSelectedMealTypes([])
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {step === 'selectMeals' && (
                <button 
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <div className="p-2 bg-primary/10 rounded-xl">
                <Copy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Copia Pasti</h2>
                <p className="text-xs text-gray-500">
                  {step === 'selectDate' 
                    ? 'Seleziona il giorno da copiare'
                    : 'Seleziona i pasti da copiare'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {step === 'selectDate' ? (
              /* Step 1: Selezione data */
              <div className="space-y-2">
                {availableDates.map(({ date, label, hasMeals, totalCalories }) => (
                  <button
                    key={date}
                    onClick={() => hasMeals && handleSelectDate(date)}
                    disabled={!hasMeals}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-left",
                      hasMeals 
                        ? "border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer"
                        : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className={cn(
                          "w-5 h-5",
                          hasMeals ? "text-primary" : "text-gray-400"
                        )} />
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{label}</p>
                          <p className="text-xs text-gray-500">
                            {hasMeals 
                              ? `${totalCalories} kcal registrate`
                              : 'Nessun pasto registrato'
                            }
                          </p>
                        </div>
                      </div>
                      {hasMeals && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Step 2: Selezione pasti */
              <div className="space-y-3">
                {/* Pulsante seleziona tutti */}
                <button
                  onClick={selectAllMeals}
                  className="w-full p-3 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-colors"
                >
                  Seleziona tutti i pasti
                </button>
                
                {/* Lista pasti */}
                {sourceMeals.map(meal => {
                  const mealInfo = MealTypeInfo[meal.type]
                  const isSelected = selectedMealTypes.includes(meal.type)
                  
                  return (
                    <button
                      key={meal.type}
                      onClick={() => toggleMealType(meal.type)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all text-left",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{mealInfo.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{mealInfo.label}</p>
                            <p className="text-xs text-gray-500">
                              {meal.foodItems.length} alimenti • {meal.totalCalories} kcal
                            </p>
                          </div>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        )}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      
                      {/* Preview alimenti */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {meal.foodItems.slice(0, 3).map((item, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {item.name}
                          </span>
                        ))}
                        {meal.foodItems.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{meal.foodItems.length - 3} altri
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {step === 'selectMeals' && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleCopyMeals}
                disabled={selectedMealTypes.length === 0}
                className={cn(
                  "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                  selectedMealTypes.length > 0
                    ? "bg-primary text-white hover:bg-primary-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                <Copy className="w-5 h-5" />
                Copia {selectedMealTypes.length} pasti
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
