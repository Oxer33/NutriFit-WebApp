'use client'

/**
 * ============================================
 * STEP HEIGHT - Inserimento Altezza
 * ============================================
 */

import { motion } from 'framer-motion'
import { Ruler } from 'lucide-react'

interface StepHeightProps {
  data: { heightCm: number | null }
  updateData: (key: 'heightCm', value: number | null) => void
}

export function StepHeight({ data, updateData }: StepHeightProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      updateData('heightCm', null)
    } else {
      const num = parseInt(value, 10)
      if (!isNaN(num)) {
        updateData('heightCm', num)
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
        <Ruler className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Quanto sei alto/a?
      </h1>
      <p className="text-gray-500 mb-8">
        L&apos;altezza ci serve per calcolare il tuo BMI
      </p>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="number"
          value={data.heightCm ?? ''}
          onChange={handleChange}
          placeholder="Es. 175"
          min={100}
          max={250}
          className="w-full px-6 py-4 text-lg text-center bg-white rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          autoFocus
        />
        <p className="text-sm text-gray-400 mt-3">centimetri</p>
      </motion.div>

      {/* Validation hint */}
      {data.heightCm !== null && (data.heightCm < 100 || data.heightCm > 250) && (
        <motion.p 
          className="text-sm text-amber-500 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Inserisci un&apos;altezza valida (100-250 cm)
        </motion.p>
      )}
    </div>
  )
}
