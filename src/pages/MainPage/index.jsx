import { getNotificationFrequencyLabel } from '../../utils/settingsService';
import './MainPage.less';

function MainPage({ wakeLock, settings, battery }) {
  const { isWakeLockEnabled, wakeLockSupported, wakeLockStatus } = wakeLock;
  const {
    batteryInfo,
    getBatteryIcon,
    getBatteryStatus,
    formatTime,
    notification,
    dismissNotification,
  } = battery;

  const { batteryNotifications } = settings;

  return (
    <main className='page main-page'>
      <header className='page-header'>
        <h1>Screen Wake Lock Control</h1>
        <p className='page-description'>
          Control your device's screen wake lock to prevent sleep mode.
        </p>
      </header>

      {notification && (
        <aside
          className={`notification notification-${notification.type}`}
          role='alert'
          aria-live='polite'
        >
          <div className='notification-content'>
            <span className='notification-icon' aria-hidden='true'>
              {notification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className='notification-message'>{notification.message}</span>
            <button
              onClick={dismissNotification}
              className='notification-dismiss'
              aria-label='Dismiss notification'
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      <section
        className='github-section'
        aria-labelledby='battery-status-heading'
      >
        <header className='section-header'>
          <h2 id='battery-status-heading'>Battery Status</h2>
        </header>
        <div className='section-body'>
          <div className='status-grid'>
            <div className='status-item'>
              <span className='status-label'>API Support</span>
              <span className='status-value'>
                {batteryInfo.supported ? (
                  <span className='badge badge-success'>
                    <span className='icon-text'>✓ Native Battery API</span>
                  </span>
                ) : (
                  <span className='badge badge-warning'>
                    <span className='icon-text'>⚠ Not Available</span>
                  </span>
                )}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Current Status</span>
              <span className='status-value'>
                {batteryInfo.supported && batteryInfo.level !== null ? (
                  batteryInfo.charging ? (
                    <span className='badge badge-success'>
                      <span className='icon-text'>🔌 Charging</span>
                    </span>
                  ) : (
                    <span className='badge badge-info'>
                      <span className='icon-text'>🔋 Not charging</span>
                    </span>
                  )
                ) : (
                  <span className='badge badge-inactive'>
                    <span className='icon-text'>❓ Unknown</span>
                  </span>
                )}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Battery Level</span>
              <span className='status-value'>
                {getBatteryIcon()} {getBatteryStatus()}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>System Runtime</span>
              <span className='status-value'>
                {batteryInfo.supported && batteryInfo.level !== null
                  ? batteryInfo.charging
                    ? '🔌 Unlimited (charging)'
                    : batteryInfo.dischargingTime !== Infinity &&
                        batteryInfo.dischargingTime > 0
                      ? `⏱️ ${formatTime(batteryInfo.dischargingTime)} remaining`
                      : `⏱️ ~${Math.round((batteryInfo.level / 10) * 2)}h estimated`
                  : '❓ Not available'}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Battery Alerts</span>
              <span className='status-value'>
                {batteryNotifications
                  ? batteryInfo.charging && batteryInfo.level > 95
                    ? '🚨 Active (95%+ charging)'
                    : '🔔 Enabled'
                  : '🔕 Disabled'}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Alert Frequency</span>
              <span className='status-value'>
                {batteryNotifications
                  ? `⏱️ ${getNotificationFrequencyLabel(settings.notificationFrequency)}`
                  : '➖ Not applicable'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className='github-section'
        aria-labelledby='wake-lock-status-heading'
      >
        <header className='section-header'>
          <h2 id='wake-lock-status-heading'>Wake Lock Status</h2>
        </header>
        <div className='section-body'>
          <div className='status-grid'>
            <div className='status-item'>
              <span className='status-label'>API Support</span>
              <span className='status-value'>
                {wakeLockSupported ? (
                  <span className='badge badge-success'>
                    <span className='icon-text'>✓ Native Wake Lock</span>
                  </span>
                ) : (
                  <span className='badge badge-warning'>
                    <span className='icon-text'>⚠ Video Fallback</span>
                  </span>
                )}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Current Status</span>
              <span className='status-value'>
                {isWakeLockEnabled ? (
                  <span className='badge badge-success'>
                    <span className='icon-text'>🔒 Active</span>
                  </span>
                ) : (
                  <span className='badge badge-inactive'>
                    <span className='icon-text'>⭕ Inactive</span>
                  </span>
                )}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Ready State</span>
              <span className='status-value'>{wakeLockStatus}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MainPage;
