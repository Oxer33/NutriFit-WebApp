/**
 * ============================================
 * WEB APP MANIFEST - PWA NUTRIFIT
 * ============================================
 * 
 * Configurazione per Progressive Web App.
 * Permette l'installazione dell'app su dispositivi mobili e desktop.
 */

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NutriFit - Diario Alimentare',
    short_name: 'NutriFit',
    description: 'Il tuo diario alimentare intelligente con AI Coach e calcoli nutrizionali medicamente verificati',
    start_url: '/app',
    display: 'standalone',
    background_color: '#FFFDEC',
    theme_color: '#86A788',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'it',
    categories: ['health', 'fitness', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '1280x720',
        type: 'image/png',
        // @ts-ignore - form_factor è supportato ma non nel tipo
        form_factor: 'wide'
      },
      {
        src: '/screenshots/diary.png',
        sizes: '750x1334',
        type: 'image/png',
        // @ts-ignore
        form_factor: 'narrow'
      }
    ],
    shortcuts: [
      {
        name: 'Diario Alimentare',
        short_name: 'Diario',
        description: 'Apri il diario alimentare',
        url: '/app?tab=diary',
        icons: [{ src: '/icons/shortcut-diary.png', sizes: '96x96' }]
      },
      {
        name: 'AI Coach',
        short_name: 'AI',
        description: 'Parla con il nutrizionista AI',
        url: '/app?tab=ai',
        icons: [{ src: '/icons/shortcut-ai.png', sizes: '96x96' }]
      },
      {
        name: 'Profilo',
        short_name: 'Profilo',
        description: 'Visualizza il tuo profilo',
        url: '/app?tab=profile',
        icons: [{ src: '/icons/shortcut-profile.png', sizes: '96x96' }]
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  }
}
