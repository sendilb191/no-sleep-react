import { useState, useEffect } from 'react';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  updateSetting as updateSettingUtil,
  resetSettings as resetSettingsUtil,
} from '../utils/core/settingsService.js';

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setIsLoaded(true);
  }, []);

  const updateSetting = (key, value) => {
    if (updateSettingUtil(key, value)) {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const resetSettings = () => {
    if (resetSettingsUtil()) {
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const reloadSettings = () => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  };

  return {
    ...settings,
    isLoaded,
    updateSetting,
    resetSettings,
    reloadSettings,
  };
};
