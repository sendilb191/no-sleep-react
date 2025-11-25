import { useState, useEffect, useCallback, useMemo } from 'react';

export const useBattery = (settings = null) => {
  // Memoize settings-dependent values to prevent infinite re-renders
  const batteryNotificationsEnabled = useMemo(() => {
    if (settings && settings.batteryNotifications !== undefined) {
      return settings.batteryNotifications;
    }
    // Fallback to localStorage for backward compatibility
    return localStorage.getItem('nosleep-battery-notifications') !== 'false';
  }, [settings?.batteryNotifications]);

  const notificationFrequency = useMemo(() => {
    if (settings && settings.notificationFrequency !== undefined) {
      return settings.notificationFrequency;
    }
    // Fallback to localStorage for backward compatibility
    return localStorage.getItem('nosleep-notification-frequency') || '5min';
  }, [settings?.notificationFrequency]);

  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
    error: null,
  });

  const [notification, setNotification] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const [notifiedForCurrentSession, setNotifiedForCurrentSession] =
    useState(false);

  // Check if Battery API is supported
  const checkBatterySupport = useCallback(() => {
    return 'getBattery' in navigator || 'battery' in navigator;
  }, []);

  // Check if notifications are enabled
  const areNotificationsEnabled = useCallback(() => {
    return batteryNotificationsEnabled;
  }, [batteryNotificationsEnabled]);

  // Get notification frequency setting
  const getNotificationFrequency = useCallback(() => {
    return notificationFrequency;
  }, [notificationFrequency]);

  // Check if enough time has passed for next notification
  const shouldShowNotification = useCallback(() => {
    if (!batteryNotificationsEnabled) return false;

    const frequency = notificationFrequency;
    const now = Date.now();

    // For 'once' frequency, only show if we haven't notified in this session
    if (frequency === 'once') {
      return !notifiedForCurrentSession;
    }

    // For other frequencies, check time-based cooldown
    if (!lastNotificationTime) return true;

    const intervals = {
      '1min': 60 * 1000,
      '5min': 5 * 60 * 1000,
      '30min': 30 * 60 * 1000,
    };

    const interval = intervals[frequency] || intervals['5min'];
    return now - lastNotificationTime >= interval;
  }, [
    batteryNotificationsEnabled,
    notificationFrequency,
    lastNotificationTime,
    notifiedForCurrentSession,
  ]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        return permission;
      }
      setNotificationPermission(Notification.permission);
      return Notification.permission;
    }
    return 'unsupported';
  }, []);

  // Show notification (both in-app and browser)
  const showNotification = useCallback(
    (message, type = 'info') => {
      if (!areNotificationsEnabled()) return;

      // Show in-app notification
      setNotification({ message, type, timestamp: Date.now() });

      // Show browser push notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Battery Health Alert', {
          body: message,
          tag: 'battery-alert',
          requireInteraction: true, // Keep notification visible until user interacts
          silent: false,
        });

        // Auto-close browser notification after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      // Auto-hide in-app notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    },
    [batteryNotificationsEnabled]
  );

  // Update battery information
  const updateBatteryInfo = useCallback(
    battery => {
      const level = Math.round(battery.level * 100);
      const charging = battery.charging;

      setBatteryInfo({
        level,
        charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        supported: true,
        error: null,
      });

      // Check for notification conditions with frequency control
      if (charging && level > 95 && shouldShowNotification()) {
        const now = Date.now();
        setLastNotificationTime(now);
        setNotifiedForCurrentSession(true);

        showNotification(
          `Battery is ${level}% and charging. Consider unplugging to preserve battery health.`,
          'warning'
        );
      }

      // Reset session flag when not charging or below 95%
      if (!charging || level <= 95) {
        setNotifiedForCurrentSession(false);
      }
    },
    [shouldShowNotification, showNotification]
  );

  // Initialize battery monitoring
  useEffect(() => {
    if (!checkBatterySupport()) {
      setBatteryInfo(prev => ({
        ...prev,
        supported: false,
        error: 'Battery API not supported in this browser',
      }));
      return;
    }

    // Request notification permission if notifications are enabled
    if (batteryNotificationsEnabled) {
      requestNotificationPermission();
    }

    // Update permission state on mount
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    const initBattery = async () => {
      try {
        let battery;

        if ('getBattery' in navigator) {
          battery = await navigator.getBattery();
        } else if ('battery' in navigator) {
          battery = navigator.battery;
        }

        if (battery) {
          // Initial battery info
          updateBatteryInfo(battery);

          // Set up event listeners
          const handleLevelChange = () => updateBatteryInfo(battery);
          const handleChargingChange = () => updateBatteryInfo(battery);
          const handleChargingTimeChange = () => updateBatteryInfo(battery);
          const handleDischargingTimeChange = () => updateBatteryInfo(battery);

          battery.addEventListener('levelchange', handleLevelChange);
          battery.addEventListener('chargingchange', handleChargingChange);
          battery.addEventListener(
            'chargingtimechange',
            handleChargingTimeChange
          );
          battery.addEventListener(
            'dischargingtimechange',
            handleDischargingTimeChange
          );

          // Cleanup function
          return () => {
            battery.removeEventListener('levelchange', handleLevelChange);
            battery.removeEventListener('chargingchange', handleChargingChange);
            battery.removeEventListener(
              'chargingtimechange',
              handleChargingTimeChange
            );
            battery.removeEventListener(
              'dischargingtimechange',
              handleDischargingTimeChange
            );
          };
        }
      } catch (error) {
        console.error('Failed to get battery information:', error);
        setBatteryInfo(prev => ({
          ...prev,
          supported: false,
          error: 'Failed to access battery information',
        }));
      }
    };

    let cleanup;
    initBattery().then(cleanupFn => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [
    checkBatterySupport,
    updateBatteryInfo,
    batteryNotificationsEnabled,
    requestNotificationPermission,
  ]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const getBatteryIcon = useCallback(() => {
    const { level, charging } = batteryInfo;

    if (level === null) return '🔋';

    if (charging) {
      return '🔌';
    }

    if (level > 75) return '🔋';
    if (level > 50) return '🔋';
    if (level > 25) return '🪫';
    return '🪫';
  }, [batteryInfo]);

  const getBatteryStatus = useCallback(() => {
    const { level, charging, supported, error } = batteryInfo;

    if (!supported || error) {
      return 'Battery info unavailable';
    }

    if (level === null) {
      return 'Loading battery info...';
    }

    return `${level}%`;
  }, [batteryInfo]);

  const formatTime = useCallback(seconds => {
    if (seconds === Infinity || isNaN(seconds)) return 'Unknown';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  return {
    batteryInfo,
    notification,
    notificationPermission,
    dismissNotification,
    getBatteryIcon,
    getBatteryStatus,
    formatTime,
    requestNotificationPermission,
    showNotification,
    getNotificationFrequency,
  };
};
