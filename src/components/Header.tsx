import React from 'react';
import { AppLogo } from './AppLogo';
import { LoadProfile } from '../types/thermal';
import { 
  UilFire, 
  UilRobot, 
  UilSun, 
  UilMoon, 
  UilVolumeUp, 
  UilVolumeMute,
  UilPlay,
  UilPause,
  UilSync
} from '@iconscout/react-unicons';

interface HeaderProps {
  loadProfile: LoadProfile;
  setLoadProfile: (profile: LoadProfile) => void;
  isRunning: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  onOpenAiAdvisor: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTestSound: () => void;
  isOverTemp?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  loadProfile,
  setLoadProfile,
  isRunning,
  onToggleSimulation,
  onReset,
  onOpenAiAdvisor,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  onTestSound,
  isOverTemp = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`border-b sticky top-0 z-40 transition-colors px-4 sm:px-6 py-3 ${
      isDark 
        ? 'border-neutral-800 bg-black text-neutral-100' 
        : 'border-neutral-200 bg-white text-neutral-900'
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 max-w-[1700px] mx-auto">
        {/* Zone 1: Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <AppLogo theme={theme} size="md" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                PC Thermal Control System
              </span>
              <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-400' : 'border-neutral-200 bg-neutral-100 text-neutral-600'
              }`}>
                v2.6
              </span>
            </div>
            <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Closed-Loop PID Regulation & Airflow Simulation
            </span>
          </div>
        </div>

        {/* Zone 2: Workload Presets & Runtime Execution Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Workload Segmented Control */}
          <div className={`flex items-center p-0.5 rounded-md border text-xs ${
            isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
          }`}>
            <span className={`px-2 py-1 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1 ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              <UilFire size={13} className="text-amber-500" />
              Load
            </span>
            {(['Idle', 'Office', 'Gaming', 'Stress Test'] as LoadProfile[]).map((profile) => {
              const active = loadProfile === profile;
              return (
                <button
                  key={profile}
                  onClick={() => setLoadProfile(profile)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? isDark 
                        ? 'bg-neutral-800 text-white font-semibold' 
                        : 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : isDark
                        ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                  }`}
                >
                  {profile}
                </button>
              );
            })}
          </div>

          {/* Simulation Play / Pause / Reset Buttons */}
          <div className={`flex items-center p-0.5 rounded-md border ${
            isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
          }`}>
            <button
              onClick={onToggleSimulation}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                isRunning
                  ? isDark ? 'text-emerald-400 hover:bg-neutral-900' : 'text-emerald-700 hover:bg-neutral-200'
                  : isDark ? 'text-amber-400 hover:bg-neutral-900' : 'text-amber-700 hover:bg-neutral-200'
              }`}
              title={isRunning ? 'Pause simulation loop' : 'Start simulation loop'}
            >
              {isRunning ? <UilPause size={14} /> : <UilPlay size={14} />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={onReset}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-900' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
              title="Reset simulation parameters to default"
            >
              <UilSync size={14} />
            </button>
          </div>
        </div>

        {/* Zone 3: Hardware Diagnostics & AI Inspector */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound Alert Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                isOverTemp && soundEnabled
                  ? 'border-rose-500 bg-rose-950/40 text-rose-400'
                  : soundEnabled
                    ? isDark
                      ? 'border-neutral-800 bg-neutral-950 text-emerald-400 hover:border-neutral-700'
                      : 'border-neutral-300 bg-white text-emerald-700 hover:border-neutral-400'
                    : isDark
                      ? 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:text-neutral-300'
                      : 'border-neutral-300 bg-neutral-100 text-neutral-500 hover:text-neutral-800'
              }`}
              title={soundEnabled ? 'Thermal Sound Alert: Active' : 'Thermal Sound Alert: Muted'}
            >
              {soundEnabled ? (
                <>
                  <UilVolumeUp size={14} className={isOverTemp ? 'text-rose-400' : 'text-emerald-400'} />
                  <span className="hidden sm:inline">Buzzer ON</span>
                </>
              ) : (
                <>
                  <UilVolumeMute size={14} />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </button>
            {soundEnabled && (
              <button
                onClick={onTestSound}
                className={`px-2 py-1.5 rounded-md text-[11px] font-mono border transition-colors cursor-pointer ${
                  isDark 
                    ? 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-700' 
                    : 'border-neutral-300 bg-white text-neutral-600 hover:text-neutral-900'
                }`}
                title="Trigger test buzzer tone"
              >
                Test
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              isDark 
                ? 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white hover:border-neutral-700' 
                : 'border-neutral-300 bg-white text-neutral-700 hover:text-neutral-900'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <UilSun size={15} /> : <UilMoon size={15} />}
          </button>

          {/* AI Advisor Modal Trigger */}
          <button
            onClick={onOpenAiAdvisor}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              isDark
                ? 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 hover:border-neutral-600'
                : 'border-neutral-300 bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            <UilRobot size={15} className="text-emerald-400" />
            <span>AI Advisor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
