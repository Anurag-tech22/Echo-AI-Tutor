/**
 * High-Performance 4th-Order Runge-Kutta (RK4) Numerical ODE Solver Suite
 * NVIDIA Omniverse / Scientific Research Grade numerical physics engine.
 * 
 * Provides sub-millisecond precision integration for non-linear, chaotic,
 * relativistic, and multi-body dynamical systems.
 */

export interface SimulationState {
  t: number;
  vars: number[]; // Vector of dependent variables
}

export type DerivativeFunction = (t: number, y: number[]) => number[];

/**
 * Classical 4th-Order Runge-Kutta Integrator for arbitrary dimension ODEs:
 * dy/dt = f(t, y)
 */
export function rk4Step(
  f: DerivativeFunction,
  t: number,
  y: number[],
  dt: number
): number[] {
  const n = y.length;

  // k1 = f(t, y)
  const k1 = f(t, y);

  // k2 = f(t + dt/2, y + (dt/2)*k1)
  const yK1: number[] = new Array(n);
  for (let i = 0; i < n; i++) yK1[i] = y[i] + 0.5 * dt * k1[i];
  const k2 = f(t + 0.5 * dt, yK1);

  // k3 = f(t + dt/2, y + (dt/2)*k2)
  const yK2: number[] = new Array(n);
  for (let i = 0; i < n; i++) yK2[i] = y[i] + 0.5 * dt * k2[i];
  const k3 = f(t + 0.5 * dt, yK2);

  // k4 = f(t + dt, y + dt*k3)
  const yK3: number[] = new Array(n);
  for (let i = 0; i < n; i++) yK3[i] = y[i] + dt * k3[i];
  const k4 = f(t + dt, yK3);

  // y_{n+1} = y_n + (dt / 6) * (k1 + 2*k2 + 2*k3 + k4)
  const yNext: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    yNext[i] = y[i] + (dt / 6.0) * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]);
  }

  return yNext;
}

// ==============================================================================
// 1. Chaotic Double Pendulum (Euler-Lagrange Non-Linear Formulation)
// Variables: [theta1, omega1, theta2, omega2]
// ==============================================================================
export interface DoublePendulumParams {
  m1: number; // mass of upper bob (kg)
  m2: number; // mass of lower bob (kg)
  l1: number; // length of upper rod (m)
  l2: number; // length of lower rod (m)
  g: number;  // gravitational acceleration (m/s^2)
}

export function doublePendulumDerivatives(
  params: DoublePendulumParams
): DerivativeFunction {
  const { m1, m2, l1, l2, g } = params;

  return (_t: number, y: number[]): number[] => {
    const [theta1, omega1, theta2, omega2] = y;
    const delta = theta1 - theta2;

    // Derived from Lagrangian mechanics:
    const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
    const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));

    const num1 =
      -g * (2 * m1 + m2) * Math.sin(theta1) -
      m2 * g * Math.sin(theta1 - 2 * theta2) -
      2 * Math.sin(delta) * m2 * (omega2 * omega2 * l2 + omega1 * omega1 * l1 * Math.cos(delta));

    const num2 =
      2 *
      Math.sin(delta) *
      (omega1 * omega1 * l1 * (m1 + m2) +
        g * (m1 + m2) * Math.cos(theta1) +
        omega2 * omega2 * l2 * m2 * Math.cos(delta));

    const alpha1 = num1 / den1;
    const alpha2 = num2 / den2;

    return [omega1, alpha1, omega2, alpha2];
  };
}

