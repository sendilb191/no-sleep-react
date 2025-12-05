import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const WakeLockSection = ({ isWakeLockActive, batteryInfo }) => {
  return (
    <div className='section-card wake-lock-section'>
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
            <div className='power-warning'>⚠️ May drain battery faster</div>
          )}
      </div>
    </div>
  );
};

export default WakeLockSection;
