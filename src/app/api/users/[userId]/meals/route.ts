/**
 * ============================================
 * API USER MEALS - GESTIONE PASTI UTENTE
 * ============================================
 * 
 * Endpoints:
 * - GET /api/users/{userId}/meals?date={date} - Diario giornaliero
 * - GET /api/users/{userId}/meals?from={date}&to={date} - Range di date
 * - POST /api/users/{userId}/meals - Registra pasto
 * 
 * SICUREZZA: Verifica che l'utente acceda solo ai propri dati
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { 
  addMeal, 
  getDailyDiary, 
  getMealsInRange,
  getPeriodStats,
  MEAL_TYPES,
  type MealTypeDB
} from '@/lib/mealService'

// =========== HELPER: Verifica autorizzazione ===========

async function checkAuthorization(userId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { authorized: false, error: 'Non autenticato', status: 401 }
  }
  
  if (session.user.id !== userId) {
    return { authorized: false, error: 'Accesso non autorizzato', status: 403 }
  }
  
  return { authorized: true, session }
}

// =========== GET - DIARIO PASTI ===========

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const stats = searchParams.get('stats') === 'true'

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

    // Range di date con statistiche
    if (from && to) {
      const startDate = new Date(from)
      const endDate = new Date(to)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json({ 
          success: false, 
          error: 'Date non valide (formato: YYYY-MM-DD)' 
        }, { status: 400 })
      }

      if (stats) {
        const periodStats = await getPeriodStats(userId, startDate, endDate)
        return NextResponse.json({ 
          success: true, 
          data: periodStats 
        })
      }

      const meals = await getMealsInRange(userId, startDate, endDate)
      return NextResponse.json({ 
        success: true, 
        data: { meals, count: meals.length } 
      })
    }

    // Diario giornaliero (default: oggi)
    const targetDate = date ? new Date(date) : new Date()
    
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ 
        success: false, 
        error: 'Data non valida (formato: YYYY-MM-DD)' 
      }, { status: 400 })
    }

    const diary = await getDailyDiary(userId, targetDate)
    
    return NextResponse.json({ 
      success: true, 
      data: diary 
    })

  } catch (error: any) {
    console.error('[API Meals] Errore GET:', error)
    
    if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json({ 
        success: false, 
        error: 'Servizio temporaneamente sovraccarico',
        code: 'THROTTLED'
      }, { status: 503 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Errore interno del server' 
    }, { status: 500 })
  }
}

// =========== POST - REGISTRA PASTO ===========

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

    // Validazione campi obbligatori
    const required = [
      'food_id', 'food_name', 'quantity_grams',
      'calories_per_100g', 'proteins_per_100g', 
      'carbs_per_100g', 'fats_per_100g', 'meal_type'
    ]
    const missing = required.filter(field => body[field] === undefined)
    
    if (missing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Campi obbligatori mancanti: ${missing.join(', ')}` 
      }, { status: 400 })
    }

    // Validazione quantità > 0
    if (body.quantity_grams <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'quantity_grams deve essere > 0' 
      }, { status: 400 })
    }

    // Validazione meal_type
    const validMealTypes = Object.values(MEAL_TYPES)
    if (!validMealTypes.includes(body.meal_type)) {
      return NextResponse.json({ 
        success: false, 
        error: `meal_type non valido. Valori accettati: ${validMealTypes.join(', ')}` 
      }, { status: 400 })
    }

    // Data opzionale (default: oggi)
    const mealDate = body.date ? new Date(body.date) : new Date()

    const meal = await addMeal(userId, {
      food_id: body.food_id,
      food_name: body.food_name,
      quantity_grams: body.quantity_grams,
      calories_per_100g: body.calories_per_100g,
      proteins_per_100g: body.proteins_per_100g,
      carbs_per_100g: body.carbs_per_100g,
      fats_per_100g: body.fats_per_100g,
      fiber_per_100g: body.fiber_per_100g,
      meal_type: body.meal_type as MealTypeDB,
      notes: body.notes,
      source: body.source
    }, mealDate)

    return NextResponse.json({ 
      success: true, 
      data: meal 
    }, { status: 201 })

  } catch (error: any) {
    console.error('[API Meals] Errore POST:', error)
    
    if (error.message?.includes('quantità')) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }

    if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json({ 
        success: false, 
        error: 'Servizio temporaneamente sovraccarico',
        code: 'THROTTLED'
      }, { status: 503 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Errore interno del server' 
    }, { status: 500 })
  }
}
