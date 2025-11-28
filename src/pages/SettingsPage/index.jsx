import ToggleButton from '../../components/shared/ToggleButton';
import CustomDropdown from '../../components/shared/CustomDropdown';
import {
  FALLBACK_METHOD_OPTIONS,
  NOTIFICATION_FREQUENCY_OPTIONS,
} from '../../constants/dropdownOptions';
import './SettingsPage.less';

function SettingsPage({ wakeLock, settings, battery }) {
  const {
    autoEnable,
    fallbackMethod,
    batteryNotifications,
    notificationFrequency,
    updateSetting,
    resetSettings,
    reloadSettings,
    isLoaded,
  } = settings;

  const {
    notificationPermission,
    requestNotificationPermission,
    showNotification,
  } = battery;

  const {
    userWantsWakeLock,
    wakeLockSupported,
    wakeLockStatus,
    isToggling,
    toggleWakeLock,
  } = wakeLock; // Show loading state until settings are loaded
  if (!isLoaded) {
    return (
      <div className='page settings-page'>
        <div className='page-header'>
          <h1>Settings</h1>
          <p className='page-description'>Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleBatteryNotificationsChange = async enabled => {
    updateSetting('batteryNotifications', enabled);

    // Request permission when enabling notifications
    if (enabled && notificationPermission !== 'granted') {
      await requestNotificationPermission();
    }
  };

  const handleTestNotification = async () => {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'Push notifications are working! 🔋',
        tag: 'test-notification',
      });
      showNotification('Test notification sent! 🎉', 'info');
    } else {
      alert('Notifications are not enabled. Please allow notifications first.');
    }
  };

  return (
    <div className='page settings-page'>
      <div className='page-header'>
        <h1>Settings</h1>
        <p className='page-description'>
          Configure your wake lock preferences and behavior.
        </p>
      </div>

      <div className='github-section compact-section'>
        <div className='section-header'>
          <h3>Wake Lock Configuration</h3>
        </div>
        <div className='section-body'>
          <div className='setting-row'>
            <div className='setting-info'>
              <p className='setting-title'>
                Auto-enable wake lock on page load
              </p>
            </div>
            <div className='setting-control'>
              <input
                id='auto-enable'
                type='checkbox'
                checked={autoEnable}
                onChange={e => updateSetting('autoEnable', e.target.checked)}
                className='form-checkbox'
              />
            </div>
          </div>

          <div className='setting-row'>
            <div className='setting-info'>
              <p className='setting-title'>Wake Lock Control</p>
              <p className='setting-description'>
                {wakeLockStatus} •{' '}
                {wakeLockSupported ? 'Native API' : 'Video Fallback'}
              </p>
            </div>
            <div className='setting-control'>
              <ToggleButton
                isActive={userWantsWakeLock}
                onToggle={() => toggleWakeLock()}
                activeLabel='🔓 Release'
                inactiveLabel='🔒 Enable'
                isLoading={isToggling}
                size='medium'
              />
            </div>
          </div>

          <div className='setting-row'>
            <div className='setting-info'>
              <p className='setting-title'>Fallback Method</p>
              <p className='setting-description'>
                Choose how to prevent screen sleep when Wake Lock API is not
                supported
              </p>
            </div>
            <div className='setting-control'>
              <CustomDropdown
                id='fallback-select'
                value={fallbackMethod}
                onChange={method => updateSetting('fallbackMethod', method)}
                options={FALLBACK_METHOD_OPTIONS}
                placeholder='Select fallback method'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='github-section compact-section'>
        <div className='section-header'>
          <h3>Battery Configuration</h3>
        </div>
        <div className='section-body'>
          <div className='setting-row'>
            <div className='setting-info'>
              <p className='setting-title'>Battery Health Notifications</p>
              <p className='setting-description'>
                Get notified when battery is charging above 95% to help preserve
                battery health
              </p>
            </div>
            <div className='setting-control'>
              <ToggleButton
                isActive={batteryNotifications}
                onToggle={() =>
                  handleBatteryNotificationsChange(!batteryNotifications)
                }
                activeLabel='🔔 Enabled'
                inactiveLabel='🔕 Disabled'
                size='medium'
              />
            </div>
          </div>

          <div className='setting-row'>
            <div className='setting-info'>
              <p
                className={`setting-title ${!batteryNotifications ? 'disabled' : ''}`}
              >
                Notification Frequency
              </p>
              <p
                className={`setting-description ${!batteryNotifications ? 'disabled' : ''}`}
              >
                How often to remind you when battery is above 95% and charging
                {!batteryNotifications &&
                  ' (disabled - enable battery notifications first)'}
              </p>
            </div>
            <div className='setting-control'>
              <CustomDropdown
                id='frequency-select'
                value={notificationFrequency}
                onChange={frequency =>
                  updateSetting('notificationFrequency', frequency)
                }
                disabled={!batteryNotifications}
                options={NOTIFICATION_FREQUENCY_OPTIONS}
                placeholder='Select frequency'
              />
            </div>
          </div>
          <div className='setting-row'>
            <div className='setting-info'>
              <p
                className={`setting-title ${!batteryNotifications ? 'disabled' : ''}`}
              >
                Browser Push Notifications
              </p>
              <p
                className={`setting-description ${!batteryNotifications ? 'disabled' : ''}`}
              >
                Status:{' '}
                {!batteryNotifications
                  ? '🔕 Disabled (enable battery notifications first)'
                  : notificationPermission === 'granted'
                    ? '✅ Allowed'
                    : notificationPermission === 'denied'
                      ? '❌ Blocked'
                      : notificationPermission === 'default'
                        ? '⏳ Not requested'
                        : '❓ Not supported'}
                {batteryNotifications &&
                  notificationPermission === 'denied' &&
                  ' (Enable in browser settings)'}
              </p>
            </div>
            <div className='setting-control'>
              {batteryNotifications &&
                notificationPermission !== 'granted' &&
                notificationPermission !== 'denied' && (
                  <button
                    onClick={requestNotificationPermission}
                    className='btn btn-primary'
                  >
                    🔔 Allow Notifications
                  </button>
                )}
              {batteryNotifications && notificationPermission === 'granted' && (
                <button
                  onClick={handleTestNotification}
                  className='btn btn-outline'
                >
                  🧪 Test Notification
                </button>
              )}
              {!batteryNotifications && (
                <button
                  className='btn btn-outline'
                  disabled
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  🔕 Disabled
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h3>Actions</h3>
        </div>
        <div className='section-body'>
          <div className='action-buttons'>
            <button onClick={resetSettings} className='btn btn-outline'>
              Reset to Defaults
            </button>
            <button onClick={reloadSettings} className='btn btn-outline'>
              Reload from Storage
            </button>
          </div>
          <div
            style={{
              marginTop: 'var(--spacing-md)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            Settings loaded from localStorage:{' '}
            {isLoaded ? '✅ Yes' : '⏳ Loading...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
