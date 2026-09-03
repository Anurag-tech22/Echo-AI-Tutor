import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ViewType } from '../Sidebar';

interface UnderstandingMapProps {
  className?: string;
  onViewChange?: (view: ViewType) => void;
}

export function UnderstandingMap({ className, onViewChange }: UnderstandingMapProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}>
      <div className="flex items-center justify-between z-10 mb-6">
        <h3 className="text-lg font-medium text-slate-100 flex items-center gap-2">
          Understanding Map <Info className="w-4 h-4 text-slate-500" />
        </h3>
        <button 
          onClick={() => onViewChange?.('map')}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="flex-1 relative min-h-[250px] w-full mt-4 flex items-center justify-center">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.1))' }}>
          <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="20%" y2="35%" stroke="#1e293b" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="80%" y2="35%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="#1e293b" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Nodes */}
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
          <Node label="First Law" score={90} status="strong" onClick={() => setActiveNode('First Law')} active={activeNode === 'First Law'} />
        </div>
        
        <div className="absolute top-[35%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-20">
          <Node label="Third Law" score={76} status="medium" onClick={() => setActiveNode('Third Law')} active={activeNode === 'Third Law'} />
        </div>
        
        <div className="absolute top-[35%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-20">
          <Node label="Second Law" score={58} status="fragile" hasWarning onClick={() => setActiveNode('Second Law')} active={activeNode === 'Second Law'} />
        </div>
        
        <div className="absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-20">
          <Node label="Applications" score={64} status="medium" onClick={() => setActiveNode('Applications')} active={activeNode === 'Applications'} />
        </div>
        
        <div className="absolute top-[80%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-20">
          <Node label="Real World Scenarios" score={82} status="strong" onClick={() => setActiveNode('Real World Scenarios')} active={activeNode === 'Real World Scenarios'} />
        </div>

        {/* Center Node */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30">
          <div onClick={() => setActiveNode('Newton\'s Laws')} className={cn("w-24 h-24 rounded-full border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:scale-105 transition-all", activeNode === 'Newton\'s Laws' ? "bg-slate-800 scale-110 ring-2 ring-white/20" : "bg-slate-900")}>
            <span className="text-sm font-medium text-white leading-tight">Newton's Laws</span>
            <span className="text-lg text-indigo-400 mt-1">78%</span>
          </div>
        </div>
      </div>
      
      {activeNode && (
        <div className="mt-4 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 animate-in slide-in-from-bottom-2 duration-300">
          <h4 className="text-white font-medium mb-1">{activeNode}</h4>
          <p className="text-sm text-slate-300">
            {activeNode === 'Second Law' 
              ? "Your understanding here is fragile. You frequently confuse mass with weight in calculations."
              : activeNode === 'Newton\'s Laws'
              ? "Overall mastery is good, but pulled down by specific misconceptions in F=ma."
              : "You show solid conceptual grasp in this area. Keep it up!"}
          </p>
          {activeNode === 'Second Law' && (
             <button onClick={() => onViewChange?.('mistake-lab')} className="mt-3 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors">
               Practice in Mistake Lab
             </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-6 mt-auto pt-4 border-t border-slate-800/60 z-10">
        <LegendItem color="bg-emerald-500" label="Strong" />
        <LegendItem color="bg-amber-500" label="Medium" />
        <LegendItem color="bg-rose-500" label="Fragile" />
      </div>
    </div>
  );
}

function Node({ label, score, status, hasWarning, onClick, active }: { label: string; score: number; status: 'strong' | 'medium' | 'fragile', hasWarning?: boolean, onClick?: () => void, active?: boolean }) {
  const colors = {
    strong: 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    medium: 'border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    fragile: 'border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
  };

  return (
    <div className="relative group cursor-pointer hover:scale-110 transition-transform" onClick={onClick}>
      {hasWarning && (
        <div className="absolute -top-1 -right-1 z-20 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white">
          <span className="text-[10px] font-bold">!</span>
        </div>
      )}
      <div className={cn("w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center p-1 text-center transition-all", colors[status], active ? "bg-slate-800 scale-110 ring-2 ring-white/20" : "bg-slate-900")}>
        <span className="text-[10px] font-medium leading-tight text-slate-300 group-hover:text-white transition-colors">{label}</span>
        <span className="text-sm font-semibold mt-0.5">{score}%</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)}></div>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}
