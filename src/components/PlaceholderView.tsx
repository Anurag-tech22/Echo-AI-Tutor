import React from 'react';
import { Settings, HelpCircle, Lock } from 'lucide-react';
import { ViewType } from './Sidebar';

export function PlaceholderView({ view }: { view: ViewType }) {
  const titles = {
    'map': 'Understanding Map',
    'forecast': 'Future Mistake Forecast',
    'mistake-lab': 'Mistake Lab',
    'simulations': 'Live Simulations',
    'evidence': 'Learning Evidence',
    'progress': 'Your Progress',
    'notebook': 'Notebook',
    'challenge-echo': 'Challenge ECHO'
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg relative overflow-hidden group">
         <div className="absolute inset-0 bg-indigo-500/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
         <Lock className="w-8 h-8 text-slate-500 relative z-10" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-200 mb-2">{titles[view as keyof typeof titles]}</h2>
      <p className="text-slate-400 mb-8">
        This feature is locked in the current demo mode. Navigate back to Home to experience the primary learning loop.
      </p>
      
      <div className="grid grid-cols-2 gap-4 w-full">
        <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-300 transition-colors">
          <Settings className="w-4 h-4 text-slate-500" /> Settings
        </button>
        <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium text-slate-300 transition-colors">
          <HelpCircle className="w-4 h-4 text-slate-500" /> Learn More
        </button>
      </div>
    </div>
  );
}
