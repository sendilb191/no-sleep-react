import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { requestNotificationPermission } from '../utils/notificationUtils';

const SettingPage = () => {
  const { appSettings, updateSetting, testNotification } = useSettings();

  const handleNotificationToggle = () => {
    const newValue = !appSettings.battery.notificationsEnabled;
    updateSetting('battery', 'notificationsEnabled', newValue);
  };

  const handleFrequencyChange = e => {
    const newFrequency = parseInt(e.target.value);
    updateSetting('battery', 'notificationFrequency', newFrequency);
  };

  const handleTestNotification = () => {
    requestNotificationPermission(testNotification);
  };

  return (
    <main className='page'>
      <section className='settings-card'>
        <h2>⚙️ Settings</h2>

        <label className='toggle-setting'>
          <input
            type='checkbox'
            checked={appSettings.wakeLock.active}
            onChange={() => {
              const newValue = !appSettings.wakeLock.active;
              updateSetting('wakeLock', 'active', newValue);
            }}
          />
          <div className='toggle-content'>
            <span className='setting-title'>Keep Screen Awake</span>
            <span className='setting-desc'>
              Prevent device from going to sleep (requires user interaction)
            </span>
          </div>
        </label>

        <label className='toggle-setting'>
          <input
            type='checkbox'
            checked={appSettings.battery.notificationsEnabled}
            onChange={handleNotificationToggle}
          />
          <div className='toggle-content'>
            <span className='setting-title'>Battery Alerts</span>
            <span className='setting-desc'>
              Get periodic battery status notifications
            </span>
          </div>
        </label>

        {appSettings.battery.notificationsEnabled && (
          <>
            <div className='setting-group'>
              <label className='frequency-setting'>
                <span className='setting-label'>Notification Frequency:</span>
                <select
                  value={appSettings.battery.notificationFrequency}
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
          </>
        )}

        <div className='setting-group'>
          <button onClick={handleTestNotification} className='test-button'>
            🧪 Test Notification
          </button>
        </div>
      </section>
    </main>
  );
};

export default SettingPage;
