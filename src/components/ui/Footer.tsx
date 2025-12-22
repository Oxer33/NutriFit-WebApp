'use client'

/**
 * ============================================
 * FOOTER - PIÈ DI PAGINA
 * ============================================
 * 
 * Footer minimalista con:
 * - Link social icon-only
 * - Link rapidi
 * - Informazioni di contatto
 * - Copyright
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react'

// =========== FOOTER LINKS ===========
const footerLinks = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Chi Sono', href: '/chi-sono' },
    { label: 'Servizi', href: '/servizi' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contatti', href: '/contatti' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookie' },
    { label: 'Termini e Condizioni', href: '/termini' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/nutrifit', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/nutrifit', label: 'Facebook' },
  { icon: Linkedin, href: 'https://linkedin.com/company/nutrifit', label: 'LinkedIn' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-cream to-cream-200 border-t border-white/50">
      {/* Decorazione top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">NutriFit</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Il tuo percorso verso il <em>benessere</em> inizia qui. 
              Nutrizione personalizzata, supporto AI e strumenti moderni per raggiungere i tuoi obiettivi.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-white/70 rounded-xl text-gray-600 hover:bg-primary hover:text-white transition-all duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Navigazione</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Legale</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contatti</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@nutrifit.com"
                  className="flex items-center gap-3 text-gray-600 text-sm hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  info@nutrifit.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+390123456789"
                  className="flex items-center gap-3 text-gray-600 text-sm hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  +39 012 345 6789
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <span>
                    Via della Nutrizione, 123<br />
                    00100 Roma, Italia
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} NutriFit. Tutti i diritti riservati.
            </p>
            <p className="flex items-center gap-1 text-gray-500 text-sm">
              Realizzato con 
              <Heart className="w-4 h-4 text-rose fill-rose" />
              per il tuo <em>benessere</em>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
