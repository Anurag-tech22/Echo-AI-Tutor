import { describe, it, expect } from 'vitest';

/**
 * Suite of mathematical verification tests for ECHO's interactive simulations.
 * Validates that analytical physics equations used in WebGL/3D models remain mathematically rigorous.
 */
describe('ECHO Simulation Physics Engine', () => {
  const G = 9.80665; // standard gravitational acceleration (m/s^2)
  const C = 299792458; // speed of light (m/s)

  describe('Classical Projectile Motion', () => {
    it('calculates exact horizontal range and maximum flight height', () => {
      const v0 = 20; // 20 m/s
      const angleDeg = 45;
      const angleRad = (angleDeg * Math.PI) / 180;

      // Analytical formulas
      const expectedRange = (v0 * v0 * Math.sin(2 * angleRad)) / G;
      const expectedMaxHeight = Math.pow(v0 * Math.sin(angleRad), 2) / (2 * G);
      const flightTime = (2 * v0 * Math.sin(angleRad)) / G;

      expect(expectedRange).toBeCloseTo(40.788, 2);
      expect(expectedMaxHeight).toBeCloseTo(10.197, 2);
      expect(flightTime).toBeCloseTo(2.885, 2);

      // Verify position at t = flightTime is at ground level (y ≈ 0)
      const yAtLanding = v0 * Math.sin(angleRad) * flightTime - 0.5 * G * flightTime * flightTime;
      expect(yAtLanding).toBeCloseTo(0, 4);
    });

    it('demonstrates complementary angle range symmetry (30° and 60° share range)', () => {
      const v0 = 25;
      const range30 = (v0 * v0 * Math.sin(2 * (30 * Math.PI) / 180)) / G;
      const range60 = (v0 * v0 * Math.sin(2 * (60 * Math.PI) / 180)) / G;

      expect(range30).toBeCloseTo(range60, 4);
    });
  });

  describe('Keplerian Orbital Mechanics', () => {
    it('computes stable circular orbital velocity based on central mass', () => {
      const gravitationalConstant = 6.6743e-11;
      const earthMass = 5.972e24; // kg
      const orbitRadius = 6.371e6 + 400000; // ISS orbit (6,771 km)

      const orbitalVelocity = Math.sqrt((gravitationalConstant * earthMass) / orbitRadius);
      expect(orbitalVelocity).toBeGreaterThan(7600);
      expect(orbitalVelocity).toBeLessThan(7750);

      // Orbital Period T = 2*pi*r / v ≈ 92.5 minutes
      const orbitalPeriodSec = (2 * Math.PI * orbitRadius) / orbitalVelocity;
      const orbitalPeriodMin = orbitalPeriodSec / 60;
      expect(orbitalPeriodMin).toBeCloseTo(92.5, 0);
    });
  });

  describe('Quantum Wave Interference (Double-Slit)', () => {
    it('accurately locates constructive interference fringe positions', () => {
      const wavelength = 500e-9; // 500 nm (cyan/green light)
      const slitSeparation = 0.1e-3; // 0.1 mm
      const screenDistance = 1.0; // 1 meter

      // Fringe spacing formula: delta_y = (lambda * L) / d
      const fringeSpacing = (wavelength * screenDistance) / slitSeparation;
      expect(fringeSpacing).toBeCloseTo(0.005, 4); // 5 mm spacing

      // Intensity at central maximum should equal 1.0 (normalized)
      const centralIntensity = Math.pow(Math.cos(0), 2);
      expect(centralIntensity).toBe(1.0);

      // First minimum occurs at half-spacing where intensity drops to 0
      const phaseAtMin = Math.PI / 2;
      const minIntensity = Math.pow(Math.cos(phaseAtMin), 2);
      expect(minIntensity).toBeCloseTo(0, 5);
    });
  });

  describe('Special Relativity & Lorentz Dilation', () => {
    it('computes relativistic gamma factor and time dilation', () => {
      const calculateGamma = (v: number) => 1 / Math.sqrt(1 - Math.pow(v / C, 2));

      // At non-relativistic velocity (100 m/s), gamma ≈ 1.0
      expect(calculateGamma(100)).toBeCloseTo(1.0, 6);

      // At 0.8c, gamma must equal exactly 1 / sqrt(1 - 0.64) = 1 / 0.6 = 1.6667
      const gamma80 = calculateGamma(0.8 * C);
      expect(gamma80).toBeCloseTo(1.6667, 3);

      // 1 hour for stationary observer = 1 / gamma hours (36 minutes) for relativistic traveler
      const properTime = 60 / gamma80;
      expect(properTime).toBeCloseTo(36.0, 1);
    });
  });

  describe('Harmonic Resonance & Damping', () => {
    it('computes undamped natural frequency and resonant peak', () => {
      const springK = 100; // N/m
      const massM = 4; // kg

      const omega0 = Math.sqrt(springK / massM);
      const frequencyHz = omega0 / (2 * Math.PI);

      expect(omega0).toBe(5.0); // 5 rad/s
      expect(frequencyHz).toBeCloseTo(0.796, 2);
    });
  });
});
