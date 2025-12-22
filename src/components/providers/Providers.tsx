'use client'

/**
 * ============================================
 * PROVIDERS - CONTEXT WRAPPER
 * ============================================
 * 
 * Componente che wrappa l'app con tutti i provider necessari:
 * - Theme Provider (dark mode)
 * - Toast notifications
 * - State management (Zustand non richiede provider)
 */

import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
    </>
  )
}
