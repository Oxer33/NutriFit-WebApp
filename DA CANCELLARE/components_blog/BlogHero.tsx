'use client'

/**
 * ============================================
 * BLOG HERO
 * ============================================
 */

import { motion } from 'framer-motion'

export function BlogHero() {
  return (
    <section className="py-16 bg-gradient-to-b from-cream to-white text-center">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Blog & Risorse
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
            Approfondimenti sulla <em>nutrizione</em>
          </h1>
          <p className="text-xl text-gray-600">
            Articoli, guide e consigli per un <em>benessere</em> consapevole 
            e uno stile di vita sano.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
