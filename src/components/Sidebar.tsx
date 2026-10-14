import React from 'react';
import { 
  UilWindowGrid, 
  UilSetting, 
  UilSlidersV, 
  UilHeartRate, 
  UilFileAlt, 
  UilRobot 
} from '@iconscout/react-unicons';

export type ActiveNavTab = 'Dashboard' | 'Simulation Setup' | 'PID Parameters' | 'Fan Curves' | 'System Logs';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenAiAdvisor: () => void;
  isRunning: boolean;
  theme?: 'dark' | 'light';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAiAdvisor,
  isRunning,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const menuItems: { id: ActiveNavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'Dashboard',
      label: 'Telemetry Dashboard',
      icon: <UilWindowGrid size={16} className="shrink-0" />,
      desc: 'Real-time transients & airflow'
    },
    {
      id: 'Simulation Setup',
      label: 'Simulation Setup',
      icon: <UilSetting size={16} className="shrink-0" />,
      desc: 'Thermal mass & ambient specs'
    },
    {
      id: 'PID Parameters',
      label: 'PID Controller Tuning',
      icon: <UilSlidersV size={16} className="shrink-0" />,
      desc: 'Kp, Ki, Kd gains & error loop'
    },
    {
      id: 'Fan Curves',
      label: 'Fan RPM Curves',
      icon: <UilHeartRate size={16} className="shrink-0" />,
      desc: 'PWM vs temperature curve'
    },
    {
      id: 'System Logs',
      label: 'Audit & Telemetry Logs',
      icon: <UilFileAlt size={16} className="shrink-0" />,
      desc: 'Historical control events'
    },
  ];

  return (
    <aside className={`w-64 shrink-0 border-r flex flex-col justify-between p-4 hidden md:flex transition-colors ${
      isDark 
        ? 'bg-black border-neutral-800 text-neutral-200' 
        : 'bg-neutral-50 border-neutral-200 text-neutral-800'
    }`}>
      <div className="space-y-6">
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-wider px-3 mb-2 font-medium ${
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          }`}>
            Workstation Views
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-colors text-left cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-neutral-900 text-white font-medium border border-neutral-700/80'
                        : 'bg-white text-neutral-950 font-medium border border-neutral-300 shadow-xs'
                      : isDark
                        ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40 border border-transparent'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-400' : isDark ? 'text-neutral-500' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI High-Thinking Intelligence Box */}
        <div className={`p-3.5 rounded-lg border transition-colors ${
          isDark
            ? 'bg-neutral-950 border-neutral-800'
            : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center gap-2 mb-1.5">
            <UilRobot size={16} className="text-emerald-400 shrink-0" />
            <span className={`text-xs font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
              Thermal Advisor
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
            Automated PID tuning & aerodynamic cooling recommendations for chassis convection.
          </p>
          <button
            onClick={onOpenAiAdvisor}
            className={`w-full py-1.5 px-2.5 rounded-md border text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
            }`}
          >
            <span>Consult Advisor</span>
          </button>
        </div>
      </div>

      {/* Engine Status Tag */}
      <div className={`p-3 rounded-lg border text-xs font-mono ${
        isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-neutral-500">Physics Engine</span>
          <span className={isRunning ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {isRunning ? '60 FPS' : 'PAUSED'}
          </span>
        </div>
        <div className="text-[10px] text-neutral-500 truncate">
          Runge-Kutta 4th Order
        </div>
      </div>
    </aside>
  );
};
