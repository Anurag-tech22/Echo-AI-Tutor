import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, RotateCcw, Video, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';

function AINarrator({ text }: { text: string }) {
  return (
    <div className="absolute top-4 left-4 z-20 flex items-start gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-indigo-500/30 max-w-sm shadow-2xl">
      <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-900 border-2 border-indigo-500 relative z-10">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="AI Guide" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20 scale-150"></div>
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3 h-3 rounded-full border-2 border-slate-900 z-20"></div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <Video className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">AI Narrator</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function NetForceSim() {
  const [appliedForce, setAppliedForce] = useState(20);
  const [friction, setFriction] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [position, setPosition] = useState(0);
  
  const mass = 10;
  const requestRef = useRef<number>(null);
  const previousTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (previousTimeRef.current != null) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      const netForce = appliedForce - friction;
      const acceleration = netForce / mass;
      
      setVelocity(prevVel => {
        let newVel = prevVel + acceleration * deltaTime;
        if (netForce < 0 && newVel < 0) newVel = 0;
        return newVel;
      });
      
      setPosition(prevPos => {
        const newPos = prevPos + velocity * deltaTime * 20;
        if (newPos > 600) return -100;
        return newPos;
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) requestRef.current = requestAnimationFrame(animate);
    else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null;
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, appliedForce, friction, velocity]);

  return (
    <>
      <AINarrator text={`In this 3D-projected space, we are observing a ${mass}kg mass. The net force determines acceleration. Try adjusting friction to see how it counters your applied force.`} />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Play className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        <button onClick={() => { setIsPlaying(false); setVelocity(0); setPosition(0); }} className="p-1.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative flex flex-col p-4 overflow-hidden min-h-[350px]" style={{ perspective: '1000px' }}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop" alt="Physics Background" referrerPolicy="no-referrer" className="w-full h-full object-cover mix-blend-lighten" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>
        
        {/* 3D Track */}
        <div className="absolute bottom-20 left-0 right-0 h-32 bg-slate-800/20 transform rotate-x-45 border-t border-b border-slate-700 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]" style={{ transform: 'rotateX(60deg) scale(1.5)' }}>
          <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '40px 100%' }}></div>
        </div>
        
        <motion.div 
          className="absolute bottom-24 flex flex-col items-center drop-shadow-2xl z-10"
          style={{ x: position, transformStyle: 'preserve-3d' }}
        >
          <div className="absolute -top-12 flex w-full justify-center">
             {appliedForce > 0 && (
                <div className="absolute left-1/2 flex items-center z-10 translate-x-4">
                  <div className="h-1 bg-emerald-500 relative shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{ width: `${appliedForce * 3}px` }}>
                    <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-emerald-500 border-b-[4px] border-b-transparent"></div>
                  </div>
                </div>
             )}
             {friction > 0 && (
                <div className="absolute right-1/2 flex items-center z-10 -translate-x-4">
                  <div className="h-1 bg-rose-500 relative shadow-[0_0_10px_rgba(244,63,94,0.8)]" style={{ width: `${friction * 3}px` }}>
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-r-[6px] border-r-rose-500 border-b-[4px] border-b-transparent"></div>
                  </div>
                </div>
             )}
          </div>
          
          {/* 3D Cube */}
          <div className="w-16 h-16 relative" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-15deg) rotateY(15deg)' }}>
            <div className="absolute inset-0 bg-indigo-500/80 border border-indigo-400 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] transform translate-z-8">{mass}kg</div>
            <div className="absolute inset-0 bg-indigo-900/80 border border-indigo-700 transform -translate-z-8"></div>
            <div className="absolute inset-0 bg-indigo-800/80 border border-indigo-600 transform rotate-y-90 translate-x-8 origin-right"></div>
            <div className="absolute inset-0 bg-indigo-700/80 border border-indigo-500 transform -rotate-x-90 -translate-y-8 origin-top"></div>
          </div>
        </motion.div>

        <div className="absolute bottom-4 left-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-xs space-y-2 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between gap-4"><span className="text-slate-400">Net Force:</span><span className="text-white font-mono">{appliedForce - friction} N</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-400">Acceleration:</span><span className="text-white font-mono">{((appliedForce - friction) / mass).toFixed(2)} m/s²</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-400">Velocity:</span><span className="text-indigo-400 font-mono">{velocity.toFixed(2)} m/s</span></div>
        </div>
      </div>

      <div className="shrink-0 space-y-4">
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-emerald-400">Applied Force (N)</label><span className="text-sm font-bold text-white">{appliedForce} N</span></div>
          <input type="range" min="0" max="50" value={appliedForce} onChange={(e) => setAppliedForce(Number(e.target.value))} className="w-full accent-emerald-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-rose-400">Friction Force (N)</label><span className="text-sm font-bold text-white">{friction} N</span></div>
          <input type="range" min="0" max="50" value={friction} onChange={(e) => setFriction(Number(e.target.value))} className="w-full accent-rose-500" />
        </div>
      </div>
    </>
  );
}

