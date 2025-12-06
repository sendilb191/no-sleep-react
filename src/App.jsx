import React from 'react';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import BatterySection from './components/BatterySection';
import WakeLockSection from './components/WakeLockSection';
import SettingsCard from './components/SettingsCard';
import ErrorMessage from './components/ErrorMessage';
import InfoSection from './components/InfoSection';
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

  const batteryInfo = useBattery();

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
            />
          </div>
        </div>

        <ErrorMessage error={error} />

        <InfoSection
          wakeLockSupported={wakeLockSupported}
          fallbackActive={fallbackActive}
          batteryInfo={batteryInfo}
        />

        <Instructions />

        {/* Hidden video for fallback */}
        <HiddenVideo videoRef={videoRef} />
      </div>
    </div>
  );
}

export default App;
