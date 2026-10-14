import React from 'react';
import { FanCurvePoint } from '../../types/thermal';
import { UilVolumeUp, UilWind, UilSlidersV } from '@iconscout/react-unicons';

interface FanCurvesViewProps {
  fanCurve: FanCurvePoint[];
  setFanCurve: (curve: FanCurvePoint[]) => void;
  currentCpuTemp: number;
  currentFanRpm: number;
  currentFanPwm: number;
}

export const FanCurvesView: React.FC<FanCurvesViewProps> = ({
  fanCurve,
  setFanCurve,
  currentCpuTemp,
  currentFanRpm,
  currentFanPwm,
}) => {
  const updatePoint = (index: number, field: 'temp' | 'pwm', value: number) => {
    const updated = [...fanCurve];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updated.sort((a, b) => a.temp - b.temp);
    setFanCurve(updated);
  };

  const applyPreset = (preset: 'silent' | 'balanced' | 'turbo' | 'flat') => {
    if (preset === 'silent') {
      setFanCurve([
        { temp: 35, pwm: 20 },
        { temp: 45, pwm: 30 },
        { temp: 55, pwm: 45 },
        { temp: 70, pwm: 70 },
        { temp: 85, pwm: 100 },
      ]);
    } else if (preset === 'balanced') {
      setFanCurve([
        { temp: 30, pwm: 25 },
        { temp: 40, pwm: 45 },
        { temp: 50, pwm: 65 },
        { temp: 65, pwm: 85 },
        { temp: 80, pwm: 100 },
      ]);
    } else if (preset === 'turbo') {
      setFanCurve([
        { temp: 25, pwm: 40 },
        { temp: 35, pwm: 60 },
        { temp: 45, pwm: 80 },
        { temp: 60, pwm: 100 },
        { temp: 75, pwm: 100 },
      ]);
    } else if (preset === 'flat') {
      setFanCurve([
        { temp: 30, pwm: 55 },
        { temp: 45, pwm: 55 },
        { temp: 60, pwm: 55 },
        { temp: 75, pwm: 75 },
        { temp: 85, pwm: 100 },
      ]);
    }
  };

  const estimatedDba = Math.max(16, (16 + (currentFanRpm / 2600) * 26)).toFixed(1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              PWM Tachometer Fan Curves
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
              5-Point Curve
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Program hardware PWM duty cycle mapping relative to core junction temperature.
          </p>
        </div>

        {/* Acoustic Noise readout */}
        <div className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-md flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 rounded bg-neutral-900 flex items-center justify-center text-emerald-400">
            <UilVolumeUp size={15} />
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 uppercase font-mono">Estimated Acoustic Level</div>
            <div className="text-xs font-semibold text-emerald-400 font-mono">{estimatedDba} dBA (Whisper)</div>
          </div>
        </div>
      </div>

      {/* SVG Fan Curve Canvas */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3 text-xs text-neutral-400">
          <span className="font-medium text-white">PWM vs Temperature Response</span>
          <span className="font-mono text-emerald-400">
            {currentCpuTemp.toFixed(1)}°C → {currentFanPwm.toFixed(0)}% PWM ({currentFanRpm.toFixed(0)} RPM)
          </span>
        </div>

        <div className="w-full aspect-[21/8] bg-[#0e0e0e] rounded-md border border-neutral-800 p-3 relative overflow-hidden">
          <svg viewBox="0 0 600 240" className="w-full h-full select-none">
            {/* Grid */}
            {[0, 25, 50, 75, 100].map((pwm) => {
              const y = 200 - (pwm / 100) * 160;
              return (
                <g key={pwm}>
                  <line x1="45" y1={y} x2="560" y2={y} stroke="#222222" strokeWidth="0.8" strokeDasharray="2 3" />
                  <text x="35" y={y + 3} textAnchor="end" className="text-[10px] fill-neutral-500 font-mono">
                    {pwm}%
                  </text>
                </g>
              );
            })}
            {[20, 40, 60, 80, 100].map((t) => {
              const x = 50 + ((t - 20) / 80) * 500;
              return (
                <g key={t}>
                  <line x1={x} y1="40" x2={x} y2="200" stroke="#222222" strokeWidth="0.8" strokeDasharray="2 3" />
                  <text x={x} y="218" textAnchor="middle" className="text-[10px] fill-neutral-500 font-mono">
                    {t}°C
                  </text>
                </g>
              );
            })}

            {/* Polyline */}
            <polyline
              points={fanCurve
                .map((pt) => {
                  const x = 50 + ((Math.max(20, Math.min(100, pt.temp)) - 20) / 80) * 500;
                  const y = 200 - (pt.pwm / 100) * 160;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />

            {/* Current operating point marker */}
            {(() => {
              const curX = 50 + ((Math.max(20, Math.min(100, currentCpuTemp)) - 20) / 80) * 500;
              const curY = 200 - (currentFanPwm / 100) * 160;
              return (
                <g>
                  <line x1={curX} y1="40" x2={curX} y2="200" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx={curX} cy={curY} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              );
            })()}

            {/* Control points */}
            {fanCurve.map((pt, idx) => {
              const x = 50 + ((Math.max(20, Math.min(100, pt.temp)) - 20) / 80) * 500;
              const y = 200 - (pt.pwm / 100) * 160;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="4.5" fill="#22d3ee" stroke="#000000" strokeWidth="1.5" />
                  <text x={x} y={y - 8} textAnchor="middle" className="text-[9px] fill-cyan-400 font-mono font-medium">
                    P{idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 5 Points Table */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
          {fanCurve.map((pt, idx) => (
            <div key={idx} className="bg-neutral-950 border border-neutral-800 p-3 rounded-md space-y-2">
              <div className="text-xs font-semibold text-neutral-200 flex items-center justify-between">
                <span>Node P{idx + 1}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{(pt.pwm / 100 * 2600).toFixed(0)} RPM</span>
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 block font-mono">Temp (°C)</label>
                <input
                  type="number"
                  min="20"
                  max="95"
                  value={pt.temp}
                  onChange={(e) => updatePoint(idx, 'temp', Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-750 rounded px-2 py-1 text-xs font-mono text-white mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-500 block font-mono">PWM Duty (%)</label>
                <input
                  type="number"
                  min="15"
                  max="100"
                  value={pt.pwm}
                  onChange={(e) => updatePoint(idx, 'pwm', Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-750 rounded px-2 py-1 text-xs font-mono text-cyan-400 font-medium mt-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preset curve selectors */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">Curve Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => applyPreset('silent')}
            className="p-3 rounded-md bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold text-emerald-400">Silent Acoustic</div>
            <div className="text-[11px] text-neutral-500 mt-1">&lt; 1000 RPM until 55°C</div>
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="p-3 rounded-md bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold text-cyan-400">Balanced (Default)</div>
            <div className="text-[11px] text-neutral-500 mt-1">Linear 1450 RPM nominal</div>
          </button>
          <button
            onClick={() => applyPreset('turbo')}
            className="p-3 rounded-md bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold text-blue-400">Turbo Performance</div>
            <div className="text-[11px] text-neutral-500 mt-1">Aggressive cooling profile</div>
          </button>
          <button
            onClick={() => applyPreset('flat')}
            className="p-3 rounded-md bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-semibold text-amber-400">Fixed Constant RPM</div>
            <div className="text-[11px] text-neutral-500 mt-1">Steady 55% PWM benchmark</div>
          </button>
        </div>
      </div>
    </div>
  );
};
