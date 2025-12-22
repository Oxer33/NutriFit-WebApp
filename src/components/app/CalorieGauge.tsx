'use client'

/**
 * ============================================
 * CALORIE GAUGE - TACHIMETRO CALORIE
 * ============================================
 * 
 * Componente visivo a tachimetro per mostrare
 * le calorie consumate vs obiettivo giornaliero.
 * Replica CalorieGaugeView dell'app Android.
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CalorieGaugeProps {
  consumed: number      // Calorie consumate
  burned: number        // Calorie bruciate (attività)
  target: number        // Obiettivo giornaliero (BMR/TDEE)
  showDetails?: boolean // Mostra dettagli sotto
  size?: 'sm' | 'md' | 'lg'
}

export function CalorieGauge({ 
  consumed, 
  burned, 
  target, 
  showDetails = true,
  size = 'md' 
}: CalorieGaugeProps) {
  // Calcoli
  const remaining = target - consumed + burned
  const percentage = Math.min((consumed / target) * 100, 150) // Max 150%
  const isOver = remaining < 0
  
  // Dimensioni in base a size
  const dimensions = {
    sm: { width: 120, strokeWidth: 8, fontSize: 'text-lg' },
    md: { width: 180, strokeWidth: 12, fontSize: 'text-2xl' },
    lg: { width: 240, strokeWidth: 16, fontSize: 'text-3xl' }
  }[size]
  
  // Calcolo SVG arc
  const radius = (dimensions.width - dimensions.strokeWidth) / 2
  const circumference = radius * Math.PI // Semi-cerchio
  const offset = circumference - (percentage / 150) * circumference
  
  // Colore in base alla percentuale
  const gaugeColor = useMemo(() => {
    if (percentage <= 70) return '#22c55e' // Verde - sotto obiettivo
    if (percentage <= 100) return '#86A788' // Primary - on target
    if (percentage <= 120) return '#f59e0b' // Arancione - leggermente sopra
    return '#ef4444' // Rosso - troppo sopra
  }, [percentage])

  return (
    <div className="flex flex-col items-center">
      {/* Gauge SVG */}
      <div className="relative" style={{ width: dimensions.width, height: dimensions.width / 2 + 20 }}>
        <svg
          width={dimensions.width}
          height={dimensions.width / 2 + 20}
          viewBox={`0 0 ${dimensions.width} ${dimensions.width / 2 + 20}`}
        >
          {/* Background arc */}
          <path
            d={`M ${dimensions.strokeWidth / 2} ${dimensions.width / 2} 
                A ${radius} ${radius} 0 0 1 ${dimensions.width - dimensions.strokeWidth / 2} ${dimensions.width / 2}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={dimensions.strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <motion.path
            d={`M ${dimensions.strokeWidth / 2} ${dimensions.width / 2} 
                A ${radius} ${radius} 0 0 1 ${dimensions.width - dimensions.strokeWidth / 2} ${dimensions.width / 2}`}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={dimensions.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Markers */}
          {[0, 25, 50, 75, 100].map((mark, i) => {
            const angle = (mark / 100) * 180
            const rad = (angle * Math.PI) / 180
            const x1 = dimensions.width / 2 - (radius - 5) * Math.cos(rad)
            const y1 = dimensions.width / 2 - (radius - 5) * Math.sin(rad)
            const x2 = dimensions.width / 2 - (radius - 15) * Math.cos(rad)
            const y2 = dimensions.width / 2 - (radius - 15) * Math.sin(rad)
            
            return (
              <line
                key={mark}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#9ca3af"
                strokeWidth={2}
              />
            )
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <motion.span 
            className={cn("font-bold", dimensions.fontSize)}
            style={{ color: gaugeColor }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.abs(remaining).toLocaleString()}
          </motion.span>
          <span className="text-xs text-gray-500">
            {isOver ? 'kcal in eccesso' : 'kcal rimanenti'}
          </span>
        </div>
      </div>
      
      {/* Details */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-xs">
          <div className="text-center">
            <p className="text-xs text-gray-500">Obiettivo</p>
            <p className="font-semibold text-gray-900">{target.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Consumate</p>
            <p className="font-semibold text-primary">{consumed.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Bruciate</p>
            <p className="font-semibold text-orange-500">{burned.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}
