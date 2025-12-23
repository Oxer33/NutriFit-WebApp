'use client'

/**
 * ============================================
 * SERVICE WORKER REGISTRATION - PWA
 * ============================================
 * 
 * Componente che registra il service worker per la PWA.
 * Va incluso nel layout principale.
 */

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Solo in produzione o se forzato
    if (typeof window === 'undefined') return
    
    // Verifica supporto service worker
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker non supportato')
      return
    }

    // Registra service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        console.log('[PWA] Service Worker registrato con successo:', registration.scope)

        // Verifica aggiornamenti periodicamente
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Nuovo SW disponibile, vecchio ancora attivo
                  console.log('[PWA] Nuovo contenuto disponibile, ricarica per aggiornare')
                  
                  // Potresti mostrare un toast qui per chiedere di aggiornare
                  // Per ora, aggiorniamo silenziosamente al prossimo caricamento
                } else {
                  // Prima installazione
                  console.log('[PWA] Contenuto cachato per uso offline')
                }
              }
            })
          }
        })

        // Check per aggiornamenti ogni ora
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)

      } catch (error) {
        console.error('[PWA] Errore registrazione Service Worker:', error)
      }
    }

    // Registra quando la pagina è completamente caricata
    if (document.readyState === 'complete') {
      registerSW()
    } else {
      window.addEventListener('load', registerSW)
      return () => window.removeEventListener('load', registerSW)
    }
  }, [])

  // Questo componente non renderizza nulla
  return null
}
