import React, { useState, useEffect, useRef } from 'react';
import { Activity, Cpu, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export function PerformanceHUD() {
  const [fps, setFps] = useState(60);
  const [gpuName, setGpuName] = useState('WebGL 2.0 Accelerated');
  const [latency, setLatency] = useState<number | null>(34);
  const [isExpanded, setIsExpanded] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    // 1. Detect Hardware GPU Renderer via WebGL Context
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer) {
            // Simplify lengthy strings (e.g., ANGLE (NVIDIA GeForce RTX 3080 ...))
            const clean = renderer.replace(/ANGLE \((.*)\)/, '$1').split(',')[0];
            setGpuName(clean);
          }
        }
      }
    } catch (e) {
      // Ignore if headless or restricted
    }

    // 2. Real-time FPS Tracker using requestAnimationFrame
    let animId: number;
    const updateFps = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animId = requestAnimationFrame(updateFps);
    };

    animId = requestAnimationFrame(updateFps);

    // 3. API Ping Latency Poller
    const checkLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/healthz');
        const rtt = Math.round(performance.now() - start);
        setLatency(rtt);
      } catch (e) {
        setLatency(null);
      }
    };

    checkLatency();
    const interval = setInterval(checkLatency, 15000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-300 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "w-2 h-2 rounded-full",
              fps >= 55 ? "bg-emerald-400 animate-pulse" : fps >= 30 ? "bg-amber-400" : "bg-rose-400"
            )} />
            <span className="font-mono font-bold text-white">{fps} FPS</span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{latency !== null ? `${latency}ms` : 'offline'}</span>
          </div>

          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {isExpanded && (
          <div className="px-3 pb-2.5 pt-1 border-t border-slate-800/80 space-y-1.5 font-mono text-[10px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">ACCELERATION:</span>
              <span className="text-indigo-300 truncate max-w-[160px]" title={gpuName}>{gpuName}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">ENGINE:</span>
              <span className="text-emerald-400">Gemini 3.6 Flash</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">SOLVER:</span>
              <span className="text-cyan-400">4th-Order Runge-Kutta</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
