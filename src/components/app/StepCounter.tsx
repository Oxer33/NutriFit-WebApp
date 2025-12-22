'use client'

/**
 * ============================================
 * STEP COUNTER - Contapassi Web-Based
 * ============================================
 * 
 * Componente per:
 * - Visualizzare e gestire i passi giornalieri
 * - Input manuale passi
 * - Sincronizzazione con dispositivi (se supportato)
 * - Calcolo calorie bruciate camminando
 * - Progress verso obiettivo giornaliero
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Footprints, 
  Plus, 
  Minus,
  Target,
  Flame,
  TrendingUp,
  Smartphone,
  RefreshCw,
  Edit3,
  Check,
  X,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { calculateStepsCalories } from '@/types'

// =========== PROPS ===========

interface StepCounterProps {
  date: string
  compact?: boolean
}

// =========== CONSTANTS ===========

const DEFAULT_STEP_GOAL = 10000
const CALORIES_PER_STEP = 0.04 // media approssimativa

// =========== COMPONENT ===========

export function StepCounter({ date, compact = false }: StepCounterProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  
  // Store
  const { 
    profile, 
    getDailyData, 
    setSteps, 
    addSteps 
  } = useAppStore()
  
  // Dati giornalieri
  const dailyData = getDailyData(date)
  const currentSteps = dailyData.steps
  const stepGoal = DEFAULT_STEP_GOAL
  
  // Calcoli
  const progress = Math.min((currentSteps / stepGoal) * 100, 100)
  const caloriesBurned = calculateStepsCalories(currentSteps, profile.weightKg || 70)
  const remainingSteps = Math.max(stepGoal - currentSteps, 0)
  const distanceKm = (currentSteps * 0.0007).toFixed(2) // ~70cm per passo
  
  // Controllo obiettivo raggiunto
  useEffect(() => {
    if (currentSteps >= stepGoal && !showCelebration) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [currentSteps, stepGoal, showCelebration])
  
  // Handlers
  const handleQuickAdd = useCallback((amount: number) => {
    addSteps(date, amount)
  }, [date, addSteps])
  
  const handleEditStart = useCallback(() => {
    setEditValue(String(currentSteps))
    setIsEditing(true)
  }, [currentSteps])
  
  const handleEditSave = useCallback(() => {
    const newValue = parseInt(editValue)
    if (!isNaN(newValue) && newValue >= 0) {
      setSteps(date, newValue)
    }
    setIsEditing(false)
  }, [editValue, date, setSteps])
  
  const handleEditCancel = useCallback(() => {
    setIsEditing(false)
    setEditValue('')
  }, [])
  
  // =========== COMPACT VERSION ===========
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
        <div className="p-2 bg-green-100 rounded-lg">
          <Footprints className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            {currentSteps.toLocaleString('it-IT')} passi
          </p>
          <p className="text-xs text-gray-500">
            {Math.round(progress)}% • ~{caloriesBurned} kcal
          </p>
        </div>
        <button
          onClick={() => handleQuickAdd(1000)}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    )
  }
  
  // =========== FULL VERSION ===========
  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-xl">
            <Footprints className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Contapassi</h3>
            <p className="text-sm text-gray-500">Obiettivo: {stepGoal.toLocaleString('it-IT')} passi</p>
          </div>
        </div>
        <button
          onClick={handleEditStart}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title="Modifica manualmente"
        >
          <Edit3 className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      
      {/* Main Display */}
      <div className="text-center mb-6">
        {/* Circular Progress */}
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="url(#stepGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={553}
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="stepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#16A34A" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isEditing ? (
              <div className="flex flex-col items-center gap-2">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-24 text-center text-2xl font-bold text-gray-900 border-b-2 border-green-500 bg-transparent focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSave}
                    className="p-1.5 bg-green-500 text-white rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="p-1.5 bg-gray-300 text-gray-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <motion.span 
                  className="text-4xl font-bold text-gray-900"
                  key={currentSteps}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {currentSteps.toLocaleString('it-IT')}
                </motion.span>
                <span className="text-gray-500 text-sm">passi</span>
                <span className={cn(
                  "text-xs mt-1 font-medium",
                  progress >= 100 ? "text-green-600" : "text-gray-400"
                )}>
                  {progress >= 100 ? '🎉 Obiettivo raggiunto!' : `${remainingSteps.toLocaleString('it-IT')} rimanenti`}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span className="font-bold">Obiettivo raggiunto!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-orange-50 rounded-xl text-center">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{caloriesBurned}</p>
          <p className="text-xs text-gray-500">kcal</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-center">
          <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{distanceKm}</p>
          <p className="text-xs text-gray-500">km</p>
        </div>
        <div className="p-3 bg-green-50 rounded-xl text-center">
          <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{Math.round(progress)}%</p>
          <p className="text-xs text-gray-500">completato</p>
        </div>
      </div>
      
      {/* Quick Add Buttons */}
      <div className="space-y-3">
        <p className="text-sm text-gray-500 text-center">Aggiungi passi rapidamente</p>
        <div className="flex gap-2">
          {[500, 1000, 2000, 5000].map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickAdd(amount)}
              className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-xl font-medium transition-colors text-sm"
            >
              +{amount >= 1000 ? `${amount / 1000}k` : amount}
            </button>
          ))}
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 Inserisci manualmente i passi dal tuo smartwatch o app fitness.
          <br />
          In futuro supporteremo la sincronizzazione automatica!
        </p>
      </div>
    </motion.div>
  )
}

// =========== MINI STEP WIDGET ===========

export function StepWidget({ date }: { date: string }) {
  const { profile, getDailyData, addSteps } = useAppStore()
  const dailyData = getDailyData(date)
  const currentSteps = dailyData.steps
  const progress = Math.min((currentSteps / DEFAULT_STEP_GOAL) * 100, 100)
  const caloriesBurned = calculateStepsCalories(currentSteps, profile.weightKg || 70)
  
  return (
    <motion.div 
      className="glass-card p-4"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <Footprints className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Passi</span>
        </div>
        <button
          onClick={() => addSteps(date, 1000)}
          className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {currentSteps.toLocaleString('it-IT')}
        </span>
        <span className="text-gray-400 text-sm ml-1">/ 10k</span>
      </div>
      
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <p className="text-xs text-gray-500">
        ~{caloriesBurned} kcal bruciate
      </p>
    </motion.div>
  )
}
