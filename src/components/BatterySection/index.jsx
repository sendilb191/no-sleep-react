import React from 'react';
import BatteryIcon from '../_shared/BatteryIcon';
import SectionContainer from '../SectionContainer';

const BatterySection = ({ batteryInfo, isWakeLockActive }) => {
  if (!batteryInfo.supported) {
    return null;
  }

  return (
    <SectionContainer
      title='Battery Status'
      className={`battery-section ${
        batteryInfo.charging ? 'charging' : ''
      } ${batteryInfo.level <= 20 ? 'low-battery' : ''}`}
      icon={<BatteryIcon batteryInfo={batteryInfo} />}
      status={
        <div className='section-status'>
          <div className='api-status'>
            <span className='api-badge supported'>
              Battery API: ✅ Supported
            </span>
          </div>
          {isWakeLockActive &&
            !batteryInfo.charging &&
            batteryInfo.level <= 30 && (
              <div className='power-warning'>⚠️ May drain battery faster</div>
            )}
        </div>
      }
    />
  );
};

export default BatterySection;
