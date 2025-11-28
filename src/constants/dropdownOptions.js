// Fallback method options for wake lock
export const FALLBACK_METHOD_OPTIONS = [
  {
    value: 'video',
    label: 'Invisible Video',
    description: 'Uses hidden video playback',
  },
  {
    value: 'audio',
    label: 'Silent Audio',
    description: 'Uses muted audio loop',
  },
  {
    value: 'none',
    label: 'None (Wake Lock API only)',
    description: 'No fallback method',
  },
];

// Notification frequency options for battery notifications
export const NOTIFICATION_FREQUENCY_OPTIONS = [
  {
    value: 'once',
    label: 'Once Only',
    description: 'Single notification when reaching 95%',
  },
  {
    value: '1min',
    label: 'Every 1 Minute',
    description: 'Frequent reminders while charging',
  },
  {
    value: '5min',
    label: 'Every 5 Minutes',
    description: 'Regular reminders (recommended)',
  },
  {
    value: '30min',
    label: 'Every 30 Minutes',
    description: 'Occasional reminders',
  },
];
