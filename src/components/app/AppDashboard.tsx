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
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Brain, User, Footprints, Droplets } from 'lucide-react'
import { DiaryTab } from './tabs/DiaryTab'
import { AITab } from './tabs/AITab'
import { ProfileTab } from './tabs/ProfileTab'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'diary', label: 'Diario', icon: Calendar },
  { id: 'ai', label: 'AI Coach', icon: Brain },
  { id: 'profile', label: 'Profilo', icon: User },
]

export function AppDashboard() {
  const [activeTab, setActiveTab] = useState('diary')

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header con titolo */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          La tua App <span className="text-gradient">NutriFit</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Gestisci la tua <em>nutrizione</em> quotidiana
        </p>
      </motion.div>

      {/* Quick Stats Bar */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <QuickStatCard
          icon={Calendar}
          label="Calorie Oggi"
          value="1,245"
          subtext="/ 2,000 kcal"
          color="bg-blue-500"
        />
        <QuickStatCard
          icon={Footprints}
          label="Passi"
          value="6,543"
          subtext="obiettivo 10,000"
          color="bg-green-500"
        />
        <QuickStatCard
          icon={Droplets}
          label="Acqua"
          value="5"
          subtext="bicchieri"
          color="bg-cyan-500"
        />
        <QuickStatCard
          icon={Brain}
          label="Conversazioni AI"
          value="3"
          subtext="questa settimana"
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
}

function QuickStatCard({ icon: Icon, label, value, subtext, color }: QuickStatCardProps) {
  return (
    <motion.div
      className="glass-card p-4"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-xl', color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400">{subtext}</p>
        </div>
      </div>
    </motion.div>
  )
}
