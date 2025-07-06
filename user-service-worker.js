// Service Worker for Plan de Vitalidad User PWA
const CACHE_NAME = 'plan-vitalidad-user-v1.0.0';
const STATIC_CACHE_NAME = 'user-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'user-dynamic-v1.0.0';

// Files to cache immediately for user dashboard
const STATIC_FILES = [
  '/user-dashboard.html',
  '/user-dashboard.css',
  '/user-dashboard.js',
  '/auth.js',
  '/user-manifest.json',
  '/app-login.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Offline fallback page
const OFFLINE_PAGE = '/user-dashboard.html';

// Network timeout
const NETWORK_TIMEOUT = 3000;

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🌱 Plan de Vitalidad User SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('🌱 User SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('🌱 User SW: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('🌱 User SW: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🌱 User SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('🌱 User SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🌱 User SW: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip Chrome extension requests
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Handle different types of requests
  if (isUserPage(request.url)) {
    event.respondWith(handleUserPage(request));
  } else if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// Check if request is for user dashboard pages
function isUserPage(url) {
  return url.includes('user-dashboard.html') ||
         url.includes('app-login.html') ||
         url.includes('index.html');
}

// Check if request is for static assets
function isStaticAsset(url) {
  return url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.woff') ||
         url.includes('.woff2') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fontawesome') ||
         url.includes('cdnjs.cloudflare.com') ||
         url.includes('.svg') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.webp');
}

// Check if request is for API
function isAPIRequest(url) {
  return url.includes('/api/') || 
         url.includes('kiwify.com') ||
         url.includes('.json');
}

// Handle user dashboard pages with cache-first strategy
async function handleUserPage(request) {
  try {
    // Always try cache first for user pages
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Update cache in background
      updateCacheInBackground(request);
      return cachedResponse;
    }
    
    // If not cached, try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌱 User SW: Network failed for user page, serving offline fallback');
    
    // Return cached offline page
    const cachedFallback = await caches.match(OFFLINE_PAGE);
    if (cachedFallback) {
      return cachedFallback;
    }
    
    // Create basic offline page if no cache available
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Plan de Vitalidad - Offline</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            margin: 0; 
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
          }
          .offline-container { text-align: center; }
          .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
          h1 { margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">🌱</div>
          <h1>Plan de Vitalidad</h1>
          <p>Você está offline. Verifique sua conexão e tente novamente.</p>
          <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
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
    console.log('🌱 User SW: Failed to load static asset:', error);
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f0f0f0"/>
          <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">
            🌱 Imagem offline
          </text>
        </svg>`,
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
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
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌱 User SW: Network failed for API request, trying cache');
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Sin conexión. Algunos datos pueden no estar actualizados.',
        offline: true,
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

// Handle other requests
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_PAGE);
    }
    
    throw error;
  }
}

// Update cache in background
async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response);
    }
  } catch (error) {
    // Ignore background update errors
  }
}

// Push notification handler for user notifications
self.addEventListener('push', (event) => {
  const defaultOptions = {
    body: '¡Tienes nuevas actualizaciones en tu Plan de Vitalidad!',
    icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 512 512\'%3E%3Crect width=\'512\' height=\'512\' rx=\'115\' fill=\'%2310B981\'/%3E%3Ctext x=\'256\' y=\'350\' font-size=\'280\' text-anchor=\'middle\' fill=\'white\'%3E🌱%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 96 96\'%3E%3Crect width=\'96\' height=\'96\' rx=\'20\' fill=\'%2310B981\'/%3E%3Ctext x=\'48\' y=\'65\' font-size=\'48\' text-anchor=\'middle\' fill=\'white\'%3E🌱%3C/text%3E%3C/svg%3E',
    tag: 'plan-vitalidad-user',
    data: {
      url: '/user-dashboard.html'
    },
    actions: [
      {
        action: 'open-dashboard',
        title: 'Ver Dashboard',
        icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%2310B981\'%3E%3Cpath d=\'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z\'/%3E%3C/svg%3E'
      },
      {
        action: 'view-challenges',
        title: 'Ver Desafíos',
        icon: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%2310B981\'%3E%3Cpath d=\'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\'/%3E%3C/svg%3E'
      }
    ],
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };
  
  let options = defaultOptions;
  
  if (event.data) {
    try {
      const payload = event.data.json();
      options = { ...defaultOptions, ...payload };
    } catch (error) {
      console.error('🌱 User SW: Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Plan de Vitalidad', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  let url = '/user-dashboard.html';
  
  if (event.action === 'open-dashboard') {
    url = '/user-dashboard.html';
  } else if (event.action === 'view-challenges') {
    url = '/user-dashboard.html#desafios';
  } else if (event.notification.data?.url) {
    url = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes('user-dashboard') && 'focus' in client) {
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

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'user-data-sync') {
    event.waitUntil(handleUserDataSync());
  }
});

async function handleUserDataSync() {
  try {
    console.log('🌱 User SW: Syncing user data in background');
    
    // Here you would sync user progress, completed tasks, etc.
    // For now, just log the sync attempt
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC_COMPLETE',
        message: 'Datos sincronizados'
      });
    });
  } catch (error) {
    console.error('🌱 User SW: Background sync failed:', error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_USER_DATA') {
    const cache = caches.open(DYNAMIC_CACHE_NAME);
    cache.then(c => {
      const response = new Response(JSON.stringify(event.data.data));
      c.put('/user-data', response);
    });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'user-progress-sync') {
    event.waitUntil(handlePeriodicSync());
  }
});

async function handlePeriodicSync() {
  try {
    console.log('🌱 User SW: Periodic sync for user progress');
    // Sync user progress data periodically
  } catch (error) {
    console.error('🌱 User SW: Periodic sync failed:', error);
  }
}

console.log('🌱 Plan de Vitalidad User Service Worker loaded successfully');