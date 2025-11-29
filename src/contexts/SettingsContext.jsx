import React, { createContext, useContext, useState, useEffect } from 'react';
import useWakeLockState from '../hooks/useWakeLockState';
import useBatteryState from '../hooks/useBatteryState';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [appSettings, setAppSettings] = useState(() => {
    // Initialize app settings from localStorage on first render
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);

        // Handle migration from old flat structure to new nested structure
        if (
          parsedSettings.batteryNotificationsEnabled !== undefined ||
          parsedSettings.notificationFrequency !== undefined ||
          parsedSettings.wakeLockActive !== undefined
        ) {
          // Migrate from old flat structure - only use the nested structure, ignore old flat keys
          const migratedSettings = {
            battery: {
              notificationsEnabled:
                parsedSettings.batteryNotificationsEnabled ??
                parsedSettings.battery?.notificationsEnabled ??
                true,
              notificationFrequency:
                parsedSettings.notificationFrequency ??
                parsedSettings.battery?.notificationFrequency ??
                5,
            },
            wakeLock: {
              active:
                parsedSettings.wakeLockActive ??
                parsedSettings.wakeLock?.active ??
                false,
            },
          };

          // Save the migrated structure immediately to clean up localStorage
          localStorage.setItem(
            'app-settings',
            JSON.stringify(migratedSettings)
          );

          // Clean up old localStorage keys
          localStorage.removeItem('wakeLockActive');

          return migratedSettings;
        }

        // If already in new structure, return as is (but ensure it has the correct structure)
        if (parsedSettings.battery && parsedSettings.wakeLock) {
          return {
            battery: {
              notificationsEnabled:
                parsedSettings.battery.notificationsEnabled ?? true,
              notificationFrequency:
                parsedSettings.battery.notificationFrequency ?? 5,
            },
            wakeLock: {
              active: parsedSettings.wakeLock.active ?? false,
            },
          };
        }

        // Fallback for any other case
        return {
          battery: {
            notificationsEnabled: true,
            notificationFrequency: 5,
          },
          wakeLock: {
            active: false,
          },
        };
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }

    // Return default app settings if no saved settings or error
    return {
      battery: {
        notificationsEnabled: true,
        notificationFrequency: 5, // minutes between notifications
      },
      wakeLock: {
        active: false,
      },
    };
  });

  // Use custom hooks with app-settings integration
  const {
    isActive: isWakeLockActive,
    toggleWakeLock,
    requestWakeLock,
    releaseWakeLock,
  } = useWakeLockState(appSettings.wakeLock.active, active =>
    updateSetting('wakeLock', 'active', active)
  );

  const batteryData = useBatteryState(
    appSettings.battery.notificationsEnabled,
    appSettings.battery.notificationFrequency
  );

  // Request notification permission on first load if notifications are enabled
  useEffect(() => {
    if (appSettings.battery.notificationsEnabled) {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission);
        });
      }
    }
  }, [appSettings.battery.notificationsEnabled]);

  // Save app settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(appSettings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [appSettings]);

  const updateSetting = (section, key, value) => {
    setAppSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const value = {
    appSettings,
    updateSetting,
    // Battery state and functions
    batteryInfo: batteryData,
    testNotification: batteryData.testNotification,
    // Wake lock state and functions
    isWakeLockActive,
    handleWakeLockToggle: toggleWakeLock,
    requestWakeLock,
    releaseWakeLock,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
