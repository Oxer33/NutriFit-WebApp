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
  Check,
  Barcode
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
import { BarcodeScanner } from '@/components/app/BarcodeScanner'

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
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [usePortions, setUsePortions] = useState(false)
  const [selectedPortion, setSelectedPortion] = useState<string>('grams')
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Porzioni predefinite (come app Android)
  const PORTION_TYPES = [
    { id: 'grams', label: 'Grammi', grams: 1 },
    { id: 'spoon', label: 'Cucchiaio', grams: 15 },
    { id: 'teaspoon', label: 'Cucchiaino', grams: 5 },
    { id: 'cup', label: 'Tazza', grams: 240 },
    { id: 'small_cup', label: 'Tazzina', grams: 80 },
    { id: 'glass', label: 'Bicchiere', grams: 200 },
    { id: 'shot_glass', label: 'Bicchierino', grams: 60 },
    { id: 'ladle', label: 'Mestolo', grams: 100 },
    { id: 'slice', label: 'Fetta', grams: 30 },
    { id: 'piece', label: 'Pezzo', grams: 50 },
  ]
  
  // Store
  const { addMeal, getDailyData } = useAppStore()
  
  // Cerca alimenti
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return []
    return searchFoods(searchQuery, 15)
  }, [searchQuery])
  
  // Calcola grammi effettivi in base alla porzione
  const effectiveGrams = useMemo(() => {
    if (!usePortions) return quantity
    const portion = PORTION_TYPES.find(p => p.id === selectedPortion)
    return quantity * (portion?.grams || 1)
  }, [quantity, usePortions, selectedPortion])
  
  // Calcola valori nutrizionali per la quantità selezionata
  const nutritionalValues = useMemo(() => {
    if (!selectedFood) return null
    const grams = effectiveGrams
    const multiplier = grams / 100
    return {
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fat * multiplier * 10) / 10,
      fiber: Math.round(selectedFood.fiber * multiplier * 10) / 10,
      grams: grams
    }
  }, [selectedFood, effectiveGrams])
  
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
  const incrementQuantity = () => {
    if (usePortions) {
      setQuantity(q => Math.min(q + 1, 20)) // Max 20 porzioni
    } else {
      setQuantity(q => Math.min(q + 10, 1000))
    }
  }
  const decrementQuantity = () => {
    if (usePortions) {
      setQuantity(q => Math.max(q - 1, 1)) // Min 1 porzione
    } else {
      setQuantity(q => Math.max(q - 10, 10))
    }
  }
  
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
      quantity: nutritionalValues.grams, // Usa grammi effettivi
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
  
  // Handler per prodotto trovato da barcode scanner
  const handleBarcodeProduct = (food: Partial<FoodItem>) => {
    // Converte il prodotto OpenFoodFacts in FoodFromDB format
    const foodFromDB: FoodFromDB = {
      name: food.name || 'Prodotto',
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      fiber: food.fiber || 0,
      sugar: 0 // OpenFoodFacts potrebbe non avere questo dato
    }
    setSelectedFood(foodFromDB)
    setShowBarcodeScanner(false)
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
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cerca alimento..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <button
                    onClick={() => setShowBarcodeScanner(true)}
                    className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                    title="Scansiona codice a barre"
                  >
                    <Barcode className="w-5 h-5" />
                  </button>
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
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900 group-hover:text-primary">
                                    {food.name}
                                  </p>
                                  {/* Badge provenienza */}
                                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-100 text-green-700">
                                    🇮🇹 CREA
                                  </span>
                                </div>
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
                      {/* Toggle Porzioni/Grammi */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <button
                          onClick={() => { setUsePortions(false); setQuantity(100) }}
                          className={cn(
                            "px-3 py-1.5 text-sm rounded-lg transition-colors",
                            !usePortions ? "bg-primary text-white" : "bg-white text-gray-600"
                          )}
                        >
                          Grammi
                        </button>
                        <button
                          onClick={() => { setUsePortions(true); setQuantity(1); setSelectedPortion('spoon') }}
                          className={cn(
                            "px-3 py-1.5 text-sm rounded-lg transition-colors",
                            usePortions ? "bg-primary text-white" : "bg-white text-gray-600"
                          )}
                        >
                          Porzioni
                        </button>
                      </div>
                      
                      {/* Porzione selector */}
                      {usePortions && (
                        <select
                          value={selectedPortion}
                          onChange={(e) => setSelectedPortion(e.target.value)}
                          className="w-full mb-3 p-2 bg-white border border-gray-200 rounded-lg text-sm"
                        >
                          {PORTION_TYPES.filter(p => p.id !== 'grams').map(p => (
                            <option key={p.id} value={p.id}>
                              {p.label} ({p.grams}g)
                            </option>
                          ))}
                        </select>
                      )}
                      
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={decrementQuantity}
                          disabled={usePortions ? quantity <= 1 : quantity <= 10}
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
                              if (usePortions) {
                                if (!isNaN(val) && val > 0 && val <= 20) setQuantity(val)
                              } else {
                                if (!isNaN(val) && val > 0 && val <= 1000) setQuantity(val)
                              }
                            }}
                            className="w-full text-center text-2xl font-bold text-gray-900 bg-transparent focus:outline-none"
                          />
                          <p className="text-sm text-gray-400">
                            {usePortions ? `= ${effectiveGrams}g` : 'grammi'}
                          </p>
                        </div>
                        <button
                          onClick={incrementQuantity}
                          disabled={usePortions ? quantity >= 20 : quantity >= 1000}
                          className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Quick quantity buttons */}
                      {!usePortions && (
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
                      )}
                    </div>
                    
                    {/* Nutritional Values */}
                    {nutritionalValues && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 mb-3 text-center">
                          Valori per {nutritionalValues.grams}g
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
      
      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onProductFound={handleBarcodeProduct}
      />
    </AnimatePresence>
  )
}
