import React, { useState } from 'react';
import { SystemLogEntry } from '../../types/thermal';
import { 
  UilFileAlt, 
  UilDownloadAlt, 
  UilFilter, 
  UilTrashAlt, 
  UilCheckCircle, 
  UilExclamationTriangle, 
  UilInfoCircle 
} from '@iconscout/react-unicons';

interface SystemLogsViewProps {
  logs: SystemLogEntry[];
  onClearLogs: () => void;
}

export const SystemLogsView: React.FC<SystemLogsViewProps> = ({
  logs,
  onClearLogs,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredLogs = logs.filter((log) => {
    if (filterCategory === 'All') return true;
    return log.category === filterCategory;
  });

  const exportCsv = () => {
    const headers = 'Time(s),Category,Level,CPU Temp(C),Fan Speed(RPM),Message\n';
    const rows = logs
      .map(
        (l) =>
          `${l.time.toFixed(1)},${l.category},${l.level},${l.cpuTemp.toFixed(1)},${l.fanRpm.toFixed(0)},"${l.message}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pc_thermal_system_logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              Hardware System Telemetry Logs
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400">
              Audit Stream
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time control log tracking PID adjustments, fan tachometer cycles, and thermal events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-850 text-neutral-200 text-xs font-medium border border-neutral-750 transition-colors cursor-pointer"
          >
            <UilDownloadAlt size={14} className="text-neutral-400 shrink-0" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-md bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 border border-neutral-800 transition-colors cursor-pointer"
            title="Clear audit log"
          >
            <UilTrashAlt size={15} />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-neutral-500 font-mono text-[11px] mr-1">
          Filter:
        </span>
        {['All', 'PID', 'Thermal', 'Fan', 'System'].map((cat) => {
          const active = filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-neutral-900 text-white font-semibold border border-neutral-700'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Logs Table */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                <th className="py-2.5 px-4 font-medium">Time</th>
                <th className="py-2.5 px-3 font-medium">Category</th>
                <th className="py-2.5 px-3 font-medium">Level</th>
                <th className="py-2.5 px-3 text-right font-medium">CPU Temp</th>
                <th className="py-2.5 px-3 text-right font-medium">Fan Speed</th>
                <th className="py-2.5 px-4 font-medium">Telemetry Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 font-sans">
                    No telemetry events in this filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-2 px-4 text-cyan-400 tabular-nums">
                      {log.time.toFixed(1)}s
                    </td>
                    <td className="py-2 px-3 text-neutral-400 font-sans">
                      {log.category}
                    </td>
                    <td className="py-2 px-3 font-sans">
                      {log.level === 'optimal' && (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <UilCheckCircle size={13} className="shrink-0" /> Optimal
                        </span>
                      )}
                      {log.level === 'info' && (
                        <span className="text-cyan-400 flex items-center gap-1 text-[11px]">
                          <UilInfoCircle size={13} className="shrink-0" /> Info
                        </span>
                      )}
                      {log.level === 'warning' && (
                        <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                          <UilExclamationTriangle size={13} className="shrink-0" /> Warn
                        </span>
                      )}
                      {log.level === 'alert' && (
                        <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                          <UilExclamationTriangle size={13} className="shrink-0" /> Alert
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-400 tabular-nums">
                      {log.cpuTemp.toFixed(1)}°C
                    </td>
                    <td className="py-2 px-3 text-right text-neutral-300 tabular-nums">
                      {log.fanRpm.toFixed(0)} RPM
                    </td>
                    <td className="py-2 px-4 text-neutral-300 font-sans truncate max-w-md">
                      {log.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
