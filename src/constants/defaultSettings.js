// ===================================================
// Default Settings Constants
// ===================================================

export const DEFAULT_SETTINGS = {
  // Notification settings
  NOTIFICATION_FREQUENCY: 5, // Default 5 minutes
  NOTIFICATION_DISPLAY_ENABLED: true,
  SOUND_ENABLED: true,

  // Battery settings
  AUTO_RELEASE_ENABLED: true, // Auto-release when battery < 20%

  // Battery thresholds
  LOW_BATTERY_THRESHOLD: 30, // Show warning below 30%
  CRITICAL_BATTERY_THRESHOLD: 20, // Auto-release below 20%
  HIGH_BATTERY_THRESHOLD: 90, // Show overcharge warning above 90%

  // Service Worker test settings
  SW_TEST_DELAY: 60, // 1 minute delay for SW test notification (in seconds)
};
