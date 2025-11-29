import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const SettingPage = () => {
  const {
    settings,
    updateSetting,
    isWakeLockActive,
    handleWakeLockToggle,
    testNotification,
  } = useSettings();

  const handleNotificationToggle = () => {
    updateSetting(
      'batteryNotificationsEnabled',
      !settings.batteryNotificationsEnabled
    );
  };

  const handleFrequencyChange = e => {
    updateSetting('notificationFrequency', parseInt(e.target.value));
  };

  const handleTestNotification = () => {
    testNotification();
  };

  return (
    <main className='page'>
      <section className='settings-card'>
        <h2>🔋 Battery</h2>
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

        {settings.batteryNotificationsEnabled && (
          <>
            <div className='setting-group'>
              <label className='frequency-setting'>
                <span className='setting-label'>Notification Frequency:</span>
                <select
                  value={settings.notificationFrequency}
                  onChange={handleFrequencyChange}
                  className='frequency-select'
                >
                  <option value={1}>Every 1 minute</option>
                  <option value={2}>Every 2 minutes</option>
                  <option value={5}>Every 5 minutes</option>
                  <option value={10}>Every 10 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                </select>
              </label>
            </div>

            <div className='setting-group'>
              <button onClick={handleTestNotification} className='test-button'>
                🧪 Test Notification
              </button>
            </div>
          </>
        )}
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
