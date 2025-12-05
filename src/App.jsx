import React, { useState, useEffect, useRef } from 'react';
import {
  FiMoon,
  FiSun,
  FiInfo,
  FiAlertCircle,
  FiBattery,
  FiZap,
  FiPower,
} from 'react-icons/fi';

function App() {
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [error, setError] = useState('');
  const [fallbackActive, setFallbackActive] = useState(false);
  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    charging: false,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  });
  const wakeLockRef = useRef(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const batteryRef = useRef(null);

  // Check Wake Lock API support
  useEffect(() => {
    if ('wakeLock' in navigator) {
      setWakeLockSupported(true);
    }
  }, []);

  // Battery API support and initialization
  useEffect(() => {
    const initBattery = async () => {
      try {
        // Check for Battery API support
        if ('getBattery' in navigator) {
          const battery = await navigator.getBattery();
          batteryRef.current = battery;

          // Update battery info
          const updateBatteryInfo = () => {
            setBatteryInfo({
              level: Math.round(battery.level * 100),
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
              supported: true,
            });
          };

          // Initial update
          updateBatteryInfo();

          // Add event listeners for battery changes
          battery.addEventListener('chargingchange', updateBatteryInfo);
          battery.addEventListener('levelchange', updateBatteryInfo);
          battery.addEventListener('chargingtimechange', updateBatteryInfo);
          battery.addEventListener('dischargingtimechange', updateBatteryInfo);

          return () => {
            // Cleanup event listeners
            battery.removeEventListener('chargingchange', updateBatteryInfo);
            battery.removeEventListener('levelchange', updateBatteryInfo);
            battery.removeEventListener(
              'chargingtimechange',
              updateBatteryInfo
            );
            battery.removeEventListener(
              'dischargingtimechange',
              updateBatteryInfo
            );
          };
        } else {
          // Fallback for browsers without Battery API (like newer Chrome versions)
          setBatteryInfo(prev => ({ ...prev, supported: false }));
        }
      } catch (error) {
        console.warn('Battery API not available:', error);
        setBatteryInfo(prev => ({ ...prev, supported: false }));
      }
    };

    initBattery();
  }, []);

  // Handle visibility change (user switches tabs/minimizes)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isWakeLockActive) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isWakeLockActive]);

  // Modern Wake Lock API implementation
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');

        wakeLockRef.current.addEventListener('release', () => {
          console.log('Wake Lock was released');
        });

        console.log('Wake Lock is active');
        setError('');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to request wake lock:', err);
      setError(`Wake Lock failed: ${err.message}`);
      return false;
    }
  };

  // Release wake lock
  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock released');
        setError('');
      } catch (err) {
        console.error('Failed to release wake lock:', err);
        setError(`Failed to release: ${err.message}`);
      }
    }
  };

  // Fallback methods for older browsers
  const startFallbackMethods = () => {
    // Method 1: Hidden video loop
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Video fallback failed');
      });
    }

    // Method 2: Periodic page activity simulation
    intervalRef.current = setInterval(() => {
      // Simulate user activity by creating a tiny DOM change
      document.body.style.background =
        document.body.style.background === 'inherit' ? '' : 'inherit';
    }, 30000); // Every 30 seconds

    setFallbackActive(true);
  };

  const stopFallbackMethods = () => {
    // Stop video
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setFallbackActive(false);
  };

  // Main toggle function
  const toggleWakeLock = async () => {
    if (isWakeLockActive) {
      // Turn off
      await releaseWakeLock();
      stopFallbackMethods();
      setIsWakeLockActive(false);
    } else {
      // Turn on
      let success = false;

      if (wakeLockSupported) {
        success = await requestWakeLock();
      }

      if (!success || !wakeLockSupported) {
        // Use fallback methods
        startFallbackMethods();
        success = true;
      }

      if (success) {
        setIsWakeLockActive(true);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
      stopFallbackMethods();
    };
  }, []);

  return (
    <div className='app'>
      <div className='container'>
        <header className='header'>
          <h1>🚫😴 No Sleep</h1>
          <p className='subtitle'>Keep your device awake & monitor battery</p>
        </header>

        <div className='main-layout'>
          <div className='left-section'>
            {/* Battery Section */}
            {batteryInfo.supported && (
              <div
                className={`section-card battery-section ${batteryInfo.charging ? 'charging' : ''} ${batteryInfo.level <= 20 ? 'low-battery' : ''}`}
              >
                <div className='section-header'>
                  <div className='section-icon'>
                    {batteryInfo.charging ? (
                      <FiZap className='icon charging' />
                    ) : (
                      <FiBattery className='icon' />
                    )}
                  </div>
                  <div className='section-title'>
                    <h3>Battery Status</h3>
                    <div className='battery-percentage'>
                      {batteryInfo.level}%
                    </div>
                  </div>
                </div>
                <div className='battery-bar'>
                  <div
                    className={`battery-fill ${batteryInfo.charging ? 'charging' : ''} ${batteryInfo.level <= 20 ? 'low' : batteryInfo.level <= 50 ? 'medium' : 'high'}`}
                    style={{ width: `${batteryInfo.level}%` }}
                  ></div>
                </div>
                <div className='section-status'>
                  {batteryInfo.charging ? (
                    <span className='charging'>⚡ Charging</span>
                  ) : (
                    <span className='discharging'>🔋 On Battery</span>
                  )}
                  {batteryInfo.level <= 20 && !batteryInfo.charging && (
                    <span className='warning'> • Low Battery</span>
                  )}
                </div>
              </div>
            )}

            {/* Wake Lock Section */}
            <div className='section-card wake-lock-section'>
              <div className='section-header'>
                <div className='section-icon'>
                  <div
                    className={`status-indicator ${isWakeLockActive ? 'active' : 'inactive'}`}
                  >
                    {isWakeLockActive ? <FiSun /> : <FiMoon />}
                  </div>
                </div>
                <div className='section-title'>
                  <h3>Sleep Prevention</h3>
                  <div className='wake-status'>
                    {isWakeLockActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
              <div className='section-status'>
                {isWakeLockActive
                  ? "Your device won't go to sleep"
                  : 'Device can sleep normally'}
                {isWakeLockActive &&
                  batteryInfo.supported &&
                  !batteryInfo.charging &&
                  batteryInfo.level <= 30 && (
                    <div className='power-warning'>
                      ⚠️ May drain battery faster
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className='right-section'>
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

              {/* API Status */}
              <div className='status-group'>
                <h4>System Status</h4>
                <div className='status-item'>
                  <span>Wake Lock API:</span>
                  <span
                    className={`status-badge ${wakeLockSupported ? 'supported' : 'unsupported'}`}
                  >
                    {wakeLockSupported ? '✅ Supported' : '❌ Not Supported'}
                  </span>
                </div>

                {!wakeLockSupported && (
                  <div className='status-item'>
                    <span>Fallback Mode:</span>
                    <span
                      className={`status-badge ${fallbackActive ? 'active' : 'inactive'}`}
                    >
                      {fallbackActive ? '✅ Active' : '⏸️ Inactive'}
                    </span>
                  </div>
                )}

                {batteryInfo.supported && (
                  <div className='status-item'>
                    <span>Battery API:</span>
                    <span className='status-badge supported'>✅ Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className='error-message'>
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <div className='info-section'>
          <div className='info-item'>
            <FiInfo />
            <div>
              <strong>Wake Lock API:</strong>{' '}
              {wakeLockSupported ? '✅ Supported' : '❌ Not Supported'}
            </div>
          </div>

          {!wakeLockSupported && (
            <div className='info-item'>
              <FiInfo />
              <div>
                <strong>Fallback Mode:</strong>{' '}
                {fallbackActive ? '✅ Active' : '⏸️ Inactive'}
              </div>
            </div>
          )}

          {batteryInfo.supported && (
            <div
              className={`info-item battery-status ${batteryInfo.level <= 20 ? 'low-battery' : ''}`}
            >
              {batteryInfo.charging ? (
                <FiZap className='charging-icon' />
              ) : (
                <FiBattery />
              )}
              <div>
                <strong>Battery:</strong> {batteryInfo.level}%
                {batteryInfo.charging ? (
                  <span className='charging-text'>⚡ Charging</span>
                ) : (
                  <span className='discharging-text'>🔋 Discharging</span>
                )}
                {batteryInfo.level <= 20 && !batteryInfo.charging && (
                  <span className='low-battery-warning'> ⚠️ Low Battery</span>
                )}
              </div>
            </div>
          )}

          <div className='info-item'>
            <FiInfo />
            <div>
              <strong>Browser:</strong> {navigator.userAgent.split(' ').pop()}
            </div>
          </div>
        </div>

        <div className='instructions'>
          <h3>How it works:</h3>
          <ul>
            <li>Uses the modern Screen Wake Lock API when available</li>
            <li>Falls back to alternative methods for older browsers</li>
            <li>Automatically reactivates when you return to the tab</li>
            <li>Works best when the tab is active and visible</li>
          </ul>
        </div>

        {/* Hidden video for fallback */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          style={{ display: 'none' }}
        >
          <source
            src='data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAACG1kYXQAAAAPbW9vdgAAAGxtdmhkAAAAANUxdb7VMXW+AAAAUAAAAUAAQUAAACAAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFpb2RzAAAAE2VzZHMAAAAAA4CAgE8AAQAAAAAAAAABAAAAAAAAAA=='
            type='video/mp4'
          />
        </video>
      </div>
    </div>
  );
}

export default App;
