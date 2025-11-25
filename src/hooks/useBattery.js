import { useState, useEffect, useCallback } from 'react';

export const useBattery = () => {
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

  // Check if Battery API is supported
  const checkBatterySupport = useCallback(() => {
    return 'getBattery' in navigator || 'battery' in navigator;
  }, []);

  // Check if notifications are enabled
  const areNotificationsEnabled = useCallback(() => {
    return localStorage.getItem('nosleep-battery-notifications') !== 'false';
  }, []);

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
    [areNotificationsEnabled]
  ); // Update battery information
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

      // Check for notification conditions (only if notifications are enabled)
      if (charging && level > 95 && areNotificationsEnabled()) {
        showNotification(
          `Battery is ${level}% and charging. Consider unplugging to preserve battery health.`,
          'warning'
        );
      }
    },
    [showNotification]
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
    if (areNotificationsEnabled()) {
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
  }, [checkBatterySupport, updateBatteryInfo]);

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

    return `${level}% ${charging ? '(Charging)' : '(Not charging)'}`;
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
  };
};
