import React from 'react';
import { 
  UilProcessor, 
  UilDesktop, 
  UilWind, 
  UilHeartRate, 
  UilThermometer, 
  UilBoltAlt, 
  UilCheckCircle,
  UilVolumeUp
} from '@iconscout/react-unicons';

interface DataCardsProps {
  cpuTemp: number;
  gpuTemp: number;
  fanRpm: number;
  fanPwm: number;
  ambientTemp: number;
  powerDraw: number;
  status: string;
  isRunning: boolean;
  targetTemp: number;
  theme?: 'dark' | 'light';
  soundAlertThreshold?: number;
  soundEnabled?: boolean;
}

export const DataCards: React.FC<DataCardsProps> = ({
  cpuTemp,
  gpuTemp,
  fanRpm,
  fanPwm,
  ambientTemp,
  powerDraw,
  status,
  isRunning,
  targetTemp,
  theme = 'dark',
  soundAlertThreshold = 70,
  soundEnabled = true,
}) => {
  const isDark = theme === 'dark';
  const isCpuOverTemp = cpuTemp >= soundAlertThreshold;
  const isGpuOverTemp = gpuTemp >= soundAlertThreshold;

  const cardBaseClass = `border rounded-lg p-3.5 transition-colors ${
    isDark
      ? 'bg-[#0e0e0e] border-neutral-800 text-white hover:border-neutral-700'
      : 'bg-white border-neutral-200 text-neutral-900 hover:border-neutral-300 shadow-xs'
  }`;

  const labelClass = `text-xs font-medium flex items-center gap-2 ${
    isDark ? 'text-neutral-400' : 'text-neutral-500'
  }`;

  const subLabelClass = `text-[11px] ${
    isDark ? 'text-neutral-500' : 'text-neutral-500'
  }`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. CPU Temperature */}
      <div className={`${cardBaseClass} ${isCpuOverTemp ? 'border-amber-500/80' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>
            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
              <UilProcessor size={14} className="text-emerald-400" />
            </div>
            CPU Temp
          </span>
          <div className="flex items-center gap-1.5">
            {isCpuOverTemp ? (
              <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                Alert
                {soundEnabled && <UilVolumeUp size={12} />}
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 font-medium">Optimal</span>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-semibold tracking-tight font-mono tabular-nums ${
            isCpuOverTemp ? 'text-amber-400' : isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {cpuTemp.toFixed(0)}
          </span>
          <span className="text-xs font-mono text-neutral-500">°C</span>
        </div>
        <div className={`flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 ${subLabelClass}`}>
          <span>Target {targetTemp}°C</span>
          <span className={`font-mono ${cpuTemp <= targetTemp ? 'text-emerald-400' : isCpuOverTemp ? 'text-amber-400 font-medium' : 'text-amber-500'}`}>
            Δ {(cpuTemp - targetTemp) > 0 ? `+${(cpuTemp - targetTemp).toFixed(1)}` : (cpuTemp - targetTemp).toFixed(1)}°
          </span>
        </div>
      </div>

      {/* 2. GPU Temperature */}
      <div className={`${cardBaseClass} ${isGpuOverTemp ? 'border-amber-500/80' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>
            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
              <UilDesktop size={14} className="text-cyan-400" />
            </div>
            GPU Temp
          </span>
          <div className="flex items-center gap-1.5">
            {isGpuOverTemp ? (
              <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                Alert
                {soundEnabled && <UilVolumeUp size={12} />}
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 font-medium">Optimal</span>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-semibold tracking-tight font-mono tabular-nums ${
            isGpuOverTemp ? 'text-amber-400' : isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {gpuTemp.toFixed(0)}
          </span>
          <span className="text-xs font-mono text-neutral-500">°C</span>
        </div>
        <div className={`flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 ${subLabelClass}`}>
          <span>Hotspot {(gpuTemp + 6.4).toFixed(0)}°C</span>
          <span className={`font-mono ${isGpuOverTemp ? 'text-amber-400' : 'text-neutral-400'}`}>
            {isGpuOverTemp ? 'Hotspot High' : 'Nominal'}
          </span>
        </div>
      </div>

      {/* 3. Case Fan Speed */}
      <div className={cardBaseClass}>
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>
            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
              <UilWind size={14} className="text-emerald-400" />
            </div>
            Fan Speed
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Intake Hub
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-semibold tracking-tight font-mono tabular-nums ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {fanRpm.toFixed(0)}
          </span>
          <span className="text-xs font-mono text-neutral-500">RPM</span>
        </div>
        <div className={`flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 ${subLabelClass}`}>
          <span>Duty {fanPwm.toFixed(0)}% PWM</span>
          <span className="font-mono text-emerald-400">Active</span>
        </div>
      </div>

      {/* 4. System Status */}
      <div className={cardBaseClass}>
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>
            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
              <UilHeartRate size={14} className="text-cyan-400" />
            </div>
            Status
          </span>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-semibold tracking-tight ${isRunning ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isRunning ? 'Running' : 'Paused'}
          </span>
        </div>
        <div className={`flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 ${subLabelClass}`}>
          <span>PID Closed-Loop</span>
          <span className="font-mono text-neutral-400">60 FPS</span>
        </div>
      </div>

      {/* 5. Ambient Temperature */}
      <div className={cardBaseClass}>
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>
            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
              <UilThermometer size={14} className="text-blue-400" />
            </div>
            Ambient
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">Chamber</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-semibold tracking-tight font-mono tabular-nums ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {ambientTemp.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-neutral-500">°C</span>
        </div>
        <div className={`flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 ${subLabelClass}`}>
          <span>Intake Base</span>
          <span className="font-mono text-blue-400">Calibrated</span>
        </div>
      </div>

      {/* 6. Power Draw */}
      <div className={cardBaseClass}>
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass}>
            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
              <UilBoltAlt size={14} className="text-amber-400" />
            </div>
            Power Dissipation
          </span>
          <span className="text-[11px] font-mono text-neutral-400">Total</span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className={`text-2xl font-semibold tracking-tight font-mono tabular-nums ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            {powerDraw.toFixed(0)}
          </span>
          <span className="text-xs font-mono text-neutral-500">W</span>
        </div>
        <div className={`flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60 ${subLabelClass}`}>
          <span>VRM + Components</span>
          <span className="font-mono text-amber-400">+35W Base</span>
        </div>
      </div>
    </div>
  );
};
