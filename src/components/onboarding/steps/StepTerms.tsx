'use client'

/**
 * ============================================
 * STEP TERMS - Termini e Condizioni
 * ============================================
 */

import { motion } from 'framer-motion'
import { FileText, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepTermsProps {
  data: { termsAccepted: boolean }
  updateData: (key: 'termsAccepted', value: boolean) => void
}

export function StepTerms({ data, updateData }: StepTermsProps) {
  return (
    <div className="text-center">
      {/* Icon */}
      <motion.div 
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <FileText className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Termini e Condizioni
      </h1>
      <p className="text-gray-500 mb-6">
        Leggi e accetta i termini per continuare
      </p>

      {/* Terms Box */}
      <motion.div
        className="bg-gray-50 rounded-2xl p-4 mb-6 max-h-48 overflow-y-auto text-left text-sm text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold text-gray-900 mb-2">Disclaimer Medico</h3>
        <p className="mb-3">
          NutriFit è un&apos;applicazione progettata per aiutarti a monitorare la tua alimentazione 
          e attività fisica. Le informazioni fornite dall&apos;app, inclusi i piani alimentari 
          generati dall&apos;intelligenza artificiale, hanno scopo puramente informativo e 
          non sostituiscono in alcun modo il parere di un medico o nutrizionista qualificato.
        </p>
        
        <h3 className="font-bold text-gray-900 mb-2">Uso dell&apos;App</h3>
        <p className="mb-3">
          I calcoli calorici e le raccomandazioni si basano su formule scientifiche standard 
          (Harris-Benedict, MET) ma sono stime generiche. Ogni individuo ha esigenze diverse.
        </p>
        
        <h3 className="font-bold text-gray-900 mb-2">Consulenza Professionale</h3>
        <p className="mb-3">
          Prima di iniziare qualsiasi programma alimentare o di esercizio fisico, 
          consulta sempre un professionista della salute, specialmente se hai 
          condizioni mediche preesistenti.
        </p>

        <h3 className="font-bold text-gray-900 mb-2">Privacy</h3>
        <p>
          I tuoi dati sono salvati localmente sul tuo dispositivo. 
          Non raccogliamo né condividiamo informazioni personali con terze parti.
        </p>
      </motion.div>

      {/* Checkbox */}
      <motion.button
        onClick={() => updateData('termsAccepted', !data.termsAccepted)}
        className={cn(
          "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4",
          data.termsAccepted
            ? "border-primary bg-primary/5"
            : "border-gray-200 bg-white hover:border-gray-300"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={cn(
          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
          data.termsAccepted
            ? "bg-primary border-primary"
            : "border-gray-300"
        )}>
          {data.termsAccepted && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className="text-gray-700 text-left">
          Ho letto e accetto i termini e condizioni d&apos;uso e il disclaimer medico
        </span>
      </motion.button>
    </div>
  )
}
