import './History.less';

function History({ history, formatDuration, clearHistory }) {
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
      <header className='history-header'>
        <h2 className='card-title'>📜 Recent Sessions</h2>
        {history.length > 0 && (
          <button className='clear-btn' onClick={clearHistory}>
            Clear
          </button>
        )}
      </header>
      <div className='card-content'>
        {history.length > 0 && (
          <p className='total-time'>Total: {formatDuration(totalTime)}</p>
        )}

        {history.length === 0 ? (
          <p className='no-history'>No sessions recorded yet</p>
        ) : (
          <ul className='history-list'>
            {history.map(session => (
              <li key={session.id} className='history-item'>
                <time className='session-date'>
                  {formatDate(session.startTime)}
                </time>
                <data className='session-duration'>
                  {formatDuration(session.duration)}
                </data>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default History;
