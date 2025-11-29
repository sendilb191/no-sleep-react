import React from 'react';
import './ToggleButton.less';

const ToggleButton = props => {
  const { isToggled, onToggle, ...restProps } = props;
  return (
    <button
      className={`toggle-button ${isToggled ? 'active' : 'inactive'}`}
      onClick={onToggle}
      {...restProps}
    >
      <div className='toggle-slider'>
        <div className='toggle-thumb'></div>
      </div>
    </button>
  );
};

export default ToggleButton;
