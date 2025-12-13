import React from 'react';
import './StatusDot.less';

const StatusDot = ({ isActive }) => {
  return (
    <div className='status-dot-container'>
      <div className={`status-dot ${isActive ? 'active' : 'inactive'}`}></div>
    </div>
  );
};

export default StatusDot;
