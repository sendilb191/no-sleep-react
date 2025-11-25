import ToggleButton from '../components/shared/ToggleButton';
import CustomDropdown from '../components/shared/CustomDropdown';
import { useBattery } from '../hooks/useBattery';
import './SettingsPage.less';

function SettingsPage({ wakeLock, settings }) {
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
  } = useBattery(settings);

  // Use wake lock state from props
  const {
    isWakeLockEnabled,
    wakeLockSupported,
    wakeLockStatus,
    toggleWakeLock,
  } = wakeLock;

  // Show loading state until settings are loaded
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

  const handleAutoEnableChange = enabled => {
    updateSetting('autoEnable', enabled);
  };

  const handleFallbackMethodChange = method => {
    updateSetting('fallbackMethod', method);
  };

  const handleBatteryNotificationsChange = async enabled => {
    updateSetting('batteryNotifications', enabled);

    // Request permission when enabling notifications
    if (enabled && notificationPermission !== 'granted') {
      await requestNotificationPermission();
    }
  };

  const handleNotificationFrequencyChange = frequency => {
    updateSetting('notificationFrequency', frequency);
  };

  const handleRequestPermission = async () => {
    await requestNotificationPermission();
  };

  const handleTestNotification = async () => {
    try {
      // Check if Notification API is supported
      if (!('Notification' in window)) {
        const msg = 'Notifications are not supported in this browser';
        console.error(msg);
        alert(msg);
        return;
      }

      // Check current permission
      let permission = Notification.permission;

      // Request permission if needed
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        // Create test notification
        const notification = new Notification('Test Notification', {
          body: 'Push notifications are working! 🔋',
          tag: 'test-notification',
          requireInteraction: false,
          silent: false,
        });

        // Add error listener for debugging
        notification.onerror = e => console.error('Notification error:', e);

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        // Also show in-app feedback
        if (showNotification) {
          showNotification(
            'Test notification sent! Check your system tray. 🎉',
            'info'
          );
        } else {
          console.warn('showNotification function not available');
          alert('Test notification sent! (showNotification unavailable)');
        }
      } else if (permission === 'denied') {
        const msg =
          'Notifications are blocked. Please enable them in your browser settings.';
        console.warn('Permission denied:', msg);
        alert(msg);
      } else {
        const msg = `Notification permission was not granted. Status: ${permission}`;
        console.warn(msg);
        alert(msg);
      }
    } catch (error) {
      console.error('Error in handleTestNotification:', error);
      alert('Failed to send test notification: ' + error.message);
    }
  };

  const handleResetSettings = () => {
    resetSettings();
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
                onChange={e => handleAutoEnableChange(e.target.checked)}
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
                isActive={isWakeLockEnabled}
                onToggle={toggleWakeLock}
                activeLabel='🔓 Release'
                inactiveLabel='🔒 Enable'
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
                onChange={handleFallbackMethodChange}
                options={[
                  {
                    value: 'video',
                    label: 'Invisible Video',
                    description: 'Uses hidden video playback',
                  },
                  {
                    value: 'audio',
                    label: 'Silent Audio',
                    description: 'Uses muted audio loop',
                  },
                  {
                    value: 'none',
                    label: 'None (Wake Lock API only)',
                    description: 'No fallback method',
                  },
                ]}
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
                onChange={handleNotificationFrequencyChange}
                disabled={!batteryNotifications}
                options={[
                  {
                    value: 'once',
                    label: 'Once Only',
                    description: 'Single notification when reaching 95%',
                  },
                  {
                    value: '1min',
                    label: 'Every 1 Minute',
                    description: 'Frequent reminders while charging',
                  },
                  {
                    value: '5min',
                    label: 'Every 5 Minutes',
                    description: 'Regular reminders (recommended)',
                  },
                  {
                    value: '30min',
                    label: 'Every 30 Minutes',
                    description: 'Occasional reminders',
                  },
                ]}
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
                    onClick={handleRequestPermission}
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
            <button onClick={handleResetSettings} className='btn btn-outline'>
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
