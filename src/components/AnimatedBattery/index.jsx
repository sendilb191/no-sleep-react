import React from 'react';
import './AnimatedBattery.less';

const AnimatedBattery = ({ level, charging }) => {
  const getBatteryClass = () => {
    if (charging) return 'charging';
    if (level > 50) return 'high';
    if (level > 20) return 'medium';
    return 'low';
  };

  return (
    <div className={`battery-skeleton ${getBatteryClass()}`}>
      <div className='battery-shell'>
        <div className='battery-fill' style={{ width: `${level}%` }}>
          {charging && <div className='charging-wave'></div>}
        </div>
      </div>
      <div className='battery-terminal'></div>
    </div>
  );
};

export default AnimatedBattery;
