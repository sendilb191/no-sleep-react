import { useState, useEffect, useRef } from 'react';

export const useNotifications = () => {
  const [notificationPermission, setNotificationPermission] =
    useState('default');
  const lastNotificationTime = useRef(0);
  const NOTIFICATION_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown

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
      // Check cooldown to prevent spam
      const now = Date.now();
      if (now - lastNotificationTime.current < NOTIFICATION_COOLDOWN) {
        return;
      }

      const defaultOptions = {
        icon: '/no-sleep.svg',
        badge: '/no-sleep.svg',
        tag: 'battery-warning',
        requireInteraction: true,
        ...options,
      };

      try {
        const notification = new Notification(title, defaultOptions);
        lastNotificationTime.current = now;

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
    const title = '🔋 Low Battery Warning';
    const body = `Battery level is ${batteryLevel}% and not charging. Consider connecting your charger.`;

    showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'battery-low',
      requireInteraction: false,
      actions: [
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
    });
  };

  const showTestNotification = () => {
    const title = '🧪 Test Notification';
    const body =
      'This is a test notification to verify that notifications are working properly!';

    showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'test-notification',
      requireInteraction: false,
    });
  };

  return {
    notificationPermission,
    requestPermission,
    showNotification,
    showBatteryWarning,
    showTestNotification,
    isSupported: 'Notification' in window,
  };
};
