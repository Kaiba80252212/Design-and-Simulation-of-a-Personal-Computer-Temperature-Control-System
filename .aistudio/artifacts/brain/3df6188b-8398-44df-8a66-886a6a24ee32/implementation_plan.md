# Next.js Engineering Restyle: PC Thermal Management & Airflow Simulation

High-precision restyling of the PC Temperature Control System into a Vercel/Next.js-inspired dark engineering console, implementing modular App Router-style component composition, crisp hairline borders, zero-gradient discipline, and synchronized thermal dynamics.

## User Review & Critical Decisions

> [!IMPORTANT]
> The restyle aligns strictly with confirmed user preferences:
> - **Visual Aesthetic**: Next.js & Vercel dark engineering theme with crisp 1px borders (`#171717` / `#262626`), zero gradients, and high-contrast phosphor telemetry (`#00F5A0`, `#06B6D4`, `#F59E0B`).
> - **Architecture**: Modular App Router-style layout structure with explicit client component hooks and state providers on the Vite/React runtime.
> - **Core Feature Preservation**: Complete real-time PID thermal simulation loop, transient response curves, and interactive ATX chassis airflow schematic with synchronized case fan tachometer dynamics.

- **Confirmed Decision 1**: Modern dark monochrome canvas (`#000000` / `#0A0A0A`) with subtle 1px border lines (`border-neutral-800`), eliminating all radial/linear gradients and fuzzy drop shadows.
- **Confirmed Decision 2**: Zero-pill metadata design—replacing rounded pill badges with clean unboxed text and typographic delimiters (`·`, `/`).
- **Confirmed Decision 3**: Synchronized fan tachometer (RPM/PWM) and convection arrows with physics-grounded aerodynamic vector curves.

---

## 1. Overview & Core Concept

- **What It Does**: A hardware-grade simulation and control suite for PC thermal dynamics. Simulates CPU, GPU, and RAM heat dissipation under configurable workloads (Idle, Office, Gaming, Stress/AVX-512), dynamically regulated by a continuous closed-loop PID controller and active chassis intake/exhaust fan airflow cycles.
- **Target Audience / Persona**: Hardware engineers, systems architects, PC thermal enthusiasts, and control systems students requiring empirical visualization of transient temperature curves and PWM fan curves.
- **Key Value**: Delivers an uncluttered, senior-engineer console interface that combines fluid 60 FPS SVG convection vectors with mathematical telemetry and tuning controls.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Telemetry & System Overview**:
   - The user opens the console to a consolidated 6-metric telemetry strip (CPU, GPU, RAM, Fan RPM, Fan PWM, Ambient).
   - High-contrast tabular numbers (`tabular-nums font-mono`) provide instant visibility into temperature deltas ($\Delta T$) against the setpoint target.
2. **Thermal Waveform & Transient Inspection**:
   - The interactive SVG canvas plots real-time CPU and GPU temperature curves over a 120s sliding window.
   - Hover crosshair scrubber snaps along the timeline with exact coordinate HUD overlays.
3. **Motherboard Convection & Airflow Analysis**:
   - The ATX schematic displays cool-air intake channeled from the chassis fan into the CPU cooler, RAM bank, and PCIe GPU bay.
   - Heated exhaust streamlines disperse toward top/rear chassis exhaust vents, pausing and accelerating in tandem with the fan's physical RPM.
4. **Parameter Tuning & System Controls**:
   - Dedicated views allow fine-grained tuning of PID gains ($K_p$, $K_i$, $K_d$), 5-point PWM fan curves, workload load profiles, and emergency thermal audio alarms.

### Visual Identity & Theme
- **Aesthetic Direction**: Next.js/Vercel Developer Console—minimalist, authoritative, dark monochrome with razor-sharp 1px neutral borders.
- **Palette**:
  - Background Canvas: Pure Black (`#000000`) and Obsidian (`#0A0A0A`).
  - Structural Surfaces: Surface card (`#121212`) and muted panels (`#18181B`).
  - Borders: Crisp 1px hairline rules (`#262626` / `#27272A`).
  - Accents: Phosphor Emerald (`#10B981` / `#00F5A0`) for nominal CPU/fan states, Cyan (`#06B6D4`) for GPU/intake air, Amber (`#F59E0B`) for thermal warnings and hot exhaust, and Rose (`#F43F5E`) for critical overtemp.
  - Zero Gradients: All decorative linear/radial background gradients are removed in favor of clean solid surfaces with subtle hairline geometry.
