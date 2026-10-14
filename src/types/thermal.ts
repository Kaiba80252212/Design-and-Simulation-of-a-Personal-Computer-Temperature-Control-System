export type SimulationMode = 'Auto' | 'Manual' | 'Eco';

export type LoadProfile = 'Idle' | 'Office' | 'Gaming' | 'Stress Test';

export interface PidParameters {
  kp: number;
  ki: number;
  kd: number;
  integralClamping: number;
}

export interface FanCurvePoint {
  temp: number; // °C
  pwm: number;  // 0-100%
}

export interface SimulationState {
  time: number; // in seconds, 0 to 150+
  cpuTemp: number; // °C
  gpuTemp: number; // °C
  ramTemp: number; // °C
  ambientTemp: number; // °C
  fanRpm: number; // RPM
  fanPwm: number; // %
  targetTemp: number; // °C, e.g. 40°C
  powerDraw: number; // Watts
  status: 'Running' | 'Paused' | 'Stopped' | 'Overheating';
  mode: SimulationMode;
  loadProfile: LoadProfile;
  alerts: string[];
}

export interface TelemetryPoint {
  time: number;
  cpuTemp: number;
  gpuTemp: number;
  targetTemp: number;
  fanRpm: number;
  fanPwm: number;
  powerDraw: number;
}

export interface SystemLogEntry {
  id: string;
  time: number;
  level: 'info' | 'optimal' | 'warning' | 'alert';
  message: string;
  category: 'PID' | 'Thermal' | 'Fan' | 'System';
  cpuTemp: number;
  fanRpm: number;
}
