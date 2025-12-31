import './App.css';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import StatusDot from './components/StatusDot';

function App() {
  const { isActive, isSupported, error, userWantsWakeLock, toggleWakeLock } =
    useWakeLock();
  const {
    level,
    charging,
    isSupported: batterySupported,
    getBatteryColor,
    isLowBattery,
    isHighBattery,
  } = useBattery();

  return (
    <div className='app'>
      <div className='container'>
        <h1>🔒 Wake Lock App</h1>
        <p className='subtitle'>Keep your screen awake</p>

        <div className='cards-container'>
          <div className='status-card'>
            <div className='status-indicator'>
              <StatusDot isActive={isActive} />
              <span className='status-text'>
                {isActive
                  ? 'Screen Wake Lock Active'
                  : userWantsWakeLock
                    ? 'Wake Lock Requested (will reactivate when tab is focused)'
                    : 'Screen Wake Lock Inactive'}
              </span>
            </div>

            {userWantsWakeLock && !isActive && (
              <div className='auto-reactivate-info'>
                <p>
                  💡 Wake lock will automatically reactivate when you return to
                  this tab
                </p>
              </div>
            )}

            {isSupported ? (
              <button
                className={`wake-lock-btn ${userWantsWakeLock ? 'active' : 'inactive'}`}
                onClick={toggleWakeLock}
              >
                {userWantsWakeLock
                  ? '🔓 Turn Off Wake Lock'
                  : '🔒 Keep Screen Awake'}
              </button>
            ) : (
              <div className='unsupported'>
                <p>❌ Wake Lock API not supported</p>
                <p className='help-text'>
                  Please use a modern browser like Chrome, Edge, or Safari on
                  mobile.
                </p>
              </div>
            )}

            {error && (
              <div className='error-message'>
                <p>⚠️ {error}</p>
              </div>
            )}
          </div>

          {/* Battery Status Card */}
          <div className='status-card battery-card'>
            <h3>🔋 Battery Status</h3>
            {batterySupported ? (
              <div className='battery-status'>
                <div className='battery-icon-visual'>
                  <div className='battery-shape'>
                    <div className='battery-body'>
                      <div
                        className='battery-fill-visual'
                        style={{
                          width: `${level}%`,
                          backgroundColor: getBatteryColor(),
                        }}
                      ></div>
                    </div>
                    <div className='battery-tip'></div>
                  </div>
                  <span className='battery-level'>{level}%</span>
                </div>
                <div className='battery-info'>
                  <p className='charging-status'>
                    {charging ? '⚡ Charging' : '🔌 Not Charging'}
                  </p>
                  {isLowBattery() && (
                    <p className='battery-warning low'>
                      ⚠️ Low battery! Consider charging your device.
                    </p>
                  )}
                  {isHighBattery() && (
                    <p className='battery-warning high'>
                      💡 Battery above 90%. Consider unplugging to preserve
                      battery health.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className='unsupported'>
                <p>❌ Battery API not supported</p>
                <p className='help-text'>
                  Battery status is not available in this browser.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
