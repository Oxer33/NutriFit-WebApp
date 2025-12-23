'use client'

/**
 * ============================================
 * ABOUT HERO - CHI SONO
 * ============================================
 */

import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Award } from 'lucide-react'

export function AboutHero() {
  return (
    <section className="py-16 bg-gradient-to-b from-cream to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-soft-lg aspect-[4/5]">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-6 -right-6 glass-card p-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <Award className="w-10 h-10 text-primary" />
                <div>
                  <p className="font-bold text-gray-900">15+ Anni</p>
                  <p className="text-sm text-gray-500">di esperienza</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Chi Sono
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Dott. Bernardo Giammetta
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              Nutrizionista specializzato in <em>nutrizione clinica</em>, 
              <em>nutrizione sportiva</em> e <em>medicina integrativa</em>.
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              Da oltre 15 anni mi dedico con passione alla <em>nutrizione</em> e al <em>benessere</em> 
              delle persone. Il mio approccio combina le più recenti evidenze scientifiche 
              con un&apos;attenzione personalizzata alle esigenze di ogni paziente.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Via della Nutrizione, 123 - Roma</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@nutrifit.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-primary" />
                <span>+39 012 345 6789</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