function Planet({ mass, isPlaying }: { mass: number, isPlaying: boolean }) {
  const meshRef = useRef<any>(null!);
  
  useFrame((state, delta) => {
    if (!isPlaying) return;
    const speed = 0.5 * (mass / 20); // speed based on central mass
    const t = state.clock.getElapsedTime() * speed;
    
    // update position
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t) * 4;
      meshRef.current.position.z = Math.sin(t) * 4;
      meshRef.current.rotation.y += delta;
    }
  });

  return (
    <Trail width={1} length={4} color={new THREE.Color(2, 1, 10)} attenuation={(t) => t * t}>
      <mesh ref={meshRef} position={[4, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>
    </Trail>
  );
}

function OrbitalMechanicsSim() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [mass, setMass] = useState(50);

  return (
    <>
      <AINarrator text="Notice how increasing the central mass accelerates the orbital velocity. This 3D projection illustrates Kepler's laws of planetary motion." />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Play className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <div className="flex-1 bg-black rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={100} distance={20} color="#f59e0b" />
          
          <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          
          <Sphere args={[0.8 + (mass / 200), 32, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} />
          </Sphere>
          
          <Planet mass={mass} isPlaying={isPlaying} />
          
          <OrbitControls enableZoom={true} enablePan={false} autoRotate={!isPlaying} autoRotateSpeed={0.5} />
        </Canvas>
        
        {/* Helper overlay */}
        <div className="absolute bottom-4 right-4 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center gap-2 pointer-events-none">
          <Eye className="w-3.5 h-3.5" /> Drag to rotate 3D view
        </div>
      </div>

      <div className="shrink-0 space-y-4 relative z-20">
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-amber-400">Central Star Mass (M)</label><span className="text-sm font-bold text-white">{mass} Solar Masses</span></div>
          <input type="range" min="10" max="100" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
      </div>
    </>
  );
}


function ChemicalKineticsSim() {
  const [temp, setTemp] = useState(50);
  const [concentration, setConcentration] = useState(50);

  return (
    <>
      <AINarrator text="Notice how increasing the temperature heightens the kinetic energy of the molecules. This leads to more frequent and energetic collisions, accelerating the reaction rate." />
      
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop" alt="Lab Background" referrerPolicy="no-referrer" className="w-full h-full object-cover mix-blend-lighten" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>

        {/* 3D Beaker */}
        <div className="w-32 h-48 border-4 border-slate-500 rounded-b-3xl border-t-0 relative overflow-hidden bg-slate-900/50 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md z-10" style={{ transform: 'rotateX(10deg)' }}>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-600/80 to-amber-400/50 transition-all duration-300" style={{ height: `${concentration}%` }}></div>
          
          {/* Bubbles */}
          <div className="absolute inset-0 flex justify-around items-end overflow-hidden pb-2 opacity-80">
             <div className="w-4 h-4 bg-white/50 rounded-full animate-bounce" style={{ animationDuration: `${2000 / (temp / 10 + 1)}ms` }}></div>
             <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDuration: `${1500 / (temp / 10 + 1)}ms`, animationDelay: '0.2s' }}></div>
             <div className="w-5 h-5 bg-white/50 rounded-full animate-bounce" style={{ animationDuration: `${2500 / (temp / 10 + 1)}ms`, animationDelay: '0.5s' }}></div>
             <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce" style={{ animationDuration: `${1800 / (temp / 10 + 1)}ms`, animationDelay: '0.1s' }}></div>
          </div>
        </div>
        {/* Glow behind beaker */}
        <div className="absolute w-40 h-40 bg-amber-500/20 blur-3xl rounded-full"></div>
      </div>

      <div className="shrink-0 space-y-4">
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-amber-400">Temperature (°C)</label><span className="text-sm font-bold text-white">{temp}°C</span></div>
          <input type="range" min="10" max="100" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-orange-400">Concentration (%)</label><span className="text-sm font-bold text-white">{concentration}%</span></div>
          <input type="range" min="10" max="100" value={concentration} onChange={(e) => setConcentration(Number(e.target.value))} className="w-full accent-orange-500" />
        </div>
      </div>
    </>
  );
}

