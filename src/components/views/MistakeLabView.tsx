import React, { useState } from 'react';
import { MistakeLab } from '../dashboard/MistakeLab';
import { Counterexample } from '../dashboard/Counterexample';
import { useUI } from '../../context/UIContext';
import { ViewType } from '../Sidebar';
import { cn } from '../../lib/utils';

interface MistakeLabViewProps {
  onViewChange?: (view: ViewType) => void;
}

export function MistakeLabView({ onViewChange }: MistakeLabViewProps) {
  const { showToast } = useUI();
  const [activeModifiers, setActiveModifiers] = useState<string[]>([]);

  const toggleModifier = (mod: string, message: string) => {
    setActiveModifiers(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
    showToast(activeModifiers.includes(mod) ? `Removed ${mod} modifier.` : message);
  };
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 fade-in h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mistake Lab</h1>
        <p className="text-slate-400">Safe environment to stress-test your assumptions and break your mental models constructively.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MistakeLab className="h-auto" activeModifiers={activeModifiers} hideHeader={true} />
          
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Current Hypothesis</h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-medium italic mb-4">
              "If I apply a constant force to an object, its speed will increase proportionally forever."
            </div>
            
            <h4 className="text-sm font-medium text-slate-400 mb-3">Stress Testing Tools</h4>
            <div className="space-y-2">
              <button 
                onClick={() => toggleModifier('Air Resistance', "Applying Air Resistance modifier...")}
                className={cn("w-full text-left px-4 py-3 rounded-lg text-sm flex justify-between items-center transition-colors border", activeModifiers.includes('Air Resistance') ? "bg-slate-700 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-slate-800 hover:bg-slate-700 border-transparent text-slate-300")}
              >
                <span>Add Air Resistance</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-400">Variable</span>
              </button>
              <button 
                onClick={() => toggleModifier('Variable Mass', "Applying Variable Mass modifier...")}
                className={cn("w-full text-left px-4 py-3 rounded-lg text-sm flex justify-between items-center transition-colors border", activeModifiers.includes('Variable Mass') ? "bg-slate-700 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-slate-800 hover:bg-slate-700 border-transparent text-slate-300")}
              >
                <span>Change Mass to Variable</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-400">Edge Case</span>
              </button>
              <button 
                onClick={() => toggleModifier('Relativistic', "Applying Relativistic physics rules...")}
                className={cn("w-full text-left px-4 py-3 rounded-lg text-sm flex justify-between items-center transition-colors border", activeModifiers.includes('Relativistic') ? "bg-indigo-900/50 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]" : "bg-slate-800 hover:bg-slate-700 border-transparent text-slate-300")}
              >
                <span>Approach Speed of Light</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded">Relativistic</span>
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <Counterexample className="h-[600px]" onViewChange={onViewChange} activeModifiers={activeModifiers} />
        </div>
      </div>
    </div>
  );
}
