'use client'

/**
 * ============================================
 * PROFILE EDIT DIALOG - MODIFICA PROFILO
 * ============================================
 * 
 * Dialog per modificare i dati del profilo utente:
 * - Nome, Età
 * - Genere
 * - Altezza, Peso
 * - Obiettivo (dimagrire, mantenere, aumentare)
 * - Livello attività
 * - Stile alimentare
 * - Tasso variazione peso
 * 
 * Replica la funzionalità del ProfileFragment Android
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User,
  Save,
  Scale,
  Ruler,
  Target,
  Activity,
  Utensils,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import type { 
  Gender, 
  Goal, 
  ActivityLevel, 
  DietStyle, 
  WeightChangeRate 
} from '@/types'

// =========== PROPS ===========

interface ProfileEditDialogProps {
  isOpen: boolean
  onClose: () => void
}

// =========== OPTIONS ===========

const genderOptions: { value: Gender; label: string; icon: string }[] = [
  { value: 'M', label: 'Uomo', icon: '👨' },
  { value: 'F', label: 'Donna', icon: '👩' },
  { value: 'O', label: 'Altro', icon: '🧑' },
]

const goalOptions: { value: Goal; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'LOSE_WEIGHT', label: 'Dimagrire', icon: <TrendingDown className="w-5 h-5" />, description: 'Perdere peso in modo sano' },
  { value: 'MAINTAIN', label: 'Mantenere', icon: <Minus className="w-5 h-5" />, description: 'Mantenere il peso attuale' },
  { value: 'GAIN_WEIGHT', label: 'Aumentare', icon: <TrendingUp className="w-5 h-5" />, description: 'Aumentare massa muscolare' },
]

const activityOptions: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'SEDENTARY', label: 'Sedentario', description: 'Lavoro d\'ufficio, poca attività' },
  { value: 'ACTIVE', label: 'Attivo', description: 'Lavoro fisico o sport regolare' },
]

const dietStyleOptions: { value: DietStyle; label: string; icon: string }[] = [
  { value: 'OMNIVORE', label: 'Onnivoro', icon: '🍖' },
  { value: 'VEGETARIAN', label: 'Vegetariano', icon: '🥬' },
  { value: 'VEGAN', label: 'Vegano', icon: '🌱' },
]

const weightChangeRateOptions: { value: WeightChangeRate; label: string; kg: string }[] = [
  { value: 'RATE_025', label: 'Molto lento', kg: '0.25 kg/settimana' },
  { value: 'RATE_05', label: 'Lento', kg: '0.5 kg/settimana' },
  { value: 'RATE_075', label: 'Moderato', kg: '0.75 kg/settimana' },
  { value: 'RATE_1', label: 'Veloce', kg: '1 kg/settimana' },
]

// =========== COMPONENT ===========

export function ProfileEditDialog({ isOpen, onClose }: ProfileEditDialogProps) {
  const { profile, setProfile } = useAppStore()
  
  // Form state
  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age.toString())
  const [gender, setGender] = useState<Gender>(profile.gender)
  const [heightCm, setHeightCm] = useState(profile.heightCm.toString())
  const [weightKg, setWeightKg] = useState(profile.weightKg.toString())
  const [goal, setGoal] = useState<Goal>(profile.goal)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel)
  const [dietStyle, setDietStyle] = useState<DietStyle>(profile.dietStyle)
  const [weightChangeRate, setWeightChangeRate] = useState<WeightChangeRate>(profile.weightChangeRate)
  
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'basic' | 'goals' | 'diet'>('basic')
  
  // Sync form with profile when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName(profile.name)
      setAge(profile.age.toString())
      setGender(profile.gender)
      setHeightCm(profile.heightCm.toString())
      setWeightKg(profile.weightKg.toString())
      setGoal(profile.goal)
      setActivityLevel(profile.activityLevel)
      setDietStyle(profile.dietStyle)
      setWeightChangeRate(profile.weightChangeRate)
    }
  }, [isOpen, profile])
  
  // Handle save
  const handleSave = () => {
    setIsSaving(true)
    
    // Validate
    const ageNum = parseInt(age)
    const heightNum = parseFloat(heightCm)
    const weightNum = parseFloat(weightKg)
    
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      alert('Età non valida (10-120)')
      setIsSaving(false)
      return
    }
    
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      alert('Altezza non valida (100-250 cm)')
      setIsSaving(false)
      return
    }
    
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      alert('Peso non valido (30-300 kg)')
      setIsSaving(false)
      return
    }
    
    // Save to store
    setProfile({
      name: name.trim() || 'Utente',
      age: ageNum,
      gender,
      heightCm: heightNum,
      weightKg: weightNum,
      goal,
      activityLevel,
      dietStyle,
      weightChangeRate,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    })
    
    setTimeout(() => {
      setIsSaving(false)
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Modifica Profilo</h2>
                <p className="text-xs text-gray-500">Aggiorna i tuoi dati personali</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex border-b border-gray-100">
            {(['basic', 'goals', 'diet'] as const).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={cn(
                  'flex-1 py-3 text-sm font-medium transition-colors',
                  activeSection === section
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {section === 'basic' && 'Dati Base'}
                {section === 'goals' && 'Obiettivi'}
                {section === 'diet' && 'Alimentazione'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Il tuo nome"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                {/* Età */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Età</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min={10}
                    max={120}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>

                {/* Genere */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Genere</label>
                  <div className="grid grid-cols-3 gap-2">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGender(option.value)}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all',
                          gender === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <p className="text-sm font-medium mt-1">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Altezza */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altezza (cm)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      min={100}
                      max={250}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      min={30}
                      max={300}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Goals Section */}
            {activeSection === 'goals' && (
              <div className="space-y-4">
                {/* Obiettivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Obiettivo</label>
                  <div className="space-y-2">
                    {goalOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGoal(option.value)}
                        className={cn(
                          'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left',
                          goal === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className={cn(
                          'p-2 rounded-lg',
                          goal === option.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                        )}>
                          {option.icon}
                        </div>
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Livello Attività */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Livello di Attività
                  </label>
                  <div className="space-y-2">
                    {activityOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setActivityLevel(option.value)}
                        className={cn(
                          'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left',
                          activityLevel === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <Activity className={cn(
                          'w-5 h-5',
                          activityLevel === option.value ? 'text-primary' : 'text-gray-400'
                        )} />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tasso Variazione Peso (solo se goal != MAINTAIN) */}
                {goal !== 'MAINTAIN' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Velocità {goal === 'LOSE_WEIGHT' ? 'Dimagrimento' : 'Aumento'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {weightChangeRateOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setWeightChangeRate(option.value)}
                          className={cn(
                            'p-3 rounded-xl border-2 transition-all text-center',
                            weightChangeRate === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.kg}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Diet Section */}
            {activeSection === 'diet' && (
              <div className="space-y-4">
                {/* Stile Alimentare */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stile Alimentare
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {dietStyleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDietStyle(option.value)}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-center',
                          dietStyle === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <span className="text-3xl">{option.icon}</span>
                        <p className="text-sm font-medium mt-2">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-2">Informazioni</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Onnivoro</strong>: Tutti gli alimenti</li>
                    <li>• <strong>Vegetariano</strong>: No carne e pesce</li>
                    <li>• <strong>Vegano</strong>: Solo alimenti vegetali</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
