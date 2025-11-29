import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const SettingPage = () => {
  const { settings, updateSetting, isWakeLockActive, handleWakeLockToggle } =
    useSettings();

  const handleNotificationToggle = () => {
    updateSetting(
      'batteryNotificationsEnabled',
      !settings.batteryNotificationsEnabled
    );
  };

  return (
    <main className='page'>
      <section className='settings-card'>
        <h2>🔔 Notifications</h2>
        <label className='toggle-setting'>
          <input
            type='checkbox'
            checked={settings.batteryNotificationsEnabled}
            onChange={handleNotificationToggle}
          />
          <div className='toggle-content'>
            <span className='setting-title'>Battery Alerts</span>
            <span className='setting-desc'>
              Get notified when battery is above 90% while charging
            </span>
          </div>
        </label>
      </section>

      <section className='settings-card'>
        <h2>🔒 Wake Lock</h2>
        <label className='toggle-setting'>
          <input
            type='checkbox'
            checked={isWakeLockActive}
            onChange={handleWakeLockToggle}
          />
          <div className='toggle-content'>
            <span className='setting-title'>Keep Screen Awake</span>
            <span className='setting-desc'>
              Prevent device from going to sleep
            </span>
          </div>
        </label>
      </section>
    </main>
  );
};

export default SettingPage;
