import { useState, useEffect, useRef } from 'react';

export const useNotifications = (frequencyMinutes = 5) => {
  const [notificationPermission, setNotificationPermission] =
    useState('default');
  const [lastNotificationTimestamp, setLastNotificationTimestamp] =
    useState(null);
  const [lastNotificationType, setLastNotificationType] = useState(null);
  const lastNotificationTime = useRef(0);
  const NOTIFICATION_COOLDOWN = frequencyMinutes * 60 * 1000; // Configurable cooldown

  // Format timestamp for display
  const formatTimestamp = timestamp => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString();
  };

  // Check and request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        return permission === 'granted';
      } catch (error) {
        console.warn('Error requesting notification permission:', error);
        return false;
      }
    }
    return false;
  };

  const showNotification = (title, options = {}) => {
    // Check if notifications are supported and permitted
    if ('Notification' in window && notificationPermission === 'granted') {
      // Check cooldown to prevent spam (skip for test notifications)
      const now = Date.now();
      if (
        !options.skipCooldown &&
        now - lastNotificationTime.current < NOTIFICATION_COOLDOWN
      ) {
        return;
      }

      // Remove any actions from options to prevent the error
      const { actions, ...safeOptions } = options;

      const defaultOptions = {
        icon: '/no-sleep.svg',
        badge: '/no-sleep.svg',
        tag: 'battery-warning',
        requireInteraction: true,
        ...safeOptions,
      };

      try {
        // Debug: Log the options to see what's being passed
        console.log('Notification options:', defaultOptions);
        const notification = new Notification(title, defaultOptions);
        // Only update cooldown for non-test notifications
        if (!options.skipCooldown) {
          lastNotificationTime.current = now;
        }

        // Auto close after 10 seconds if not interactive
        if (!defaultOptions.requireInteraction) {
          setTimeout(() => {
            notification.close();
          }, 10000);
        }

        return notification;
      } catch (error) {
        console.warn('Error showing notification:', error);
      }
    }
  };

  const showBatteryWarning = batteryLevel => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🔋 Low Battery Warning';
    const body = `Battery level is ${batteryLevel}% and not charging. Consider connecting your charger.\n\nTriggered at: ${timestamp}`;

    showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'battery-low',
      requireInteraction: false,
    });

    // Update timestamp tracking
    setLastNotificationTimestamp(now);
    setLastNotificationType('battery');
  };

  const showHighBatteryWarning = batteryLevel => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🔋 Battery Fully Charged';
    const body = `Battery level is ${batteryLevel}% and still charging. Consider unplugging to preserve battery health.\n\nTriggered at: ${timestamp}`;

    showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'battery-high',
      requireInteraction: false,
    });

    // Update timestamp tracking
    setLastNotificationTimestamp(now);
    setLastNotificationType('battery-full');
  };

  const showTestNotification = () => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🧪 Test Notification';
    const body = `This is a test notification to verify that notifications are working properly!\n\nTriggered at: ${timestamp}`;

    showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: `test-notification-${now}`, // Unique tag each time
      requireInteraction: false,
      skipCooldown: true,
    });

    // Update timestamp tracking for test notifications
    setLastNotificationTimestamp(now);
    setLastNotificationType('test');
  };

  return {
    notificationPermission,
    requestPermission,
    showNotification,
    showBatteryWarning,
    showHighBatteryWarning,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    isSupported: 'Notification' in window,
  };
};
