import React, { useState } from 'react';
import { UserChecklist, Language } from '../../types';
import { t } from '../../data/translations';
import { exportChecklistToPDF } from '../../utils/pdfExport';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  FileDown,
  Share2,
  X,
  Upload,
  AlertTriangle,
  Paperclip,
} from 'lucide-react';

interface Props {
  checklist: UserChecklist;
  language: Language;
  onClose: () => void;
  onSave: (checklist: UserChecklist) => void;
  onDelete?: (id: string) => void;
}

export const SmartChecklistModal: React.FC<Props> = ({
  checklist: initialChecklist,
  language,
  onClose,
  onSave,
  onDelete,
}) => {
  const [checklist, setChecklist] = useState<UserChecklist>(initialChecklist);
  const [newDocName, setNewDocName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const completedCount = checklist.items.filter((i) => i.isCompleted).length;
  const totalCount = checklist.items.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggleItem = (itemId: string) => {
    const updatedItems = checklist.items.map((item) => {
      if (item.id === itemId) {
        const nextState = !item.isCompleted;
        if (nextState && completedCount + 1 === totalCount) {
          // Trigger celebratory confetti on 100% completion
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        return { ...item, isCompleted: nextState };
      }
      return item;
    });

    const updated = { ...checklist, items: updatedItems, updatedAt: new Date().toISOString() };
    setChecklist(updated);
    onSave(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newItem = {
      id: `item_${Date.now()}`,
      name: newDocName.trim(),
      isCompleted: false,
      copiesRequired: 1,
    };

    const updated = {
      ...checklist,
      items: [...checklist.items, newItem],
      updatedAt: new Date().toISOString(),
    };
    setChecklist(updated);
    onSave(updated);
    setNewDocName('');
    setIsAdding(false);
    showToast('Document ajouté avec succès !');
  };

  const handleDeleteItem = (itemId: string) => {
    const updated = {
      ...checklist,
      items: checklist.items.filter((i) => i.id !== itemId),
      updatedAt: new Date().toISOString(),
    };
    setChecklist(updated);
    onSave(updated);
  };

  const handleAttachFile = (itemId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast('Fichier trop lourd (maximum 5 Mo).');
          return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const base64 = loadEvent.target?.result as string;
          const updatedItems = checklist.items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  attachmentName: file.name,
                  attachmentData: base64,
                  isCompleted: true,
                  attachedAt: new Date().toISOString(),
                }
              : i
          );
          const updated = { ...checklist, items: updatedItems, updatedAt: new Date().toISOString() };
          setChecklist(updated);
          onSave(updated);
          showToast(`Document "${file.name}" attaché !`);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleShare = async () => {
    const textToShare = `Wach Nqder? 🇲🇦 Checklist : ${checklist.title}\n${completedCount}/${totalCount} documents prêts.\n${checklist.items
      .map((i) => `${i.isCompleted ? '☑' : '☐'} ${i.name}`)
      .join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: checklist.title,
          text: textToShare,
        });
      } catch {
        // Fallback
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      showToast('Checklist copiée dans le presse-papier !');
    }
  };

  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {t(language, 'checklist_title')}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5 line-clamp-1">{checklist.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Summary */}
        <div className="p-4 bg-emerald-950/20 border-b border-emerald-900/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">
              <strong className="text-emerald-400 font-bold">{completedCount}</strong> / {totalCount}{' '}
              {t(language, 'documents_ready')}
            </span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
              {percent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Document Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {checklist.items.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                item.isCompleted
                  ? 'bg-emerald-950/15 border-emerald-800/40 text-slate-300'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleItem(item.id)}
                className="mt-0.5 text-emerald-400 hover:scale-110 active:scale-95 transition-transform"
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-500 hover:text-emerald-400" />
                )}
              </button>

              <div className="flex-1 cursor-pointer" onClick={() => handleToggleItem(item.id)}>
                <p
                  className={`text-sm font-medium leading-snug ${
                    item.isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                  }`}
                >
                  {item.name}
                </p>
                {item.copiesRequired && item.copiesRequired > 1 && (
                  <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                    {item.copiesRequired} copies nécessaires
                  </span>
                )}
                {item.attachmentName && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-teal-400">
                    <Paperclip className="w-3.5 h-3.5" />
                    {item.attachmentData ? (
                      <a
                        href={item.attachmentData}
                        download={item.attachmentName}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate max-w-[200px] hover:underline cursor-pointer"
                        title="Ouvrir / Télécharger la pièce jointe"
                      >
                        {item.attachmentName}
                      </a>
                    ) : (
                      <span className="truncate max-w-[200px]">{item.attachmentName}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Joindre un document (Photo ou PDF)"
                  onClick={() => handleAttachFile(item.id)}
                  className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Supprimer"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add item form or button */}
          {isAdding ? (
            <form onSubmit={handleAddItem} className="flex gap-2 p-2 bg-slate-800/60 rounded-2xl border border-slate-700">
              <input
                type="text"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="Ex: Photos d'identité, Quittance..."
                className="flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1.5 text-slate-400 hover:text-white text-xs"
              >
                Annuler
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              {t(language, 'add_document')}
            </button>
          )}

          {/* Official warning notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-amber-300 text-xs mt-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p>{t(language, 'warning_official')}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
          <button
            onClick={() => exportChecklistToPDF(checklist)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all"
          >
            <FileDown className="w-4 h-4" />
            {t(language, 'download_pdf')}
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl transition-colors"
            title="Partager"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={() => {
                onDelete(checklist.id);
                onClose();
              }}
              className="p-3 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded-2xl transition-colors border border-rose-900/30"
              title="Supprimer la checklist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Toast notification */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-full text-xs font-semibold shadow-xl">
            {toastMsg}
          </div>
        )}
      </div>
    </div>
  );
};
