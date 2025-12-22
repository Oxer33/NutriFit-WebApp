'use client'

/**
 * ============================================
 * ADD ACTIVITY MODAL - Aggiunta Attività Fisiche
 * ============================================
 * 
 * Modal per:
 * - Ricerca attività nel database locale
 * - Selezione durata in minuti
 * - Calcolo calorie bruciate basato su MET
 * - Aggiunta al diario del giorno
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Search, 
  Plus, 
  Minus,
  Activity,
  Flame,
  Clock,
  Check,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { 
  searchActivities, 
  ACTIVITY_CATEGORIES,
  POPULAR_ACTIVITIES,
  type ActivityFromDB 
} from '@/data/activityDatabase'
import { 
  type PhysicalActivity,
  calculateActivityCalories,
  generateId 
} from '@/types'

// =========== PROPS ===========

interface AddActivityModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
}

// =========== COMPONENT ===========

export function AddActivityModal({ isOpen, onClose, date }: AddActivityModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<ActivityFromDB | null>(null)
  const [duration, setDuration] = useState(30)
  const [isAdding, setIsAdding] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Store
  const { profile, addActivity } = useAppStore()
  
  // Cerca attività
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2 && !selectedCategory) {
      return POPULAR_ACTIVITIES
    }
    return searchActivities(searchQuery, selectedCategory || undefined, 15)
  }, [searchQuery, selectedCategory])
  
  // Calcola calorie bruciate
  const caloriesBurned = useMemo(() => {
    if (!selectedActivity) return 0
    return calculateActivityCalories(
      selectedActivity.met,
      duration,
      profile
    )
  }, [selectedActivity, duration, profile])
  
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
      setSelectedCategory(null)
      setSelectedActivity(null)
      setDuration(30)
    }
  }, [isOpen])
  
  // Gestione durata
  const incrementDuration = () => setDuration(d => Math.min(d + 5, 300))
  const decrementDuration = () => setDuration(d => Math.max(d - 5, 5))
  
  // Aggiungi attività
  const handleAddActivity = useCallback(async () => {
    if (!selectedActivity) return
    
    setIsAdding(true)
    
    // Crea PhysicalActivity
    const activity: PhysicalActivity = {
      id: generateId(),
      name: selectedActivity.name,
      metValue: selectedActivity.met,
      durationMinutes: duration,
      caloriesBurned: caloriesBurned,
      date: date,
      createdAt: new Date().toISOString()
    }
    
    // Aggiungi allo store
    addActivity(activity)
    
    // Feedback visivo
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 300)
  }, [selectedActivity, duration, caloriesBurned, date, addActivity, onClose])
  
  // Seleziona attività dalla ricerca
  const handleSelectActivity = (activity: ActivityFromDB) => {
    setSelectedActivity(activity)
    setSearchQuery('')
    setSelectedCategory(null)
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
                  <h2 className="text-lg font-bold text-gray-900">Aggiungi attività</h2>
                  <p className="text-sm text-gray-500">Registra esercizio fisico</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-gray-100 flex-shrink-0 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca attività (es. corsa, nuoto, yoga...)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors",
                      !selectedCategory 
                        ? "bg-primary text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    Tutte
                  </button>
                  {ACTIVITY_CATEGORIES.slice(0, 6).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors",
                        selectedCategory === cat 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Search Results / Popular */}
                {!selectedActivity && (
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                      {searchQuery.length >= 2 ? 'Risultati ricerca' : 'Attività popolari'}
                    </p>
                    {searchResults.length > 0 ? (
                      <ul className="space-y-2">
                        {searchResults.map((activity, index) => (
                          <motion.li
                            key={activity.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <button
                              onClick={() => handleSelectActivity(activity)}
                              className="w-full p-3 bg-gray-50 hover:bg-primary/5 rounded-xl text-left transition-colors flex items-center justify-between group"
                            >
                              <div>
                                <p className="font-medium text-gray-900 group-hover:text-primary">
                                  {activity.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  MET: {activity.met} • {activity.category}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-orange-500 font-medium">
                                  ~{calculateActivityCalories(activity.met, 30, profile)} kcal/30min
                                </span>
                                <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                              </div>
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nessuna attività trovata</p>
                        <p className="text-sm mt-1">Prova con un altro termine</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Selected Activity Details */}
                {selectedActivity && (
                  <div className="p-4 space-y-4">
                    {/* Activity Name */}
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Activity className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{selectedActivity.name}</p>
                            <p className="text-sm text-gray-500">MET: {selectedActivity.met}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedActivity(null)}
                          className="text-sm text-primary hover:underline"
                        >
                          Cambia
                        </button>
                      </div>
                    </div>
                    
                    {/* Duration Selector */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-3 text-center">Durata (minuti)</p>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={decrementDuration}
                          disabled={duration <= 5}
                          className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="w-24 text-center">
                          <input
                            type="number"
                            value={duration}
                            onChange={(e) => {
                              const val = parseInt(e.target.value)
                              if (!isNaN(val) && val > 0 && val <= 300) {
                                setDuration(val)
                              }
                            }}
                            className="w-full text-center text-2xl font-bold text-gray-900 bg-transparent focus:outline-none"
                          />
                          <p className="text-sm text-gray-400">minuti</p>
                        </div>
                        <button
                          onClick={incrementDuration}
                          disabled={duration >= 300}
                          className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Quick duration buttons */}
                      <div className="flex justify-center gap-2 mt-3">
                        {[15, 30, 45, 60, 90].map(d => (
                          <button
                            key={d}
                            onClick={() => setDuration(d)}
                            className={cn(
                              "px-3 py-1 rounded-lg text-sm transition-colors",
                              duration === d 
                                ? "bg-primary text-white" 
                                : "bg-white text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            {d}m
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Calories Burned */}
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-3 text-center">
                        Calorie bruciate stimate
                      </p>
                      
                      {/* Calories highlight */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="w-8 h-8 text-orange-500" />
                        <span className="text-4xl font-bold text-orange-600">
                          {caloriesBurned}
                        </span>
                        <span className="text-gray-500">kcal</span>
                      </div>
                      
                      {/* Formula explanation */}
                      <p className="text-xs text-center text-gray-400">
                        Calcolato con MET × peso ({profile.weightKg || 70}kg) × durata
                      </p>
                    </div>
                    
                    {/* Info box */}
                    <div className="p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700">
                        Il MET (Metabolic Equivalent of Task) indica l'intensità dell'attività. 
                        Un MET di {selectedActivity.met} significa che bruci {selectedActivity.met}x le calorie rispetto al riposo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={handleAddActivity}
                  disabled={!selectedActivity || isAdding}
                  className={cn(
                    "w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                    selectedActivity && !isAdding
                      ? "btn-gradient text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-5 h-5" />
                      Aggiunta!
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Aggiungi attività (-{caloriesBurned} kcal)
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
