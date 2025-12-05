import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
    <div className='error-message'>
      <FiAlertCircle />
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;
