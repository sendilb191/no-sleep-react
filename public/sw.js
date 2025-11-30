// Service Worker for No Sleep App
const CACHE_NAME = 'no-sleep-v1';
const urlsToCache = ['/', './index.html', './no-sleep.svg'];

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
    case 'INIT_SW_SETTINGS':
      initializeNotificationSettings(data);
      break;
    case 'UPDATE_NOTIFICATION_SETTINGS':
      updateNotificationSettings(data);
      break;
    case 'CURRENT_BATTERY_STATUS':
      updateBatteryData(data);
      break;
    case 'TEST_NOTIFICATION':
      showBatteryNotification(data);
      break;
    case 'BATTERY_STATUS':
    case 'WAKE_LOCK_STATUS':
      // Legacy support - ignore or handle if needed
      break;
  }
});

// Legacy functions - kept for compatibility
async function handleBatteryUpdate(batteryData) {
  console.log('Service Worker: Legacy battery update', batteryData);
}

function handleWakeLockUpdate(wakeLockData) {
  console.log('Service Worker: Legacy wake lock update', wakeLockData);
}

// Notification management - initialized from main app
// All values are set by INIT_SW_SETTINGS message from main app
let notificationTimer = null;
let currentBatteryData = null;
let notificationSettings = null;
let notificationConditions = null;
let lastNotification = null;
let isInitialized = false;

// Initialize notification settings from main app
function initializeNotificationSettings(settings) {
  console.log('Service Worker: Initializing notification settings:', settings);

  // Set all values from main app - no defaults
  notificationSettings = {
    enabled: settings.enabled,
    frequency: settings.frequency,
  };

  // Set notification conditions from main app
  notificationConditions = {
    minBatteryLevel: settings.conditions?.minBatteryLevel,
    requireCharging: settings.conditions?.requireCharging,
  };

  // Initialize last notification tracking
  lastNotification = {
    timestamp: null,
    batteryLevel: null,
    chargingStatus: null,
  };

  // Initialize battery data if provided
  if (settings.batteryData) {
    currentBatteryData = settings.batteryData;
  }

  console.log(
    'Service Worker: Initialized with conditions:',
    notificationConditions
  );
  console.log(
    'Service Worker: Initialized with settings:',
    notificationSettings
  );

  // Mark as initialized
  isInitialized = true;

  // Start timer if enabled
  if (settings.enabled) {
    startNotificationTimer();
  }
}

// Update notification settings and manage timer
function updateNotificationSettings(settings) {
  console.log('Service Worker: Updating notification settings:', settings);

  // Only update if initialized
  if (!isInitialized || !notificationSettings) {
    console.log('Service Worker: Cannot update - not initialized yet');
    return;
  }

  // Clear existing timer first
  if (notificationTimer) {
    clearInterval(notificationTimer);
    notificationTimer = null;
  }

  // Cancel any existing notifications when settings change
  cancelExistingNotifications();

  // Update settings
  notificationSettings.enabled = settings.enabled;
  notificationSettings.frequency = settings.frequency;

  // Start new timer if enabled
  if (settings.enabled) {
    startNotificationTimer();
  }
}

// Cancel all existing notifications
async function cancelExistingNotifications() {
  try {
    const notifications = await self.registration.getNotifications();
    console.log(
      'Service Worker: Canceling',
      notifications.length,
      'existing notifications'
    );

    notifications.forEach(notification => {
      if (notification.tag && notification.tag.startsWith('battery-status')) {
        notification.close();
      }
    });
  } catch (error) {
    console.log(
      'Service Worker: Could not cancel existing notifications:',
      error
    );
  }
}

