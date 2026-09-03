import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Droplets, Target, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ViewType } from '../Sidebar';

interface MistakeLabProps {
  className?: string;
  onViewChange?: (view: ViewType) => void;
  activeModifiers?: string[];
  hideHeader?: boolean;
}

export function MistakeLab({ className, onViewChange, activeModifiers = [], hideHeader = false }: MistakeLabProps) {
  const [activeMode, setActiveMode] = useState<string>('Normal Case');

  const handleModeClick = (mode: string) => {
    setActiveMode(mode);
    onViewChange?.('mistake-lab');
  };

  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-y-auto backdrop-blur-md flex flex-col", className)}>
      {!hideHeader && (<div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-slate-100">Mistake Lab</h3>
        <button 
          onClick={() => onViewChange?.('mistake-lab')}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          Why Mistake Lab?
        </button>
      </div>)}

      <p className="text-sm text-slate-400 mb-6">Choose a mode to stress-test your understanding</p>

      <div className="grid grid-cols-2 gap-3">
        <LabModeCard 
          icon={ClipboardList} 
          title="Normal Case" 
          desc="Standard problem" 
          active={activeMode === 'Normal Case'}
          onClick={() => handleModeClick('Normal Case')}
          color="emerald" 
        />
        <LabModeCard 
          icon={Droplets} 
          title="Edge Case" 
          desc="Change key variables" 
          active={activeMode === 'Edge Case'}
          onClick={() => handleModeClick('Edge Case')}
          color="amber" 
        />
        <LabModeCard 
          icon={Target} 
          title="Counterexample" 
          desc="Challenge assumptions" 
          active={activeMode === 'Counterexample'}
          onClick={() => handleModeClick('Counterexample')}
          color="rose" 
        />
        <LabModeCard 
          icon={MessageSquare} 
          title="Explain It" 
          desc="Teach in your words" 
          active={activeMode === 'Explain It'}
          onClick={() => handleModeClick('Explain It')}
          color="purple" 
        />
      </div>
    </div>
  );
}

function LabModeCard({ icon: Icon, title, desc, active, color, onClick }: { icon: any, title: string, desc: string, active?: boolean, color: 'emerald' | 'amber' | 'rose' | 'purple', onClick: () => void }) {
  const colorMap = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:border-amber-500/50',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:border-purple-500/50',
  };
  
  const defaultColors = 'text-slate-400 border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800';

  return (
    <motion.button 
      onClick={onClick}
      className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all min-h-[120px]", active ? colorMap[color] : defaultColors)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors", active ? 'bg-current/10' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700')}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className={cn("text-sm font-medium mb-1 transition-colors", active ? 'text-white' : 'text-slate-200')}>{title}</h4>
      <p className="text-xs opacity-70 leading-tight">{desc}</p>
    </motion.button>
  );
}
