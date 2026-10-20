import React, { useState, useEffect } from 'react';
import { Language, Procedure } from '../../types';
import { PROCEDURES_DATA } from '../../data/procedures';
import { storage } from '../../utils/storage';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  X,
  FileCheck,
  Download,
  Info,
  Calendar,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface Props {
  language: Language;
  onClose: () => void;
  onSelectProcedure?: (procedure: Procedure) => void;
}

export const VerificationTableModal: React.FC<Props> = ({
  language,
  onClose,
  onSelectProcedure,
}) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [search, setSearch] = useState('');
  const [verifications, setVerifications] = useState<
    Record<string, { status: 'verified' | 'unverified'; date: string }>
  >(() => storage.getProcedureVerifications());

  const isRtl = language === 'ar' || language === 'darija';

  const mergedProcedures = PROCEDURES_DATA.map((p) => {
    const override = verifications[p.id];
    return {
      ...p,
      verificationStatus: override ? override.status : p.verificationStatus,
      userVerificationDate: override ? override.date : p.userVerificationDate,
    };
  });

  const verifiedCount = mergedProcedures.filter(
    (p) => p.verificationStatus === 'verified'
  ).length;
  const unverifiedCount = mergedProcedures.length - verifiedCount;

  const filteredProcedures = mergedProcedures.filter((p) => {
    if (filter === 'verified' && p.verificationStatus !== 'verified') return false;
    if (filter === 'unverified' && p.verificationStatus === 'verified') return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.title.fr.toLowerCase().includes(q) ||
      p.title.ar.includes(q) ||
      p.title.darija.includes(q) ||
      p.officialSource.toLowerCase().includes(q)
    );
  });

  const handleToggleVerification = (id: string, currentStatus: 'verified' | 'unverified') => {
    const newStatus = currentStatus === 'verified' ? 'unverified' : 'verified';
    const today = new Date().toISOString().split('T')[0];
    const updated = storage.setProcedureVerification(id, newStatus, today);
    setVerifications({ ...updated });
  };

  const handleExportMarkdown = () => {
    let md = `# Official Moroccan Administrative Procedures Verification Table\n\n`;
    md += `Exported on: ${new Date().toISOString().split('T')[0]}\n\n`;
    md += `| ID | Title (FR) | Fee (MAD) | Required Documents | Location | Appt. Req. | Official Source URL | Verification Date | Status |\n`;
    md += `|---|---|---|---|---|---|---|---|---|\n`;

    mergedProcedures.forEach((p) => {
      const docsSummary = p.requiredDocuments
        .map((d) => `${d.name.fr} (${d.copies}x)`)
        .join(', ')
        .replace(/\|/g, '-');
      const statusIcon = p.verificationStatus === 'verified' ? '✓ Verified' : '⚠️ Unverified';
      md += `| \`${p.id}\` | ${p.title.fr} | ${p.feesMAD} DH | ${docsSummary} | ${p.location.fr} | ${p.appointmentRequired ? 'Oui' : 'Non'} | ${p.officialSourceUrl} | ${p.userVerificationDate || p.lastVerifiedDate} | ${statusIcon} |\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moroccan_procedures_verification_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>جدول التحقق من المساطر الرسمية</span>
                <span className="text-xs font-normal text-slate-400">
                  (Tableau de Vérification Officielle - Loi 55-19)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                متابعة تدقيق الرسوم والوثائق والمواعيد مقارنة مع البوابات الحكومية الرسمية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              title="Exporter rapport Markdown"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير التقرير (.md)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audit Stats Banner */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">إجمالي المساطر المعتمدة</span>
            <span className="text-lg font-bold text-white">{mergedProcedures.length} مسطرة</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40">
            <span className="text-[11px] text-emerald-300 block">مساطر مدققة ومؤكدة</span>
            <span className="text-lg font-bold text-emerald-400">{verifiedCount} مسطرة</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40">
            <span className="text-[11px] text-amber-300 block">قيد التدقيق والتحديث</span>
            <span className="text-lg font-bold text-amber-400">{unverifiedCount} مسطرة</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-800/40">
            <span className="text-[11px] text-blue-300 block">المرجعية القانونية</span>
            <span className="text-xs font-semibold text-blue-200 block truncate">
              قانون 55-19 لتبسيط المساطر
            </span>
          </div>
        </div>

        {/* Law 55-19 Notice */}
        <div className="px-4 py-2.5 bg-amber-950/20 border-b border-amber-900/30 text-[11px] text-amber-300/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              طبقا للقانون 55-19: لا يجوز للإدارة المطالبة بأكثر من نسخة واحدة لأي وثيقة، كما تم إلغاء تصحيح الإمضاء لعدة وثائق مدرسية.
            </span>
          </div>
          <a
            href="https://www.idarati.ma"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0 font-bold"
          >
            <span>بوابة إدارتي</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 w-full sm:w-72 focus-within:border-emerald-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="تصفية حسب المسطرة أو المصدر..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              الكل ({mergedProcedures.length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ✓ مؤكدة ({verifiedCount})
            </button>
            <button
              onClick={() => setFilter('unverified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'unverified'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ⚠️ قيد التدقيق ({unverifiedCount})
            </button>
          </div>
        </div>

        {/* Table / Cards Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProcedures.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              لا توجد مساطر تطابق معايير البحث الحالية.
            </div>
          ) : (
            filteredProcedures.map((proc) => {
              const isVerified = proc.verificationStatus === 'verified';
              const title =
                language === 'darija'
                  ? proc.title.darija
                  : language === 'ar'
                  ? proc.title.ar
                  : proc.title.fr;

              return (
                <div
                  key={proc.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isVerified
                      ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
                      : 'bg-slate-900/60 border-amber-900/40 hover:border-amber-700/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                          {proc.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                          {proc.category}
                        </span>
                        {isVerified ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مؤكد رسميا ({proc.userVerificationDate || proc.lastVerifiedDate})</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>⚠️ قيد التدقيق، راجع المصدر الرسمي</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>{title}</span>
                        {language !== 'fr' && (
                          <span className="text-xs font-normal text-slate-400">({proc.title.fr})</span>
                        )}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleVerification(proc.id, proc.verificationStatus)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          isVerified
                            ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{isVerified ? 'إلغاء التأكيد' : 'تأكيد صحة المعطيات'}</span>
                      </button>

                      {onSelectProcedure && (
                        <button
                          onClick={() => {
                            onSelectProcedure(proc);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          عرض التفاصيل
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grid of Verified Official Fields */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/70 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">الواجبات / الرسوم (Frais)</span>
                      <span className="font-bold text-emerald-400">
                        {proc.feesMAD === 0 ? '0 DH (مجاني)' : `${proc.feesMAD} درهم`}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">الموعد الإلكتروني (RDV)</span>
                      <span className="font-semibold text-slate-200">
                        {proc.appointmentRequired ? (
                          <a
                            href={proc.appointmentUrl || proc.officialSourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>إلزامي عبر المنصة</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          'بدون موعد مسبق'
                        )}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 col-span-2">
                      <span className="text-[10px] text-slate-400 block">موقع الإيداع (Lieu)</span>
                      <span className="font-semibold text-slate-200 truncate block">
                        {language === 'darija'
                          ? proc.location.darija
                          : language === 'ar'
                          ? proc.location.ar
                          : proc.location.fr}
                      </span>
                    </div>
                  </div>

                  {/* Required Documents Compact Badges */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block">
                      الوثائق الرسمية المطلوبة ({proc.requiredDocuments.length} وثائق) :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proc.requiredDocuments.map((doc, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-lg text-slate-300"
                        >
                          {language === 'darija'
                            ? doc.name.darija
                            : language === 'ar'
                            ? doc.name.ar
                            : doc.name.fr}{' '}
                          <span className="text-emerald-400 font-bold">({doc.copies}x)</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Official Portal Source Link */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/70">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>المصدر الرسمي : {proc.officialSource}</span>
                    </div>

                    <a
                      href={proc.officialSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>الرابط الحكومي الرسمي</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            تُحفظ تعديلات التحقق محلياً لمساعدة المواطنين والمدققين على مراجعة دقة المساطر.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            إغلاق الجدول
          </button>
        </div>
      </div>
    </div>
  );
};
