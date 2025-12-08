import { useState, useEffect, useRef } from 'react';

export const useNotifications = (frequencyMinutes = 5) => {
  const [notificationPermission, setNotificationPermission] =
    useState('default');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lastNotificationTimestamp, setLastNotificationTimestamp] =
    useState(null);
  const [lastNotificationType, setLastNotificationType] = useState(null);
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

  // Check and request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);

      // Also listen for permission changes
      const checkPermission = () => {
        const currentPermission = Notification.permission;
        setNotificationPermission(currentPermission);
        console.log('Notification permission updated:', currentPermission);
      };

      // Check permission periodically in case it changes
      const permissionInterval = setInterval(checkPermission, 1000);

      return () => clearInterval(permissionInterval);
    }
  }, []);

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
    setNotificationsEnabled(true);
    console.log('🔔 Notifications enabled');
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    console.log('🔕 Notifications disabled');
  };

  const showNotification = (title, options = {}) => {
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

    // Check if notifications are enabled, supported and permitted (check both hook state and browser state)
    if (!notificationsEnabled) {
      console.log('🔕 Notifications disabled by user - skipping notification');
      return;
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

        const notification = new Notification(title, defaultOptions);

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

        // Auto close notifications after 10 seconds, but give high battery notifications much more time
        if (!defaultOptions.requireInteraction) {
          if (title.includes('Battery Fully Charged')) {
            // High battery notifications stay for 2 minutes (120 seconds)
            setTimeout(() => {
              notification.close();
              console.log(
                '🔕 Auto-closed notification after 2 minutes:',
                title
              );
            }, 120000);
            console.log(
              '🔋 High battery notification will auto-close in 2 minutes'
            );
          } else {
            // Other notifications auto-close after 10 seconds
            setTimeout(() => {
              notification.close();
              console.log('🔕 Auto-closed notification:', title);
            }, 10000);
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
        setTimeout(() => {
          if (notification.title) {
            console.log('🔔 Notification object still exists after 1 second');
          } else {
            console.warn(
              '⚠️ Notification object seems to have been blocked or removed'
            );
          }
        }, 1000);

        // Return success indicator and notification
        return { success: true, notification };
      } catch (error) {
        console.error('❌ NOTIFICATION CREATION FAILED:', {
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

  const showBatteryWarning = batteryLevel => {
    if (!notificationsEnabled) {
      console.log('🔕 Battery warning skipped - notifications disabled');
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

    const result = showNotification(title, {
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

  const showHighBatteryWarning = batteryLevel => {
    if (!notificationsEnabled) {
      console.log('🔕 High battery warning skipped - notifications disabled');
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

    const result = showNotification(title, {
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

  const showAutoReleaseNotification = batteryLevel => {
    if (!notificationsEnabled) {
      console.log(
        '🔕 Auto-release notification skipped - notifications disabled'
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

    const result = showNotification(title, {
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

  const showTestNotification = () => {
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

    const result = showNotification(title, {
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
    notificationsEnabled,
    requestPermission,
    enableNotifications,
    disableNotifications,
    showNotification,
    showBatteryWarning,
    showHighBatteryWarning,
    showAutoReleaseNotification,
    showTestNotification,
    lastNotificationTimestamp,
    lastNotificationType,
    formatTimestamp,
    isSupported: 'Notification' in window,
  };
};
