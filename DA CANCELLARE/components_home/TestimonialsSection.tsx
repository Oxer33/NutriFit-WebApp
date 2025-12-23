'use client'

/**
 * ============================================
 * TESTIMONIALS SECTION - HOMEPAGE
 * ============================================
 * 
 * Sezione testimonials con:
 * - Carousel moderno
 * - Foto circolari
 * - Animazioni fluide
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Maria Rossi',
    role: 'Imprenditrice',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    content: 'NutriFit ha trasformato il mio rapporto con il cibo. Finalmente un approccio alla nutrizione che si adatta alla mia vita frenetica. Ho perso 8 kg in 3 mesi!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marco Bianchi',
    role: 'Personal Trainer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    content: 'Consiglio NutriFit a tutti i miei clienti. L\'integrazione con il monitoraggio dell\'attività fisica è eccezionale. Un vero game-changer per chi fa sport.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Laura Verdi',
    role: 'Mamma e Blogger',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    content: 'Finalmente riesco a pianificare i pasti per tutta la famiglia! L\'AI mi suggerisce ricette sane e gustose che piacciono anche ai bambini.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Giuseppe Neri',
    role: 'Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    content: 'Lo scanner barcode è fantastico! Scansiono i prodotti al supermercato e so subito se sono adatti al mio piano alimentare. Semplicissimo.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-light/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Testimonianze
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
            Cosa dicono i nostri utenti
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className="glass-card-strong p-8 md:p-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-primary/20 mb-6" />

                {/* Content */}
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                  &quot;{current.content}&quot;
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-primary"
                    style={{ backgroundImage: `url('${current.image}')` }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{current.name}</h4>
                    <p className="text-sm text-gray-500">{current.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
              <motion.button
                className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center pointer-events-auto hover:bg-primary hover:text-white transition-colors"
                onClick={prevTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button
                className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center pointer-events-auto hover:bg-primary hover:text-white transition-colors"
                onClick={nextTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-primary' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
