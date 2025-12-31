import './App.less';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import WakeLock from './components/WakeLock/WakeLock';
import Battery from './components/Battery/Battery';

function App() {
  const { isActive, isSupported, error, userWantsWakeLock, toggleWakeLock } =
    useWakeLock();
  const {
    level,
    charging,
    isSupported: batterySupported,
    getBatteryColor,
  } = useBattery();

  return (
    <main className='app'>
      <header className='header'>
        <h1>🔒 Wake Lock App</h1>
        <p className='subtitle'>Keep your screen awake</p>
      </header>

      <section className='cards-container'>
        <WakeLock
          isActive={isActive}
          isSupported={isSupported}
          error={error}
          userWantsWakeLock={userWantsWakeLock}
          toggleWakeLock={toggleWakeLock}
        />

        <Battery
          level={level}
          charging={charging}
          isSupported={batterySupported}
          getBatteryColor={getBatteryColor}
        />
      </section>
    </main>
  );
}

export default App;