function CircuitFlowSim() {
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(10);
  const [offset, setOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const requestRef = useRef<number>(null);

  const current = voltage / resistance;

  const animate = () => {
    setOffset(prev => prev - (current * 2));
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) requestRef.current = requestAnimationFrame(animate);
    else if (requestRef.current) cancelAnimationFrame(requestRef.current);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, current]);

  return (
    <>
      <AINarrator text="Ohm's Law (V = IR) defines this circuit. Pushing the voltage higher accelerates the electron flow, while raising resistance restricts it, lowering the total current." />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Play className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        <div className="w-64 h-64 relative" style={{ transform: 'rotateX(50deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>
           <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {/* Board */}
              <rect x="0" y="0" width="100" height="100" fill="rgba(15, 23, 42, 0.8)" stroke="#334155" strokeWidth="2" rx="5" />
              {/* Wire track */}
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="#047857" strokeWidth="4" rx="2" />
              {/* Electrons */}
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="#34d399" strokeWidth="4" rx="2" strokeDasharray="5, 15" strokeDashoffset={offset} />
              
              {/* Components */}
              <circle cx="20" cy="50" r="8" fill="#f59e0b" stroke="#fff" strokeWidth="1" /> {/* Battery */}
              <rect x="75" y="40" width="10" height="20" fill="#ef4444" stroke="#fff" strokeWidth="1" /> {/* Resistor */}
           </svg>
        </div>

        <div className="absolute bottom-4 left-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-xs space-y-2 backdrop-blur-sm shadow-xl">
          <div className="flex justify-between gap-4"><span className="text-slate-400">Current (I):</span><span className="text-emerald-400 font-mono">{current.toFixed(2)} A</span></div>
        </div>
      </div>

      <div className="shrink-0 space-y-4">
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-amber-400">Voltage (V)</label><span className="text-sm font-bold text-white">{voltage} V</span></div>
          <input type="range" min="1" max="24" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="w-full accent-amber-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-rose-400">Resistance (R)</label><span className="text-sm font-bold text-white">{resistance} Ω</span></div>
          <input type="range" min="1" max="50" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} className="w-full accent-rose-500" />
        </div>
      </div>
    </>
  );
}

