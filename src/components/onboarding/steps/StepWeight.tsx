'use client'

/**
 * ============================================
 * STEP WEIGHT - Inserimento Peso
 * ============================================
 */

import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'

interface StepWeightProps {
  data: { weightKg: number | null }
  updateData: (key: 'weightKg', value: number | null) => void
}

export function StepWeight({ data, updateData }: StepWeightProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      updateData('weightKg', null)
    } else {
      const num = parseFloat(value)
      if (!isNaN(num)) {
        updateData('weightKg', num)
      }
    }
  }

  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <Scale className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Quanto pesi?
      </h1>
      <p className="text-gray-500 mb-8">
        Il peso attuale ci serve per calcolare il tuo fabbisogno calorico
      </p>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="number"
          step="0.1"
          value={data.weightKg ?? ''}
          onChange={handleChange}
          placeholder="Es. 70"
          min={30}
          max={300}
          className="w-full px-6 py-4 text-lg text-center bg-white rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          autoFocus
        />
        <p className="text-sm text-gray-400 mt-3">chilogrammi</p>
      </motion.div>

      {/* Info box */}
      <motion.div
        className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        💡 Se il tuo obiettivo è dimagrire o ingrassare, inserisci il peso attuale. 
        Potrai aggiornarlo nel tempo per monitorare i progressi.
      </motion.div>

      {/* Validation hint */}
      {data.weightKg !== null && (data.weightKg < 30 || data.weightKg > 300) && (
        <motion.p 
          className="text-sm text-amber-500 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Inserisci un peso valido (30-300 kg)
        </motion.p>
      )}
    </div>
  )
}
