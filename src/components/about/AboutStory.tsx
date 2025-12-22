'use client'

/**
 * ============================================
 * ABOUT STORY - LA MIA STORIA
 * ============================================
 */

import { motion } from 'framer-motion'
import { Heart, Target, Lightbulb } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Passione',
    description: 'Ogni paziente è unico. Mi dedico con passione a comprendere le esigenze individuali per creare percorsi personalizzati.',
  },
  {
    icon: Target,
    title: 'Obiettivi',
    description: 'Insieme definiamo obiettivi realistici e sostenibili, senza diete estreme ma con scelte intelligenti.',
  },
  {
    icon: Lightbulb,
    title: 'Innovazione',
    description: 'Utilizzo le più recenti tecnologie e ricerche scientifiche per offrire il miglior supporto possibile.',
  },
]

export function AboutStory() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              La Mia Filosofia
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              Un approccio olistico al <em>benessere</em>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Credo fermamente che la <em>nutrizione</em> sia molto più di una semplice dieta. 
              È uno stile di vita, un percorso di <em>consapevolezza</em> che porta al <em>benessere</em> 
              fisico e mentale. Il mio obiettivo è guidarti in questo viaggio, 
              fornendoti gli strumenti per prendere decisioni consapevoli sulla tua alimentazione.
            </p>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                className="text-center p-8 glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
