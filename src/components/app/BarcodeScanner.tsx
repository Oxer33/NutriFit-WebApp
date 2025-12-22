'use client'

/**
 * ============================================
 * BARCODE SCANNER - SCANNER CODICI A BARRE
 * ============================================
 * 
 * Scanner barcode per cercare alimenti tramite OpenFoodFacts API.
 * Usa la camera del browser per scannerizzare codici EAN.
 * Replica ScanFragment dell'app Android.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Search, Loader2, AlertCircle, Plus, Barcode } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FoodItem } from '@/types'

// =========== TYPES ===========
interface OpenFoodFactsProduct {
  product_name?: string
  brands?: string
  nutriments?: {
    'energy-kcal_100g'?: number
    proteins_100g?: number
    carbohydrates_100g?: number
    fat_100g?: number
    fiber_100g?: number
  }
  image_url?: string
  code?: string
  countries_tags?: string[] // Paesi di vendita del prodotto
}

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onProductFound: (food: Partial<FoodItem>) => void
}

// =========== COMPONENT ===========
export function BarcodeScanner({ isOpen, onClose, onProductFound }: BarcodeScannerProps) {
  const [mode, setMode] = useState<'manual' | 'camera'>('manual')
  const [barcode, setBarcode] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<OpenFoodFactsProduct | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cerca prodotto su OpenFoodFacts
  const searchProduct = useCallback(async (code: string) => {
    if (!code.trim()) return
    
    setIsSearching(true)
    setError(null)
    setProduct(null)
    
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code.trim()}.json`
      )
      const data = await response.json()
      
      if (data.status === 1 && data.product) {
        setProduct(data.product)
      } else {
        setError('Prodotto non trovato. Prova con un altro codice.')
      }
    } catch (err) {
      setError('Errore nella ricerca. Verifica la connessione.')
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Aggiungi prodotto trovato
  const handleAddProduct = () => {
    if (!product) return
    
    const food: Partial<FoodItem> = {
      name: product.product_name || 'Prodotto sconosciuto',
      calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
      protein: Math.round(product.nutriments?.proteins_100g || 0),
      carbs: Math.round(product.nutriments?.carbohydrates_100g || 0),
      fat: Math.round(product.nutriments?.fat_100g || 0),
      fiber: Math.round(product.nutriments?.fiber_100g || 0),
      source: 'openfoodfacts' as const,
      barcode: product.code
    }
    
    onProductFound(food)
    handleClose()
  }

  // Cleanup camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  // Avvia camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError('Impossibile accedere alla camera. Usa la ricerca manuale.')
      setMode('manual')
    }
  }, [])

  // Gestione camera
  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera()
    } else {
      stopCamera()
    }
    
    return () => stopCamera()
  }, [isOpen, mode, startCamera, stopCamera])

  // Reset e chiudi
  const handleClose = () => {
    stopCamera()
    setBarcode('')
    setProduct(null)
    setError(null)
    setMode('manual')
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Barcode className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Scanner Barcode</h2>
                <p className="text-xs text-gray-500">Cerca su OpenFoodFacts</p>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-xl">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('manual')}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                  mode === 'manual' 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Manuale
              </button>
              <button
                onClick={() => setMode('camera')}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg font-medium transition-colors",
                  mode === 'camera' 
                    ? "bg-blue-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Camera className="w-4 h-4 inline mr-2" />
                Camera
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {mode === 'manual' ? (
              /* Ricerca manuale */
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    placeholder="Inserisci codice a barre..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    onKeyDown={e => e.key === 'Enter' && searchProduct(barcode)}
                  />
                  <button
                    onClick={() => searchProduct(barcode)}
                    disabled={isSearching || !barcode.trim()}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 text-center">
                  Inserisci il codice EAN/UPC del prodotto
                </p>
              </div>
            ) : (
              /* Camera view */
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 border-2 border-white/50 rounded-lg" />
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Nota: lo scanner automatico richiede libreria esterna. Usa la modalità manuale per ora.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Product Found */}
            {product && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {product.product_name || 'Prodotto trovato'}
                  </h3>
                  {/* Badge provenienza OpenFoodFacts */}
                  <span className="px-2 py-1 text-[10px] font-medium rounded bg-orange-100 text-orange-700">
                    🌍 OpenFoodFacts {product.countries_tags?.[0]?.replace('en:', '').toUpperCase() || ''}
                  </span>
                </div>
                {product.brands && (
                  <p className="text-sm text-gray-500 mb-3">{product.brands}</p>
                )}
                
                <div className="grid grid-cols-4 gap-2 text-center text-xs mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <p className="font-bold text-gray-900">
                      {Math.round(product.nutriments?.['energy-kcal_100g'] || 0)}
                    </p>
                    <p className="text-gray-500">kcal</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="font-bold text-red-600">
                      {Math.round(product.nutriments?.proteins_100g || 0)}g
                    </p>
                    <p className="text-gray-500">Prot</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="font-bold text-blue-600">
                      {Math.round(product.nutriments?.carbohydrates_100g || 0)}g
                    </p>
                    <p className="text-gray-500">Carb</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="font-bold text-amber-600">
                      {Math.round(product.nutriments?.fat_100g || 0)}g
                    </p>
                    <p className="text-gray-500">Grassi</p>
                  </div>
                </div>
                
                <button
                  onClick={handleAddProduct}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Aggiungi al diario
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
