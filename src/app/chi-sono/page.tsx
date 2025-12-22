/**
 * ============================================
 * CHI SONO PAGE - ABOUT
 * ============================================
 * 
 * Pagina di presentazione del nutrizionista con:
 * - Hero con foto grande
 * - Storia e filosofia
 * - Formazione e certificazioni
 * - Timeline esperienza
 */

import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutStory } from '@/components/about/AboutStory'
import { AboutCredentials } from '@/components/about/AboutCredentials'

export const metadata = {
  title: 'Chi Sono',
  description: 'Scopri la storia e la filosofia del Dott. Bernardo Giammetta, nutrizionista specializzato in nutrizione clinica e sportiva.',
}

export default function ChiSonoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <AboutHero />
        <AboutStory />
        <AboutCredentials />
      </main>
      <Footer />
    </>
  )
}
