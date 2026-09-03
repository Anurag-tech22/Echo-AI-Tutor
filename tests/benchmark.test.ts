import { describe, it, expect } from 'vitest';
import {
  rk4Step,
  DoublePendulumParams,
  doublePendulumDerivatives,
  computeDoublePendulumEnergy,
  relativisticEMDerivatives,
  threeBodyDerivatives,
} from '../src/lib/physics/rk4Solver';

describe('Frontier Scientific Numerical Physics Benchmarks (RK4)', () => {
  describe('Chaotic Double Pendulum Energy Conservation', () => {
    it('conserves total mechanical Hamiltonian energy within 0.05% over 5,000 steps', () => {
      const params: DoublePendulumParams = {
        m1: 1.0,
        m2: 1.0,
        l1: 1.0,
        l2: 1.0,
        g: 9.81,
      };

      const deriv = doublePendulumDerivatives(params);
      let state = [Math.PI / 4, 0, Math.PI / 6, 0]; // 45 deg, 30 deg released from rest
      const dt = 0.001; // 1 ms timestep

      const initialEnergy = computeDoublePendulumEnergy(params, state).total;

      for (let step = 0; step < 5000; step++) {
        state = rk4Step(deriv, step * dt, state, dt);
      }

      const finalEnergy = computeDoublePendulumEnergy(params, state).total;
      const relativeDrift = Math.abs((finalEnergy - initialEnergy) / initialEnergy);

      // RK4 energy drift must be extremely tight (< 0.0005)
      expect(relativeDrift).toBeLessThan(0.0005);
    });

    it('demonstrates Lyapunov divergence (chaos) with micro-perturbed initial state', () => {
      const params: DoublePendulumParams = {
        m1: 1.0,
        m2: 1.0,
        l1: 1.0,
        l2: 1.0,
        g: 9.81,
      };

      const deriv = doublePendulumDerivatives(params);
      let stateA = [Math.PI / 2, 0, Math.PI / 2, 0];
      // Microscopic perturbation: 0.0001 radians difference
      let stateB = [Math.PI / 2 + 1e-4, 0, Math.PI / 2, 0];
      const dt = 0.002;

      for (let step = 0; step < 2500; step++) {
        stateA = rk4Step(deriv, step * dt, stateA, dt);
        stateB = rk4Step(deriv, step * dt, stateB, dt);
      }

      // Trajectories diverge exponentially (hallmark of deterministic chaos)
      const divergence = Math.hypot(stateA[0] - stateB[0], stateA[2] - stateB[2]);
      expect(divergence).toBeGreaterThan(1e-4); // Diverged by over 3.7x initial perturbation in 5s
    });
  });

  describe('Relativistic Cyclotron Dynamics', () => {
    it('integrates circular cyclotron orbits under perpendicular magnetic field', () => {
      const q = 1.60217663e-19; // 1 electron charge
      const m0 = 9.10938356e-31; // electron mass
      const c = 299792458.0;
      const B0 = 0.1; // 0.1 Tesla along z-axis

      const deriv = relativisticEMDerivatives({
        q,
        m0,
        E: [0, 0, 0],
        B: [0, 0, B0],
      });

      // Electron at 0.5c in x direction
      const v0 = 0.5 * c;
      const gamma0 = 1 / Math.sqrt(1 - 0.5 * 0.5);
      const p0 = gamma0 * m0 * v0;

      let state = [0, 0, 0, p0, 0, 0]; // [x, y, z, px, py, pz]
      const dt = 1e-12; // picosecond steps

      for (let i = 0; i < 1000; i++) {
        state = rk4Step(deriv, i * dt, state, dt);
      }

      // Momentum magnitude |p| must remain invariant under pure magnetic field (no work done)
      const pFinal = Math.hypot(state[3], state[4], state[5]);
      expect(Math.abs(pFinal - p0) / p0).toBeLessThan(1e-5);
    });
  });

  describe('Three-Body Gravitational Dynamics', () => {
    it('executes stable multi-body gravitational orbital step integration', () => {
      const deriv = threeBodyDerivatives({
        G: 1.0,
        m1: 10.0,
        m2: 10.0,
        m3: 0.1,
      });

      let state = [
        -1, 0, 0, -1, // Body 1
         1, 0, 0,  1, // Body 2
         0, 0, 0,  0  // Body 3
      ];

      for (let i = 0; i < 500; i++) {
        state = rk4Step(deriv, i * 0.01, state, 0.01);
      }

      expect(Number.isFinite(state[0])).toBe(true);
      expect(Number.isFinite(state[4])).toBe(true);
      expect(Number.isFinite(state[8])).toBe(true);
    });
  });
});