function FluidDynamicsSim() {
  const [velocity, setVelocity] = useState(20);
  const [constriction, setConstriction] = useState(25); // smaller = narrower
  const [offset, setOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const requestRef = useRef<number>(null);

  const animate = () => {
    setOffset(prev => prev - (velocity / 10));
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) requestRef.current = requestAnimationFrame(animate);
    else if (requestRef.current) cancelAnimationFrame(requestRef.current);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, velocity]);

  const gap = constriction;
  const yTop = 50 - gap;
  const yBot = 50 + gap;
  const pathD = `M 0 10 C 40 10, 60 ${yTop}, 100 ${yTop} C 140 ${yTop}, 160 10, 200 10 L 200 90 C 160 90, 140 ${yBot}, 100 ${yBot} C 60 ${yBot}, 40 90, 0 90 Z`;

  return (
    <>
      <AINarrator text="This demonstrates Bernoulli's Principle. As the fluid enters the constricted section of the pipe, its velocity increases while its static pressure decreases to conserve energy." />
      
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Play className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop" alt="Fluid Background" referrerPolicy="no-referrer" className="w-full h-full object-cover mix-blend-lighten" />
           <div className="absolute inset-0 bg-slate-950/60"></div>
        </div>

        <svg viewBox="0 0 200 100" className="w-full h-48 drop-shadow-2xl relative z-10">
           <path d={pathD} fill="rgba(56, 189, 248, 0.15)" stroke="#0ea5e9" strokeWidth="2" />
           {/* Flow lines moving faster in the center based on constriction */}
           <path d={`M 0 50 Q 50 50, 100 50 T 200 50`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="5, 15" strokeDashoffset={offset * (40/gap)} />
           <path d={`M 0 30 C 40 30, 60 ${yTop + gap/3}, 100 ${yTop + gap/3} C 140 ${yTop + gap/3}, 160 30, 200 30`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="5, 20" strokeDashoffset={offset * 1.5 * (40/gap)} />
           <path d={`M 0 70 C 40 70, 60 ${yBot - gap/3}, 100 ${yBot - gap/3} C 140 ${yBot - gap/3}, 160 70, 200 70`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="5, 18" strokeDashoffset={offset * 1.2 * (40/gap)} />
        </svg>
      </div>

      <div className="shrink-0 space-y-4">
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-cyan-400">Input Velocity</label><span className="text-sm font-bold text-white">{velocity}</span></div>
          <input type="range" min="5" max="50" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full accent-cyan-500" />
        </div>
        <div>
          <div className="flex justify-between mb-1"><label className="text-sm font-medium text-indigo-400">Pipe Constriction Gap</label><span className="text-sm font-bold text-white">{constriction}</span></div>
          <input type="range" min="10" max="40" value={constriction} onChange={(e) => setConstriction(Number(e.target.value))} className="w-full accent-indigo-500" />
        </div>
      </div>
    </>
  );
}


function ParticleCollisionSim() {
  const [particleCount, setParticleCount] = useState(100);
  const [speed, setSpeed] = useState(1);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      const vx = (Math.random() - 0.5) * speed;
      const vy = (Math.random() - 0.5) * speed;
      const vz = (Math.random() - 0.5) * speed;
      temp.push({ position: new THREE.Vector3(x, y, z), velocity: new THREE.Vector3(vx, vy, vz) });
    }
    return temp;
  }, [particleCount, speed]);

  const InstancedParticles = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    
    useFrame(() => {
      if (!meshRef.current) return;
      particles.forEach((particle, i) => {
        // Bounds checking
        if (Math.abs(particle.position.x) > 5) particle.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 5) particle.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 5) particle.velocity.z *= -1;
        
        particle.position.add(particle.velocity.clone().multiplyScalar(0.05 * speed));
        
        dummy.position.copy(particle.position);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
      <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2} toneMapped={false} />
      </instancedMesh>
    );
  };

  return (
    <>
      <AINarrator text={`Simulating ${particleCount} particles inside a bounded volume. Adjust velocity to observe thermodynamic properties like pressure and temperature increase.`} />
      
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative overflow-hidden min-h-[350px]">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          
          {/* Bounding Box Wireframe */}
          <mesh>
            <boxGeometry args={[10, 10, 10]} />
            <meshBasicMaterial color="#334155" wireframe={true} transparent opacity={0.3} />
          </mesh>
          
          <InstancedParticles />
        </Canvas>
      </div>

      <div className="shrink-0 space-y-4 relative z-20">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-sky-400">Particle Count</label>
            <span className="text-sm font-bold text-white">{particleCount}</span>
          </div>
          <input 
            type="range" min="10" max="1000" step="10" 
            value={particleCount} 
            onChange={(e) => setParticleCount(Number(e.target.value))} 
            className="w-full accent-sky-500" 
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-rose-400">Kinetic Energy (Speed)</label>
            <span className="text-sm font-bold text-white">{speed.toFixed(1)}x</span>
          </div>
          <input 
            type="range" min="0.1" max="5" step="0.1" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))} 
            className="w-full accent-rose-500" 
          />
        </div>
      </div>
    </>
  );
}

