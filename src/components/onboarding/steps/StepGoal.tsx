'use client'

/**
 * ============================================
 * STEP GOAL - Selezione Obiettivo
 * ============================================
 */

import { motion } from 'framer-motion'
import { Target, TrendingDown, Minus, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Goal } from '@/types'

interface StepGoalProps {
  data: { goal: Goal | null }
  updateData: (key: 'goal', value: Goal) => void
}

const goals: { value: Goal; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  { 
    value: 'LOSE_WEIGHT', 
    label: 'Perdere peso', 
    description: 'Deficit calorico per dimagrire',
    icon: <TrendingDown className="w-7 h-7" />,
    color: 'bg-blue-500'
  },
  { 
    value: 'MAINTAIN', 
    label: 'Mantenere il peso', 
    description: 'Bilancio calorico equilibrato',
    icon: <Minus className="w-7 h-7" />,
    color: 'bg-green-500'
  },
  { 
    value: 'GAIN_WEIGHT', 
    label: 'Aumentare peso', 
    description: 'Surplus calorico per crescere',
    icon: <TrendingUp className="w-7 h-7" />,
    color: 'bg-orange-500'
  },
]

export function StepGoal({ data, updateData }: StepGoalProps) {
  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <Target className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Qual è il tuo obiettivo?
      </h1>
      <p className="text-gray-500 mb-8">
        Definisce il tuo fabbisogno calorico giornaliero
      </p>

      {/* Options */}
      <div className="space-y-3">
        {goals.map((goal, index) => (
          <motion.button
            key={goal.value}
            onClick={() => updateData('goal', goal.value)}
            className={cn(
              "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4",
              data.goal === goal.value
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-white",
              goal.color
            )}>
              {goal.icon}
            </div>
            <div className="text-left flex-1">
              <span className="text-lg font-medium text-gray-900 block">
                {goal.label}
              </span>
              <span className="text-sm text-gray-500">
                {goal.description}
              </span>
            </div>
            {data.goal === goal.value && (
              <motion.div 
                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
