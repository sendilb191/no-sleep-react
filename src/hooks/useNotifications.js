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
    console.log('Calculating notification cooldown:', {
      frequencyMinutes,
      cooldown,
    });
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

    console.log('🔋 BATTERY NOTIFICATION FREQUENCY CHECK:', {
      notificationType,
      timeSinceLastMs: timeSinceLastBatteryNotification,
      timeSinceLastMinutes: timeSinceLastBatteryNotification / (60 * 1000),
      frequencyRequiredMs: frequencyMs,
      frequencyRequiredMinutes: frequencyMinutes,
      bufferMs,
      shouldShow,
      lastBatteryNotificationTime: lastBatteryNotificationTime.current
        ? new Date(lastBatteryNotificationTime.current).toLocaleTimeString()
        : 'Never',
    });

    return shouldShow;
  };

  // Log when frequency changes
  useEffect(() => {
    console.log(
      'useNotifications: frequency changed to',
      frequencyMinutes,
      'minutes'
    );
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
      console.log(
        `🔧 Updating SW settings - frequency: ${frequencyMinutes}min`
      );
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
    console.log(`🧪 Testing Service Worker with ${delaySeconds}s delay...`);

    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        console.log('✅ Service Worker controller available');
        try {
          navigator.serviceWorker.controller.postMessage({
            type: 'SW_TEST',
            data: { delay: delaySeconds },
          });
          console.log('✅ Message sent to Service Worker');

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
          console.error('❌ Failed to send message to Service Worker:', error);
          return false;
        }
      } else {
        console.warn('⚠️ Service Worker controller not available');
        console.log('SW registration state:', navigator.serviceWorker.ready);
        return false;
      }
    } else {
      console.warn('❌ Service Worker not supported');
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
            console.log('Service Worker registered with battery monitoring');
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
            console.log('Service Worker registration failed:', err);
            setServiceWorkerStatus('failed');
          });

        // Initialize service worker
        const initializeServiceWorker = () => {
          if (navigator.serviceWorker.controller) {
            console.log('Initializing Service Worker...');
            navigator.serviceWorker.controller.postMessage({
              type: 'START_MONITORING',
            });
            updateServiceWorkerSettings();
          } else {
            console.log('Service Worker controller not ready, waiting...');
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
              console.log('SW requested wake lock release:', data);
              break;
            case 'SW_BATTERY_UPDATE':
              console.log('SW battery update:', data);
              break;
            case 'SW_TEST_SCHEDULED':
              console.log('SW test scheduled:', data);
              break;
            case 'SW_TEST_COMPLETED':
              console.log('SW test completed:', data);
              if (data.success) {
                // Play audio notification for successful test
                playNotificationBeep('test');
              }
              break;
            case 'NOTIFICATION_SENT':
              console.log('SW sent notification:', data);
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
        if (document.visibilityState === 'visible') {
          console.log(
            '📱 Tab became visible - notifications will work normally'
          );
        } else {
          console.log(
            '📱 Tab became hidden - using background notification mode'
          );
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Also listen for permission changes
      const checkPermission = () => {
        const currentPermission = Notification.permission;
        setNotificationPermission(currentPermission);
        console.log('Notification permission updated:', currentPermission);
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
        console.warn('Error requesting notification permission:', error);
        return false;
      }
    }
    return false;
  };

  const enableNotifications = () => {
    setInternalNotificationsEnabled(true);
    console.log('🔔 Notifications enabled');
  };

  const disableNotifications = () => {
    setInternalNotificationsEnabled(false);
    console.log('🔕 Notifications disabled');
  };

  const enableSounds = () => {
    setInternalSoundEnabled(true);
    console.log('🔊 Sounds enabled');
  };

  const disableSounds = () => {
    setInternalSoundEnabled(false);
    console.log('🔇 Sounds disabled');
  };

  const showNotification = async (title, options = {}) => {
    const now = Date.now();
    const cooldownPeriod = getNotificationCooldown();
    const timeSinceLastNotification = now - lastNotificationTime.current;

    console.log('🔔 NOTIFICATION CHECK STARTED:', {
      title,
      timestamp: new Date(now).toLocaleTimeString(),
      options,
      frequencyMinutes,
      cooldownPeriodMs: cooldownPeriod,
      cooldownPeriodMinutes: cooldownPeriod / (60 * 1000),
      timeSinceLastNotificationMs: timeSinceLastNotification,
      timeSinceLastNotificationMinutes: timeSinceLastNotification / (60 * 1000),
      lastNotificationTime: lastNotificationTime.current
        ? new Date(lastNotificationTime.current).toLocaleTimeString()
        : 'Never',
    });

    // Handle sound and notification separately
    const shouldPlaySound =
      internalSoundEnabled &&
      (notificationsEnabled || internalNotificationsEnabled);
    const shouldShowNotification = internalNotificationsEnabled;

    console.log('🎚️ SOUND & NOTIFICATION SETTINGS:', {
      soundEnabled: internalSoundEnabled,
      notificationsEnabled: internalNotificationsEnabled,
      shouldPlaySound,
      shouldShowNotification,
    });

    // If neither sound nor notifications are enabled, skip everything
    if (!shouldPlaySound && !shouldShowNotification) {
      console.log(
        '🔕 Both sound and notifications disabled by user - skipping'
      );
      return { success: false, reason: 'Both disabled by user' };
    }

    const browserPermission =
      'Notification' in window ? Notification.permission : 'denied';
    const isPermitted =
      notificationPermission === 'granted' || browserPermission === 'granted';

    console.log('🔐 PERMISSION CHECK:', {
      notificationSupported: 'Notification' in window,
      hookPermission: notificationPermission,
      browserPermission,
      isPermitted,
    });

    if ('Notification' in window && isPermitted) {
      // Check cooldown to prevent spam (skip for test notifications)
      const now = Date.now();
      const cooldownPeriod = getNotificationCooldown();
      if (
        !options.skipCooldown &&
        now - lastNotificationTime.current < cooldownPeriod
      ) {
        console.log('❌ NOTIFICATION BLOCKED BY COOLDOWN:', {
          title,
          reason: 'Frequency limit exceeded',
          timeSinceLastNotification: now - lastNotificationTime.current,
          timeSinceLastNotificationMinutes:
            (now - lastNotificationTime.current) / (60 * 1000),
          cooldownPeriod,
          cooldownPeriodMinutes: cooldownPeriod / (60 * 1000),
          frequencyMinutes,
          timeUntilNextAllowed:
            cooldownPeriod - (now - lastNotificationTime.current),
          timeUntilNextAllowedMinutes:
            (cooldownPeriod - (now - lastNotificationTime.current)) /
            (60 * 1000),
          nextNotificationAllowedAt: new Date(
            lastNotificationTime.current + cooldownPeriod
          ).toLocaleTimeString(),
        });
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
        console.log('📤 CREATING NOTIFICATION:', {
          title,
          options: defaultOptions,
          willUpdateCooldown: !options.skipCooldown,
          skipCooldown: !!options.skipCooldown,
        });

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
          console.log(
            '🔊 Playing notification sound:',
            beepType,
            'Tab visible:',
            !document.hidden
          );
          beepPromise = playNotificationBeep(beepType);
        }

        let notification = null;

        // Handle notification display separately from sound
        if (shouldShowNotification) {
          // Prioritize notifications in background tabs - don't wait for audio
          const isBackgroundTab =
            document.hidden || document.visibilityState !== 'visible';

          if (isBackgroundTab) {
            console.log(
              '🔔 Background mode: Showing notification immediately (audio may be restricted)'
            );
            // Show notification immediately in background - don't wait for audio
          } else if (beepPromise) {
            // Only wait for beep in foreground for better timing
            try {
              await Promise.race([
                beepPromise,
                new Promise(resolve => setTimeout(resolve, 1000)),
              ]);
            } catch (error) {
              console.warn(
                'Audio timeout or error, continuing with notification:',
                error
              );
            }
          }

          notification = new Notification(title, defaultOptions);

          // Add event listeners to track notification behavior
          notification.onshow = () => {
            console.log('🔔 Notification actually displayed:', title);
          };

          notification.onclick = () => {
            console.log('👆 Notification clicked:', title);
          };

          notification.onclose = () => {
            console.log('❌ Notification closed:', title);
          };

          notification.onerror = error => {
            console.error('⚠️ Notification error:', title, error);
          };
        }

        // Only update cooldown for non-test notifications
        if (!options.skipCooldown) {
          lastNotificationTime.current = now;
          console.log('⏱️ COOLDOWN UPDATED:', {
            newLastNotificationTime: new Date(now).toLocaleTimeString(),
            nextNotificationAllowedAt: new Date(
              now + cooldownPeriod
            ).toLocaleTimeString(),
            cooldownPeriodMinutes: cooldownPeriod / (60 * 1000),
          });
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
              console.log('🔕 Auto-closed high battery notification:', title);
            }, timeout);
          } else {
            // Other notifications: 30 seconds (background) or 10 seconds (foreground)
            const timeout = isBackgroundTab ? 30000 : 10000;
            setTimeout(() => {
              notification.close();
              console.log('🔕 Auto-closed notification:', title);
            }, timeout);
          }
        }

        console.log('✅ NOTIFICATION SENT SUCCESSFULLY:', {
          title,
          timestamp: new Date(now).toLocaleTimeString(),
          tag: defaultOptions.tag,
          requireInteraction: defaultOptions.requireInteraction,
          autoClose:
            !defaultOptions.requireInteraction &&
            !title.includes('Battery Fully Charged'),
          notificationObject: notification,
          browserInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
          },
        });

        // Check if notification was created but might be blocked by system
        if (notification) {
          setTimeout(() => {
            if (notification.title) {
              console.log('🔔 Notification object still exists after 1 second');
            } else {
              console.warn(
                '⚠️ Notification object seems to have been blocked or removed'
              );
            }
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
        console.error('❌ NOTIFICATION/SOUND FAILED:', {
          title,
          error: error.message,
          errorDetails: error,
          timestamp: new Date().toLocaleTimeString(),
        });
        return { success: false, error };
      }
    } else {
      const browserPermission =
        'Notification' in window ? Notification.permission : 'denied';
      console.log('❌ NOTIFICATION REJECTED:', {
        title,
        reason: 'Permission or support issue',
        details: {
          notificationSupported: 'Notification' in window,
          hookPermission: notificationPermission,
          browserPermission: browserPermission,
          isPermitted,
          specificReason: !('Notification' in window)
            ? 'Notifications not supported by browser'
            : `Permission denied - Hook: ${notificationPermission}, Browser: ${browserPermission}`,
        },
        timestamp: new Date().toLocaleTimeString(),
      });
      return { success: false, reason: 'Permission denied or not supported' };
    }
  };

  const showBatteryWarning = async batteryLevel => {
    if (!internalSoundEnabled && !internalNotificationsEnabled) {
      console.log(
        '🔕 Battery warning skipped - both sound and notifications disabled'
      );
      return;
    }

    console.log('🔋 LOW BATTERY WARNING TRIGGERED:', {
      batteryLevel: batteryLevel + '%',
      trigger: 'Battery < 30% and not charging',
      timestamp: new Date().toLocaleTimeString(),
    });

    // Check if enough time has passed based on user's frequency setting
    if (!shouldShowBatteryNotification('low-battery')) {
      console.log('🔋 Low battery notification skipped due to frequency limit');
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

    const title = '🔋 Low Battery Warning';
    const body = `Battery level is ${batteryLevel}% and not charging. Consider connecting your charger.

📅 Current Time: ${currentTime}
🕒 Last Notification: ${lastNotificationTime}
⏱️ Time Since Last: ${timeSinceLastMinutes} minutes
🔄 Frequency Setting: ${frequencyMinutes} minute(s)`;

    const result = await showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: `battery-low-${now}`, // Use unique tag
      requireInteraction: false,
      skipCooldown: true, // Skip cooldown since we handle frequency ourselves
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('battery');
      lastBatteryNotificationTime.current = now; // Update battery notification timestamp
      console.log(
        '✅ Low battery notification sent successfully - next allowed at:',
        new Date(now + frequencyMinutes * 60 * 1000).toLocaleTimeString()
      );
    } else {
      console.log('❌ Low battery notification failed:', result);
    }
  };

  const showHighBatteryWarning = async batteryLevel => {
    if (!internalSoundEnabled && !internalNotificationsEnabled) {
      console.log(
        '🔕 High battery warning skipped - both sound and notifications disabled'
      );
      return;
    }

    console.log('🔋 HIGH BATTERY WARNING TRIGGERED:', {
      batteryLevel: batteryLevel + '%',
      trigger: 'Battery > 90% and charging',
      timestamp: new Date().toLocaleTimeString(),
      willRespectFrequency: true,
    });

    // Check if enough time has passed based on user's frequency setting
    if (!shouldShowBatteryNotification('high-battery')) {
      console.log(
        '🔋 High battery notification skipped due to frequency limit'
      );
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

    console.log('📱 Attempting to show high battery notification:', {
      batteryLevel,
      permission: notificationPermission,
      currentTime,
      frequencyMinutes,
      willBypassCooldown: true, // Skip cooldown since we handle frequency ourselves
    });

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
      console.log(
        '✅ High battery notification sent successfully - next allowed at:',
        new Date(now + frequencyMinutes * 60 * 1000).toLocaleTimeString()
      );
    } else {
      console.log('❌ High battery notification failed:', result);
    }
  };

  const showAutoReleaseNotification = async batteryLevel => {
    if (!internalSoundEnabled && !internalNotificationsEnabled) {
      console.log(
        '🔕 Auto-release notification skipped - both sound and notifications disabled'
      );
      return;
    }

    console.log('🔒 AUTO-RELEASE NOTIFICATION TRIGGERED:', {
      batteryLevel: batteryLevel + '%',
      trigger: 'Critical battery - wake lock auto-released',
      timestamp: new Date().toLocaleTimeString(),
      willBypassCooldown: true,
      priority: 'HIGH - Critical system notification',
    });

    const now = Date.now();
    const timestamp = new Date(now).toLocaleTimeString();
    const title = '🔒 Wake Lock Auto-Released';
    const body = `Wake lock automatically released due to critical battery level (${batteryLevel}%) to preserve battery life.\n\nTriggered at: ${timestamp}`;

    const result = await showNotification(title, {
      body,
      icon: '/no-sleep.svg',
      tag: 'auto-release',
      requireInteraction: false,
      skipCooldown: true, // Always show this important notification
    });

    // Only update timestamp tracking if notification was successful
    if (result && result.success) {
      setLastNotificationTimestamp(now);
      setLastNotificationType('auto-release');
      console.log('Auto-release notification sent successfully');
    } else {
      console.log('Auto-release notification failed:', result);
    }
  };

  const showTestNotification = async () => {
    console.log('🧪 TEST NOTIFICATION TRIGGERED:', {
      trigger: 'User requested test notification',
      timestamp: new Date().toLocaleTimeString(),
      willBypassCooldown: true,
      purpose: 'Testing notification functionality',
    });

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
      console.log('Test notification sent successfully');
    } else {
      console.log('Test notification failed:', result);
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
    showBatteryWarning,
    showHighBatteryWarning,
    showAutoReleaseNotification,
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
