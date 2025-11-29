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
  const showBatteryNotification = useCallback((level, isCharging = true) => {
    if ('Notification' in window) {
      const chargingStatus = isCharging ? 'charging' : 'not charging';
      const message = `Battery level: ${level}% - Device is ${chargingStatus} and staying awake.`;

      if (Notification.permission === 'granted') {
        new Notification('No Sleep - Battery Status 🔋', {
          body: message,
          icon: '/no-sleep.svg',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('No Sleep - Battery Status 🔋', {
              body: message,
              icon: '/no-sleep.svg',
            });
          }
        });
      }
    }
  }, []);

  // Clear existing interval when frequency changes
  useEffect(() => {
    if (notificationIntervalRef.current) {
      clearInterval(notificationIntervalRef.current);
      notificationIntervalRef.current = null;
    }
  }, [notificationFrequency]);

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

            // Update service worker with battery status
            swManager.updateBatteryStatus({
              level: currentLevel,
              charging: isCharging,
              notificationsEnabled: batteryNotificationsEnabled,
              frequency: notificationFrequency,
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
  }, [formatTime, showBatteryNotification]); // Removed batteryNotificationsEnabled and notificationFrequency to prevent re-initialization

  // Manage notification interval based on settings only
  useEffect(() => {
    // Clear existing interval
    if (notificationIntervalRef.current) {
      clearInterval(notificationIntervalRef.current);
      notificationIntervalRef.current = null;
    }

    // Set up new interval if notifications are enabled
    if (batteryNotificationsEnabled) {
      const frequencyMs = notificationFrequency * 60 * 1000;
      notificationIntervalRef.current = setInterval(() => {
        // Check current battery conditions at interval time
        if (
          batteryInfo.level > 90 &&
          batteryInfo.charging &&
          batteryNotificationsEnabled
        ) {
          const now = Date.now();
          const timeSinceLastNotification = now - lastNotificationRef.current;

          // Only send notification if enough time has passed
          if (timeSinceLastNotification >= frequencyMs) {
            showBatteryNotification(batteryInfo.level, batteryInfo.charging);
            lastNotificationRef.current = now;
          }
        }
      }, frequencyMs);
    }

    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    };
  }, [
    batteryNotificationsEnabled,
    notificationFrequency,
    showBatteryNotification,
  ]); // Removed batteryInfo dependencies

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
    showBatteryNotification(
      batteryInfo.level || 90,
      batteryInfo.charging || false
    );
  }, [showBatteryNotification, batteryInfo.level, batteryInfo.charging]);

  return {
    ...batteryInfo,
    testNotification,
  };
};

export default useBatteryState;
