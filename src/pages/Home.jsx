import React, { useState } from 'react';
import { useWakeLock } from '../hooks/useWakeLock';
import { useBattery } from '../hooks/useBattery';
import { useNotifications } from '../hooks/useNotifications';
import BatterySection from '../components/BatterySection';
import WakeLockSection from '../components/WakeLockSection';
import SettingsCard from '../components/SettingsCard';
import ErrorMessage from '../components/ErrorMessage';
import HiddenVideo from '../components/HiddenVideo';

const Home = () => {
  const {
    isWakeLockActive,
    wakeLockSupported,
    fallbackActive,
    error,
    toggleWakeLock,
    videoRef,
  } = useWakeLock();

  const [notificationFrequency, setNotificationFrequency] = useState(1); // Default 1 minute
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(true); // Auto-release when battery < 20%

  const {
    notificationPermission,
    requestPermission,
    showBatteryWarning,
    showHighBatteryWarning,
    showAutoReleaseNotification,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    isSupported: notificationsSupported,
  } = useNotifications(notificationFrequency);

  const batteryInfo = useBattery(
    batteryLevel => {
      showBatteryWarning(batteryLevel);
      // Auto-release wake lock for critical battery protection
      if (autoReleaseEnabled && batteryLevel < 20 && isWakeLockActive) {
        toggleWakeLock(); // Release wake lock to preserve battery
        if (notificationPermission === 'granted') {
          showAutoReleaseNotification(batteryLevel);
        }
      }
    },
    batteryLevel => {
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
        showHighBatteryWarning(batteryLevel);
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
    }
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
          wakeLockSupported={wakeLockSupported}
          fallbackActive={fallbackActive}
        />
      </div>

      <div className='controls-panel'>
        <SettingsCard
          isWakeLockActive={isWakeLockActive}
          toggleWakeLock={toggleWakeLock}
          wakeLockSupported={wakeLockSupported}
          fallbackActive={fallbackActive}
          batteryInfo={batteryInfo}
          notificationPermission={notificationPermission}
          requestPermission={requestPermission}
          notificationsSupported={notificationsSupported}
          showTestNotification={showTestNotification}
          notificationFrequency={notificationFrequency}
          setNotificationFrequency={setNotificationFrequency}
          lastNotificationTimestamp={lastNotificationTimestamp}
          lastNotificationType={lastNotificationType}
          formatTimestamp={formatTimestamp}
          autoReleaseEnabled={autoReleaseEnabled}
          setAutoReleaseEnabled={setAutoReleaseEnabled}
        />
      </div>

      <ErrorMessage error={error} />

      {/* Hidden video for fallback */}
      <HiddenVideo videoRef={videoRef} />
    </div>
  );
};

export default Home;
