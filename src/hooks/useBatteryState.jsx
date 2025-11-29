import { useState, useEffect, useRef, useCallback } from 'react';

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
  const lastNotificationRef = useRef(0);
  const notificationIntervalRef = useRef(null);

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

  // Function to show notification
  const showBatteryNotification = useCallback(level => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('No Sleep - Battery Status 🔋', {
          body: `Battery level: ${level}% - Device is charging and staying awake.`,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('No Sleep - Battery Status 🔋', {
              body: `Battery level: ${level}% - Device is charging and staying awake.`,
              icon: '/favicon.ico',
            });
          }
        });
      }
    }
  }, []);

  // Battery initialization effect
  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery = await navigator.getBattery();

          const updateBatteryInfo = () => {
            const currentLevel = Math.round(battery.level * 100);
            const isCharging = battery.charging;
            const now = Date.now();

            // Check for high battery notification with frequency control
            if (
              currentLevel > 90 &&
              isCharging &&
              batteryNotificationsEnabled
            ) {
              // Check if enough time has passed since last notification
              const timeSinceLastNotification =
                now - lastNotificationRef.current;
              const frequencyMs = notificationFrequency * 60 * 1000; // Convert minutes to milliseconds

              if (timeSinceLastNotification >= frequencyMs) {
                showBatteryNotification(currentLevel);
                lastNotificationRef.current = now;
              }

              // Set up recurring notifications
              if (!notificationIntervalRef.current) {
                notificationIntervalRef.current = setInterval(() => {
                  if (
                    currentLevel > 90 &&
                    isCharging &&
                    batteryNotificationsEnabled
                  ) {
                    showBatteryNotification(currentLevel);
                  }
                }, frequencyMs);
              }
            } else {
              // Clear interval when conditions are not met
              if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current);
                notificationIntervalRef.current = null;
              }
            }

            setBatteryInfo({
              level: currentLevel,
              charging: isCharging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
              chargingTimeFormatted: formatTime(battery.chargingTime),
              dischargingTimeFormatted: formatTime(battery.dischargingTime),
              supported: true,
            });
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
  }, [
    batteryNotificationsEnabled,
    notificationFrequency,
    formatTime,
    showBatteryNotification,
  ]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    };
  }, []);

  // Test notification function
  const testNotification = useCallback(() => {
    showBatteryNotification(batteryInfo.level || 90);
  }, [showBatteryNotification, batteryInfo.level]);

  return {
    ...batteryInfo,
    testNotification,
  };
};

export default useBatteryState;
