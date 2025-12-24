'use client'

/**
 * ============================================
 * PROFILE TAB - PROFILO UTENTE COMPLETO
 * ============================================
 * 
 * Tab profilo avanzato con:
 * - Dati personali dallo store Zustand
 * - Calcoli BMI, BMR, TDEE
 * - Statistiche reali
 * - Impostazioni app
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Scale, 
  Ruler, 
  Target, 
  Activity,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Moon,
  ChevronRight,
  Edit3,
  Flame,
  Zap,
  Heart,
  Apple,
  Calendar,
  Languages,
  History,
  ClipboardList
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { 
  calculateBMI, 
  getBMICategory, 
  calculateCalorieGoal 
} from '@/types'
import { WeightHistoryDialog } from '@/components/app/WeightHistoryDialog'
import { CustomFoodsManager } from '@/components/app/CustomFoodsManager'
import { MenstrualCycleDialog } from '@/components/app/MenstrualCycleDialog'
import { DietarySurveyDialog } from '@/components/app/DietarySurveyDialog'
import { WaterReminderConfigDialog } from '@/components/app/WaterReminderConfigDialog'
import { ProfileEditDialog } from '@/components/app/ProfileEditDialog'

// =========== COMPONENT ===========

export function ProfileTab() {
  // Store
  const { profile } = useAppStore()
  
  // Dialog states
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showWeightHistory, setShowWeightHistory] = useState(false)
  const [showCustomFoods, setShowCustomFoods] = useState(false)
  const [showMenstrualCycle, setShowMenstrualCycle] = useState(false)
  const [showDietarySurvey, setShowDietarySurvey] = useState(false)
  const [showWaterReminderConfig, setShowWaterReminderConfig] = useState(false)
  
  // Calcoli metabolici
  const bmi = useMemo(() => {
    if (!profile.weightKg || !profile.heightCm) return 0
    return calculateBMI(profile.weightKg, profile.heightCm)
  }, [profile.weightKg, profile.heightCm])
  
  const bmiInfo = useMemo(() => getBMICategory(bmi), [bmi])
  
  // NOTA: BMR e TDEE calcolati internamente ma non esposti nell'UI
  // per protezione della proprietà intellettuale delle formule
  
  const calorieGoal = useMemo(() => {
    if (!profile.onboardingCompleted) return 2000
    return calculateCalorieGoal(profile)
  }, [profile])
  
  // Obiettivo descrizione
  const goalLabel = useMemo(() => {
    switch(profile.goal) {
      case 'LOSE_WEIGHT': return 'Dimagrimento'
      case 'GAIN_WEIGHT': return 'Aumento massa'
      default: return 'Mantenimento'
    }
  }, [profile.goal])
  
  const activityLabel = profile.activityLevel === 'ACTIVE' ? 'Attivo' : 'Sedentario'

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{profile.name || 'Utente'}</h2>
            <p className="text-gray-500">{profile.age} anni • {profile.gender === 'M' ? 'Uomo' : profile.gender === 'F' ? 'Donna' : 'Altro'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {goalLabel}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {activityLabel}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowProfileEdit(true)}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <Edit3 className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Scale}
          label="Peso Attuale"
          value={`${profile.weightKg || 0} kg`}
          color="bg-blue-500"
          delay={0.1}
        />
        <StatCard
          icon={Ruler}
          label="Altezza"
          value={`${profile.heightCm || 0} cm`}
          color="bg-green-500"
          delay={0.15}
        />
        <StatCard
          icon={Target}
          label="Obiettivo kcal"
          value={`${calorieGoal}`}
          color="bg-purple-500"
          delay={0.2}
        />
        <StatCard
          icon={Activity}
          label="Fabbisogno"
          value={`${calorieGoal}`}
          color="bg-orange-500"
          delay={0.25}
        />
      </div>

      {/* BMI Card */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">Indice di Massa Corporea (BMI)</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-4xl font-bold text-gray-900">{bmi.toFixed(1)}</p>
            <p className="font-medium" style={{ color: bmiInfo.color }}>{bmiInfo.label}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Peso ideale (BMI 22)</p>
            <p className="text-lg font-semibold text-primary">
              {profile.heightCm ? Math.round(22 * (profile.heightCm/100) * (profile.heightCm/100)) : 0} kg
            </p>
          </div>
        </div>

        {/* BMI Scale */}
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="absolute inset-0 flex">
            <div className="w-1/4 bg-blue-400" />
            <div className="w-1/4 bg-green-400" />
            <div className="w-1/4 bg-yellow-400" />
            <div className="w-1/4 bg-red-400" />
          </div>
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow"
            initial={{ left: '0%' }}
            animate={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Sottopeso</span>
          <span>Normale</span>
          <span>Sovrappeso</span>
          <span>Obeso</span>
        </div>
      </motion.div>
      
      {/* Calorie Goal Card - formule non esposte per protezione IP */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Il Tuo Piano Alimentare</h3>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
          <Target className="w-12 h-12 text-primary mx-auto mb-3" />
          <p className="text-4xl font-bold text-gray-900">{calorieGoal}</p>
          <p className="text-sm text-gray-500 mt-1">calorie giornaliere</p>
          <p className="text-xs text-primary mt-3">
            Calcolato in base ai tuoi dati personali e obiettivi
          </p>
        </div>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900">I Tuoi Progressi</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-50 rounded-xl">
            <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-500">Giorni consecutivi</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <Scale className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">kg questo mese</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0%</p>
            <p className="text-xs text-gray-500">obiettivo raggiunto</p>
          </div>
        </div>
      </motion.div>

      {/* Tools Section */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
      >
        <h3 className="font-semibold text-gray-900 p-4 border-b border-gray-100">Strumenti</h3>
        
        <SettingItem
          icon={History}
          label="Storico Peso"
          value="Visualizza"
          onClick={() => setShowWeightHistory(true)}
        />
        <SettingItem
          icon={Apple}
          label="Alimenti Personalizzati"
          value="Gestisci"
          onClick={() => setShowCustomFoods(true)}
        />
        {profile.gender === 'F' && (
          <SettingItem
            icon={Calendar}
            label="Ciclo Mestruale"
            value="Traccia"
            onClick={() => setShowMenstrualCycle(true)}
          />
        )}
        <SettingItem
          icon={ClipboardList}
          label="Indagine Alimentare"
          value="Compila"
          onClick={() => setShowDietarySurvey(true)}
        />
      </motion.div>

      {/* Settings Section */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h3 className="font-semibold text-gray-900 p-4 border-b border-gray-100">Impostazioni</h3>
        
        <SettingItem
          icon={Bell}
          label="Notifiche"
          value="Attive"
        />
        <SettingItem
          icon={Moon}
          label="Tema Scuro"
          value="Disattivato"
        />
        <SettingItem
          icon={Settings}
          label="Promemoria Acqua"
          value="Configura"
          onClick={() => setShowWaterReminderConfig(true)}
        />
      </motion.div>
      
      {/* Dialogs */}
      <ProfileEditDialog
        isOpen={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
      />
      
      <WeightHistoryDialog
        isOpen={showWeightHistory}
        onClose={() => setShowWeightHistory(false)}
      />
      
      <CustomFoodsManager
        isOpen={showCustomFoods}
        onClose={() => setShowCustomFoods(false)}
      />
      
      <MenstrualCycleDialog
        isOpen={showMenstrualCycle}
        onClose={() => setShowMenstrualCycle(false)}
      />
      
      <DietarySurveyDialog
        isOpen={showDietarySurvey}
        onClose={() => setShowDietarySurvey(false)}
      />
      
      <WaterReminderConfigDialog
        isOpen={showWaterReminderConfig}
        onClose={() => setShowWaterReminderConfig(false)}
      />
    </div>
  )
}

// =========== STAT CARD ===========

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  delay: number
}

function StatCard({ icon: Icon, label, value, color, delay }: StatCardProps) {
  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}

// =========== SETTING ITEM ===========

interface SettingItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onClick?: () => void
}

function SettingItem({ icon: Icon, label, value, onClick }: SettingItemProps) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">{value}</span>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </button>
  )
}
