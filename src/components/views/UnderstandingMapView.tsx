import React from 'react';
import { UnderstandingMap } from '../dashboard/UnderstandingMap';
import { useUI } from '../../context/UIContext';
import { ViewType } from '../Sidebar';

interface UnderstandingMapViewProps {
  onViewChange?: (view: ViewType) => void;
}

export function UnderstandingMapView({ onViewChange }: UnderstandingMapViewProps) {
  const { showToast } = useUI();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Understanding Map</h1>
        <p className="text-slate-400">Explore your knowledge graph and conceptual dependencies. Master foundational nodes to unlock advanced concepts.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[600px]">
          <UnderstandingMap className="h-full w-full" onViewChange={onViewChange} />
        </div>
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Node Details</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-indigo-400">Newton's Laws</h4>
                  <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">78% Mastery</span>
                </div>
                <p className="text-sm text-slate-400">Core foundational concept for Classical Mechanics. Prerequisite for Kinematics and Dynamics.</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-emerald-400">First Law</h4>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">90% Mastery</span>
                </div>
                <p className="text-sm text-slate-400">Inertia and reference frames. You have demonstrated strong understanding across 12 different contexts.</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-rose-400">Second Law</h4>
                  <span className="text-xs font-bold bg-rose-500/20 text-rose-300 px-2 py-1 rounded">58% Mastery</span>
                </div>
                <p className="text-sm text-slate-400">Force, mass, and acceleration relationship. You struggle when mass variables change dynamically.</p>
                <button 
                  onClick={() => {
                    showToast("Loading Review Module for Second Law...");
                    onViewChange?.('mistake-lab');
                  }}
                  className="mt-3 w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-lg transition-colors"
                >
                  Review Concept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
