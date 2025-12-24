'use client'

/**
 * ============================================
 * APP DASHBOARD - MAIN COMPONENT
 * ============================================
 * 
 * Dashboard principale dell'app con layout a schede:
 * - Diario (calendario, pasti, calorie)
 * - AI (chat con nutrizionista AI)
 * - Profilo (dati utente, statistiche)
 * 
 * NOTA: Tutti i dati sono reali, caricati dallo store Zustand
 * NON ci sono dati fittizi hardcoded
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Brain, User, Footprints, Droplets, AlertCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { DiaryTab } from './tabs/DiaryTab'
import { AITab } from './tabs/AITab'
import { ProfileTab } from './tabs/ProfileTab'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { calculateCalorieGoal } from '@/types'
import Link from 'next/link'

const tabs = [
  { id: 'diary', label: 'Diario', icon: Calendar },
  { id: 'ai', label: 'AI Coach', icon: Brain },
  { id: 'profile', label: 'Profilo', icon: User },
]

export function AppDashboard() {
  const [activeTab, setActiveTab] = useState('diary')
  const { data: session } = useSession()
  const { profile } = useAppStore()
  
  // Verifica se il profilo è completo (onboarding fatto)
  const isProfileComplete = profile.onboardingCompleted
  
  // Calcola calorie giornaliere obiettivo
  const calorieGoal = isProfileComplete ? calculateCalorieGoal(profile) : 2000
  
  // Calcola calorie consumate oggi (somma di tutti i pasti)
  const todayDate = new Date().toISOString().split('T')[0]
  const todayData = useAppStore.getState().getDailyData(todayDate)
  const todayCalories = todayData.meals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0)
  
  // Dati acqua
  const waterGlasses = todayData.waterGlasses || 0
  
  // Dati passi
  const steps = todayData.steps || 0

  // Se profilo non completo, mostra avviso
  if (!isProfileComplete) {
    return (
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="glass-card p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Completa il tuo profilo
          </h2>
          <p className="text-gray-600 mb-6">
            Per iniziare a usare NutriFit, devi prima completare la configurazione del tuo profilo
            inserendo i tuoi dati personali (altezza, peso, obiettivi).
          </p>
          <Link href="/onboarding">
            <motion.button
              className="btn-gradient"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Configura Profilo
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header con saluto personalizzato */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Ciao, <span className="text-gradient">{profile.name || session?.user?.name || 'Utente'}</span>! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {new Date().toLocaleDateString('it-IT', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </p>
      </motion.div>

      {/* Quick Stats Bar - DATI REALI */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <QuickStatCard
          icon={Calendar}
          label="Calorie Oggi"
          value={todayCalories.toLocaleString('it-IT')}
          subtext={`/ ${calorieGoal.toLocaleString('it-IT')} kcal`}
          color="bg-blue-500"
          progress={(todayCalories / calorieGoal) * 100}
        />
        <QuickStatCard
          icon={Footprints}
          label="Passi"
          value={steps.toLocaleString('it-IT')}
          subtext="obiettivo 10,000"
          color="bg-green-500"
          progress={(steps / 10000) * 100}
        />
        <QuickStatCard
          icon={Droplets}
          label="Acqua"
          value={waterGlasses.toString()}
          subtext="/ 8 bicchieri"
          color="bg-cyan-500"
          progress={(waterGlasses / 8) * 100}
        />
        <QuickStatCard
          icon={User}
          label="Peso Attuale"
          value={profile.weightKg ? `${profile.weightKg}` : '--'}
          subtext="kg"
          color="bg-purple-500"
        />
      </motion.div>

      {/* Tab Navigation */}
      <div className="glass-card p-2 mb-6">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-gray-600 hover:bg-white/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'diary' && <DiaryTab />}
          {activeTab === 'ai' && <AITab />}
          {activeTab === 'profile' && <ProfileTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// =========== QUICK STAT CARD ===========

interface QuickStatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  subtext: string
  color: string
  progress?: number
}

function QuickStatCard({ icon: Icon, label, value, subtext, color, progress }: QuickStatCardProps) {
  return (
    <motion.div
      className="glass-card p-4"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-xl', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
          <p className="text-xs text-gray-400">{subtext}</p>
          {progress !== undefined && (
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn('h-full rounded-full transition-all duration-500', color)}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
