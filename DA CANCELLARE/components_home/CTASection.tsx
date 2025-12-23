'use client'

/**
 * ============================================
 * CTA SECTION - CALL TO ACTION FINALE
 * ============================================
 * 
 * Sezione CTA con:
 * - Gradient background
 * - Animazioni
 * - Bottone principale
 */

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #86A788 0%, #6B8F6D 50%, #557156 100%)',
        }}
      />

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Inizia Gratuitamente
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto a trasformare la tua{' '}
            <span className="italic">nutrizione</span>?
          </h2>

          {/* Description */}
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Unisciti a migliaia di persone che hanno già scoperto un nuovo modo 
            di prendersi cura del proprio <em className="text-white">benessere</em>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app">
              <motion.button
                className="px-8 py-4 bg-white text-primary font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  Inizia Ora
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>
            </Link>
            
            <Link href="/contatti">
              <motion.button
                className="px-8 py-4 text-white font-semibold border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Prenota una Consulenza
              </motion.button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <span>✓ Nessuna carta richiesta</span>
            <span>✓ Setup in 2 minuti</span>
            <span>✓ Supporto 24/7</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
