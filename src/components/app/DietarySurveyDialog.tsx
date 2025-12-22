'use client'

/**
 * ============================================
 * DIETARY SURVEY DIALOG - INDAGINE ALIMENTARE
 * ============================================
 * 
 * Dialog per compilare un'indagine sulle abitudini alimentari.
 * Le domande variano in base al tipo di dieta (onnivoro, vegetariano, vegano).
 * Replica DietarySurveyDialog dell'app Android.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ClipboardList, ChevronRight, ChevronLeft, Check, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

// =========== TYPES ===========
interface SurveyQuestion {
  id: string
  question: string
  options: string[]
}

interface SurveyAnswer {
  questionId: string
  answer: string
}

interface DietarySurveyDialogProps {
  isOpen: boolean
  onClose: () => void
}

// =========== QUESTIONS DATA ===========
const OMNIVORE_QUESTIONS: SurveyQuestion[] = [
  { id: 'q1', question: 'Quanti pasti fai al giorno?', options: ['1-2', '3', '4-5', '6 o più'] },
  { id: 'q2', question: 'Quanto spesso mangi carne rossa?', options: ['Mai', '1-2 volte/settimana', '3-4 volte/settimana', 'Ogni giorno'] },
  { id: 'q3', question: 'Quanto spesso mangi pesce?', options: ['Mai', '1-2 volte/settimana', '3-4 volte/settimana', 'Ogni giorno'] },
  { id: 'q4', question: 'Quante porzioni di frutta mangi al giorno?', options: ['0', '1-2', '3-4', '5 o più'] },
  { id: 'q5', question: 'Quante porzioni di verdura mangi al giorno?', options: ['0', '1-2', '3-4', '5 o più'] },
  { id: 'q6', question: 'Bevi bibite zuccherate?', options: ['Mai', 'Raramente', 'Spesso', 'Ogni giorno'] },
  { id: 'q7', question: 'Quanto spesso mangi dolci?', options: ['Mai', 'Raramente', 'Spesso', 'Ogni giorno'] },
  { id: 'q8', question: 'Fai colazione regolarmente?', options: ['Mai', 'A volte', 'Spesso', 'Sempre'] },
]

const VEGETARIAN_QUESTIONS: SurveyQuestion[] = [
  { id: 'q1', question: 'Quanti pasti fai al giorno?', options: ['1-2', '3', '4-5', '6 o più'] },
  { id: 'q2', question: 'Quanto spesso mangi latticini?', options: ['Mai', '1-2 volte/settimana', 'Ogni giorno', 'Più volte al giorno'] },
  { id: 'q3', question: 'Quanto spesso mangi uova?', options: ['Mai', '1-2 volte/settimana', '3-4 volte/settimana', 'Ogni giorno'] },
  { id: 'q4', question: 'Assumi integratori (B12, ferro, ecc.)?', options: ['Mai', 'A volte', 'Regolarmente', 'Ogni giorno'] },
  { id: 'q5', question: 'Quante porzioni di legumi mangi a settimana?', options: ['0-1', '2-3', '4-5', '6 o più'] },
  { id: 'q6', question: 'Quante porzioni di frutta secca/semi al giorno?', options: ['0', '1', '2-3', '4 o più'] },
]

const VEGAN_QUESTIONS: SurveyQuestion[] = [
  { id: 'q1', question: 'Quanti pasti fai al giorno?', options: ['1-2', '3', '4-5', '6 o più'] },
  { id: 'q2', question: 'Assumi vitamina B12?', options: ['Mai', 'A volte', 'Regolarmente', 'Ogni giorno'] },
  { id: 'q3', question: 'Quante porzioni di legumi mangi a settimana?', options: ['0-2', '3-5', '6-8', '9 o più'] },
  { id: 'q4', question: 'Usi latte vegetale fortificato?', options: ['Mai', 'A volte', 'Spesso', 'Ogni giorno'] },
  { id: 'q5', question: 'Mangi tofu o tempeh regolarmente?', options: ['Mai', '1-2 volte/settimana', '3-4 volte/settimana', 'Ogni giorno'] },
  { id: 'q6', question: 'Assumi integratori di omega-3 (alghe)?', options: ['Mai', 'A volte', 'Regolarmente', 'Ogni giorno'] },
]

// =========== COMPONENT ===========
export function DietarySurveyDialog({ isOpen, onClose }: DietarySurveyDialogProps) {
  const { profile } = useAppStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswer[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrifit_dietary_survey')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // Seleziona le domande in base alla dieta
  const questions = useMemo(() => {
    switch (profile.dietStyle) {
      case 'VEGETARIAN': return VEGETARIAN_QUESTIONS
      case 'VEGAN': return VEGAN_QUESTIONS
      default: return OMNIVORE_QUESTIONS
    }
  }, [profile.dietStyle])

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Trova la risposta corrente per questa domanda
  const currentAnswer = answers.find(a => a.questionId === currentQ?.id)?.answer

  const handleAnswer = (answer: string) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQ.id)
      return [...filtered, { questionId: currentQ.id, answer }]
    })
  }

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_dietary_survey', JSON.stringify(answers))
    }
    onClose()
  }

  const isComplete = answers.length === questions.length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <ClipboardList className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Indagine Alimentare</h2>
                <p className="text-xs text-gray-500">
                  Domanda {currentQuestion + 1} di {questions.length}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-100">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question */}
          <div className="p-6">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentQ.question}
              </h3>
              
              <div className="space-y-2">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                      currentAnswer === option
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="text-gray-700">{option}</span>
                    {currentAnswer === option && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Indietro
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={goNext}
                disabled={!currentAnswer}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Avanti <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!isComplete}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" /> Salva
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
