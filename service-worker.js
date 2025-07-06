// Service Worker for Plan de Vitalidad Admin PWA
const CACHE_NAME = 'plan-vitalidad-admin-v1.0.0';
const STATIC_CACHE_NAME = 'static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Files to cache on demand
const DYNAMIC_FILES = [
  '/api/',
  '/uploads/',
  '/images/'
];

// Network timeout
const NETWORK_TIMEOUT = 5000;

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip Chrome extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Handle different types of requests
  if (isStaticFile(request.url)) {
    event.respondWith(handleStaticFile(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isDynamicFile(request.url)) {
    event.respondWith(handleDynamicFile(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// Check if request is for a static file
function isStaticFile(url) {
  return STATIC_FILES.some(file => url.includes(file)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.woff') ||
         url.includes('.woff2') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fontawesome');
}

// Check if request is for API
function isAPIRequest(url) {
  return url.includes('/api/') || url.includes('api.');
}

// Check if request is for dynamic content
function isDynamicFile(url) {
  return DYNAMIC_FILES.some(path => url.includes(path)) ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.png') ||
         url.includes('.gif') ||
         url.includes('.svg') ||
         url.includes('.webp');
}

// Handle static files with cache-first strategy
async function handleStaticFile(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Error handling static file:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    // Return cached version if available
    return caches.match(request);
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      )
    ]);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for API request, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Unable to fetch data. Please check your connection.',
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle dynamic files with cache-first strategy
async function handleDynamicFile(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Update cache in background
      fetch(request)
        .then(response => {
          if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE_NAME);
            cache.then(c => c.put(request, response));
          }
        })
        .catch(() => {
          // Ignore background update errors
        });
      
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Error handling dynamic file:', error);
    
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#f0f0f0"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">Imagem indisponível</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    return caches.match(request);
  }
}

// Handle other requests
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('Service Worker: Network failed for other request:', error);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    // Return generic offline response
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      handleBackgroundSync()
    );
  }
});

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Retry failed requests stored in IndexedDB
    // Implementation depends on your specific needs
    console.log('Service Worker: Handling background sync');
    
    // Example: Retry sending analytics data, form submissions, etc.
    const failedRequests = await getFailedRequests();
    
    for (const request of failedRequests) {
      try {
        await fetch(request);
        await removeFailedRequest(request);
      } catch (error) {
        console.log('Service Worker: Failed to sync request:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: 'Nova notificação do Plan de Vitalidad Admin',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    tag: 'plan-vitalidad-notification',
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/manifest-icon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      options.body = payload.body || options.body;
      options.data = payload.data || options.data;
    } catch (error) {
      console.error('Service Worker: Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Plan de Vitalidad Admin', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
    );
  }
});

// Utility functions for background sync
async function getFailedRequests() {
  // Implementation would use IndexedDB to store failed requests
  // For now, return empty array
  return [];
}

async function removeFailedRequest(request) {
  // Implementation would remove the request from IndexedDB
  console.log('Service Worker: Removing failed request:', request);
}

// Handle service worker errors
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error occurred:', event.error);
});

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled promise rejection:', event.reason);
});

console.log('Service Worker: Loaded successfully');