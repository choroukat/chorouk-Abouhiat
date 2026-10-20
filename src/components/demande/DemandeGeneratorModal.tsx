import React, { useState } from 'react';
import { DemandeType, GeneratedDemande, Language } from '../../types';
import { t } from '../../data/translations';
import { exportDemandeToPDF } from '../../utils/pdfExport';
import { storage } from '../../utils/storage';
import {
  FileText,
  Sparkles,
  Copy,
  FileDown,
  Check,
  X,
  Share2,
  AlertCircle,
  Building2,
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

interface Props {
  language: Language;
  onClose: () => void;
  onSaved?: (demande: GeneratedDemande) => void;
}

export const DemandeGeneratorModal: React.FC<Props> = ({
  language,
  onClose,
  onSaved,
}) => {
  const profile = storage.getProfile();

  const [type, setType] = useState<DemandeType>('stage');
  const [lang, setLang] = useState<'fr' | 'ar'>(language === 'fr' ? 'fr' : 'ar');
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [cinNumber, setCinNumber] = useState('');
  const [cneOrMassar, setCneOrMassar] = useState('');
  const [universityOrCompany, setUniversityOrCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(profile.email || '');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedDemande | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-demande', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          language: lang,
          fullName,
          cinNumber,
          cneOrMassar,
          universityOrCompany,
          phone,
          email,
          city,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur serveur lors de la génération');
      }

      const data = await response.json();
      const newDemande: GeneratedDemande = {
        id: `dem_${Date.now()}`,
        type,
        title: data.title || `Demande de ${type}`,
        language: lang,
        recipientTitle: lang === 'ar' ? 'إلى السيد(ة) المسؤول(ة)' : "À l'attention de la Direction",
        fullName,
        cinNumber,
        cneOrMassar,
        universityOrCompany,
        phone,
        email,
        city,
        content: data.content,
        createdAt: new Date().toISOString(),
      };

      setGeneratedResult(newDemande);
      storage.saveDemande(newDemande);
      if (onSaved) onSaved(newDemande);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Impossible de générer la demande.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRtl = lang === 'ar' || language === 'ar' || language === 'darija';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="relative w-full max-w-xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t(language, 'demande_generator_title')}
              </h2>
              <p className="text-xs text-slate-400">
                Formulations officielles marocaines (Français & Arabe)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Form or Generated Result */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {generatedResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Demande rédigée avec succès !</span>
                </div>
                <button
                  onClick={() => setGeneratedResult(null)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Modifier les paramètres
                </button>
              </div>

              {/* Editable Text Area for the Letter */}
              <div className="relative">
                <textarea
                  value={generatedResult.content}
                  dir={generatedResult.language === 'ar' ? 'rtl' : 'ltr'}
                  onChange={(e) =>
                    setGeneratedResult({ ...generatedResult, content: e.target.value })
                  }
                  rows={14}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-emerald-500/50 resize-none shadow-inner"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs sm:text-sm font-semibold transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copié !' : t(language, 'demande_copy')}
                </button>

                <button
                  onClick={() => exportDemandeToPDF(generatedResult)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-900/30 transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  {t(language, 'demande_pdf')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {t(language, 'demande_select_type')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'stage', label: t(language, 'demande_type_stage') },
                    { key: 'inscription', label: t(language, 'demande_type_inscription') },
                    { key: 'attestation', label: t(language, 'demande_type_attestation') },
                    { key: 'diplome', label: t(language, 'demande_type_diplome') },
                    { key: 'releve', label: t(language, 'demande_type_releve') },
                    { key: 'transfert', label: t(language, 'demande_type_transfert') },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setType(item.key as DemandeType)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        type === item.key
                          ? 'bg-emerald-600/15 border-emerald-500 text-emerald-300'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  {t(language, 'demande_lang')}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLang('fr')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      lang === 'fr'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🇫🇷 Français Administratif
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('ar')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      lang === 'ar'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    🇲🇦 العربية الإدارية الرسمية
                  </button>
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {t(language, 'demande_fullname')}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    {t(language, 'demande_cin')}
                  </label>
                  <input
                    type="text"
                    required
                    value={cinNumber}
                    onChange={(e) => setCinNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {t(language, 'demande_target')}
                  </label>
                  <input
                    type="text"
                    required
                    value={universityOrCompany}
                    onChange={(e) => setUniversityOrCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {t(language, 'demande_city')}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {t(language, 'demande_phone')}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Extra notes */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Précisions facultatives (ex: période de stage, filière, raison)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Stage PFE d'une durée de 3 mois de mai à juillet en développement web..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 disabled:opacity-50 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-emerald-900/30 transition-all"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rédaction avec Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t(language, 'demande_generate_btn')}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
