import React, { useState } from 'react';
import {
  GeneratedDemande,
  Language,
  Procedure,
  ScannedDocument,
  UserChecklist,
} from '../../types';
import { PROCEDURES_DATA } from '../../data/procedures';
import { t } from '../../data/translations';
import { storage } from '../../utils/storage';
import { exportDemandeToPDF, exportChecklistToPDF } from '../../utils/pdfExport';
import {
  FileText,
  CheckCircle2,
  Scan,
  Bookmark,
  Plus,
  Trash2,
  FileDown,
  ExternalLink,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';

interface Props {
  language: Language;
  onOpenChecklistModal: (checklist: UserChecklist) => void;
  onOpenDemandeModal: () => void;
  onSelectProcedure: (procedure: Procedure) => void;
  onNavigateTab: (tab: 'home' | 'assistant' | 'explore' | 'documents' | 'profile') => void;
}

export const MyDocumentsScreen: React.FC<Props> = ({
  language,
  onOpenChecklistModal,
  onOpenDemandeModal,
  onSelectProcedure,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'checklists' | 'demandes' | 'scans' | 'saved'>(
    'checklists'
  );

  const [checklists, setChecklists] = useState<UserChecklist[]>(() => storage.getChecklists());
  const [demandes, setDemandes] = useState<GeneratedDemande[]>(() => storage.getDemandes());
  const [scans, setScans] = useState<ScannedDocument[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(() => storage.getSavedProcedureIds());

  React.useEffect(() => {
    import('../../utils/indexedDb').then(({ scanDb }) => {
      scanDb.getAll().then((data) => setScans(data));
    });
  }, []);

  const savedProcedures = PROCEDURES_DATA.filter((p) => savedIds.includes(p.id));

  const handleDeleteChecklist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteChecklist(id);
    setChecklists(storage.getChecklists());
  };

  const handleDeleteDemande = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteDemande(id);
    setDemandes(storage.getDemandes());
  };

  const handleDeleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { scanDb } = await import('../../utils/indexedDb');
    await scanDb.delete(id);
    const updated = await scanDb.getAll();
    setScans(updated);
  };

  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 space-y-5 pb-24 text-slate-100">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-emerald-400" />
          <span>{t(language, 'space_title')}</span>
        </h1>
        <p className="text-xs text-slate-400">
          إدارة ومتابعة لوائح الوثائق، الطلبات الإدارية، والملفات المحفوظة
        </p>
      </div>

      {/* Segmented Filter Control */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('checklists')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'checklists'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Checklists ({checklists.length})
        </button>
        <button
          onClick={() => setActiveTab('demandes')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'demandes'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          الطلبات ({demandes.length})
        </button>
        <button
          onClick={() => setActiveTab('scans')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'scans'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          السكانير ({scans.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`py-2 rounded-xl transition-all ${
            activeTab === 'saved'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          المحفوظات ({savedProcedures.length})
        </button>
      </div>

      {/* Tab 1: Checklists */}
      {activeTab === 'checklists' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t(language, 'space_my_checklists')}
            </h2>
            <button
              onClick={() => {
                const blank: UserChecklist = {
                  id: `cl_custom_${Date.now()}`,
                  title: 'Nouvelle Checklist Personnalisée',
                  category: 'other',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  items: [
                    { id: 'i1', name: 'Carte Nationale (CNIE)', isCompleted: false },
                    { id: 'i2', name: 'Photos d’identité (4x)', isCompleted: false },
                  ],
                };
                storage.saveChecklist(blank);
                setChecklists(storage.getChecklists());
                onOpenChecklistModal(blank);
              }}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>لائحة جديدة</span>
            </button>
          </div>

          {checklists.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              {t(language, 'no_checklists')}
            </div>
          ) : (
            <div className="space-y-3">
              {checklists.map((cl) => {
                const completed = cl.items.filter((i) => i.isCompleted).length;
                const total = cl.items.length;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div
                    key={cl.id}
                    onClick={() => onOpenChecklistModal(cl)}
                    className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                          {cl.category}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1">{cl.title}</h3>
                        <p className="text-xs text-slate-400">
                          {completed} / {total} {t(language, 'documents_ready')} ({percent}%)
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportChecklistToPDF(cl);
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl"
                          title="Télécharger PDF"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteChecklist(cl.id, e)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Generated Demandes */}
      {activeTab === 'demandes' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t(language, 'space_my_demandes')}
            </h2>
            <button
              onClick={onOpenDemandeModal}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>طلب جديد</span>
            </button>
          </div>

          {demandes.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              {t(language, 'no_demandes')}
            </div>
          ) : (
            <div className="space-y-3">
              {demandes.map((dem) => (
                <div
                  key={dem.id}
                  className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-md">
                        {dem.type.toUpperCase()} • {dem.language.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">{dem.title}</h3>
                      <p className="text-xs text-slate-400">
                        {dem.universityOrCompany} • {new Date(dem.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => exportDemandeToPDF(dem)}
                        className="p-2 text-emerald-400 hover:bg-emerald-950/40 rounded-xl border border-emerald-900/30"
                        title="Télécharger PDF"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteDemande(dem.id, e)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Letter preview excerpt */}
                  <p className="text-xs text-slate-400 font-mono line-clamp-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    {dem.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Scans */}
      {activeTab === 'scans' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t(language, 'space_my_scans')}
            </h2>
            <button
              onClick={() => onNavigateTab('documents')}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>سكانير جديد</span>
            </button>
          </div>

          {scans.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              {t(language, 'no_scans')}
            </div>
          ) : (
            <div className="space-y-2.5">
              {scans.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                      <Scan className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{s.title}</h4>
                      <p className="text-[10px] text-slate-400">
                        {s.docType.toUpperCase()} • {new Date(s.scannedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteScan(s.id, e)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Saved Procedures */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t(language, 'space_saved_procedures')}
          </h2>

          {savedProcedures.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400 text-xs">
              لم تقم بحفظ أي مسطرة إدارية بعد. اضغط على أيقونة الإشارة المرجعية لحفظها هنا.
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedProcedures.map((proc) => {
                const title =
                  language === 'darija'
                    ? proc.title.darija
                    : language === 'ar'
                    ? proc.title.ar
                    : proc.title.fr;

                return (
                  <div
                    key={proc.id}
                    onClick={() => onSelectProcedure(proc)}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">
                        {proc.category}
                      </span>
                      <h4 className="text-xs font-bold text-white">{title}</h4>
                      <span className="text-[10px] text-slate-400">
                        {proc.requiredDocuments.length} وثائق • {proc.feesMAD} DH
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
