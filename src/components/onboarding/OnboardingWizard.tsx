'use client'

/**
 * ============================================
 * ONBOARDING WIZARD
 * ============================================
 * 
 * Wizard completo per l'onboarding utente
 * 11 step come nell'app Android originale
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { 
  OnboardingSteps, 
  type OnboardingStep,
  type UserProfile,
  type Gender,
  type Goal,
  type ActivityLevel,
  type DietStyle,
  type WeightChangeRate
} from '@/types'

// Import step components
import { StepName } from './steps/StepName'
import { StepAge } from './steps/StepAge'
import { StepHeight } from './steps/StepHeight'
import { StepWeight } from './steps/StepWeight'
import { StepGender } from './steps/StepGender'
import { StepGoal } from './steps/StepGoal'
import { StepActivity } from './steps/StepActivity'
import { StepDiet } from './steps/StepDiet'
import { StepWeightChangeRate } from './steps/StepWeightChangeRate'
import { StepTerms } from './steps/StepTerms'
import { StepWelcome } from './steps/StepWelcome'

/** Dati temporanei durante l'onboarding */
interface OnboardingData {
  name: string
  age: number | null
  heightCm: number | null
  weightKg: number | null
  gender: Gender | null
  goal: Goal | null
  activityLevel: ActivityLevel | null
  dietStyle: DietStyle | null
  weightChangeRate: WeightChangeRate | null
  termsAccepted: boolean
}

const initialData: OnboardingData = {
  name: '',
  age: null,
  heightCm: null,
  weightKg: null,
  gender: null,
  goal: null,
  activityLevel: null,
  dietStyle: null,
  weightChangeRate: null,
  termsAccepted: false
}

export function OnboardingWizard() {
  const router = useRouter()
  const { setProfile } = useAppStore()
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [direction, setDirection] = useState(0) // -1 = back, 1 = forward
  
  const currentStep = OnboardingSteps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === OnboardingSteps.length - 1
  const progress = ((currentStepIndex + 1) / OnboardingSteps.length) * 100

  // Verifica se lo step corrente è valido per procedere
  const isStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case 'NAME':
        return data.name.trim().length >= 2
      case 'AGE':
        return data.age !== null && data.age >= 10 && data.age <= 120
      case 'HEIGHT':
        return data.heightCm !== null && data.heightCm >= 100 && data.heightCm <= 250
      case 'WEIGHT':
        return data.weightKg !== null && data.weightKg >= 30 && data.weightKg <= 300
      case 'GENDER':
        return data.gender !== null
      case 'GOAL':
        return data.goal !== null
      case 'ACTIVITY':
        return data.activityLevel !== null
      case 'DIET':
        return data.dietStyle !== null
      case 'WEIGHT_CHANGE_RATE':
        return data.weightChangeRate !== null
      case 'TERMS':
        return data.termsAccepted
      case 'WELCOME':
        return true
      default:
        return false
    }
  }, [currentStep, data])

  // Gestisce il passaggio allo step successivo
  const handleNext = useCallback(() => {
    if (!isStepValid()) return
    
    if (isLastStep) {
      // Salva il profilo e vai alla app
      const profile: UserProfile = {
        name: data.name,
        age: data.age!,
        gender: data.gender!,
        heightCm: data.heightCm!,
        weightKg: data.weightKg!,
        goal: data.goal!,
        activityLevel: data.activityLevel!,
        dietStyle: data.dietStyle!,
        weightChangeRate: data.weightChangeRate!,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setProfile(profile)
      router.push('/app')
    } else {
      setDirection(1)
      setCurrentStepIndex(prev => prev + 1)
    }
  }, [isStepValid, isLastStep, data, setProfile, router])

  // Gestisce il ritorno allo step precedente
  const handleBack = useCallback(() => {
    if (isFirstStep) return
    setDirection(-1)
    setCurrentStepIndex(prev => prev - 1)
  }, [isFirstStep])

  // Aggiorna i dati
  const updateData = useCallback(<K extends keyof OnboardingData>(
    key: K, 
    value: OnboardingData[K]
  ) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  // Render del componente step corrente
  const renderStep = () => {
    const props = { data, updateData }
    
    switch (currentStep) {
      case 'NAME':
        return <StepName {...props} />
      case 'AGE':
        return <StepAge {...props} />
      case 'HEIGHT':
        return <StepHeight {...props} />
      case 'WEIGHT':
        return <StepWeight {...props} />
      case 'GENDER':
        return <StepGender {...props} />
      case 'GOAL':
        return <StepGoal {...props} />
      case 'ACTIVITY':
        return <StepActivity {...props} />
      case 'DIET':
        return <StepDiet {...props} />
      case 'WEIGHT_CHANGE_RATE':
        return <StepWeightChangeRate {...props} />
      case 'TERMS':
        return <StepTerms {...props} />
      case 'WELCOME':
        return <StepWelcome data={data} />
      default:
        return null
    }
  }

  // Varianti animazione
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="h-1 bg-gray-200">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-primary-dark"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Step indicator */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Passo {currentStepIndex + 1} di {OnboardingSteps.length}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-32">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            disabled={isFirstStep}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
              isFirstStep 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-600 hover:bg-gray-100"
            )}
            whileHover={!isFirstStep ? { scale: 1.02 } : {}}
            whileTap={!isFirstStep ? { scale: 0.98 } : {}}
          >
            <ChevronLeft className="w-5 h-5" />
            Indietro
          </motion.button>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all",
              isStepValid()
                ? "btn-gradient text-white shadow-soft"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
            whileHover={isStepValid() ? { scale: 1.02 } : {}}
            whileTap={isStepValid() ? { scale: 0.98 } : {}}
          >
            {isLastStep ? 'Inizia!' : 'Avanti'}
            {!isLastStep && <ChevronRight className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
