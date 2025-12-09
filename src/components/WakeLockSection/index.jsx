import React from 'react';
import WakeIcon from '../_shared/WakeIcon';
import SectionContainer from '../SectionContainer';

const WakeLockSection = ({ isWakeLockActive, batteryInfo }) => {
  return (
    <SectionContainer
      title='Sleep Prevention'
      className='wake-lock-section'
      icon={<WakeIcon isActive={isWakeLockActive} />}
      status={
        <div className='section-status'>
          <div className='api-status'>
            <span
              className={`api-badge ${isWakeLockActive ? 'active' : 'inactive'}`}
            >
              Status: {isWakeLockActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>
          {isWakeLockActive &&
            batteryInfo.supported &&
            !batteryInfo.charging &&
            batteryInfo.level <= 30 && (
              <div className='power-warning'>⚠️ May drain battery faster</div>
            )}
        </div>
      }
    />
  );
};

export default WakeLockSection;
