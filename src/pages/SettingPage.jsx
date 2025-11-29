import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const SettingPage = () => {
  const {
    appSettings,
    updateSetting,
    isWakeLockActive,
    handleWakeLockToggle,
    testNotification,
  } = useSettings();

  const handleNotificationToggle = () => {
    const newValue = !appSettings.battery.notificationsEnabled;
    console.log('Toggling notifications to:', newValue);
    updateSetting('battery', 'notificationsEnabled', newValue);
  };

  const handleFrequencyChange = e => {
    const newFrequency = parseInt(e.target.value);
    console.log('Changing notification frequency to:', newFrequency, 'minutes');
    updateSetting('battery', 'notificationFrequency', newFrequency);
  };

  const handleTestNotification = () => {
    console.log('Test notification clicked - requesting permission first');
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        testNotification();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission result:', permission);
          if (permission === 'granted') {
            testNotification();
          }
        });
      } else {
        alert(
          'Notifications are blocked. Please enable them in your browser settings.'
        );
      }
    } else {
      alert('This browser does not support notifications.');
    }
  };

  return (
    <main className='page'>
      <section className='settings-card'>
        <h2>⚙️ Settings</h2>

        <label className='toggle-setting'>
          <input
            type='checkbox'
            checked={appSettings.wakeLock.active}
            onChange={() =>
              updateSetting('wakeLock', 'active', !appSettings.wakeLock.active)
            }
          />
          <div className='toggle-content'>
            <span className='setting-title'>Keep Screen Awake</span>
            <span className='setting-desc'>
              Prevent device from going to sleep
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
