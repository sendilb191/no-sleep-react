import React from 'react';
import './HomePage.less';
import AnimatedBattery from '../../components/AnimatedBattery';
import { useSettings } from '../../contexts/SettingsContext';

const HomePage = () => {
  const { settings, isWakeLockActive, batteryInfo } = useSettings();

  return (
    <div className='home-page'>
      <section className='battery-info'>
        <h2>Battery Info</h2>
        <div className='battery-display'>
          <div>
            <p>🔋 Battery Level: {batteryInfo.level}%</p>
            <p>⚡ Charging: {batteryInfo.charging ? 'Yes' : 'No'}</p>
            <p>🕐 Discharging Time: {batteryInfo.dischargingTimeFormatted}</p>
            <p>
              🔔 Notifications:{' '}
              {settings.batteryNotificationsEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      </section>

      <section className='wake-lock'>
        <h2>Wake Lock Status</h2>
        <div className='status-display'>
          <p>Status: {isWakeLockActive ? 'Active' : 'Sleeping'}</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
