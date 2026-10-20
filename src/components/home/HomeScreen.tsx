import React, { useState } from 'react';
import { CategoryType, Language, Procedure, UserChecklist } from '../../types';
import { PROCEDURES_DATA, searchProcedures } from '../../data/procedures';
import { t } from '../../data/translations';
import { storage } from '../../utils/storage';
import {
  Search,
  Camera,
  Bot,
  FileText,
  Scan,
  GraduationCap,
  Briefcase,
  Award,
  IdCard,
  Car,
  Building,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Bookmark,
  Share2,
} from 'lucide-react';

interface Props {
  language: Language;
  onNavigateTab: (tab: 'home' | 'assistant' | 'explore' | 'documents' | 'profile') => void;
  onOpenChecklistModal: (checklist: UserChecklist) => void;
  onOpenDemandeModal: () => void;
  onStartSearchWithQuery: (q: string) => void;
  onSelectProcedure: (procedure: Procedure) => void;
}

export const HomeScreen: React.FC<Props> = ({
  language,
  onNavigateTab,
  onOpenChecklistModal,
  onOpenDemandeModal,
  onStartSearchWithQuery,
  onSelectProcedure,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [explainerDocName, setExplainerDocName] = useState('');
  const [explainerResult, setExplainerResult] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const checklists = storage.getChecklists();
  const activeChecklist = checklists[0];

  const categories: { key: string; label: string; icon: any }[] = [
    { key: 'all', label: t(language, 'cat_all'), icon: Sparkles },
    { key: 'education', label: t(language, 'cat_education'), icon: GraduationCap },
    { key: 'internship', label: t(language, 'cat_internship'), icon: Briefcase },
    { key: 'scholarships', label: t(language, 'cat_scholarships'), icon: Award },
    { key: 'identity', label: t(language, 'cat_identity'), icon: IdCard },
    { key: 'documents', label: t(language, 'cat_documents'), icon: FileText },
    { key: 'administration', label: t(language, 'cat_administration'), icon: Building },
    { key: 'transport', label: t(language, 'cat_transport'), icon: Car },
  ];

  const displayedProcedures = searchProcedures(searchInput, selectedCategory).slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onStartSearchWithQuery(searchInput.trim());
  };

  const handleQuickExplainer = async (docName: string) => {
    setExplainerDocName(docName);
    setIsExplaining(true);
    setExplainerResult(null);

    try {
      const res = await fetch('/api/explain-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentName: docName, language }),
      });
      const data = await res.json();
      setExplainerResult(data.explanation);
    } catch {
      setExplainerResult('Impossible d’obtenir l’explication pour le moment.');
    } finally {
      setIsExplaining(false);
    }
  };

  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="space-y-6 pb-24 text-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-800/40 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Wach Nqder? 🇲🇦 الدليل الذكي 2026</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
            {t(language, 'hero_title')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
            {t(language, 'hero_subtitle')}
          </p>

          {/* Large Search / Chat Input Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="pt-2 flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-2xl p-1.5 focus-within:border-emerald-500 transition-all shadow-xl"
          >
            <div className="p-2 text-emerald-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t(language, 'search_placeholder')}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />



            <button
              type="button"
              onClick={() => onNavigateTab('documents')}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 rounded-xl transition-colors"
              title="Scanner un document"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t(language, 'ask_button')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          الإجراءات السريعة / Actions Rapides
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button
            onClick={onOpenDemandeModal}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all active:scale-98 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300">
                {t(language, 'action_demande')}
              </h3>
              <p className="text-[10px] text-slate-400">PFE, Stage, Inscription</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('documents')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all active:scale-98 group"
          >
            <div className="p-2.5 rounded-xl bg-teal-500/15 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 group-hover:text-teal-300">
                {t(language, 'action_scanner')}
              </h3>
              <p className="text-[10px] text-slate-400">OCR & Sauvegarde</p>
            </div>
          </button>

          <button
            onClick={() => onStartSearchWithQuery('minhaty')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all active:scale-98 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 group-hover:text-amber-300">
                {t(language, 'action_minhaty')}
              </h3>
              <p className="text-[10px] text-slate-400">RSU & Délais 2026</p>
            </div>
          </button>

          <button
            onClick={() => onStartSearchWithQuery('stage pfe')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all active:scale-98 group"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-300">
                {t(language, 'action_stage')}
              </h3>
              <p className="text-[10px] text-slate-400">Convention tripartite</p>
            </div>
          </button>

          <button
            onClick={() => onStartSearchWithQuery('cnie')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all active:scale-98 group"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 group-hover:text-rose-300">
                {t(language, 'action_cnie')}
              </h3>
              <p className="text-[10px] text-slate-400">cnie.ma & RDV</p>
            </div>
          </button>

          <button
            onClick={() => onStartSearchWithQuery('faculte')}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all active:scale-98 group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 group-hover:text-purple-300">
                {t(language, 'action_fac')}
              </h3>
              <p className="text-[10px] text-slate-400">Dossier Bac 2026</p>
            </div>
          </button>
        </div>
      </div>

      {/* Active Checklist Progress Card */}
      {activeChecklist && (
        <div className="bg-slate-900 border border-emerald-800/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t(language, 'checklist_title')}
              </span>
            </div>
            <button
              onClick={() => onOpenChecklistModal(activeChecklist)}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">{activeChecklist.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeChecklist.items.filter((i) => i.isCompleted).length} / {activeChecklist.items.length}{' '}
              {t(language, 'documents_ready')}
            </p>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full"
              style={{
                width: `${
                  (activeChecklist.items.filter((i) => i.isCompleted).length /
                    (activeChecklist.items.length || 1)) *
                  100
                }%`,
              }}
            />
          </div>

          {/* Quick checkbox list items preview */}
          <div className="space-y-1.5 pt-1">
            {activeChecklist.items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenChecklistModal(activeChecklist)}
                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                    item.isCompleted ? 'bg-emerald-500 text-white' : 'border border-slate-600'
                  }`}
                >
                  {item.isCompleted && '✓'}
                </div>
                <span className={item.isCompleted ? 'line-through text-slate-500' : ''}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            التصنيفات الرسمية / Catégories
          </h2>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs text-emerald-400 hover:underline"
          >
            استكشاف الكل
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Moroccan Procedures Feed */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          المساطر الموثقة والمعتمدة (2026) / Procédures Officielles
        </h2>

        <div className="space-y-2.5">
          {displayedProcedures.map((proc) => {
            const title =
              language === 'darija'
                ? proc.title.darija
                : language === 'ar'
                ? proc.title.ar
                : proc.title.fr;

            const desc =
              language === 'darija'
                ? proc.description.darija
                : language === 'ar'
                ? proc.description.ar
                : proc.description.fr;

            return (
              <div
                key={proc.id}
                onClick={() => onSelectProcedure(proc)}
                className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                        {proc.category}
                      </span>
                      {proc.verificationStatus === 'verified' ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                          ✓ Vérifié ({proc.userVerificationDate || proc.lastVerifiedDate})
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          ⚠️ Non vérifié
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">{desc}</p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-950/30 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Badges footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-emerald-400">
                    {proc.feesMAD === 0 ? t(language, 'free') : `${proc.feesMAD} DH`}
                  </span>
                  <span>
                    {proc.appointmentRequired
                      ? t(language, 'appointment_required')
                      : t(language, 'no_appointment')}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                    {proc.officialSource}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Explainer Widget (شنو هي attestation de scolarité؟) */}
      <div className="p-4 rounded-3xl bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <HelpCircle className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            مفسر الوثائق / Expliqueur de Documents
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          ما عرفتيش وثيقة إدارية علاش كتصلح ومنين كتخرج؟ جرب هنا :
        </p>

        <div className="flex flex-wrap gap-2">
          {['Attestation de scolarité', 'Quitus universitaire', 'Fiche anthropométrique', 'Extrait de naissance'].map(
            (doc) => (
              <button
                key={doc}
                onClick={() => handleQuickExplainer(doc)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {doc}
              </button>
            )
          )}
        </div>

        {isExplaining && (
          <p className="text-xs text-emerald-400 animate-pulse">
            جاري التفسير والبحث في المصادر المغربية...
          </p>
        )}

        {explainerResult && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 text-slate-200 text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200">
            <strong className="text-emerald-300 block font-bold">{explainerDocName} :</strong>
            <p className="whitespace-pre-wrap">{explainerResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};
