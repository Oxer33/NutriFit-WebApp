'use client'

/**
 * ============================================
 * WEIGHT HISTORY DIALOG - STORICO PESO
 * ============================================
 * 
 * Dialog per visualizzare e gestire lo storico del peso
 * con supporto per foto e note.
 * Replica la funzionalità WeightHistoryDialog dell'app Android.
 */

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Scale,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Camera,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { format, parseISO, subDays } from 'date-fns'
import { it } from 'date-fns/locale'

// =========== TYPES ===========

export interface WeightRecord {
  id: string
  date: string
  weight: number
  note?: string
  photoBase64?: string
  createdAt: string
}

// =========== PROPS ===========

interface WeightHistoryDialogProps {
  isOpen: boolean
  onClose: () => void
}

// =========== COMPONENT ===========

export function WeightHistoryDialog({ isOpen, onClose }: WeightHistoryDialogProps) {
  // Store
  const { profile } = useAppStore()
  
  // State
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nutrifit_weight_history')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWeight, setNewWeight] = useState('')
  const [newNote, setNewNote] = useState('')
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  
  // Statistiche
  const stats = useMemo(() => {
    if (weightRecords.length === 0) {
      return { 
        current: profile.weightKg || 0, 
        initial: profile.weightKg || 0, 
        change: 0, 
        trend: 'stable' as const 
      }
    }
    
    const sorted = [...weightRecords].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    const current = sorted[0]?.weight || profile.weightKg || 0
    const initial = sorted[sorted.length - 1]?.weight || profile.weightKg || 0
    const change = current - initial
    
    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (sorted.length >= 2) {
      const recent = sorted[0].weight
      const previous = sorted[1].weight
      if (recent > previous + 0.1) trend = 'up'
      else if (recent < previous - 0.1) trend = 'down'
    }
    
    return { current, initial, change, trend }
  }, [weightRecords, profile.weightKg])
  
  // Salva records in localStorage
  const saveRecords = (records: WeightRecord[]) => {
    setWeightRecords(records)
    if (typeof window !== 'undefined') {
      localStorage.setItem('nutrifit_weight_history', JSON.stringify(records))
    }
  }
  
  // Aggiungi nuovo record
  const handleAddRecord = () => {
    const weight = parseFloat(newWeight)
    if (isNaN(weight) || weight <= 0) return
    
    const newRecord: WeightRecord = {
      id: `weight-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weight,
      note: newNote.trim() || undefined,
      photoBase64: selectedPhoto || undefined,
      createdAt: new Date().toISOString()
    }
    
    const updated = [newRecord, ...weightRecords]
    saveRecords(updated)
    
    // Reset form
    setNewWeight('')
    setNewNote('')
    setSelectedPhoto(null)
    setShowAddForm(false)
  }
  
  // Elimina record
  const handleDeleteRecord = (id: string) => {
    const updated = weightRecords.filter(r => r.id !== id)
    saveRecords(updated)
  }
  
  // Gestione foto
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedPhoto(reader.result as string)
    }
    reader.readAsDataURL(file)
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
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Storico Peso</h2>
                <p className="text-xs text-gray-500">
                  {weightRecords.length} registrazioni
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Stats Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Attuale</p>
                <p className="text-xl font-bold text-gray-900">{stats.current.toFixed(1)}</p>
                <p className="text-xs text-gray-400">kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Variazione</p>
                <div className="flex items-center justify-center gap-1">
                  {stats.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                  {stats.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                  {stats.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                  <p className={cn(
                    "text-xl font-bold",
                    stats.change > 0 ? "text-red-500" : stats.change < 0 ? "text-green-500" : "text-gray-500"
                  )}>
                    {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}
                  </p>
                </div>
                <p className="text-xs text-gray-400">kg</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Iniziale</p>
                <p className="text-xl font-bold text-gray-900">{stats.initial.toFixed(1)}</p>
                <p className="text-xs text-gray-400">kg</p>
              </div>
            </div>
          </div>

          {/* Add Button / Form */}
          <div className="p-4 border-b border-gray-100">
            {showAddForm ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={e => setNewWeight(e.target.value)}
                      placeholder="Peso (kg)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-colors",
                      selectedPhoto 
                        ? "border-primary bg-primary/10" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Camera className={cn("w-5 h-5", selectedPhoto ? "text-primary" : "text-gray-400")} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
                
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Nota (opzionale)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                
                {selectedPhoto && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                    <img src={selectedPhoto} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleAddRecord}
                    disabled={!newWeight || parseFloat(newWeight) <= 0}
                    className="flex-1 py-2 px-4 rounded-xl bg-primary text-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Salva
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Aggiungi peso
              </button>
            )}
          </div>

          {/* Weight Records List */}
          <div className="p-4 overflow-y-auto max-h-[35vh]">
            {weightRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nessun peso registrato</p>
                <p className="text-sm">Inizia a tracciare il tuo peso</p>
              </div>
            ) : (
              <div className="space-y-2">
                {weightRecords
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record, index) => {
                    const isExpanded = expandedRecord === record.id
                    const prevRecord = weightRecords[index + 1]
                    const diff = prevRecord ? record.weight - prevRecord.weight : 0
                    
                    return (
                      <div
                        key={record.id}
                        className="rounded-xl border border-gray-200 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                          className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {format(parseISO(record.date), 'd MMM', { locale: it })}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                              {record.weight.toFixed(1)} kg
                            </span>
                            {diff !== 0 && (
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                diff > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                              )}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {record.photoBase64 && (
                              <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                                <img src={record.photoBase64} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                            {record.note && (
                              <p className="text-sm text-gray-600 mt-2">{record.note}</p>
                            )}
                            {record.photoBase64 && (
                              <div className="mt-2 rounded-lg overflow-hidden">
                                <img 
                                  src={record.photoBase64} 
                                  alt="Foto peso" 
                                  className="w-full max-h-48 object-cover"
                                />
                              </div>
                            )}
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() => handleDeleteRecord(record.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
