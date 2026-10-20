import React, { useState } from 'react';
import { CategoryType, Language, Procedure, UserChecklist } from '../../types';
import { PROCEDURES_DATA, searchProcedures } from '../../data/procedures';
import { t } from '../../data/translations';
import { storage } from '../../utils/storage';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Building2,
  Bookmark,
  Share2,
  AlertTriangle,
  ChevronRight,
  Plus,
  X,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { VerificationTableModal } from '../verification/VerificationTableModal';

interface Props {
  language: Language;
  onOpenChecklistModal: (checklist: UserChecklist) => void;
  selectedProcedureFromOutside?: Procedure | null;
  onClearSelectedProcedure?: () => void;
}

export const ExplorerScreen: React.FC<Props> = ({
  language,
  onOpenChecklistModal,
  selectedProcedureFromOutside,
  onClearSelectedProcedure,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeProcedure, setActiveProcedure] = useState<Procedure | null>(
    selectedProcedureFromOutside || null
  );
  const [savedIds, setSavedIds] = useState<string[]>(() => storage.getSavedProcedureIds());
  const verifications = storage.getProcedureVerifications();

  const categories = [
    { key: 'all', label: t(language, 'cat_all') },
    { key: 'education', label: t(language, 'cat_education') },
    { key: 'internship', label: t(language, 'cat_internship') },
    { key: 'scholarships', label: t(language, 'cat_scholarships') },
    { key: 'identity', label: t(language, 'cat_identity') },
    { key: 'documents', label: t(language, 'cat_documents') },
    { key: 'administration', label: t(language, 'cat_administration') },
    { key: 'transport', label: t(language, 'cat_transport') },
    { key: 'housing', label: t(language, 'cat_housing') },
  ];

  const rawProcedures = searchProcedures(searchQuery, selectedCategory);
  const procedures = rawProcedures.map((p) => {
    const override = verifications[p.id];
    return {
      ...p,
      verificationStatus: override ? override.status : p.verificationStatus,
      userVerificationDate: override ? override.date : p.userVerificationDate,
    };
  });

  const verifiedProceduresCount = PROCEDURES_DATA.filter(
    (p) => (verifications[p.id]?.status || p.verificationStatus) === 'verified'
  ).length;

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    storage.toggleSaveProcedure(id);
    setSavedIds(storage.getSavedProcedureIds());
  };

  const handleCreateChecklistForProcedure = (proc: Procedure) => {
    const title =
      language === 'darija' ? proc.title.darija : language === 'ar' ? proc.title.ar : proc.title.fr;

    const newChecklist: UserChecklist = {
      id: `cl_proc_${Date.now()}`,
      title: title,
      procedureId: proc.id,
      category: proc.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: proc.requiredDocuments.map((doc, idx) => {
        const docName =
          language === 'darija'
            ? doc.name.darija
            : language === 'ar'
            ? doc.name.ar
            : doc.name.fr;
        return {
          id: `item_${idx}_${Date.now()}`,
          name: docName,
          copiesRequired: doc.copies,
          isCompleted: false,
          notes: doc.notes ? (language === 'darija' ? doc.notes.darija : doc.notes.fr) : undefined,
        };
      }),
    };

    storage.saveChecklist(newChecklist);
    onOpenChecklistModal(newChecklist);
  };

  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 space-y-5 pb-24 text-slate-100">
      {/* Top Search bar */}
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-white">
          دليل المساطر والإجراءات / Explorer les Procédures
        </h1>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-emerald-500 shadow-md">
          <Search className="w-5 h-5 text-emerald-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث: جامعة، منحة، باسبور، سطاج، مقاطعة..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Official Procedures Verification Table Launcher Banner (Phase 2) */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span>جدول التحقق والتدقيق الرسمي</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50 font-mono">
                {verifiedProceduresCount}/{PROCEDURES_DATA.length} مؤكدة
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              تدقيق الرسوم والوثائق طبقاً للقانون 55-19 وبوابة idarati.ma
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowVerificationModal(true)}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shrink-0 shadow-md flex items-center gap-1 cursor-pointer"
        >
          <span>فتح الجدول</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{procedures.length} مساطر رسمية معتمدة</span>
        <span className="text-[11px] text-emerald-400 font-mono">تحديثات 2026</span>
      </div>

      {/* Procedures List */}
      <div className="space-y-3">
        {procedures.map((proc) => {
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

          const isSaved = savedIds.includes(proc.id);

          return (
            <div
              key={proc.id}
              onClick={() => setActiveProcedure(proc)}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-md space-y-3"
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
                        ⚠️ Non vérifié, vérifier source officielle
                      </span>
                    )}
                  </div>

                  <h2 className="text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors">
                    {title}
                  </h2>
                  <p className="text-xs text-slate-400 line-clamp-2">{desc}</p>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleToggleBookmark(proc.id, e)}
                  className={`p-2 rounded-xl transition-colors ${
                    isSaved
                      ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                      : 'text-slate-500 hover:text-white hover:bg-slate-800'
                  }`}
                  title={isSaved ? 'Retirer des favoris' : 'Enregistrer'}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Tags & Documents Count */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-800/70 text-slate-400">
                <span className="text-emerald-400 font-semibold">
                  {proc.requiredDocuments.length} وثائق مطلوبة
                </span>
                <span>
                  {proc.feesMAD === 0 ? 'فابور (مجاني)' : `${proc.feesMAD} درهم`}
                </span>
                <span className="text-slate-400">
                  {proc.appointmentRequired ? 'موعد إلزامي' : 'بدون موعد'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Procedure Detail Modal Sheet */}
      {activeProcedure && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="relative w-full max-w-xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                    {activeProcedure.category}
                  </span>
                  {activeProcedure.verificationStatus === 'verified' ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                      ✓ Vérifié ({activeProcedure.userVerificationDate || activeProcedure.lastVerifiedDate})
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-md">
                      ⚠️ Non vérifié, vérifier source officielle
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  {language === 'darija'
                    ? activeProcedure.title.darija
                    : language === 'ar'
                    ? activeProcedure.title.ar
                    : activeProcedure.title.fr}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveProcedure(null);
                  if (onClearSelectedProcedure) onClearSelectedProcedure();
                }}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
              {/* Description */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                {language === 'darija'
                  ? activeProcedure.description.darija
                  : language === 'ar'
                  ? activeProcedure.description.ar
                  : activeProcedure.description.fr}
              </div>

              {/* Key metadata grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{t(language, 'fees')}</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {activeProcedure.feesMAD === 0
                      ? t(language, 'free')
                      : `${activeProcedure.feesMAD} DH`}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">{t(language, 'appointment')}</span>
                  <span className="font-bold text-slate-200 text-sm">
                    {activeProcedure.appointmentRequired
                      ? t(language, 'appointment_required')
                      : t(language, 'no_appointment')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 col-span-2">
                  <span className="text-[11px] text-slate-400 block">{t(language, 'location')}</span>
                  <span className="font-semibold text-slate-200">
                    {language === 'darija'
                      ? activeProcedure.location.darija
                      : language === 'ar'
                      ? activeProcedure.location.ar
                      : activeProcedure.location.fr}
                  </span>
                </div>
              </div>

              {/* Required Documents List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  الوثائق والملفات المطلوبة / Documents Requis :
                </h3>

                <div className="space-y-2">
                  {activeProcedure.requiredDocuments.map((doc, idx) => (
                    <div
                      key={doc.id || idx}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-100 block">
                          {idx + 1}.{' '}
                          {language === 'darija'
                            ? doc.name.darija
                            : language === 'ar'
                            ? doc.name.ar
                            : doc.name.fr}
                        </span>
                        {doc.notes && (
                          <p className="text-[11px] text-slate-400">
                            {language === 'darija'
                              ? doc.notes.darija
                              : language === 'ar'
                              ? doc.notes.ar
                              : doc.notes.fr}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 shrink-0">
                        {doc.copies} {doc.copies > 1 ? 'نسخ' : 'نسخة'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step Guide */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  مراحل وخطوات الإجراء / Étapes :
                </h3>
                <div className="space-y-2">
                  {activeProcedure.steps.map((st, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {language === 'darija' ? st.darija : language === 'ar' ? st.ar : st.fr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Source & Warning */}
              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-amber-300 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t(language, 'warning_official')}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span>
                    {t(language, 'official_source')} : {activeProcedure.officialSource}
                  </span>
                  <a
                    href={activeProcedure.officialSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>الرابط الرسمي</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
              <button
                onClick={() => {
                  handleCreateChecklistForProcedure(activeProcedure);
                  setActiveProcedure(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء وتتبع لائحة الوثائق في مساحتي</span>
              </button>

              <button
                onClick={(e) => handleToggleBookmark(activeProcedure.id, e)}
                className={`p-3 rounded-2xl border transition-colors ${
                  savedIds.includes(activeProcedure.id)
                    ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Enregistrer"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Table Modal (Phase 2) */}
      {showVerificationModal && (
        <VerificationTableModal
          language={language}
          onClose={() => setShowVerificationModal(false)}
          onSelectProcedure={(proc) => {
            setActiveProcedure(proc);
            setShowVerificationModal(false);
          }}
        />
      )}
    </div>
  );
};


