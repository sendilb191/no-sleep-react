import React from 'react';
import './SettingsCard.less';

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
    </div>
  );
};

export default SettingsCard;
