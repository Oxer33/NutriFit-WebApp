'use client'

/**
 * ============================================
 * STEP NAME - Inserimento Nome
 * ============================================
 */

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface StepNameProps {
  data: { name: string }
  updateData: (key: 'name', value: string) => void
}

export function StepName({ data, updateData }: StepNameProps) {
  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <User className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Come ti chiami?
      </h1>
      <p className="text-gray-500 mb-8">
        Inserisci il tuo nome per personalizzare la tua esperienza
      </p>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData('name', e.target.value)}
          placeholder="Il tuo nome"
          className="w-full px-6 py-4 text-lg text-center bg-white rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
          autoFocus
        />
      </motion.div>

      {/* Validation hint */}
      {data.name.length > 0 && data.name.length < 2 && (
        <motion.p 
          className="text-sm text-amber-500 mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Il nome deve avere almeno 2 caratteri
        </motion.p>
      )}
    </div>
  )
}
