import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../../lib/utils';

export function ChallengeEchoView() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello Arjun. I noticed you struggled with the mass-independence of acceleration in free fall. Care to defend your reasoning?" },
    { role: 'user', content: "Well, a heavier object has more gravitational force acting on it. Force = mass * acceleration, so more force should mean more acceleration." },
    { role: 'assistant', content: "Your formula is correct, F = ma. And you're right that a heavier object experiences more gravitational force. But let's look closer at that equation. If we rearrange it to solve for acceleration (a), what do we get?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error || "I'm having trouble connecting."}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred while trying to respond." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col fade-in">
      <div className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Challenge ECHO</h1>
          <p className="text-slate-400">Engage in Socratic dialogue with your AI mentor to solidify your reasoning.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-xl text-indigo-400">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Active Socratic Session</span>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4 max-w-[80%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg",
                msg.role === 'assistant' 
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" 
                  : "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'assistant'
                  ? "bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none"
                  : "bg-indigo-600 border border-indigo-500 text-white rounded-tr-none shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              )}>
                {msg.role === 'assistant' ? (
                  <div className="markdown-body prose prose-invert prose-sm">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg bg-indigo-500/20 border-indigo-500/50 text-indigo-400">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl text-sm bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Construct your argument..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg flex items-center justify-center text-white transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
