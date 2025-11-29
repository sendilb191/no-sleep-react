import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import BatteryIcon from '../components/BatteryIcon';

const HomePage = () => {
  const { settings, isWakeLockActive, batteryInfo } = useSettings();

  return (
    <main className='page'>
      <section className='info-card'>
        <h2>
          <span>Battery Status</span>
          <BatteryIcon
            level={batteryInfo.level}
            isCharging={batteryInfo.charging}
          />
        </h2>
        <div className='info-grid'>
          <div className='info-item'>
            <span className='label'>Time Remaining:</span>
            <span className='value'>
              {batteryInfo.dischargingTimeFormatted || 'Unknown'}
            </span>
          </div>
          <div className='info-item'>
            <span className='label'>Notifications:</span>
            <span
              className={`value ${settings.batteryNotificationsEnabled ? 'enabled' : 'disabled'}`}
            >
              {settings.batteryNotificationsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </section>

      <section className='info-card'>
        <h2>💤 Wake Lock</h2>
        <div className='info-grid'>
          <div className='info-item'>
            <span className='label'>Status:</span>
            <span
              className={`value ${isWakeLockActive ? 'enabled' : 'disabled'}`}
            >
              {isWakeLockActive ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
