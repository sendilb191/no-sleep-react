import { useState, useEffect, useRef, useCallback } from 'react';
import swManager from '../utils/serviceWorkerManager.js';

const useBatteryState = (
  batteryNotificationsEnabled,
  notificationFrequency = 5
) => {
  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  });

  // Helper function to format time in seconds to readable format
  const formatTime = useCallback(seconds => {
    if (seconds === Infinity || seconds === 0 || isNaN(seconds)) {
      return 'Unknown';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes} minutes`;
    } else {
      return `${Math.floor(seconds)} seconds`;
    }
  }, []);

  // All notifications are now handled by service worker

  // Settings are now managed entirely by service worker

  // Battery initialization effect
  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await navigator.getBattery();

          const updateBatteryInfo = () => {
            const currentLevel = Math.round(battery.level * 100);
            const isCharging = battery.charging;

            // Only update battery info, no notifications here
            // Notifications will be handled by the separate interval effect

            const newBatteryInfo = {
              level: currentLevel,
              charging: isCharging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
              chargingTimeFormatted: formatTime(battery.chargingTime),
              dischargingTimeFormatted: formatTime(battery.dischargingTime),
              supported: true,
            };

            setBatteryInfo(newBatteryInfo);

            // Note: Service worker battery updates disabled to prevent duplicate notifications
            // All notifications are now handled by the main app with proper frequency control
          };

          // Initial update
          updateBatteryInfo();

          // Add event listeners for battery changes
          battery.addEventListener('chargingchange', updateBatteryInfo);
          battery.addEventListener('levelchange', updateBatteryInfo);
          battery.addEventListener('chargingtimechange', updateBatteryInfo);
          battery.addEventListener('dischargingtimechange', updateBatteryInfo);

          // Cleanup function
          return () => {
            battery.removeEventListener('chargingchange', updateBatteryInfo);
            battery.removeEventListener('levelchange', updateBatteryInfo);
            battery.removeEventListener(
              'chargingtimechange',
              updateBatteryInfo
            );
            battery.removeEventListener(
              'dischargingtimechange',
              updateBatteryInfo
            );
          };
        } else {
          setBatteryInfo(prev => ({ ...prev, supported: false }));
        }
      } catch (error) {
        console.error('Error accessing battery information:', error);
        setBatteryInfo(prev => ({ ...prev, supported: false }));
      }
    };

    getBatteryInfo();
  }, [formatTime, showBatteryNotification]); // Removed batteryNotificationsEnabled and notificationFrequency to prevent re-initialization

  // Set up service worker notifications when settings change
  useEffect(() => {
    if (batteryNotificationsEnabled && batteryInfo.level !== null) {
      // Schedule notifications through service worker
      swManager.scheduleNotification({
        frequency: notificationFrequency,
        batteryLevel: batteryInfo.level,
        isCharging: batteryInfo.charging,
        enabled: true,
      });
    } else {
      // Cancel notifications when disabled
      swManager.cancelNotifications();
    }
  }, [
    batteryNotificationsEnabled,
    notificationFrequency,
    batteryInfo.level,
    batteryInfo.charging,
  ]);

  // Listen for service worker battery status requests
  useEffect(() => {
    const handleBatteryStatusRequest = () => {
      if (batteryInfo.level !== null) {
        swManager.sendBatteryStatus({
          level: batteryInfo.level,
          charging: batteryInfo.charging,
        });
      }
    };

    window.addEventListener(
      'sw-request-battery-status',
      handleBatteryStatusRequest
    );
    return () => {
      window.removeEventListener(
        'sw-request-battery-status',
        handleBatteryStatusRequest
      );
    };
  }, [batteryInfo.level, batteryInfo.charging]);

  // Cleanup on unmount - notify service worker to stop notifications
  useEffect(() => {
    return () => {
      swManager.updateNotificationSettings({ enabled: false, frequency: 5 });
    };
  }, []);

  // Test notification function - delegate to service worker
  const testNotification = useCallback(() => {
    swManager.testNotification({
      level: batteryInfo.level || 85,
      charging: batteryInfo.charging !== null ? batteryInfo.charging : true,
    });
  }, [batteryInfo.level, batteryInfo.charging]);

  return {
    ...batteryInfo,
    testNotification,
  };
};

export default useBatteryState;
