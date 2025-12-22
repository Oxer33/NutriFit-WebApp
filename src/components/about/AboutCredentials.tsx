'use client'

/**
 * ============================================
 * ABOUT CREDENTIALS - FORMAZIONE
 * ============================================
 */

import { motion } from 'framer-motion'
import { GraduationCap, Award, BookOpen } from 'lucide-react'

const credentials = [
  {
    year: '2008',
    title: 'Laurea in Scienze della Nutrizione',
    institution: 'Università degli Studi di Roma',
    icon: GraduationCap,
  },
  {
    year: '2010',
    title: 'Specializzazione in Nutrizione Clinica',
    institution: 'Policlinico Gemelli',
    icon: Award,
  },
  {
    year: '2012',
    title: 'Master in Nutrizione Sportiva',
    institution: 'CONI - Centro Olimpico',
    icon: BookOpen,
  },
  {
    year: '2015',
    title: 'Certificazione in Medicina Integrativa',
    institution: 'Istituto di Medicina Integrata',
    icon: Award,
  },
  {
    year: '2020',
    title: 'Corso Avanzato AI in Healthcare',
    institution: 'MIT - Massachusetts Institute of Technology',
    icon: BookOpen,
  },
]

export function AboutCredentials() {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Formazione
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Il mio percorso formativo
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {credentials.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                className="relative pl-12 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Line */}
                {index < credentials.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-primary/20" />
                )}
                
                {/* Icon */}
                <div className="absolute left-0 top-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="glass-card p-6">
                  <span className="text-primary font-semibold text-sm">{item.year}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.institution}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
