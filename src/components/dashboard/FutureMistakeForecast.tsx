import React from 'react';
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