// Start notification timer
function startNotificationTimer() {
  if (!isInitialized || !notificationSettings?.enabled) return;

  const intervalMs = notificationSettings.frequency * 60 * 1000;
  console.log(
    'Service Worker: Starting notification timer -',
    notificationSettings.frequency,
    'minutes'
  );

  notificationTimer = setInterval(() => {
    console.log('Service Worker: Timer fired - checking battery status');
    // Use current battery data, or fallback if not available
    const batteryData = currentBatteryData || { level: 0, charging: false };

    // Check notification conditions
    const meetsBatteryCondition =
      batteryData.level > notificationConditions.minBatteryLevel;
    const meetsChargingCondition =
      !notificationConditions.requireCharging || batteryData.charging;

    if (meetsBatteryCondition && meetsChargingCondition) {
      console.log(
        `Service Worker: Conditions met - battery ${batteryData.level}% > ${notificationConditions.minBatteryLevel}%, charging: ${batteryData.charging} - showing notification`
      );
      showBatteryNotification(batteryData);
    } else {
      const reasons = [];
      if (!meetsChargingCondition) reasons.push('not charging');
      if (!meetsBatteryCondition)
        reasons.push(
          `battery ${batteryData.level}% ≤ ${notificationConditions.minBatteryLevel}%`
        );
      console.log(
        `Service Worker: Skipping notification - ${reasons.join(', ')}`
      );
    }
  }, intervalMs);
}

// Update battery data
function updateBatteryData(data) {
  currentBatteryData = data;
  console.log('Service Worker: Battery data updated:', data);
}

// Show battery notification
async function showBatteryNotification(batteryData) {
  const { level, charging } = batteryData;

  // Double-check conditions before showing notification
  const meetsBatteryCondition = level > notificationConditions.minBatteryLevel;
  const meetsChargingCondition =
    !notificationConditions.requireCharging || charging;

  if (!meetsBatteryCondition || !meetsChargingCondition) {
    console.log(
      `Service Worker: Notification blocked - battery: ${level}% (need >${notificationConditions.minBatteryLevel}%), charging: ${charging} (required: ${notificationConditions.requireCharging})`
    );
    return;
  }

  const chargingStatus = charging ? 'charging' : 'not charging';
  const now = new Date();

  // Format time manually to ensure seconds are always shown
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const timestamp = `${displayHours}:${minutes}:${seconds} ${ampm}`;

  // Build notification body with last notification info
  let bodyText = `Battery: ${level}% (${chargingStatus}) - ${timestamp}\nDevice is staying awake.`;

  if (lastNotification.timestamp) {
    const lastTime = new Date(lastNotification.timestamp);
    const timeDiff = now - lastTime;
    const minutesAgo = Math.floor(timeDiff / 60000);
    const secondsAgo = Math.floor((timeDiff % 60000) / 1000);
    // Format last time manually to ensure seconds are always shown
    const lastHours = lastTime.getHours();
    const lastMinutes = lastTime.getMinutes().toString().padStart(2, '0');
    const lastSeconds = lastTime.getSeconds().toString().padStart(2, '0');
    const lastAmpm = lastHours >= 12 ? 'PM' : 'AM';
    const lastDisplayHours = lastHours % 12 || 12;
    const lastTimeStr = `${lastDisplayHours}:${lastMinutes}:${lastSeconds} ${lastAmpm}`;

    bodyText += `\n\nPrevious: ${lastTimeStr}`;

    if (minutesAgo > 0) {
      bodyText += ` (${minutesAgo}m ${secondsAgo}s ago)`;
    } else if (secondsAgo > 0) {
      bodyText += ` (${secondsAgo}s ago)`;
    } else {
      bodyText += ` (just now)`;
    }
  } else {
    bodyText += '\n\nFirst notification of this session';
  }

  const options = {
    body: bodyText,
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

  // Update last notification tracking
  lastNotification = {
    timestamp: now.getTime(),
    batteryLevel: level,
    chargingStatus: chargingStatus,
  };

  return self.registration.showNotification(
    'No Sleep - Battery Status 🔋',
    options
  );
}

// Get default settings (no localStorage needed)
async function getDefaultSettings() {
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

// Cancel scheduled notifications (legacy support)
function cancelScheduledNotifications() {
  if (notificationTimer) {
    clearInterval(notificationTimer);
    notificationTimer = null;
    console.log('Service Worker: Legacy - Notification timer canceled');
  }
}

console.log('Service Worker: Loaded successfully');
