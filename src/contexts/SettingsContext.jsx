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
  const [settings, setSettings] = useState(() => {
    // Initialize settings from localStorage on first render
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        return {
          batteryNotificationsEnabled: true, // default value
          notificationFrequency: 5, // minutes between notifications
          ...parsedSettings, // override with saved values
        };
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }

    // Return default settings if no saved settings or error
    return {
      batteryNotificationsEnabled: true,
      notificationFrequency: 5, // minutes between notifications
    };
  });

  // Use custom hooks
  const {
    isActive: isWakeLockActive,
    toggleWakeLock,
    requestWakeLock,
    releaseWakeLock,
  } = useWakeLockState();

  const batteryData = useBatteryState(
    settings.batteryNotificationsEnabled,
    settings.notificationFrequency
  );

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const value = {
    settings,
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
