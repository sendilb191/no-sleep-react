import { useState, useEffect, useRef } from 'react';

export const useNotifications = (frequencyMinutes = 5) => {
  const [notificationPermission, setNotificationPermission] =
    useState('default');
  const [lastNotificationTimestamp, setLastNotificationTimestamp] =
    useState(null);
  const [lastNotificationType, setLastNotificationType] = useState(null);
  const lastNotificationTime = useRef(0);

  // Calculate cooldown dynamically based on current frequency setting
  const getNotificationCooldown = () => frequencyMinutes * 60 * 1000;

  // Format timestamp for display
  const formatTimestamp = timestamp => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString();
  };

  // Check and request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);

      // Also listen for permission changes
      const checkPermission = () => {
        const currentPermission = Notification.permission;
        setNotificationPermission(currentPermission);
        console.log('Notification permission updated:', currentPermission);
      };

      // Check permission periodically in case it changes
      const permissionInterval = setInterval(checkPermission, 1000);

      return () => clearInterval(permissionInterval);
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
    // Check if notifications are supported and permitted (check both hook state and browser state)
    const browserPermission =
      'Notification' in window ? Notification.permission : 'denied';
    const isPermitted =
      notificationPermission === 'granted' || browserPermission === 'granted';

    if ('Notification' in window && isPermitted) {
      // Check cooldown to prevent spam (skip for test notifications)
      const now = Date.now();
      const cooldownPeriod = getNotificationCooldown();
      if (
        !options.skipCooldown &&
        now - lastNotificationTime.current < cooldownPeriod
      ) {
        console.log('Notification blocked by cooldown:', {
          title,
          timeSinceLastNotification: now - lastNotificationTime.current,
          cooldownPeriod,
          frequencyMinutes,
        });
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

        // Return success indicator and notification
        return { success: true, notification };
      } catch (error) {
        console.warn('Error showing notification:', error);
      }
    } else {
      const browserPermission =
        'Notification' in window ? Notification.permission : 'denied';
      console.log('Cannot show notification:', {
        title,
        notificationSupported: 'Notification' in window,
        hookPermission: notificationPermission,
        browserPermission: browserPermission,
        reason: !('Notification' in window)
          ? 'Not supported'
          : `Hook: ${notificationPermission}, Browser: ${browserPermission}`,
      });
    }
  };

  const showBatteryWarning = batteryLevel => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🔋 Low Battery Warning';
    const body = `Battery level is ${batteryLevel}% and not charging. Consider connecting your charger.\n\nTriggered at: ${timestamp}`;

    const result = showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'battery-low',
      requireInteraction: false,
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('battery');
      console.log('Low battery notification sent successfully');
    } else {
      console.log('Low battery notification failed:', result);
    }
  };

  const showHighBatteryWarning = batteryLevel => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🔋 Battery Fully Charged';
    const body = `Battery level is ${batteryLevel}% and still charging. Consider unplugging to preserve battery health.\n\nTriggered at: ${timestamp}`;

    console.log('Attempting to show high battery notification:', {
      batteryLevel,
      permission: notificationPermission,
      timestamp,
    });

    const result = showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'battery-high',
      requireInteraction: false,
      skipCooldown: true, // High battery notifications should override cooldown
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('battery-full');
      console.log('High battery notification sent successfully');
    } else {
      console.log('High battery notification failed:', result);
    }
  };

  const showAutoReleaseNotification = batteryLevel => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🔒 Wake Lock Auto-Released';
    const body = `Wake lock automatically released due to critical battery level (${batteryLevel}%) to preserve battery life.\n\nTriggered at: ${timestamp}`;

    const result = showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'auto-release',
      requireInteraction: false,
      skipCooldown: true, // Always show this important notification
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('auto-release');
      console.log('Auto-release notification sent successfully');
    } else {
      console.log('Auto-release notification failed:', result);
    }
  };

  const showTestNotification = () => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🧪 Test Notification';
    const body = `This is a test notification to verify that notifications are working properly!\n\nTriggered at: ${timestamp}`;

    const result = showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: `test-notification-${now}`, // Unique tag each time
      requireInteraction: false,
      skipCooldown: true,
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('test');
      console.log('Test notification sent successfully');
    } else {
      console.log('Test notification failed:', result);
    }
  };

  return {
    notificationPermission,
    requestPermission,
    showNotification,
    showBatteryWarning,
    showHighBatteryWarning,
    showAutoReleaseNotification,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    isSupported: 'Notification' in window,
  };
};
