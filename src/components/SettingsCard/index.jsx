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
}) => {
  return (
    <div className='settings-card'>
      <h3 className='settings-title'>Controls</h3>

      {/* Wake Lock Toggle */}
      <div className='control-group'>
        <div className='control-info'>
          <label>Sleep Prevention</label>
          <span className='control-description'>
            {isWakeLockActive
              ? 'Device staying awake'
              : 'Allow device to sleep'}
          </span>
        </div>
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

      {/* Notification Permission */}
      {notificationsSupported && (
        <div className='control-group'>
          <div className='control-info'>
            <label>Battery Notifications</label>
            <span className='control-description'>
              {notificationPermission === 'granted'
                ? 'Notifications enabled'
                : notificationPermission === 'denied'
                  ? 'Notifications blocked'
                  : 'Enable low battery alerts'}
            </span>
          </div>
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
      )}

      {/* Test Notification */}
      {notificationsSupported && notificationPermission === 'granted' && (
        <div className='control-group'>
          <div className='control-info'>
            <label>Test Notifications</label>
            <span className='control-description'>
              Send a test notification to verify functionality
            </span>
          </div>
          <button className='test-button' onClick={showTestNotification}>
            🧪 Test
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
