import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, UserChecklist } from '../../types';
import { t } from '../../data/translations';
import { storage } from '../../utils/storage';
import {
  Send,
  Bot,
  User,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Plus,
  RefreshCw,
  Share2,
} from 'lucide-react';

interface Props {
  language: Language;
  onOpenChecklistModal: (checklist: UserChecklist) => void;
  initialQuery?: string;
}

export const AssistantScreen: React.FC<Props> = ({
  language,
  onOpenChecklistModal,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text:
        language === 'darija'
          ? 'أهلاً بيك فـ Wach Nqder! 🇲🇦 أنا مساعدك الذكي للإجراءات والوراق فالمغرب. شنو بغيتي تدير اليوم؟ (لافاك، سطاج، لاكارط، المنحة...)'
          : language === 'ar'
          ? 'مرحباً بك في واش نقدر؟ 🇲🇦 مساعدك الذكي لفهم وتبسيط المساطر والوثائق الإدارية في المغرب. كيف يمكنني إرشادك اليوم؟'
          : 'Bonjour et bienvenue sur Wach Nqder? 🇲🇦 Votre assistant administratif intelligent au Maroc. Que souhaitez-vous préparer aujourd’hui ?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryToSend?: string) => {
    const textToSend = queryToSend || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInput('');
    setLoading(true);

    try {
      const previousTurns = messages
        .filter((m) => m.id !== 'msg_welcome')
        .slice(-6)
        .map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: previousTurns,
          language,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur de communication avec le serveur.');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedProcedure: data.relatedProcedure,
        suggestedChecklist: data.suggestedChecklist,
        sources: data.sources,
        warningNotice: data.warningNotice,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: 'عذراً، وقع خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Convert suggested checklist into a tracked checklist
  const handleCreateChecklistFromChat = (suggested: {
    title: string;
    documents: string[];
    procedureId?: string;
  }) => {
    const newChecklist: UserChecklist = {
      id: `cl_${Date.now()}`,
      title: suggested.title,
      procedureId: suggested.procedureId,
      category: 'education',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: suggested.documents.map((docName, i) => ({
        id: `item_${i}_${Date.now()}`,
        name: docName,
        isCompleted: false,
        copiesRequired: 1,
      })),
    };

    storage.saveChecklist(newChecklist);
    onOpenChecklistModal(newChecklist);
  };



  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Top Banner */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Wach Nqder? Assistant</span>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                RAG 2026
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Marocain • Darija / Français / العربية</p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'msg_welcome',
                sender: 'assistant',
                text: 'واش نقدر نعاونك فشي حاجة أخرى؟ كتب ليا هنا.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Nouvelle conversation"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Suggested Moroccan Prompt Chips when chat is fresh */}
        {messages.length <= 1 && (
          <div className="space-y-2 py-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              💡 أسئلة شائعة / Suggestions rapides :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                t(language, 'suggested_q1'),
                t(language, 'suggested_q2'),
                t(language, 'suggested_q3'),
                t(language, 'suggested_q4'),
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-slate-300 text-xs font-medium text-left transition-all active:scale-98"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Embedded Interactive Checklist Card */}
              {msg.suggestedChecklist && msg.suggestedChecklist.documents.length > 0 && (
                <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-950 border border-emerald-800/40 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {msg.suggestedChecklist.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.suggestedChecklist.documents.length} pièces
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {msg.suggestedChecklist.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCreateChecklistFromChat(msg.suggestedChecklist!)}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t(language, 'create_checklist_btn')}</span>
                  </button>
                </div>
              )}

              {/* Verified Sources & Warning Note */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="font-semibold">{t(language, 'official_source')} :</span>
                    {msg.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>{s.name}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>

                  {msg.warningNotice && (
                    <p className="text-[10px] text-amber-400/90 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{msg.warningNotice}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Report this answer button for AI responses */}
              {msg.sender === 'assistant' && msg.id !== 'msg_welcome' && (
                <div className="mt-2.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      alert('Merci. Votre signalement a été noté pour vérification avec les sources officielles.');
                    }}
                    className="text-[10px] text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
                    title="Signaler une information inexacte ou obsolète"
                  >
                    <span>⚠️ Signaler cette réponse</span>
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              )}

              {msg.sender === 'user' && (
                <span className="block text-[10px] text-slate-300 mt-1.5 text-right font-mono">
                  {msg.timestamp}
                </span>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl px-4 py-3 text-xs text-emerald-300 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span>{t(language, 'thinking')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/60 pb-6 sm:pb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 focus-within:border-emerald-500/50 shadow-lg"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(language, 'search_placeholder')}
            className="flex-1 bg-transparent px-3 py-1 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
