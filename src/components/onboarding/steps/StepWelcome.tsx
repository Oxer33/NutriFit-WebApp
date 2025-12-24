'use client'

/**
 * ============================================
 * STEP WELCOME - Messaggio di Benvenuto
 * ============================================
 */

import { motion } from 'framer-motion'
import { Sparkles, Flame, Target, Brain } from 'lucide-react'
import { 
  calculateCalorieGoal,
  calculateBMI,
  getBMICategory,
  type UserProfile 
} from '@/types'

interface StepWelcomeProps {
  data: {
    name: string
    age: number | null
    heightCm: number | null
    weightKg: number | null
    gender: 'M' | 'F' | null
    goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT' | null
    activityLevel: 'SEDENTARY' | 'ACTIVE' | null
    dietStyle: 'OMNIVORE' | 'VEGETARIAN' | 'VEGAN' | null
    weightChangeRate: 'RATE_025' | 'RATE_05' | 'RATE_075' | 'RATE_1' | null
  }
}

export function StepWelcome({ data }: StepWelcomeProps) {
  // Calcola i valori se tutti i dati sono presenti
  const profile: UserProfile | null = (
    data.age && 
    data.heightCm && 
    data.weightKg && 
    data.gender && 
    data.goal && 
    data.activityLevel &&
    data.dietStyle &&
    data.weightChangeRate
  ) ? {
    name: data.name,
    age: data.age,
    heightCm: data.heightCm,
    weightKg: data.weightKg,
    gender: data.gender,
    goal: data.goal,
    activityLevel: data.activityLevel,
    dietStyle: data.dietStyle,
    weightChangeRate: data.weightChangeRate,
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } : null

  // NOTA: BMR e TDEE calcolati internamente ma non mostrati - formule proprietarie
  const calorieGoal = profile ? calculateCalorieGoal(profile) : 0
  const bmi = data.weightKg && data.heightCm 
    ? calculateBMI(data.weightKg, data.heightCm) 
    : 0
  const bmiCategory = getBMICategory(bmi)

  const goalLabels = {
    'LOSE_WEIGHT': 'Perdere peso',
    'MAINTAIN': 'Mantenere il peso',
    'GAIN_WEIGHT': 'Aumentare peso'
  }

  return (
    <div className="text-center">
      {/* Animated Icon */}
      <motion.div 
        className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <Sparkles className="w-12 h-12 text-white" />
      </motion.div>

      {/* Title */}
      <motion.h1 
        className="text-3xl font-bold text-gray-900 mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Benvenuto/a, {data.name}! 🎉
      </motion.h1>
      
      <motion.p 
        className="text-gray-500 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Il tuo percorso verso il <em>benessere</em> inizia ora
      </motion.p>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-2 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-card p-4">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{calorieGoal}</p>
          <p className="text-xs text-gray-500">kcal/giorno obiettivo</p>
        </div>
        
        <div className="glass-card p-4">
          <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{bmi}</p>
          <p className="text-xs text-gray-500">BMI ({bmiCategory.label})</p>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        className="bg-gray-50 rounded-2xl p-4 text-left text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Il tuo profilo
        </h3>
        
        <div className="space-y-2 text-gray-600">
          <div className="flex justify-between">
            <span>Calorie giornaliere:</span>
            <span className="font-medium text-primary">{calorieGoal} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Obiettivo:</span>
            <span className="font-medium text-primary">
              {data.goal ? goalLabels[data.goal] : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Indice massa corporea:</span>
            <span className="font-medium">{bmi.toFixed(1)} ({bmiCategory.label})</span>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.p
        className="text-sm text-gray-500 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Premi &quot;Inizia!&quot; per accedere alla tua dashboard personale
      </motion.p>
    </div>
  )
}
