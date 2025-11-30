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
import { DEFAULT_APP_SETTINGS } from '../constants/appConstants';

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
  const [appSettings, setAppSettings] = useState(DEFAULT_APP_SETTINGS);

  // Use custom hooks with app-settings integration
  const {
    isActive: isWakeLockActive,
    toggleWakeLock,
    requestWakeLock,
    releaseWakeLock,
    wakeLockSupported,
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
    wakeLockSupported,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
