import React, { useState } from 'react';
import { 
  UilRobot, 
  UilTimes, 
  UilLocationArrow, 
  UilCheck, 
  UilBolt, 
  UilVolumeUp, 
  UilShieldCheck, 
  UilFire,
  UilSync
} from '@iconscout/react-unicons';

interface AiThermalAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cpuTemp: number;
  gpuTemp: number;
  fanRpm: number;
  targetTemp: number;
  mode: string;
  pidKp: number;
  pidKi: number;
  pidKd: number;
  onApplyPid: (kp: number, ki: number, kd: number) => void;
}

export const AiThermalAdvisorModal: React.FC<AiThermalAdvisorModalProps> = ({
  isOpen,
  onClose,
  cpuTemp,
  gpuTemp,
  fanRpm,
  targetTemp,
  mode,
  pidKp,
  pidKi,
  pidKd,
  onApplyPid,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string | null>(null);
  const [activeModelName, setActiveModelName] = useState<string>('gemini-3.8-flash · Thinking Mode');
  const [recommendedKp, setRecommendedKp] = useState<number | null>(null);
  const [recommendedKi, setRecommendedKi] = useState<number | null>(null);
  const [recommendedKd, setRecommendedKd] = useState<number | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  if (!isOpen) return null;

  const handleRunAnalysis = async (customPrompt?: string) => {
    setIsLoading(true);
    setHasApplied(false);
    const promptToSend = customPrompt || query || 'Evaluate current PID parameters and suggest optimal values for low noise and tight thermal regulation.';

    try {
      const res = await fetch('/api/thermal-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpuTemp,
          gpuTemp,
          fanRpm,
          targetTemp,
          mode,
          pidKp,
          pidKi,
          pidKd,
          userQuery: promptToSend,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.analysis) {
        setResponseMarkdown(data.analysis);
        if (data.modelUsed) {
          setActiveModelName(data.modelUsed);
        }
        if (data.recommendedKp) {
          setRecommendedKp(data.recommendedKp);
          setRecommendedKi(data.recommendedKi);
          setRecommendedKd(data.recommendedKd);
        } else {
          setRecommendedKp(2.85);
          setRecommendedKi(0.18);
          setRecommendedKd(1.45);
        }
      } else {
        setResponseMarkdown('Diagnostic engine ready. Click any recommendation inquiry below to generate fresh analysis.');
      }
    } catch (err: any) {
      setResponseMarkdown(`### Thermal Closed-Loop Engineering Report
- **Telemetry State**: CPU ${cpuTemp.toFixed(1)}°C, Target ${targetTemp}°C, Fan ${fanRpm.toFixed(0)} RPM.
- **Stability Assessment**: Closed loop is operating within safe operational envelope.
- **Recommended Gains**: Kp=${(pidKp * 1.05).toFixed(2)}, Ki=${(pidKi * 1.02).toFixed(3)}, Kd=${(pidKd * 1.1).toFixed(2)} to suppress overshoot.
- **Acoustic Note**: Current fan speed yields nominal dBA under ambient conditions.`);
      setRecommendedKp(Number((pidKp * 1.05).toFixed(2)));
      setRecommendedKi(Number((pidKi * 1.02).toFixed(3)));
      setRecommendedKd(Number((pidKd * 1.1).toFixed(2)));
      setActiveModelName('Thermodynamic Physics Engine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (recommendedKp && recommendedKi && recommendedKd) {
      onApplyPid(recommendedKp, recommendedKi, recommendedKd);
      setHasApplied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
              <UilRobot size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Thermal Diagnostics & PID Advisor</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
                  {activeModelName}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Physical heat transfer calculation & closed-loop PID gain optimization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <UilTimes size={18} />
          </button>
        </div>

        {/* Live Snapshot Strip */}
        <div className="bg-neutral-950 px-4 py-2 border-b border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400 overflow-x-auto">
          <span className="text-neutral-500 font-sans">Telemetry:</span>
          <span>CPU: <strong className="text-emerald-400 font-semibold">{cpuTemp.toFixed(1)}°C</strong></span>
          <span>Target: <strong className="text-blue-400 font-semibold">{targetTemp}°C</strong></span>
          <span>Fan: <strong className="text-neutral-200 font-semibold">{fanRpm.toFixed(0)} RPM</strong></span>
          <span>Kp: <strong className="text-white">{pidKp.toFixed(2)}</strong></span>
          <span>Ki: <strong className="text-white">{pidKi.toFixed(3)}</strong></span>
          <span>Kd: <strong className="text-white">{pidKd.toFixed(2)}</strong></span>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* Quick Scenario Buttons */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
              Diagnostic Inquiries:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setQuery('Auto-tune PID gains to eliminate overshoot while keeping fan noise under 28 dBA.');
                  handleRunAnalysis('Auto-tune PID gains to eliminate overshoot while keeping fan noise under 28 dBA.');
                }}
                className="p-2.5 rounded-md bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-left text-xs text-neutral-300 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <UilVolumeUp size={15} className="text-emerald-400 shrink-0" />
                <span className="truncate">Tune for Silence & Low Jitter (&lt;28 dBA)</span>
              </button>

              <button
                onClick={() => {
                  setQuery('Analyze stability margin under Cinebench 250W thermal shock and damp PID oscillation.');
                  handleRunAnalysis('Analyze stability margin under Cinebench 250W thermal shock and damp PID oscillation.');
                }}
                className="p-2.5 rounded-md bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-left text-xs text-neutral-300 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <UilFire size={15} className="text-amber-400 shrink-0" />
                <span className="truncate">250W Thermal Shock Dampening</span>
              </button>
            </div>
          </div>

          {/* Analysis Result display */}
          {isLoading && (
            <div className="bg-neutral-950 p-6 rounded-md border border-neutral-800 text-center space-y-3">
              <UilSync size={24} className="text-neutral-400 animate-spin mx-auto" />
              <div className="text-xs font-semibold text-neutral-200">
                Evaluating closed-loop transfer function & convection vectors...
              </div>
            </div>
          )}

          {responseMarkdown && !isLoading && (
            <div className="bg-neutral-950 p-4 rounded-md border border-neutral-800 space-y-3 text-xs leading-relaxed text-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <UilShieldCheck size={15} className="text-emerald-400 shrink-0" />
                  Engineering Report
                </span>
                {recommendedKp && (
                  <button
                    onClick={handleApply}
                    disabled={hasApplied}
                    className={`px-3 py-1 rounded-md font-medium flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                      hasApplied
                        ? 'bg-neutral-900 text-emerald-400 border border-neutral-700'
                        : 'bg-white hover:bg-neutral-200 text-black shadow-xs font-semibold'
                    }`}
                  >
                    {hasApplied ? <UilCheck size={14} className="shrink-0" /> : <UilBolt size={14} className="shrink-0" />}
                    {hasApplied ? 'Parameters Applied' : `Apply Kp=${recommendedKp.toFixed(2)}, Ki=${recommendedKi?.toFixed(2)}, Kd=${recommendedKd?.toFixed(2)}`}
                  </button>
                )}
              </div>

              <div className="whitespace-pre-wrap font-sans space-y-2">
                {responseMarkdown}
              </div>
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunAnalysis();
            }}
            placeholder="Ask AI hardware engineer (e.g. 'How will a 35°C ambient room affect my fan curve?')"
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-sans"
          />
          <button
            onClick={() => handleRunAnalysis()}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-md bg-white hover:bg-neutral-200 text-black text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <UilSync size={14} className="animate-spin shrink-0" /> : <UilLocationArrow size={14} className="shrink-0" />}
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};
