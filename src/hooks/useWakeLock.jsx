import { useState, useEffect } from 'react';

const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setIsActive(true);
        console.log('Wake Lock activated');
      } else {
        alert('Wake Lock API is not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to activate Wake Lock:', error);
      alert('Failed to activate Wake Lock');
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
      setIsActive(false);
      console.log('Wake Lock released');
    }
  };

  const handleToggle = () => {
    if (isActive) {
      releaseWakeLock();
    } else {
      requestWakeLock();
    }
  };

  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  return {
    isActive,
    requestWakeLock,
    releaseWakeLock,
    handleToggle,
  };
};

export default useWakeLock;
