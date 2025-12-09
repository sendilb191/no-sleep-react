import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio } from './useAudio';

export const useNotifications = (
  frequencyMinutes = 5,
  soundEnabled = true,
  notificationsEnabled = true
) => {
  const { playNotificationBeep, resumeAudioContext, keepAudioContextActive } =
    useAudio();
  const [notificationPermission, setNotificationPermission] =
    useState('default');
  const [internalNotificationsEnabled, setInternalNotificationsEnabled] =
    useState(notificationsEnabled);
  const [internalSoundEnabled, setInternalSoundEnabled] =
    useState(soundEnabled);
  const [lastNotificationTimestamp, setLastNotificationTimestamp] =
    useState(null);
  const [lastNotificationType, setLastNotificationType] = useState(null);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState('checking');
  const lastNotificationTime = useRef(0);
  const lastBatteryNotificationTime = useRef(0); // Separate tracking for battery notifications

  // Calculate cooldown dynamically based on current frequency setting
  const getNotificationCooldown = () => {
    const cooldown = frequencyMinutes * 60 * 1000;
    return cooldown;
  };

  // Check if battery notification should be shown based on frequency
  const shouldShowBatteryNotification = notificationType => {
    const now = Date.now();
    const timeSinceLastBatteryNotification =
      now - lastBatteryNotificationTime.current;
    const frequencyMs = frequencyMinutes * 60 * 1000;

    // Add 5-second buffer to prevent duplicates from rapid battery updates
    const bufferMs = 5000;
    const shouldShow =
      timeSinceLastBatteryNotification >= frequencyMs - bufferMs;

    return shouldShow;
  };

  // Track frequency changes
  useEffect(() => {
    // Frequency changed - no logging needed in production
  }, [frequencyMinutes]);

  // Format timestamp for display
  const formatTimestamp = timestamp => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString();
  };

  // Service worker reference
  const swRef = useRef(null);

  // Send settings to service worker
  const updateServiceWorkerSettings = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SETTINGS_UPDATE',
        data: {
          frequency: frequencyMinutes,
          soundEnabled,
          notificationsEnabled,
          autoReleaseEnabled: true,
          lowThreshold: 30,
          criticalThreshold: 20,
          highThreshold: 90,
        },
      });
    }
  }, [frequencyMinutes, soundEnabled, notificationsEnabled]);

  // Send battery updates to service worker
  const sendBatteryUpdateToSW = useCallback(batteryData => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'BATTERY_UPDATE',
        data: batteryData,
      });
    }
  }, []);

  // Test service worker functionality
  const testServiceWorker = useCallback((delaySeconds = 60) => {
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        try {
          navigator.serviceWorker.controller.postMessage({
            type: 'SW_TEST',
            data: { delay: delaySeconds },
          });

          // Show immediate feedback
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('🧪 SW Test Started', {
              body: `Service Worker test notification will appear in ${delaySeconds} seconds`,
              icon: '/no-sleep.svg',
              tag: 'sw-test-start',
            });
          }

          return true;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, []);

  // Check and request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);

      // Initialize audio context keep-alive for better background audio
      keepAudioContextActive();

      // Register service worker for better background notification support
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            setServiceWorkerStatus('registered');

            // Wait for service worker to be ready
            if (registration.installing) {
              setServiceWorkerStatus('installing');
              registration.installing.addEventListener('statechange', () => {
                if (registration.installing.state === 'activated') {
                  setServiceWorkerStatus('active');
                  initializeServiceWorker();
                }
              });
            } else if (registration.active) {
              setServiceWorkerStatus('active');
              initializeServiceWorker();
            }
          })
          .catch(err => {
            setServiceWorkerStatus('failed');
          });

        // Initialize service worker
        const initializeServiceWorker = () => {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'START_MONITORING',
            });
            updateServiceWorkerSettings();
          } else {
            // Wait a bit and try again
            setTimeout(() => {
              if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                  type: 'START_MONITORING',
                });
                updateServiceWorkerSettings();
              }
            }, 100);
          }
        };

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', event => {
          const { type, data } = event.data;

          switch (type) {
            case 'RELEASE_WAKE_LOCK':
              break;
            case 'SW_BATTERY_UPDATE':
              break;
            case 'SW_TEST_SCHEDULED':
              break;
            case 'SW_TEST_COMPLETED':
              if (data.success) {
                // Play audio notification for successful test
                playNotificationBeep('test');
              }
              break;
            case 'NOTIFICATION_SENT':
              // Update last notification timestamp and type
              setLastNotificationTimestamp(data.timestamp);
              setLastNotificationType(
                data.type === 'low'
                  ? 'battery-low'
                  : data.type === 'high'
                    ? 'battery-full'
                    : data.type === 'critical'
                      ? 'auto-release'
                      : data.type
              );
              break;
          }
        });
      }

      // Handle page visibility changes for better background notification support
      const handleVisibilityChange = () => {
        // Handle visibility changes for better notification support
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Also listen for permission changes
      const checkPermission = () => {
        const currentPermission = Notification.permission;
        setNotificationPermission(currentPermission);
      };

      // Check permission periodically in case it changes
      const permissionInterval = setInterval(checkPermission, 1000);

      return () => {
        // Stop service worker monitoring
        if (
          'serviceWorker' in navigator &&
          navigator.serviceWorker.controller
        ) {
          navigator.serviceWorker.controller.postMessage({
            type: 'STOP_MONITORING',
          });
        }

        clearInterval(permissionInterval);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      };
    }
  }, [keepAudioContextActive, updateServiceWorkerSettings]);

  // Update service worker when settings change
  useEffect(() => {
    updateServiceWorkerSettings();
  }, [updateServiceWorkerSettings]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        return permission === 'granted';
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const enableNotifications = () => {
    setInternalNotificationsEnabled(true);
  };

  const disableNotifications = () => {
    setInternalNotificationsEnabled(false);
  };

  const enableSounds = () => {
    setInternalSoundEnabled(true);
  };

  const disableSounds = () => {
    setInternalSoundEnabled(false);
  };

  const showNotification = async (title, options = {}) => {
    const now = Date.now();
    const cooldownPeriod = getNotificationCooldown();
    const timeSinceLastNotification = now - lastNotificationTime.current;

    // Handle sound and notification separately
    const shouldPlaySound =
      internalSoundEnabled &&
      (notificationsEnabled || internalNotificationsEnabled);
    const shouldShowNotification = internalNotificationsEnabled;

    // If neither sound nor notifications are enabled, skip everything
    if (!shouldPlaySound && !shouldShowNotification) {
      return { success: false, reason: 'Both disabled by user' };
    }

    const browserPermission =
      'Notification' in window ? Notification.permission : 'denied';
    const isPermitted =
      notificationPermission === 'granted' || browserPermission === 'granted';

    if ('Notification' in window && isPermitted) {
      // Check cooldown to prevent spam (skip for test notifications)
      const now = Date.now();
      const cooldownPeriod = getNotificationCooldown();
      if (
        !options.skipCooldown &&
        now - lastNotificationTime.current < cooldownPeriod
      ) {
        return { success: false, reason: 'Blocked by cooldown' };
      }

      // Remove any actions from options to prevent the error
      const { actions, ...safeOptions } = options;

      const defaultOptions = {
        icon: '/no-sleep.svg',
        badge: '/no-sleep.svg',
        tag: 'battery-warning',
        requireInteraction: true,
        ...safeOptions,
      };

      try {

        // Handle sound separately from notifications
        let beepPromise = null;
        if (shouldPlaySound) {
          await resumeAudioContext();

          // Determine beep type based on notification content
          let beepType = 'default';
          if (title.includes('Low Battery')) {
            beepType = 'battery-low';
          } else if (
            title.includes('Battery Fully Charged') ||
            title.includes('High Battery')
          ) {
            beepType = 'battery-high';
          } else if (title.includes('Test Notification')) {
            beepType = 'test';
          }

          // Play beep sound
          beepPromise = playNotificationBeep(beepType);
        }

        let notification = null;

        // Handle notification display separately from sound
        if (shouldShowNotification) {
          // Prioritize notifications in background tabs - don't wait for audio
          const isBackgroundTab =
            document.hidden || document.visibilityState !== 'visible';

          if (isBackgroundTab) {
            // Show notification immediately in background - don't wait for audio
          } else if (beepPromise) {
            // Only wait for beep in foreground for better timing
            try {
              await Promise.race([
                beepPromise,
                new Promise(resolve => setTimeout(resolve, 1000)),
              ]);
            } catch (error) {
              // Audio timeout or error, continue silently
            }
          }

          notification = new Notification(title, defaultOptions);

          // Add event listeners to track notification behavior
          notification.onshow = () => {
            // Notification displayed
          };

          notification.onclick = () => {
            // Notification clicked
          };

          notification.onclose = () => {
            // Notification closed
          };

          notification.onerror = error => {
            // Handle notification error silently
          };
        }

        // Only update cooldown for non-test notifications
        if (!options.skipCooldown) {
          lastNotificationTime.current = now;
        }

        // Auto close notifications - longer time for background tabs
        if (notification && !defaultOptions.requireInteraction) {
          const isBackgroundTab =
            document.hidden || document.visibilityState !== 'visible';

          if (title.includes('Battery Fully Charged')) {
            // High battery notifications stay for 3 minutes (background) or 2 minutes (foreground)
            const timeout = isBackgroundTab ? 180000 : 120000;
            setTimeout(() => {
              notification.close();
            }, timeout);
          } else {
            // Other notifications: 30 seconds (background) or 10 seconds (foreground)
            const timeout = isBackgroundTab ? 30000 : 10000;
            setTimeout(() => {
              notification.close();
            }, timeout);
          }
        }



        // Check if notification was created but might be blocked by system
        if (notification) {
          setTimeout(() => {
            // Check notification status silently
          }, 1000);
        }

        // Wait for beep to complete if sound-only mode
        if (beepPromise && !shouldShowNotification) {
          await beepPromise;
        }

        // Return success indicator and notification
        return {
          success: true,
          notification,
          soundPlayed: shouldPlaySound,
          notificationShown: shouldShowNotification && notification !== null,
        };
      } catch (error) {
        return { success: false, error };
      }
    } else {
      return { success: false, reason: 'Permission denied or not supported' };
    }
  };

  const showHighBatteryWarning = async batteryLevel => {
    if (!internalSoundEnabled && !internalNotificationsEnabled) {
      return;
    }

    // Check if enough time has passed based on user's frequency setting
    if (!shouldShowBatteryNotification('high-battery')) {
      return;
    }

    const now = Date.now();
    const currentTime = new Date(now).toLocaleTimeString();
    const lastNotificationTime = lastBatteryNotificationTime.current
      ? new Date(lastBatteryNotificationTime.current).toLocaleTimeString()
      : 'Never';
    const timeSinceLastMinutes = lastBatteryNotificationTime.current
      ? ((now - lastBatteryNotificationTime.current) / (60 * 1000)).toFixed(1)
      : 'N/A';

    const title = '🔋 Battery Fully Charged';
    const body = `Battery level is ${batteryLevel}% and still charging. Consider unplugging to preserve battery health.

📅 Current Time: ${currentTime}
🕒 Last Notification: ${lastNotificationTime}
⏱️ Time Since Last: ${timeSinceLastMinutes} minutes
🔄 Frequency Setting: ${frequencyMinutes} minute(s)`;

    const result = await showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: `battery-high-${now}`, // Use unique tag like test notifications
      requireInteraction: false, // Same as working test notifications
      skipCooldown: true, // Skip the general cooldown since we handle frequency ourselves
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('battery-full');
      lastBatteryNotificationTime.current = now; // Update battery notification timestamp
    }
  };

  const showTestNotification = async () => {
    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🧪 Test Notification';
    const body = `This is a test notification to verify that notifications are working properly!\n\nTriggered at: ${timestamp}`;

    const result = await showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: `test-notification-${now}`, // Unique tag each time
      requireInteraction: false,
      skipCooldown: true,
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('test');
    }
  };

  return {
    notificationPermission,
    notificationsEnabled: internalNotificationsEnabled,
    soundEnabled: internalSoundEnabled,
    requestPermission,
    enableNotifications,
    disableNotifications,
    enableSounds,
    disableSounds,
    showNotification,
    showHighBatteryWarning,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    sendBatteryUpdateToSW,
    testServiceWorker,
    serviceWorkerStatus,
    isSupported: 'Notification' in window,
  };
};
