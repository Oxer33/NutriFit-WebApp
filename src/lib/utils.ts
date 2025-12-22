/**
 * ============================================
 * UTILITY FUNCTIONS - NUTRIFIT
 * ============================================
 * 
 * Funzioni di utilità condivise in tutta l'app.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classi CSS con supporto per Tailwind merge
 * Evita conflitti tra classi Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * ============================================
 * KEYWORDS PER CORSIVO AUTOMATICO
 * ============================================
 * 
 * Array di parole chiave da stilizzare automaticamente in corsivo.
 * Usate dal componente KeywordHighlighter.
 */
export const KEYWORDS = [
  // Termini scientifici
  'metabolismo',
  'microbiota',
  'nutrizione funzionale',
  'biochimica',
  'macronutrienti',
  'micronutrienti',
  'glicemia',
  'insulina',
  'cortisolo',
  'aminoacidi',
  'lipidi',
  'carboidrati',
  'proteine',
  'vitamine',
  'minerali',
  'antiossidanti',
  'fibre',
  'idratazione',
  
  // Valori e concetti
  'benessere',
  'salute',
  'equilibrio',
  'consapevolezza',
  'personalizzazione',
  'prevenzione',
  'longevità',
  'vitalità',
  'energia',
  'recupero',
  'performance',
  
  // Specializzazioni
  'nutrizione sportiva',
  'alimentazione plant-based',
  'medicina integrativa',
  'dieta mediterranea',
  'nutrizione clinica',
  'educazione alimentare',
  'composizione corporea',
  'bilancio energetico',
  'fabbisogno calorico',
  
  // Condizioni
  'sovrappeso',
  'obesità',
  'diabete',
  'ipertensione',
  'colesterolo',
  'intolleranze',
  'allergie alimentari',
]

/**
 * Formatta un numero con separatore migliaia
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('it-IT').format(num)
}

/**
 * Formatta una data in formato italiano
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('it-IT', options).format(date)
}

/**
 * Formatta una data in formato breve (es. "10 Apr")
 */
export function formatDateShort(date: Date): string {
  return formatDate(date, { day: 'numeric', month: 'short' })
}

/**
 * Formatta una data completa (es. "10 Aprile 2024")
 */
export function formatDateFull(date: Date): string {
  return formatDate(date, { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Calcola il BMI (Body Mass Index)
 * @param weight Peso in kg
 * @param height Altezza in metri
 */
export function calculateBMI(weight: number, height: number): number {
  if (height <= 0) return 0
  return weight / (height * height)
}

/**
 * Interpreta il BMI e ritorna una categoria
 */
export function getBMICategory(bmi: number): {
  category: string
  color: string
  description: string
} {
  if (bmi < 18.5) {
    return {
      category: 'Sottopeso',
      color: 'text-blue-500',
      description: 'Il tuo peso è inferiore al range considerato salutare.',
    }
  } else if (bmi < 25) {
    return {
      category: 'Normopeso',
      color: 'text-green-500',
      description: 'Il tuo peso rientra nel range considerato salutare.',
    }
  } else if (bmi < 30) {
    return {
      category: 'Sovrappeso',
      color: 'text-yellow-500',
      description: 'Il tuo peso è superiore al range considerato salutare.',
    }
  } else {
    return {
      category: 'Obesità',
      color: 'text-red-500',
      description: 'Il tuo peso richiede attenzione medica.',
    }
  }
}

/**
 * Calcola il fabbisogno calorico giornaliero
 * Basato sulle formule dal file Formule.txt dell'app Android
 * 
 * @param weight Peso in kg
 * @param height Altezza in metri
 * @param gender 'male' | 'female'
 * @param activityLevel 'sedentary' | 'active'
 * @param goal 'loss' | 'maintain' | 'gain'
 */
export function calculateDailyCalories(
  weight: number,
  height: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'active',
  goal: 'loss' | 'maintain' | 'gain'
): number {
  // Calcola BMI
  const bmi = calculateBMI(weight, height)
  
  // Soglia BMI per normalizzazione (23 donne, 25 uomini)
  const bmiThreshold = gender === 'female' ? 23 : 25
  
  // Peso da usare nel calcolo (normalizzato se BMI > soglia)
  const effectiveWeight = bmi > bmiThreshold
    ? bmiThreshold * (height * height)
    : weight
  
  // Fattori moltiplicativi basati su genere, attività e obiettivo
  const factors: Record<string, Record<string, Record<string, number>>> = {
    female: {
      sedentary: { loss: 26, maintain: 31, gain: 36 },
      active: { loss: 30, maintain: 35, gain: 40 },
    },
    male: {
      sedentary: { loss: 25, maintain: 30, gain: 35 },
      active: { loss: 35, maintain: 40, gain: 45 },
    },
  }
  
  const factor = factors[gender][activityLevel][goal]
  
  // Formula: (Peso x fattore) - 150 (per pasto libero settimanale)
  return Math.round((effectiveWeight * factor) - 150)
}

/**
 * Calcola le calorie bruciate per un'attività fisica
 * @param met Valore MET dell'attività
 * @param weight Peso in kg
 * @param durationMinutes Durata in minuti
 */
export function calculateCaloriesBurned(
  met: number,
  weight: number,
  durationMinutes: number
): number {
  // Formula: MET × peso (kg) × durata (ore)
  const durationHours = durationMinutes / 60
  return Math.round(met * weight * durationHours)
}

/**
 * Delay promise per animazioni
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Genera un ID univoco
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Clamp un valore tra min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Mappa un valore da un range a un altro
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
