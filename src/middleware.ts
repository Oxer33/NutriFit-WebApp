/**
 * ============================================
 * MIDDLEWARE - PROTEZIONE ROUTE
 * ============================================
 * 
 * Middleware per proteggere le route che richiedono autenticazione.
 * Redirige a /auth/login se l'utente non è autenticato.
 */

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Route che richiedono autenticazione
const protectedRoutes = ['/app']

// Route pubbliche (non richiedono auth)
const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/verify', '/onboarding']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  
  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith('/auth/')
  )
  
  // Se route protetta e non loggato, redirect a login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Se già loggato e prova ad accedere a login/register, redirect a /app
  if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/app', nextUrl))
  }
  
  return NextResponse.next()
})

// Configura quali path il middleware deve processare
export const config = {
  matcher: [
    // Match tutte le route tranne API, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|icons|sw.js|manifest.webmanifest).*)'
  ]
}
