import { cn } from '../../lib/utils';
import React from 'react';
import { ArrowUp, ChevronRight, Activity, TriangleAlert } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ViewType } from '../Sidebar';

const data = [
  { name: 'Understood', value: 78, color: '#0ea5e9' }, // sky-500
  { name: 'Remaining', value: 22, color: '#1e293b' }, // slate-800
];

interface YourUnderstandingProps {
  className?: string;
  onViewChange?: (view: ViewType) => void;
}

export function YourUnderstanding({ onViewChange, className }: YourUnderstandingProps) {
  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col relative overflow-hidden backdrop-blur-md", className)}>
      <h3 className="text-lg font-medium text-slate-100 mb-6">Your Understanding Today</h3>
      
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-light text-white tracking-tighter">78%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 text-center leading-tight">Overall<br/>Understanding</span>
          </div>
        </div>

        <div className="flex flex-col gap-5 flex-1 ml-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-400">Strong Concepts</span>
              <Activity className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-medium text-white leading-none">12</span>
              <span className="text-xs text-emerald-400 flex items-center mb-0.5"><ArrowUp className="w-3 h-3" /></span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-500 w-[80%] rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-400">Fragile Concepts</span>
              <TriangleAlert className="w-3 h-3 text-rose-400" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-medium text-white leading-none">3</span>
              <span className="text-xs text-amber-500 flex items-center mb-0.5"><ArrowUp className="w-3 h-3" /></span>
            </div>
            <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-rose-500 w-[20%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-800/60 mb-4">
        <div>
          <span className="text-xs text-slate-400 block mb-1">Concepts Explored</span>
          <span className="text-lg text-slate-200 font-medium">24</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Predictions Tested</span>
          <span className="text-lg text-slate-200 font-medium">7</span>
        </div>
      </div>

      <div className="mt-auto">
        <span className="text-xs text-slate-400 mb-2 block">Next Best Action</span>
        <button 
          onClick={() => onViewChange?.('map')}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-between group border border-slate-700/50"
        >
          Strengthen Newton's Second Law
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}
