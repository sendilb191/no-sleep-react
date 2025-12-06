import React from 'react';
import { FiBattery } from 'react-icons/fi';
import BatteryIcon from '../BatteryIcon';
import './BatterySection.less';

const BatterySection = ({ batteryInfo, isWakeLockActive }) => {
  if (!batteryInfo.supported) {
    return null;
  }

  return (
    <div
      className={`section-card battery-section ${
        batteryInfo.charging ? 'charging' : ''
      } ${batteryInfo.level <= 20 ? 'low-battery' : ''}`}
    >
      <div className='section-main'>
        <div className='section-header'>
          <div className='section-icon'>
            <FiBattery className='icon' />
          </div>
          <div className='section-title'>
            <h3>Battery Status</h3>
          </div>
        </div>
        <BatteryIcon batteryInfo={batteryInfo} />
      </div>
      <div className='section-status'>
        <div className='api-status'>
          <span className='api-badge supported'>Battery API: ✅ Supported</span>
        </div>
        {isWakeLockActive &&
          !batteryInfo.charging &&
          batteryInfo.level <= 30 && (
            <div className='power-warning'>⚠️ May drain battery faster</div>
          )}
      </div>
    </div>
  );
};

export default BatterySection;
