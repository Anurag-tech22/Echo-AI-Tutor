import React from 'react';
import { Activity, TrendingUp, Target, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 74 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 78 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 92 },
];

export function ProgressView() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 fade-in h-full flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
          <p className="text-slate-400">Track your cognitive growth and mastery levels over time.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-400 w-fit">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">+14% this week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Current Streak', value: '7 Days', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-500/30' },
          { label: 'Concepts Mastered', value: '42', icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-500/30' },
          { label: 'Total XP', value: '12,450', icon: Award, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/30' },
        ].map((stat, i) => (
          <div key={i} className={`bg-slate-900/60 border ${stat.border} rounded-2xl p-6 backdrop-blur-md flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-slate-200 mb-6">Mastery Trajectory</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
