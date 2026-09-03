import React, { useState, useEffect } from 'react';
import { Atom, Flame, Zap, ChevronDown, User, LogOut, Settings, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUI } from '../context/UIContext';
import { sound } from '../lib/soundFx';
import { triggerConfetti } from '../lib/confetti';

export function Topbar() {
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const { openModal, showToast } = useUI();

  useEffect(() => {
    return sound.subscribe((muted) => setIsMuted(muted));
  }, []);

  const handleSoundToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playPop();
    showToast(muted ? "Sound effects muted." : "Sound effects enabled.");
  };

  const handleXpClick = (e: React.MouseEvent) => {
    sound.playVictory();
    triggerConfetti(e.clientX, e.clientY, 100);
    showToast("🎉 Level 4 Scholar! +150 XP bonus unlocked today!");
  };

  const handleStreakClick = (e: React.MouseEvent) => {
    sound.playPop();
    triggerConfetti(e.clientX, e.clientY, 60);
    showToast("🔥 7-Day Socratic Streak! You're in the top 1% of active thinkers!");
  };

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
            onClick={() => { sound.playPop(); setShowSubjectMenu(!showSubjectMenu); }}
            className="hidden md:flex items-center bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full px-4 py-2 transition-colors cursor-pointer"
          >
            <Atom className="w-4 h-4 text-purple-400 mr-2 animate-spin-slow" />
            <span className="text-sm font-medium text-slate-200">Physics</span>
            <div className="ml-4 pl-4 border-l border-slate-700">
              <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showSubjectMenu ? "rotate-180" : "")} />
            </div>
          </button>
          
          {showSubjectMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => { sound.playPop(); setShowSubjectMenu(false); showToast("Switched to Physics workspace."); }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 text-sm font-medium text-slate-200 flex items-center gap-2"
                >
                  <Atom className="w-4 h-4 text-purple-400" /> Physics
                </button>
                <button 
                  onClick={() => { sound.playPop(); setShowSubjectMenu(false); showToast("Switched to Mathematics workspace."); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Mathematics
                </button>
                <button 
                  onClick={() => { sound.playPop(); setShowSubjectMenu(false); showToast("Switched to Computer Science workspace."); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Computer Science
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {/* Sound FX Toggle Button */}
          <button
            onClick={handleSoundToggle}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute Sound FX" : "Mute Sound FX"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Quick Search */}
          <button
            onClick={() => { sound.playPop(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true })); }}
            className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Global Command Center (Ctrl+K or Cmd+K)"
          >
            <span>Command Center</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
              ⌘K
            </kbd>
          </button>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ECHO Core Online</span>
          </div>

          {/* Gamified XP Button */}
          <button 
            onClick={handleXpClick} 
            className="flex items-center gap-2 bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 rounded-full px-4 py-2 transition-all cursor-pointer hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.15)] group"
            title="Click to celebrate XP progress!"
          >
            <Zap className="w-4 h-4 text-amber-400 group-hover:animate-bounce" />
            <span className="text-sm font-semibold text-amber-300">1200 XP</span>
          </button>
          
          {/* Gamified Animated Fire Streak Button */}
          <button 
            onClick={handleStreakClick} 
            className="flex items-center gap-2 bg-slate-900 border border-orange-500/30 hover:border-orange-500/60 rounded-full px-4 py-2 transition-all cursor-pointer hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.15)] group"
            title="Click to celebrate your 7-Day Streak!"
          >
            <div className="relative">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
            </div>
            <span className="text-sm font-semibold text-orange-300">7 Day Streak</span>
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
