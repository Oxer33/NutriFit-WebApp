'use client'

/**
 * ============================================
 * AI TAB - CHAT CON NUTRIZIONISTA AI
 * ============================================
 * 
 * Chat AI avanzata con:
 * - Integrazione OpenRouter/DeepSeek
 * - Interfaccia conversazionale moderna
 * - Generazione piani alimentari personalizzati
 * - Analisi dieta basata sul diario
 * - Suggerimenti intelligenti
 * - Storico conversazioni
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Utensils,
  ClipboardList,
  MessageCircle,
  Loader2,
  RefreshCw,
  Trash2,
  AlertCircle,
  Zap,
  Apple,
  Scale,
  Dumbbell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { chat, generateMealPlan, analyzeDiet, type ChatMessage as APIChatMessage } from '@/lib/openrouter'

// =========== TYPES ===========

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// =========== QUICK ACTIONS ===========

const quickActions = [
  {
    icon: ClipboardList,
    label: 'Piano Alimentare',
    prompt: 'Genera un piano alimentare personalizzato per oggi basato sul mio profilo nutrizionale.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Utensils,
    label: 'Analizza Dieta',
    prompt: 'Analizza la mia dieta di oggi e dammi suggerimenti per migliorarla.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Apple,
    label: 'Snack Sani',
    prompt: 'Suggeriscimi degli snack sani e gustosi con meno di 150 calorie.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Scale,
    label: 'Calcola Fabbisogno',
    prompt: 'Calcola il mio fabbisogno calorico giornaliero e spiegami come è calcolato.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Dumbbell,
    label: 'Pre/Post Workout',
    prompt: 'Cosa dovrei mangiare prima e dopo l\'allenamento per massimizzare i risultati?',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Zap,
    label: 'Energia & Focus',
    prompt: 'Quali alimenti mi aiutano a mantenere alta l\'energia e la concentrazione durante la giornata?',
    color: 'bg-yellow-100 text-yellow-600',
  },
]

// =========== COMPONENT ===========

export function AITab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Ciao! 👋 Sono il tuo **nutrizionista AI** personale, powered by DeepSeek. Posso aiutarti con piani alimentari, analisi dieta e consigli nutrizionali personalizzati. Come posso aiutarti oggi?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<APIChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Store per profilo utente
  const { profile, getDailyData } = useAppStore()

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Costruisce contesto utente per l'AI
  const buildUserContext = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayData = getDailyData(today)
    
    const totalCalories = todayData.meals.reduce((sum, m) => sum + m.totalCalories, 0)
    const totalProtein = todayData.meals.reduce((sum, m) => sum + m.totalProtein, 0)
    const totalCarbs = todayData.meals.reduce((sum, m) => sum + m.totalCarbs, 0)
    const totalFat = todayData.meals.reduce((sum, m) => sum + m.totalFat, 0)
    
    return `[PROFILO UTENTE]
Nome: ${profile.name || 'Utente'}
Età: ${profile.age || 30} anni
Genere: ${profile.gender === 'M' ? 'Uomo' : profile.gender === 'F' ? 'Donna' : 'Non specificato'}
Altezza: ${profile.heightCm || 170} cm
Peso: ${profile.weightKg || 70} kg
Attività: ${profile.activityLevel === 'ACTIVE' ? 'Attivo' : 'Sedentario'}
Obiettivo: ${profile.goal === 'LOSE_WEIGHT' ? 'Perdere peso' : profile.goal === 'GAIN_WEIGHT' ? 'Aumentare massa' : 'Mantenere peso'}
Dieta: ${profile.dietStyle === 'VEGETARIAN' ? 'Vegetariano' : profile.dietStyle === 'VEGAN' ? 'Vegano' : 'Onnivoro'}

[DATI OGGI]
Calorie: ${totalCalories} kcal | Proteine: ${Math.round(totalProtein)}g | Carb: ${Math.round(totalCarbs)}g | Grassi: ${Math.round(totalFat)}g
Acqua: ${todayData.waterGlasses}/8 bicchieri | Passi: ${todayData.steps}`
  }, [profile, getDailyData])

  const handleSend = useCallback(async (content: string = input) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Aggiungi contesto utente al primo messaggio
      const contextMessage = conversationHistory.length === 0 
        ? buildUserContext() + '\n\nDomanda: ' + content.trim()
        : content.trim()
      
      // Chiama API OpenRouter
      const response = await chat(contextMessage, conversationHistory)
      
      // Aggiorna storico
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: contextMessage },
        { role: 'assistant', content: response }
      ])
      
      // Crea messaggio risposta
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('AI Error:', err)
      setError('Si è verificato un errore. Riprova tra poco.')
      // Fallback a risposta simulata
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimulatedResponse(content),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, conversationHistory, buildUserContext])

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt)
  }
  
  const handleClearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Chat resettata! 🔄 Come posso aiutarti?',
      timestamp: new Date(),
    }])
    setConversationHistory([])
    setError(null)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
      {/* Header con Reset */}
      {messages.length > 1 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Nuova chat
          </button>
        </div>
      )}
      
      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="glass-card px-4 py-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Sto elaborando la risposta...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions - griglia 2x3 */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4"
        >
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex items-center gap-2 p-3 glass-card hover:bg-white/80 transition-colors text-left group"
              >
                <div className={cn("p-2 rounded-lg transition-colors", action.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            )
          })}
        </motion.div>
      )}

      {/* Input Area */}
      <div className="glass-card p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Chiedi al tuo nutrizionista AI..."
              className="w-full px-4 py-3 bg-white/70 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              disabled={isLoading}
            />
          </div>
          <motion.button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={cn(
              'p-3 rounded-xl transition-all',
              input.trim() && !isLoading
                ? 'bg-primary text-white hover:bg-primary-600'
                : 'bg-gray-100 text-gray-400'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Powered by DeepSeek AI • I consigli non sostituiscono il parere medico
        </p>
      </div>
    </div>
  )
}

