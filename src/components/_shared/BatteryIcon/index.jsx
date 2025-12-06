import React from 'react';
import { FiZap } from 'react-icons/fi';
import './BatteryIcon.less';

const BatteryIcon = ({ batteryInfo }) => {
  return (
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
      <div className='battery-percentage'>{batteryInfo.level}%</div>
    </div>
  );
};

export default BatteryIcon;
