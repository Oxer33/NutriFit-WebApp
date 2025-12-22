'use client'

/**
 * ============================================
 * STEP GENDER - Selezione Genere
 * ============================================
 */

import { motion } from 'framer-motion'
import { User, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Gender } from '@/types'

interface StepGenderProps {
  data: { gender: Gender | null }
  updateData: (key: 'gender', value: Gender) => void
}

const genders: { value: Gender; label: string; icon: React.ReactNode; color: string }[] = [
  { 
    value: 'M', 
    label: 'Uomo', 
    icon: <User className="w-8 h-8" />,
    color: 'bg-blue-500'
  },
  { 
    value: 'F', 
    label: 'Donna', 
    icon: <User className="w-8 h-8" />,
    color: 'bg-pink-500'
  },
  { 
    value: 'O', 
    label: 'Altro', 
    icon: <Users className="w-8 h-8" />,
    color: 'bg-purple-500'
  },
]

export function StepGender({ data, updateData }: StepGenderProps) {
  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <Users className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Qual è il tuo genere?
      </h1>
      <p className="text-gray-500 mb-8">
        Ci serve per calcolare correttamente il tuo metabolismo
      </p>

      {/* Options */}
      <div className="space-y-3">
        {genders.map((gender, index) => (
          <motion.button
            key={gender.value}
            onClick={() => updateData('gender', gender.value)}
            className={cn(
              "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4",
              data.gender === gender.value
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
              gender.color
            )}>
              {gender.icon}
            </div>
            <span className="text-lg font-medium text-gray-900">
              {gender.label}
            </span>
            {data.gender === gender.value && (
              <motion.div 
                className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center"
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
