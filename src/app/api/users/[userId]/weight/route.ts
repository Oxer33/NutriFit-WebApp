/**
 * ============================================
 * API WEIGHT - STORICO PESO UTENTE
 * ============================================
 * 
 * Endpoints:
 * - GET /api/users/{userId}/weight - Ottieni storico peso
 * - GET /api/users/{userId}/weight?stats=true - Statistiche peso
 * - POST /api/users/{userId}/weight - Aggiungi nuovo peso
 * - DELETE /api/users/{userId}/weight?date={date} - Elimina peso
 * 
 * SICUREZZA: Tutte le API verificano che l'utente autenticato
 * possa accedere solo ai propri dati (userId == session.user.id)
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  addWeightEntry, 
  getWeightHistory, 
  getWeightStats,
  deleteWeightEntry 
} from '@/lib/userService'

// =========== HELPER: Verifica autorizzazione ===========

async function checkAuthorization(userId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { authorized: false, error: 'Non autenticato', status: 401 }
  }
  
  // L'utente può accedere solo ai propri dati
  if (session.user.id !== userId) {
    return { authorized: false, error: 'Accesso non autorizzato', status: 403 }
  }
  
  return { authorized: true, session }
}

// =========== GET - STORICO PESO ===========

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const { searchParams } = new URL(request.url)
    const stats = searchParams.get('stats') === 'true'
    const limit = parseInt(searchParams.get('limit') || '90')

    // Validazione userId
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId richiesto'
      }, { status: 400 })
    }
    
    // SICUREZZA: Verifica autorizzazione
    const authCheck = await checkAuthorization(userId)
    if (!authCheck.authorized) {
      return NextResponse.json({
        success: false,
        error: authCheck.error
      }, { status: authCheck.status })
    }

    // Ritorna statistiche
    if (stats) {
      const weightStats = await getWeightStats(userId)
      return NextResponse.json({
        success: true,
        data: weightStats
      })
    }

    // Ritorna storico
    const history = await getWeightHistory(userId, limit)
    return NextResponse.json({
      success: true,
      data: {
        entries: history,
        count: history.length
      }
    })

  } catch (error: any) {
    console.error('[API Weight] Errore GET:', error)

    if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json({
        success: false,
        error: 'Servizio temporaneamente sovraccarico'
      }, { status: 503 })
    }

    return NextResponse.json({
      success: false,
      error: 'Errore interno del server'
    }, { status: 500 })
  }
}

// =========== POST - AGGIUNGI PESO ===========

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const body = await request.json()

    // Validazione userId
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId richiesto'
      }, { status: 400 })
    }
    
    // SICUREZZA: Verifica autorizzazione
    const authCheck = await checkAuthorization(userId)
    if (!authCheck.authorized) {
      return NextResponse.json({
        success: false,
        error: authCheck.error
      }, { status: authCheck.status })
    }

    // Validazione peso
    const { weight_kg, date, notes } = body

    if (!weight_kg || typeof weight_kg !== 'number') {
      return NextResponse.json({
        success: false,
        error: 'weight_kg richiesto (numero)'
      }, { status: 400 })
    }

    // Validazione range peso (20-300 kg)
    if (weight_kg < 20 || weight_kg > 300) {
      return NextResponse.json({
        success: false,
        error: 'Peso deve essere tra 20 e 300 kg'
      }, { status: 400 })
    }

    // Data opzionale (default: oggi)
    const entryDate = date ? new Date(date) : new Date()

    if (isNaN(entryDate.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Data non valida'
      }, { status: 400 })
    }

    // Aggiungi peso
    const entry = await addWeightEntry(userId, weight_kg, entryDate, notes)

    return NextResponse.json({
      success: true,
      data: entry,
      message: 'Peso registrato con successo'
    }, { status: 201 })

  } catch (error: any) {
    console.error('[API Weight] Errore POST:', error)

    if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json({
        success: false,
        error: 'Servizio temporaneamente sovraccarico'
      }, { status: 503 })
    }

    return NextResponse.json({
      success: false,
      error: 'Errore durante il salvataggio'
    }, { status: 500 })
  }
}

// =========== DELETE - ELIMINA PESO ===========

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    // Validazione
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId richiesto'
      }, { status: 400 })
    }
    
    // SICUREZZA: Verifica autorizzazione
    const authCheck = await checkAuthorization(userId)
    if (!authCheck.authorized) {
      return NextResponse.json({
        success: false,
        error: authCheck.error
      }, { status: authCheck.status })
    }

    if (!date) {
      return NextResponse.json({
        success: false,
        error: 'Query param date richiesto (YYYY-MM-DD)'
      }, { status: 400 })
    }

    // Elimina peso
    const deleted = await deleteWeightEntry(userId, date)

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Errore durante eliminazione'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Peso eliminato'
    })

  } catch (error: any) {
    console.error('[API Weight] Errore DELETE:', error)

    return NextResponse.json({
      success: false,
      error: 'Errore interno del server'
    }, { status: 500 })
  }
}
