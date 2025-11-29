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
  const [settings, setSettings] = useState({
    batteryNotificationsEnabled: true,
  });

  // Use custom hooks
  const {
    isActive: isWakeLockActive,
    toggleWakeLock,
    requestWakeLock,
    releaseWakeLock,
  } = useWakeLockState();

  const batteryInfo = useBatteryState(settings.batteryNotificationsEnabled);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const value = {
    settings,
    updateSetting,
    // Battery state
    batteryInfo,
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
