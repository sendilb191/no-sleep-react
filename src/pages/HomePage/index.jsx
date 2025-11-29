import React, { useState, useEffect } from 'react';
import useWakeLock from '../../hooks/useWakeLock';
import './HomePage.less';
import useBattery from '../../hooks/useBattery';
import AnimatedBattery from '../../components/AnimatedBattery';

const HomePage = () => {
  const { isActive, handleToggle } = useWakeLock();
  const batteryInfo = useBattery();

  console.log('batteryInfo', batteryInfo);

  return (
    <div className='home-page'>
      <section className='wake-lock'>
        <h2>Wake Lock Info </h2>
        <div className='lock-status flex'>
          <span>Status: {isActive ? '🔒 Active' : '💤 Sleeping'}</span>
          <input type='checkbox' checked={isActive} onChange={handleToggle} />
        </div>
      </section>
      <section className='battery-info'>
        <h2>Battery Info</h2>

        <div className='battery-display'>
          <AnimatedBattery
            level={batteryInfo.level || 0}
            charging={batteryInfo.charging || false}
          />
          <div>
            <p>🔋 Battery Level: {batteryInfo.level}%</p>
            <p>⚡ Charging: {batteryInfo.charging ? '🔌 Yes' : '🔋 No'}</p>
            <p>🕐 Discharging Time: {batteryInfo.dischargingTimeFormatted}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
