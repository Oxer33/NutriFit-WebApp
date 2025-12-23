/**
 * ============================================
 * API FOODS - GESTIONE ALIMENTI
 * ============================================
 * 
 * Endpoints:
 * - GET /api/foods?q={query} - Cerca alimenti
 * - GET /api/foods?barcode={code} - Cerca per barcode
 * - POST /api/foods - Aggiungi alimento
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchFoods, searchByBarcode, createFood, type FoodItemDB } from '@/lib/foodService'

// =========== GET - RICERCA ALIMENTI ===========

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const barcode = searchParams.get('barcode')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Ricerca per barcode
    if (barcode) {
      const food = await searchByBarcode(barcode)
      
      if (food) {
        return NextResponse.json({ 
          success: true, 
          data: food 
        })
      }
      
      return NextResponse.json({ 
        success: false, 
        error: 'Prodotto non trovato',
        data: null 
      }, { status: 404 })
    }

    // Ricerca per nome
    if (query) {
      // Validazione: minimo 2 caratteri
      if (query.length < 2) {
        return NextResponse.json({ 
          success: false, 
          error: 'La ricerca richiede almeno 2 caratteri',
          data: { items: [], count: 0 }
        }, { status: 400 })
      }

      const result = await searchFoods(query, limit)
      
      return NextResponse.json({ 
        success: true, 
        data: result 
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Parametro q o barcode richiesto',
      data: null 
    }, { status: 400 })

  } catch (error: any) {
    console.error('[API Foods] Errore GET:', error)
    
    // Gestione errori specifici DynamoDB
    if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json({ 
        success: false, 
        error: 'Servizio temporaneamente sovraccarico, riprova tra qualche secondo',
        code: 'THROTTLED'
      }, { status: 503 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Errore interno del server' 
    }, { status: 500 })
  }
}

// =========== POST - AGGIUNGI ALIMENTO ===========

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validazione campi obbligatori
    const required = ['name', 'calories_per_100g', 'proteins_per_100g', 'carbs_per_100g', 'fats_per_100g']
    const missing = required.filter(field => body[field] === undefined)
    
    if (missing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Campi obbligatori mancanti: ${missing.join(', ')}` 
      }, { status: 400 })
    }

    // Validazione valori numerici >= 0
    const numericFields = ['calories_per_100g', 'proteins_per_100g', 'carbs_per_100g', 'fats_per_100g', 'fiber_per_100g']
    for (const field of numericFields) {
      if (body[field] !== undefined && (typeof body[field] !== 'number' || body[field] < 0)) {
        return NextResponse.json({ 
          success: false, 
          error: `${field} deve essere un numero >= 0` 
        }, { status: 400 })
      }
    }

    const food = await createFood({
      name: body.name,
      calories_per_100g: body.calories_per_100g,
      proteins_per_100g: body.proteins_per_100g,
      carbs_per_100g: body.carbs_per_100g,
      fats_per_100g: body.fats_per_100g,
      fiber_per_100g: body.fiber_per_100g || 0,
      sugar_per_100g: body.sugar_per_100g,
      category: body.category || 'altro',
      brand: body.brand,
      barcode: body.barcode,
      source: body.source || 'custom',
      country: body.country
    })

    return NextResponse.json({ 
      success: true, 
      data: food 
    }, { status: 201 })

  } catch (error: any) {
    console.error('[API Foods] Errore POST:', error)
    
    if (error.name === 'ProvisionedThroughputExceededException') {
      return NextResponse.json({ 
        success: false, 
        error: 'Servizio temporaneamente sovraccarico, riprova tra qualche secondo',
        code: 'THROTTLED'
      }, { status: 503 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Errore interno del server' 
    }, { status: 500 })
  }
}
