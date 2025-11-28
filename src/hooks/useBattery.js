import { useState, useEffect, useCallback } from 'react';
import {
  checkBatterySupport,
  getBatteryAPI,
  shouldShowNotification,
  createNotification,
  requestNotificationPermission as requestPermissionUtil,
  getBatteryIcon as getBatteryIconUtil,
  getBatteryStatus as getBatteryStatusUtil,
  formatTime as formatTimeUtil,
} from '../utils/batteryService.js';

export const useBattery = settings => {
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

  const showNotification = useCallback(
    (message, type = 'info') => {
      if (!settings?.batteryNotifications) return;

      setNotification({ message, type, timestamp: Date.now() });

      const browserNotification = createNotification(message, type);
      if (browserNotification) {
        setTimeout(() => browserNotification.close(), 10000);
      }

      setTimeout(() => setNotification(null), 5000);
    },
    [settings?.batteryNotifications]
  );

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

      if (
        charging &&
        level > 95 &&
        shouldShowNotification(
          settings?.batteryNotifications,
          settings?.notificationFrequency,
          lastNotificationTime,
          notifiedForCurrentSession
        )
      ) {
        const now = Date.now();
        setLastNotificationTime(now);
        setNotifiedForCurrentSession(true);
        showNotification(
          `Battery is ${level}% and charging. Consider unplugging to preserve battery health.`,
          'warning'
        );
      }

      if (!charging || level <= 95) {
        setNotifiedForCurrentSession(false);
      }
    },
    [
      settings?.batteryNotifications,
      settings?.notificationFrequency,
      lastNotificationTime,
      notifiedForCurrentSession,
      showNotification,
    ]
  );

  const requestNotificationPermission = useCallback(async () => {
    const permission = await requestPermissionUtil();
    setNotificationPermission(permission);
    return permission;
  }, []);

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

    if (settings?.batteryNotifications) {
      requestNotificationPermission();
    }

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    const initBattery = async () => {
      try {
        const battery = await getBatteryAPI();
        if (battery) {
          updateBatteryInfo(battery);

          const handleChange = () => updateBatteryInfo(battery);
          battery.addEventListener('levelchange', handleChange);
          battery.addEventListener('chargingchange', handleChange);
          battery.addEventListener('chargingtimechange', handleChange);
          battery.addEventListener('dischargingtimechange', handleChange);

          return () => {
            battery.removeEventListener('levelchange', handleChange);
            battery.removeEventListener('chargingchange', handleChange);
            battery.removeEventListener('chargingtimechange', handleChange);
            battery.removeEventListener('dischargingtimechange', handleChange);
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
    updateBatteryInfo,
    settings?.batteryNotifications,
    requestNotificationPermission,
  ]);

  return {
    batteryInfo,
    notification,
    notificationPermission,
    dismissNotification: () => setNotification(null),
    getBatteryIcon: () =>
      getBatteryIconUtil(batteryInfo.level, batteryInfo.charging),
    getBatteryStatus: () =>
      getBatteryStatusUtil(
        batteryInfo.level,
        batteryInfo.supported,
        batteryInfo.error
      ),
    formatTime: formatTimeUtil,
    requestNotificationPermission,
    showNotification,
  };
};
