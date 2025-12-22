'use client'

/**
 * ============================================
 * NAVBAR - NAVIGAZIONE PRINCIPALE
 * ============================================
 * 
 * Navbar glassmorphism con:
 * - Logo animato
 * - Menu responsive
 * - Effetto blur al scroll
 * - Mobile hamburger menu
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Leaf, 
  Home, 
  User, 
  Utensils, 
  BookOpen, 
  Mail,
  LayoutDashboard
} from 'lucide-react'
import { cn } from '@/lib/utils'

// =========== NAVIGATION ITEMS ===========
const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chi-sono', label: 'Chi Sono', icon: User },
  { href: '/servizi', label: 'Servizi', icon: Utensils },
  { href: '/app', label: 'App', icon: LayoutDashboard },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/contatti', label: 'Contatti', icon: Mail },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Gestione scroll per effetto blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Chiudi menu mobile al cambio pagina
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'navbar-glass shadow-soft py-3' 
            : 'bg-transparent py-5'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
                NutriFit
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-primary'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        layoutId="navbar-indicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link href="/app">
                <motion.button
                  className="btn-gradient text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Inizia Ora
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-cream shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">NutriFit</span>
                  </Link>
                  <button
                    className="p-2 rounded-xl hover:bg-white/50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-6 h-6 text-gray-800" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1">
                  <ul className="space-y-2">
                    {navItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                              isActive
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:bg-white/70 hover:text-gray-900'
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        </motion.li>
                      )
                    })}
                  </ul>
                </nav>

                {/* CTA Button */}
                <Link href="/app" className="mt-auto">
                  <button className="w-full btn-gradient">
                    Inizia Ora
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
