export const checkBatterySupport = () => {
  return 'getBattery' in navigator || 'battery' in navigator;
};

export const getBatteryAPI = async () => {
  try {
    if ('getBattery' in navigator) {
      return await navigator.getBattery();
    } else if ('battery' in navigator) {
      return navigator.battery;
    }
    return null;
  } catch (error) {
    console.error('Failed to get battery API:', error);
    return null;
  }
};

export const shouldShowNotification = (
  batteryNotificationsEnabled,
  frequency,
  lastNotificationTime,
  notifiedForCurrentSession
) => {
  if (!batteryNotificationsEnabled) return false;

  const now = Date.now();

  if (frequency === 'once') {
    return !notifiedForCurrentSession;
  }

  if (!lastNotificationTime) return true;

  const intervals = {
    '1min': 60 * 1000,
    '5min': 5 * 60 * 1000,
    '30min': 30 * 60 * 1000,
  };

  const interval = intervals[frequency] || intervals['5min'];
  return now - lastNotificationTime >= interval;
};

export const createNotification = (message, type = 'info') => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification('Battery Health Alert', {
      body: message,
      tag: 'battery-alert',
      requireInteraction: true,
      silent: false,
    });
  }
  return null;
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }
  return 'unsupported';
};

export const getBatteryIcon = (level, charging) => {
  if (level === null) return '🔋';
  if (charging) return '🔌';
  if (level > 75) return '🔋';
  if (level > 25) return '🔋';
  return '🪫';
};

export const getBatteryStatus = (level, supported, error) => {
  if (!supported || error) return 'Battery info unavailable';
  if (level === null) return 'Loading battery info...';
  return `${level}%`;
};

export const formatTime = seconds => {
  if (seconds === Infinity || isNaN(seconds)) return 'Unknown';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
