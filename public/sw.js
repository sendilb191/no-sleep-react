// Service Worker for Background Notifications and Battery Monitoring
// This ensures notifications work even when the main tab is suspended

// Store battery and notification settings
let batterySettings = {
  frequency: 5, // minutes (will be updated from main thread)
  soundEnabled: true,
  notificationsEnabled: true,
  autoReleaseEnabled: true,
  lowThreshold: 30,
  criticalThreshold: 20,
  highThreshold: 90,
};

let lastNotificationTime = 0;

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Handle messages from main thread
self.addEventListener('message', event => {
  const { type, data } = event.data;

  switch (type) {
    case 'BATTERY_UPDATE':
      handleBatteryUpdate(data);
      break;
    case 'SETTINGS_UPDATE':
      batterySettings = { ...batterySettings, ...data };
      break;
    case 'SW_TEST':
      scheduleServiceWorkerTest(data?.delay || 60);
      break;
    case 'START_MONITORING':
      break;
    case 'STOP_MONITORING':
      break;
    case 'PING':
      // Respond to ping to check if SW is alive
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ type: 'PONG', timestamp: Date.now() });
      }
      break;
    default:
      break;
  }
});

// Handle battery updates from main thread
function handleBatteryUpdate(batteryData) {
  const { level, charging } = batteryData;

  // Check if notifications are needed
  checkBatteryNotifications(level, charging);
}

// Check if battery notifications should be sent
// Service Worker is the single source of truth for reliable background notifications
function checkBatteryNotifications(level, charging) {
  const now = Date.now();
  const timeSinceLastNotification = now - lastNotificationTime;
  const frequencyMs = batterySettings.frequency * 60 * 1000;

  // Low battery notification
  if (
    level < batterySettings.lowThreshold &&
    !charging &&
    timeSinceLastNotification >= frequencyMs
  ) {
    sendBatteryNotification('low', level);
  }

  // High battery notification
  if (
    level > batterySettings.highThreshold &&
    charging &&
    timeSinceLastNotification >= frequencyMs
  ) {
    sendBatteryNotification('high', level);
  }

  // Critical battery - auto release wake lock
  if (
    level < batterySettings.criticalThreshold &&
    !charging &&
    batterySettings.autoReleaseEnabled
  ) {
    sendBatteryNotification('critical', level);
    // Notify main thread to release wake lock
    notifyMainThread('RELEASE_WAKE_LOCK', {
      level,
      reason: 'critical_battery',
    });
  }
}

// Send battery notification from service worker
// Service Worker is the single source of truth for reliable background notifications
function sendBatteryNotification(type, level) {
  if (!batterySettings.notificationsEnabled) return;

  let title, body, tag;
  const timestamp = new Date().toLocaleTimeString();

  switch (type) {
    case 'low':
      title = '🔋 Low Battery Warning';
      body = `Battery level is ${level}% and not charging. Consider connecting your charger.\n\nTime: ${timestamp}`;
      tag = `battery-low-${Date.now()}`;
      break;
    case 'high':
      title = '🔋 Battery Fully Charged';
      body = `Battery level is ${level}% and still charging. Consider unplugging to preserve battery health.\n\nTime: ${timestamp}`;
      tag = `battery-high-${Date.now()}`;
      break;
    case 'critical':
      title = '🔒 Wake Lock Auto-Released';
      body = `Wake lock automatically released due to critical battery level (${level}%) to preserve battery life.\n\nTime: ${timestamp}`;
      tag = 'auto-release';
      break;
  }

  const options = {
    body,
    icon: '/no-sleep.svg',
    badge: '/no-sleep.svg',
    tag,
    requireInteraction: false,
    silent: false,
  };

  self.registration
    .showNotification(title, options)
    .then(() => {
      lastNotificationTime = Date.now();

      // Notify main thread about the notification
      notifyMainThread('NOTIFICATION_SENT', {
        type,
        level,
        timestamp: lastNotificationTime,
        title,
        body,
      });
    })
    .catch(err => {});
}

// Notify main thread of events
function notifyMainThread(type, data) {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type, data });
    });
  });
}

// Handle notification click events
self.addEventListener('notificationclick', event => {
  event.notification.close();

  // Focus or open the app window
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});

// Periodic Background Sync for battery monitoring
self.addEventListener('sync', event => {
  if (event.tag === 'battery-check') {
    event.waitUntil(periodicBatteryCheck());
  }
});

// Periodic battery check when main thread might be suspended
async function periodicBatteryCheck() {
  try {
    // Try to get battery info if available in service worker context
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      const level = Math.round(battery.level * 100);
      const charging = battery.charging;

      // Update our stored values
      handleBatteryUpdate({ level, charging });

      // Notify main thread of the update
      notifyMainThread('SW_BATTERY_UPDATE', { level, charging });
    } else {
    }
  } catch (error) {
    // Handle periodic battery check failure silently
  }
}

// Service Worker test functionality
function scheduleServiceWorkerTest(delaySeconds) {
  const startTime = Date.now();

  // Send immediate confirmation
  notifyMainThread('SW_TEST_SCHEDULED', {
    delay: delaySeconds,
    scheduledAt: startTime,
    willTriggerAt: startTime + delaySeconds * 1000,
  });

  // Schedule the test notification
  setTimeout(() => {
    const actualTime = Date.now();
    const expectedTime = startTime + delaySeconds * 1000;
    const accuracy = Math.abs(actualTime - expectedTime);

    // Send test notification
    const title = '🧪 Service Worker Test';
    const body = `Service Worker is working properly!\n\nScheduled: ${new Date(startTime).toLocaleTimeString()}\nTriggered: ${new Date(actualTime).toLocaleTimeString()}\nAccuracy: ${accuracy}ms`;

    const options = {
      body,
      icon: '/no-sleep.svg',
      badge: '/no-sleep.svg',
      tag: `sw-test-${startTime}`,
      requireInteraction: false,
      silent: false,
    };

    self.registration
      .showNotification(title, options)
      .then(() => {
        // Notify main thread that test completed
        notifyMainThread('SW_TEST_COMPLETED', {
          scheduledAt: startTime,
          triggeredAt: actualTime,
          accuracy,
          success: true,
        });
      })
      .catch(err => {
        notifyMainThread('SW_TEST_COMPLETED', {
          scheduledAt: startTime,
          triggeredAt: actualTime,
          accuracy,
          success: false,
          error: err.message,
        });
      });
  }, delaySeconds * 1000);
}
