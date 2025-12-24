/**
 * ============================================
 * APP PAGE - DIARIO ALIMENTARE (PROTETTA)
 * ============================================
 * 
 * Pagina principale dell'app (richiede autenticazione):
 * - Calendario navigabile
 * - Contatore calorie con tachimetro
 * - Lista pasti del giorno
 * - Attività fisiche
 * - Profilo utente
 * 
 * NOTA: Protetta da middleware, redirect a /auth/login se non autenticato
 */

import { AppNavbar } from '@/components/app/AppNavbar'
import { AppDashboard } from '@/components/app/AppDashboard'

export const metadata = {
  title: 'Diario Alimentare | NutriFit',
  description: 'Gestisci il tuo diario alimentare quotidiano con NutriFit',
}

export default function AppPage() {
  return (
    <>
      <AppNavbar />
      <main className="min-h-screen pt-20 pb-24 bg-cream">
        <AppDashboard />
      </main>
    </>
  )
}
