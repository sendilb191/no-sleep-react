import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Default settings configuration
const DEFAULT_SETTINGS = {
  autoEnable: false,
  fallbackMethod: 'video',
  batteryNotifications: true,
  notificationFrequency: '5min',
};

// Settings keys for localStorage
const STORAGE_KEYS = {
  autoEnable: 'nosleep-auto-enable',
  fallbackMethod: 'nosleep-fallback',
  batteryNotifications: 'nosleep-battery-notifications',
  notificationFrequency: 'nosleep-notification-frequency',
};

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  // Load settings from localStorage on mount/reload
  useEffect(() => {
    if (hasLoadedRef.current) return;

    const loadSettings = () => {
      try {
        const loadedSettings = {
          autoEnable: localStorage.getItem(STORAGE_KEYS.autoEnable) === 'true',
          fallbackMethod:
            localStorage.getItem(STORAGE_KEYS.fallbackMethod) ||
            DEFAULT_SETTINGS.fallbackMethod,
          batteryNotifications:
            localStorage.getItem(STORAGE_KEYS.batteryNotifications) !== 'false',
          notificationFrequency:
            localStorage.getItem(STORAGE_KEYS.notificationFrequency) ||
            DEFAULT_SETTINGS.notificationFrequency,
        };

        setSettings(loadedSettings);
        setIsLoaded(true);
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error);
        setSettings(DEFAULT_SETTINGS);
        setIsLoaded(true);
        hasLoadedRef.current = true;
      }
    };

    loadSettings();
  }, []);

  // Update a specific setting
  const updateSetting = useCallback((key, value) => {
    try {
      // Update state
      setSettings(prev => ({
        ...prev,
        [key]: value,
      }));

      // Update localStorage
      localStorage.setItem(STORAGE_KEYS[key], value.toString());
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
    }
  }, []);

  // Update multiple settings at once
  const updateSettings = useCallback(newSettings => {
    try {
      setSettings(prev => {
        const updated = { ...prev, ...newSettings };

        // Update localStorage for each changed setting
        Object.keys(newSettings).forEach(key => {
          if (STORAGE_KEYS[key]) {
            localStorage.setItem(
              STORAGE_KEYS[key],
              newSettings[key].toString()
            );
          }
        });

        return updated;
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }, []);

  // Reset all settings to defaults
  const resetSettings = useCallback(() => {
    try {
      setSettings(DEFAULT_SETTINGS);

      // Clear localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  }, []);

  // Get a specific setting value
  const getSetting = useCallback(
    key => {
      return settings[key];
    },
    [settings]
  );

  // Reload settings from localStorage (useful for debugging or manual refresh)
  const reloadSettings = useCallback(() => {
    try {
      const loadedSettings = {
        autoEnable: localStorage.getItem(STORAGE_KEYS.autoEnable) === 'true',
        fallbackMethod:
          localStorage.getItem(STORAGE_KEYS.fallbackMethod) ||
          DEFAULT_SETTINGS.fallbackMethod,
        batteryNotifications:
          localStorage.getItem(STORAGE_KEYS.batteryNotifications) !== 'false',
        notificationFrequency:
          localStorage.getItem(STORAGE_KEYS.notificationFrequency) ||
          DEFAULT_SETTINGS.notificationFrequency,
      };

      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to reload settings from localStorage:', error);
    }
  }, []);

  // Format notification frequency for display
  const getNotificationFrequencyLabel = useCallback(() => {
    const frequencyLabels = {
      once: 'Once Only',
      '1min': 'Every 1 Minute',
      '5min': 'Every 5 Minutes',
      '30min': 'Every 30 Minutes',
    };
    return frequencyLabels[settings.notificationFrequency] || 'Every 5 Minutes';
  }, [settings.notificationFrequency]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      settings,
      isLoaded,
      updateSetting,
      updateSettings,
      resetSettings,
      getSetting,
      reloadSettings,

      // Individual setting getters for convenience
      autoEnable: settings.autoEnable,
      fallbackMethod: settings.fallbackMethod,
      batteryNotifications: settings.batteryNotifications,
      notificationFrequency: settings.notificationFrequency,
      getNotificationFrequencyLabel,
    }),
    [
      settings,
      isLoaded,
      updateSetting,
      updateSettings,
      resetSettings,
      getSetting,
      reloadSettings,
      getNotificationFrequencyLabel,
    ]
  );
};
