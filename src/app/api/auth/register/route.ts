/**
 * ============================================
 * API REGISTER - REGISTRAZIONE UTENTI
 * ============================================
 * 
 * POST /api/auth/register
 * Registra nuovo utente e invia email di verifica
 */

import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/userService'
import { sendVerificationEmail } from '@/lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validazione campi obbligatori
    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email, password e nome sono obbligatori'
      }, { status: 400 })
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Email non valida'
      }, { status: 400 })
    }

    // Validazione password (minimo 8 caratteri)
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'La password deve contenere almeno 8 caratteri'
      }, { status: 400 })
    }

    // Validazione nome (minimo 2 caratteri)
    if (name.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Il nome deve contenere almeno 2 caratteri'
      }, { status: 400 })
    }

    // Crea utente
    const { user, verificationToken } = await createUser({
      email,
      password,
      name
    })

    // Invia email di verifica
    const emailSent = await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    )

    if (!emailSent) {
      console.warn('[Register] Email di verifica non inviata')
    }

    return NextResponse.json({
      success: true,
      message: 'Registrazione completata! Controlla la tua email per verificare l\'account.',
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('[API Register] Errore:', error)

    // Errore email già registrata
    if (error.message === 'Email già registrata') {
      return NextResponse.json({
        success: false,
        error: 'Questa email è già registrata. Prova ad accedere.'
      }, { status: 409 })
    }

    // Errore DynamoDB throttling
    if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json({
        success: false,
        error: 'Servizio temporaneamente sovraccarico, riprova tra qualche secondo'
      }, { status: 503 })
    }

    return NextResponse.json({
      success: false,
      error: 'Errore durante la registrazione. Riprova.'
    }, { status: 500 })
  }
}
