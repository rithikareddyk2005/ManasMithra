import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Heart,
  Wind,
  Brain,
  ListOrdered,
  RefreshCw,
  ShieldCheck,
  Smile,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, CheckInRecord } from '../types';
import { soundEngine } from '../utils/audio';

interface AiCompanionProps {
  latestCheckIn?: CheckInRecord;
  onLaunchActivity: (activity: 'breathing' | 'reframe' | 'grounding' | 'gratitude' | 'stretch') => void;
  onOpenCrisisModal: () => void;
}

export const AiCompanion: React.FC<AiCompanionProps> = ({
  latestCheckIn,
  onLaunchActivity,
  onOpenCrisisModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Namaste and welcome. I am **ManasMitra**, your SDG 3 personal well-being companion 🌱.\n\nI am here to help you reflect on your feelings, explore daily balance, and offer gentle coping micro-actions. Whether you are navigating study deadlines, low energy, or simply want to pause and breathe—how is your mind and body feeling right now?`,
      timestamp: Date.now(),
      suggestedActions: [
        { label: '🧘 2-Min Box Breathing', action: 'breathing' },
        { label: '💭 Unpack a Heavy Thought', action: 'reframe' },
        { label: '🌿 5-4-3-2-1 Grounding', action: 'grounding' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
        content: data.reply || "I am right here with you. Let's take a slow, gentle breath together.",
        timestamp: Date.now(),
        suggestedActions: data.suggestedActions || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content:
          "It sounds like you are carrying a lot right now. Remember that well-being happens in micro-steps. Would you like to pause for a 2-minute breathing exercise, or write down your priority list?",
        timestamp: Date.now(),
        suggestedActions: [
          { label: '🧘 2-Min Box Breathing', action: 'breathing' },
          { label: '🌿 5-4-3-2-1 Grounding', action: 'grounding' },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string, label: string) => {
    if (action === 'breathing' || action === 'calm') {
      onLaunchActivity('breathing');
    } else if (action === 'reframe' || action === 'reflect') {
      onLaunchActivity('reframe');
    } else if (action === 'grounding') {
      onLaunchActivity('grounding');
    } else if (action === 'gratitude') {
      onLaunchActivity('gratitude');
    } else if (action === 'stretch' || action === 'movement') {
      onLaunchActivity('stretch');
    } else if (action === 'organize' || action === 'priorities') {
      handleSend(`Let's organize my top priorities step-by-step so I don't feel overwhelmed.`);
    } else {
      handleSend(label);
    }
  };

  const starters = [
    { label: '📚 Overwhelmed by workload & deadlines', text: "I've been feeling stressed because I have too many assignments and deadlines piling up." },
    { label: '🔋 Low physical energy & mental fog', text: "I woke up feeling drained with low energy and heavy brain fog today." },
    { label: '💤 Trouble unwinding before bed', text: "Can you help me build a realistic 15-minute evening wind-down routine for better sleep?" },
    { label: '🌧️ Feeling disconnected from others', text: "I've been feeling somewhat isolated and having trouble reaching out to people." },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4.5 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-xs">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base tracking-tight">ManasMitra Reflection Companion</h2>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                SDG 3.4
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-medium">
              Preventive self-reflection & action companion • Not for clinical diagnosis
            </p>
          </div>
        </div>

        {/* User Context Badge if available */}
        {latestCheckIn && (
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs backdrop-blur-xs border border-white/10">
            <span className="text-emerald-200">Today's State:</span>
            <span className="font-bold capitalize">{latestCheckIn.mood}</span>
            <span className="text-emerald-300">•</span>
            <span>Indicator: <strong>{latestCheckIn.calculatedScore}/100</strong></span>
          </div>
        )}
      </div>

      {/* Safety Notice Strip */}
      <div className="bg-stone-50 border-b border-stone-200 px-6 py-2 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Non-clinical well-being companion. Private & local to your device session.</span>
        </div>
        <button
          onClick={onOpenCrisisModal}
          className="text-rose-600 hover:text-rose-700 font-semibold hover:underline flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" /> In crisis? 24/7 Helplines
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-stone-50/50 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-stone-800 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : '🌱'}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-xs shadow-sm font-medium'
                    : 'bg-white text-stone-800 border border-stone-200 shadow-sm rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Suggested Action Chips (if provided by AI) */}
                {msg.role === 'assistant' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-2">
                    <span className="w-full text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      Suggested Next Micro-Actions:
                    </span>
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act.action, act.label)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all hover:scale-102 flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 px-11">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-stone-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm animate-pulse">
              🌱
            </div>
            <div className="bg-white border border-stone-200 p-3 rounded-2xl flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-stone-500 font-medium ml-1">ManasMitra is reflecting...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts (if chat is short) */}
      {messages.length <= 3 && (
        <div className="px-6 py-2 bg-stone-50/80 border-t border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 mb-1.5">
            Suggested Conversation Starters:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {starters.map((st, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(st.text)}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-400 text-stone-700 hover:text-emerald-800 text-xs font-medium whitespace-nowrap transition-colors shadow-2xs"
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-white border-t border-stone-200 flex items-center gap-3 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share how you're feeling, your current stressor, or ask for a calming micro-action..."
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-700/20 transition-all hover:scale-102"
        >
          <span>Share</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
