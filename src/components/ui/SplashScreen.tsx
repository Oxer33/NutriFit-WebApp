'use client'

/**
 * ============================================
 * SPLASHSCREEN - ANIMAZIONE INIZIALE
 * ============================================
 * 
 * Splashscreen animato di 4 secondi con:
 * - Logo pulsante
 * - Animazione gradiente
 * - Fade out smooth
 * 
 * Viene mostrato solo al primo caricamento della pagina.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Heart, Sparkles } from 'lucide-react'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Timer di 4 secondi per la splashscreen
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  // Non renderizzare sul server per evitare hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(135deg, #86A788 0%, #6B8F6D 50%, #557156 100%)',
          }}
        >
          {/* Particelle di sfondo animate */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: [null, -100],
                  opacity: [0.3, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Logo container con animazione */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Cerchio di sfondo con glow */}
            <motion.div
              className="absolute w-40 h-40 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Logo principale */}
            <motion.div
              className="relative z-10 flex items-center justify-center w-28 h-28 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Leaf className="w-14 h-14 text-white" strokeWidth={1.5} />
            </motion.div>

            {/* Icone orbitanti */}
            <motion.div
              className="absolute"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div className="absolute -top-16">
                <Heart className="w-6 h-6 text-white/60" />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div className="absolute -bottom-16 -right-16">
                <Sparkles className="w-5 h-5 text-white/50" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Titolo */}
          <motion.h1
            className="mt-8 text-4xl md:text-5xl font-bold text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            NutriFit
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-3 text-lg text-white/80 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Il tuo percorso verso il <em className="text-white">benessere</em>
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="mt-12 w-48 h-1 bg-white/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
