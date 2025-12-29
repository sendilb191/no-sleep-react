import './StatusDot.less';

/**
 * StatusDot - A reusable status indicator component
 * @param {boolean} isActive - Whether the status is active (green) or inactive (red)
 * @param {string} size - Size variant: 'sm' (8px), 'md' (12px), 'lg' (16px) - default: 'md'
 */
const StatusDot = ({ isActive, size = 'md' }) => {
  return (
    <div className={`status-dot-container status-dot--${size}`}>
      <div className={`status-dot ${isActive ? 'active' : 'inactive'}`}></div>
    </div>
  );
};

export default StatusDot;
