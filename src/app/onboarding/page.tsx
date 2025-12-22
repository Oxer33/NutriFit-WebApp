/**
 * ============================================
 * ONBOARDING PAGE
 * ============================================
 * 
 * Pagina di onboarding per la registrazione utente
 * 11 step come nell'app Android originale
 */

import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

export const metadata = {
  title: 'Inizia il tuo percorso - NutriFit',
  description: 'Configura il tuo profilo per iniziare a monitorare la tua nutrizione con NutriFit',
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-white">
      <OnboardingWizard />
    </main>
  )
}
