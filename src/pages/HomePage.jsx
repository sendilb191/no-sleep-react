import React, { useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import BatteryIcon from '../components/BatteryIcon';

const HomePage = () => {
  const { appSettings, batteryInfo, isWakeLockActive, wakeLockSupported } =
    useSettings();

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
              className={`value ${appSettings.battery.notificationsEnabled ? 'enabled' : 'disabled'}`}
            >
              {appSettings.battery.notificationsEnabled
                ? 'Enabled'
                : 'Disabled'}
            </span>
          </div>
        </div>
      </section>

      <section className='info-card'>
        <h2>💤 Wake Lock</h2>
        <div className='info-grid'>
          <div className='info-item'>
            <span className='label'>Setting:</span>
            <span
              className={`value ${appSettings.wakeLock.active ? 'enabled' : 'disabled'}`}
            >
              {appSettings.wakeLock.active ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className='info-item'>
            <span className='label'>Actual Status:</span>
            <span
              className={`value ${isWakeLockActive ? 'enabled' : 'disabled'}`}
            >
              {isWakeLockActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className='info-item'>
            <span className='label'>Browser Support:</span>
            <span
              className={`value ${wakeLockSupported ? 'enabled' : 'disabled'}`}
            >
              {wakeLockSupported ? 'Supported' : 'Not Supported'}
            </span>
          </div>
          <div className='info-item'>
            <span className='label'>Method:</span>
            <span className='value native'>Native Wake Lock</span>
          </div>
          <div className='info-item'>
            <span className='label'>Protocol:</span>
            <span className='value'>{window.location.protocol}</span>
          </div>
        </div>
        {appSettings.wakeLock.active && !isWakeLockActive && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              background: '#ff9800',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            ⚠️ Wake Lock is enabled in settings but not currently active. Check
            console for details or try interacting with the page.
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
