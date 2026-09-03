import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ViewType } from '../Sidebar';

interface CounterexampleProps {
  className?: string;
  onViewChange?: (view: ViewType) => void;
  activeModifiers?: string[];
}

export function Counterexample({ className, onViewChange, activeModifiers = [] }: CounterexampleProps) {
  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-slate-100 mb-1">Counterexample Generated</h3>
        <p className="text-sm text-slate-400">ECHO created a new situation</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col p-3 relative overflow-hidden">
          <div className="text-center mb-2 relative z-10">
            <span className="text-xs font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">Same Force (20 N)</span>
            <div className="w-16 h-0.5 bg-emerald-500 mx-auto mt-2 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-emerald-500"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 top-8 z-0">
            <img referrerPolicy="no-referrer" 
              src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=400&auto=format&fit=crop" 
              alt="Cart 20kg" 
              className="w-full h-full object-cover opacity-60 mix-blend-screen scale-150 translate-y-4"
              style={{ filter: 'brightness(0.7) sepia(0.3) hue-rotate(180deg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
          </div>
          
          <div className="flex-1"></div>
          <div className="text-center mt-2 relative z-10">
            <span className="text-xs text-slate-400 bg-slate-950/80 px-1 rounded">Mass</span>
            <div className="text-sm font-bold text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded inline-block mt-0.5">20 kg</div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)] flex flex-col p-3 relative overflow-hidden">
          <div className="text-center mb-2 relative z-10">
            <span className="text-xs font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">Same Force (20 N)</span>
            <div className="w-16 h-0.5 bg-emerald-500 mx-auto mt-2 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-emerald-500"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 top-8 z-0">
            <img referrerPolicy="no-referrer" 
              src="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=400&auto=format&fit=crop" 
              alt="Cart 40kg" 
              className="w-full h-full object-cover opacity-80 mix-blend-screen scale-150 translate-y-4"
              style={{ filter: 'brightness(0.9) sepia(0.5) hue-rotate(20deg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
          </div>

          <div className="flex-1"></div>
          <div className="text-center mt-2 relative z-10">
            <span className="text-xs text-slate-400 bg-slate-950/80 px-1 rounded">Mass</span>
            <div className="text-sm font-bold text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded inline-block mt-0.5">40 kg</div>
          </div>
        </div>
      </div>
      
      {activeModifiers.length > 0 && (
        <div className="border border-slate-700/50 rounded-xl bg-slate-950 p-4 mb-4 text-center animate-in zoom-in-95 duration-200">
          {activeModifiers.includes('Relativistic') ? (
            <>
              <h4 className="text-white font-medium mb-1 text-sm">Relativistic Speeds</h4>
              <p className="text-xs text-slate-400">As the object approaches the speed of light, its relativistic mass increases, requiring exponentially more force for the same acceleration.</p>
            </>
          ) : activeModifiers.includes('Air Resistance') ? (
            <>
              <h4 className="text-white font-medium mb-1 text-sm">Terminal Velocity</h4>
              <p className="text-xs text-slate-400">Air resistance increases with speed until it equals the applied force. Net force becomes zero, and speed becomes constant.</p>
            </>
          ) : (
            <>
              <h4 className="text-white font-medium mb-1 text-sm">Variable Mass</h4>
              <p className="text-xs text-slate-400">Like a rocket consuming fuel, as mass decreases over time with constant thrust, acceleration increases.</p>
            </>
          )}
        </div>
      )}

      <div className="mt-auto">
        <p className="text-sm font-medium text-slate-200 mb-3">What happens now?</p>
        <button 
          onClick={() => onViewChange?.('simulations')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
        >
          Try Again <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

