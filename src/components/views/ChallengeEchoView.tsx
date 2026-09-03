import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BrainCircuit, ChevronDown, ChevronUp, ShieldAlert, Cpu } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../../lib/utils';

interface CognitiveTrace {
  stage: string;
  hypothesis: string;
  detectedInvariants: string[];
  fragilityScore: number;
  strategy: string;
}

export function ChallengeEchoView() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello Arjun. I noticed you struggled with the mass-independence of acceleration in free fall. Care to defend your reasoning?" },
    { role: 'user', content: "Well, a heavier object has more gravitational force acting on it. Force = mass * acceleration, so more force should mean more acceleration." },
    { role: 'assistant', content: "Your formula is correct, F = ma. And you're right that a heavier object experiences more gravitational force. But let's look closer at that equation. If we rearrange it to solve for acceleration (a), what do we get?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTrace, setActiveTrace] = useState<CognitiveTrace | null>({
    stage: "Physical Invariant Decomposition",
    hypothesis: "Mass proportionality in gravitational acceleration",
    detectedInvariants: ["Newtonian Gravitation", "Inertial Equivalence Principle"],
    fragilityScore: 0.68,
    strategy: "Empirical Counterexample Interrogation"
  });
  const [showTrace, setShowTrace] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    const updatedMessages = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Placeholder for incoming streaming assistant reply
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming failed, fallback to standard route');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = '';
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split('\n\n');
        streamBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.replace(/^data: /, '');

          try {
            const parsed = JSON.parse(jsonStr);

            if (parsed.type === 'trace') {
              setActiveTrace({
                stage: parsed.stage,
                hypothesis: parsed.hypothesis,
                detectedInvariants: parsed.detectedInvariants || [],
                fragilityScore: parsed.fragilityScore || 0.5,
                strategy: parsed.strategy,
              });
            } else if (parsed.type === 'chunk' && parsed.text) {
              assistantText += parsed.text;
              setMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: 'assistant', content: assistantText };
                return next;
              });
            } else if (parsed.type === 'error') {
              throw new Error(parsed.error);
            }
          } catch (e) {
            // Ignore parse errors on partial frames
          }
        }
      }
    } catch (error: any) {
      // Fallback to legacy endpoint if SSE fails
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        });
        const data = await res.json();
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: data.text || 'Connection re-established.' };
          return next;
        });
      } catch (err) {
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: "An error occurred while connecting to the Socratic engine." };
          return next;
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col fade-in">
      {/* Top Header */}
      <div className="mb-4 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            Challenge ECHO
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">
              Neural Streaming Core
            </span>
          </h1>
          <p className="text-slate-400 text-sm">Dialectic interrogation engine stress-testing student mental models.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl text-indigo-400 text-xs font-medium">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Socratic Session Online</span>
        </div>
      </div>

      {/* DeepMind-Style Cognitive Trace Accordion */}
      {activeTrace && (
        <div className="mb-4 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md shadow-lg transition-all">
          <button
            onClick={() => setShowTrace(!showTrace)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-white tracking-wide uppercase font-mono text-[11px]">
                ECHO Cognitive Reasoning Trace
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{activeTrace.stage}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Cognitive Fragility:</span>
                <span className={cn(
                  "font-mono font-bold px-2 py-0.5 rounded text-[11px]",
                  activeTrace.fragilityScore > 0.6
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : activeTrace.fragilityScore > 0.3
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                )}>
                  {Math.round(activeTrace.fragilityScore * 100)}%
                </span>
              </div>
              {showTrace ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {showTrace && (
            <div className="px-4 pb-3.5 pt-1 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Assessed Hypothesis</span>
                <p className="text-slate-300 italic font-mono text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  "{activeTrace.hypothesis}"
                </p>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">Audited Physical Invariants</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTrace.detectedInvariants.map((inv, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Active Socratic Strategy</span>
                  <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    {activeTrace.strategy}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-lg",
                msg.role === 'assistant' 
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" 
                  : "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-md",
                msg.role === 'assistant'
                  ? "bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-none"
                  : "bg-indigo-600 border border-indigo-500 text-white rounded-tr-none shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              )}>
                {msg.role === 'assistant' ? (
                  msg.content ? (
                    <div className="markdown-body prose prose-invert prose-sm">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-indigo-300 py-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      <span className="text-xs font-mono">Synthesizing Socratic probe...</span>
                    </div>
                  )
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="State your physical hypothesis or counter-argument..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
