// Default settings configuration
export const DEFAULT_SETTINGS = {
  autoEnable: false,
  fallbackMethod: 'video',
  batteryNotifications: true,
  notificationFrequency: '5min',
};

// Settings keys for localStorage
export const STORAGE_KEYS = {
  autoEnable: 'nosleep-auto-enable',
  fallbackMethod: 'nosleep-fallback',
  batteryNotifications: 'nosleep-battery-notifications',
  notificationFrequency: 'nosleep-notification-frequency',
  userWantsWakeLock: 'nosleep-user-wants-wakelock',
};

export const loadSettings = () => {
  try {
    return {
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
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const updateSetting = (key, value) => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], value.toString());
    return true;
  } catch (error) {
    console.error(`Failed to update setting ${key}:`, error);
    return false;
  }
};

export const resetSettings = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return false;
  }
};

export const getNotificationFrequencyLabel = frequency => {
  const frequencyLabels = {
    once: 'Once Only',
    '1min': 'Every 1 Minute',
    '5min': 'Every 5 Minutes',
    '30min': 'Every 30 Minutes',
  };
  return frequencyLabels[frequency] || 'Every 5 Minutes';
};

// Wake lock localStorage functions
export const loadWakeLockPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.userWantsWakeLock) === 'true';
  } catch (error) {
    console.error('Failed to load wake lock preference:', error);
    return false;
  }
};

export const saveWakeLockPreference = wantsWakeLock => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.userWantsWakeLock,
      wantsWakeLock.toString()
    );
    return true;
  } catch (error) {
    console.error('Failed to save wake lock preference:', error);
    return false;
  }
};
