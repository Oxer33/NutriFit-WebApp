'use client'

/**
 * ============================================
 * STEP WEIGHT CHANGE RATE - Tasso Variazione Peso
 * ============================================
 */

import { motion } from 'framer-motion'
import { Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WeightChangeRate } from '@/types'

interface StepWeightChangeRateProps {
  data: { 
    weightChangeRate: WeightChangeRate | null
    goal: 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_WEIGHT' | null 
  }
  updateData: (key: 'weightChangeRate', value: WeightChangeRate) => void
}

const rates: { value: WeightChangeRate; label: string; kgPerWeek: string; dailyCal: string; safety: string }[] = [
  { 
    value: 'RATE_025', 
    label: 'Molto graduale',
    kgPerWeek: '0.25 kg',
    dailyCal: '~275 kcal',
    safety: 'Sicuro e sostenibile'
  },
  { 
    value: 'RATE_05', 
    label: 'Moderato',
    kgPerWeek: '0.5 kg',
    dailyCal: '~550 kcal',
    safety: 'Raccomandato'
  },
  { 
    value: 'RATE_075', 
    label: 'Sostenuto',
    kgPerWeek: '0.75 kg',
    dailyCal: '~825 kcal',
    safety: 'Richiede impegno'
  },
  { 
    value: 'RATE_1', 
    label: 'Intenso',
    kgPerWeek: '1 kg',
    dailyCal: '~1100 kcal',
    safety: 'Solo per periodi brevi'
  },
]

export function StepWeightChangeRate({ data, updateData }: StepWeightChangeRateProps) {
  const isLosing = data.goal === 'LOSE_WEIGHT'
  const isGaining = data.goal === 'GAIN_WEIGHT'
  
  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <Gauge className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        A che ritmo vuoi {isLosing ? 'perdere' : isGaining ? 'aumentare' : 'variare'} peso?
      </h1>
      <p className="text-gray-500 mb-8">
        Determina il {isLosing ? 'deficit' : 'surplus'} calorico giornaliero
      </p>

      {/* Options */}
      <div className="space-y-3">
        {rates.map((rate, index) => (
          <motion.button
            key={rate.value}
            onClick={() => updateData('weightChangeRate', rate.value)}
            className={cn(
              "w-full p-4 rounded-2xl border-2 transition-all",
              data.weightChangeRate === rate.value
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-lg font-medium text-gray-900 block">
                  {rate.label}
                </span>
                <span className="text-sm text-gray-500">
                  {rate.kgPerWeek}/settimana • {rate.dailyCal}/giorno
                </span>
              </div>
              <div className="text-right">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  rate.value === 'RATE_025' ? "bg-green-100 text-green-700" :
                  rate.value === 'RATE_05' ? "bg-blue-100 text-blue-700" :
                  rate.value === 'RATE_075' ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {rate.safety}
                </span>
              </div>
            </div>
            {data.weightChangeRate === rate.value && (
              <motion.div 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
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

      {/* Info */}
      <motion.div
        className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        💡 Un ritmo di 0.5 kg/settimana è considerato sicuro e sostenibile dalla maggior parte dei nutrizionisti
      </motion.div>
    </div>
  )
}
