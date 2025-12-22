'use client'

/**
 * ============================================
 * MACRO GAUGE - GAUGE MACRONUTRIENTI
 * ============================================
 * 
 * Componente visivo per mostrare i macronutrienti
 * (proteine, carboidrati, grassi) con progress bars.
 * Replica MacroGaugeView dell'app Android.
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MacroData {
  protein: { current: number; target: number }
  carbs: { current: number; target: number }
  fat: { current: number; target: number }
  fiber?: { current: number; target: number }
}

interface MacroGaugeProps {
  data: MacroData
  showFiber?: boolean
  compact?: boolean
}

const macroConfig = {
  protein: { label: 'Proteine', color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-600' },
  carbs: { label: 'Carboidrati', color: '#3b82f6', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  fat: { label: 'Grassi', color: '#f59e0b', bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
  fiber: { label: 'Fibre', color: '#22c55e', bgColor: 'bg-green-100', textColor: 'text-green-600' }
}

export function MacroGauge({ data, showFiber = false, compact = false }: MacroGaugeProps) {
  const macros = [
    { key: 'protein', ...data.protein },
    { key: 'carbs', ...data.carbs },
    { key: 'fat', ...data.fat },
    ...(showFiber && data.fiber ? [{ key: 'fiber', ...data.fiber }] : [])
  ]

  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      {macros.map(({ key, current, target }) => {
        const config = macroConfig[key as keyof typeof macroConfig]
        const percentage = Math.min((current / target) * 100, 100)
        const isOver = current > target
        
        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={cn("font-medium", compact ? "text-xs" : "text-sm", config.textColor)}>
                {config.label}
              </span>
              <span className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>
                <span className={isOver ? "text-red-500" : "text-gray-900"}>{current.toFixed(0)}g</span>
                <span className="text-gray-400"> / {target}g</span>
              </span>
            </div>
            
            <div className={cn("w-full rounded-full overflow-hidden", compact ? "h-2" : "h-3", config.bgColor)}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: isOver ? '#ef4444' : config.color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Versione compatta circolare per dashboard
export function MacroCircles({ data }: { data: MacroData }) {
  const macros = [
    { key: 'protein', ...data.protein },
    { key: 'carbs', ...data.carbs },
    { key: 'fat', ...data.fat }
  ]

  return (
    <div className="flex items-center justify-around">
      {macros.map(({ key, current, target }) => {
        const config = macroConfig[key as keyof typeof macroConfig]
        const percentage = Math.min((current / target) * 100, 100)
        const radius = 28
        const circumference = 2 * Math.PI * radius
        const offset = circumference - (percentage / 100) * circumference
        
        return (
          <div key={key} className="flex flex-col items-center">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="32" cy="32" r={radius}
                  fill="none" stroke="#e5e7eb" strokeWidth="6"
                />
                <motion.circle
                  cx="32" cy="32" r={radius}
                  fill="none"
                  stroke={config.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">{current.toFixed(0)}g</span>
              </div>
            </div>
            <span className={cn("text-xs font-medium mt-1", config.textColor)}>
              {config.label.slice(0, 4)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
