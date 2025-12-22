/**
 * ============================================
 * SERVIZI PAGE
 * ============================================
 */

import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { ServicesHero } from '@/components/services/ServicesHero'
import { ServicesList } from '@/components/services/ServicesList'

export const metadata = {
  title: 'Servizi',
  description: 'Scopri i servizi di nutrizione personalizzata: piani alimentari, consulenze, nutrizione sportiva e molto altro.',
}

export default function ServiziPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <ServicesHero />
        <ServicesList />
      </main>
      <Footer />
    </>
  )
}
