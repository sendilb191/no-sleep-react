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
  lastNotificationTimestamp,
  lastNotificationType,
  formatTimestamp,
  autoReleaseEnabled,
  setAutoReleaseEnabled,
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

      {/* Auto-Release Wake Lock Setting */}
      <div className='control-group'>
        <div className='control-description'>
          Automatically release wake lock when battery drops below 20% (not
          charging)
        </div>
        <div className='control-setting'>
          <div className='toggle-switch'>
            <input
              type='checkbox'
              id='auto-release-toggle'
              checked={autoReleaseEnabled}
              onChange={e => setAutoReleaseEnabled(e.target.checked)}
            />
            <label htmlFor='auto-release-toggle' className='switch'></label>
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
            How often to receive battery health alerts
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

      {/* Notification Timestamps - Outside controls */}
      {notificationsSupported && notificationPermission === 'granted' && (
        <div className='timestamp-section'>
          <div className='timestamp-info'>
            {lastNotificationTimestamp && (
              <div className='timestamp-item'>
                <span className='timestamp-label'>Last notification:</span>
                <span className='timestamp-value'>
                  {lastNotificationType === 'test'
                    ? '🧪 Test'
                    : lastNotificationType === 'battery-full'
                      ? '🔋 Battery Fully Charged'
                      : lastNotificationType === 'auto-release'
                        ? '🔓 Wake Lock Auto-Released'
                        : '🔋 Battery Warning'}{' '}
                  - {formatTimestamp(lastNotificationTimestamp)}
                </span>
              </div>
            )}
            {!lastNotificationTimestamp && (
              <div className='timestamp-item'>
                <span className='timestamp-value no-notifications'>
                  No notifications sent yet
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