export function computeDoublePendulumEnergy(
  params: DoublePendulumParams,
  state: number[]
): { kinetic: number; potential: number; total: number } {
  const { m1, m2, l1, l2, g } = params;
  const [theta1, omega1, theta2, omega2] = state;

  // Kinetic energy T
  const T1 = 0.5 * m1 * (l1 * omega1) ** 2;
  const T2 =
    0.5 *
    m2 *
    ((l1 * omega1) ** 2 +
      (l2 * omega2) ** 2 +
      2 * l1 * l2 * omega1 * omega2 * Math.cos(theta1 - theta2));
  const kinetic = T1 + T2;

  // Potential energy V (datum at pivot)
  const y1 = -l1 * Math.cos(theta1);
  const y2 = y1 - l2 * Math.cos(theta2);
  const potential = m1 * g * y1 + m2 * g * y2;

  return { kinetic, potential, total: kinetic + potential };
}

// ==============================================================================
// 2. Relativistic Particle Dynamics in Electromagnetic Field
// Variables: [x, y, z, px, py, pz] where p = gamma * m * v
// ==============================================================================
export interface RelativisticEMParams {
  q: number; // electric charge (Coulombs)
  m0: number; // rest mass (kg)
  E: [number, number, number]; // Electric field vector (V/m)
  B: [number, number, number]; // Magnetic field vector (Tesla)
}

export function relativisticEMDerivatives(
  params: RelativisticEMParams
): DerivativeFunction {
  const { q, m0, E, B } = params;
  const c = 299792458.0;

  return (_t: number, y: number[]): number[] => {
    const [, , , px, py, pz] = y;
    const pSq = px * px + py * py + pz * pz;
    const gamma = Math.sqrt(1 + pSq / ((m0 * c) ** 2));

    // Velocity v = p / (gamma * m0)
    const vx = px / (gamma * m0);
    const vy = py / (gamma * m0);
    const vz = pz / (gamma * m0);

    // Lorentz Force F = q * (E + v x B)
    const fx = q * (E[0] + vy * B[2] - vz * B[1]);
    const fy = q * (E[1] + vz * B[0] - vx * B[2]);
    const fz = q * (E[2] + vx * B[1] - vy * B[0]);

    // dp/dt = F
    return [vx, vy, vz, fx, fy, fz];
  };
}

// ==============================================================================
// 3. Three-Body Gravitational Orbital Resonance
// Variables: [x1, y1, vx1, vy1, x2, y2, vx2, vy2, x3, y3, vx3, vy3]
// ==============================================================================
export interface ThreeBodyParams {
  G: number;
  m1: number;
  m2: number;
  m3: number;
}

export function threeBodyDerivatives(params: ThreeBodyParams): DerivativeFunction {
  const { G, m1, m2, m3 } = params;

  return (_t: number, y: number[]): number[] => {
    const [x1, y1, vx1, vy1, x2, y2, vx2, vy2, x3, y3, vx3, vy3] = y;

    // Distances
    const r12 = Math.hypot(x2 - x1, y2 - y1) + 1e-4;
    const r13 = Math.hypot(x3 - x1, y3 - y1) + 1e-4;
    const r23 = Math.hypot(x3 - x2, y3 - y2) + 1e-4;

    // Accelerations on Body 1
    const ax1 = G * m2 * (x2 - x1) / (r12 ** 3) + G * m3 * (x3 - x1) / (r13 ** 3);
    const ay1 = G * m2 * (y2 - y1) / (r12 ** 3) + G * m3 * (y3 - y1) / (r13 ** 3);

    // Accelerations on Body 2
    const ax2 = G * m1 * (x1 - x2) / (r12 ** 3) + G * m3 * (x3 - x2) / (r23 ** 3);
    const ay2 = G * m1 * (y1 - y2) / (r12 ** 3) + G * m3 * (y3 - y2) / (r23 ** 3);

    // Accelerations on Body 3
    const ax3 = G * m1 * (x1 - x3) / (r13 ** 3) + G * m2 * (x2 - x3) / (r23 ** 3);
    const ay3 = G * m1 * (y1 - y3) / (r13 ** 3) + G * m2 * (y2 - y3) / (r23 ** 3);

    return [vx1, vy1, ax1, ay1, vx2, vy2, ax2, ay2, vx3, vy3, ax3, ay3];
  };
}