function QuantumSim() {
  const [state, setState] = useState<'superposition' | '0' | '1'>('superposition');
  const [rotationSpeed, setRotationSpeed] = useState(0.02);

  const measure = () => {
    setState(Math.random() > 0.5 ? '1' : '0');
    setRotationSpeed(0);
  };
  
  const reset = () => {
    setState('superposition');
    setRotationSpeed(0.02);
  };

  const Qubit = () => {
    const groupRef = useRef<THREE.Group>(null!);
    
    useFrame(() => {
      if (groupRef.current && state === 'superposition') {
        groupRef.current.rotation.x += rotationSpeed;
        groupRef.current.rotation.y += rotationSpeed * 1.5;
        groupRef.current.rotation.z += rotationSpeed * 0.5;
      } else if (groupRef.current) {
         // Smoothly lerp to measured state
         groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
         groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
         groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      }
    });

    return (
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color={state === '1' ? '#4f46e5' : state === '0' ? '#e11d48' : '#a855f7'} 
            emissive={state === '1' ? '#4338ca' : state === '0' ? '#be123c' : '#7e22ce'} 
            emissiveIntensity={state === 'superposition' ? 1 : 0.5} 
            wireframe={state === 'superposition'}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {state === 'superposition' && (
          <>
            <mesh rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[1.5, 0.02, 16, 100]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh rotation={[0, Math.PI/2, 0]}>
              <torusGeometry args={[1.5, 0.02, 16, 100]} />
              <meshBasicMaterial color="#c084fc" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <torusGeometry args={[1.5, 0.02, 16, 100]} />
              <meshBasicMaterial color="#fb7185" />
            </mesh>
          </>
        )}
      </group>
    );
  };

  return (
    <>
      <AINarrator text="The particle exists in a probabilistic superposition of both State 0 and State 1 simultaneously. The act of measurement collapses the wave function into a single definite outcome." />
      
      <div className="flex-1 bg-black rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={100} color="#a855f7" />
          <pointLight position={[-10, -10, -10]} intensity={50} color="#38bdf8" />
          
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={state === 'superposition' ? 1 : 0} />
          
          <Qubit />
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={state !== 'superposition'} autoRotateSpeed={2} />
        </Canvas>

        {state !== 'superposition' && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-white text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,1)] z-10 pointer-events-none">
             {state}
           </div>
        )}
      </div>

      <div className="shrink-0 flex items-center justify-center gap-4 py-2">
        <button 
          onClick={measure} 
          disabled={state !== 'superposition'}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)]"
        >
          <Eye className="w-5 h-5" /> Measure State
        </button>
        <button 
          onClick={reset}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700"
        >
          <RotateCcw className="w-5 h-5" /> Reset
        </button>
      </div>
    </>
  );
}


