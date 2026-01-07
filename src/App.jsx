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
        <Battery
          level={level}
          charging={charging}
          isSupported={batterySupported}
          getBatteryColor={getBatteryColor}
        />

        <WakeLock
          isActive={isActive}
          isSupported={isSupported}
          error={error}
          selectedTimer={selectedTimer}
          formatTimeRemaining={formatTimeRemaining}
          startTimer={startTimer}
        />

        <History history={history} formatDuration={formatDuration} />
      </section>
    </main>
  );
}

export default App;
