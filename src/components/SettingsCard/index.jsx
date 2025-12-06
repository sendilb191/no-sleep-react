import React from 'react';
import './SettingsCard.less';

const SettingsCard = ({
  isWakeLockActive,
  toggleWakeLock,
  wakeLockSupported,
  fallbackActive,
  batteryInfo,
  notificationPermission,
  requestPermission,
  notificationsSupported,
  showTestNotification,
  notificationFrequency,
  setNotificationFrequency,
}) => {
  return (
    <div className='settings-card'>
      <h3 className='settings-title'>Controls</h3>

      {/* Wake Lock Toggle */}
      <div className='control-group'>
        <div className='control-description'>
          {isWakeLockActive ? 'Device staying awake' : 'Allow device to sleep'}
        </div>
        <div className='control-setting'>
          <div className='toggle-switch'>
            <input
              type='checkbox'
              id='wake-lock-toggle'
              checked={isWakeLockActive}
              onChange={toggleWakeLock}
            />
            <label htmlFor='wake-lock-toggle' className='switch'></label>
          </div>
        </div>
      </div>

      {/* Notification Permission */}
      {notificationsSupported && (
        <div className='control-group'>
          <div className='control-description'>
            {notificationPermission === 'granted'
              ? 'Notifications enabled'
              : notificationPermission === 'denied'
                ? 'Notifications blocked'
                : 'Enable low battery alerts'}
          </div>
          <div className='control-setting'>
            {notificationPermission !== 'granted' && (
              <button
                className='permission-button'
                onClick={requestPermission}
                disabled={notificationPermission === 'denied'}
              >
                {notificationPermission === 'denied' ? 'Blocked' : 'Enable'}
              </button>
            )}
            {notificationPermission === 'granted' && (
              <div className='permission-status granted'>✓ Enabled</div>
            )}
          </div>
        </div>
      )}

      {/* Notification Frequency */}
      {notificationsSupported && notificationPermission === 'granted' && (
        <div className='control-group'>
          <div className='control-description'>
            How often to receive low battery alerts
          </div>
          <div className='control-setting'>
            <select
              className='frequency-select'
              value={notificationFrequency}
              onChange={e => setNotificationFrequency(Number(e.target.value))}
            >
              <option value={1}>Every 1 minute</option>
              <option value={5}>Every 5 minutes</option>
              <option value={10}>Every 10 minutes</option>
              <option value={15}>Every 15 minutes</option>
              <option value={30}>Every 30 minutes</option>
              <option value={60}>Every 1 hour</option>
            </select>
          </div>
        </div>
      )}

      {/* Test Notification */}
      {notificationsSupported && notificationPermission === 'granted' && (
        <div className='control-group'>
          <div className='control-description'>
            Send a test notification to verify functionality
          </div>
          <div className='control-setting'>
            <button className='test-button' onClick={showTestNotification}>
              🧪 Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
