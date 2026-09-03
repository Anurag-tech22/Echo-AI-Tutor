import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUI } from '../../context/UIContext';
import { ViewType } from '../Sidebar';

export function TransferChallenge({ className, onViewChange }: { className?: string, onViewChange?: (view: ViewType) => void }) {
  const { showToast } = useUI();
  
  const challenges = [
    { 
      label: 'Bicycle', 
      status: 'completed',
      imgUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=200&auto=format&fit=crop',
      filter: 'hue-rotate(90deg) brightness(1.2)'
    },
    { 
      label: 'Cricket', 
      status: 'completed',
      imgUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=200&auto=format&fit=crop',
      filter: 'brightness(1.5) sepia(0.5)'
    },
    { 
      label: 'Rocket', 
      status: 'completed',
      imgUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=200&auto=format&fit=crop',
      filter: 'brightness(1.5)'
    },
    { 
      label: 'Game Physics', 
      status: 'completed',
      imgUrl: 'https://images.unsplash.com/photo-1600069226367-466ae446e1be?q=80&w=200&auto=format&fit=crop',
      filter: 'hue-rotate(180deg) brightness(1.2)'
    },
  ];

  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-100 mb-1">Transfer Challenge</h3>
        <p className="text-sm text-slate-400">New context, same concept</p>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-3">
        {challenges.map((c, i) => (
          <div key={i} className="flex flex-col items-center">
            <button 
              onClick={() => {
                showToast(`Reviewing ${c.label} challenge...`);
                onViewChange?.('mistake-lab');
              }}
              className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 relative group hover:border-emerald-500/50 hover:bg-slate-700 transition-all overflow-hidden cursor-pointer"
            >
              <img referrerPolicy="no-referrer" 
                src={c.imgUrl} 
                alt={c.label} 
                className="w-full h-full object-cover opacity-80 mix-blend-screen scale-110 group-hover:scale-125 transition-transform duration-300" 
                style={{ filter: c.filter }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent opacity-60 rounded-2xl pointer-events-none"></div>
            </button>
            <span className="text-xs font-medium text-slate-300 mb-1 text-center">{c.label}</span>
            <span className="text-[10px] text-emerald-400 mb-1">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
