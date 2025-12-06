import React from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './WakeIcon.less';

const WakeIcon = ({ isActive }) => {
  return (
    <div className='wake-icon-display'>
      <div className={`wake-visual ${isActive ? 'active' : 'inactive'}`}>
        <div className='wake-center'>
          <div className={`wake-icon ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? <FiEye /> : <FiEyeOff />}
          </div>
          <div className='wake-pulse-ring'></div>
        </div>
      </div>
      <div className={`wake-status-text ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};

export default WakeIcon;
