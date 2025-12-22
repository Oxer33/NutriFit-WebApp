'use client'

/**
 * ============================================
 * WATER REMINDER - Promemoria Idratazione
 * ============================================
 * 
 * Componente per:
 * - Tracker bicchieri d'acqua giornalieri
 * - Sistema notifiche browser per promemoria
 * - Impostazione intervallo promemoria
 * - Visualizzazione progress verso obiettivo
 * - Statistiche idratazione
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Droplets, 
  Plus, 
  Minus,
  Bell,
  BellOff,
  Settings,
  Clock,
  Target,
  Check,
  X,
  Volume2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

// =========== PROPS ===========

interface WaterReminderProps {
  date: string
  showSettings?: boolean
}

// =========== CONSTANTS ===========

const GLASS_SIZE_ML = 200
const DEFAULT_GOAL_GLASSES = 8
const DEFAULT_INTERVAL_MINUTES = 60

// =========== HELPERS ===========

/**
 * Richiede permesso notifiche browser
 */
async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Questo browser non supporta le notifiche')
    return false
  }
  
  if (Notification.permission === 'granted') {
    return true
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  
  return false
}

/**
 * Invia notifica browser
 */
function sendNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'water-reminder',
      requireInteraction: false
    })
  }
}

// =========== COMPONENT ===========

