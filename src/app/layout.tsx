/**
 * ============================================
 * ROOT LAYOUT - NUTRIFIT WEB APP
 * ============================================
 * 
 * Layout principale dell'applicazione che wrappa tutte le pagine.
 * Include:
 * - Font loading (Inter, Plus Jakarta Sans)
 * - Global styles
 * - Metadata SEO
 * - Provider per lo state management
 */

import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { SplashScreen } from '@/components/ui/SplashScreen'

// =========== FONT CONFIGURATION ===========
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

// =========== METADATA SEO ===========
export const metadata: Metadata = {
  title: {
    default: 'NutriFit - Il tuo percorso verso il benessere',
    template: '%s | NutriFit',
  },
  description: 'NutriFit è la tua app per la nutrizione personalizzata. Diario alimentare, piani AI, contapassi e molto altro per raggiungere i tuoi obiettivi di salute e benessere.',
  keywords: [
    'nutrizione',
    'dieta',
    'benessere',
    'salute',
    'diario alimentare',
    'contapassi',
    'piano alimentare',
    'calorie',
    'macronutrienti',
    'fitness',
    'nutrizionista',
  ],
  authors: [{ name: 'Dott. Bernardo Giammetta' }],
  creator: 'NutriFit',
  publisher: 'NutriFit',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://www.nutrifit.com',
    siteName: 'NutriFit',
    title: 'NutriFit - Il tuo percorso verso il benessere',
    description: 'App moderna per nutrizione personalizzata, diario alimentare e piani AI.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NutriFit - Nutrizione e Benessere',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriFit - Il tuo percorso verso il benessere',
    description: 'App moderna per nutrizione personalizzata, diario alimentare e piani AI.',
    images: ['/og-image.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

// =========== VIEWPORT ===========
export const viewport: Viewport = {
  themeColor: '#86A788',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// =========== ROOT LAYOUT COMPONENT ===========
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${inter.variable} ${jakartaSans.variable}`}>
      <body className="min-h-screen bg-cream antialiased">
        <Providers>
          {/* Splashscreen animato di 4 secondi */}
          <SplashScreen />
          
          {/* Contenuto principale */}
          <main className="relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
