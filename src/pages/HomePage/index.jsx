import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const HomePage = () => {
  const { settings, isWakeLockActive, batteryInfo } = useSettings();

  return (
    <main className='page'>
      <section className='info-card'>
        <h2>🔋 Battery Status</h2>
        <div className='info-grid'>
          <div className='info-item'>
            <span className='label'>Level:</span>
            <span className='value'>{batteryInfo.level || 0}%</span>
          </div>
          <div className='info-item'>
            <span className='label'>Charging:</span>
            <span className={`value ${batteryInfo.charging ? 'charging' : ''}`}>
              {batteryInfo.charging ? '🔌 Yes' : '🔋 No'}
            </span>
          </div>
          <div className='info-item'>
            <span className='label'>Time Remaining:</span>
            <span className='value'>
              {batteryInfo.dischargingTimeFormatted || 'Unknown'}
            </span>
          </div>
          <div className='info-item'>
            <span className='label'>Notifications:</span>
            <span
              className={`value ${settings.batteryNotificationsEnabled ? 'enabled' : ''}`}
            >
              {settings.batteryNotificationsEnabled
                ? '🟢 Enabled'
                : '🔴 Disabled'}
            </span>
          </div>
        </div>
      </section>

      <section className='info-card'>
        <h2>💤 Wake Lock</h2>
        <div className='status-badge'>
          <span
            className={`status ${isWakeLockActive ? 'active' : 'inactive'}`}
          >
            {isWakeLockActive ? '🔒 Screen Awake' : '💤 Sleep Mode'}
          </span>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
