import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Hello! I am ECHO, your AI Copilot. I can help you analyze your learning metrics or dive deeper into any of the physics simulations. What are we working on today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setInput(transcript);
        };

        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = () => setIsListening(false);
      }
    }
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    
    // Remove markdown asterisks and hash marks for speech
    const cleanText = text.replace(/[*#_]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }] })
      });
      
      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'model', content: data.text }]);
        speakText(data.text);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm having trouble connecting right now. Let's try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all",
          "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] max-h-[80vh] z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">ECHO Copilot</h3>
                  <p className="text-xs text-indigo-400/80">Google AI Studio Engine</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    if (voiceEnabled) window.speechSynthesis.cancel();
                  }}
                  className={cn("p-1.5 rounded-md transition-colors", voiceEnabled ? "text-indigo-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-800")}
                  title={voiceEnabled ? "Mute ECHO" : "Unmute ECHO"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-md transition-colors hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "self-end items-end" : "self-start items-start")}>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-br-sm" 
                      : "bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-sm"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.role === 'user' ? 'You' : 'ECHO'}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="self-start flex flex-col max-w-[85%]">
                  <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700/50 rounded-bl-sm flex items-center gap-2">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-indigo-500" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-indigo-500" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask ECHO anything..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-20 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white disabled:opacity-50 disabled:hover:text-slate-400 transition-colors bg-slate-700 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
