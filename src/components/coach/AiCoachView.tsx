import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  Compass,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { Property, BirthProfile } from '../../types';

interface AiCoachViewProps {
  property: Property;
  overallScore: number;
  birthProfile?: BirthProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  source?: string;
  recommendations?: string[];
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  property,
  overallScore,
  birthProfile,
}) => {
  const [coachMode, setCoachMode] = useState<'QUICK' | 'DETAILED' | 'SCHOLAR' | 'ARCHITECT'>('DETAILED');
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG_INIT',
      sender: 'coach',
      text: `Namaste! I am your AI Vaastu Coach for **${property.name}**. 

I have analyzed your **${property.propertyType}** layout (Facing: ${property.facingDirection}, Overall Score: ${overallScore}/100) across ${property.rooms.length} mapped spaces.

How can I assist your architectural or spatial alignment decisions today?`,
      timestamp: 'Just now',
      source: 'ERIK-HUB Vaastu Knowledge Engine',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    'Is my kitchen in the right sector?',
    'What are my top 3 highest-priority improvements?',
    'Analyze my main entrance according to 32 Pada Mandala',
    'How do I remedy toilet placement without demolition?',
    'Explain the Brahmasthan rule according to Brihat Samhita',
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `USER_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          coachMode,
          propertyContext: {
            name: property.name,
            type: property.propertyType,
            facing: property.facingDirection,
            northRotation: property.northRotation,
            score: overallScore,
            rooms: property.rooms.map((r) => ({ name: r.name, type: r.type, x: r.x, y: r.y })),
            birthDetails: birthProfile?.consented ? birthProfile : null,
          },
        }),
      });

      const data = await response.json();
      const coachMsg: ChatMessage = {
        id: `COACH_${Date.now()}`,
        sender: 'coach',
        text: data.answer || 'I could not retrieve an answer at this moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        recommendations: data.recommendations,
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `COACH_ERR_${Date.now()}`,
        sender: 'coach',
        text: 'Our spatial intelligence model is temporarily unavailable. Based on classical treatises (Mayamata & Brihat Samhita), maintaining kitchen in South-East, master bedroom in South-West, and keeping the central Brahmasthan open will protect harmony.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] max-w-5xl mx-auto pb-4">
      {/* Header Bar */}
      <div className="bg-white rounded-t-2xl border border-stone-200 p-4 border-b-0 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Conversational AI Vaastu Coach
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                Live Spatial Context
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Grounded in classical Sanskrit treatises, modern architectural physics, and your active floor plan.
            </p>
          </div>
        </div>

        {/* Coach Mode Selector */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          {(
            [
              { id: 'QUICK', label: 'Quick' },
              { id: 'DETAILED', label: 'Detailed' },
              { id: 'SCHOLAR', label: 'Scholar (Sanskrit)' },
              { id: 'ARCHITECT', label: 'Architect' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => setCoachMode(m.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                coachMode === m.id
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-stone-50 border-x border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-stone-900 text-amber-300 shadow-2xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-none'
                  : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="pt-2 mt-2 border-t border-stone-100 space-y-1">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                    Suggested Remedies & Actions:
                  </div>
                  {msg.recommendations.map((rec, i) => (
                    <div key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`flex items-center justify-between text-[10px] pt-1 ${
                  msg.sender === 'user' ? 'text-amber-200' : 'text-stone-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.source && <span>Engine: {msg.source}</span>}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-500 shadow-2xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Vaastu AI Coach is formulating recommendations based on your layout...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-white border-x border-stone-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-stone-400 whitespace-nowrap">
          Quick Ask:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-stone-100 hover:bg-amber-50 hover:text-amber-900 text-stone-700 text-xs whitespace-nowrap transition-colors border border-stone-200"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="bg-white rounded-b-2xl border border-stone-200 p-3 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask about room placements, entrance padas, elemental remedies, or Sanskrit shlokas..."
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
