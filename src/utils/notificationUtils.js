// Notification utility functions

/**
 * Request notification permission and execute callback if granted
 * @param {Function} callback - Function to execute when permission is granted
 * @param {Object} options - Configuration options
 * @param {boolean} options.showAlerts - Whether to show alert messages for blocked/unsupported notifications
 * @returns {Promise<boolean>} - Returns true if permission granted, false otherwise
 */
export const requestNotificationPermission = async (callback, options = {}) => {
  const { showAlerts = true } = options;

  // Check if browser supports notifications
  if (!('Notification' in window)) {
    if (showAlerts) {
      alert('This browser does not support notifications.');
    }
    console.warn('Notifications not supported in this browser');
    return false;
  }

  // Check current permission status
  if (Notification.permission === 'granted') {
    // Permission already granted, execute callback
    if (callback) callback();
    return true;
  } else if (Notification.permission === 'denied') {
    // Permission denied
    if (showAlerts) {
      alert(
        'Notifications are blocked. Please enable them in your browser settings.'
      );
    }
    console.warn('Notification permission denied');
    return false;
  } else {
    // Permission not yet requested, ask for it
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission result:', permission);

      if (permission === 'granted') {
        // Permission granted, execute callback
        if (callback) callback();
        return true;
      } else {
        // Permission denied after request
        if (showAlerts) {
          alert(
            'Notification permission was denied. You can enable it later in your browser settings.'
          );
        }
        console.warn('Notification permission denied by user');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      if (showAlerts) {
        alert('Failed to request notification permission.');
      }
      return false;
    }
  }
};

/**
 * Check if notifications are supported and permitted
 * @returns {Object} - Object containing support and permission status
 */
export const getNotificationStatus = () => {
  return {
    supported: 'Notification' in window,
    permission:
      'Notification' in window ? Notification.permission : 'unsupported',
    granted: 'Notification' in window && Notification.permission === 'granted',
    denied: 'Notification' in window && Notification.permission === 'denied',
    default: 'Notification' in window && Notification.permission === 'default',
  };
};

/**
 * Request notification permission without executing callback
 * Useful for initial setup or settings screens
 * @param {Object} options - Configuration options
 * @returns {Promise<boolean>} - Returns true if permission granted, false otherwise
 */
export const requestNotificationPermissionOnly = async (options = {}) => {
  return await requestNotificationPermission(null, options);
};
