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
    <div className='settings-page'>
      <h1>Settings</h1>

      <section className='notification-settings'>
        <h2>Notifications</h2>
        <div className='setting-item'>
          <label className='setting-label'>
            <input
              type='checkbox'
              checked={settings.batteryNotificationsEnabled}
              onChange={handleNotificationToggle}
            />
            <span className='setting-text'>
              Enable battery notifications (when battery {'>'}90% and charging)
            </span>
          </label>
        </div>
      </section>

      <section className='wake-lock-settings'>
        <h2>Wake Lock</h2>
        <div className='setting-item'>
          <label className='setting-label'>
            <input
              type='checkbox'
              checked={isWakeLockActive}
              onChange={handleWakeLockToggle}
            />
            <span className='setting-text'>
              Keep screen awake (prevents device from sleeping)
            </span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default SettingPage;
