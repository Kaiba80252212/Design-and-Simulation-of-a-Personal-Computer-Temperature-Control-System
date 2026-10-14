import React from 'react';
import { 
  UilRobot, 
  UilShield, 
  UilBolt, 
  UilVolumeUp, 
  UilSync, 
  UilSlidersV 
} from '@iconscout/react-unicons';

interface PidParametersViewProps {
  kp: number;
  setKp: (v: number) => void;
  ki: number;
  setKi: (v: number) => void;
  kd: number;
  setKd: (v: number) => void;
  onAutoTuneWithAi: () => void;
}

export const PidParametersView: React.FC<PidParametersViewProps> = ({
  kp,
  setKp,
  ki,
  setKi,
  kd,
  setKd,
  onAutoTuneWithAi,
}) => {
  const applyPreset = (pKp: number, pKi: number, pKd: number) => {
    setKp(pKp);
    setKi(pKi);
    setKd(pKd);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header banner */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              PID Controller Parameters
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
              Closed-Loop Control
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Tune Proportional, Integral, and Derivative coefficients governing fan RPM response.
          </p>
        </div>

        <button
          onClick={onAutoTuneWithAi}
          className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white hover:bg-neutral-800 text-xs font-medium cursor-pointer transition-colors shrink-0"
        >
          <UilRobot size={15} className="text-emerald-400 shrink-0" />
          <span>AI Auto-Tune PID</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kp - Proportional Gain */}
        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-lg p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                Kp (Proportional Gain)
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Immediate error correction</p>
            </div>
            <span className="text-sm font-mono font-semibold text-cyan-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              {kp.toFixed(2)}
            </span>
          </div>

          <input
            type="range"
            min="0.2"
            max="8.0"
            step="0.05"
            value={kp}
            onChange={(e) => setKp(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>0.2 (Sluggish)</span>
            <span>4.0</span>
            <span>8.0 (Oscillatory)</span>
          </div>

          <div className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded border border-neutral-800/80 leading-relaxed">
            Scales fan speed directly proportional to temperature error ($T - T_{'{'}target{'}'}$).
          </div>
        </div>

        {/* Ki - Integral Gain */}
        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-lg p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                Ki (Integral Gain)
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Eliminates steady-state error</p>
            </div>
            <span className="text-sm font-mono font-semibold text-emerald-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              {ki.toFixed(3)}
            </span>
          </div>

          <input
            type="range"
            min="0.01"
            max="0.8"
            step="0.005"
            value={ki}
            onChange={(e) => setKi(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>0.01 (Residual ΔT)</span>
            <span>0.4</span>
            <span>0.8 (Windup Risk)</span>
          </div>

          <div className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded border border-neutral-800/80 leading-relaxed">
            Accumulates lingering temperature deviation over time to drive final steady-state error to zero.
          </div>
        </div>

        {/* Kd - Derivative Gain */}
        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-lg p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                Kd (Derivative Gain)
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">Dampens thermal overshoot</p>
            </div>
            <span className="text-sm font-mono font-semibold text-amber-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
              {kd.toFixed(2)}
            </span>
          </div>

          <input
            type="range"
            min="0.0"
            max="4.0"
            step="0.05"
            value={kd}
            onChange={(e) => setKd(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[10px] font-mono text-neutral-500">
            <span>0.0 (No Damping)</span>
            <span>2.0</span>
            <span>4.0 (Acoustic Churn)</span>
          </div>

          <div className="text-[11px] text-neutral-400 bg-neutral-950 p-2.5 rounded border border-neutral-800/80 leading-relaxed">
            Reacts to rate of temperature change ($dT/dt$), braking fan speed as target temperature is reached.
          </div>
        </div>
      </div>

      {/* Control Presets */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
          Calibration Profiles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => applyPreset(1.6, 0.08, 0.6)}
            className="p-3 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold text-white mb-1 flex items-center justify-between">
              <span>Quiet Acoustic Profile</span>
              <span className="text-[10px] font-mono text-neutral-500">Low Ramp</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Kp: 1.60 · Ki: 0.08 · Kd: 0.60
            </div>
          </button>

          <button
            onClick={() => applyPreset(2.4, 0.15, 1.1)}
            className="p-3 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold text-white mb-1 flex items-center justify-between">
              <span>Balanced Equilibrium</span>
              <span className="text-[10px] font-mono text-emerald-400">Default</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Kp: 2.40 · Ki: 0.15 · Kd: 1.10
            </div>
          </button>

          <button
            onClick={() => applyPreset(4.2, 0.28, 1.9)}
            className="p-3 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold text-white mb-1 flex items-center justify-between">
              <span>Aggressive Overclock</span>
              <span className="text-[10px] font-mono text-amber-400">Rapid Cool</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono">
              Kp: 4.20 · Ki: 0.28 · Kd: 1.90
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
