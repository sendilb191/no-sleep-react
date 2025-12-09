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
let lastBatteryLevel = 100;
let isCharging = false;

self.addEventListener('install', event => {
  console.log('Service Worker: Installed with battery monitoring');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activated with battery monitoring');
  event.waitUntil(self.clients.claim());
});

// Handle messages from main thread
self.addEventListener('message', event => {
  console.log('SW: Received message:', event.data);
  const { type, data } = event.data;

  switch (type) {
    case 'BATTERY_UPDATE':
      handleBatteryUpdate(data);
      break;
    case 'SETTINGS_UPDATE':
      batterySettings = { ...batterySettings, ...data };
      console.log('SW: Settings updated', batterySettings);
      break;
    case 'SW_TEST':
      console.log('SW: Starting test with delay:', data?.delay || 60);
      scheduleServiceWorkerTest(data?.delay || 60);
      break;
    case 'START_MONITORING':
      console.log('SW: Starting monitoring');
      break;
    case 'STOP_MONITORING':
      console.log('SW: Stopping monitoring');
      break;
    case 'PING':
      // Respond to ping to check if SW is alive
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ type: 'PONG', timestamp: Date.now() });
      }
      break;
    default:
      console.log('SW: Unknown message type:', type);
  }
});

// Handle battery updates from main thread
function handleBatteryUpdate(batteryData) {
  const { level, charging } = batteryData;
  lastBatteryLevel = level;
  isCharging = charging;

  console.log(
    `SW: Battery update - ${level}% ${charging ? 'charging' : 'discharging'}`
  );

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
      console.log(`SW: Sent ${type} battery notification`);

      // Notify main thread about the notification
      notifyMainThread('NOTIFICATION_SENT', {
        type,
        level,
        timestamp: lastNotificationTime,
        title,
        body,
      });
    })
    .catch(err => console.error('SW: Notification failed', err));
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
  console.log('SW: Notification clicked:', event.notification.tag);

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
    console.log('SW: Background sync - battery check');
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

      console.log(
        `SW: Periodic check - ${level}% ${charging ? 'charging' : 'discharging'}`
      );

      // Update our stored values
      handleBatteryUpdate({ level, charging });

      // Notify main thread of the update
      notifyMainThread('SW_BATTERY_UPDATE', { level, charging });
    } else {
      console.log('SW: Battery API not available in service worker context');
    }
  } catch (error) {
    console.error('SW: Periodic battery check failed', error);
  }
}

// Service Worker test functionality
function scheduleServiceWorkerTest(delaySeconds) {
  console.log(`SW: Test scheduled for ${delaySeconds} seconds`);

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

    console.log(
      `SW: Test notification triggered after ${delaySeconds}s (accuracy: ${accuracy}ms)`
    );

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
        console.log('SW: Test notification sent successfully');
        // Notify main thread that test completed
        notifyMainThread('SW_TEST_COMPLETED', {
          scheduledAt: startTime,
          triggeredAt: actualTime,
          accuracy,
          success: true,
        });
      })
      .catch(err => {
        console.error('SW: Test notification failed', err);
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

// Set up periodic monitoring interval
let monitoringInterval = null;

// Start monitoring when first client connects
self.addEventListener('message', event => {
  if (event.data.type === 'START_MONITORING' && !monitoringInterval) {
    console.log('SW: Starting periodic battery monitoring');

    // Check every 30 seconds when in background
    monitoringInterval = setInterval(() => {
      // Register background sync if supported
      if (self.registration.sync) {
        self.registration.sync
          .register('battery-check')
          .catch(err =>
            console.log('SW: Background sync registration failed', err)
          );
      }

      // Also do direct check
      periodicBatteryCheck();
    }, 30000);
  } else if (event.data.type === 'STOP_MONITORING' && monitoringInterval) {
    console.log('SW: Stopping periodic battery monitoring');
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
});
