'use client'

/**
 * ============================================
 * VERIFY PAGE - PAGINA VERIFICA EMAIL
 * ============================================
 * 
 * Pagina che gestisce la verifica dell'email tramite token.
 * Mostra lo stato della verifica (successo/errore).
 */

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

type VerifyStatus = 'loading' | 'success' | 'error' | 'no-token'

// Componente interno che usa useSearchParams
function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<VerifyStatus>(token ? 'loading' : 'no-token')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }

    // Verifica token
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setMessage(data.message)
          
          // Redirect al login dopo 3 secondi
          setTimeout(() => {
            router.push('/auth/login?verified=true')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Errore durante la verifica')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Errore di connessione. Riprova.')
      }
    }

    verifyToken()
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-pink-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/50 text-center">
          
          {/* Loading */}
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Verifica in corso...
              </h2>
              <p className="text-gray-600">
                Stiamo verificando la tua email, un attimo di pazienza.
              </p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Email Verificata! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Verrai reindirizzato al login tra pochi secondi...
              </p>
              <Link
                href="/auth/login?verified=true"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                Vai al Login
              </Link>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Verifica Fallita
              </h2>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="block w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  Vai al Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Registrati di nuovo
                </Link>
              </div>
            </>
          )}

          {/* No Token */}
          {status === 'no-token' && (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Token Mancante
              </h2>
              <p className="text-gray-600 mb-6">
                Non hai fornito un token di verifica valido.
                <br />
                Controlla il link nell'email che hai ricevuto.
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="block w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  Vai al Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Registrati
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Componente principale con Suspense
export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-pink-light flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
