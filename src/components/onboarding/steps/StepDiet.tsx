'use client'

/**
 * ============================================
 * STEP DIET - Stile Alimentare
 * ============================================
 */

import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DietStyle } from '@/types'

interface StepDietProps {
  data: { dietStyle: DietStyle | null }
  updateData: (key: 'dietStyle', value: DietStyle) => void
}

const dietStyles: { value: DietStyle; label: string; description: string; emoji: string }[] = [
  { 
    value: 'OMNIVORE', 
    label: 'Onnivoro', 
    description: 'Mangio di tutto, inclusa carne e pesce',
    emoji: '🥩'
  },
  { 
    value: 'VEGETARIAN', 
    label: 'Vegetariano', 
    description: 'No carne e pesce, sì uova e latticini',
    emoji: '🥚'
  },
  { 
    value: 'VEGAN', 
    label: 'Vegano', 
    description: 'Solo alimenti di origine vegetale',
    emoji: '🥬'
  },
]

export function StepDiet({ data, updateData }: StepDietProps) {
  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <Utensils className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Qual è il tuo stile alimentare?
      </h1>
      <p className="text-gray-500 mb-8">
        Ci aiuta a personalizzare i suggerimenti dell&apos;AI
      </p>

      {/* Options */}
      <div className="space-y-3">
        {dietStyles.map((diet, index) => (
          <motion.button
            key={diet.value}
            onClick={() => updateData('dietStyle', diet.value)}
            className={cn(
              "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4",
              data.dietStyle === diet.value
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
              {diet.emoji}
            </div>
            <div className="text-left flex-1">
              <span className="text-lg font-medium text-gray-900 block">
                {diet.label}
              </span>
              <span className="text-sm text-gray-500">
                {diet.description}
              </span>
            </div>
            {data.dietStyle === diet.value && (
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
