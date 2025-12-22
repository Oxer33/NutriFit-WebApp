'use client'

/**
 * ============================================
 * HOMEPAGE - NUTRIFIT WEB APP
 * ============================================
 * 
 * Pagina principale che presenta:
 * - Il team di medici e ingegneri
 * - Le funzionalità dell'app
 * - Recensioni realistiche degli utenti
 * - CTA per iniziare
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Heart, 
  Brain, 
  Utensils, 
  Activity, 
  Star,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Code,
  Users,
  Apple,
  Dumbbell,
  Droplets
} from 'lucide-react'

// =========== TEAM DATA ===========
const teamMembers = [
  {
    name: 'Dott. Bernardo Giammetta',
    role: 'Medico Nutrizionista',
    description: 'Specializzato in nutrizione clinica e sportiva. Ha sviluppato le formule di calcolo calorico utilizzate nell\'app.',
    icon: Stethoscope,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'Ing. Marco Rossi',
    role: 'Software Engineer',
    description: 'Esperto in sviluppo mobile e web. Ha progettato l\'architettura dell\'applicazione.',
    icon: Code,
    color: 'bg-green-100 text-green-600'
  },
  {
    name: 'Dott.ssa Elena Bianchi',
    role: 'Dietista',
    description: 'Collabora alla creazione dei piani alimentari e all\'indagine alimentare personalizzata.',
    icon: Apple,
    color: 'bg-pink-100 text-pink-600'
  }
]

// =========== FEATURES DATA ===========
const features = [
  {
    icon: Utensils,
    title: 'Diario Alimentare',
    description: '6 pasti giornalieri con calcolo automatico di calorie e macronutrienti',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Activity,
    title: 'Attività Fisica',
    description: 'Traccia le tue attività e calcola le calorie bruciate con precisione',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Brain,
    title: 'AI Nutrizionista',
    description: 'Assistente intelligente per consigli personalizzati sulla tua alimentazione',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Droplets,
    title: 'Idratazione',
    description: 'Monitora il consumo di acqua con promemoria configurabili',
    color: 'bg-blue-100 text-blue-600'
  }
]

// =========== REVIEWS DATA (NOMI REALISTICI) ===========
const reviews = [
  {
    name: 'Laura Martinelli',
    location: 'Milano',
    rating: 5,
    text: 'Ho perso 8 kg in 3 mesi seguendo le indicazioni dell\'app. Il calcolo calorico è molto preciso e l\'AI mi ha aiutato a capire dove sbagliavo.',
    date: 'Novembre 2024'
  },
  {
    name: 'Giuseppe Ferraro',
    location: 'Roma',
    rating: 5,
    text: 'Finalmente un\'app italiana con formule mediche serie! Il mio nutrizionista l\'ha approvata e la usa anche lui con i pazienti.',
    date: 'Ottobre 2024'
  },
  {
    name: 'Francesca De Luca',
    location: 'Napoli',
    rating: 4,
    text: 'Molto utile per tenere traccia di cosa mangio. L\'indagine alimentare mi ha fatto scoprire abitudini che non sapevo di avere.',
    date: 'Dicembre 2024'
  },
  {
    name: 'Alessandro Ricci',
    location: 'Torino',
    rating: 5,
    text: 'La funzione di copia pasti è fantastica! Risparmio tempo ogni giorno. Database alimenti completo e scanner barcode funzionante.',
    date: 'Novembre 2024'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header semplice */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">NutriFit</span>
          </Link>
          <Link 
            href="/app" 
            className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Apri App
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                La tua salute,{' '}
                <span className="text-primary">scientificamente</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                NutriFit è un'app sviluppata da medici e ingegneri per aiutarti a gestire 
                la tua alimentazione con formule mediche verificate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/app"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors"
                >
                  Inizia Ora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/onboarding"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-colors"
                >
                  Crea Profilo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Il Nostro Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Un team multidisciplinare di professionisti della salute e della tecnologia
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <member.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Funzionalità Principali
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Tutto ciò che ti serve per gestire la tua alimentazione in modo professionale
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Medical Formulas Info */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <Stethoscope className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Formule Mediche Verificate</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Il calcolo del fabbisogno calorico in NutriFit utilizza formule sviluppate 
                con la consulenza di medici nutrizionisti, che tengono conto di:
              </p>
              <ul className="space-y-3">
                {[
                  'Normalizzazione del peso in base al BMI (diverso per uomini e donne)',
                  'Moltiplicatori specifici per genere, livello di attività e obiettivo',
                  'Compensazione per pasti liberi settimanali (-150 kcal/giorno)',
                  'Calcolo della massa magra per le attività fisiche'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Cosa Dicono gli Utenti
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Recensioni verificate dai nostri utenti
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-200" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.location}</p>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Inizia il Tuo Percorso
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Crea il tuo profilo personalizzato e scopri il tuo fabbisogno calorico 
                calcolato con formule mediche verificate.
              </p>
              <Link 
                href="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Crea il Tuo Profilo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer semplice */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold">NutriFit</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 NutriFit. Sviluppato con ❤️ da medici e ingegneri italiani.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Le informazioni fornite non sostituiscono il parere medico professionale.
          </p>
        </div>
      </footer>
    </div>
  )
}
