/**
 * ============================================
 * SERVICE WORKER - PWA NUTRIFIT
 * ============================================
 * 
 * Gestisce:
 * - Cache offline per asset statici
 * - Push notifications
 * - Background sync
 */

const CACHE_NAME = 'nutrifit-v1'
const OFFLINE_URL = '/offline.html'

// Asset da cacheare per funzionamento offline
const STATIC_ASSETS = [
  '/',
  '/app',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// =========== INSTALL ===========
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        // Forza attivazione immediata
        return self.skipWaiting()
      })
  )
})

// =========== ACTIVATE ===========
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Elimina cache vecchie
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Prendi controllo di tutte le pagine
      return self.clients.claim()
    })
  )
})

// =========== FETCH ===========
self.addEventListener('fetch', (event) => {
  // Ignora richieste non-GET
  if (event.request.method !== 'GET') return

  // Ignora richieste API (sempre fresh)
  if (event.request.url.includes('/api/')) return

  // Ignora richieste esterne
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Ritorna dalla cache, ma aggiorna in background
          event.waitUntil(
            fetch(event.request)
              .then((response) => {
                if (response.ok) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response))
                }
              })
              .catch(() => {/* Ignora errori di rete */})
          )
          return cachedResponse
        }

        // Non in cache, fetch dalla rete
        return fetch(event.request)
          .then((response) => {
            // Cache solo risposte valide
            if (response.ok && response.type === 'basic') {
              const responseToCache = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache))
            }
            return response
          })
          .catch(() => {
            // Offline: mostra pagina offline per navigazione
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL)
            }
            return new Response('Offline', { status: 503 })
          })
      })
  )
})

// =========== PUSH NOTIFICATIONS ===========
self.addEventListener('push', (event) => {
  console.log('[SW] Push received')
  
  if (!event.data) return

  try {
    const data = event.data.json()
    
    const options = {
      body: data.body || 'Hai una notifica da NutriFit',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      tag: data.tag || 'nutrifit-notification',
      renotify: true,
      data: {
        url: data.url || '/app',
        dateOfArrival: Date.now()
      },
      actions: data.actions || [
        { action: 'open', title: 'Apri NutriFit' },
        { action: 'dismiss', title: 'Chiudi' }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title || 'NutriFit', options)
    )
  } catch (error) {
    console.error('[SW] Push parse error:', error)
  }
})

// =========== NOTIFICATION CLICK ===========
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked')
  
  event.notification.close()

  if (event.action === 'dismiss') return

  const urlToOpen = event.notification.data?.url || '/app'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Cerca finestra già aperta
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }
        // Apri nuova finestra
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// =========== BACKGROUND SYNC ===========
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'sync-meals') {
    event.waitUntil(syncMeals())
  }
})

async function syncMeals() {
  // Placeholder per sync offline dei pasti
  // Implementare quando necessario
  console.log('[SW] Syncing meals...')
}

// =========== MESSAGE HANDLER ===========
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
