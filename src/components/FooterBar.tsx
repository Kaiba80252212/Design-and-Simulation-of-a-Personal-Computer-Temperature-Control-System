import React from 'react';
import { 
  UilCheckCircle, 
  UilClock, 
  UilBell, 
  UilHeartRate, 
  UilVolumeUp, 
  UilVolumeMute, 
  UilExclamationTriangle 
} from '@iconscout/react-unicons';

interface FooterBarProps {
  isRunning: boolean;
  time: number;
  alerts: string[];
  fanPwm: number;
  theme?: 'dark' | 'light';
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const FooterBar: React.FC<FooterBarProps> = ({
  isRunning,
  time,
  alerts,
  fanPwm,
  theme = 'dark',
  soundEnabled = true,
  onToggleSound,
}) => {
  const isDark = theme === 'dark';
  const hasAlerts = alerts.length > 0;

  return (
    <footer className={`border-t px-6 py-2.5 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors ${
      isDark 
        ? 'border-neutral-800 bg-black text-neutral-400' 
        : 'border-neutral-200 bg-neutral-50 text-neutral-600'
    }`}>
      {/* Required telemetry status elements */}
      <div className="flex items-center gap-4 flex-wrap font-mono text-[11px]">
        {/* Simulation State */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500">Loop:</span>
          <span className={`font-semibold flex items-center gap-1 ${isRunning ? 'text-emerald-400' : 'text-amber-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {isRunning ? 'Active' : 'Paused'}
          </span>
        </div>

        <span className="text-neutral-700" aria-hidden="true">·</span>

        {/* Controller Type */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500">Algorithm:</span>
          <span className="font-semibold text-neutral-200">
            PID
          </span>
        </div>

        <span className="text-neutral-700" aria-hidden="true">·</span>

        {/* Elapsed Time */}
        <div className="flex items-center gap-1.5">
          <UilClock size={13} className="text-neutral-500 shrink-0" />
          <span className="text-neutral-500">Time:</span>
          <span className="font-semibold text-neutral-200 tabular-nums">
            {time.toFixed(0)}s
          </span>
        </div>

        <span className="text-neutral-700" aria-hidden="true">·</span>

        {/* Alerts Status */}
        <div className="flex items-center gap-1.5">
          <UilBell size={13} className={hasAlerts ? 'text-amber-400' : 'text-neutral-500'} />
          <span className="text-neutral-500">Alerts:</span>
          {hasAlerts ? (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <UilExclamationTriangle size={13} />
              {alerts.join(', ')}
            </span>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              None
              <UilCheckCircle size={13} />
            </span>
          )}
        </div>
      </div>

      {/* Right side: Audio and Fan PWM summary */}
      <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-500">
        <div className="flex items-center gap-1.5">
          <span>Duty:</span>
          <span className="text-neutral-300 font-medium tabular-nums">{fanPwm.toFixed(0)}%</span>
        </div>
        <span className="text-neutral-700" aria-hidden="true">·</span>
        <button
          onClick={onToggleSound}
          className="flex items-center gap-1 hover:text-neutral-300 cursor-pointer"
        >
          {soundEnabled ? (
            <>
              <UilVolumeUp size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Audio Armed</span>
            </>
          ) : (
            <>
              <UilVolumeMute size={13} />
              <span>Audio Muted</span>
            </>
          )}
        </button>
      </div>
    </footer>
  );
};
