import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Orbit, 
  BrainCircuit, 
  Atom, 
  Flame, 
  Sparkles, 
  Activity, 
  BookOpen, 
  Compass, 
  FlaskConical, 
  Command, 
  X,
  ArrowRight
} from 'lucide-react';
import { ViewType } from './Sidebar';
import { cn } from '../lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewType) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Simulation' | 'Cognitive Tools';
  icon: any;
  view: ViewType;
  shortcut?: string;
}

const COMMANDS: CommandItem[] = [
  { id: 'home', title: 'Dashboard Overview', category: 'Navigation', icon: Compass, view: 'home', shortcut: '1' },
  { id: 'challenge', title: 'Challenge ECHO Socratic Engine', category: 'Cognitive Tools', icon: Sparkles, view: 'challenge-echo', shortcut: '2' },
  { id: 'map', title: 'Cognitive Topology Map', category: 'Cognitive Tools', icon: BrainCircuit, view: 'map', shortcut: '3' },
  { id: 'forecast', title: 'Future Mistake Forecast', category: 'Cognitive Tools', icon: Activity, view: 'forecast', shortcut: '4' },
  { id: 'mistake-lab', title: 'Empirical Mistake Lab', category: 'Cognitive Tools', icon: FlaskConical, view: 'mistake-lab', shortcut: '5' },
  { id: 'simulations', title: '3D Interactive Physics Suite', category: 'Simulation', icon: Orbit, view: 'simulations', shortcut: '6' },
  { id: 'evidence', title: 'Evidence Ledger & Proofs', category: 'Cognitive Tools', icon: BookOpen, view: 'evidence', shortcut: '7' },
  { id: 'progress', title: 'Mastery & Growth Metrics', category: 'Navigation', icon: Activity, view: 'progress', shortcut: '8' },
  { id: 'notebook', title: 'Socratic Epistemic Notebook', category: 'Navigation', icon: BookOpen, view: 'notebook', shortcut: '9' },
];

export function CommandPalette({ isOpen, onClose, onSelectView }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelectView(filteredCommands[selectedIndex].view);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onSelectView, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search simulations, Socratic diagnostics, cognitive views... (Esc to exit)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching commands or simulations found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    onSelectView(cmd.view);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                    isSelected ? "bg-indigo-600/20 text-white border border-indigo-500/30" : "text-slate-300 hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border",
                      isSelected ? "bg-indigo-500/30 border-indigo-400/50 text-indigo-300" : "bg-slate-800 border-slate-700 text-slate-400"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">{cmd.title}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">{cmd.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-400 rounded">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate: ↑ ↓ • Select: Enter</span>
          <span className="text-indigo-400">ECHO Command Center</span>
        </div>
      </div>
    </div>
  );
}
