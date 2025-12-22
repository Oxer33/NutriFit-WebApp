'use client'

/**
 * ============================================
 * FEATURES SECTION - APP FEATURES
 * ============================================
 * 
 * Sezione che mostra le funzionalità principali dell'app:
 * - Diario alimentare
 * - Contapassi
 * - Promemoria acqua
 * - AI per piani alimentari
 * - Scanner barcode
 * - Grafici statistiche
 */

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Footprints, 
  Droplets, 
  Brain, 
  ScanLine, 
  BarChart3,
  Smartphone
} from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Diario Alimentare',
    description: 'Registra pasti, calorie e macronutrienti giornalieri con un\'interfaccia intuitiva.',
    color: 'bg-blue-500',
  },
  {
    icon: Footprints,
    title: 'Contapassi Integrato',
    description: 'Monitora i tuoi passi quotidiani e le calorie bruciate automaticamente.',
    color: 'bg-green-500',
  },
  {
    icon: Droplets,
    title: 'Promemoria Idratazione',
    description: 'Ricevi notifiche intelligenti per bere acqua durante la giornata.',
    color: 'bg-cyan-500',
  },
  {
    icon: Brain,
    title: 'Piani Alimentari AI',
    description: 'L\'intelligenza artificiale crea piani personalizzati basati sul tuo profilo.',
    color: 'bg-purple-500',
  },
  {
    icon: ScanLine,
    title: 'Scanner Barcode',
    description: 'Scansiona i prodotti per ottenere istantaneamente i valori nutrizionali.',
    color: 'bg-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Grafici e Statistiche',
    description: 'Visualizza i tuoi progressi con grafici dettagliati nel tempo.',
    color: 'bg-pink-500',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-cream relative overflow-hidden">
      {/* Decorative phone mockup */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-80 h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full" />
          <div 
            className="w-full h-full rounded-[2.5rem] bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80')`,
            }}
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl">
          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                La Nostra App
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tutte le funzionalità dell&apos;app Android,{' '}
              <span className="text-gradient">ora sul web</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              Abbiamo portato l&apos;esperienza completa di NutriFit sul web, 
              mantenendo tutte le funzionalità che ami con un design ancora più moderno.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="group flex items-start gap-4 p-6 bg-white/80 rounded-2xl hover:bg-white hover:shadow-soft transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className={`flex-shrink-0 w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
