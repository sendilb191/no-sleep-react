import React from 'react';
import { FiBattery, FiZap } from 'react-icons/fi';

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
          <div className='battery-percentage'>{batteryInfo.level}%</div>
        </div>
      </div>
      <div className='battery-icon-display'>
        <div
          className={`battery-visual ${batteryInfo.charging ? 'charging' : ''}`}
        >
          <div className='battery-body'>
            <div
              className={`battery-level ${
                batteryInfo.charging ? 'charging' : 'discharging'
              }`}
              style={{ width: `${batteryInfo.level}%` }}
            ></div>
            {batteryInfo.charging && (
              <div className='charging-bolt'>
                <FiZap />
              </div>
            )}
          </div>
          <div className='battery-tip'></div>
        </div>
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
