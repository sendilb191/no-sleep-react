// Service Worker for No Sleep App
const CACHE_NAME = 'no-sleep-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/no-sleep.svg',
  '/src/main.jsx',
  '/src/App.jsx',
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Background sync for battery monitoring
self.addEventListener('sync', event => {
  if (event.tag === 'battery-check') {
    event.waitUntil(checkBatteryStatus());
  }
});

// Enhanced notification handling
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();

  // Focus or open the app
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(location.origin)) {
            return client.focus();
          }
        }
        // Otherwise open new window
        return clients.openWindow('/');
      })
  );
});

// Handle messages from main app
self.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'BATTERY_STATUS':
      handleBatteryUpdate(data);
      break;
    case 'WAKE_LOCK_STATUS':
      handleWakeLockUpdate(data);
      break;
    case 'SCHEDULE_NOTIFICATION':
      scheduleNotification(data);
      break;
    case 'CANCEL_NOTIFICATIONS':
      cancelScheduledNotifications();
      break;
  }
});

// Battery status handling
async function handleBatteryUpdate(batteryData) {
  // Store battery data for background monitoring
  await self.registration.sync.register('battery-check');

  // Note: Notifications are now handled by the main app with proper frequency control
  // Service worker only stores the data, doesn't send notifications
  console.log('Service Worker: Battery status updated', batteryData);
}

// Wake lock status handling
function handleWakeLockUpdate(wakeLockData) {
  console.log('Service Worker: Wake lock status updated', wakeLockData);
  // Could be used for analytics or coordination between tabs
}

// Enhanced notification scheduling
async function scheduleNotification(data) {
  const { frequency, batteryLevel, isCharging } = data;

  // Show immediate notification
  await showBatteryNotification({ level: batteryLevel, charging: isCharging });

  // Note: True background scheduling would require more complex implementation
  // This is a simplified version
}

// Show battery notification
async function showBatteryNotification(batteryData) {
  const { level, charging } = batteryData;
  const chargingStatus = charging ? 'charging' : 'not charging';

  const options = {
    body: `Battery level: ${level}% - Device is ${chargingStatus} and staying awake.`,
    icon: '/no-sleep.svg',
    badge: '/no-sleep.svg',
    tag: 'battery-status',
    requireInteraction: false,
    silent: false,
    actions: [
      {
        action: 'view',
        title: 'View App',
        icon: '/no-sleep.svg',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  return self.registration.showNotification(
    'No Sleep - Battery Status 🔋',
    options
  );
}

// Get stored settings from localStorage (using new app-settings structure)
async function getStoredSettings() {
  try {
    // Try to get settings from localStorage
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
      // Request settings from main app
      clients[0].postMessage({ type: 'GET_SETTINGS' });
    }

    // Return default settings as fallback
    return {
      battery: {
        notificationsEnabled: true,
        notificationFrequency: 5,
      },
      wakeLock: {
        active: false,
      },
    };
  } catch (error) {
    console.log('Service Worker: Could not get settings', error);
    return {
      battery: {
        notificationsEnabled: true,
        notificationFrequency: 5,
      },
      wakeLock: {
        active: false,
      },
    };
  }
}

// Background battery check
async function checkBatteryStatus() {
  try {
    // Note: Battery API might not be available in service worker context
    // This would need to be coordinated with the main app
    console.log('Service Worker: Background battery check');

    // Send message to all clients to check battery
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'CHECK_BATTERY' });
    });
  } catch (error) {
    console.log('Service Worker: Battery check failed', error);
  }
}

// Cancel scheduled notifications
function cancelScheduledNotifications() {
  // Clear any scheduled notifications
  console.log('Service Worker: Canceling scheduled notifications');
}

console.log('Service Worker: Loaded successfully');
