import React, { useState } from 'react';
import { 
  UilWind, 
  UilHdd, 
  UilBolt, 
} from '@iconscout/react-unicons';

interface ComponentLayoutSchematicProps {
  cpuTemp: number;
  gpuTemp: number;
  ramTemp: number;
  fanRpm: number;
  fanPwm: number;
  ambientTemp: number;
  isRunning?: boolean;
  theme?: 'dark' | 'light';
}

export const ComponentLayoutSchematic: React.FC<ComponentLayoutSchematicProps> = ({
  cpuTemp,
  gpuTemp,
  ramTemp,
  fanRpm,
  fanPwm,
  ambientTemp,
  isRunning = true,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [selectedComponent, setSelectedComponent] = useState<'CPU' | 'GPU' | 'RAM' | 'Fan' | 'PSU'>('CPU');
  const [viewMode, setViewMode] = useState<'schematic' | 'thermal'>('schematic');

  // Calculate fan animation rotation period based on RPM
  const fanDuration = Math.max(0.3, Math.min(2.5, (2600 / Math.max(500, fanRpm)) * 0.45));

  // Solid thermal fill helper without gradients
  const getThermalFill = (temp: number) => {
    if (temp < 35) return '#10b98126'; // cool green
    if (temp < 45) return '#f59e0b26'; // warm amber
    if (temp < 60) return '#f9731633'; // hot orange
    return '#ef444440'; // critical red
  };

  return (
    <div className={`border rounded-lg p-5 flex flex-col justify-between h-full transition-colors ${
      isDark 
        ? 'bg-[#0a0a0a] border-neutral-800 text-white' 
        : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
    }`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">
              Component Convection Layout
            </h2>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded border ${
              isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-400' : 'border-neutral-200 bg-neutral-100 text-neutral-600'
            }`}>
              ATX Mainboard
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Motherboard thermal dissipation & active chassis fan aerodynamics
          </p>
        </div>

        {/* View Toggle */}
        <div className={`flex items-center gap-1 p-0.5 rounded-md border text-xs ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
        }`}>
          <button
            onClick={() => setViewMode('schematic')}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'schematic'
                ? isDark 
                  ? 'bg-neutral-800 text-white font-semibold' 
                  : 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Schematic
          </button>
          <button
            onClick={() => setViewMode('thermal')}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'thermal'
                ? isDark 
                  ? 'bg-neutral-800 text-amber-400 font-semibold' 
                  : 'bg-white text-amber-700 shadow-xs font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Heatmap
          </button>
        </div>
      </div>

      {/* Schematic Illustration of Motherboard */}
      <div className={`relative w-full aspect-[4/3] rounded-md border p-2 overflow-hidden flex items-center justify-center transition-colors ${
        isDark ? 'bg-[#0b0b0d] border-neutral-800' : 'bg-neutral-50 border-neutral-200'
      }`}>
        <svg 
          viewBox="0 0 380 270" 
          className="w-full h-full select-none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Motherboard PCB Outline - Solid Fill without gradients */}
          <rect
            x="10"
            y="10"
            width="360"
            height="250"
            rx="6"
            fill={isDark ? '#0f0f12' : '#f5f5f7'}
            stroke={isDark ? '#262626' : '#d4d4d8'}
            strokeWidth="1.2"
          />

          {/* Solder screw mount points */}
          {[[22, 22], [358, 22], [22, 248], [358, 248], [190, 22], [190, 248]].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="4" fill={isDark ? '#17171a' : '#e4e4e7'} stroke={isDark ? '#2c2c30' : '#a1a1aa'} strokeWidth="1" />
              <circle cx={cx} cy={cy} r="1.5" fill={isDark ? '#3f3f46' : '#71717a'} />
            </g>
          ))}

          {/* Clean copper trace lines across PCB */}
          <path d="M 120 70 L 170 70 L 170 120" stroke={isDark ? '#27272a' : '#d4d4d8'} strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 175 140 L 220 140 L 220 180" stroke={isDark ? '#27272a' : '#d4d4d8'} strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 75 125 L 75 170 L 130 170" stroke={isDark ? '#14532d' : '#86efac'} strokeWidth="0.8" />
          <path d="M 230 45 L 290 45" stroke={isDark ? '#14532d' : '#86efac'} strokeWidth="0.8" strokeDasharray="2 2" />

          {/* Thermal Heatmap Overlay Mode - Solid flat highlight circles */}
          {viewMode === 'thermal' && (
            <g>
              <circle cx="115" cy="85" r="50" fill={getThermalFill(cpuTemp)} />
              <ellipse cx="145" cy="180" rx="85" ry="30" fill={getThermalFill(gpuTemp)} />
              <rect x="220" y="35" width="45" height="95" rx="4" fill={getThermalFill(ramTemp)} />
            </g>
          )}

          {/* 1. CPU (38°C / Dynamic) */}
          <g 
            id="cpu-component" 
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => setSelectedComponent('CPU')}
          >
            {/* CPU Socket base */}
            <rect
              x="80"
              y="50"
              width="70"
              height="70"
              rx="4"
              fill={isDark ? '#141416' : '#f0fdf4'}
              stroke="#10b981"
              strokeWidth="1.5"
            />
            {/* CPU Heatspreader */}
            <rect
              x="90"
              y="60"
              width="50"
              height="50"
              rx="3"
              fill={isDark ? '#1a1a1e' : '#dcfce7'}
              stroke="#34d399"
              strokeWidth="1"
            />
            {/* Heatpipe fin lines */}
            <line x1="94" y1="72" x2="136" y2="72" stroke="#10b981" strokeWidth="1" />
            <line x1="94" y1="85" x2="136" y2="85" stroke="#10b981" strokeWidth="1" />
            <line x1="94" y1="98" x2="136" y2="98" stroke="#10b981" strokeWidth="1" />
            {/* Text labels */}
            <text
              x="115"
              y="82"
              textAnchor="middle"
              className={`text-[11px] font-bold font-mono ${isDark ? 'fill-emerald-300' : 'fill-emerald-800'}`}
            >
              CPU
            </text>
            <text
              x="115"
              y="96"
              textAnchor="middle"
              className="text-[10px] font-bold fill-emerald-400 font-mono"
            >
              {cpuTemp.toFixed(0)}°C
            </text>
            <circle cx="143" cy="57" r="2.5" fill="#10b981" />
          </g>

          {/* 2. RAM Slots */}
          <g 
            id="ram-slots-component" 
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => setSelectedComponent('RAM')}
          >
            {[0, 1, 2, 3].map((slotIdx) => {
              const xPos = 215 + slotIdx * 12;
              return (
                <rect
                  key={slotIdx}
                  x={xPos}
                  y="40"
                  width="7.5"
                  height="85"
                  rx="1"
                  fill={isDark ? '#141416' : '#dcfce7'}
                  stroke="#10b981"
                  strokeWidth="1"
                />
              );
            })}
            {[0, 1, 2, 3].map((slotIdx) => (
              <line 
                key={`n-${slotIdx}`} 
                x1={215 + slotIdx * 12} 
                y1="75" 
                x2={222.5 + slotIdx * 12} 
                y2="75" 
                stroke={isDark ? '#27272a' : '#86efac'} 
                strokeWidth="1.2" 
              />
            ))}
            <text
              x="233"
              y="140"
              textAnchor="middle"
              className={`text-[10px] font-bold font-mono ${isDark ? 'fill-emerald-300' : 'fill-emerald-800'}`}
            >
              RAM ({ramTemp.toFixed(0)}°C)
            </text>
          </g>

          {/* 3. GPU PCIe Expansion Card */}
          <g 
            id="gpu-component" 
            className="cursor-pointer transition-opacity hover:opacity-90"
            onClick={() => setSelectedComponent('GPU')}
          >
            <rect
              x="35"
              y="160"
              width="220"
              height="44"
              rx="4"
              fill={isDark ? '#141416' : '#f0fdf4'}
              stroke="#06b6d4"
              strokeWidth="1.5"
            />
            {/* Dual GPU Cooler Fans outline */}
            <circle cx="85" cy="182" r="16" fill={isDark ? '#1a1a1e' : '#e0f2fe'} stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="150" cy="182" r="16" fill={isDark ? '#1a1a1e' : '#e0f2fe'} stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 2" />
            {/* GPU Core */}
            <rect x="185" y="167" width="30" height="30" rx="2" fill={isDark ? '#1e1e24' : '#bbf7d0'} stroke="#34d399" strokeWidth="1" />
            {/* PCIe Gold Fingers */}
            <rect x="50" y="156" width="100" height="3.5" rx="0.5" fill="#f59e0b" />
            <text
              x="200"
              y="185"
              textAnchor="middle"
              className={`text-[11px] font-bold font-mono ${isDark ? 'fill-emerald-300' : 'fill-emerald-800'}`}
            >
              GPU
            </text>
            <text
              x="200"
              y="198"
              textAnchor="middle"
              className="text-[9px] font-semibold fill-cyan-400 font-mono"
            >
              {gpuTemp.toFixed(0)}°C
            </text>
          </g>

          {/* 4. Chassis Fan Intake System (Clean Solid Housing, No Gradient, Pure White Blades) */}
          <g 
            id="fan-component" 
            className="cursor-pointer transition-all hover:opacity-95"
            onClick={() => setSelectedComponent('Fan')}
          >
            {/* Chassis Mounting Rail */}
            <rect
              x="286"
              y="57"
              width="82"
              height="82"
              rx="4"
              fill={isDark ? '#121215' : '#f0fdf4'}
              stroke={isDark ? '#27272a' : '#a7f3d0'}
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Fan Case Housing */}
            <rect
              x="291"
              y="62"
              width="72"
              height="72"
              rx="6"
              fill={isDark ? '#16161a' : '#ecfdf5'}
              stroke="#00f5a0"
              strokeWidth="1.8"
            />

            {/* Corner Mount Pads */}
            <rect x="293" y="64" width="11" height="11" rx="2" fill="#00f5a0" />
            <rect x="349" y="64" width="11" height="11" rx="2" fill="#00f5a0" />
            <rect x="293" y="121" width="11" height="11" rx="2" fill="#00f5a0" />
            <rect x="349" y="121" width="11" height="11" rx="2" fill="#00f5a0" />

            {/* Circular Fan Shroud */}
            <circle
              cx="327"
              cy="98"
              r="30"
              fill={isDark ? '#101012' : '#ffffff'}
              stroke="#00f5a0"
              strokeWidth="1.5"
            />

            {/* Rotating Fan Blades (Pure White Blades with RPM rotation synchronized with isRunning) */}
            <g
              transform="translate(327, 98)"
              className="animate-spin-fan"
              style={{ 
                '--fan-speed': `${fanDuration}s`,
                animationPlayState: isRunning && fanRpm > 10 ? 'running' : 'paused'
              } as React.CSSProperties}
            >
              {[0, 51.4, 102.8, 154.2, 205.7, 257.1, 308.5].map((angle, i) => (
                <path
                  key={i}
                  d="M 0 0 C 9 -12, 19 -18, 25 -14 C 22 -6, 13 -2, 0 0 Z"
                  fill="#ffffff"
                  stroke="#d4d4d8"
                  strokeWidth="0.6"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle cx="0" cy="0" r="8" fill="#18181b" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="4" fill="#00f5a0" />
            </g>

            {/* Label: Fan Tachometer */}
            <text
              x="327"
              y="146"
              textAnchor="middle"
              className="text-[9px] font-bold font-mono fill-emerald-400"
            >
              Case Fan ({fanRpm.toFixed(0)} RPM)
            </text>

            {/* Synchronized Airflow Vectors */}
            <g style={{ animationPlayState: isRunning && fanRpm > 10 ? 'running' : 'paused' }}>
              {/* Arrow 1: Cool intake flowing cleanly towards CPU */}
              <g id="arrow-1">
                <path
                  d="M 288 74 C 255 42, 195 42, 154 62"
                  fill="none"
                  stroke="#00f5a0"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="airflow-line"
                  style={{ animationDuration: `${fanDuration * 0.9}s` } as React.CSSProperties}
                />
                <polygon points="152,63 158,58 159,66" fill="#00f5a0" />
              </g>

              {/* Arrow 2: Middle cool intake gliding through central motherboard channel */}
              <g id="arrow-2">
                <path
                  d="M 288 98 C 248 114, 195 116, 154 94"
                  fill="none"
                  stroke="#05d69e"
                  strokeWidth="2.2"
                  strokeDasharray="6 4"
                  className="airflow-line"
                  style={{ animationDuration: `${fanDuration}s` } as React.CSSProperties}
                />
                <polygon points="152,94 158,89 159,98" fill="#05d69e" />
              </g>

              {/* Arrow 3: Bottom cool intake curving into PCIe GPU bay */}
              <g id="arrow-3">
                <path
                  d="M 288 122 C 248 148, 185 162, 138 170"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  className="airflow-line"
                  style={{ animationDuration: `${fanDuration * 1.1}s` } as React.CSSProperties}
                />
                <polygon points="135,171 141,165 142,174" fill="#06b6d4" />
              </g>

              {/* Warm Exhaust Airflow Path moving towards top exhaust vent */}
              <g id="exhaust-arrow">
                <path
                  d="M 115 50 C 115 30, 160 22, 210 22"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  className="airflow-line"
                  style={{ animationDuration: `${fanDuration * 1.2}s` } as React.CSSProperties}
                />
                <polygon points="210,20 217,22 210,24" fill="#f59e0b" />
              </g>
            </g>
          </g>
        </svg>

        {/* Live Vector Indicator Tag */}
        <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded border text-[10px] font-mono flex items-center gap-1.5 ${
          isDark 
            ? 'bg-neutral-950 border-neutral-800 text-neutral-300' 
            : 'bg-white border-neutral-200 text-neutral-700 shadow-xs'
        }`}>
          <UilWind size={12} className="text-emerald-400" />
          <span>Vector: Intake → Exhaust</span>
        </div>
      </div>

      {/* Peripheral Subsystems Bar */}
      <div className={`mt-3 pt-3 border-t ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
          Hardware Channels
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* RAM Node */}
          <div 
            onClick={() => setSelectedComponent('RAM')}
            className={`p-2 rounded-md border transition-colors cursor-pointer flex items-center justify-between ${
              selectedComponent === 'RAM'
                ? 'bg-neutral-900 border-emerald-500/80 text-white'
                : isDark
                  ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <UilHdd size={15} className="text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold">RAM Bank</div>
                <div className="text-[10px] text-neutral-500">Quad DDR5</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-semibold text-emerald-400 tabular-nums">{ramTemp.toFixed(0)}°C</div>
              <div className="text-[10px] text-neutral-500 font-mono">1.35V</div>
            </div>
          </div>

          {/* Fan Node */}
          <div 
            onClick={() => setSelectedComponent('Fan')}
            className={`p-2 rounded-md border transition-colors cursor-pointer flex items-center justify-between ${
              selectedComponent === 'Fan'
                ? 'bg-neutral-900 border-emerald-500/80 text-white'
                : isDark
                  ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <UilWind size={15} className="text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold">Chassis Fan</div>
                <div className="text-[10px] text-neutral-500">Intake Hub</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-semibold text-emerald-400 tabular-nums">{fanRpm.toFixed(0)}</div>
              <div className="text-[10px] text-neutral-500 font-mono">{fanPwm.toFixed(0)}% PWM</div>
            </div>
          </div>

          {/* PSU Node */}
          <div 
            onClick={() => setSelectedComponent('PSU')}
            className={`p-2 rounded-md border transition-colors cursor-pointer flex items-center justify-between ${
              selectedComponent === 'PSU'
                ? 'bg-neutral-900 border-cyan-500/80 text-white'
                : isDark
                  ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <UilBolt size={15} className="text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold">Power Supply</div>
                <div className="text-[10px] text-neutral-500">850W Plat</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-semibold text-cyan-400">31°C</div>
              <div className="text-[10px] text-neutral-500 font-mono">+12V</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
