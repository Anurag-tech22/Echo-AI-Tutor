import React from 'react';
import { useUI } from '../../context/UIContext';
import { X, Settings, HelpCircle, Diamond, LogOut, CheckCircle2, ExternalLink, Mail, MessageSquare } from 'lucide-react';

export function GlobalModals() {
  const { activeModal, closeModal, showToast, settings, updateSettings } = useUI();

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {activeModal === 'upgrade' && (
          <div className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <Diamond className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade to ECHO Premium</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Unlock advanced Socratic simulations, detailed progression analytics, and personalized AI mentoring to perfect your understanding.
            </p>
            <ul className="space-y-3 mb-8">
              {['Unlimited Mistake Lab scenarios', 'Real-time knowledge tracking', 'Advanced AI tutoring'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => {
                showToast("Redirecting to secure checkout...");
                closeModal();
              }}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Start 7-Day Free Trial
            </button>
          </div>
        )}

        {activeModal === 'settings' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="p-2 bg-slate-800 rounded-lg"><Settings className="w-5 h-5 text-indigo-400" /></div>
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Appearance & Accessibility</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Dark Mode</span>
                  <div 
                    onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${settings.darkMode ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.darkMode ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">High Contrast Text</span>
                  <div 
                    onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${settings.highContrast ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.highContrast ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800/50">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notifications</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Email Notifications</span>
                  <div 
                    onClick={() => updateSettings({ notifications: !settings.notifications })}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${settings.notifications ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800/50">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Privacy & Data</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Share Analytics Data</span>
                  <div 
                    onClick={() => updateSettings({ dataSharing: !settings.dataSharing })}
                    className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${settings.dataSharing ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.dataSharing ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                showToast("Settings saved successfully.");
                closeModal();
              }}
              className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
            >
              Done
            </button>
          </div>
        )}

        {activeModal === 'help' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="p-2 bg-slate-800 rounded-lg"><HelpCircle className="w-5 h-5 text-indigo-400" /></div>
              <h2 className="text-xl font-semibold text-white">Help & Support</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">Need assistance with your learning journey? We're here to help.</p>
            <div className="space-y-3 flex flex-col">
              <a href="https://github.com/google/generative-ai-docs" target="_blank" rel="noopener noreferrer" className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center justify-between group">
                <span>Read the Documentation</span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </a>
              <button onClick={() => {
                showToast("Support email opened!");
                window.open('mailto:support@example.com', '_blank');
              }} className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center justify-between group">
                <span>Contact Support Team</span>
                <Mail className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors flex items-center justify-between group">
                <span>Community Forums</span>
                <MessageSquare className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </a>
            </div>
          </div>
        )}

        {activeModal === 'profile' && (
          <div className="p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden mb-4">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=b6e3f4" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">Arjun</h2>
            <p className="text-sm text-slate-400 mb-6">arjun@example.com</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Streak</div>
                <div className="text-lg font-bold text-slate-200">7 Days</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">XP</div>
                <div className="text-lg font-bold text-slate-200">1200</div>
              </div>
            </div>

            <button 
              onClick={() => {
                showToast("Signing out...");
                closeModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl font-medium transition-colors border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
