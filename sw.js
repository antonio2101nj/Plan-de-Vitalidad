// Service Worker - Plan de Vitalidad
// PWA Service Worker com cache inteligente e sincronização

const CACHE_NAME = 'plan-vitalidad-v2.0.0';
const STATIC_CACHE_NAME = 'plan-vitalidad-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'plan-vitalidad-dynamic-v2.0.0';

// Static resources to cache
const STATIC_ASSETS = [
  '/',
  '/index-new.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/firebase/firebase-config.js',
  '/src/cloudinary/upload.js',
  '/src/pages/Login.jsx',
  '/src/pages/AdminPanel.jsx',
  '/src/pages/UserPanel.jsx',
  '/src/components/FileUploader.jsx',
  '/src/components/FileViewer.jsx',
  '/manifest-new.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Dynamic resources patterns
const DYNAMIC_PATTERNS = [
  /^https:\/\/api\.cloudinary\.com\//,
  /^https:\/\/res\.cloudinary\.com\//,
  /^https:\/\/firestore\.googleapis\.com\//,
  /^https:\/\/identitytoolkit\.googleapis\.com\//
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
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

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isApiRequest(request)) {
    event.respondWith(networkFirst(request));
  } else if (isDynamicAsset(request)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Cache strategies implementations
async function cacheFirst(request) {
  try {
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
      return cacheResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
      return cacheResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cacheResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  return cacheResponse || networkPromise;
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return STATIC_ASSETS.some(asset => 
    request.url.includes(asset) || 
    url.pathname.endsWith('.js') || 
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json') ||
    url.pathname.includes('/icons/')
  );
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('firebase') || 
         url.hostname.includes('googleapis') ||
         url.hostname.includes('cloudinary');
}

function isDynamicAsset(request) {
  return DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url));
}

// Background sync for offline uploads
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'upload-sync') {
    event.waitUntil(syncUploads());
  }
});

async function syncUploads() {
  try {
    console.log('Syncing offline uploads...');
    // Implementation for syncing offline uploads would go here
    // This would work with IndexedDB to store failed uploads
    
    const uploads = await getOfflineUploads();
    for (const upload of uploads) {
      try {
        await retryUpload(upload);
        await removeOfflineUpload(upload.id);
      } catch (error) {
        console.error('Failed to sync upload:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Placeholder functions for offline upload sync
async function getOfflineUploads() {
  // Get uploads from IndexedDB
  return [];
}

async function retryUpload(upload) {
  // Retry the upload to Cloudinary
  console.log('Retrying upload:', upload);
}

async function removeOfflineUpload(id) {
  // Remove from IndexedDB
  console.log('Removing offline upload:', id);
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'Novos materiais foram adicionados!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'new-materials',
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver materiais',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Plan de Vitalidad', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('Message received:', event.data);
  
  if (event.data.type === 'CACHE_CLOUDINARY_IMAGE') {
    event.waitUntil(cacheCloudinaryImage(event.data.url));
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

async function cacheCloudinaryImage(url) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response);
      console.log('Cached Cloudinary image:', url);
    }
  } catch (error) {
    console.error('Failed to cache Cloudinary image:', error);
  }
}

async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('Service Worker: Loaded');