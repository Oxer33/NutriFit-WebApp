'use client'

/**
 * ============================================
 * SERVICES GRID - BENTO STYLE
 * ============================================
 * 
 * Griglia servizi stile Apple Bento con:
 * - Cards con glassmorphism
 * - Hover effects moderni
 * - Immagini zoomabili
 */

import { motion } from 'framer-motion'
import { ArrowRight, Utensils, Brain, Activity, Scale, Heart, Salad } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    id: 1,
    title: 'Piani Alimentari Personalizzati',
    description: 'Programmi nutrizionali su misura basati sui tuoi obiettivi, stile di vita e preferenze alimentari.',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    size: 'large',
    keywords: ['personalizzazione', 'nutrizione'],
  },
  {
    id: 2,
    title: 'Consulenza AI Avanzata',
    description: 'Intelligenza artificiale per analizzare la tua dieta e suggerirti miglioramenti in tempo reale.',
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    size: 'medium',
    keywords: ['AI', 'tecnologia'],
  },
  {
    id: 3,
    title: 'Monitoraggio Attività',
    description: 'Traccia passi, calorie bruciate e attività fisica quotidiana.',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    size: 'medium',
    keywords: ['fitness', 'movimento'],
  },
  {
    id: 4,
    title: 'Gestione del Peso',
    description: 'Monitora il tuo peso nel tempo con grafici e statistiche dettagliate.',
    icon: Scale,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80',
    size: 'small',
    keywords: ['peso', 'obiettivi'],
  },
  {
    id: 5,
    title: 'Benessere Completo',
    description: 'Approccio olistico alla salute con promemoria idratazione e molto altro.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    size: 'small',
    keywords: ['benessere', 'salute'],
  },
  {
    id: 6,
    title: 'Database Nutrizionale',
    description: 'Oltre 1000 alimenti con valori nutrizionali completi e scanner barcode.',
    icon: Salad,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    size: 'medium',
    keywords: ['alimenti', 'nutrienti'],
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon
  
  const sizeClasses = {
    large: 'md:col-span-2 md:row-span-2',
    medium: 'md:col-span-1 md:row-span-1',
    small: 'md:col-span-1 md:row-span-1',
  }

  return (
    <motion.div
      className={`bento-item group cursor-pointer ${sizeClasses[service.size as keyof typeof sizeClasses]}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 rounded-3xl overflow-hidden opacity-20 group-hover:opacity-30 transition-opacity"
        style={{
          backgroundImage: `url('${service.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Icon */}
        <motion.div
          className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm flex-grow">
          {service.description}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mt-4">
          {service.keywords.map((keyword) => (
            <span
              key={keyword}
              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
            >
              <em>{keyword}</em>
            </span>
          ))}
        </div>

        {/* Arrow */}
        <motion.div
          className="mt-4 flex items-center gap-1 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          Scopri di più
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ServicesGrid() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Funzionalità
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Tutto ciò di cui hai bisogno
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Una suite completa di strumenti per il tuo <em>benessere</em> quotidiano, 
            dalla pianificazione dei pasti al monitoraggio delle attività.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link href="/servizi">
            <motion.button
              className="btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Vedi tutti i servizi
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
