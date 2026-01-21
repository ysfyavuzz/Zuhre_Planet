/**
 * Service Worker
 *
 * Handles push notifications and offline functionality.
 * Caches assets for offline access.
 *
 * @file sw.js
 */

const CACHE_NAME = 'escort-platform-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/badge-72.png',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'Yeni Bildirim',
    body: 'Size yeni bir bildirim geldi',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: {},
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      console.error('Failed to parse push data:', error);
    }
  }

  const options: NotificationOptions = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: data.data,
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: data.data?.priority === 'urgent',
    actions: data.actions || [],
  };

  // Show notification
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Get the URL from notification data
      const url = event.notification.data?.url || '/';

      // Focus existing window or open new one
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return (client as WindowClient & { focus: () => Promise<void> }).focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Sync event - handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

/**
 * Sync notifications with server
 */
async function syncNotifications() {
  try {
    // Fetch pending notifications from IndexedDB
    // Send to server
    // Clear IndexedDB
    console.log('Syncing notifications...');
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}

// Periodic sync event
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'fetch-notifications') {
    event.waitUntil(fetchNotifications());
  }
});

/**
 * Fetch notifications from server
 */
async function fetchNotifications() {
  try {
    // Fetch new notifications from server
    // Show as local notifications
    console.log('Fetching notifications...');
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
}
