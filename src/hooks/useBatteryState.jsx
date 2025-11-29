import { useState, useEffect, useRef, useCallback } from 'react';

const useBatteryState = batteryNotificationsEnabled => {
  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  });
  const notificationShownRef = useRef(false);

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
        new Notification('Battery Alert! 🔋', {
          body: `Battery is ${level}% and charging. Consider unplugging to preserve battery health.`,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Battery Alert! 🔋', {
              body: `Battery is ${level}% and charging. Consider unplugging to preserve battery health.`,
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

            // Check for high battery notification
            if (
              currentLevel > 90 &&
              isCharging &&
              !notificationShownRef.current &&
              batteryNotificationsEnabled
            ) {
              showBatteryNotification(currentLevel);
              notificationShownRef.current = true;
            } else if (currentLevel <= 90 || !isCharging) {
              // Reset notification flag when battery drops below 90% or stops charging
              notificationShownRef.current = false;
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
  }, [batteryNotificationsEnabled, formatTime, showBatteryNotification]);

  return batteryInfo;
};

export default useBatteryState;
