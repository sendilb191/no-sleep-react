import './ToggleButton.less';

function ToggleButton({
  isActive = false,
  onToggle,
  activeLabel = 'ON',
  inactiveLabel = 'OFF',
  disabled = false,
  isLoading = false,
  size = 'medium',
}) {
  const handleClick = () => {
    if (!disabled && !isLoading && onToggle) {
      onToggle(!isActive);
    }
  };

  return (
    <button
      className={`toggle-button ${isActive ? 'active' : 'inactive'} ${size} ${disabled || isLoading ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      type='button'
    >
      <span className='toggle-track'>
        <span className={`toggle-thumb ${isLoading ? 'loading' : ''}`} />
      </span>
    </button>
  );
}

export default ToggleButton;
