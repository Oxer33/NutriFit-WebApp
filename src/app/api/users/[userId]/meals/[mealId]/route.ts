/**
 * ============================================
 * API MEAL SINGOLO - MODIFICA/ELIMINA PASTO
 * ============================================
 * 
 * Endpoints:
 * - PUT /api/users/{userId}/meals/{mealId} - Modifica pasto
 * - DELETE /api/users/{userId}/meals/{mealId} - Elimina pasto
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateMeal, deleteMeal, MEAL_TYPES } from '@/lib/mealService'
import type { MealTypeDB } from '@/lib/dynamodb'

// =========== PUT - MODIFICA PASTO ===========

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; mealId: string }> }
) {
  try {
    const { userId, mealId } = await params
    const body = await request.json()

    // Validazione parametri
    if (!userId || !mealId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId e mealId richiesti' 
      }, { status: 400 })
    }

    // Campi obbligatori per identificare il pasto
    if (!body.date || !body.meal_type) {
      return NextResponse.json({ 
        success: false, 
        error: 'date e meal_type richiesti per identificare il pasto' 
      }, { status: 400 })
    }

    // Validazione meal_type
    const validMealTypes = Object.values(MEAL_TYPES)
    if (!validMealTypes.includes(body.meal_type)) {
      return NextResponse.json({ 
        success: false, 
        error: `meal_type non valido` 
      }, { status: 400 })
    }

    const updated = await updateMeal(
      userId,
      mealId,
      body.date,
      body.meal_type as MealTypeDB,
      {
        quantity_grams: body.quantity_grams,
        calories_per_100g: body.calories_per_100g,
        proteins_per_100g: body.proteins_per_100g,
        carbs_per_100g: body.carbs_per_100g,
        fats_per_100g: body.fats_per_100g,
        fiber_per_100g: body.fiber_per_100g,
        notes: body.notes
      }
    )

    if (!updated) {
      return NextResponse.json({ 
        success: false, 
        error: 'Pasto non trovato' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      data: updated 
    })

  } catch (error: any) {
    console.error('[API Meal] Errore PUT:', error)
    
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

// =========== DELETE - ELIMINA PASTO ===========

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; mealId: string }> }
) {
  try {
    const { userId, mealId } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const mealType = searchParams.get('meal_type')

    // Validazione parametri
    if (!userId || !mealId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId e mealId richiesti' 
      }, { status: 400 })
    }

    if (!date || !mealType) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query params date e meal_type richiesti' 
      }, { status: 400 })
    }

    // Validazione meal_type
    const validMealTypes = Object.values(MEAL_TYPES)
    if (!validMealTypes.includes(mealType as MealTypeDB)) {
      return NextResponse.json({ 
        success: false, 
        error: `meal_type non valido` 
      }, { status: 400 })
    }

    const deleted = await deleteMeal(userId, mealId, date, mealType as MealTypeDB)

    if (!deleted) {
      return NextResponse.json({ 
        success: false, 
        error: 'Errore eliminazione pasto' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Pasto eliminato' 
    })

  } catch (error: any) {
    console.error('[API Meal] Errore DELETE:', error)
    
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
