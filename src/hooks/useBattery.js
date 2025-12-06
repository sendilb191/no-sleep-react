import { useState, useEffect, useRef } from 'react';

export const useBattery = (onLowBattery, onHighBattery) => {
  const [batteryInfo, setBatteryInfo] = useState({
    level: null,
    charging: false,
    chargingTime: null,
    dischargingTime: null,
    supported: false,
  });

  const batteryRef = useRef(null);
  const highBatteryNotifiedRef = useRef(false);
  const lowBatteryNotifiedRef = useRef(false);

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
            const level = Math.round(battery.level * 100);
            const charging = battery.charging;

            setBatteryInfo({
              level,
              charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime,
              supported: true,
            });

            // Check for low battery condition (< 30% and not charging)
            if (level < 30 && !charging && onLowBattery) {
              if (!lowBatteryNotifiedRef.current) {
                onLowBattery(level);
                lowBatteryNotifiedRef.current = true;
              }
            } else if (level >= 30 || charging) {
              // Reset low battery notification when battery improves
              lowBatteryNotifiedRef.current = false;
            }

            // Check for high battery condition (> 90% and charging)
            if (level > 90 && charging && onHighBattery) {
              if (!highBatteryNotifiedRef.current) {
                console.log(
                  'Triggering high battery notification for level:',
                  level
                );
                onHighBattery(level);
                highBatteryNotifiedRef.current = true;
              }
            } else if (level <= 85 || !charging) {
              // Reset high battery notification when battery drops or stops charging
              highBatteryNotifiedRef.current = false;
            }
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
