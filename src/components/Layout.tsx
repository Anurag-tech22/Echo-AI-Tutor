import React from 'react';
import { Sidebar, ViewType } from './Sidebar';
import { Topbar } from './Topbar';
import { useUI } from '../context/UIContext';

export function Layout({ children, currentView, onViewChange }: { children: React.ReactNode, currentView: ViewType, onViewChange: (view: ViewType) => void }) {
  const { settings } = useUI();
  
  return (
    <div className={`flex h-screen overflow-hidden font-sans ${settings.darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} ${settings.highContrast ? 'contrast-125' : ''}`}>
      <Sidebar currentView={currentView} onViewChange={onViewChange} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
