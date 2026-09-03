import React, { useState } from 'react';
import { Atom, Flame, Zap, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUI } from '../context/UIContext';

export function Topbar() {
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { openModal, showToast } = useUI();

  return (
    <header className="h-20 px-6 md:px-8 flex items-center justify-between shrink-0 border-b border-slate-800/30">
      <div>
        <h2 className="text-2xl font-medium text-slate-100 flex items-center gap-2">
          Good evening, Arjun <span className="text-xl">👋</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">Let's strengthen your understanding today.</p>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button 
            onClick={() => setShowSubjectMenu(!showSubjectMenu)}
            className="hidden md:flex items-center bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full px-4 py-2 transition-colors cursor-pointer"
          >
            <Atom className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-sm font-medium text-slate-200">Physics</span>
            <div className="ml-4 pl-4 border-l border-slate-700">
              <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showSubjectMenu ? "rotate-180" : "")} />
            </div>
          </button>
          
          {showSubjectMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => { setShowSubjectMenu(false); showToast("Switched to Physics workspace."); }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-sm font-medium text-slate-200 flex items-center gap-2"
                >
                  <Atom className="w-4 h-4 text-purple-400" /> Physics
                </button>
                <button 
                  onClick={() => { setShowSubjectMenu(false); showToast("Switched to Mathematics workspace."); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Mathematics
                </button>
                <button 
                  onClick={() => { setShowSubjectMenu(false); showToast("Switched to Computer Science workspace."); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Computer Science
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gemini 3.6 Engine Online</span>
          </div>

          <button onClick={() => showToast("You've earned 150 XP today!")} className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full px-4 py-2 transition-colors">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">1200 XP</span>
          </button>
          
          <button onClick={() => showToast("Complete a simulation to extend your streak!")} className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full px-4 py-2 transition-colors">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-slate-200">7 Day Streak</span>
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 hover:border-indigo-500/50 overflow-hidden ml-2 shrink-0 transition-colors"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=b6e3f4" alt="Profile" className="w-full h-full object-cover" />
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-4 border-b border-slate-800">
                <p className="text-sm font-medium text-slate-200">Arjun</p>
                <p className="text-xs text-slate-400 mt-0.5">arjun@example.com</p>
              </div>
              <div className="p-2 space-y-1">
                <button onClick={() => { setShowProfileMenu(false); openModal('profile'); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-300 flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4 text-slate-400" /> Your Profile
                </button>
                <button onClick={() => { setShowProfileMenu(false); openModal('settings'); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-300 flex items-center gap-2 transition-colors">
                  <Settings className="w-4 h-4 text-slate-400" /> Settings
                </button>
                <div className="h-px bg-slate-800 my-1"></div>
                <button onClick={() => { setShowProfileMenu(false); openModal('profile'); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-rose-400 hover:text-rose-300 flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
