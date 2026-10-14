import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PcThermalEngine } from './utils/physicsEngine';
import { audioAlert } from './utils/audioAlert';
import { 
  SimulationMode, 
  LoadProfile, 
  TelemetryPoint, 
  SystemLogEntry, 
  FanCurvePoint 
} from './types/thermal';
import { Header } from './components/Header';
import { Sidebar, ActiveNavTab } from './components/Sidebar';
import { DataCards } from './components/DataCards';
import { ThermalSimulationPanel } from './components/ThermalSimulationPanel';
import { ComponentLayoutSchematic } from './components/ComponentLayoutSchematic';
import { FooterBar } from './components/FooterBar';
import { PidParametersView } from './components/views/PidParametersView';
import { FanCurvesView } from './components/views/FanCurvesView';
import { SimulationSetupView } from './components/views/SimulationSetupView';
import { SystemLogsView } from './components/views/SystemLogsView';
import { AiThermalAdvisorModal } from './components/AiThermalAdvisorModal';

export default function App() {
  // Theme State: 'dark' or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pc_thermal_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  // Sound Alert State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => audioAlert.isSoundEnabled());
  const [soundAlertThreshold, setSoundAlertThreshold] = useState<number>(70);

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('Dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Initialize Thermodynamic Physics Engine
  const engineRef = useRef<PcThermalEngine>(new PcThermalEngine());
  const engine = engineRef.current;

  // React State mirrors of Simulation parameters
  const [time, setTime] = useState<number>(120.0);
  const [cpuTemp, setCpuTemp] = useState<number>(38.0);
  const [gpuTemp, setGpuTemp] = useState<number>(42.0);
  const [ramTemp, setRamTemp] = useState<number>(42.0);
  const [ambientTemp, setAmbientTemp] = useState<number>(24.0);
  const [fanRpm, setFanRpm] = useState<number>(1450.0);
  const [fanPwm, setFanPwm] = useState<number>(54.0);
  const [targetTemp, setTargetTemp] = useState<number>(40.0);
  const [mode, setMode] = useState<SimulationMode>('Auto');
  const [loadProfile, setLoadProfile] = useState<LoadProfile>('Normal' as any);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<string[]>([]);

  // PID Parameters
  const [pidKp, setPidKp] = useState<number>(2.4);
  const [pidKi, setPidKi] = useState<number>(0.15);
  const [pidKd, setPidKd] = useState<number>(1.1);
  const [cpuThermalMass, setCpuThermalMass] = useState<number>(42.0);

  // Fan Curve Points
  const [fanCurve, setFanCurve] = useState<FanCurvePoint[]>([
    { temp: 30, pwm: 25 },
    { temp: 40, pwm: 45 },
    { temp: 50, pwm: 65 },
    { temp: 65, pwm: 85 },
    { temp: 80, pwm: 100 },
  ]);

  // Preload both icon images so switching is 100% instant and flicker-free
  useEffect(() => {
    const darkIcon = new Image();
    darkIcon.src = '/src/assets/images/dark_pc_icon_white_fan_1791833550185.jpg';
    const lightIcon = new Image();
    lightIcon.src = '/src/assets/images/light_pc_icon_white_fan_1791833561436.jpg';
  }, []);

  // Synchronize document theme class and dynamic website favicon
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('pc_thermal_theme', theme);
    } catch {
      // Ignore if storage is restricted
    }

    // Dynamic browser favicon update:
    // In Dark Mode: Black PC case with white fan on dark background
    // In Light Mode: White PC case with white fan on white background
    const favicon = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = theme === 'dark' 
        ? '/icon-dark-white-fan.jpg' 
        : '/icon-light-white-fan.jpg';
    }
  }, [theme]);

  // Theme toggle callback
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sound Toggle callback
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioAlert.setSoundEnabled(next);
    if (next) {
      audioAlert.playTestSound();
      addLog('System', 'info', 'Motherboard BIOS thermal sound alert enabled.');
    } else {
      addLog('System', 'info', 'Motherboard BIOS thermal sound alert muted.');
    }
  };

  // Sound Test callbacks
  const handleTestSound = () => {
    audioAlert.playTestSound();
    addLog('System', 'info', 'Audio synthesizer test tone triggered (Warning Beep).');
  };

  const handleTestCriticalSound = () => {
    audioAlert.playCriticalAlarm();
    addLog('System', 'alert', 'Emergency thermal buzzer alarm test tone triggered.');
  };

  // Telemetry buffer for 0-150s line chart
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(() => {
    const initialPoints: TelemetryPoint[] = [];
    const stepSeconds = 2.0;
    for (let t = 0; t <= 120; t += stepSeconds) {
      let simCpu = 25 + 16 * (1 - Math.exp(-t / 45.0)) - 3 * Math.sin(t * 0.12) * Math.exp(-t * 0.05);
      if (t >= 70) {
        simCpu = 38.0 + (Math.sin(t * 0.25) * 0.6) + (Math.cos(t * 0.08) * 0.4);
      }
      const simGpu = 27 + 17 * (1 - Math.exp(-t / 55.0)) + Math.sin(t * 0.15) * 0.5;
      const simRpm = 900 + (t / 120) * 550 + Math.sin(t * 0.3) * 15;
      const simPwm = 35 + (t / 120) * 19;

      initialPoints.push({
        time: t,
        cpuTemp: simCpu,
        gpuTemp: simGpu,
        targetTemp: 40.0,
        fanRpm: simRpm,
        fanPwm: simPwm,
        powerDraw: 185,
      });
    }
    return initialPoints;
  });

  // System Logs
  const [logs, setLogs] = useState<SystemLogEntry[]>([
    {
      id: 'log-1',
      time: 120.0,
      level: 'optimal',
      message: 'PID loop in steady state equilibrium: error ΔT = -2.0°C within target band.',
      category: 'PID',
      cpuTemp: 38.0,
      fanRpm: 1450,
    },
    {
      id: 'log-2',
      time: 114.5,
      level: 'info',
      message: 'Tachometer feedback nominal: Fan RPM stabilized at 1450 RPM (54% PWM).',
      category: 'Fan',
      cpuTemp: 38.2,
      fanRpm: 1452,
    },
    {
      id: 'log-3',
      time: 98.2,
      level: 'optimal',
      message: 'GPU hotspot temperature nominal at 42.0°C. Airflow vector nominal.',
      category: 'Thermal',
      cpuTemp: 38.5,
      fanRpm: 1445,
    },
    {
      id: 'log-4',
      time: 80.0,
      level: 'info',
      message: 'Controller engaged closed-loop PID mode with Kp=2.40, Ki=0.15, Kd=1.10.',
      category: 'PID',
      cpuTemp: 39.1,
      fanRpm: 1460,
    },
    {
      id: 'log-5',
      time: 45.0,
      level: 'info',
      message: 'Thermal transient settling: Derivative term dampening overshoot.',
      category: 'PID',
      cpuTemp: 41.2,
      fanRpm: 1520,
    },
    {
      id: 'log-6',
      time: 0.0,
      level: 'info',
      message: 'System cold boot initialized from ambient 24.0°C.',
      category: 'System',
      cpuTemp: 26.0,
      fanRpm: 900,
    },
  ]);

  // Sync state with physics engine whenever user changes parameters
  useEffect(() => {
    engine.targetTemp = targetTemp;
    engine.mode = mode;
    engine.loadProfile = loadProfile;
    engine.pidKp = pidKp;
    engine.pidKi = pidKi;
    engine.pidKd = pidKd;
    engine.ambientTemp = ambientTemp;
    engine.cpuThermalMass = cpuThermalMass;
    engine.fanCurve = fanCurve;
    engine.isRunning = isRunning;
  }, [targetTemp, mode, loadProfile, pidKp, pidKi, pidKd, ambientTemp, cpuThermalMass, fanCurve, isRunning]);

  // Main simulation tick loop with Thermal Sound Alert
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Step simulation by 0.25s
      const dt = 0.25;
      engine.step(dt);

      // Read back state
      const newTime = engine.time;
      const newCpu = engine.cpuTemp;
      const newGpu = engine.gpuTemp;
      const newRam = engine.ramTemp;
      const newRpm = engine.fanRpm;
      const newPwm = engine.fanPwm;

      setTime(newTime);
      setCpuTemp(newCpu);
      setGpuTemp(newGpu);
      setRamTemp(newRam);
      setFanRpm(newRpm);
      setFanPwm(newPwm);

      // Thermal Sound Alert triggers when temperature hits critical or configured threshold
      const maxCurrentTemp = Math.max(newCpu, newGpu);
      if (newCpu >= 85 || newGpu >= 90) {
        setAlerts([`CRITICAL: Thermal Throttle (${maxCurrentTemp.toFixed(0)}°C >= 85°C)`]);
        audioAlert.triggerThermalAlert('critical', maxCurrentTemp);
      } else if (newCpu >= soundAlertThreshold || newGpu >= soundAlertThreshold) {
        const componentName = newCpu >= soundAlertThreshold ? 'CPU' : 'GPU';
        const componentVal = (newCpu >= soundAlertThreshold ? newCpu : newGpu).toFixed(0);
        setAlerts([`Temp Alert: ${componentName} ${componentVal}°C (Threshold ${soundAlertThreshold}°C)`]);
        audioAlert.triggerThermalAlert('warning', maxCurrentTemp);
      } else {
        setAlerts([]);
      }

      // Add to telemetry stream (throttle point recording to once every 1s)
      if (Math.floor(newTime * 4) % 4 === 0) {
        setTelemetry((prev) => {
          const nextPoint: TelemetryPoint = {
            time: Math.round(newTime * 10) / 10,
            cpuTemp: newCpu,
            gpuTemp: newGpu,
            targetTemp: targetTemp,
            fanRpm: newRpm,
            fanPwm: newPwm,
            powerDraw: 185,
          };
          // If time exceeds 150s, maintain sliding window
          if (newTime > 150) {
            return [...prev.slice(1), nextPoint];
          }
          return [...prev, nextPoint];
        });
      }
    }, 180);

    return () => clearInterval(interval);
  }, [isRunning, targetTemp, soundAlertThreshold]);

  // Handlers
  const handleStartSimulation = () => {
    setIsRunning(true);
    engine.isRunning = true;
    addLog('System', 'info', 'Simulation started / resumed by operator.');
  };

  const handlePauseSimulation = () => {
    setIsRunning(false);
    engine.isRunning = false;
    addLog('System', 'info', 'Simulation paused by operator.');
  };

  const handleResetSimulation = () => {
    engine.reset();
    setTime(0);
    setCpuTemp(38.0);
    setGpuTemp(42.0);
    setRamTemp(42.0);
    setFanRpm(1450.0);
    setFanPwm(54.0);
    setTelemetry([
      {
        time: 0,
        cpuTemp: 38.0,
        gpuTemp: 42.0,
        targetTemp: targetTemp,
        fanRpm: 1450,
        fanPwm: 54,
        powerDraw: 185,
      },
    ]);
    addLog('System', 'info', 'Simulation parameters reset to t=0s baseline.');
  };

  const addLog = (category: 'PID' | 'Thermal' | 'Fan' | 'System', level: 'info' | 'optimal' | 'warning' | 'alert', message: string) => {
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        time: engine.time,
        category,
        level,
        message,
        cpuTemp: engine.cpuTemp,
        fanRpm: engine.fanRpm,
      },
      ...prev.slice(0, 99),
    ]);
  };

  const handleApplyAiPid = (newKp: number, newKi: number, newKd: number) => {
    setPidKp(newKp);
    setPidKi(newKi);
    setPidKd(newKd);
    addLog('PID', 'optimal', `AI Advisor tuned PID gains applied: Kp=${newKp.toFixed(2)}, Ki=${newKi.toFixed(3)}, Kd=${newKd.toFixed(2)}.`);
  };

  // Compute power dissipation
  const powerDraw = useMemo(() => {
    const { cpuWatts, gpuWatts } = engine.getHeatLoad(loadProfile);
    return cpuWatts + gpuWatts + 35; // +35W VRM/RAM/Fans
  }, [loadProfile]);

  const isOverTemp = cpuTemp >= soundAlertThreshold || gpuTemp >= soundAlertThreshold;

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-neutral-800 selection:text-white transition-colors ${
      theme === 'dark' ? 'bg-black text-neutral-100' : 'bg-neutral-50 text-neutral-900'
    }`}>
      {/* Top Header with dynamic theme toggle, adaptive app logo, and sound alert control */}
      <Header
        loadProfile={loadProfile}
        setLoadProfile={(profile) => {
          setLoadProfile(profile);
          addLog('Thermal', 'info', `Thermal workload shifted to preset: ${profile}.`);
        }}
        isRunning={isRunning}
        onToggleSimulation={() => (isRunning ? handlePauseSimulation() : handleStartSimulation())}
        onReset={handleResetSimulation}
        onOpenAiAdvisor={() => setIsAiModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onTestSound={handleTestSound}
        isOverTemp={isOverTemp}
      />

      {/* Main Layout: Left Sidebar + Center View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenAiAdvisor={() => setIsAiModalOpen(true)}
          isRunning={isRunning}
          theme={theme}
        />

        {/* Center Main Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {activeTab === 'Dashboard' && (
            <div className="space-y-6 max-w-[1600px] mx-auto">
              {/* Six Data Cards with rounded corners as requested */}
              <DataCards
                cpuTemp={cpuTemp}
                gpuTemp={gpuTemp}
                fanRpm={fanRpm}
                fanPwm={fanPwm}
                ambientTemp={ambientTemp}
                powerDraw={powerDraw}
                status={isRunning ? 'Running' : 'Paused'}
                isRunning={isRunning}
                targetTemp={targetTemp}
                theme={theme}
                soundAlertThreshold={soundAlertThreshold}
                soundEnabled={soundEnabled}
              />

              {/* Split row: Central Panel "Thermal Simulation" + Right Panel "Component Layout" */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Central Panel "Thermal Simulation" (7 cols on desktop) */}
                <div className="lg:col-span-7 flex flex-col">
                  <ThermalSimulationPanel
                    telemetry={telemetry}
                    currentTime={time}
                    currentCpuTemp={cpuTemp}
                    currentGpuTemp={gpuTemp}
                    targetTemp={targetTemp}
                    setTargetTemp={(val) => {
                      setTargetTemp(val);
                      addLog('PID', 'info', `Target setpoint updated to ${val}°C.`);
                    }}
                    mode={mode}
                    setMode={(newMode) => {
                      setMode(newMode);
                      addLog('PID', 'info', `Control mode changed to ${newMode}.`);
                    }}
                    isRunning={isRunning}
                    onStart={handleStartSimulation}
                    onPause={handlePauseSimulation}
                    onReset={handleResetSimulation}
                    theme={theme}
                  />
                </div>

                {/* Right Panel "Component Layout" (5 cols on desktop) */}
                <div className="lg:col-span-5 flex flex-col">
                  <ComponentLayoutSchematic
                    cpuTemp={cpuTemp}
                    gpuTemp={gpuTemp}
                    ramTemp={ramTemp}
                    fanRpm={fanRpm}
                    fanPwm={fanPwm}
                    ambientTemp={ambientTemp}
                    isRunning={isRunning}
                    theme={theme}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PID Parameters' && (
            <PidParametersView
              kp={pidKp}
              setKp={setPidKp}
              ki={pidKi}
              setKi={setPidKi}
              kd={pidKd}
              setKd={setPidKd}
              onAutoTuneWithAi={() => setIsAiModalOpen(true)}
            />
          )}

          {activeTab === 'Fan Curves' && (
            <FanCurvesView
              fanCurve={fanCurve}
              setFanCurve={setFanCurve}
              currentCpuTemp={cpuTemp}
              currentFanRpm={fanRpm}
              currentFanPwm={fanPwm}
            />
          )}

          {activeTab === 'Simulation Setup' && (
            <SimulationSetupView
              ambientTemp={ambientTemp}
              setAmbientTemp={setAmbientTemp}
              loadProfile={loadProfile}
              setLoadProfile={setLoadProfile}
              cpuThermalMass={cpuThermalMass}
              setCpuThermalMass={setCpuThermalMass}
              onRunStressTest={() => {
                setLoadProfile('Stress Test');
                addLog('Thermal', 'alert', 'Thermal stress test injected: CPU Watts ramped to 235W.');
              }}
              soundAlertThreshold={soundAlertThreshold}
              setSoundAlertThreshold={setSoundAlertThreshold}
              soundEnabled={soundEnabled}
              setSoundEnabled={handleToggleSound}
              onTestSound={handleTestSound}
              onTestCriticalSound={handleTestCriticalSound}
              theme={theme}
            />
          )}

          {activeTab === 'System Logs' && (
            <SystemLogsView
              logs={logs}
              onClearLogs={() => setLogs([])}
            />
          )}
        </main>
      </div>

      {/* Footer Bar */}
      <FooterBar
        isRunning={isRunning}
        time={time}
        alerts={alerts}
        fanPwm={fanPwm}
        theme={theme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* AI Thermal Diagnostics & Advisor Modal (Gemini 3.1 Pro High Thinking) */}
      <AiThermalAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        cpuTemp={cpuTemp}
        gpuTemp={gpuTemp}
        fanRpm={fanRpm}
        targetTemp={targetTemp}
        mode={mode}
        pidKp={pidKp}
        pidKi={pidKi}
        pidKd={pidKd}
        onApplyPid={handleApplyAiPid}
      />
    </div>
  );
}
