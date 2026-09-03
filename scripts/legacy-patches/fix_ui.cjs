const fs = require('fs');

// Fix FutureMistakeForecast
let fmf = `import React from 'react';
import { TriangleAlert, Info, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ViewType } from '../Sidebar';

interface FutureMistakeForecastProps {
  className?: string;
  onViewChange?: (view: ViewType) => void;
}

export function FutureMistakeForecast({ className, onViewChange }: FutureMistakeForecastProps) {
  return (
    <div className={cn("bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col h-full", className)}>
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="flex items-center justify-between z-10 mb-5 shrink-0">
        <h3 className="text-lg font-medium text-slate-100 flex items-center gap-2">
          Future Mistake Forecast <Info className="w-4 h-4 text-slate-500" />
        </h3>
      </div>
      
      <div className="flex flex-col flex-1 z-10 relative h-full">
        <div className="flex items-start justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
            <TriangleAlert className="w-4 h-4" />
            <span className="text-sm font-medium">High probability of mistake</span>
          </div>
          <span className="text-4xl font-light text-rose-400">84%</span>
        </div>
        
        <div className="flex gap-4 flex-1 items-center">
          <div className="flex flex-col space-y-3 flex-1 max-w-[55%] h-full justify-center">
            <div>
              <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Concept</h4>
              <p className="text-sm font-medium text-slate-200 line-clamp-1">Newton's Second Law</p>
            </div>
            
            <div>
              <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Predicted Misconception</h4>
              <p className="text-xs text-slate-100 leading-relaxed font-medium line-clamp-2">
                You may assume that increasing force directly increases speed.
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Why ECHO thinks this</h4>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                You solved direct force problems correctly but struggled when mass and context changed.
              </p>
            </div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center shrink-0">
            {/* Realistic 3D Crystal Ball Image - contained cleanly */}
            <div className="w-32 h-32 md:w-36 md:h-36 relative rounded-full overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.3)] border border-indigo-500/20 shrink-0">
              <img referrerPolicy="no-referrer"
                 src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop"
                 alt="Crystal Ball"
                 className="w-full h-full object-cover mix-blend-screen opacity-90 scale-110"
                 style={{ filter: 'brightness(1.1) contrast(1.1) hue-rotate(240deg)' }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onViewChange?.('mistake-lab')}
        className="w-full mt-4 shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] z-10"
      >
        Test My Prediction <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
`;

fs.writeFileSync('src/components/dashboard/FutureMistakeForecast.tsx', fmf);

// Fix ReasoningXRay
let rxray = `import React from 'react';
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
`;

fs.writeFileSync('src/components/dashboard/ReasoningXRay.tsx', rxray);
