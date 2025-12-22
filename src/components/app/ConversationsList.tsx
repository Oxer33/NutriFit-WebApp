'use client'

/**
 * ============================================
 * CONVERSATIONS LIST - STORICO CONVERSAZIONI AI
 * ============================================
 * 
 * Componente per visualizzare e gestire lo storico delle conversazioni
 * con l'AI nutrizionista. Replica ConversationsFragment dell'app Android.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  ChevronRight,
  Clock,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { format, formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

// =========== TYPES ===========
interface ConversationsListProps {
  isOpen: boolean
  onClose: () => void
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
}

// =========== COMPONENT ===========
export function ConversationsList({ 
  isOpen, 
  onClose, 
  onSelectConversation,
  onNewConversation 
}: ConversationsListProps) {
  const { conversations, deleteConversation, currentConversationId } = useAppStore()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Ordina conversazioni per data (più recente prima)
  const sortedConversations = [...conversations].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const handleDelete = (id: string) => {
    deleteConversation(id)
    setConfirmDelete(null)
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
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Conversazioni</h2>
                <p className="text-xs text-gray-500">{conversations.length} chat salvate</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* New Conversation Button */}
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={() => { onNewConversation(); onClose() }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuova Conversazione
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {sortedConversations.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {sortedConversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group",
                      conv.id === currentConversationId && "bg-primary/5"
                    )}
                  >
                    {confirmDelete === conv.id ? (
                      /* Conferma eliminazione */
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Eliminare?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            No
                          </button>
                          <button
                            onClick={() => handleDelete(conv.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Sì
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Contenuto normale */
                      <div 
                        className="flex items-center justify-between"
                        onClick={() => { onSelectConversation(conv.id); onClose() }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {conv.title || 'Nuova conversazione'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conv.updatedAt), { 
                                addSuffix: true, 
                                locale: it 
                              })}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-xs text-gray-500">
                              {conv.messages.length} messaggi
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Delete button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(conv.id) }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-500 text-center">Nessuna conversazione</p>
                <p className="text-sm text-gray-400 text-center mt-1">
                  Inizia una nuova chat con il nutrizionista AI
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
