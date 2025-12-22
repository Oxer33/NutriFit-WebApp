'use client'

/**
 * ============================================
 * MENSTRUAL CYCLE DIALOG - CICLO MESTRUALE
 * ============================================
 * 
 * Dialog per tracciare il ciclo mestruale.
 * Mostra calendario con previsioni e storico.
 * Replica MenstrualCycleDialog dell'app Android.
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, ChevronLeft, ChevronRight, Droplet, Moon, Sun, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { it } from 'date-fns/locale'

// =========== TYPES ===========
interface CycleRecord {
  id: string
  startDate: string
  endDate?: string
  symptoms?: string[]
  notes?: string
}

interface MenstrualCycleDialogProps {
  isOpen: boolean
  onClose: () => void
}

// =========== COMPONENT ===========
export function MenstrualCycleDialog({ isOpen, onClose }: MenstrualCycleDialogProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [cycleRecords, setCycleRecords] = useState<CycleRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrifit_menstrual_cycles')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [cycleLength, setCycleLength] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('nutrifit_cycle_length') || '28')
    }
    return 28
  })
  const [periodLength, setPeriodLength] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('nutrifit_period_length') || '5')
    }
    return 5
  })

  // Giorni del mese corrente
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Previsioni ciclo
  const predictions = useMemo(() => {
    if (cycleRecords.length === 0) return { periodDays: [], fertileDays: [], ovulationDay: null }
    
    const lastCycle = cycleRecords.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0]
    
    const lastStart = new Date(lastCycle.startDate)
    const nextStart = addDays(lastStart, cycleLength)
    
    // Giorni del prossimo ciclo
    const periodDays: Date[] = []
    for (let i = 0; i < periodLength; i++) {
      periodDays.push(addDays(nextStart, i))
    }
    
    // Finestra fertile (circa 5 giorni prima dell'ovulazione)
    const ovulationDay = addDays(nextStart, -14) // 14 giorni prima del prossimo ciclo
    const fertileDays: Date[] = []
    for (let i = -5; i <= 0; i++) {
      fertileDays.push(addDays(ovulationDay, i))
    }
    
    return { periodDays, fertileDays, ovulationDay }
  }, [cycleRecords, cycleLength, periodLength])

  // Salva records
  const saveRecords = (records: CycleRecord[]) => {
    setCycleRecords(records)
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_menstrual_cycles', JSON.stringify(records))
    }
  }

  // Salva impostazioni ciclo
  const saveCycleSettings = (length: number, period: number) => {
    setCycleLength(length)
    setPeriodLength(period)
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_cycle_length', length.toString())
      localStorage.setItem('nutrifit_period_length', period.toString())
    }
  }

  // Toggle giorno ciclo
  const toggleCycleDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const existingRecord = cycleRecords.find(r => r.startDate === dateStr)
    
    if (existingRecord) {
      // Rimuovi il record
      saveRecords(cycleRecords.filter(r => r.id !== existingRecord.id))
    } else {
      // Aggiungi nuovo record
      const newRecord: CycleRecord = {
        id: `cycle-${Date.now()}`,
        startDate: dateStr,
        endDate: format(addDays(date, periodLength - 1), 'yyyy-MM-dd')
      }
      saveRecords([...cycleRecords, newRecord])
    }
  }

  // Verifica se un giorno è nel ciclo
  const getDayType = (date: Date): 'period' | 'fertile' | 'ovulation' | 'predicted' | null => {
    const dateStr = format(date, 'yyyy-MM-dd')
    
    // Controllo giorni registrati
    for (const record of cycleRecords) {
      const start = new Date(record.startDate)
      const end = record.endDate ? new Date(record.endDate) : addDays(start, periodLength - 1)
      if (date >= start && date <= end) return 'period'
    }
    
    // Controllo previsioni
    if (predictions.periodDays.some(d => isSameDay(d, date))) return 'predicted'
    if (predictions.ovulationDay && isSameDay(predictions.ovulationDay, date)) return 'ovulation'
    if (predictions.fertileDays.some(d => isSameDay(d, date))) return 'fertile'
    
    return null
  }

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
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-xl">
                <Moon className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Ciclo Mestruale</h2>
                <p className="text-xs text-gray-500">Traccia il tuo ciclo</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between p-4 bg-gray-50">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-gray-900 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: it })}
            </span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar */}
          <div className="p-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
              ))}
            </div>
            
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month start */}
              {Array.from({ length: (monthDays[0].getDay() + 6) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}
              
              {monthDays.map(day => {
                const dayType = getDayType(day)
                const isToday = isSameDay(day, new Date())
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => toggleCycleDay(day)}
                    className={cn(
                      "h-10 w-full rounded-lg flex items-center justify-center text-sm font-medium transition-colors relative",
                      dayType === 'period' && "bg-pink-500 text-white",
                      dayType === 'predicted' && "bg-pink-200 text-pink-700 border-2 border-dashed border-pink-400",
                      dayType === 'fertile' && "bg-purple-100 text-purple-700",
                      dayType === 'ovulation' && "bg-purple-500 text-white",
                      !dayType && "hover:bg-gray-100 text-gray-700",
                      isToday && "ring-2 ring-primary ring-offset-1"
                    )}
                  >
                    {format(day, 'd')}
                    {dayType === 'ovulation' && <Heart className="absolute -top-1 -right-1 w-3 h-3 text-red-500" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-500" />
                <span className="text-gray-600">Ciclo registrato</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-200 border-2 border-dashed border-pink-400" />
                <span className="text-gray-600">Previsione ciclo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-100" />
                <span className="text-gray-600">Finestra fertile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500" />
                <span className="text-gray-600">Ovulazione</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Durata ciclo</label>
                <select 
                  value={cycleLength} 
                  onChange={e => saveCycleSettings(parseInt(e.target.value), periodLength)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 21).map(n => (
                    <option key={n} value={n}>{n} giorni</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Durata mestruazioni</label>
                <select 
                  value={periodLength}
                  onChange={e => saveCycleSettings(cycleLength, parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  {Array.from({ length: 7 }, (_, i) => i + 3).map(n => (
                    <option key={n} value={n}>{n} giorni</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
