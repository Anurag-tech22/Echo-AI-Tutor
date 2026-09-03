import React from 'react';
import { 
  Home, Map, TrendingUp, Microscope, 
  Activity, BookOpen, ShieldAlert,
  Settings, HelpCircle, Diamond, Target
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUI } from '../context/UIContext';

export type ViewType = 'home' | 'map' | 'forecast' | 'mistake-lab' | 'simulations' | 'evidence' | 'progress' | 'notebook' | 'challenge-echo';

const navItems: { icon: any, label: string, id: ViewType }[] = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Map, label: 'Understanding Map', id: 'map' },
  { icon: Target, label: 'Forecast', id: 'forecast' },
  { icon: Microscope, label: 'Mistake Lab', id: 'mistake-lab' },
  { icon: ShieldAlert, label: 'Challenge ECHO (AI)', id: 'challenge-echo' },
  { icon: Activity, label: 'Simulations', id: 'simulations' },
  { icon: BookOpen, label: 'Evidence', id: 'evidence' },
  { icon: TrendingUp, label: 'Progress', id: 'progress' },
  { icon: Settings, label: 'Notebook', id: 'notebook' },
];

export function Sidebar({ currentView, onViewChange }: { currentView: ViewType, onViewChange: (view: ViewType) => void }) {
  const { openModal } = useUI();

  return (
    <aside className="w-64 bg-slate-900/50 border-r border-slate-800/50 flex flex-col backdrop-blur-sm hidden md:flex shrink-0">
      <div 
        className="p-6 flex items-center gap-3 cursor-pointer group"
        onClick={() => onViewChange('home')}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center transition-transform group-hover:scale-105">
          <div className="w-4 h-4 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white group-hover:text-indigo-200 transition-colors">ECHO</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Predictive Learning</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              currentView === item.id
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
            )}
          >
            <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-indigo-400" : "text-slate-500")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-b from-indigo-900/20 to-slate-900/50 border border-indigo-500/10 relative overflow-hidden">
          <div className="absolute -top-2 -right-2 p-3 opacity-10"><Diamond className="w-16 h-16" /></div>
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5 uppercase tracking-wide">
              <Diamond className="w-3.5 h-3.5 text-indigo-400" />
              ECHO Premium
            </h3>
            <p className="text-[11px] text-slate-400 mt-1.5 mb-3 leading-snug">Unlock advanced simulations and detailed AI insights.</p>
            <button onClick={() => openModal('upgrade')} className="w-full py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded text-xs font-medium transition-all">
              Upgrade
            </button>
          </div>
        </div>
        
        <div className="mt-4 space-y-1">
          <button onClick={() => openModal('settings')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
            <Settings className="w-5 h-5 text-slate-500" /> Settings
          </button>
          <button onClick={() => openModal('help')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
            <HelpCircle className="w-5 h-5 text-slate-500" /> Help & Support
          </button>
        </div>
      </div>
    </aside>
  );
}
