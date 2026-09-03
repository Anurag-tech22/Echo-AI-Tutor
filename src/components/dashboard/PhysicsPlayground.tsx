import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw, Sparkles, Orbit, Zap } from 'lucide-react';
import { sound } from '../../lib/soundFx';

interface Orb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
}

const ORB_COLORS = [
  '#818cf8', // Indigo
  '#c084fc', // Purple
  '#38bdf8', // Sky
  '#34d399', // Emerald
  '#fbbf24', // Amber
  '#f472b6', // Pink
];

export function PhysicsPlayground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [isAiming, setIsAiming] = useState(false);
  const [aimStart, setAimStart] = useState<{ x: number; y: number } | null>(null);
  const [aimCurrent, setAimCurrent] = useState<{ x: number; y: number } | null>(null);
  const [gravityEnabled, setGravityEnabled] = useState(true);
  const orbsRef = useRef<Orb[]>([]);

  useEffect(() => {
    orbsRef.current = orbs;
  }, [orbs]);

  // Initialize with a fun binary orbit system
  useEffect(() => {
    resetToBinaryOrbit();
  }, []);

  const resetToBinaryOrbit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const initial: Orb[] = [
      {
        id: 1,
        x: cx - 70,
        y: cy,
        vx: 0,
        vy: -1.8,
        radius: 12,
        mass: 30,
        color: '#818cf8',
        trail: [],
      },
      {
        id: 2,
        x: cx + 70,
        y: cy,
        vx: 0,
        vy: 1.8,
        radius: 12,
        mass: 30,
        color: '#c084fc',
        trail: [],
      },
    ];

    setOrbs(initial);
    orbsRef.current = initial;
  };

  const spawnChaosSwarm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sound.playVictory();
    const swarm: Orb[] = [];
    for (let i = 0; i < 8; i++) {
      swarm.push({
        id: Date.now() + i,
        x: 60 + Math.random() * (canvas.width - 120),
        y: 60 + Math.random() * (canvas.height - 120),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 7 + Math.random() * 6,
        mass: 10 + Math.random() * 20,
        color: ORB_COLORS[i % ORB_COLORS.length],
        trail: [],
      });
    }

    setOrbs(swarm);
    orbsRef.current = swarm;
  };

  // Main Canvas Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const G = 85.0; // Scaled gravitational constant
    const restitution = 0.88; // Bounce bounciness

    const render = () => {
      ctx.fillStyle = '#090d16'; // Deep space obsidian background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle orbital grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const current = [...orbsRef.current];

      // 1. Calculate N-Body Gravity Interactions
      if (gravityEnabled && current.length > 1) {
        for (let i = 0; i < current.length; i++) {
          for (let j = i + 1; j < current.length; j++) {
            const b1 = current[i];
            const b2 = current[j];

            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.hypot(dx, dy) + 12; // softening factor

            const force = (G * b1.mass * b2.mass) / (dist * dist);
            const ax = (force * (dx / dist)) / b1.mass;
            const ay = (force * (dy / dist)) / b1.mass;

            b1.vx += ax * 0.05;
            b1.vy += ay * 0.05;

            b2.vx -= (force * (dx / dist)) / b2.mass * 0.05;
            b2.vy -= (force * (dy / dist)) / b2.mass * 0.05;
          }
        }
      }

      // 2. Update Positions, Wall Bounces, and Trails
      for (let i = 0; i < current.length; i++) {
        const orb = current[i];
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Trail updates
        orb.trail.push({ x: orb.x, y: orb.y });
        if (orb.trail.length > 24) orb.trail.shift();

        // Draw glowing comet trail
        for (let t = 0; t < orb.trail.length - 1; t++) {
          const p1 = orb.trail[t];
          const p2 = orb.trail[t + 1];
          const alpha = (t / orb.trail.length) * 0.45;

          ctx.strokeStyle = orb.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = (t / orb.trail.length) * 3;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;

        // Wall collisions
        let collided = false;
        if (orb.x - orb.radius < 0) {
          orb.x = orb.radius;
          orb.vx = -orb.vx * restitution;
          collided = true;
        } else if (orb.x + orb.radius > canvas.width) {
          orb.x = canvas.width - orb.radius;
          orb.vx = -orb.vx * restitution;
          collided = true;
        }

        if (orb.y - orb.radius < 0) {
          orb.y = orb.radius;
          orb.vy = -orb.vy * restitution;
          collided = true;
        } else if (orb.y + orb.radius > canvas.height) {
          orb.y = canvas.height - orb.radius;
          orb.vy = -orb.vy * restitution;
          collided = true;
        }

        if (collided && Math.hypot(orb.vx, orb.vy) > 1.2) {
          sound.playBounce();
        }

        // Draw Glowing Body
        const glowGradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          orb.radius * 0.2,
          orb.x,
          orb.y,
          orb.radius * 2.2
        );
        glowGradient.addColorStop(0, orb.color);
        glowGradient.addColorStop(0.5, `${orb.color}66`);
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw Slingshot Aim Vector
      if (isAiming && aimStart && aimCurrent) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(aimStart.x, aimStart.y);
        ctx.lineTo(aimCurrent.x, aimCurrent.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Aiming cursor dot
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(aimStart.x, aimStart.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [gravityEnabled, isAiming, aimStart, aimCurrent]);

  // Mouse / Touch Slingshot Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsAiming(true);
    setAimStart({ x, y });
    setAimCurrent({ x, y });
    sound.playPop();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAiming) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setAimCurrent({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseUp = () => {
    if (isAiming && aimStart && aimCurrent) {
      const vx = (aimStart.x - aimCurrent.x) * 0.08;
      const vy = (aimStart.y - aimCurrent.y) * 0.08;

      const newOrb: Orb = {
        id: Date.now(),
        x: aimStart.x,
        y: aimStart.y,
        vx,
        vy,
        radius: 9 + Math.random() * 5,
        mass: 18 + Math.random() * 15,
        color: ORB_COLORS[Math.floor(Math.random() * ORB_COLORS.length)],
        trail: [],
      };

      setOrbs((prev) => [...prev, newOrb]);
      sound.playFling();
    }

    setIsAiming(false);
    setAimStart(null);
    setAimCurrent(null);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
            <Orbit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              Physics Arcade Playground
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Click & Fling
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag to slingshot gravitational orbs with real-time N-body attraction & acoustic collision blips.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGravityEnabled(!gravityEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
              gravityEnabled
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle N-Body Gravity Attraction"
          >
            Gravity: {gravityEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={spawnChaosSwarm}
            className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
            title="Spawn Chaos Particle Swarm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Swarm
          </button>

          <button
            onClick={resetToBinaryOrbit}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Reset to Binary Orbit"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
        <canvas
          ref={canvasRef}
          width={760}
          height={260}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-[260px] cursor-crosshair select-none"
        />

        {/* Floating Instruction Overlay */}
        {orbs.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 text-xs font-mono">
            Click & drag anywhere to slingshot your first celestial body!
          </div>
        )}

        <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-slate-500 font-mono">
          Bodies: {orbs.length} | Acoustic Blips: Active
        </div>
      </div>
    </div>
  );
}
