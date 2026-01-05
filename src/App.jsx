import './App.less';
import { FaLock } from 'react-icons/fa';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import WakeLock from './components/WakeLock/WakeLock';
import Battery from './components/Battery/Battery';
import History from './components/History/History';

function App() {
  const {
    isActive,
    isSupported,
    error,
    selectedTimer,
    formatTimeRemaining,
    startTimer,
    history,
    formatDuration,
    clearHistory,
  } = useWakeLock();
  const {
    level,
    charging,
    isSupported: batterySupported,
    getBatteryColor,
  } = useBattery();

  return (
    <main className='app'>
      <header className='header'>
        <h1>
          <FaLock /> Wake Lock App
        </h1>
        <p className='subtitle'>Keep your screen awake</p>
      </header>

      <section className='cards-container'>
        <WakeLock
          isActive={isActive}
          isSupported={isSupported}
          error={error}
          selectedTimer={selectedTimer}
          formatTimeRemaining={formatTimeRemaining}
          startTimer={startTimer}
        />

        <Battery
          level={level}
          charging={charging}
          isSupported={batterySupported}
          getBatteryColor={getBatteryColor}
        />

        <History
          history={history}
          formatDuration={formatDuration}
          clearHistory={clearHistory}
        />
      </section>
    </main>
  );
}

export default App;
