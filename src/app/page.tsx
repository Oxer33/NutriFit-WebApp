/**
 * ============================================
 * HOMEPAGE - NUTRIFIT WEB APP
 * ============================================
 * 
 * Pagina principale ultra-moderna con:
 * - Hero full-screen con immagine HD
 * - Sezione Chi Sono split-screen
 * - Bento grid servizi
 * - Contatori animati
 * - Testimonials carousel
 * - CTA finale
 */

import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { AboutPreview } from '@/components/home/AboutPreview'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { StatsCounter } from '@/components/home/StatsCounter'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CTASection } from '@/components/home/CTASection'
import { FeaturesSection } from '@/components/home/FeaturesSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      <main className="overflow-hidden">
        {/* Hero Section - Full screen con immagine HD */}
        <HeroSection />
        
        {/* Sezione Chi Sono - Preview */}
        <AboutPreview />
        
        {/* Contatori animati */}
        <StatsCounter />
        
        {/* Features dell'App */}
        <FeaturesSection />
        
        {/* Griglia Servizi - Bento style */}
        <ServicesGrid />
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* CTA Finale */}
        <CTASection />
      </main>
      
      <Footer />
    </>
  )
}
