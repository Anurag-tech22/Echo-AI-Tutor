import React from 'react';
import { Brain, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ReasoningXRay({ className }: { className?: string }) {
  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}>
      <div className="mb-4 shrink-0">
        <h3 className="text-lg font-medium text-slate-100 mb-1">Reasoning X-Ray</h3>
        <p className="text-sm text-slate-400">AI analysis of your thinking</p>
      </div>
      
      <div className="flex-1 flex items-center justify-between mb-4 gap-4">
        <div className="w-28 h-28 sm:w-32 sm:h-32 relative flex items-center justify-center shrink-0">
          <img referrerPolicy="no-referrer" 
             src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop" 
             alt="Brain X-Ray" 
             className="absolute w-full h-full object-cover mix-blend-screen opacity-90 rounded-2xl shadow-xl"
            style={{ filter: 'hue-rotate(180deg) brightness(1.2)' }}
          />
          {/* Decorative glowing nodes on brain */}
          <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)] z-10"></div>
          <div className="absolute bottom-6 right-6 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,1)] z-10"></div>
          <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)] -translate-x-1/2 -translate-y-1/2 z-10"></div>
        </div>
        
        <div className="flex-1 space-y-3">
          <XRayItem label="Concept" value="Partial" status="warning" />
          <XRayItem label="Logic" value="Unstable" status="warning" />
          <XRayItem label="Assumption" value="Incorrect" status="error" />
          <XRayItem label="Transfer" value="Uncertain" status="warning" />
        </div>
      </div>
      
      <div className="mt-auto shrink-0 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your answer is correct in this case, but your reasoning assumes force always changes speed directly. Let's test that idea.
        </p>
      </div>
    </div>
  );
}

function XRayItem({ label, value, status }: { label: string; value: string; status: 'warning' | 'error' | 'success' }) {
  const styles = {
    warning: { text: 'text-amber-400', icon: AlertCircle, bg: 'bg-amber-400/10' },
    error: { text: 'text-rose-400', icon: XCircle, bg: 'bg-rose-500/10' },
    success: { text: 'text-emerald-400', icon: AlertCircle, bg: 'bg-emerald-500/10' }
  };
  
  const current = styles[status];
  const Icon = current.icon;
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs sm:text-sm font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className={cn("text-xs sm:text-sm font-semibold", current.text)}>{value}</span>
        <div className={cn("w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center", current.bg, current.text)}>
          <Icon className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
