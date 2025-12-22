'use client'

/**
 * ============================================
 * STATS TAB - GRAFICI E STATISTICHE
 * ============================================
 * 
 * Tab statistiche con:
 * - Grafico calorie settimanali
 * - Grafico macronutrienti
 * - Andamento peso
 * - Statistiche passi e acqua
 * - Riepilogo periodo
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Flame,
  Droplets,
  Footprints,
  Scale,
  Target,
  ChevronLeft,
  ChevronRight,
  PieChart
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { it } from 'date-fns/locale'
import { calculateCalorieGoal } from '@/types'

// =========== TYPES ===========

type TimePeriod = '7days' | '30days' | '90days'

// =========== COMPONENT ===========

export function StatsTab() {
  const [period, setPeriod] = useState<TimePeriod>('7days')
  const [weekOffset, setWeekOffset] = useState(0)
  
  // Store
  const { profile, getDailyData } = useAppStore()
  
  // Calcola obiettivo calorie
  const calorieGoal = useMemo(() => {
    if (!profile.onboardingCompleted) return 2000
    return calculateCalorieGoal(profile)
  }, [profile])
  
  // Genera dati per il periodo selezionato
  const periodData = useMemo(() => {
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayData = getDailyData(dateStr)
      
      const calories = dayData.meals.reduce((sum, m) => sum + m.totalCalories, 0)
      const protein = dayData.meals.reduce((sum, m) => sum + m.totalProtein, 0)
      const carbs = dayData.meals.reduce((sum, m) => sum + m.totalCarbs, 0)
      const fat = dayData.meals.reduce((sum, m) => sum + m.totalFat, 0)
      
      data.push({
        date: dateStr,
        dayLabel: format(date, 'EEE', { locale: it }),
        dayNumber: format(date, 'd'),
        calories,
        protein,
        carbs,
        fat,
        steps: dayData.steps,
        water: dayData.waterGlasses,
      })
    }
    
    return data
  }, [period, getDailyData])
  
  // Statistiche aggregate
  const stats = useMemo(() => {
    const totalCalories = periodData.reduce((sum, d) => sum + d.calories, 0)
    const totalSteps = periodData.reduce((sum, d) => sum + d.steps, 0)
    const totalWater = periodData.reduce((sum, d) => sum + d.water, 0)
    const avgCalories = Math.round(totalCalories / periodData.length)
    const avgSteps = Math.round(totalSteps / periodData.length)
    const avgWater = Math.round(totalWater / periodData.length * 10) / 10
    
    const totalProtein = periodData.reduce((sum, d) => sum + d.protein, 0)
    const totalCarbs = periodData.reduce((sum, d) => sum + d.carbs, 0)
    const totalFat = periodData.reduce((sum, d) => sum + d.fat, 0)
    const totalMacros = totalProtein + totalCarbs + totalFat
    
    return {
      totalCalories,
      avgCalories,
      totalSteps,
      avgSteps,
      totalWater,
      avgWater,
      proteinPercent: totalMacros > 0 ? Math.round(totalProtein / totalMacros * 100) : 33,
      carbsPercent: totalMacros > 0 ? Math.round(totalCarbs / totalMacros * 100) : 34,
      fatPercent: totalMacros > 0 ? Math.round(totalFat / totalMacros * 100) : 33,
      daysOnTarget: periodData.filter(d => d.calories > 0 && d.calories <= calorieGoal * 1.1).length,
    }
  }, [periodData, calorieGoal])
  
  // Trova max calorie per scala grafico
  const maxCalories = useMemo(() => {
    const max = Math.max(...periodData.map(d => d.calories), calorieGoal)
    return Math.ceil(max / 500) * 500
  }, [periodData, calorieGoal])

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-center gap-2">
        {[
          { value: '7days' as TimePeriod, label: '7 giorni' },
          { value: '30days' as TimePeriod, label: '30 giorni' },
          { value: '90days' as TimePeriod, label: '3 mesi' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              period === value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={Flame}
          label="Media Calorie"
          value={stats.avgCalories.toLocaleString('it-IT')}
          unit="kcal/giorno"
          color="bg-orange-500"
          trend={stats.avgCalories < calorieGoal ? 'down' : 'up'}
        />
        <SummaryCard
          icon={Footprints}
          label="Media Passi"
          value={stats.avgSteps.toLocaleString('it-IT')}
          unit="passi/giorno"
          color="bg-green-500"
          trend={stats.avgSteps >= 8000 ? 'up' : 'down'}
        />
        <SummaryCard
          icon={Droplets}
          label="Media Acqua"
          value={stats.avgWater.toString()}
          unit="bicchieri/giorno"
          color="bg-cyan-500"
          trend={stats.avgWater >= 6 ? 'up' : 'down'}
        />
        <SummaryCard
          icon={Target}
          label="Giorni in Target"
          value={stats.daysOnTarget.toString()}
          unit={`su ${periodData.length}`}
          color="bg-purple-500"
        />
      </div>
      
      {/* Calories Chart */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Calorie Giornaliere</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded" />
              <span className="text-gray-500">Consumate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-300 rounded" />
              <span className="text-gray-500">Obiettivo</span>
            </div>
          </div>
        </div>
        
        {/* Bar Chart */}
        <div className="relative h-48">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center">
                <span className="text-xs text-gray-400 w-10 text-right pr-2">
                  {Math.round(maxCalories - (maxCalories / 4) * i)}
                </span>
                <div className="flex-1 border-t border-gray-100" />
              </div>
            ))}
          </div>
          
          {/* Bars */}
          <div className="absolute inset-0 ml-12 flex items-end justify-around gap-1 pb-6">
            {periodData.slice(-7).map((day, index) => {
              const heightPercent = (day.calories / maxCalories) * 100
              const goalPercent = (calorieGoal / maxCalories) * 100
              
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative w-full h-36 flex items-end justify-center">
                    {/* Goal line indicator */}
                    <div 
                      className="absolute w-full border-t-2 border-dashed border-gray-300"
                      style={{ bottom: `${goalPercent}%` }}
                    />
                    {/* Bar */}
                    <motion.div
                      className={cn(
                        "w-8 rounded-t-lg",
                        day.calories > calorieGoal ? "bg-red-400" : "bg-primary"
                      )}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(heightPercent, 100)}%` }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{day.dayLabel}</span>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
      
      {/* Macros Distribution */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900">Distribuzione Macronutrienti</h3>
        </div>
        
        <div className="flex items-center gap-8">
          {/* Pie Chart Visual */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Protein */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#EF4444"
                strokeWidth="20"
                strokeDasharray={`${stats.proteinPercent * 2.51} 251`}
                strokeDashoffset="0"
              />
              {/* Carbs */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="20"
                strokeDasharray={`${stats.carbsPercent * 2.51} 251`}
                strokeDashoffset={`-${stats.proteinPercent * 2.51}`}
              />
              {/* Fat */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="20"
                strokeDasharray={`${stats.fatPercent * 2.51} 251`}
                strokeDashoffset={`-${(stats.proteinPercent + stats.carbsPercent) * 2.51}`}
              />
            </svg>
          </div>
          
          {/* Legend */}
          <div className="flex-1 space-y-3">
            <MacroLegend 
              color="bg-red-500" 
              label="Proteine" 
              percent={stats.proteinPercent} 
              target="25-30%" 
            />
            <MacroLegend 
              color="bg-amber-500" 
              label="Carboidrati" 
              percent={stats.carbsPercent} 
              target="45-55%" 
            />
            <MacroLegend 
              color="bg-blue-500" 
              label="Grassi" 
              percent={stats.fatPercent} 
              target="20-30%" 
            />
          </div>
        </div>
      </motion.div>
      
      {/* Steps & Water Weekly */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Steps */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Footprints className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Passi Settimanali</h3>
          </div>
          
          <div className="flex items-end justify-around h-24 gap-2">
            {periodData.slice(-7).map((day, index) => {
              const heightPercent = Math.min((day.steps / 10000) * 100, 100)
              return (
                <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                  <motion.div
                    className="w-full max-w-8 bg-green-400 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: index * 0.05 }}
                  />
                  <span className="text-xs text-gray-400">{day.dayLabel}</span>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalSteps.toLocaleString('it-IT')}</p>
            <p className="text-sm text-gray-500">passi totali nel periodo</p>
          </div>
        </motion.div>
        
        {/* Water */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold text-gray-900">Idratazione Settimanale</h3>
          </div>
          
          <div className="flex items-end justify-around h-24 gap-2">
            {periodData.slice(-7).map((day, index) => {
              const heightPercent = Math.min((day.water / 8) * 100, 100)
              return (
                <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                  <motion.div
                    className="w-full max-w-8 bg-cyan-400 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: index * 0.05 }}
                  />
                  <span className="text-xs text-gray-400">{day.dayLabel}</span>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalWater}</p>
            <p className="text-sm text-gray-500">bicchieri totali nel periodo</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// =========== SUMMARY CARD ===========

interface SummaryCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  unit: string
  color: string
  trend?: 'up' | 'down'
}

function SummaryCard({ icon: Icon, label, value, unit, color, trend }: SummaryCardProps) {
  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {trend && (
          trend === 'up' 
            ? <TrendingUp className="w-4 h-4 text-green-500" />
            : <TrendingDown className="w-4 h-4 text-red-500" />
        )}
      </div>
      <p className="text-xs text-gray-400">{unit}</p>
    </motion.div>
  )
}

// =========== MACRO LEGEND ===========

interface MacroLegendProps {
  color: string
  label: string
  percent: number
  target: string
}

function MacroLegend({ color, label, percent, target }: MacroLegendProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-4 h-4 rounded", color)} />
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-bold text-gray-900">{percent}%</span>
        </div>
        <p className="text-xs text-gray-400">Target: {target}</p>
      </div>
    </div>
  )
}
