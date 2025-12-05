import { useState, useEffect, useRef } from 'react';

export const useBattery = () => {
  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    charging: false,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  });

  const batteryRef = useRef(null);

  // Battery API support and initialization
  useEffect(() => {
    const initBattery = async () => {
      try {
        // Check for Battery API support
        if ('getBattery' in navigator) {
          const battery = await navigator.getBattery();
          batteryRef.current = battery;

          // Update battery info
          const updateBatteryInfo = () => {
            setBatteryInfo({
              level: Math.round(battery.level * 100),
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
              supported: true,
            });
          };

          // Initial update
          updateBatteryInfo();

          // Add event listeners for battery changes
          battery.addEventListener('chargingchange', updateBatteryInfo);
          battery.addEventListener('levelchange', updateBatteryInfo);
          battery.addEventListener('chargingtimechange', updateBatteryInfo);
          battery.addEventListener('dischargingtimechange', updateBatteryInfo);

          return () => {
            // Cleanup event listeners
            battery.removeEventListener('chargingchange', updateBatteryInfo);
            battery.removeEventListener('levelchange', updateBatteryInfo);
            battery.removeEventListener(
              'chargingtimechange',
              updateBatteryInfo
            );
            battery.removeEventListener(
              'dischargingtimechange',
              updateBatteryInfo
            );
          };
        } else {
          // Fallback for browsers without Battery API (like newer Chrome versions)
          setBatteryInfo(prev => ({ ...prev, supported: false }));
        }
      } catch (error) {
        console.warn('Battery API not available:', error);
        setBatteryInfo(prev => ({ ...prev, supported: false }));
      }
    };

    initBattery();
  }, []);

  return batteryInfo;
};
