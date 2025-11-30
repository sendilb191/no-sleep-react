import { useState, useEffect, useRef, useCallback } from 'react';
import swManager from '../utils/serviceWorkerManager.js';
import { SW_NOTIFICATION_DEFAULTS } from '../constants/appConstants';

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
  const formatTime = useCallback((seconds, batteryLevel, isCharging) => {
    // If we have valid time data from the API, use it
    if (seconds !== Infinity && seconds > 0 && !isNaN(seconds)) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes} minutes`;
      } else {
        return `${Math.floor(seconds)} seconds`;
      }
    }

    // If charging, don't estimate discharge time
    if (isCharging) {
      return 'Charging';
    }

    // Provide rough estimate based on battery level if API data is unavailable
    if (batteryLevel !== null && batteryLevel > 0) {
      // Rough estimate: assume 8-12 hours of typical usage for 100% battery
      // This gives us approximately 7-10 minutes per percent
      const estimatedMinutes = batteryLevel * 8; // Conservative estimate of 8 minutes per percent
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;

      if (hours > 0) {
        return `~${hours}h ${minutes}m (estimated)`;
      } else if (minutes > 0) {
        return `~${minutes} minutes (estimated)`;
      } else {
        return 'Low battery';
      }
    }

    return 'Unknown';
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
              chargingTimeFormatted: formatTime(
                battery.chargingTime,
                currentLevel,
                isCharging
              ),
              dischargingTimeFormatted: formatTime(
                battery.dischargingTime,
                currentLevel,
                isCharging
              ),
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
  }, [formatTime]); // Battery initialization effect

  // Initialize service worker settings on first load, then update when they change
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Ensure service worker is ready before sending settings
    const sendSettings = () => {
      if (swManager.isReady()) {
        if (!hasInitialized.current) {
          // First time - initialize with complete settings and current battery data if available
          swManager.initializeSettings(
            {
              enabled: batteryNotificationsEnabled,
              frequency: notificationFrequency,
              conditions: SW_NOTIFICATION_DEFAULTS.conditions,
            },
            batteryInfo.level !== null
              ? {
                  level: batteryInfo.level,
                  charging: batteryInfo.charging,
                }
              : null
          );
          hasInitialized.current = true;
        } else {
          // Subsequent updates
          swManager.updateNotificationSettings({
            enabled: batteryNotificationsEnabled,
            frequency: notificationFrequency,
          });
        }
      } else {
        // Retry after a short delay if service worker isn't ready
        setTimeout(sendSettings, 100);
      }
    };

    sendSettings();
  }, [
    batteryNotificationsEnabled,
    notificationFrequency,
    batteryInfo.level,
    batteryInfo.charging,
  ]);

  // Send battery status updates to service worker
  useEffect(() => {
    if (batteryInfo.level !== null && swManager.isReady()) {
      swManager.sendBatteryStatus({
        level: batteryInfo.level,
        charging: batteryInfo.charging,
      });
    }
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
