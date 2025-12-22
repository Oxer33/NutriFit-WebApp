'use client'

/**
 * ============================================
 * STEP ACTIVITY - Livello Attività Fisica
 * ============================================
 */

import { motion } from 'framer-motion'
import { Activity, Sofa, Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityLevel } from '@/types'

interface StepActivityProps {
  data: { activityLevel: ActivityLevel | null }
  updateData: (key: 'activityLevel', value: ActivityLevel) => void
}

const activityLevels: { value: ActivityLevel; label: string; description: string; icon: React.ReactNode; multiplier: string }[] = [
  { 
    value: 'SEDENTARY', 
    label: 'Sedentario', 
    description: 'Lavoro d\'ufficio, poco movimento quotidiano',
    icon: <Sofa className="w-7 h-7" />,
    multiplier: '×1.2'
  },
  { 
    value: 'ACTIVE', 
    label: 'Attivo', 
    description: 'Esercizio 2-5 volte a settimana',
    icon: <Dumbbell className="w-7 h-7" />,
    multiplier: '×1.55'
  },
]

export function StepActivity({ data, updateData }: StepActivityProps) {
  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <Activity className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Quanto sei attivo/a?
      </h1>
      <p className="text-gray-500 mb-8">
        Il livello di attività determina il moltiplicatore del metabolismo
      </p>

      {/* Options */}
      <div className="space-y-4">
        {activityLevels.map((level, index) => (
          <motion.button
            key={level.value}
            onClick={() => updateData('activityLevel', level.value)}
            className={cn(
              "w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4",
              data.activityLevel === level.value
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
              "w-14 h-14 rounded-xl flex items-center justify-center",
              data.activityLevel === level.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-500"
            )}>
              {level.icon}
            </div>
            <div className="text-left flex-1">
              <span className="text-lg font-medium text-gray-900 block">
                {level.label}
              </span>
              <span className="text-sm text-gray-500">
                {level.description}
              </span>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-lg text-sm font-bold",
              data.activityLevel === level.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-500"
            )}>
              {level.multiplier}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info */}
      <motion.div
        className="mt-6 p-4 bg-amber-50 rounded-xl text-sm text-amber-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        💡 Il moltiplicatore viene applicato al tuo metabolismo basale per calcolare il fabbisogno totale
      </motion.div>
    </div>
  )
}
