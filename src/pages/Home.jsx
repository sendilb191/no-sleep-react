import React from 'react';
import { useBattery } from '../hooks/useBattery';
import { useNotifications } from '../hooks/useNotifications';
import { DEFAULT_SETTINGS } from '../constants/defaultSettings';
import BatterySection from '../components/BatterySection';
import WakeLockSection from '../components/WakeLockSection';
import SettingsCard from '../components/SettingsCard';

const Home = ({
  isWakeLockActive,
  toggleWakeLock,
  notificationFrequency,
  setNotificationFrequency,
  autoReleaseEnabled,
  setAutoReleaseEnabled,
  soundEnabled,
  setSoundEnabled,
  notificationDisplayEnabled,
  setNotificationDisplayEnabled,
}) => {
  // Handlers for sound and notification controls
  const handleSoundToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) {
      enableSounds();
    } else {
      disableSounds();
    }
  };

  const handleNotificationToggle = () => {
    const newState = !notificationDisplayEnabled;
    setNotificationDisplayEnabled(newState);
    if (newState) {
      enableNotifications();
    } else {
      disableNotifications();
    }
  };

  const {
    notificationPermission,
    notificationsEnabled,
    requestPermission,
    enableNotifications,
    disableNotifications,
    enableSounds,
    disableSounds,
    showHighBatteryWarning,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    sendBatteryUpdateToSW,
    testServiceWorker,
    serviceWorkerStatus,
    isSupported: notificationsSupported,
  } = useNotifications(
    notificationFrequency,
    soundEnabled,
    notificationDisplayEnabled
  );

  const batteryInfo = useBattery(
    async batteryLevel => {
      // Send battery data to Service Worker for background notifications
      // Service Worker is the single source of truth for notifications

      // Auto-release wake lock for critical battery protection
      if (
        autoReleaseEnabled &&
        batteryLevel < DEFAULT_SETTINGS.CRITICAL_BATTERY_THRESHOLD &&
        isWakeLockActive
      ) {
        await toggleWakeLock(); // Release wake lock to preserve battery
        // Note: Service Worker handles the notification for this event
      }
    },
    async batteryLevel => {
      // Check current permission directly from browser API as fallback
      const currentPermission =
        'Notification' in window ? Notification.permission : 'denied';

      if (
        notificationPermission === 'granted' ||
        currentPermission === 'granted'
      ) {
        await showHighBatteryWarning(batteryLevel);
      }
    },
    sendBatteryUpdateToSW // Pass service worker communication function
  );

  return (
    <div className='dashboard-layout'>
      <div className='status-monitoring-panel'>
        {/* Battery Section */}
        <BatterySection
          batteryInfo={batteryInfo}
          isWakeLockActive={isWakeLockActive}
        />

        {/* Wake Lock Section */}
        <WakeLockSection
          isWakeLockActive={isWakeLockActive}
          batteryInfo={batteryInfo}
        />
      </div>

      <div className='controls-panel'>
        <SettingsCard
          isWakeLockActive={isWakeLockActive}
          toggleWakeLock={toggleWakeLock}
          notificationPermission={notificationPermission}
          notificationsEnabled={notificationsEnabled}
          soundEnabled={soundEnabled}
          handleSoundToggle={handleSoundToggle}
          handleNotificationToggle={handleNotificationToggle}
          requestPermission={requestPermission}
          notificationsSupported={notificationsSupported}
          showTestNotification={showTestNotification}
          testServiceWorker={testServiceWorker}
          notificationFrequency={notificationFrequency}
          setNotificationFrequency={setNotificationFrequency}
          lastNotificationTimestamp={lastNotificationTimestamp}
          lastNotificationType={lastNotificationType}
          formatTimestamp={formatTimestamp}
          serviceWorkerStatus={serviceWorkerStatus}
          autoReleaseEnabled={autoReleaseEnabled}
          setAutoReleaseEnabled={setAutoReleaseEnabled}
        />
      </div>
    </div>
  );
};

export default Home;
