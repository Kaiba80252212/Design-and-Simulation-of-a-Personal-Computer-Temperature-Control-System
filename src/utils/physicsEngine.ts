import { SimulationMode, LoadProfile, PidParameters, FanCurvePoint } from '../types/thermal';

export class PcThermalEngine {
  // Physical parameters
  ambientTemp: number = 24.0;
  cpuThermalMass: number = 42.0; // J/K
  gpuThermalMass: number = 85.0; // J/K
  minRth: number = 0.12; // K/W at max fan speed (3000 RPM)
  maxRth: number = 0.85; // K/W at stopped fan

  // State variables
  time: number = 120.0; // Starting at 120s as requested in footer bar
  cpuTemp: number = 38.0; // Starting at 38°C as requested
  gpuTemp: number = 42.0; // Starting at 42°C as requested
  ramTemp: number = 42.0; // Starting at 42°C as requested
  fanRpm: number = 1450.0; // Starting at 1450 RPM as requested
  fanPwm: number = 54.0; // %
  targetTemp: number = 40.0; // Starting at 40°C as requested

  // PID Internal state
  pidKp: number = 2.4;
  pidKi: number = 0.15;
  pidKd: number = 1.1;
  integralError: number = 0.0;
  lastError: number = 0.0;

  // Manual & Mode control
  mode: SimulationMode = 'Auto';
  loadProfile: LoadProfile = 'Normal' as any;
  isRunning: boolean = true;
  manualPwm: number = 55.0;

  // Fan curve definition (for Auto/Eco mode fallback)
  fanCurve: FanCurvePoint[] = [
    { temp: 30, pwm: 25 },
    { temp: 40, pwm: 45 },
    { temp: 50, pwm: 65 },
    { temp: 65, pwm: 85 },
    { temp: 80, pwm: 100 },
  ];

  // Load in Watts based on profile
  getHeatLoad(profile: LoadProfile): { cpuWatts: number; gpuWatts: number } {
    switch (profile) {
      case 'Idle':
        return { cpuWatts: 35, gpuWatts: 25 };
      case 'Office':
        return { cpuWatts: 65, gpuWatts: 45 };
      case 'Gaming':
        return { cpuWatts: 145, gpuWatts: 180 };
      case 'Stress Test':
        return { cpuWatts: 235, gpuWatts: 260 };
      default:
        // Nominal working load yielding ~38C CPU and ~42C GPU at 1450 RPM
        return { cpuWatts: 82, gpuWatts: 110 };
    }
  }

  // Calculate PWM from current PID calculation
  calculatePidPwm(dt: number): number {
    const error = this.cpuTemp - this.targetTemp;
    
    // Proportional
    const pTerm = this.pidKp * error;

    // Integral with anti-windup clamping
    this.integralError += error * dt;
    this.integralError = Math.max(-25, Math.min(25, this.integralError));
    const iTerm = this.pidKi * this.integralError;

    // Derivative with filtering
    const derivative = dt > 0 ? (error - this.lastError) / dt : 0;
    this.lastError = error;
    const dTerm = this.pidKd * derivative;

    // Base PWM baseline for 40°C target
    const basePwm = 45.0;
    let computedPwm = basePwm + pTerm + iTerm + dTerm;

    return Math.max(15, Math.min(100, computedPwm));
  }

  // Calculate PWM from custom fan curve
  calculateCurvePwm(temp: number): number {
    if (temp <= this.fanCurve[0].temp) return this.fanCurve[0].pwm;
    const last = this.fanCurve[this.fanCurve.length - 1];
    if (temp >= last.temp) return last.pwm;

    for (let i = 0; i < this.fanCurve.length - 1; i++) {
      const p1 = this.fanCurve[i];
      const p2 = this.fanCurve[i + 1];
      if (temp >= p1.temp && temp <= p2.temp) {
        const ratio = (temp - p1.temp) / (p2.temp - p1.temp);
        return p1.pwm + ratio * (p2.pwm - p1.pwm);
      }
    }
    return 50;
  }

  // Step simulation forward by dt seconds (e.g. 0.1s or 0.25s)
  step(dt: number): void {
    if (!this.isRunning) return;

    this.time += dt;

    // Determine target PWM based on mode
    let targetPwm = 50;
    if (this.mode === 'Manual') {
      targetPwm = this.manualPwm;
    } else if (this.mode === 'Eco') {
      // Eco mode: softer PID with lower max PWM ceiling (quiet profile)
      const rawPid = this.calculatePidPwm(dt);
      targetPwm = Math.min(65, rawPid * 0.85);
    } else {
      // Auto: Full PID control loop
      targetPwm = this.calculatePidPwm(dt);
    }

    // Fan mechanical lag (first-order inertia response)
    const fanTau = 0.7; // seconds
    const alpha = dt / (fanTau + dt);
    this.fanPwm += (targetPwm - this.fanPwm) * alpha;

    // Convert PWM (15% - 100%) to RPM (700 RPM to 2600 RPM)
    const targetRpm = 650 + (this.fanPwm / 100) * 1950;
    this.fanRpm += (targetRpm - this.fanRpm) * alpha;

    // Subtle physical RPM flutter (real tachometer jitter ±8 RPM)
    const tachJitter = (Math.random() - 0.5) * 6;
    const currentEffectiveRpm = Math.max(600, this.fanRpm + tachJitter);

    // Heat generation
    const { cpuWatts, gpuWatts } = this.getHeatLoad(this.loadProfile);

    // Dynamic thermal resistance Rth as a function of airflow RPM
    // Higher RPM -> lower thermal resistance -> faster heat transfer to ambient
    const rpmRatio = Math.max(0.1, currentEffectiveRpm / 2400);
    const rthCpu = this.minRth + (this.maxRth - this.minRth) / (1 + Math.pow(rpmRatio, 1.15));
    const rthGpu = (this.minRth * 0.9) + ((this.maxRth * 0.85) - (this.minRth * 0.9)) / (1 + Math.pow(rpmRatio, 1.1));

    // Newton's law of cooling / heat balance
    // Heat dissipated = (T_cpu - T_ambient) / Rth
    const cpuDissipated = (this.cpuTemp - this.ambientTemp) / rthCpu;
    const gpuDissipated = (this.gpuTemp - this.ambientTemp) / rthGpu;

    // Temperature rate of change dT/dt = (Q_in - Q_out) / C_thermal
    const dCpuTemp = ((cpuWatts - cpuDissipated) / this.cpuThermalMass) * dt;
    const dGpuTemp = ((gpuWatts - gpuDissipated) / this.gpuThermalMass) * dt;

    this.cpuTemp += dCpuTemp;
    this.gpuTemp += dGpuTemp;

    // RAM temperature tracks chassis interior heat + memory dissipation (~15W)
    const ramTarget = this.ambientTemp + (this.cpuTemp - this.ambientTemp) * 0.45 + (15 / 35);
    this.ramTemp += (ramTarget - this.ramTemp) * (dt / 3.0);

    // Clamp physics to realistic bounds
    this.cpuTemp = Math.max(this.ambientTemp, Math.min(105, this.cpuTemp));
    this.gpuTemp = Math.max(this.ambientTemp, Math.min(105, this.gpuTemp));
    this.ramTemp = Math.max(this.ambientTemp, Math.min(95, this.ramTemp));
  }

  reset(): void {
    this.time = 0;
    this.cpuTemp = 38.0;
    this.gpuTemp = 42.0;
    this.ramTemp = 42.0;
    this.fanRpm = 1450.0;
    this.fanPwm = 54.0;
    this.integralError = 0;
    this.lastError = 0;
  }
}
