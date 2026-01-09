import './History.less';
import { FaHistory } from 'react-icons/fa';
import { useState, useEffect } from 'react';

function History({ history, formatDuration, getCurrentSessionTime, isActive }) {
  const [currentSessionTime, setCurrentSessionTime] = useState(0);

  // Update current session time every second when active
  useEffect(() => {
    if (!isActive) {
      setCurrentSessionTime(0);
      return;
    }

    // Update immediately
    setCurrentSessionTime(getCurrentSessionTime());

    // Then update every second
    const interval = setInterval(() => {
      setCurrentSessionTime(getCurrentSessionTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, getCurrentSessionTime]);

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Total time from completed sessions
  const completedSessionsTime = history.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  // Total time including current session
  const totalTime = completedSessionsTime + currentSessionTime;

  return (
    <article className='card history-card'>
      <h2 className='card-title'>
        <FaHistory /> Recent Sessions
      </h2>
      <div className='card-content'>
        {isActive && (
          <p className='current-session-time'>
            Current Session: {formatDuration(currentSessionTime)}
          </p>
        )}
        {(history.length > 0 || currentSessionTime > 0) && (
          <p className='total-time'>Total: {formatDuration(totalTime)}</p>
        )}

        {history.length === 0 ? (
          <p className='no-history'>No sessions recorded yet</p>
        ) : (
          <div className='history-table-wrapper'>
            <table className='history-table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {history.map(session => (
                  <tr key={session.id}>
                    <td>{formatDate(session.startTime)}</td>
                    <td>{formatDuration(session.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
}

export default History;
