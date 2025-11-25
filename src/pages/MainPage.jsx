import { Link } from 'react-router-dom';
import { useBattery } from '../hooks/useBattery';
import './MainPage.less';

function MainPage({ wakeLock }) {
  const { isWakeLockEnabled, wakeLockSupported, wakeLockStatus } = wakeLock;
  const {
    batteryInfo,
    getBatteryIcon,
    getBatteryStatus,
    formatTime,
    notification,
    dismissNotification,
  } = useBattery();

  return (
    <div className='page main-page'>
      <div className='page-header'>
        <h1>Screen Wake Lock Control</h1>
        <p className='page-description'>
          Control your device's screen wake lock to prevent sleep mode.
        </p>
      </div>

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className='notification-content'>
            <span className='notification-icon'>
              {notification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className='notification-message'>{notification.message}</span>
            <button
              onClick={dismissNotification}
              className='notification-dismiss'
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className='github-section'>
        <div className='section-header'>
          <h2>Wake Lock Status</h2>
        </div>
        <div className='section-body'>
          <div className='status-grid'>
            <div className='status-item'>
              <span className='status-label'>API Support</span>
              <span className='status-value'>
                {wakeLockSupported ? '✓ Native Wake Lock' : '⚠ Video Fallback'}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Current Status</span>
              <span className='status-value'>
                {isWakeLockEnabled ? '🔒 Active' : '⭕ Inactive'}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Ready State</span>
              <span className='status-value'>{wakeLockStatus}</span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Control Location</span>
              <span className='status-value'>
                <Link to='/settings' className='settings-link'>
                  → Settings Page
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h2>Battery Status</h2>
        </div>
        <div className='section-body'>
          <div className='status-grid'>
            <div className='status-item'>
              <span className='status-label'>Battery Level</span>
              <span className='status-value'>
                {getBatteryIcon()} {getBatteryStatus()}
              </span>
            </div>
            {batteryInfo.supported && batteryInfo.level !== null && (
              <>
                {batteryInfo.charging &&
                  batteryInfo.chargingTime !== Infinity && (
                    <div className='status-item'>
                      <span className='status-label'>Charging Time</span>
                      <span className='status-value'>
                        ⚡ Full in: {formatTime(batteryInfo.chargingTime)}
                      </span>
                    </div>
                  )}
                {!batteryInfo.charging &&
                  batteryInfo.dischargingTime !== Infinity && (
                    <div className='status-item'>
                      <span className='status-label'>Battery Life</span>
                      <span className='status-value'>
                        🔋 Time left: {formatTime(batteryInfo.dischargingTime)}
                      </span>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
