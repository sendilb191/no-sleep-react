import React from 'react';
import './SettingsCard.less';

const SettingsCard = ({
  isWakeLockActive,
  toggleWakeLock,
  batteryInfo,
  notificationPermission,
  notificationsEnabled,
  soundEnabled,
  handleSoundToggle,
  handleNotificationToggle,
  requestPermission,
  enableNotifications,
  disableNotifications,
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
      <h3 className='settings-title'>Settings</h3>

      {/* Wake Lock Settings Group */}
      <div className='settings-group'>
        <h4 className='group-title'>🌙 Wake Lock</h4>

        <div className='control-group'>
          <div className='control-description'>Keep screen awake</div>
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

        <div className='control-group'>
          <div className='control-description'>Auto-release at 20% battery</div>
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
      </div>

      {/* Alert Settings Group */}
      <div className='settings-group'>
        <h4 className='group-title'>🔔 Alerts</h4>

        <div className='control-group'>
          <div className='control-description'>Sound alerts</div>
          <div className='control-setting'>
            <div className='toggle-switch'>
              <input
                type='checkbox'
                id='sound-toggle'
                checked={soundEnabled}
                onChange={handleSoundToggle}
              />
              <label htmlFor='sound-toggle' className='switch'></label>
            </div>
          </div>
        </div>

        {notificationsSupported && notificationPermission !== 'granted' && (
          <div className='control-group'>
            <div className='control-description'>Browser notifications</div>
            <div className='control-setting'>
              <button
                className='permission-button'
                onClick={requestPermission}
                disabled={notificationPermission === 'denied'}
              >
                {notificationPermission === 'denied' ? 'Blocked' : 'Enable'}
              </button>
            </div>
          </div>
        )}

        {notificationsSupported && notificationPermission === 'granted' && (
          <div className='control-group'>
            <div className='control-description'>Visual notifications</div>
            <div className='control-setting'>
              <div className='toggle-switch'>
                <input
                  type='checkbox'
                  id='notifications-toggle'
                  checked={notificationsEnabled}
                  onChange={handleNotificationToggle}
                />
                <label
                  htmlFor='notifications-toggle'
                  className='switch'
                ></label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Configuration Group */}
      {notificationsSupported && (soundEnabled || notificationsEnabled) && (
        <div className='settings-group'>
          <h4 className='group-title'>⚙️ Alert Configuration</h4>

          <div className='control-group'>
            <div className='control-description'>Alert frequency</div>
            <div className='control-setting'>
              <select
                className='frequency-select'
                value={notificationFrequency}
                onChange={e => setNotificationFrequency(Number(e.target.value))}
              >
                <option value={1}>1min</option>
                <option value={5}>5min</option>
                <option value={10}>10min</option>
                <option value={15}>15min</option>
                <option value={30}>30min</option>
                <option value={60}>1hr</option>
              </select>
            </div>
          </div>

          <div className='control-group'>
            <div className='control-description'>Test alerts</div>
            <div className='control-setting'>
              <button
                className='test-button'
                onClick={() => showTestNotification()}
              >
                🧪 Test
              </button>
            </div>
          </div>

          {lastNotificationTimestamp && (
            <div className='control-group status-group'>
              <div className='control-description'>
                Last:{' '}
                {lastNotificationType === 'test'
                  ? '🧪'
                  : lastNotificationType === 'battery-full'
                    ? '🔋+'
                    : lastNotificationType === 'auto-release'
                      ? '🔓'
                      : '🔋-'}{' '}
                {formatTimestamp(lastNotificationTimestamp)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsCard;
