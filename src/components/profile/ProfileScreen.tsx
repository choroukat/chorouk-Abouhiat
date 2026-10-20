import React, { useState } from 'react';
import { Language, UserProfile } from '../../types';
import { t } from '../../data/translations';
import { storage } from '../../utils/storage';
import { scanDb } from '../../utils/indexedDb';
import {
  User,
  Bell,
  Globe,
  Trash2,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Lock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { VerificationTableModal } from '../verification/VerificationTableModal';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const ProfileScreen: React.FC<Props> = ({
  language,
  onLanguageChange,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.notificationsEnabled
  );
  const [name, setName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.saveProfile({
      fullName: name,
      email: email,
      notificationsEnabled,
      preferredLanguage: language,
    });
    setProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    storage.saveProfile({ notificationsEnabled: next });
  };

  const handleClearAll = async () => {
    await scanDb.clear();
    storage.clearAllData();
    window.location.reload();
  };

  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 space-y-6 pb-24 text-slate-100">
      {/* Official Government Non-Affiliation Disclaimer */}
      <div className="p-4 rounded-3xl bg-amber-950/30 border border-amber-900/50 space-y-2 text-xs text-amber-200">
        <div className="flex items-center gap-2 font-bold text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>إشعار قانوني واستقلالية / Avertissement Légal</span>
        </div>
        <p className="leading-relaxed">
          تطبيق مواطناتي مستقل غير تابع لأي وزارة أو جهة حكومية مغربية. جميع المعطيات إرشادية مستخلصة من نصوص عامة، ويجب دوماً الرجوع للإعلانات الرسمية للمؤسسات المعنية.
        </p>
        <p className="text-[11px] text-amber-300/80">
          Application citoyenne indépendante, non affiliée à un organisme gouvernemental marocain. Vérifiez toujours auprès des sources officielles.
        </p>
      </div>

      {/* User Header Card */}
      <div className="flex items-center gap-4 p-4 rounded-3xl bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-emerald-600/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-inner">
          {name.charAt(0) || <User className="w-6 h-6" />}
        </div>
        <div>
          <h1 className="text-base font-bold text-white">{name || 'Utilisateur'}</h1>
          <p className="text-xs text-slate-400">{email || 'Stockage local sécurisé'}</p>
          <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
            🇲🇦 حساب محلي خاص
          </span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{t(language, 'profile_pref_lang')}</span>
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'darija', label: 'الدارجة 🇲🇦' },
            { key: 'ar', label: 'العربية 🇲🇦' },
            { key: 'fr', label: 'Français 🇫🇷' },
          ].map((l) => (
            <button
              key={l.key}
              onClick={() => onLanguageChange(l.key as Language)}
              className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all ${
                language === l.key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Info Edit Form */}
      <form onSubmit={handleSaveProfile} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-400" />
          <span>المعلومات الشخصية / Données Personnelles</span>
        </h2>

        <div>
          <label className="block text-xs text-slate-400 mb-1">{t(language, 'demande_fullname')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mohamed Benali"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: contact@example.com"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          {isSaved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : null}
          <span>{isSaved ? 'Modifications enregistrées !' : 'Mettre à jour mon profil'}</span>
        </button>
      </form>

      {/* Push Notifications Toggle */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">{t(language, 'profile_notifications')}</h3>
            <p className="text-[11px] text-slate-400">تذكير بآجال التسجيل والمنحة والوثائق</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleNotifications}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
            notificationsEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-md" />
        </button>
      </div>

      {/* Official Procedures Verification Section (Phase 2) */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">
                جدول التحقق والتدقيق الرسمي (Loi 55-19)
              </h3>
              <p className="text-[11px] text-slate-400">
                مراجعة وتأكيد رسوم ووثائق المساطر الرسمية
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowVerificationModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>فتح الجدول</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Privacy Notice & Permanent Deletion (CNDP Law 09-08) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Lock className="w-4 h-4" />
          <h3 className="text-xs font-bold">الحماية والخصوصية (Conformité CNDP Loi 09-08)</h3>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          تُحفظ ملفاتك وقوائمك محلياً على ذاكرة متصفحك (IndexedDB). عند مسح وثيقة أو سؤال المساعد، تُرسل البيانات مشفرة لمعالجتها آنياً عبر واجهة الذكاء الاصطناعي دون تخزين دائم على خوادمنا.
        </p>

        {showDeleteConfirm ? (
          <div className="p-3 bg-slate-950 rounded-2xl border border-rose-800/50 space-y-2 pt-2">
            <p className="text-xs text-rose-300 font-semibold">
              هل أنت متأكد؟ سيتم حذف جميع اللوائح والطلبات والوثائق الممسوحة نهائياً من الذاكرة المحلية.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                تأكيد الحذف النهائي
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 pt-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t(language, 'profile_privacy_delete_all')}</span>
          </button>
        )}
      </div>

      {/* App Version Info */}
      <div className="text-center text-[11px] text-slate-500 space-y-1 pt-2">
        <p>Wach Nqder? 🇲🇦 Mobile App v1.0.0</p>
        <p>تطبيق غير رسمي مبني لخدمة الصالح العام</p>
      </div>

      {/* Verification Table Modal (Phase 2) */}
      {showVerificationModal && (
        <VerificationTableModal
          language={language}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </div>
  );
};
