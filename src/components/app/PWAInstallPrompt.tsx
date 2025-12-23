'use client'

/**
 * ============================================
 * PWA INSTALL PROMPT - PROMPT INSTALLAZIONE APP
 * ============================================
 * 
 * Componente che mostra il prompt per installare l'app:
 * - Su Android/Desktop: usa beforeinstallprompt API
 * - Su iOS: mostra istruzioni manuali
 * - Non mostra nulla se già installata
 * - Ricorda se l'utente ha rifiutato (non mostra per 7 giorni)
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share, Plus } from 'lucide-react'

// =========== TYPES ===========

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// =========== COMPONENT ===========

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    // Verifica se già installata come PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    // @ts-ignore - Safari
    const iosStandalone = window.navigator.standalone === true
    setIsStandalone(standalone || iosStandalone)

    // Verifica se è iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Se già installata, non mostrare nulla
    if (standalone || iosStandalone) return

    // Verifica se l'utente ha rifiutato di recente
    const dismissedAt = localStorage.getItem('pwa-dismissed-at')
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        return // Non mostrare per 7 giorni
      }
    }

    // Handler per beforeinstallprompt (Chrome, Edge, Samsung Browser)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Mostra prompt dopo 3 secondi (non subito, dà fastidio)
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Per iOS, mostra dopo un po'
    if (iOS && !standalone && !iosStandalone) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    // Handler per quando l'app viene installata
    const handleAppInstalled = () => {
      console.log('[PWA] App installata!')
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Non mostrare se già installata
  if (isStandalone) return null

  // Gestisce click su "Installa"
  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS: mostra guida
      if (isIOS) {
        setShowIOSGuide(true)
      }
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      console.log('[PWA] User choice:', outcome)
      
      if (outcome === 'dismissed') {
        // Ricorda che ha rifiutato
        localStorage.setItem('pwa-dismissed-at', new Date().toISOString())
      }
      
      setShowPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error('[PWA] Install error:', error)
    }
  }

  // Gestisce chiusura prompt
  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSGuide(false)
    localStorage.setItem('pwa-dismissed-at', new Date().toISOString())
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Installa NutriFit</h3>
                    <p className="text-xs text-white/80">Accesso rapido dalla home</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {isIOS && !showIOSGuide ? (
                // iOS: bottone per mostrare istruzioni
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Aggiungi NutriFit alla tua schermata Home per un accesso più veloce!
                  </p>
                  <button
                    onClick={() => setShowIOSGuide(true)}
                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Come installare
                  </button>
                </>
              ) : isIOS && showIOSGuide ? (
                // iOS: istruzioni passo-passo
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 font-medium">
                    Segui questi passaggi:
                  </p>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                        1
                      </span>
                      <span className="text-gray-600">
                        Tocca l'icona <Share className="w-4 h-4 inline text-blue-500" /> Condividi in basso
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                        2
                      </span>
                      <span className="text-gray-600">
                        Scorri e tocca <strong>"Aggiungi alla schermata Home"</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                        3
                      </span>
                      <span className="text-gray-600">
                        Tocca <strong>"Aggiungi"</strong> in alto a destra
                      </span>
                    </li>
                  </ol>
                  <button
                    onClick={handleDismiss}
                    className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
                  >
                    Ho capito
                  </button>
                </div>
              ) : (
                // Android/Desktop: bottone install diretto
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Installa l'app per accedere più velocemente, anche offline!
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDismiss}
                      className="flex-1 py-3 text-gray-500 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                    >
                      Non ora
                    </button>
                    <button
                      onClick={handleInstall}
                      className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Installa
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Benefits */}
            {!showIOSGuide && (
              <div className="px-4 pb-4">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    ✓ Accesso rapido
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ Funziona offline
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ Notifiche
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// =========== SERVICE WORKER REGISTRATION ===========

/**
 * Registra il service worker
 * Da chiamare nel layout principale
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        console.log('[PWA] Service Worker registrato:', registration.scope)

        // Verifica aggiornamenti
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nuovo service worker disponibile
                console.log('[PWA] Nuovo Service Worker disponibile')
                // Potresti mostrare un toast per chiedere di aggiornare
              }
            })
          }
        })
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error)
      }
    })
  }
}