// =========== MESSAGE BUBBLE ===========

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-start gap-3',
        isUser && 'flex-row-reverse'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser ? 'bg-gray-200' : 'bg-primary'
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-gray-600" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={cn(
        'max-w-[80%] px-4 py-3 rounded-2xl',
        isUser 
          ? 'bg-primary text-white rounded-tr-sm' 
          : 'glass-card rounded-tl-sm'
      )}>
        <p className={cn(
          'text-sm leading-relaxed whitespace-pre-wrap',
          isUser ? 'text-white' : 'text-gray-700'
        )}>
          {formatMessage(message.content)}
        </p>
        <p className={cn(
          'text-xs mt-2',
          isUser ? 'text-white/70' : 'text-gray-400'
        )}>
          {message.timestamp.toLocaleTimeString('it-IT', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </motion.div>
  )
}

// =========== HELPERS ===========

function formatMessage(content: string): string {
  // Converti *testo* in corsivo (per semplicità, qui solo rimuoviamo gli asterischi)
  return content.replace(/\*([^*]+)\*/g, '$1')
}

function getSimulatedResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('piano') || lowerMessage.includes('alimentare')) {
    return `Ecco un esempio di piano alimentare per te:

**COLAZIONE** (320 kcal)
- Yogurt greco 0% (150g) - 90 kcal
- Muesli integrale (40g) - 150 kcal
- Frutti di bosco (100g) - 40 kcal
- Miele (1 cucchiaino) - 40 kcal

**SPUNTINO MATTINA** (150 kcal)
- Mandorle (20g) - 120 kcal
- Mela (1 media) - 30 kcal

**PRANZO** (550 kcal)
- Pasta integrale (80g) - 280 kcal
- Petto di pollo alla griglia (120g) - 140 kcal
- Verdure grigliate (200g) - 80 kcal
- Olio EVO (1 cucchiaio) - 50 kcal

Questo piano è calibrato per un obiettivo di circa 2000 kcal giornaliere. Vuoi che personalizzi ulteriormente?`
  }
  
  if (lowerMessage.includes('analizza') || lowerMessage.includes('dieta')) {
    return `Analizzando la tua dieta di oggi, ecco le mie osservazioni:

✅ **Punti positivi:**
- Buon apporto proteico a colazione
- Presenza di frutta e verdura
- Idratazione nella norma

⚠️ **Aree di miglioramento:**
- Potresti aumentare l'apporto di fibre
- Considera uno spuntino pomeridiano per mantenere stabile la glicemia
- Le proteine a cena potrebbero essere incrementate

💡 **Suggerimento:**
Aggiungi una porzione di legumi durante la settimana per migliorare l'apporto di proteine vegetali e fibre.

Hai domande specifiche su questi suggerimenti?`
  }
  
  if (lowerMessage.includes('snack')) {
    return `Ecco alcuni snack sani sotto le 150 kcal:

🍎 **Frutta fresca**
- 1 mela media (52 kcal)
- 1 banana piccola (90 kcal)
- 150g di fragole (48 kcal)

🥜 **Frutta secca**
- 15g di mandorle (90 kcal)
- 20g di noci (130 kcal)

🥛 **Proteine**
- Yogurt greco 0% (100g) - 60 kcal
- 1 uovo sodo (78 kcal)

🥒 **Verdure**
- Carote baby con hummus (2 cucchiai) - 100 kcal
- Cetrioli con tzatziki light - 80 kcal

Quale preferisci provare?`
  }
  
  return `Grazie per la tua domanda! Come nutrizionista AI, sono qui per aiutarti con qualsiasi aspetto della tua alimentazione.

Posso aiutarti con:
- 📋 Piani alimentari personalizzati
- 🔍 Analisi della tua dieta
- 💡 Suggerimenti per snack sani
- 📊 Calcolo del fabbisogno calorico
- 🥗 Ricette salutari

Cosa ti interessa approfondire?`
}
