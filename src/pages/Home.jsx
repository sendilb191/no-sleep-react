import React, { useState } from 'react';
import { useWakeLock } from '../hooks/useWakeLock';
import { useBattery } from '../hooks/useBattery';
import { useNotifications } from '../hooks/useNotifications';
import { DEFAULT_SETTINGS } from '../constants/defaultSettings';
import BatterySection from '../components/BatterySection';
import WakeLockSection from '../components/WakeLockSection';
import SettingsCard from '../components/SettingsCard';

const Home = () => {
  const { isWakeLockActive, toggleWakeLock } = useWakeLock();

  const [notificationFrequency, setNotificationFrequency] = useState(
    DEFAULT_SETTINGS.NOTIFICATION_FREQUENCY
  );
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(
    DEFAULT_SETTINGS.AUTO_RELEASE_ENABLED
  );
  const [soundEnabled, setSoundEnabled] = useState(
    DEFAULT_SETTINGS.SOUND_ENABLED
  );
  const [notificationDisplayEnabled, setNotificationDisplayEnabled] = useState(
    DEFAULT_SETTINGS.NOTIFICATION_DISPLAY_ENABLED
  );

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
    soundEnabled: hookSoundEnabled,
    requestPermission,
    enableNotifications,
    disableNotifications,
    enableSounds,
    disableSounds,
    showBatteryWarning,
    showHighBatteryWarning,
    showAutoReleaseNotification,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    sendBatteryUpdateToSW,
    testServiceWorker,
    isSupported: notificationsSupported,
  } = useNotifications(
    notificationFrequency,
    soundEnabled,
    notificationDisplayEnabled
  );

  const batteryInfo = useBattery(
    async batteryLevel => {
      await showBatteryWarning(batteryLevel);
      // Auto-release wake lock for critical battery protection
      if (
        autoReleaseEnabled &&
        batteryLevel < DEFAULT_SETTINGS.CRITICAL_BATTERY_THRESHOLD &&
        isWakeLockActive
      ) {
        await toggleWakeLock(); // Release wake lock to preserve battery
        if (notificationPermission === 'granted') {
          await showAutoReleaseNotification(batteryLevel);
        }
      }
    },
    async batteryLevel => {
      // Check current permission directly from browser API as fallback
      const currentPermission =
        'Notification' in window ? Notification.permission : 'denied';
      console.log('High battery notification check:', {
        batteryLevel,
        hookPermission: notificationPermission,
        browserPermission: currentPermission,
      });

      if (
        notificationPermission === 'granted' ||
        currentPermission === 'granted'
      ) {
        await showHighBatteryWarning(batteryLevel);
      } else {
        console.log(
          'High battery detected but notifications not permitted:',
          batteryLevel,
          'Hook permission:',
          notificationPermission,
          'Browser permission:',
          currentPermission
        );
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
          batteryInfo={batteryInfo}
          notificationPermission={notificationPermission}
          notificationsEnabled={notificationsEnabled}
          soundEnabled={soundEnabled}
          handleSoundToggle={handleSoundToggle}
          handleNotificationToggle={handleNotificationToggle}
          requestPermission={requestPermission}
          enableNotifications={enableNotifications}
          disableNotifications={disableNotifications}
          notificationsSupported={notificationsSupported}
          showTestNotification={showTestNotification}
          testServiceWorker={testServiceWorker}
          notificationFrequency={notificationFrequency}
          setNotificationFrequency={setNotificationFrequency}
          lastNotificationTimestamp={lastNotificationTimestamp}
          lastNotificationType={lastNotificationType}
          formatTimestamp={formatTimestamp}
          autoReleaseEnabled={autoReleaseEnabled}
          setAutoReleaseEnabled={setAutoReleaseEnabled}
        />
      </div>
    </div>
  );
};

export default Home;
