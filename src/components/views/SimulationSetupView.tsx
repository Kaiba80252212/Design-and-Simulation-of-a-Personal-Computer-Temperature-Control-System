import React from 'react';
import { LoadProfile } from '../../types/thermal';
import { 
  UilThermometer, 
  UilProcessor, 
  UilFire, 
  UilVolumeUp, 
  UilVolumeMute, 
  UilBell, 
  UilExclamationTriangle 
} from '@iconscout/react-unicons';

interface SimulationSetupViewProps {
  ambientTemp: number;
  setAmbientTemp: (v: number) => void;
  loadProfile: LoadProfile;
  setLoadProfile: (p: LoadProfile) => void;
  cpuThermalMass: number;
  setCpuThermalMass: (v: number) => void;
  onRunStressTest: () => void;
  soundAlertThreshold?: number;
  setSoundAlertThreshold?: (v: number) => void;
  soundEnabled?: boolean;
  setSoundEnabled?: (v: boolean) => void;
  onTestSound?: () => void;
  onTestCriticalSound?: () => void;
  theme?: 'dark' | 'light';
}

export const SimulationSetupView: React.FC<SimulationSetupViewProps> = ({
  ambientTemp,
  setAmbientTemp,
  loadProfile,
  setLoadProfile,
  cpuThermalMass,
  setCpuThermalMass,
  onRunStressTest,
  soundAlertThreshold = 70,
  setSoundAlertThreshold,
  soundEnabled = true,
  setSoundEnabled,
  onTestSound,
  onTestCriticalSound,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#0a0a0a] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900 shadow-xs';
  const innerBg = isDark ? 'bg-[#0e0e0e] border-neutral-800' : 'bg-neutral-50 border-neutral-200';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className={`border rounded-lg p-5 transition-colors ${cardBg}`}>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight">
            Thermal Environment & Diagnostic Setup
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
            Boundary Physics
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Configure ambient air intake temperatures, cooler heat capacity, and acoustic alert limits.
        </p>
      </div>

      {/* Sound Alert Configuration Section */}
      <div className={`border rounded-lg p-5 space-y-4 transition-colors ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <UilBell size={16} />
            </div>
            <div>
              <h3 className="text-xs font-semibold flex items-center gap-2">
                <span>Hardware Thermal Buzzer Alarm</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  soundEnabled
                    ? 'border-neutral-700 bg-neutral-900 text-emerald-400'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-500'
                }`}>
                  {soundEnabled ? 'ACTIVE' : 'MUTED'}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Synthesizes BIOS-style alert tones when junction heat exceeds threshold limit.
              </p>
            </div>
          </div>

          {/* Master Sound Switch */}
          {setSoundEnabled && (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
                soundEnabled
                  ? 'bg-neutral-900 border-neutral-700 text-emerald-400 hover:bg-neutral-800'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <UilVolumeUp size={14} className="text-emerald-400" /> : <UilVolumeMute size={14} />}
              <span>{soundEnabled ? 'Buzzer Armed' : 'Buzzer Muted'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Sound Alert Threshold Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium flex items-center gap-1.5 text-neutral-300">
                <UilExclamationTriangle size={14} className="text-amber-400 shrink-0" />
                Alert Trigger Threshold
              </label>
              <span className="text-xs font-mono font-semibold text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                {soundAlertThreshold}°C
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="85"
              step="1"
              value={soundAlertThreshold}
              onChange={(e) => setSoundAlertThreshold && setSoundAlertThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>50°C (Sensitive)</span>
              <span>70°C (Standard Safe)</span>
              <span>85°C (Critical Throttle)</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Acoustic buzzer warns when core temperature reaches or exceeds {soundAlertThreshold}°C.
            </p>
          </div>

          {/* Test Sound Buttons */}
          <div className={`p-3.5 rounded-md border flex flex-col justify-between space-y-3 ${innerBg}`}>
            <div>
              <div className="text-xs font-medium text-neutral-200">
                Audio Tone Synthesizer Check
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Verify the audio generator output directly in your browser.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onTestSound && (
                <button
                  onClick={onTestSound}
                  className="flex-1 py-1.5 px-3 rounded bg-neutral-900 hover:bg-neutral-850 border border-neutral-750 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UilVolumeUp size={14} />
                  <span>Warning Beep</span>
                </button>
              )}
              {onTestCriticalSound && (
                <button
                  onClick={onTestCriticalSound}
                  className="flex-1 py-1.5 px-3 rounded bg-neutral-900 hover:bg-neutral-850 border border-neutral-750 text-rose-400 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UilVolumeUp size={14} />
                  <span>Critical Alarm</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ambient Temperature Setup */}
        <div className={`border rounded-lg p-4 space-y-3 transition-colors ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold flex items-center gap-2">
                <UilThermometer size={14} className="text-cyan-400 shrink-0" />
                Chassis Ambient Intake Temperature
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Intake air entering through case fan</p>
            </div>
            <span className="text-xs font-mono font-semibold text-cyan-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              {ambientTemp.toFixed(1)}°C
            </span>
          </div>

          <input
            type="range"
            min="16.0"
            max="38.0"
            step="0.5"
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>16.0°C (Climate-Controlled)</span>
            <span>24.0°C (Standard)</span>
            <span>38.0°C (Severe Ambient)</span>
          </div>
        </div>

        {/* CPU Heatsink Thermal Mass */}
        <div className={`border rounded-lg p-4 space-y-3 transition-colors ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold flex items-center gap-2">
                <UilProcessor size={14} className="text-emerald-400 shrink-0" />
                CPU Cooler Thermal Mass ($C_{'{'}th{'}'}$)
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Joules per Kelvin capacity of heatsink fins</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              {cpuThermalMass.toFixed(0)} J/K
            </span>
          </div>

          <input
            type="range"
            min="20"
            max="90"
            step="5"
            value={cpuThermalMass}
            onChange={(e) => setCpuThermalMass(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>20 J/K (Slim Air)</span>
            <span>42 J/K (Dual-Tower)</span>
            <span>90 J/K (360mm AIO)</span>
          </div>
        </div>
      </div>

      {/* Benchmark Workload Profiles */}
      <div className={`border rounded-lg p-5 transition-colors ${cardBg}`}>
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-2">
          <UilFire size={14} className="text-amber-400 shrink-0" />
          Thermal Load Injection Presets
        </h3>
        <p className="text-xs text-neutral-500 mb-3">
          Simulate compute-heavy tasks to evaluate heatsink transient response and fan ramp speed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'Idle', title: 'Idle Desktop', watts: '35W CPU · 25W GPU', desc: 'Minimal background tasks' },
            { id: 'Office', title: 'Productivity Workflow', watts: '65W CPU · 45W GPU', desc: 'Code compiling & browsing' },
            { id: 'Gaming', title: 'AAA Gaming Title', watts: '145W CPU · 180W GPU', desc: 'High thermal load on both dies' },
            { id: 'Stress Test', title: 'AVX-512 Stress Test', watts: '235W CPU · 260W GPU', desc: 'Maximum sustained heat dissipation' },
          ].map((item) => {
            const active = loadProfile === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setLoadProfile(item.id as LoadProfile)}
                className={`p-3 rounded-md border text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${active ? 'text-white' : ''}`}>
                    {item.title}
                  </span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1">{item.watts}</div>
                <div className="text-[10px] text-neutral-500 mt-1.5">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
