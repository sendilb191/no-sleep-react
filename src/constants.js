// Timer presets in minutes
export const TIMER_PRESETS = [
  { label: 'Off', value: null },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '2h', value: 120 },
];

// LocalStorage keys
export const STORAGE_KEYS = {
  HISTORY: 'wakeLockHistory',
  IN_PROGRESS: 'wakeLockInProgress',
};

// History settings
export const MAX_HISTORY = 20;
export const MIN_SESSION_DURATION = 5; // Minimum seconds to save a session

// Auto-save interval in milliseconds
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
