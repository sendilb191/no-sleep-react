import './History.less';
import { FaHistory } from 'react-icons/fa';

function History({ history, formatDuration }) {
  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalTime = history.reduce((sum, session) => sum + session.duration, 0);

  return (
    <article className='card history-card'>
      <h2 className='card-title'>
        <FaHistory /> Recent Sessions
      </h2>
      <div className='card-content'>
        {history.length > 0 && (
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
