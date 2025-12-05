import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const WakeLockSection = ({
  isWakeLockActive,
  batteryInfo,
  wakeLockSupported,
  fallbackActive,
}) => {
  return (
    <div className='section-card wake-lock-section'>
      <div className='section-main'>
        <div className='section-header'>
          <div className='section-icon'>
            <div
              className={`status-indicator ${
                isWakeLockActive ? 'active' : 'inactive'
              }`}
            >
              {isWakeLockActive ? <FiSun /> : <FiMoon />}
            </div>
          </div>
          <div className='section-title'>
            <h3>Sleep Prevention</h3>
          </div>
        </div>
        <div className='wake-icon-display'>
          <div
            className={`wake-visual ${isWakeLockActive ? 'active' : 'inactive'}`}
          >
            <div className='wake-center'>
              <div
                className={`wake-icon ${isWakeLockActive ? 'active' : 'inactive'}`}
              >
                {isWakeLockActive ? <FiSun /> : <FiMoon />}
              </div>
              <div className='wake-pulse-ring'></div>
            </div>
          </div>
          <div
            className={`wake-status-text ${isWakeLockActive ? 'active' : 'inactive'}`}
          >
            {isWakeLockActive ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
      <div className='section-status'>
        <div className='api-status'>
          <span
            className={`api-badge ${wakeLockSupported ? 'supported' : 'unsupported'}`}
          >
            Wake Lock API:{' '}
            {wakeLockSupported ? '✅ Supported' : '❌ Not Supported'}
          </span>
          {!wakeLockSupported && (
            <span
              className={`api-badge ${fallbackActive ? 'supported' : 'inactive'}`}
            >
              Fallback: {fallbackActive ? '✅ Active' : '⏸️ Inactive'}
            </span>
          )}
        </div>
        {isWakeLockActive &&
          batteryInfo.supported &&
          !batteryInfo.charging &&
          batteryInfo.level <= 30 && (
            <div className='power-warning'>⚠️ May drain battery faster</div>
          )}
      </div>
    </div>
  );
};

export default WakeLockSection;
