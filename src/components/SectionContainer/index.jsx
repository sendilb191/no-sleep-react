import React from 'react';
import './SectionContainer.less';

const SectionContainer = ({ title, icon, status, className = '' }) => {
  return (
    <div className={`section-card ${className}`}>
      <div className='section-main'>
        <div className='section-header'>
          <div className='section-title'>
            <h3>{title}</h3>
          </div>
        </div>
        {icon}
      </div>
      {status}
    </div>
  );
};

export default SectionContainer;
