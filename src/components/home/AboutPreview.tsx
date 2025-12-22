'use client'

/**
 * ============================================
 * ABOUT PREVIEW - HOMEPAGE
 * ============================================
 * 
 * Sezione Chi Sono con layout split-screen:
 * - Foto grande a sinistra
 * - Testo con parole chiave in corsivo a destra
 * - Animazioni scroll-triggered
 */

import { motion } from 'framer-motion'
import { ArrowRight, Award, GraduationCap, Heart } from 'lucide-react'
import Link from 'next/link'

const highlights = [
  {
    icon: GraduationCap,
    title: 'Formazione Continua',
    description: 'Aggiornamento costante sulle ultime ricerche in nutrizione',
  },
  {
    icon: Heart,
    title: 'Approccio Olistico',
    description: 'Attenzione al benessere completo della persona',
  },
  {
    icon: Award,
    title: 'Esperienza Certificata',
    description: 'Anni di pratica clinica e risultati comprovati',
  },
]

export function AboutPreview() {
  return (
    <section className="py-24 lg:py-32 bg-cream">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-soft-lg">
              <div 
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80')`,
                }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              className="absolute -bottom-6 -right-6 lg:-right-10 glass-card p-6 max-w-[280px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">15+</p>
                  <p className="text-sm text-gray-500">Anni di esperienza</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Specializzato in <em>nutrizione sportiva</em> e <em>medicina integrativa</em>
              </p>
            </motion.div>

            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-rose-light rounded-full -z-10" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Chi Sono
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Un approccio moderno alla{' '}
              <span className="text-gradient"><em>nutrizione</em></span>
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Credo fermamente che la <em>nutrizione</em> sia la base del <em>benessere</em>. 
              Il mio approccio combina le più recenti evidenze scientifiche con 
              un&apos;attenzione personalizzata alle esigenze di ogni paziente.
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              Attraverso un percorso di <em>consapevolezza alimentare</em>, 
              ti guiderò verso un <em>equilibrio</em> sostenibile, 
              senza diete restrittive ma con scelte intelligenti e gustose.
            </p>

            {/* Highlights */}
            <div className="space-y-4 mb-8">
              {highlights.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            <Link href="/chi-sono">
              <motion.button
                className="group flex items-center gap-2 text-primary font-semibold"
                whileHover={{ x: 5 }}
              >
                Scopri di più
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
