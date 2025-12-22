'use client'

/**
 * ============================================
 * CUSTOM FOODS MANAGER - ALIMENTI PERSONALIZZATI
 * ============================================
 * 
 * Dialog per creare e gestire alimenti personalizzati.
 * Replica CustomFoodsManagerDialog dell'app Android.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Search, Apple, Edit3, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

// =========== TYPES ===========
export interface CustomFood {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  brand?: string
  createdAt: string
}

interface CustomFoodsManagerProps {
  isOpen: boolean
  onClose: () => void
  onFoodSelect?: (food: CustomFood) => void
}

// =========== COMPONENT ===========
export function CustomFoodsManager({ isOpen, onClose, onFoodSelect }: CustomFoodsManagerProps) {
  const [customFoods, setCustomFoods] = useState<CustomFood[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrifit_custom_foods')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFood, setEditingFood] = useState<CustomFood | null>(null)
  const [formData, setFormData] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '', brand: ''
  })

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return customFoods
    const query = searchQuery.toLowerCase()
    return customFoods.filter(f => f.name.toLowerCase().includes(query))
  }, [customFoods, searchQuery])

  const saveFoods = (foods: CustomFood[]) => {
    setCustomFoods(foods)
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_custom_foods', JSON.stringify(foods))
    }
  }

  const resetForm = () => {
    setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '', brand: '' })
    setEditingFood(null)
    setShowAddForm(false)
  }

  const handleEdit = (food: CustomFood) => {
    setFormData({
      name: food.name, calories: food.calories.toString(), protein: food.protein.toString(),
      carbs: food.carbs.toString(), fat: food.fat.toString(), fiber: food.fiber.toString(),
      brand: food.brand || ''
    })
    setEditingFood(food)
    setShowAddForm(true)
  }

  const handleSave = () => {
    const calories = parseFloat(formData.calories)
    if (!formData.name.trim() || isNaN(calories)) return
    
    const foodData: CustomFood = {
      id: editingFood?.id || `custom-${Date.now()}`,
      name: formData.name.trim(),
      calories,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      fiber: parseFloat(formData.fiber) || 0,
      brand: formData.brand.trim() || undefined,
      createdAt: editingFood?.createdAt || new Date().toISOString()
    }
    
    const updated = editingFood 
      ? customFoods.map(f => f.id === editingFood.id ? foodData : f)
      : [foodData, ...customFoods]
    saveFoods(updated)
    resetForm()
  }

  const handleDelete = (id: string) => saveFoods(customFoods.filter(f => f.id !== id))

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Apple className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Alimenti Personalizzati</h2>
                <p className="text-xs text-gray-500">{customFoods.length} alimenti salvati</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {showAddForm ? (
            /* Form */
            <div className="p-4 space-y-3">
              <input type="text" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                placeholder="Nome alimento *" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={formData.calories} onChange={e => setFormData(p => ({...p, calories: e.target.value}))}
                  placeholder="Calorie (100g) *" className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                <input type="number" value={formData.protein} onChange={e => setFormData(p => ({...p, protein: e.target.value}))}
                  placeholder="Proteine (g)" className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                <input type="number" value={formData.carbs} onChange={e => setFormData(p => ({...p, carbs: e.target.value}))}
                  placeholder="Carboidrati (g)" className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                <input type="number" value={formData.fat} onChange={e => setFormData(p => ({...p, fat: e.target.value}))}
                  placeholder="Grassi (g)" className="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
              </div>
              <input type="text" value={formData.brand} onChange={e => setFormData(p => ({...p, brand: e.target.value}))}
                placeholder="Marca (opzionale)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
              <div className="flex gap-2 pt-2">
                <button onClick={resetForm} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Annulla</button>
                <button onClick={handleSave} disabled={!formData.name.trim() || !formData.calories}
                  className="flex-1 py-3 rounded-xl bg-primary text-white hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Salva
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Search & Add */}
              <div className="p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cerca alimenti..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none" />
                </div>
                <button onClick={() => setShowAddForm(true)}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Aggiungi alimento
                </button>
              </div>

              {/* List */}
              <div className="px-4 pb-4 overflow-y-auto max-h-[40vh]">
                {filteredFoods.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Apple className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nessun alimento personalizzato</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFoods.map(food => (
                      <div key={food.id} onClick={() => onFoodSelect?.(food)}
                        className={cn("p-3 rounded-xl border border-gray-200 hover:border-gray-300", onFoodSelect && "cursor-pointer")}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{food.name}</p>
                            {food.brand && <p className="text-xs text-gray-500">{food.brand}</p>}
                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                              <span>{food.calories} kcal</span>
                              <span>P: {food.protein}g</span>
                              <span>C: {food.carbs}g</span>
                              <span>G: {food.fat}g</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(food) }}
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(food.id) }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
