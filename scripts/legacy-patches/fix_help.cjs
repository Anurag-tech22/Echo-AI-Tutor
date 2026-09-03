const fs = require('fs');
let content = fs.readFileSync('src/components/ui-layer/Modals.tsx', 'utf-8');

// The Help & Support modal
const oldHelp = `{activeModal === 'help' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="p-2 bg-slate-800 rounded-lg"><HelpCircle className="w-5 h-5 text-indigo-400" /></div>
              <h2 className="text-xl font-semibold text-white">Help & Support</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">Need assistance with your learning journey? We're here to help.</p>
            <div className="space-y-3">
              <button onClick={() => showToast("Opening documentation...")} className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors">
                Read the Documentation
              </button>
              <button onClick={() => showToast("Starting live chat session...")} className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors">
                Contact Support Team
              </button>
              <button onClick={() => showToast("Opening community forums...")} className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-sm font-medium text-slate-200 transition-colors">
                Community Forums
              </button>
            </div>
          </div>
        )}`;

const newHelp = `{activeModal === 'help' && (
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
        )}`;

if (content.includes("Read the Documentation") && content.includes("Help & Support")) {
  content = content.replace(oldHelp, newHelp);
  if (!content.includes('ExternalLink')) {
    content = content.replace("import { X, Settings, HelpCircle, LogOut, CheckCircle2 }", "import { X, Settings, HelpCircle, LogOut, CheckCircle2, ExternalLink, Mail, MessageSquare }");
  }
  fs.writeFileSync('src/components/ui-layer/Modals.tsx', content);
  console.log('Fixed Help modal');
} else {
  console.log('Help modal text not found as expected');
}

