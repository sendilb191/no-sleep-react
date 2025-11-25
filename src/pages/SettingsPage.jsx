import { useEffect, useState } from 'react';
import ToggleButton from '../components/shared/ToggleButton';
import CustomDropdown from '../components/shared/CustomDropdown';
import './SettingsPage.less';

function SettingsPage({ wakeLock }) {
  const [autoEnable, setAutoEnable] = useState(false);
  const [fallbackMethod, setFallbackMethod] = useState('video');

  // Use wake lock state from props
  const {
    isWakeLockEnabled,
    wakeLockSupported,
    wakeLockStatus,
    toggleWakeLock,
  } = wakeLock;

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAutoEnable =
      localStorage.getItem('nosleep-auto-enable') === 'true';
    const savedFallbackMethod =
      localStorage.getItem('nosleep-fallback') || 'video';

    setAutoEnable(savedAutoEnable);
    setFallbackMethod(savedFallbackMethod);
  }, []);

  const handleAutoEnableChange = enabled => {
    setAutoEnable(enabled);
    localStorage.setItem('nosleep-auto-enable', enabled.toString());
  };

  const handleFallbackMethodChange = method => {
    setFallbackMethod(method);
    localStorage.setItem('nosleep-fallback', method);
  };

  const resetSettings = () => {
    setAutoEnable(false);
    setFallbackMethod('video');

    localStorage.removeItem('nosleep-auto-enable');
    localStorage.removeItem('nosleep-fallback');
  };

  return (
    <div className='page settings-page'>
      <div className='page-header'>
        <h1>Settings</h1>
        <p className='page-description'>
          Configure your wake lock preferences and behavior.
        </p>
      </div>

      <div className='github-section compact-settings'>
        <div className='section-header'>
          <h3>Configuration</h3>
        </div>
        <div className='section-body'>
          <div className='setting-row'>
            <div className='setting-info'>
              <p className='setting-title'>
                Auto-enable wake lock on page load
              </p>
            </div>
            <div className='setting-control'>
              <input
                id='auto-enable'
                type='checkbox'
                checked={autoEnable}
                onChange={e => handleAutoEnableChange(e.target.checked)}
                className='form-checkbox'
              />
            </div>
          </div>

          <div className='setting-row'>
            <div className='setting-info'>
              <p className='setting-title'>Wake Lock Control</p>
              <p className='setting-description'>
                {wakeLockStatus} •{' '}
                {wakeLockSupported ? 'Native API' : 'Video Fallback'}
              </p>
            </div>
            <div className='setting-control'>
              <ToggleButton
                isActive={isWakeLockEnabled}
                onToggle={toggleWakeLock}
                activeLabel='🔓 Release'
                inactiveLabel='🔒 Enable'
                size='medium'
              />
            </div>
          </div>

          <div className='setting-row'>
            <div className='setting-info'>
              <p className='setting-title'>Fallback Method</p>
              <p className='setting-description'>
                Choose how to prevent screen sleep when Wake Lock API is not
                supported
              </p>
            </div>
            <div className='setting-control'>
              <CustomDropdown
                id='fallback-select'
                value={fallbackMethod}
                onChange={handleFallbackMethodChange}
                options={[
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
                ]}
                placeholder='Select fallback method'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h3>Actions</h3>
        </div>
        <div className='section-body'>
          <div className='action-buttons'>
            <button onClick={resetSettings} className='btn btn-outline'>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
