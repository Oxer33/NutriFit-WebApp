'use client'

/**
 * ============================================
 * SERVICES HERO
 * ============================================
 */

import { motion } from 'framer-motion'

export function ServicesHero() {
  return (
    <section className="py-16 bg-gradient-to-b from-cream to-white text-center">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            I Nostri Servizi
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
            Soluzioni personalizzate per il tuo <em>benessere</em>
          </h1>
          <p className="text-xl text-gray-600">
            Offriamo una gamma completa di servizi per aiutarti a raggiungere 
            i tuoi obiettivi di <em>salute</em> e <em>nutrizione</em>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
