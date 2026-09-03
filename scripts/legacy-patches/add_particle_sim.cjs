const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/LiveSimulation.tsx', 'utf-8');

const importReplacement = `import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Zap, BrainCircuit, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Line, Text, InstancedRigidBodies, Physics, RigidBody } from '@react-three/drei';
import * as THREE from 'three';`;

content = content.replace(/import React, \{ useState, useEffect, useRef \} from 'react';\nimport \{ Play, Pause, RotateCcw, Maximize2, Zap, BrainCircuit, Activity \} from 'lucide-react';\nimport \{ cn \} from '\.\.\/\.\.\/lib\/utils';\nimport \{ Canvas, useFrame \} from '@react-three\/fiber';\nimport \{ OrbitControls, Stars, Sphere, Line, Text \} from '@react-three\/drei';\nimport \* as THREE from 'three';/, importReplacement);

const newSim = `
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
      <AINarrator text={\`Simulating \${particleCount} particles inside a bounded volume. Adjust velocity to observe thermodynamic properties like pressure and temperature increase.\`} />
      
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
`;

content = content.replace("function QuantumSim() {", newSim + "\nfunction QuantumSim() {");

content = content.replace(
  "case 'Fourier Transform': return <FourierTransformSim />;",
  "case 'Fourier Transform': return <FourierTransformSim />;\n      case 'Particle Collider': return <ParticleCollisionSim />;"
);

fs.writeFileSync('src/components/dashboard/LiveSimulation.tsx', content);
