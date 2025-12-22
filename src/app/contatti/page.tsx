/**
 * ============================================
 * CONTATTI PAGE
 * ============================================
 */

import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { ContactHero } from '@/components/contact/ContactHero'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contatti',
  description: 'Contattaci per prenotare una consulenza nutrizionale o per qualsiasi informazione.',
}

export default function ContattiPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <ContactHero />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
