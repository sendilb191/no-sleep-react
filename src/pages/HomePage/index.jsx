import React, { useState, useEffect } from 'react';
import useWakeLock from '../../hooks/useWakeLock';
import './HomePage.less';
import useBattery from '../../hooks/useBattery';

const HomePage = () => {
  const { isActive, handleToggle } = useWakeLock();
  const batteryInfo = useBattery();

  console.log('batteryInfo', batteryInfo);
  return (
    <div className='home-page'>
      <div className='wake-lock'>
        <h2>Wake Lock Info</h2>
        <div className='lock-status flex'>
          <p>
            Status: {isActive ? '🔒 Screen Lock Active' : '💤 Screen Can Sleep'}
          </p>
          <input type='checkbox' checked={isActive} onChange={handleToggle} />
        </div>
      </div>
      <div className='battery-info'>
        <h2>Battery Info</h2>
        <div className='lock-status flex'>
          <p>battery Level:{batteryInfo.level}</p>
          <p>charging:{batteryInfo.charging}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
