'use client'

/**
 * ============================================
 * BLOG GRID - GRIGLIA ARTICOLI
 * ============================================
 */

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    title: 'I 10 Alimenti Più Nutrienti per il Tuo Benessere',
    excerpt: 'Scopri quali sono gli alimenti che non possono mancare nella tua dieta per garantire il massimo apporto nutrizionale.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    date: '15 Gen 2025',
    readTime: '5 min',
    category: 'Nutrizione',
  },
  {
    id: 2,
    title: 'Come l\'AI Sta Rivoluzionando la Nutrizione',
    excerpt: 'L\'intelligenza artificiale sta trasformando il modo in cui creiamo e seguiamo i piani alimentari personalizzati.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    date: '10 Gen 2025',
    readTime: '7 min',
    category: 'Tecnologia',
  },
  {
    id: 3,
    title: 'La Dieta Mediterranea: Guida Completa',
    excerpt: 'Tutto quello che devi sapere sulla dieta mediterranea, patrimonio UNESCO e modello di alimentazione sana.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
    date: '5 Gen 2025',
    readTime: '8 min',
    category: 'Guide',
  },
  {
    id: 4,
    title: 'Idratazione: Quanto Bere e Quando',
    excerpt: 'L\'importanza dell\'acqua per il nostro organismo e le linee guida per una corretta idratazione quotidiana.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80',
    date: '1 Gen 2025',
    readTime: '4 min',
    category: 'Benessere',
  },
  {
    id: 5,
    title: 'Nutrizione Sportiva: Prima e Dopo l\'Allenamento',
    excerpt: 'Cosa mangiare prima e dopo l\'attività fisica per massimizzare le prestazioni e il recupero.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    date: '28 Dic 2024',
    readTime: '6 min',
    category: 'Sport',
  },
  {
    id: 6,
    title: 'Gestire lo Stress con l\'Alimentazione',
    excerpt: 'Come alcuni alimenti possono aiutarci a gestire lo stress e migliorare il nostro umore.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    date: '20 Dic 2024',
    readTime: '5 min',
    category: 'Benessere',
  },
]

export function BlogGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="glass-card overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-primary">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <Link href={`/blog/${post.id}`}>
                  <motion.button
                    className="flex items-center gap-1 text-sm font-medium text-primary"
                    whileHover={{ x: 5 }}
                  >
                    Leggi di più
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
