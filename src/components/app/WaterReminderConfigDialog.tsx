'use client'

/**
 * ============================================
 * WATER REMINDER CONFIG DIALOG
 * ============================================
 * 
 * Dialog per configurare i promemoria per bere acqua.
 * Permette di impostare intervallo, orari attività e attivazione.
 * Replica WaterReminderDialog dell'app Android.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Droplets, Clock, Bell, BellOff, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

// =========== TYPES ===========
interface WaterReminderConfigDialogProps {
  isOpen: boolean
  onClose: () => void
}

// =========== COMPONENT ===========
export function WaterReminderConfigDialog({ isOpen, onClose }: WaterReminderConfigDialogProps) {
  const { 
    waterReminderEnabled, 
    waterReminderInterval,
    setWaterReminderEnabled,
    setWaterReminderInterval
  } = useAppStore()

  // Stati locali per le impostazioni
  const [enabled, setEnabled] = useState(waterReminderEnabled)
  const [intervalMinutes, setIntervalMinutes] = useState(waterReminderInterval)
  const [startHour, setStartHour] = useState(8)
  const [endHour, setEndHour] = useState(22)

  // Carica impostazioni salvate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrifit_water_reminder_config')
      if (saved) {
        const config = JSON.parse(saved)
        setStartHour(config.startHour || 8)
        setEndHour(config.endHour || 22)
      }
    }
  }, [isOpen])

  // Sincronizza con store
  useEffect(() => {
    setEnabled(waterReminderEnabled)
    setIntervalMinutes(waterReminderInterval)
  }, [waterReminderEnabled, waterReminderInterval])

  // Opzioni intervallo
  const intervalOptions = [
    { value: 30, label: '30 minuti' },
    { value: 45, label: '45 minuti' },
    { value: 60, label: '1 ora' },
    { value: 90, label: '1 ora 30 min' },
    { value: 120, label: '2 ore' },
  ]

  // Genera ore per i select
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleSave = () => {
    // Salva nello store
    setWaterReminderEnabled(enabled)
    setWaterReminderInterval(intervalMinutes)
    
    // Salva configurazione extra in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_water_reminder_config', JSON.stringify({
        startHour,
        endHour,
        enabled,
        intervalMinutes
      }))
    }

    // Gestisci notifiche browser se abilitate
    if (enabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }

    onClose()
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
          className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Promemoria Acqua</h2>
                <p className="text-xs text-gray-500">Configura le notifiche</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {enabled ? (
                  <Bell className="w-5 h-5 text-blue-500" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Promemoria</p>
                  <p className="text-xs text-gray-500">
                    {enabled ? 'Attivi' : 'Disattivati'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={cn(
                  "w-14 h-8 rounded-full transition-colors relative",
                  enabled ? "bg-blue-500" : "bg-gray-300"
                )}
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-md"
                  animate={{ left: enabled ? '1.75rem' : '0.25rem' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Interval Selector */}
            <div className={cn("space-y-2", !enabled && "opacity-50 pointer-events-none")}>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                Intervallo promemoria
              </label>
              <select
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
              >
                {intervalOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    Ogni {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range */}
            <div className={cn("space-y-3", !enabled && "opacity-50 pointer-events-none")}>
              <label className="text-sm font-medium text-gray-700">
                Orario attività (non disturbare di notte)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Dalle</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Alle</label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>
                        {h.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-700">
                💡 Riceverai una notifica browser per ricordarti di bere. 
                Assicurati di permettere le notifiche dal browser.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salva Impostazioni
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
