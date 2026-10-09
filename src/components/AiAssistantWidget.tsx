import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareHeart,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Bot,
  User,
  Heart,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { ChatMessage, CheckInRecord } from '../types';
import { soundEngine } from '../utils/audio';

interface AiAssistantWidgetProps {
  latestCheckIn?: CheckInRecord;
  onLaunchActivity: (activity: 'breathing' | 'reframe' | 'grounding' | 'gratitude' | 'stretch') => void;
  onOpenCrisisModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  latestCheckIn,
  onLaunchActivity,
  onOpenCrisisModal,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'widget-init',
      role: 'assistant',
      content:
        'Hello! I am your **ManasMitra AI Assistant** 🌱.\n\nI am here by your side as you navigate your day. How is your mind and body feeling right now?',
      timestamp: Date.now(),
      suggestedActions: [
        { label: '🧘 2-Min Calm Down', action: 'breathing' },
        { label: '🏮 Release a Worry', action: 'worry' },
        { label: '🌿 Sensory Grounding', action: 'grounding' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        // Speech recognition not supported
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        soundEngine.playChime('medium');
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: latestCheckIn
            ? {
                mood: latestCheckIn.mood,
                energy: latestCheckIn.energy,
                sleepHours: latestCheckIn.sleepHours,
                activityMinutes: latestCheckIn.activityMinutes,
                wellbeingScore: latestCheckIn.calculatedScore,
              }
            : undefined,
        }),
      });

      const data = await response.json();
      soundEngine.playChime('medium');

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || "I'm listening. Take a slow, comforting breath.",
        timestamp: Date.now(),
        suggestedActions: data.suggestedActions || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Widget chat error:', error);
      const fallback: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content:
          "It takes wisdom to acknowledge feelings of stress or fatigue. Let's take a 2-minute pause together to ground your thoughts.",
        timestamp: Date.now(),
        suggestedActions: [
          { label: '🧘 2-Min Box Breathing', action: 'breathing' },
          { label: '🌿 5-4-3-2-1 Grounding', action: 'grounding' },
        ],
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string, label: string) => {
    if (action === 'breathing') {
      onLaunchActivity('breathing');
    } else if (action === 'reframe') {
      onLaunchActivity('reframe');
    } else if (action === 'grounding') {
      onLaunchActivity('grounding');
    } else if (action === 'gratitude') {
      onLaunchActivity('gratitude');
    } else if (action === 'stretch') {
      onLaunchActivity('stretch');
    } else if (action === 'worry') {
      onNavigateTab('sanctuary');
    } else {
      handleSend(label);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Gentle greeting pill */}
          <div
            onClick={() => setIsOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 border border-stone-200/90 text-stone-700 text-xs font-semibold shadow-lg hover:shadow-xl cursor-pointer hover:border-emerald-400 transition-all backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need a calm moment? <strong>Ask ManasMitra AI</strong></span>
          </div>

          {/* Main Floating Avatar Button */}
          <button
            onClick={() => {
              setIsOpen(true);
              soundEngine.playChime('medium');
            }}
            title="Chat with ManasMitra AI Assistant"
            className="group relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-xl shadow-emerald-700/30 flex items-center justify-center hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white"
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-2xl bg-emerald-500/30 blur-sm group-hover:blur-md transition-all animate-pulse" />
            <span className="relative text-2xl group-hover:scale-110 transition-transform">
              🌱
            </span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[9px] font-bold text-amber-950">
              ✨
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-[72px]' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-3.5 px-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg shadow-2xs">
                🌱
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-white">ManasMitra AI Assistant</h3>
                  <span className="text-[9px] bg-emerald-400 text-emerald-950 font-extrabold px-1.5 py-0.2 rounded-full">
                    SDG 3
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Supportive Reflection Companion</span>
                </div>
              </div>
            </div>

            {/* Window controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close AI Assistant"
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User state context badge */}
          {!isMinimized && latestCheckIn && (
            <div className="bg-stone-50 border-b border-stone-200/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-stone-600 shrink-0">
              <span className="flex items-center gap-1">
                <span>Current State:</span>
                <strong className="capitalize text-emerald-800">{latestCheckIn.mood}</strong>
              </span>
              <span>Well-Being: <strong>{latestCheckIn.calculatedScore}/100</strong></span>
            </div>
          )}

          {/* Messages Stream */}
          {!isMinimized && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-stone-50/50 to-white text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex gap-2 max-w-[88%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[10px] ${
                        msg.role === 'user' ? 'bg-stone-800 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {msg.role === 'user' ? <User className="w-3 h-3" /> : '🌱'}
                    </div>

                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-emerald-700 text-white rounded-tr-xs font-medium shadow-2xs'
                          : 'bg-white text-stone-800 border border-stone-200 shadow-2xs rounded-tl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Suggested actions chips */}
                      {msg.role === 'assistant' &&
                        msg.suggestedActions &&
                        msg.suggestedActions.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                            {msg.suggestedActions.map((act, i) => (
                              <button
                                key={i}
                                onClick={() => handleActionClick(act.action, act.label)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold transition-all hover:scale-102"
                              >
                                {act.label}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                  <span className="text-[9px] text-stone-400 mt-0.5 px-8">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs animate-pulse">
                    🌱
                  </div>
                  <div className="bg-white border border-stone-200 p-2.5 rounded-2xl flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-stone-500 font-medium ml-1">Reflecting...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick topic buttons */}
          {!isMinimized && messages.length <= 3 && (
            <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  'Overwhelmed with deadlines',
                  'Need a 2-min calm breath',
                  'Trouble unwinding for sleep',
                  'Feeling disconnected today',
                ].map((txt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(txt)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-300 text-[10px] whitespace-nowrap transition-colors"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat input form */}
          {!isMinimized && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for advice, reflect on feelings..."
                disabled={isLoading}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-500"
              />

              {/* Speech-to-text mic button if available */}
              {recognitionRef.current && (
                <button
                  type="button"
                  onClick={toggleListening}
                  title={isListening ? 'Stop listening' : 'Speak hands-free'}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                      : 'border-stone-200 bg-stone-50 text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Safety strip footer */}
          {!isMinimized && (
            <div className="bg-stone-50/80 px-3 py-1 text-[10px] text-stone-400 border-t border-stone-100 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Non-clinical companion</span>
              </span>
              <button
                onClick={onOpenCrisisModal}
                className="text-rose-600 hover:underline font-semibold"
              >
                24/7 Helplines
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
