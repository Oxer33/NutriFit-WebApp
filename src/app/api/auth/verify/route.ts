/**
 * ============================================
 * API VERIFY - VERIFICA EMAIL UTENTE
 * ============================================
 * 
 * GET /api/auth/verify?token={token}
 * Verifica l'email dell'utente con il token
 * 
 * POST /api/auth/verify
 * Richiede nuovo link di verifica
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyEmail, regenerateVerificationToken, getUserByEmail } from '@/lib/userService'
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/emailService'

// GET - Verifica email con token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token di verifica mancante'
      }, { status: 400 })
    }

    // Verifica token
    const result = await verifyEmail(token)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 400 })
    }

    // Invia email di benvenuto
    if (result.userId) {
      const { getUserById } = await import('@/lib/userService')
      const user = await getUserById(result.userId)
      if (user) {
        await sendWelcomeEmail(user.email, user.name)
      }
    }

    return NextResponse.json({
      success: true,
      message: result.message
    })

  } catch (error: any) {
    console.error('[API Verify] Errore GET:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore durante la verifica. Riprova.'
    }, { status: 500 })
  }
}

// POST - Richiedi nuovo link di verifica
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email richiesta'
      }, { status: 400 })
    }

    // Verifica che utente esista
    const user = await getUserByEmail(email)
    if (!user) {
      // Non rivelare se email esiste o meno (sicurezza)
      return NextResponse.json({
        success: true,
        message: 'Se l\'email è registrata, riceverai un nuovo link di verifica.'
      })
    }

    // Se già verificato
    if (user.email_verified) {
      return NextResponse.json({
        success: false,
        error: 'Email già verificata. Puoi accedere.'
      }, { status: 400 })
    }

    // Rigenera token
    const result = await regenerateVerificationToken(email)

    if (!result.success || !result.token) {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 400 })
    }

    // Invia nuova email
    await sendVerificationEmail(user.email, user.name, result.token)

    return NextResponse.json({
      success: true,
      message: 'Nuovo link di verifica inviato! Controlla la tua email.'
    })

  } catch (error: any) {
    console.error('[API Verify] Errore POST:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Errore durante l\'invio. Riprova.'
    }, { status: 500 })
  }
}
