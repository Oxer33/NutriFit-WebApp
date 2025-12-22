/**
 * ============================================
 * APP PAGE - DIARIO ALIMENTARE
 * ============================================
 * 
 * Pagina principale dell'app con:
 * - Calendario navigabile
 * - Contatore calorie con tachimetro
 * - Lista pasti del giorno
 * - Attività fisiche
 * - Contapassi
 * - Idratazione
 */

import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { AppDashboard } from '@/components/app/AppDashboard'

export const metadata = {
  title: 'Diario Alimentare',
  description: 'Gestisci il tuo diario alimentare quotidiano con NutriFit',
}

export default function AppPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-10 bg-cream">
        <AppDashboard />
      </main>
      <Footer />
    </>
  )
}
