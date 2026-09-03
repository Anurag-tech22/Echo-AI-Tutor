const fs = require('fs');

let code = fs.readFileSync('src/components/AICopilot.tsx', 'utf-8');

// Add Mic, MicOff, Volume2, VolumeX to imports
if (!code.includes('Mic, MicOff')) {
  code = code.replace(
    'import { MessageSquare, X, Send, Bot, User, Sparkles } from \'lucide-react\';',
    'import { MessageSquare, X, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX } from \'lucide-react\';'
  );
}

const stateToAdd = `
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
`;

if (!code.includes('isListening')) {
  code = code.replace(
    'const messagesEndRef = useRef<HTMLDivElement>(null);',
    'const messagesEndRef = useRef<HTMLDivElement>(null);\n' + stateToAdd
  );
}

if (!code.includes('speakText(data.text)')) {
  code = code.replace(
    'setMessages(prev => [...prev, { role: \'model\', content: data.text }]);',
    'setMessages(prev => [...prev, { role: \'model\', content: data.text }]);\n        speakText(data.text);'
  );
}

// Add voice toggle button and mic button
const headerButtons = `
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
`;

if (!code.includes('Mute ECHO')) {
  code = code.replace(
    /<button[^>]*onClick=\{\(\) => setIsOpen\(false\)\}[^>]*>[\s\S]*?<X className="w-5 h-5" \/>\s*<\/button>/m,
    headerButtons
  );
}

const micButton = `
                <button 
                  onClick={toggleListening}
                  className={cn("absolute right-10 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors", 
                    isListening ? "text-rose-400 bg-rose-500/10 animate-pulse" : "text-slate-400 hover:text-white hover:bg-slate-700"
                  )}
                  title="Speak"
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleSend}
`;

if (!code.includes('toggleListening')) {
  code = code.replace(
    '<button \n                  onClick={handleSend}',
    micButton
  );
}

// Ensure the input has enough right padding for 2 buttons
code = code.replace('pr-12 text-sm', 'pr-20 text-sm');

fs.writeFileSync('src/components/AICopilot.tsx', code);