- **Typography & Hierarchy**:
  - Primary UI & Headers: Clean geometric neo-grotesque sans (`Plus Jakarta Sans` / `Outfit`).
  - Data & Telemetry: Monospace tabular numerals (`JetBrains Mono` / `font-mono tabular-nums`).
- **Component Geometry**:
  - Crisp, modest radius scale (`rounded-lg` / `rounded-md`), strictly avoiding oversized rounded pills.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Zero-Gradient Engineering Aesthetic**
  - *Chosen Approach*: Replace all CSS gradients and glowing drop-shadow filters with flat, high-contrast monochrome surfaces and crisp 1px borders.
  - *Why*: Conveys production-grade software engineering, eliminates "AI slop" styling, and maximizes legibility in data-dense layouts.
  - *Alternatives Considered*: Retaining neon gradient glow; discarded as requested by the user and design constitution.

- **Decision 2: Next.js Modular App Router Architecture on Vite Runtime**
  - *Chosen Approach*: Structure the codebase into modular route layouts (`(workspace)/page.tsx`, `layout.tsx`, `components/client/*`), using client component hooks (`useSimulation`, `useTelemetry`) to cleanly isolate thermodynamic physics from rendering.
  - *Why*: Provides the modern Next.js architectural mental model with instant HMR and zero bundle bloat in the Vite runtime environment.

- **Decision 3: Integrated Case Fan Intake/Exhaust Airflow Model**
  - *Chosen Approach*: Multi-vector intake stream entering from the right chassis fan mount into the internal components, paired with warm exhaust streamlines departing toward chassis exhaust vents.
  - *Why*: Faithfully simulates real PC chassis aerodynamics without misleading serial component loops.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   App Navigation & Header Ribbon                       │
│  [Logo / Title]  ·  [Profile: Idle | Gaming | Stress]  ·  [Run/Pause]  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              High-Density Metric Strip (6 Tabular KPIs)                │
│    CPU 61°C   ·   GPU 63°C   ·   RAM 41°C   ·   Fan 1450 RPM ...       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
┌───────────────────────────────────────┐   ┌────────────────────────────┐
│      Thermal Simulation Panel         │   │   Component Layout (ATX)   │
│  - Real-time SVG Transient Waveform   │   │  - Chassis Fan Intake Hub  │
│  - Setpoint Target Guideline          │   │  - CPU Heatsink Convection │
│  - Dynamic Hover Scrubber HUD         │   │  - GPU Cooler Vector Path  │
│  - PID Error Signal ΔT Tracker        │   │  - Hot Air Exhaust Venting │
└───────────────────────────────────────┘   └────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Navigation Tabs & Inspector Views                      │
│   [Dashboard]  ·  [PID Tuning]  ·  [Fan Curve]  ·  [System Logs]       │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Structure
1. `src/components/Header.tsx`: 3-zone clean top bar with breadcrumbs, preset selector, and simulation play/reset controls.
2. `src/components/DataCards.tsx`: 6-column crisp metric grid with tabular numerals and text-first status indicators.
3. `src/components/ThermalSimulationPanel.tsx`: Dual-curve SVG transient telemetry graph with hover scrubber HUD and tolerance bands.
4. `src/components/ComponentLayoutSchematic.tsx`: Full ATX motherboard layout with synchronized spinning fan blades, cool intake arrows, and warm exhaust dissipation paths.
5. `src/components/Sidebar.tsx`: Minimalist icon-and-label engineering navigation bar with active indicator markers.
6. `src/index.css`: Purified Tailwind styling without gradients, enforcing Next.js dark engineering variables.
