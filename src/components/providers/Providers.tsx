'use client'

/**
 * ============================================
 * PROVIDERS - CONTEXT WRAPPER
 * ============================================
 * 
 * Componente che wrappa l'app con tutti i provider necessari:
 * - Auth Provider (NextAuth session)
 * - Theme Provider (dark mode)
 * - Toast notifications
 * - State management (Zustand non richiede provider)
 */

import { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
