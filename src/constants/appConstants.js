// Default application settings
export const DEFAULT_APP_SETTINGS = {
  battery: {
    notificationsEnabled: true,
    notificationFrequency: 5, // minutes between notifications
  },
  wakeLock: {
    active: false,
  },
};

// Notification frequency options (in minutes)
export const NOTIFICATION_FREQUENCY_OPTIONS = [
  { value: 1, label: 'Every 1 minute' },
  { value: 2, label: 'Every 2 minutes' },
  { value: 5, label: 'Every 5 minutes' },
  { value: 10, label: 'Every 10 minutes' },
  { value: 15, label: 'Every 15 minutes' },
  { value: 30, label: 'Every 30 minutes' },
];

// Local storage keys
export const STORAGE_KEYS = {
  APP_SETTINGS: 'app-settings',
};
