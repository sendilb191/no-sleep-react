import React, { useState } from 'react';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import { useNotifications } from './hooks/useNotifications';
import BatterySection from './components/BatterySection';
import WakeLockSection from './components/WakeLockSection';
import SettingsCard from './components/SettingsCard';
import ErrorMessage from './components/ErrorMessage';
import Instructions from './components/Instructions';
import HiddenVideo from './components/HiddenVideo';

function App() {
  const {
    isWakeLockActive,
    wakeLockSupported,
    fallbackActive,
    error,
    toggleWakeLock,
    videoRef,
  } = useWakeLock();

  const [notificationFrequency, setNotificationFrequency] = useState(5); // Default 5 minutes

  const {
    notificationPermission,
    requestPermission,
    showBatteryWarning,
    showHighBatteryWarning,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    isSupported: notificationsSupported,
  } = useNotifications(notificationFrequency);

  const batteryInfo = useBattery(
    batteryLevel => {
      showBatteryWarning(batteryLevel);
    },
    batteryLevel => {
      showHighBatteryWarning(batteryLevel);
    }
  );

  return (
    <div className='no-sleep-app'>
      <div className='app-container'>
        <header className='app-header'>
          <h1>🚫😴 No Sleep</h1>
          <p className='app-subtitle'>
            Keep your device awake & monitor battery
          </p>
        </header>

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
            />
          </div>
        </div>

        <ErrorMessage error={error} />

        <Instructions />

        {/* Hidden video for fallback */}
        <HiddenVideo videoRef={videoRef} />
      </div>
    </div>
  );
}

export default App;
