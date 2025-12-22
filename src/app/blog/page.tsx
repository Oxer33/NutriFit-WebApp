/**
 * ============================================
 * BLOG PAGE
 * ============================================
 */

import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { BlogHero } from '@/components/blog/BlogHero'
import { BlogGrid } from '@/components/blog/BlogGrid'

export const metadata = {
  title: 'Blog',
  description: 'Articoli, guide e consigli sulla nutrizione, benessere e stile di vita sano.',
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <BlogHero />
        <BlogGrid />
      </main>
      <Footer />
    </>
  )
}
