'use client'

/**
 * ============================================
 * AUTH PROVIDER - SESSION PROVIDER CLIENT
 * ============================================
 * 
 * Provider per la sessione NextAuth lato client.
 * Wrappa l'applicazione per fornire accesso alla sessione.
 */

import { SessionProvider } from 'next-auth/react'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
