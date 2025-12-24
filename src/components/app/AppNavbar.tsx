'use client'

/**
 * ============================================
 * APP NAVBAR - NAVIGAZIONE INTERNA APP
 * ============================================
 * 
 * Navbar dedicata per la sezione /app
 * Mostra solo: Logo, Nome utente, Logout
 * NON mostra link a pagine esterne inesistenti
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  LogOut, 
  User,
  Menu,
  X,
  Settings
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

export function AppNavbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  // Handler logout
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 navbar-glass shadow-soft py-3"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/app" className="flex items-center gap-2 group">
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

          {/* User Info & Actions */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                {/* Nome utente (desktop) */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                </div>

                {/* Menu dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-xl hover:bg-white/50 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    {showMenu ? (
                      <X className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Menu className="w-5 h-5 text-gray-700" />
                    )}
                  </motion.button>

                  {/* Dropdown menu */}
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      {/* Nome utente (mobile) */}
                      <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-gray-700">
                            {session.user.name || session.user.email?.split('@')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      {/* Link Home */}
                      <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        <Leaf className="w-4 h-4" />
                        Torna alla Home
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Esci
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              // Non autenticato - mostra link login
              <Link href="/auth/login">
                <motion.button
                  className="btn-gradient text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Accedi
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.header>
  )
}
