import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import useWakeLockState from '../hooks/useWakeLockState';
import useBatteryState from '../hooks/useBatteryState';
import { requestNotificationPermissionOnly } from '../utils/notificationUtils';
import { DEFAULT_APP_SETTINGS, STORAGE_KEYS } from '../constants/appConstants';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const hasRequestedPermission = useRef(false);
  const [appSettings, setAppSettings] = useState(() => {
    // Initialize app settings from localStorage
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);

        // Ensure the settings have the correct structure
        if (parsedSettings.battery && parsedSettings.wakeLock) {
          return {
            battery: {
              notificationsEnabled:
                parsedSettings.battery.notificationsEnabled ??
                DEFAULT_APP_SETTINGS.battery.notificationsEnabled,
              notificationFrequency:
                parsedSettings.battery.notificationFrequency ??
                DEFAULT_APP_SETTINGS.battery.notificationFrequency,
            },
            wakeLock: {
              active:
                parsedSettings.wakeLock.active ??
                DEFAULT_APP_SETTINGS.wakeLock.active,
            },
          };
        }
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }

    // Return default settings
    return DEFAULT_APP_SETTINGS;
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
    if (
      appSettings.battery.notificationsEnabled &&
      !hasRequestedPermission.current
    ) {
      hasRequestedPermission.current = true;
      requestNotificationPermissionOnly({ showAlerts: false });
    }
  }, [appSettings.battery.notificationsEnabled]);

  // Save app settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.APP_SETTINGS,
        JSON.stringify(appSettings)
      );
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
