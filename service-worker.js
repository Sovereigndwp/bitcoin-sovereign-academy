/**
 * Service Worker for Bitcoin Sovereign Academy
 * Enables offline functionality and PWA features
 */

const CACHE_NAME = 'bsa-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/interactive-demos/bitcoin-sovereign-game/',
  '/interactive-demos/bitcoin-sovereign-game.js',
  '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache install error:', err))
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // SECURITY: Validate response before caching
          // Check if valid response
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }
          
          // Additional security: Don't cache responses that might be malicious
          const contentType = response.headers.get('content-type') || '';
          // Only cache safe content types
          const safeContentTypes = ['text/html', 'text/css', 'application/javascript', 'application/json', 'image/', 'font/'];
          const isSafeContentType = safeContentTypes.some(type => contentType.includes(type));
          
          if (!isSafeContentType) {
            return response; // Return without caching
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              // SECURITY: Only cache same-origin resources to prevent caching malicious external content
              // Only cache resources from our own domain
              const requestUrl = new URL(event.request.url);
              const originUrl = new URL(self.location.origin);
              
              // Only cache if:
              // 1. Same origin (same protocol, hostname, port)
              // 2. Response is successful (status 200)
              // 3. Response type is not opaque (CORS issues)
              if (requestUrl.origin === originUrl.origin && 
                  response.status === 200 && 
                  response.type !== 'opaque') {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        }).catch(() => {
          // Offline fallback
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
          // For other resources, return a default offline response
          return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Background sync for game progress
self.addEventListener('sync', event => {
  if (event.tag === 'sync-game-progress') {
    event.waitUntil(syncGameProgress());
  }
});

async function syncGameProgress() {
  // Get saved game progress from IndexedDB
  // Send to server when connection is restored
  console.log('Syncing game progress...');
}

// Push notifications for achievements
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New achievement unlocked!',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="70" font-size="70">🏆</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="70" font-size="70">₿</text></svg>',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Bitcoin Sovereign Academy', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});