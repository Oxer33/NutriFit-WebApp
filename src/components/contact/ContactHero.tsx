'use client'

/**
 * ============================================
 * CONTACT HERO
 * ============================================
 */

import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'

const contactInfo = [
  { icon: MapPin, label: 'Indirizzo', value: 'Via della Nutrizione, 123 - Roma' },
  { icon: Mail, label: 'Email', value: 'info@nutrifit.com' },
  { icon: Phone, label: 'Telefono', value: '+39 012 345 6789' },
  { icon: Clock, label: 'Orari', value: 'Lun-Ven: 9:00-18:00' },
]

export function ContactHero() {
  return (
    <section className="py-16 bg-gradient-to-b from-cream to-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Contatti
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
            Inizia il tuo percorso verso il <em>benessere</em>
          </h1>
          <p className="text-xl text-gray-600">
            Siamo qui per aiutarti. Contattaci per prenotare una consulenza 
            o per qualsiasi domanda sulla <em>nutrizione</em>.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <motion.div
                key={info.label}
                className="glass-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-gray-500 mb-1">{info.label}</p>
                <p className="font-medium text-gray-900">{info.value}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
