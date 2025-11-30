import React from 'react';

const BatteryIcon = ({ level = 0, isCharging = false }) => {
  const batteryLevel = Math.max(0, Math.min(100, level));

  // Always use green color for consistency
  const fillColor = 'rgb(40, 167, 69)';

  return (
    <div className={`battery-container ${isCharging ? 'charging' : ''}`}>
      <div className='battery-body'>
        {/* Battery terminal/tip */}
        <div className='battery-tip'></div>

        {/* Battery shell */}
        <div className='battery-shell'>
          {/* Battery fill level */}
          <div
            className='battery-fill'
            style={{
              width: `${batteryLevel}%`,
              backgroundColor: fillColor,
            }}
          >
            {/* Charging animation waves inside battery */}
            {isCharging && (
              <>
                <div className='charging-wave wave-1'></div>
                <div className='charging-wave wave-2'></div>
                <div className='charging-wave wave-3'></div>
              </>
            )}
          </div>

          {/* Lightning bolt overlay when charging */}
          {isCharging && <div className='lightning-bolt'>⚡</div>}
        </div>
      </div>

      {/* Battery percentage text */}
      <span className='battery-percentage'>{Math.round(batteryLevel)}%</span>
    </div>
  );
};

export default BatteryIcon;
