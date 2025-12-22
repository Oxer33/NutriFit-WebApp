/**
 * ============================================
 * OPENROUTER API - AI INTEGRATION
 * ============================================
 * 
 * Integrazione con OpenRouter per generazione piani alimentari
 * usando il modello DeepSeek R1.
 * 
 * NOTA: La chiave API è gestita tramite variabili d'ambiente
 * per sicurezza. In produzione, usare un backend sicuro.
 */

// =========== CONFIGURATION ===========

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'deepseek/deepseek-r1-0528:free'

// Chiave API (da variabile d'ambiente in produzione)
// Per sviluppo, la chiave è inserita direttamente
const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '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'

// =========== TYPES ===========

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterResponse {
  id: string
  choices: {
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface UserProfileForAI {
  name: string
  gender: 'male' | 'female'
  age: number
  height: number
  weight: number
  activityLevel: 'sedentary' | 'active'
  goal: 'loss' | 'maintain' | 'gain'
  targetCalories: number
  allergies?: string[]
  preferences?: string[]
}

// =========== SYSTEM PROMPTS ===========

const NUTRITIONIST_SYSTEM_PROMPT = `Sei un nutrizionista professionista italiano esperto in nutrizione clinica, nutrizione sportiva e medicina integrativa. 

Il tuo compito è:
1. Fornire consigli nutrizionali personalizzati basati sul profilo dell'utente
2. Creare piani alimentari equilibrati e sostenibili
3. Rispondere a domande sulla nutrizione con precisione scientifica
4. Usare un tono professionale ma amichevole

Linee guida:
- Usa sempre le unità metriche (kg, cm, kcal)
- Fornisci spiegazioni chiare e comprensibili
- Quando crei piani alimentari, includi sempre i valori nutrizionali
- Considera sempre le preferenze e le eventuali allergie dell'utente
- Promuovi un approccio equilibrato, non diete estreme
- Se l'utente ha condizioni mediche, consiglia sempre di consultare un medico

Formatta le tue risposte in modo chiaro usando:
- Titoli e sottotitoli quando appropriato
- Elenchi puntati per liste di alimenti
- Tabelle testuali per i valori nutrizionali quando richiesto`

const MEAL_PLAN_SYSTEM_PROMPT = `Sei un nutrizionista esperto che crea piani alimentari personalizzati.

Quando crei un piano alimentare:
1. Rispetta il fabbisogno calorico giornaliero dell'utente
2. Bilancia i macronutrienti (proteine ~25-30%, carboidrati ~45-50%, grassi ~25-30%)
3. Includi 5 pasti: colazione, spuntino mattina, pranzo, spuntino pomeriggio, cena
4. Usa alimenti tipici della dieta mediterranea
5. Fornisci porzioni precise in grammi
6. Calcola i valori nutrizionali per ogni pasto

Formato output per ogni pasto:
- Nome del pasto
- Lista alimenti con quantità
- Calorie totali
- Proteine, Carboidrati, Grassi`

// =========== API FUNCTIONS ===========

/**
 * Invia un messaggio all'AI e ottiene la risposta
 */
export async function sendMessage(
  messages: ChatMessage[],
  systemPrompt: string = NUTRITIONIST_SYSTEM_PROMPT
): Promise<string> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://nutrifit.com',
        'X-Title': 'NutriFit Web App',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`
      )
    }

    const data: OpenRouterResponse = await response.json()
    return data.choices[0]?.message?.content || 'Mi dispiace, non sono riuscito a generare una risposta.'
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw error
  }
}

/**
 * Genera un piano alimentare personalizzato
 */
export async function generateMealPlan(
  profile: UserProfileForAI,
  days: number = 1,
  preferences?: string
): Promise<string> {
  const profileDescription = `
Profilo utente:
- Nome: ${profile.name}
- Genere: ${profile.gender === 'male' ? 'Uomo' : 'Donna'}
- Età: ${profile.age} anni
- Altezza: ${profile.height} cm
- Peso: ${profile.weight} kg
- Livello attività: ${profile.activityLevel === 'sedentary' ? 'Sedentario' : 'Attivo'}
- Obiettivo: ${profile.goal === 'loss' ? 'Dimagrimento' : profile.goal === 'gain' ? 'Aumento massa' : 'Mantenimento'}
- Fabbisogno calorico: ${profile.targetCalories} kcal/giorno
${profile.allergies?.length ? `- Allergie/intolleranze: ${profile.allergies.join(', ')}` : ''}
${profile.preferences?.length ? `- Preferenze alimentari: ${profile.preferences.join(', ')}` : ''}
${preferences ? `- Note aggiuntive: ${preferences}` : ''}
`

  const userMessage = `
${profileDescription}

Per favore, crea un piano alimentare dettagliato per ${days} ${days === 1 ? 'giorno' : 'giorni'}.
Includi tutti e 5 i pasti con porzioni precise e valori nutrizionali.
`

  return sendMessage(
    [{ role: 'user', content: userMessage }],
    MEAL_PLAN_SYSTEM_PROMPT
  )
}

/**
 * Analizza la dieta dell'utente e fornisce suggerimenti
 */
export async function analyzeDiet(
  meals: { name: string; calories: number; proteins: number; carbs: number; fats: number }[],
  targetCalories: number
): Promise<string> {
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0)
  const totalProteins = meals.reduce((sum, m) => sum + m.proteins, 0)
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0)
  const totalFats = meals.reduce((sum, m) => sum + m.fats, 0)

  const userMessage = `
Analizza la mia dieta di oggi:

Pasti consumati:
${meals.map((m) => `- ${m.name}: ${m.calories} kcal (P: ${m.proteins}g, C: ${m.carbs}g, G: ${m.fats}g)`).join('\n')}

Totali:
- Calorie: ${totalCalories} / ${targetCalories} kcal
- Proteine: ${totalProteins}g
- Carboidrati: ${totalCarbs}g
- Grassi: ${totalFats}g

Per favore:
1. Valuta se ho raggiunto i miei obiettivi calorici
2. Commenta il bilanciamento dei macronutrienti
3. Suggerisci eventuali miglioramenti
`

  return sendMessage([{ role: 'user', content: userMessage }])
}

/**
 * Chat generica con l'AI nutrizionista
 */
export async function chat(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  return sendMessage([
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ])
}

/**
 * Cerca informazioni nutrizionali su un alimento
 */
export async function searchFoodInfo(foodName: string): Promise<string> {
  const userMessage = `
Fornisci informazioni nutrizionali dettagliate per: "${foodName}"

Includi:
1. Valori nutrizionali per 100g
2. Benefici per la salute
3. Suggerimenti di consumo
4. Eventuali controindicazioni
`

  return sendMessage([{ role: 'user', content: userMessage }])
}
