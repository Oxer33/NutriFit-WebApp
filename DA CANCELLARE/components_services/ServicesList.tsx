'use client'

/**
 * ============================================
 * SERVICES LIST - LISTA SERVIZI
 * ============================================
 */

import { motion } from 'framer-motion'
import { 
  ClipboardList, 
  Users, 
  Dumbbell, 
  Baby, 
  Heart, 
  Brain,
  ArrowRight 
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: ClipboardList,
    title: 'Piani Alimentari Personalizzati',
    description: 'Programmi nutrizionali su misura basati sui tuoi obiettivi, preferenze e stile di vita. Ogni piano è unico come te.',
    features: ['Analisi completa del profilo', 'Piano settimanale dettagliato', 'Liste della spesa', 'Ricette personalizzate'],
    price: 'Da €80',
  },
  {
    icon: Users,
    title: 'Consulenza Nutrizionale',
    description: 'Incontri individuali per valutare le tue esigenze e creare un percorso personalizzato verso il benessere.',
    features: ['Prima visita approfondita', 'Controlli periodici', 'Supporto continuo', 'Analisi composizione corporea'],
    price: 'Da €60',
  },
  {
    icon: Dumbbell,
    title: 'Nutrizione Sportiva',
    description: 'Piani specifici per atleti e sportivi, ottimizzati per prestazioni, recupero e crescita muscolare.',
    features: ['Timing dei nutrienti', 'Integrazione sportiva', 'Pre/post workout', 'Periodizzazione alimentare'],
    price: 'Da €100',
  },
  {
    icon: Baby,
    title: 'Nutrizione Pediatrica',
    description: 'Programmi alimentari per bambini e adolescenti, per una crescita sana e abitudini corrette.',
    features: ['Piani adatti all\'età', 'Educazione alimentare', 'Gestione allergie', 'Menù scolastici'],
    price: 'Da €70',
  },
  {
    icon: Heart,
    title: 'Nutrizione Clinica',
    description: 'Supporto nutrizionale per condizioni specifiche: diabete, ipertensione, colesterolo e altro.',
    features: ['Valutazione clinica', 'Collaborazione medica', 'Monitoraggio parametri', 'Piani terapeutici'],
    price: 'Da €90',
  },
  {
    icon: Brain,
    title: 'Coaching AI Avanzato',
    description: 'Utilizza la nostra app con AI integrata per ricevere supporto 24/7 e piani alimentari intelligenti.',
    features: ['Chat AI illimitata', 'Analisi automatica', 'Suggerimenti real-time', 'Tracciamento progressi'],
    price: 'Gratuito con app',
  },
]

export function ServicesList() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                className="glass-card p-8 group hover:shadow-soft-lg transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-7 h-7 text-primary" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-primary">{service.price}</span>
                  <Link href="/contatti">
                    <motion.button
                      className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      Prenota
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
