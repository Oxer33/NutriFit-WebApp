'use client'

/**
 * ============================================
 * ADD FOOD MODAL - Aggiunta Alimenti al Diario
 * ============================================
 * 
 * Modal per:
 * - Ricerca alimenti nel database locale
 * - Selezione quantità in grammi
 * - Visualizzazione valori nutrizionali
 * - Aggiunta al pasto selezionato
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Search, 
  Plus, 
  Minus,
  Utensils,
  Flame,
  Apple,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { searchFoods, type FoodFromDB } from '@/data/foodDatabase'
import { 
  type MealType, 
  type FoodItem,
  type Meal,
  MealTypeInfo,
  generateId 
} from '@/types'

// =========== PROPS ===========

interface AddFoodModalProps {
  isOpen: boolean
  onClose: () => void
  mealType: MealType
  date: string
}

// =========== COMPONENT ===========

export function AddFoodModal({ isOpen, onClose, mealType, date }: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState<FoodFromDB | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [isAdding, setIsAdding] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Store
  const { addMeal, getDailyData } = useAppStore()
  
  // Cerca alimenti
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return []
    return searchFoods(searchQuery, 15)
  }, [searchQuery])
  
  // Calcola valori nutrizionali per la quantità selezionata
  const nutritionalValues = useMemo(() => {
    if (!selectedFood) return null
    const multiplier = quantity / 100
    return {
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
      fiber: Math.round(selectedFood.fiber * multiplier * 10) / 10,
    }
  }, [selectedFood, quantity])
  
  // Focus su input quando si apre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen])
  
  // Reset quando si chiude
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSelectedFood(null)
      setQuantity(100)
    }
  }, [isOpen])
  
  // Gestione quantità
  const incrementQuantity = () => setQuantity(q => Math.min(q + 10, 1000))
  const decrementQuantity = () => setQuantity(q => Math.max(q - 10, 10))
  
  // Aggiungi alimento al pasto
  const handleAddFood = useCallback(async () => {
    if (!selectedFood || !nutritionalValues) return
    
    setIsAdding(true)
    
    // Crea FoodItem
    const foodItem: FoodItem = {
      id: generateId(),
      name: selectedFood.name,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      fiber: selectedFood.fiber,
      quantity: quantity,
      source: 'local'
    }
    
    // Ottieni i pasti esistenti per questo tipo e data
    const dailyData = getDailyData(date)
    const existingMeal = dailyData.meals.find(m => m.type === mealType)
    
    if (existingMeal) {
      // Aggiungi al pasto esistente - per ora creiamo un nuovo pasto
      // In futuro si potrebbe aggiornare il pasto esistente
    }
    
    // Crea nuovo pasto con l'alimento
    const newMeal: Meal = {
      id: generateId(),
      type: mealType,
      date: date,
      foodItems: [foodItem],
      totalCalories: nutritionalValues.calories,
      totalProtein: nutritionalValues.protein,
      totalCarbs: nutritionalValues.carbs,
      totalFat: nutritionalValues.fat,
      totalFiber: nutritionalValues.fiber,
      createdAt: new Date().toISOString()
    }
    
    // Aggiungi allo store
    addMeal(newMeal)
    
    // Feedback visivo
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 300)
  }, [selectedFood, nutritionalValues, quantity, mealType, date, addMeal, getDailyData, onClose])
  
  // Seleziona alimento dalla ricerca
  const handleSelectFood = (food: FoodFromDB) => {
    setSelectedFood(food)
    setSearchQuery('')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Aggiungi alimento</h2>
                  <p className="text-sm text-gray-500">{MealTypeInfo[mealType].label}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-gray-100 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca alimento (es. pasta, pollo, mela...)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Search Results */}
                {searchQuery.length >= 2 && !selectedFood && (
                  <div className="p-4">
                    {searchResults.length > 0 ? (
                      <ul className="space-y-2">
                        {searchResults.map((food, index) => (
                          <motion.li
                            key={food.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <button
                              onClick={() => handleSelectFood(food)}
                              className="w-full p-3 bg-gray-50 hover:bg-primary/5 rounded-xl text-left transition-colors flex items-center justify-between group"
                            >
                              <div>
                                <p className="font-medium text-gray-900 group-hover:text-primary">
                                  {food.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                                </p>
                              </div>
                              <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nessun alimento trovato</p>
                        <p className="text-sm mt-1">Prova con un altro termine</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Selected Food Details */}
                {selectedFood && (
                  <div className="p-4 space-y-4">
                    {/* Food Name */}
                    <div className="p-4 bg-primary/5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Apple className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{selectedFood.name}</p>
                            <p className="text-sm text-gray-500">per 100g</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFood(null)}
                          className="text-sm text-primary hover:underline"
                        >
                          Cambia
                        </button>
                      </div>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-3 text-center">Quantità (grammi)</p>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= 10}
                          className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="w-24 text-center">
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              if (!isNaN(val) && val > 0 && val <= 1000) {
                                setQuantity(val)
                              }
                            }}
                            className="w-full text-center text-2xl font-bold text-gray-900 bg-transparent focus:outline-none"
                          />
                          <p className="text-sm text-gray-400">grammi</p>
                        </div>
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= 1000}
                          className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Quick quantity buttons */}
                      <div className="flex justify-center gap-2 mt-3">
                        {[50, 100, 150, 200].map(q => (
                          <button
                            key={q}
                            onClick={() => setQuantity(q)}
                            className={cn(
                              "px-3 py-1 rounded-lg text-sm transition-colors",
                              quantity === q 
                                ? "bg-primary text-white" 
                                : "bg-white text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            {q}g
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Nutritional Values */}
                    {nutritionalValues && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 mb-3 text-center">
                          Valori per {quantity}g
                        </p>
                        
                        {/* Calories highlight */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Flame className="w-6 h-6 text-orange-500" />
                          <span className="text-3xl font-bold text-gray-900">
                            {nutritionalValues.calories}
                          </span>
                          <span className="text-gray-500">kcal</span>
                        </div>
                        
                        {/* Macros */}
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-white rounded-lg">
                            <p className="text-lg font-semibold text-blue-600">
                              {nutritionalValues.protein}g
                            </p>
                            <p className="text-xs text-gray-500">Proteine</p>
                          </div>
                          <div className="p-2 bg-white rounded-lg">
                            <p className="text-lg font-semibold text-amber-600">
                              {nutritionalValues.carbs}g
                            </p>
                            <p className="text-xs text-gray-500">Carboidrati</p>
                          </div>
                          <div className="p-2 bg-white rounded-lg">
                            <p className="text-lg font-semibold text-red-500">
                              {nutritionalValues.fat}g
                            </p>
                            <p className="text-xs text-gray-500">Grassi</p>
                          </div>
                          <div className="p-2 bg-white rounded-lg">
                            <p className="text-lg font-semibold text-green-600">
                              {nutritionalValues.fiber}g
                            </p>
                            <p className="text-xs text-gray-500">Fibre</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Empty State */}
                {searchQuery.length < 2 && !selectedFood && (
                  <div className="p-8 text-center text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Cerca un alimento nel database</p>
                    <p className="text-sm mt-1">Inizia a digitare per vedere i risultati</p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={handleAddFood}
                  disabled={!selectedFood || isAdding}
                  className={cn(
                    "w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                    selectedFood && !isAdding
                      ? "btn-gradient text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-5 h-5" />
                      Aggiunto!
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Aggiungi al pasto
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
