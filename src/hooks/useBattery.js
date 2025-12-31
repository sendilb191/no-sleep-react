import { useState, useEffect } from 'react';

export const useBattery = () => {
  const [batteryStatus, setBatteryStatus] = useState({
    level: null,
    charging: null,
    chargingTime: null,
    dischargingTime: null,
    isSupported: false,
  });

  useEffect(() => {
    let battery = null;

    const updateBatteryStatus = batteryManager => {
      setBatteryStatus({
        level: Math.round(batteryManager.level * 100),
        charging: batteryManager.charging,
        chargingTime: batteryManager.chargingTime,
        dischargingTime: batteryManager.dischargingTime,
        isSupported: true,
      });
    };

    const setupBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          battery = await navigator.getBattery();
          updateBatteryStatus(battery);

          // Add event listeners for battery changes
          battery.addEventListener('levelchange', () =>
            updateBatteryStatus(battery)
          );
          battery.addEventListener('chargingchange', () =>
            updateBatteryStatus(battery)
          );
          battery.addEventListener('chargingtimechange', () =>
            updateBatteryStatus(battery)
          );
          battery.addEventListener('dischargingtimechange', () =>
            updateBatteryStatus(battery)
          );
        } catch (err) {
          console.error('Battery API error:', err);
          setBatteryStatus(prev => ({ ...prev, isSupported: false }));
        }
      } else {
        setBatteryStatus(prev => ({ ...prev, isSupported: false }));
      }
    };

    setupBattery();

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', () =>
          updateBatteryStatus(battery)
        );
        battery.removeEventListener('chargingchange', () =>
          updateBatteryStatus(battery)
        );
        battery.removeEventListener('chargingtimechange', () =>
          updateBatteryStatus(battery)
        );
        battery.removeEventListener('dischargingtimechange', () =>
          updateBatteryStatus(battery)
        );
      }
    };
  }, []);

  // Helper to get battery icon based on level
  const getBatteryIcon = () => {
    const { level, charging } = batteryStatus;
    if (charging) return '🔌';
    if (level === null) return '🔋';
    if (level >= 80) return '🔋';
    if (level >= 50) return '🔋';
    if (level >= 20) return '🪫';
    return '🪫';
  };

  // Helper to get battery color based on level
  const getBatteryColor = () => {
    const { level, charging } = batteryStatus;
    if (charging) return '#4ade80'; // green
    if (level === null) return '#9ca3af'; // gray
    if (level >= 50) return '#4ade80'; // green
    if (level >= 20) return '#fbbf24'; // yellow
    return '#ef4444'; // red
  };

  // Check for low battery warning
  const isLowBattery = () => {
    const { level, charging } = batteryStatus;
    return level !== null && level < 30 && !charging;
  };

  // Check for high battery warning (overcharge prevention)
  const isHighBattery = () => {
    const { level, charging } = batteryStatus;
    return level !== null && level > 90 && charging;
  };

  return {
    ...batteryStatus,
    getBatteryIcon,
    getBatteryColor,
    isLowBattery,
    isHighBattery,
  };
};
