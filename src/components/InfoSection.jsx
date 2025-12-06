import React from 'react';
import { FiInfo, FiBattery, FiZap } from 'react-icons/fi';
import './InfoSection.less';

const InfoSection = ({ wakeLockSupported, fallbackActive, batteryInfo }) => {
  return (
    <div className='info-section'>
      <div className='info-item'>
        <FiInfo />
        <div>
          <strong>Wake Lock API:</strong>{' '}
          {wakeLockSupported ? '✅ Supported' : '❌ Not Supported'}
        </div>
      </div>

      {!wakeLockSupported && (
        <div className='info-item'>
          <FiInfo />
          <div>
            <strong>Fallback Mode:</strong>{' '}
            {fallbackActive ? '✅ Active' : '⏸️ Inactive'}
          </div>
        </div>
      )}

      {batteryInfo.supported && (
        <div
          className={`info-item battery-status ${batteryInfo.level <= 20 ? 'low-battery' : ''}`}
        >
          {batteryInfo.charging ? (
            <FiZap className='charging-icon' />
          ) : (
            <FiBattery />
          )}
          <div>
            <strong>Battery:</strong> {batteryInfo.level}%
            {batteryInfo.charging ? (
              <span className='charging-text'>⚡ Charging</span>
            ) : (
              <span className='discharging-text'>🔋 Discharging</span>
            )}
            {batteryInfo.level <= 20 && !batteryInfo.charging && (
              <span className='low-battery-warning'> ⚠️ Low Battery</span>
            )}
          </div>
        </div>
      )}

      <div className='info-item'>
        <FiInfo />
        <div>
          <strong>Browser:</strong> {navigator.userAgent.split(' ').pop()}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
