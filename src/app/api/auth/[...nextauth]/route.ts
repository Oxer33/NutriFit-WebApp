/**
 * ============================================
 * NEXTAUTH API ROUTE
 * ============================================
 * 
 * Handler per tutte le route di autenticazione NextAuth:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback
 * - /api/auth/session
 * - etc.
 */

import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
