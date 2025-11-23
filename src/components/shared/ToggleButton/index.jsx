import './ToggleButton.less';

function ToggleButton({
  isActive = false,
  onToggle,
  activeLabel = 'ON',
  inactiveLabel = 'OFF',
  disabled = false,
  size = 'medium',
}) {
  const handleClick = () => {
    if (!disabled && onToggle) {
      onToggle(!isActive);
    }
  };

  return (
    <button
      className={`toggle-button ${isActive ? 'active' : 'inactive'} ${size} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      type='button'
    >
      <span className='toggle-track'>
        <span className='toggle-thumb' />
      </span>
    </button>
  );
}

export default ToggleButton;
