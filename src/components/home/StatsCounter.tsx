'use client'

/**
 * ============================================
 * STATS COUNTER - HOMEPAGE
 * ============================================
 * 
 * Contatori animati con numeri che incrementano:
 * - Pazienti seguiti
 * - Anni di esperienza
 * - Piani personalizzati
 * - Tasso di soddisfazione
 */

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Calendar, ClipboardList, ThumbsUp } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Pazienti Seguiti',
    description: 'Persone che hanno iniziato il loro percorso',
  },
  {
    icon: Calendar,
    value: 15,
    suffix: '',
    label: 'Anni di Esperienza',
    description: 'Dedizione alla nutrizione clinica',
  },
  {
    icon: ClipboardList,
    value: 1200,
    suffix: '+',
    label: 'Piani Personalizzati',
    description: 'Programmi creati su misura',
  },
  {
    icon: ThumbsUp,
    value: 98,
    suffix: '%',
    label: 'Soddisfazione',
    description: 'Pazienti soddisfatti del percorso',
  },
]

// Hook per animazione contatore
function useCounter(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!start) return
    
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, start])
  
  return count
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const count = useCounter(stat.value, 2000, isInView)
  const Icon = stat.icon

  return (
    <motion.div
      ref={ref}
      className="text-center p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Icon className="w-8 h-8 text-primary" />
      </motion.div>
      
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        {count}
        <span className="text-primary">{stat.suffix}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {stat.label}
      </h3>
      
      <p className="text-sm text-gray-500">
        {stat.description}
      </p>
    </motion.div>
  )
}

export function StatsCounter() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-light/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            I Numeri
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Risultati che parlano
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
