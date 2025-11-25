import { useState, useRef, useEffect } from 'react';
import './CustomDropdown.less';

function CustomDropdown({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef(null);

  // Find the selected option label
  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    setSelectedLabel(selectedOption ? selectedOption.label : placeholder);
  }, [value, options, placeholder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = event => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Focus next option logic can be added here
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          // Focus previous option logic can be added here
        }
        break;
    }
  };

  const handleOptionSelect = optionValue => {
    if (disabled) return;

    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`custom-dropdown ${className} ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
    >
      <div
        id={id}
        className='dropdown-trigger'
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <span className='dropdown-value'>{selectedLabel}</span>
        <span className='dropdown-arrow'>
          <svg width='12' height='8' viewBox='0 0 12 8' fill='none'>
            <path
              d='M1 1L6 6L11 1'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className='dropdown-menu' role='listbox'>
          {options.map(option => (
            <div
              key={option.value}
              className={`dropdown-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.value)}
              role='option'
              aria-selected={value === option.value}
            >
              {option.label}
              {option.description && (
                <span className='option-description'>{option.description}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