export function WaterReminder({ date, showSettings = false }: WaterReminderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(showSettings)
  const [notificationSupported, setNotificationSupported] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  
  // Store
  const { 
    getDailyData, 
    addWaterGlass, 
    removeWaterGlass,
    waterReminderEnabled,
    waterReminderInterval,
    setWaterReminderEnabled,
    setWaterReminderInterval
  } = useAppStore()
  
  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Dati giornalieri
  const dailyData = getDailyData(date)
  const currentGlasses = dailyData.waterGlasses
  const goalGlasses = DEFAULT_GOAL_GLASSES
  const totalMl = currentGlasses * GLASS_SIZE_ML
  const goalMl = goalGlasses * GLASS_SIZE_ML
  const progress = Math.min((currentGlasses / goalGlasses) * 100, 100)
  
  // Check supporto notifiche
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationSupported(true)
      setNotificationPermission(Notification.permission)
    }
  }, [])
  
  // Gestione timer promemoria
  useEffect(() => {
    // Pulisci timer precedente
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    // Se abilitato, avvia nuovo timer
    if (waterReminderEnabled && notificationPermission === 'granted') {
      const intervalMs = waterReminderInterval * 60 * 1000
      
      timerRef.current = setInterval(() => {
        sendNotification(
          '💧 Tempo di bere!',
          `Hai bevuto ${currentGlasses}/${goalGlasses} bicchieri oggi. Ricordati di idratarti!`
        )
      }, intervalMs)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [waterReminderEnabled, waterReminderInterval, notificationPermission, currentGlasses, goalGlasses])
  
  // Handlers
  const handleAddGlass = useCallback(() => {
    addWaterGlass(date)
  }, [date, addWaterGlass])
  
  const handleRemoveGlass = useCallback(() => {
    removeWaterGlass(date)
  }, [date, removeWaterGlass])
  
  const handleToggleReminder = useCallback(async () => {
    if (!waterReminderEnabled) {
      // Richiedi permesso se necessario
      const hasPermission = await requestNotificationPermission()
      if (hasPermission) {
        setNotificationPermission('granted')
        setWaterReminderEnabled(true)
        // Notifica di conferma
        sendNotification(
          '✅ Promemoria attivato!',
          `Riceverai un promemoria ogni ${waterReminderInterval} minuti.`
        )
      } else {
        setNotificationPermission(Notification.permission)
      }
    } else {
      setWaterReminderEnabled(false)
    }
  }, [waterReminderEnabled, waterReminderInterval, setWaterReminderEnabled])
  
  const handleIntervalChange = useCallback((minutes: number) => {
    setWaterReminderInterval(minutes)
  }, [setWaterReminderInterval])

  return (
    <motion.div 
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-100 rounded-xl">
            <Droplets className="w-7 h-7 text-cyan-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Idratazione</h3>
            <p className="text-sm text-gray-500">
              Obiettivo: {goalMl}ml ({goalGlasses} bicchieri)
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={cn(
            "p-2 rounded-xl transition-colors",
            isSettingsOpen ? "bg-cyan-100 text-cyan-600" : "hover:bg-gray-100 text-gray-400"
          )}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      {/* Main Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handleRemoveGlass}
            disabled={currentGlasses === 0}
            className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Minus className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="text-center">
            <motion.span 
              className="text-5xl font-bold text-cyan-600"
              key={currentGlasses}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {currentGlasses}
            </motion.span>
            <span className="text-2xl text-gray-400">/{goalGlasses}</span>
            <p className="text-sm text-gray-500 mt-1">{totalMl}ml bevuti</p>
          </div>
          
          <button
            onClick={handleAddGlass}
            className="p-3 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition-colors text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        
        {/* Water Glasses Visual */}
        <div className="flex justify-center gap-2 mb-4">
          {[...Array(goalGlasses)].map((_, i) => (
            <motion.button
              key={i}
              onClick={() => {
                // Click per impostare a quel livello
                const newLevel = i + 1
                if (newLevel > currentGlasses) {
                  for (let j = currentGlasses; j < newLevel; j++) {
                    addWaterGlass(date)
                  }
                } else if (newLevel <= currentGlasses) {
                  // Non facciamo nulla se clicchi su un bicchiere già pieno
                }
              }}
              className={cn(
                'w-8 h-10 rounded-lg transition-all cursor-pointer',
                i < currentGlasses 
                  ? 'bg-gradient-to-t from-cyan-500 to-cyan-400' 
                  : 'bg-gray-100 hover:bg-cyan-100'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {progress >= 100 
            ? '🎉 Obiettivo raggiunto!' 
            : `${Math.round(progress)}% dell'obiettivo giornaliero`
          }
        </p>
      </div>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="border-t border-gray-100 pt-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Promemoria
            </h4>
            
            {/* Notification Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {waterReminderEnabled ? (
                  <Bell className="w-5 h-5 text-cyan-500" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Notifiche</p>
                  <p className="text-xs text-gray-500">
                    {waterReminderEnabled ? 'Attive' : 'Disattivate'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleReminder}
                disabled={!notificationSupported}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors",
                  waterReminderEnabled ? "bg-cyan-500" : "bg-gray-300",
                  !notificationSupported && "opacity-50 cursor-not-allowed"
                )}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                  animate={{ x: waterReminderEnabled ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            
            {/* Browser notification warning */}
            {!notificationSupported && (
              <div className="p-3 bg-yellow-50 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  Il tuo browser non supporta le notifiche push.
                </p>
              </div>
            )}
            
            {notificationPermission === 'denied' && (
              <div className="p-3 bg-red-50 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  Le notifiche sono bloccate. Abilita le notifiche nelle impostazioni del browser.
                </p>
              </div>
            )}
            
            {/* Interval Selector */}
            {waterReminderEnabled && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Intervallo promemoria
                </p>
                <div className="flex gap-2">
                  {[30, 45, 60, 90, 120].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => handleIntervalChange(minutes)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors",
                        waterReminderInterval === minutes
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quick Add Info */}
      <div className="mt-4 p-3 bg-cyan-50 rounded-xl">
        <p className="text-xs text-cyan-700 text-center">
          💡 Un bicchiere = {GLASS_SIZE_ML}ml • Clicca sui bicchieri per aggiungere rapidamente
        </p>
      </div>
    </motion.div>
  )
}

// =========== MINI WATER WIDGET ===========

export function WaterWidget({ date }: { date: string }) {
  const { getDailyData, addWaterGlass } = useAppStore()
  const dailyData = getDailyData(date)
  const currentGlasses = dailyData.waterGlasses
  const progress = Math.min((currentGlasses / DEFAULT_GOAL_GLASSES) * 100, 100)
  
  return (
    <motion.div 
      className="glass-card p-4"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-100 rounded-lg">
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Acqua</span>
        </div>
        <button
          onClick={() => addWaterGlass(date)}
          className="p-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {currentGlasses}
        </span>
        <span className="text-gray-400 text-sm ml-1">/ 8 bicchieri</span>
      </div>
      
      <div className="flex gap-1 mb-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors',
              i < currentGlasses ? 'bg-cyan-400' : 'bg-gray-100'
            )}
          />
        ))}
      </div>
      
      <p className="text-xs text-gray-500">
        {currentGlasses * GLASS_SIZE_ML}ml / {DEFAULT_GOAL_GLASSES * GLASS_SIZE_ML}ml
      </p>
    </motion.div>
  )
}
