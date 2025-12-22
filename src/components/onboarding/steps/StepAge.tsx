'use client'

/**
 * ============================================
 * STEP AGE - Inserimento Età
 * ============================================
 */

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface StepAgeProps {
  data: { age: number | null }
  updateData: (key: 'age', value: number | null) => void
}

export function StepAge({ data, updateData }: StepAgeProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      updateData('age', null)
    } else {
      const num = parseInt(value, 10)
      if (!isNaN(num)) {
        updateData('age', num)
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
        <Calendar className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Quanti anni hai?
      </h1>
      <p className="text-gray-500 mb-8">
        L&apos;età ci aiuta a calcolare il tuo metabolismo basale
      </p>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="number"
          value={data.age ?? ''}
          onChange={handleChange}
          placeholder="Es. 30"
          min={10}
          max={120}
          className="w-full px-6 py-4 text-lg text-center bg-white rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          autoFocus
        />
        <p className="text-sm text-gray-400 mt-3">anni</p>
      </motion.div>

      {/* Validation hint */}
      {data.age !== null && (data.age < 10 || data.age > 120) && (
        <motion.p 
          className="text-sm text-amber-500 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Inserisci un&apos;età valida (10-120 anni)
        </motion.p>
      )}
    </div>
  )
}