export function LiveSimulation({ simData, className }: { simData?: any, className?: string }) {

function CellularMitosisSim() {
  const [stage, setStage] = useState(0); // 0: Prophase, 1: Metaphase, 2: Anaphase, 3: Telophase
  
  const stages = ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'];
  
  return (
    <>
      <AINarrator text={`Observe the cell dividing. At ${stages[stage]}, the chromosomes ${stage === 0 ? 'condense' : stage === 1 ? 'align in the center' : stage === 2 ? 'are pulled apart' : 'form two new nuclei'}.`} />
      
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop" alt="Cell Background" referrerPolicy="no-referrer" className="w-full h-full object-cover mix-blend-lighten" />
           <div className="absolute inset-0 bg-slate-950/60"></div>
        </div>

        {/* 3D Cell */}
        <div className="w-48 h-48 rounded-full border-4 border-rose-500/50 relative overflow-hidden bg-rose-900/30 shadow-[0_0_30px_rgba(244,63,94,0.1)] backdrop-blur-md z-10 flex items-center justify-center transition-all duration-700" style={{ transform: `scale(${stage === 3 ? 1.2 : 1})`, borderRadius: stage === 3 ? '40px' : '50%' }}>
           <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full"></div>
           
           {/* Chromosomes */}
           <div className="relative w-full h-full flex items-center justify-center">
             {[0, 1, 2, 3].map(i => (
               <div key={i} className="absolute w-2 h-8 bg-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                 style={{
                   transform: stage === 0 ? `translate(${(i-1.5)*15}px, ${(i%2)*10}px) rotate(${i*45}deg)` :
                              stage === 1 ? `translate(${(i-1.5)*12}px, 0) rotate(0deg)` :
                              stage === 2 ? `translate(${(i-1.5)*12}px, ${i%2===0 ? -20 : 20}px) rotate(0deg)` :
                              `translate(${i < 2 ? -30 + i*10 : 20 + (i-2)*10}px, 0) rotate(0deg)`,
                   opacity: 0.9
                 }}
               />
             ))}
           </div>
           
           {/* Spindle Fibers */}
           {stage > 0 && stage < 3 && (
             <div className="absolute inset-0 flex flex-col justify-between py-2">
               <div className="w-full h-[1px] bg-slate-400/30 shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
               <div className="w-full h-[1px] bg-slate-400/30 shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
               <div className="w-full h-[1px] bg-slate-400/30 shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
             </div>
           )}
        </div>
      </div>

      <div className="shrink-0 space-y-4 relative z-20">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-rose-400">Mitosis Stage</label>
            <span className="text-sm font-bold text-white">{stages[stage]}</span>
          </div>
          <input 
            type="range" min="0" max="3" step="1" 
            value={stage} 
            onChange={(e) => setStage(Number(e.target.value))} 
            className="w-full accent-rose-500" 
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
            <span>Pro</span><span>Meta</span><span>Ana</span><span>Telo</span>
          </div>
        </div>
      </div>
    </>
  );
}

