const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/LiveSimulation.tsx', 'utf-8');

if (!code.includes('io(')) {
  code = code.replace(
    "import * as THREE from 'three';",
    "import * as THREE from 'three';\nimport { io, Socket } from 'socket.io-client';"
  );
}

const particleSimRegex = /function ParticleCollisionSim\(\) \{[\s\S]*?return \([\s\S]*?<\/>\);\n\}/m;
const match = code.match(particleSimRegex);

if (match) {
  const newSim = `function ParticleCollisionSim() {
  const [particleCount, setParticleCount] = useState(100);
  const [speed, setSpeed] = useState(1);
  const [users, setUsers] = useState(1);
  const [cursors, setCursors] = useState<Record<string, {x: number, y: number}>>({});
  const socketRef = useRef<Socket | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.emit("join_sim", "particle_collider");

    socket.on("user_count", (count: number) => setUsers(count));
    
    socket.on("sim_param_update", (params: any) => {
      if (params.particleCount !== undefined) setParticleCount(params.particleCount);
      if (params.speed !== undefined) setSpeed(params.speed);
    });

    socket.on("remote_cursor", ({ id, cursor }: any) => {
      setCursors(prev => ({ ...prev, [id]: cursor }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateParams = (newCount: number, newSpeed: number) => {
    setParticleCount(newCount);
    setSpeed(newSpeed);
    socketRef.current?.emit("sim_param_change", { 
      room: "particle_collider", 
      params: { particleCount: newCount, speed: newSpeed } 
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    socketRef.current?.emit("cursor_move", { room: "particle_collider", cursor: { x, y } });
  };
  
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
      
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="flex-1 bg-slate-950 rounded-xl border border-slate-800/50 mb-5 relative overflow-hidden min-h-[350px] cursor-crosshair"
      >
        {/* Remote Cursors Overlay */}
        {Object.entries(cursors).map(([id, pos]) => (
          <div key={id} className="absolute pointer-events-none z-50 transition-all duration-75" style={{ left: \`\${pos.x}%\`, top: \`\${pos.y}%\`, transform: 'translate(-50%, -50%)' }}>
            <div className="w-3 h-3 bg-rose-500 rounded-full opacity-60 shadow-[0_0_12px_rgba(244,63,94,1)] ring-2 ring-white/50" />
            <div className="text-[9px] text-white/70 absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/50 px-1 rounded">Peer</div>
          </div>
        ))}
        
        {/* Active Users Badge */}
        <div className="absolute top-4 right-4 z-20 bg-slate-900/80 border border-slate-700 backdrop-blur-md text-xs text-emerald-400 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="font-semibold">{users}</span> User{users !== 1 ? 's' : ''} Online
        </div>

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
            <label className="text-sm font-medium text-sky-400">Particle Count (Synced)</label>
            <span className="text-sm font-bold text-white">{particleCount}</span>
          </div>
          <input 
            type="range" min="10" max="1000" step="10" 
            value={particleCount} 
            onChange={(e) => updateParams(Number(e.target.value), speed)} 
            className="w-full accent-sky-500" 
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-rose-400">Kinetic Energy (Synced)</label>
            <span className="text-sm font-bold text-white">{speed.toFixed(1)}x</span>
          </div>
          <input 
            type="range" min="0.1" max="5" step="0.1" 
            value={speed} 
            onChange={(e) => updateParams(particleCount, Number(e.target.value))} 
            className="w-full accent-rose-500" 
          />
        </div>
      </div>
    </>
  );
}`;

  code = code.replace(match[0], newSim);
  fs.writeFileSync('src/components/dashboard/LiveSimulation.tsx', code);
}
