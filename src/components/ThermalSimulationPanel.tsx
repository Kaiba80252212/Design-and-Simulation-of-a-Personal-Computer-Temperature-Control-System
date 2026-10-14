import React, { useState, useMemo } from 'react';
import { TelemetryPoint, SimulationMode } from '../types/thermal';
import { 
  UilPlay, 
  UilPause, 
  UilSync, 
  UilSlidersV, 
  UilShieldCheck, 
  UilBolt, 
  UilPagelines,
} from '@iconscout/react-unicons';

interface ThermalSimulationPanelProps {
  telemetry: TelemetryPoint[];
  currentTime: number;
  currentCpuTemp: number;
  currentGpuTemp: number;
  targetTemp: number;
  setTargetTemp: (val: number) => void;
  mode: SimulationMode;
  setMode: (mode: SimulationMode) => void;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  theme?: 'dark' | 'light';
}

export const ThermalSimulationPanel: React.FC<ThermalSimulationPanelProps> = ({
  telemetry,
  currentTime,
  currentCpuTemp,
  currentGpuTemp,
  targetTemp,
  setTargetTemp,
  mode,
  setMode,
  isRunning,
  onStart,
  onPause,
  onReset,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  // Graph geometry
  const graphWidth = 720;
  const graphHeight = 300;
  const padding = { top: 25, right: 35, bottom: 45, left: 55 };
  const plotWidth = graphWidth - padding.left - padding.right;
  const plotHeight = graphHeight - padding.top - padding.bottom;

  const minTemp = 0;
  const maxTemp = 70;
  const minTime = 0;
  const maxTime = 150;

  // Convert (time, temp) to SVG (x, y) coordinates
  const scaleX = (t: number) => {
    const clampedT = Math.max(minTime, Math.min(maxTime, t));
    return padding.left + (clampedT / (maxTime - minTime)) * plotWidth;
  };

  const scaleY = (temp: number) => {
    const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
    return padding.top + plotHeight - ((clampedTemp - minTemp) / (maxTemp - minTemp)) * plotHeight;
  };

  // Build SVG path for CPU Temp (Emerald curve)
  const cpuPathD = useMemo(() => {
    if (telemetry.length === 0) return '';
    return telemetry
      .map((pt, idx) => {
        const x = scaleX(pt.time);
        const y = scaleY(pt.cpuTemp);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [telemetry]);

  // Build SVG path for GPU Temp (Cyan curve)
  const gpuPathD = useMemo(() => {
    if (telemetry.length === 0) return '';
    return telemetry
      .map((pt, idx) => {
        const x = scaleX(pt.time);
        const y = scaleY(pt.gpuTemp);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [telemetry]);

  // Target temperature line Y coordinate
  const targetY = scaleY(targetTemp);

  // Live playhead positions tracking real-time simulation state
  const headX = scaleX(currentTime);
  const headYCpu = scaleY(currentCpuTemp);
  const headYGpu = scaleY(currentGpuTemp);

  // Y-axis tick marks
  const yTicks = [0, 10, 20, 30, 40, 50, 60, 70];
  // X-axis tick marks
  const xTicks = [0, 25, 50, 75, 100, 125, 150];

  // Interactive Hover Scrubber state
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const hoveredPoint = useMemo(() => {
    if (hoverIdx === null || !telemetry[hoverIdx]) return null;
    return telemetry[hoverIdx];
  }, [hoverIdx, telemetry]);

  const handleGraphMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * graphWidth;
    if (mouseX < padding.left || mouseX > graphWidth - padding.right || telemetry.length === 0) {
      setHoverIdx(null);
      return;
    }
    const hoverTime = minTime + ((mouseX - padding.left) / plotWidth) * (maxTime - minTime);
    let closestIdx = 0;
    let minDiff = Infinity;
    telemetry.forEach((pt, idx) => {
      const diff = Math.abs(pt.time - hoverTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoverIdx(closestIdx);
  };

  const handleGraphMouseLeave = () => {
    setHoverIdx(null);
  };

  return (
    <div className={`border rounded-lg p-5 flex flex-col justify-between transition-colors ${
      isDark 
        ? 'bg-[#0a0a0a] border-neutral-800 text-white' 
        : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
    }`}>
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">
              Transient Temperature Waveform
            </h2>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded border ${
              isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-400' : 'border-neutral-200 bg-neutral-100 text-neutral-600'
            }`}>
              PID Closed Loop
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time thermal response curves across time window (0-150s)
          </p>
        </div>

        {/* Legend & Real-Time Sweep Status */}
        <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400" />
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>CPU</span>
            <span className="text-emerald-400 tabular-nums">({currentCpuTemp.toFixed(1)}°C)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400" />
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>GPU</span>
            <span className="text-cyan-400 tabular-nums">({currentGpuTemp.toFixed(1)}°C)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-b border-dashed border-blue-400" />
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>Target</span>
            <span className="text-blue-400 tabular-nums">({targetTemp}°C)</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-neutral-800 pl-3">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
            <span className={isRunning ? 'text-emerald-400 font-medium' : 'text-neutral-500'}>
              {isRunning ? 'Streaming 60 FPS' : 'Sweep Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Line Graph of Temperature vs Time (0-70 °C, 0-150 s) */}
      <div className={`relative w-full aspect-[21/9] min-h-[270px] rounded-md border p-2 overflow-hidden transition-colors ${
        isDark 
          ? 'bg-[#0e0e0e] border-neutral-800' 
          : 'bg-neutral-50 border-neutral-200'
      }`}>
        <svg 
          viewBox={`0 0 ${graphWidth} ${graphHeight}`} 
          className="w-full h-full overflow-visible select-none cursor-crosshair"
          onMouseMove={handleGraphMouseMove}
          onMouseLeave={handleGraphMouseLeave}
        >
          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yTicks.map((temp) => {
            const y = scaleY(temp);
            return (
              <g key={`y-${temp}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={graphWidth - padding.right}
                  y2={y}
                  stroke={isDark ? '#222222' : '#e5e5e5'}
                  strokeWidth="1"
                  strokeDasharray={temp === 0 ? 'none' : '2 4'}
                />
                <text
                  x={padding.left - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className={`text-[10px] font-mono select-none ${isDark ? 'fill-neutral-500' : 'fill-neutral-400'}`}
                >
                  {temp}°C
                </text>
              </g>
            );
          })}

          {/* Vertical Gridlines & X-Axis Labels */}
          {xTicks.map((timeSec) => {
            const x = scaleX(timeSec);
            return (
              <g key={`x-${timeSec}`}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={graphHeight - padding.bottom}
                  stroke={isDark ? '#222222' : '#e5e5e5'}
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <text
                  x={x}
                  y={graphHeight - padding.bottom + 16}
                  textAnchor="middle"
                  className={`text-[10px] font-mono select-none ${isDark ? 'fill-neutral-500' : 'fill-neutral-400'}`}
                >
                  {timeSec}s
                </text>
              </g>
            );
          })}

          {/* Target Deadband Tolerance Corridor (±1.5°C boundary lines) */}
          <line
            x1={padding.left}
            y1={targetY - 5}
            x2={graphWidth - padding.right}
            y2={targetY - 5}
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeDasharray="1 3"
            opacity="0.3"
          />
          <line
            x1={padding.left}
            y1={targetY + 5}
            x2={graphWidth - padding.right}
            y2={targetY + 5}
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeDasharray="1 3"
            opacity="0.3"
          />

          {/* Animated Target setpoint horizontal line */}
          <line
            x1={padding.left}
            y1={targetY}
            x2={graphWidth - padding.right}
            y2={targetY}
            stroke="#3b82f6"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            className={isRunning ? 'animate-target-dash' : ''}
          />

          {/* GPU Temperature curve (Cyan solid base line) */}
          <path
            d={gpuPathD}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* GPU Animated Data Flow Pulse */}
          {isRunning && (
            <path
              d={gpuPathD}
              fill="none"
              stroke="#a5f3fc"
              strokeWidth="2.2"
              strokeDasharray="8 32"
              strokeLinecap="round"
              className="animate-curve-flow"
              opacity="0.85"
            />
          )}

          {/* CPU Temperature curve (Emerald solid base line) */}
          <path
            d={cpuPathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* CPU Animated Data Flow Pulse */}
          {isRunning && (
            <path
              d={cpuPathD}
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="2.6"
              strokeDasharray="8 32"
              strokeLinecap="round"
              className="animate-curve-flow"
              opacity="0.85"
            />
          )}

          {/* Live Scanning Playhead / Telemetry Probe (Sweeping across time window) */}
          <g id="live-playhead">
            {/* Playhead vertical hairline */}
            <line
              x1={headX}
              y1={padding.top}
              x2={headX}
              y2={graphHeight - padding.bottom}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.75"
            />

            {/* Playhead time tag */}
            <g transform={`translate(${Math.min(graphWidth - padding.right - 54, Math.max(padding.left, headX - 27))}, ${padding.top - 14})`}>
              <rect
                width="54"
                height="13"
                rx="2"
                fill="#000000"
                stroke="#3b82f6"
                strokeWidth="0.8"
              />
              <text
                x="27"
                y="9.5"
                textAnchor="middle"
                fill="#3b82f6"
                className="text-[9px] font-mono font-medium"
              >
                T={currentTime.toFixed(0)}s
              </text>
            </g>

            {/* GPU Live Sensor Probe Beacon */}
            <circle
              cx={headX}
              cy={headYGpu}
              r="3.5"
              fill="#06b6d4"
              stroke="#000000"
              strokeWidth="1.5"
            />
            {isRunning && (
              <circle
                cx={headX}
                cy={headYGpu}
                r="9"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1"
                className="animate-sensor-ping"
              />
            )}

            {/* CPU Live Sensor Probe Beacon */}
            <circle
              cx={headX}
              cy={headYCpu}
              r="3.5"
              fill="#10b981"
              stroke="#000000"
              strokeWidth="1.5"
            />
            {isRunning && (
              <circle
                cx={headX}
                cy={headYCpu}
                r="9"
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                className="animate-sensor-ping"
              />
            )}
          </g>

          {/* Hover Scrubber Line & HUD Overlay */}
          {hoveredPoint && (
            <g>
              {/* Vertical Scrubber Cursor Line */}
              <line
                x1={scaleX(hoveredPoint.time)}
                y1={padding.top}
                x2={scaleX(hoveredPoint.time)}
                y2={graphHeight - padding.bottom}
                stroke="#ededed"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Data points on curves */}
              <circle
                cx={scaleX(hoveredPoint.time)}
                cy={scaleY(hoveredPoint.cpuTemp)}
                r="3.5"
                fill="#10b981"
                stroke="#000000"
                strokeWidth="1.5"
              />
              <circle
                cx={scaleX(hoveredPoint.time)}
                cy={scaleY(hoveredPoint.gpuTemp)}
                r="3.5"
                fill="#06b6d4"
                stroke="#000000"
                strokeWidth="1.5"
              />

              {/* HUD Tooltip box */}
              {(() => {
                const tooltipX = Math.min(graphWidth - padding.right - 140, Math.max(padding.left + 10, scaleX(hoveredPoint.time) - 70));
                return (
                  <g transform={`translate(${tooltipX}, ${padding.top + 10})`}>
                    <rect
                      x="0"
                      y="0"
                      width="140"
                      height="65"
                      rx="4"
                      fill="#000000"
                      stroke="#2e2e2e"
                      strokeWidth="1"
                    />
                    <text x="10" y="16" fill="#a1a1a1" className="text-[10px] font-mono">
                      T = {hoveredPoint.time.toFixed(1)}s
                    </text>
                    <text x="10" y="32" fill="#10b981" className="text-[10px] font-mono font-medium">
                      CPU: {hoveredPoint.cpuTemp.toFixed(1)}°C
                    </text>
                    <text x="10" y="46" fill="#06b6d4" className="text-[10px] font-mono font-medium">
                      GPU: {hoveredPoint.gpuTemp.toFixed(1)}°C
                    </text>
                    <text x="10" y="58" fill="#a1a1a1" className="text-[9px] font-mono">
                      Fan: {hoveredPoint.fanRpm.toFixed(0)} RPM
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Interactive Controls: Target Setpoint Slider & Mode Selector */}
      <div className={`mt-4 pt-3.5 border-t flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        {/* Setpoint Slider */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className={isDark ? 'text-neutral-400' : 'text-neutral-600'}>
              Target Setpoint ($T_{'{'}target{'}'}$)
            </span>
            <span className="font-semibold text-blue-400">
              {targetTemp}°C
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="65"
            step="1"
            value={targetTemp}
            onChange={(e) => setTargetTemp(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
            <span>30°C (Silent)</span>
            <span>40°C (Balanced)</span>
            <span>65°C (High Perf)</span>
          </div>
        </div>

        {/* Operating Control Mode Selector */}
        <div className="flex items-center gap-1.5 self-start md:self-auto">
          {(['Auto', 'Manual', 'Eco', 'Max Performance'] as SimulationMode[]).map((m) => {
            const isSelected = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'border-neutral-700 bg-neutral-900 text-white font-semibold'
                      : 'border-neutral-300 bg-neutral-900 text-white shadow-xs font-semibold'
                    : isDark
                      ? 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      : 'border-neutral-200 bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