function NeuralNetworkSim() {
  const [learningRate, setLearningRate] = useState(0.01);
  const [epoch, setEpoch] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEpoch(e => e + Math.floor(learningRate * 100));
    }, 100);
    return () => clearInterval(interval);
  }, [learningRate]);
  
  const loss = Math.max(0.01, 1 - Math.log10(1 + epoch/50));
  
  return (
    <>
      <AINarrator text={`Adjust the learning rate. A higher rate converges faster but might overshoot, while a lower rate is stable but slow. Current loss is ${loss.toFixed(4)}.`} />
      
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1200&auto=format&fit=crop" alt="Code Background" referrerPolicy="no-referrer" className="w-full h-full object-cover mix-blend-lighten" />
           <div className="absolute inset-0 bg-slate-950/80"></div>
        </div>

        {/* 3D Network */}
        <div className="relative z-10 w-full h-full flex items-center justify-between px-12" style={{ perspective: '800px' }}>
          {[0, 1, 2].map((layer, lIdx) => (
            <div key={lIdx} className="flex flex-col gap-8 transform-style-3d" style={{ transform: `translateZ(${lIdx * 30 - 30}px) rotateY(-15deg)` }}>
              {[0, 1, 2, 3].slice(0, lIdx === 1 ? 4 : 3).map((node, nIdx) => (
                <div key={nIdx} className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.8)] relative">
                  {lIdx < 2 && (
                    <div className="absolute top-1/2 left-full w-32 h-[2px] origin-left transition-all duration-300"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${Math.max(0.1, 1 - loss)})`,
                        transform: `rotate(${nIdx === 0 ? 15 : nIdx === 3 ? -15 : 0}deg)`,
                        boxShadow: `0 0 8px rgba(16, 185, 129, ${1 - loss})`
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 space-y-4 relative z-20">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-emerald-400">Learning Rate (α)</label>
            <span className="text-sm font-bold text-white">{learningRate.toFixed(3)}</span>
          </div>
          <input 
            type="range" min="0.001" max="0.1" step="0.001" 
            value={learningRate} 
            onChange={(e) => setLearningRate(Number(e.target.value))} 
            className="w-full accent-emerald-500" 
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Epoch: <span className="text-white font-mono">{epoch}</span></span>
          <span className="text-slate-400">Loss: <span className="text-rose-400 font-mono">{loss.toFixed(4)}</span></span>
        </div>
      </div>
    </>
  );
}

function FourierTransformSim() {
  const [freq1, setFreq1] = useState(1);
  const [freq2, setFreq2] = useState(3);
  
  return (
    <>
      <AINarrator text={`A Fourier Transform decomposes a complex wave into its constituent sine waves. Adjust the frequencies to see the interference pattern change.`} />
      
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative flex items-center justify-center overflow-hidden min-h-[350px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop" alt="Math Background" referrerPolicy="no-referrer" className="w-full h-full object-cover mix-blend-lighten" />
           <div className="absolute inset-0 bg-slate-950/70"></div>
        </div>

        {/* 3D Wave Canvas */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4 p-4">
          <svg viewBox="0 0 200 100" className="w-full h-32 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
             <path d={`M ${Array.from({length: 200}).map((_, i) => `${i} ${50 + Math.sin(i * freq1 * 0.05) * 15 + Math.sin(i * freq2 * 0.05) * 15}`).join(' L ')}`} fill="none" stroke="#10b981" strokeWidth="2" />
          </svg>
          <div className="w-full flex gap-4">
            <svg viewBox="0 0 100 50" className="w-1/2 h-16 opacity-60">
               <path d={`M ${Array.from({length: 100}).map((_, i) => `${i} ${25 + Math.sin(i * freq1 * 0.05 * 2) * 15}`).join(' L ')}`} fill="none" stroke="#6366f1" strokeWidth="2" />
            </svg>
            <svg viewBox="0 0 100 50" className="w-1/2 h-16 opacity-60">
               <path d={`M ${Array.from({length: 100}).map((_, i) => `${i} ${25 + Math.sin(i * freq2 * 0.05 * 2) * 15}`).join(' L ')}`} fill="none" stroke="#f43f5e" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      <div className="shrink-0 space-y-4 relative z-20">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-indigo-400">Frequency 1 (Hz)</label>
            <span className="text-sm font-bold text-white">{freq1}</span>
          </div>
          <input 
            type="range" min="1" max="10" step="1" 
            value={freq1} 
            onChange={(e) => setFreq1(Number(e.target.value))} 
            className="w-full accent-indigo-500" 
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-rose-400">Frequency 2 (Hz)</label>
            <span className="text-sm font-bold text-white">{freq2}</span>
          </div>
          <input 
            type="range" min="1" max="10" step="1" 
            value={freq2} 
            onChange={(e) => setFreq2(Number(e.target.value))} 
            className="w-full accent-rose-500" 
          />
        </div>
      </div>
    </>
  );
}
  const renderSim = () => {
    if (!simData) return <NetForceSim />;
    switch (simData.title) {
      case 'Shopping Cart Dynamics': return <NetForceSim />;
      case 'Orbital Mechanics': return <OrbitalMechanicsSim />;
      case 'Chemical Kinetics': return <ChemicalKineticsSim />;
      case 'Circuit Flow Analysis': return <CircuitFlowSim />;
      case 'Fluid Dynamics': return <FluidDynamicsSim />;
      case 'Quantum Superposition': return <QuantumSim />;
      case 'Cellular Mitosis': return <CellularMitosisSim />;
      case 'Neural Network Training': return <NeuralNetworkSim />;
      case 'Fourier Transform': return <FourierTransformSim />;
      case 'Particle Collider': return <ParticleCollisionSim />;
      default: return <NetForceSim />;
    }
  };

  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4 shrink-0 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-100 mb-1">{simData?.title || 'Interactive Simulation'}</h3>
          <p className="text-sm text-slate-400">{simData?.category || 'Net Force & Kinematics'}</p>
        </div>
        <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs font-bold border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
          HD / 3D MODE
        </div>
      </div>
      
      {renderSim()}
      
    </div>
  );
}
