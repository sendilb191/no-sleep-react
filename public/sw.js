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
    case 'CURRENT_BATTERY_STATUS':
      // Received current battery status, show notification if appropriate
      if (currentSettings.battery.notificationsEnabled) {
        showBatteryNotification(data);
      }
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

// Enhanced notification scheduling with persistent timers
let notificationTimer = null;
let currentSettings = {
  battery: {
    notificationsEnabled: true,
    notificationFrequency: 5,
  },
  wakeLock: {
    active: false,
  },
};

async function scheduleNotification(data) {
  const { frequency, batteryLevel, isCharging, enabled } = data;

  // Clear existing timer
  if (notificationTimer) {
    clearInterval(notificationTimer);
    notificationTimer = null;
  }

  if (!enabled) {
    console.log('Service Worker: Notifications disabled, stopping timer');
    return;
  }

  // Store current settings
  currentSettings.battery.notificationsEnabled = enabled;
  currentSettings.battery.notificationFrequency = frequency;

  console.log(
    'Service Worker: Starting notification timer with frequency:',
    frequency,
    'minutes'
  );

  // Set up recurring notifications
  const intervalMs = frequency * 60 * 1000; // Convert minutes to milliseconds

  notificationTimer = setInterval(async () => {
    try {
      // Get current battery status from main app
      const clients = await self.clients.matchAll();
      if (clients.length > 0) {
        // Request current battery status
        clients[0].postMessage({ type: 'REQUEST_BATTERY_STATUS' });
      } else {
        // No active clients, show notification with stored data
        await showBatteryNotification({
          level: batteryLevel,
          charging: isCharging,
        });
      }
    } catch (error) {
      console.error('Service Worker: Error in notification timer:', error);
    }
  }, intervalMs);

  // Show immediate notification for testing
  await showBatteryNotification({ level: batteryLevel, charging: isCharging });
}

// Show battery notification
async function showBatteryNotification(batteryData) {
  const { level, charging } = batteryData;
  const chargingStatus = charging ? 'charging' : 'not charging';
  const timestamp = new Date().toLocaleTimeString();

  const options = {
    body: `Battery: ${level}% (${chargingStatus}) - ${timestamp}\nDevice is staying awake.`,
    icon: '/no-sleep.svg',
    badge: '/no-sleep.svg',
    tag: 'battery-status-' + Date.now(), // Unique tag to show multiple notifications
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

  console.log(
    'Service Worker: Showing notification for battery level:',
    level + '%'
  );
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
  if (notificationTimer) {
    clearInterval(notificationTimer);
    notificationTimer = null;
    console.log('Service Worker: Notification timer canceled');
  }
}

console.log('Service Worker: Loaded successfully');
