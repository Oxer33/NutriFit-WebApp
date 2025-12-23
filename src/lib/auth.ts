/**
 * ============================================
 * AUTH CONFIG - NEXTAUTH.JS CONFIGURATION
 * ============================================
 * 
 * Configurazione NextAuth.js v5 (Auth.js) per:
 * - Autenticazione con email/password (Credentials)
 * - Sessioni JWT
 * - Callbacks personalizzati
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { loginUser, getUserById } from './userService'

// =========== AUTH CONFIG ===========

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Provider Credentials per email/password
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e password richiesti')
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Verifica credenziali con userService
        const result = await loginUser(email, password)

        if (!result.success || !result.user) {
          throw new Error(result.message)
        }

        // Ritorna utente per sessione
        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          emailVerified: result.user.email_verified ? new Date() : null
        }
      }
    })
  ],

  // Pagine personalizzate
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/onboarding'
  },

  // Sessioni JWT (non database)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 giorni
  },

  // Callbacks per personalizzare JWT e sessione
  callbacks: {
    // Aggiungi dati custom al JWT
    async jwt({ token, user, trigger, session }) {
      // Prima volta: aggiungi dati utente
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }

      // Update session: ricarica dati utente
      if (trigger === 'update' && session) {
        // Ricarica profilo da DB
        const freshUser = await getUserById(token.id as string)
        if (freshUser) {
          token.name = freshUser.name
          token.profile = freshUser.profile
        }
      }

      return token
    },

    // Esponi dati alla sessione client
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        // @ts-ignore - aggiungiamo profile alla sessione
        session.user.profile = token.profile
      }
      return session
    },

    // Redirect dopo login
    async redirect({ url, baseUrl }) {
      // Se URL è relativo o stesso dominio, usa quello
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      // Default: vai all'app
      return `${baseUrl}/app`
    }
  },

  // Eventi
  events: {
    async signIn({ user }) {
      console.log(`[Auth] Login: ${user.email}`)
    },
    async signOut() {
      console.log('[Auth] Logout')
    }
  },

  // Debug in development
  debug: process.env.NODE_ENV === 'development',

  // Trust host per deploy
  trustHost: true
})

// =========== TYPES EXTENSION ===========

// Tipi custom per profilo utente
export interface UserProfile {
  gender?: 'male' | 'female'
  birth_date?: string
  height_cm?: number
  current_weight_kg?: number
  target_weight_kg?: number
  activity_level?: string
  goal?: string
  daily_calories?: number
  daily_proteins?: number
  daily_carbs?: number
  daily_fats?: number
}

// Estendi tipi NextAuth per includere campi custom
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      profile?: UserProfile
    }
  }

  interface User {
    id: string
    email: string
    name: string
  }
}
