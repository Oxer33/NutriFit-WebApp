'use client'

/**
 * ============================================
 * SAVE MEALS DIALOG - SALVA PASTI COME TEMPLATE
 * ============================================
 * 
 * Dialog per salvare i pasti del giorno corrente
 * come template riutilizzabile.
 * Replica la funzionalità SaveMealsDialog dell'app Android.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Save,
  Check,
  Bookmark,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { MealTypeInfo, type MealType, type Meal } from '@/types'

// =========== TYPES ===========

export interface SavedMealPlan {
  id: string
  name: string
  description?: string
  meals: Meal[]
  totalCalories: number
  createdAt: string
}

// =========== PROPS ===========

interface SaveMealsDialogProps {
  isOpen: boolean
  onClose: () => void
  sourceDate: string // Data da cui salvare i pasti (formato yyyy-MM-dd)
  onMealsSaved: () => void // Callback quando i pasti sono stati salvati
}

// =========== COMPONENT ===========

export function SaveMealsDialog({ 
  isOpen, 
  onClose, 
  sourceDate,
  onMealsSaved 
}: SaveMealsDialogProps) {
  // Store
  const { getDailyData } = useAppStore()
  
  // State
  const [planName, setPlanName] = useState('')
  const [planDescription, setPlanDescription] = useState('')
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([])
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrifit_saved_meal_plans')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [showSavedPlans, setShowSavedPlans] = useState(false)
  
  // Pasti della data sorgente
  const sourceMeals = useMemo(() => {
    const dayData = getDailyData(sourceDate)
    return dayData.meals.filter(m => m.foodItems.length > 0)
  }, [sourceDate, getDailyData])
  
  // Calorie totali dei pasti selezionati
  const selectedCalories = useMemo(() => {
    return sourceMeals
      .filter(m => selectedMealTypes.includes(m.type))
      .reduce((sum, m) => sum + m.totalCalories, 0)
  }, [sourceMeals, selectedMealTypes])
  
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
  
  // Salva il piano pasti
  const handleSavePlan = () => {
    if (!planName.trim() || selectedMealTypes.length === 0) return
    
    const mealsToSave = sourceMeals.filter(m => selectedMealTypes.includes(m.type))
    
    const newPlan: SavedMealPlan = {
      id: `plan-${Date.now()}`,
      name: planName.trim(),
      description: planDescription.trim() || undefined,
      meals: mealsToSave,
      totalCalories: selectedCalories,
      createdAt: new Date().toISOString()
    }
    
    const updatedPlans = [...savedPlans, newPlan]
    setSavedPlans(updatedPlans)
    
    // Salva in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_saved_meal_plans', JSON.stringify(updatedPlans))
    }
    
    // Callback e chiudi
    onMealsSaved()
    handleClose()
  }
  
  // Elimina un piano salvato
  const handleDeletePlan = (planId: string) => {
    const updatedPlans = savedPlans.filter(p => p.id !== planId)
    setSavedPlans(updatedPlans)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_saved_meal_plans', JSON.stringify(updatedPlans))
    }
  }
  
  // Reset e chiudi
  const handleClose = () => {
    setPlanName('')
    setPlanDescription('')
    setSelectedMealTypes([])
    setShowSavedPlans(false)
    onClose()
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
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Save className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {showSavedPlans ? 'Piani Salvati' : 'Salva Pasti'}
                </h2>
                <p className="text-xs text-gray-500">
                  {showSavedPlans 
                    ? `${savedPlans.length} piani salvati`
                    : format(new Date(sourceDate), 'd MMMM yyyy', { locale: it })
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSavedPlans(!showSavedPlans)}
                className={cn(
                  "p-2 rounded-xl transition-colors",
                  showSavedPlans 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100 text-gray-500"
                )}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[55vh]">
            {showSavedPlans ? (
              /* Lista piani salvati */
              <div className="space-y-3">
                {savedPlans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nessun piano salvato</p>
                    <p className="text-sm">Salva i tuoi pasti preferiti per riutilizzarli</p>
                  </div>
                ) : (
                  savedPlans.map(plan => (
                    <div
                      key={plan.id}
                      className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{plan.name}</h3>
                          {plan.description && (
                            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {plan.totalCalories} kcal
                            </span>
                            <span className="text-xs text-gray-400">
                              {plan.meals.length} pasti
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Preview pasti */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {plan.meals.map(meal => (
                          <span 
                            key={meal.type}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {MealTypeInfo[meal.type].icon} {MealTypeInfo[meal.type].label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Form salvataggio */
              <div className="space-y-4">
                {/* Nome piano */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome del piano *
                  </label>
                  <input
                    type="text"
                    value={planName}
                    onChange={e => setPlanName(e.target.value)}
                    placeholder="es. Giornata tipo, Menu settimana..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                
                {/* Descrizione */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrizione (opzionale)
                  </label>
                  <textarea
                    value={planDescription}
                    onChange={e => setPlanDescription(e.target.value)}
                    placeholder="Aggiungi una nota..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
                
                {/* Selezione pasti */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Pasti da salvare
                    </label>
                    <button
                      onClick={selectAllMeals}
                      className="text-xs text-primary hover:underline"
                    >
                      Seleziona tutti
                    </button>
                  </div>
                  
                  {sourceMeals.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nessun pasto registrato per questa data
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {sourceMeals.map(meal => {
                        const mealInfo = MealTypeInfo[meal.type]
                        const isSelected = selectedMealTypes.includes(meal.type)
                        
                        return (
                          <button
                            key={meal.type}
                            onClick={() => toggleMealType(meal.type)}
                            className={cn(
                              "w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{mealInfo.icon}</span>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{mealInfo.label}</p>
                                <p className="text-xs text-gray-500">
                                  {meal.foodItems.length} alimenti • {meal.totalCalories} kcal
                                </p>
                              </div>
                            </div>
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-gray-300"
                            )}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
                
                {/* Riepilogo calorie */}
                {selectedMealTypes.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-500">Totale calorie selezionate</p>
                    <p className="text-2xl font-bold text-primary">{selectedCalories} kcal</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!showSavedPlans && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleSavePlan}
                disabled={!planName.trim() || selectedMealTypes.length === 0}
                className={cn(
                  "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                  planName.trim() && selectedMealTypes.length > 0
                    ? "bg-primary text-white hover:bg-primary-600"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                <Save className="w-5 h-5" />
                Salva Piano
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
