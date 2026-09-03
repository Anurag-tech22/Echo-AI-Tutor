import React, { useState } from 'react';
import { Play, Filter, Search, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { LiveSimulation } from '../dashboard/LiveSimulation';

export function SimulationsView() {
  const { showToast } = useUI();
  const [activeSimulation, setActiveSimulation] = useState<any>(null);
  
  const sims = [
    { title: 'Shopping Cart Dynamics', category: 'Physics', img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=600&auto=format&fit=crop', color: 'indigo' },
    { title: 'Particle Collider', category: 'Thermodynamics', img: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&auto=format&fit=crop', color: 'sky' },,
    { title: 'Orbital Mechanics', category: 'Astrophysics', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', color: 'emerald' },
    { title: 'Chemical Kinetics', category: 'Chemistry', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop', color: 'amber' },
    { title: 'Circuit Flow Analysis', category: 'Electronics', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop', color: 'rose' },
    { title: 'Fluid Dynamics', category: 'Physics', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop', color: 'indigo' },
    { title: 'Quantum Superposition', category: 'Quantum Physics', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop', color: 'purple' },
    { title: 'Cellular Mitosis', category: 'Biology', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop', color: 'rose' },
    { title: 'Neural Network Training', category: 'Computer Science', img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop', color: 'emerald' },
    { title: 'Fourier Transform', category: 'Mathematics', img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop', color: 'amber' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 fade-in h-full flex flex-col relative">
      {activeSimulation && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md rounded-2xl border border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-xl font-bold text-white">{activeSimulation.title}</h2>
            <button 
              onClick={() => setActiveSimulation(null)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <LiveSimulation simData={activeSimulation} className="flex-1 h-full" />
          </div>
        </div>
      )}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Simulations Library</h1>
          <p className="text-slate-400">Interactive environments to test your understanding across domains.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search simulations..." 
              className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors w-64"
            />
          </div>
          <button 
            onClick={() => showToast("Filters opened")}
            className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sims.map((sim, i) => (
          <div 
            key={i} 
            onClick={() => setActiveSimulation(sim)}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md group cursor-pointer hover:border-slate-600 transition-all"
          >
            <div className="h-48 w-full relative overflow-hidden">
              <img 
                src={sim.img} 
                alt={sim.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                style={{ filter: `brightness(0.8) contrast(1.2)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-2 py-1 rounded bg-${sim.color}-500/20 text-${sim.color}-300 border border-${sim.color}-500/30 backdrop-blur-sm`}>
                  {sim.category}
                </span>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center pl-1 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <Play className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">{sim.title}</h3>
              <p className="text-sm text-slate-400">Interactive sandbox environment to visualize and manipulate key variables.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
