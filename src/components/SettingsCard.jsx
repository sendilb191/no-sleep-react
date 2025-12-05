import React from 'react';

const SettingsCard = ({
  isWakeLockActive,
  toggleWakeLock,
  wakeLockSupported,
  fallbackActive,
  batteryInfo,
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
  );
};

export default SettingsCard;
