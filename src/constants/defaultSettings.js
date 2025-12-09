// ===================================================
// Default Settings Constants
// ===================================================

export const DEFAULT_SETTINGS = {
  // Wake Lock settings
  WAKE_LOCK_ENABLED_BY_DEFAULT: true, // Enable wake lock automatically on app load

  // Notification settings
  NOTIFICATION_FREQUENCY: 5, // Default 5 minutes
  NOTIFICATION_DISPLAY_ENABLED: true,
  SOUND_ENABLED: true,

  // Battery settings
  AUTO_RELEASE_ENABLED: true, // Auto-release when battery < 20%

  // Battery thresholds
  CRITICAL_BATTERY_THRESHOLD: 20, // Auto-release below 20%
};
