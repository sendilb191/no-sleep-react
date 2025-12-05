import React from 'react';

const Instructions = () => {
  return (
    <div className='instructions'>
      <h3>How it works:</h3>
      <ul>
        <li>Uses the modern Screen Wake Lock API when available</li>
        <li>Falls back to alternative methods for older browsers</li>
        <li>Automatically reactivates when you return to the tab</li>
        <li>Works best when the tab is active and visible</li>
        <li>Monitor battery level to prevent unexpected shutdowns</li>
        <li>Get alerts when wake lock may impact battery life</li>
      </ul>
    </div>
  );
};

export default Instructions;
