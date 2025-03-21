// Service Worker for enhanced offline capabilities

// Cache name with version for better management
const CACHE_NAME = 'agent-marketplace-cache-v1';

// Files to cache initially for offline functionality
const INITIAL_CACHE_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/index.css',
  '/assets/index.js'
];

// Install event: cache core files
self.addEventListener('install', event => {
  console.log('[Service Worker] Install Event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(INITIAL_CACHE_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate Event');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Helper function to determine if a request should be cached
const shouldCache = (url) => {
  // Cache CSS, JS, and images
  if (
    url.includes('/assets/') ||
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.svg') ||
    url.endsWith('.webp')
  ) {
    return true;
  }
  
  // Don't cache API requests or data endpoints
  if (
    url.includes('/api/') ||
    url.includes('functions.supabase.co') ||
    url.includes('supabase.co/rest')
  ) {
    return false;
  }
  
  return false;
};

// Fetch event: Network-first with cache fallback strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests differently - don't cache them
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return a minimal JSON response for API failures
          if (event.request.headers.get('accept').includes('application/json')) {
            return new Response(
              JSON.stringify({ error: 'You are offline. Please check your connection.' }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          }
          
          // For HTML requests, serve offline page
          return caches.match('/offline.html');
        })
    );
    return;
  }
  
  // For navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          // If offline, serve the offline page
          return caches.match('/offline.html');
        })
    );
    return;
  }
  
  // For assets and other cacheable resources
  if (shouldCache(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache fresh resources
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For all other requests
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Try to return something from cache if possible
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // For HTML requests, serve offline page
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              
              return new Response('Network error occurred', { status: 503 });
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-actions') {
    event.waitUntil(syncPendingActions());
  }
});

// Helper function to sync pending actions
async function syncPendingActions() {
  try {
    // Implement logic to retrieve and process queued actions when back online
    console.log('[Service Worker] Syncing pending actions');
    
    // Example implementation placeholder
    const db = await openDB();
    const pendingActions = await db.getAll('pendingActions');
    
    for (const action of pendingActions) {
      try {
        // Attempt to replay the action
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // If successful, remove from queue
        await db.delete('pendingActions', action.id);
      } catch (error) {
        console.error('[Service Worker] Failed to sync action:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error syncing pending actions:', error);
  }
}

// Helper function placeholder for IndexedDB operations
// This would be replaced with actual IndexedDB implementation
function openDB() {
  // Placeholder - would implement actual IndexedDB open logic
  return Promise.resolve({
    getAll: () => Promise.resolve([]),
    delete: () => Promise.resolve()
  });
}

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.message,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a tab is already open, focus it
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});
