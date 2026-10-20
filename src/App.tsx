/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, Procedure, UserChecklist } from './types';
import { storage } from './utils/storage';
import { MobileShell } from './components/layout/MobileShell';
import { HomeScreen } from './components/home/HomeScreen';
import { AssistantScreen } from './components/assistant/AssistantScreen';
import { ExplorerScreen } from './components/explorer/ExplorerScreen';
import { DocumentScannerScreen } from './components/scanner/DocumentScannerScreen';
import { MyDocumentsScreen } from './components/documents/MyDocumentsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { SmartChecklistModal } from './components/checklist/SmartChecklistModal';
import { DemandeGeneratorModal } from './components/demande/DemandeGeneratorModal';
import { AlertTriangle, Check, WifiOff } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'assistant' | 'explore' | 'documents' | 'profile'>('home');
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [language, setLanguage] = useState<Language>(() => {
    return storage.getProfile().preferredLanguage || 'darija';
  });

  // Modal states
  const [activeChecklist, setActiveChecklist] = useState<UserChecklist | null>(null);
  const [demandeModalOpen, setDemandeModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [assistantQuery, setAssistantQuery] = useState<string | undefined>(undefined);
  const [showFirstLaunchDisclaimer, setShowFirstLaunchDisclaimer] = useState<boolean>(() => {
    return !storage.isDisclaimerAccepted();
  });

  // Sync HTML dir attribute on language change for proper RTL/LTR layout
  useEffect(() => {
    const isRtl = language === 'ar' || language === 'darija';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'fr' ? 'fr' : 'ar';
  }, [language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    storage.saveProfile({ preferredLanguage: newLang });
  };

  const handleStartSearchWithQuery = (query: string) => {
    setAssistantQuery(query);
    setActiveTab('assistant');
  };

  const handleSelectProcedure = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setActiveTab('explore');
  };

  const handleAcceptDisclaimer = () => {
    storage.setDisclaimerAccepted();
    setShowFirstLaunchDisclaimer(false);
  };

  // Listen for online/offline events for PWA offline resilience
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Status Notice Banner */}
      {!isOnline && (
        <div
          dir={language === 'ar' || language === 'darija' ? 'rtl' : 'ltr'}
          className="bg-amber-600 text-white text-[11px] font-bold py-1.5 px-3 text-center flex items-center justify-center gap-2 shadow-md z-50 sticky top-0"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>
            {language === 'darija'
              ? 'وضع بدون أنترنت شغال: تقدر تشوف المساطر، توجد اللوائح وتكتب الطلبات محلياً.'
              : language === 'ar'
              ? 'وضع العمل بدون إنترنت مفعّل: تصفح المساطر، إعداد اللوائح وتوليد الطلبات متاح محلياً.'
              : 'Mode hors-ligne actif : consultation des démarches, checklists et modèles de demandes disponibles localement.'}
          </span>
        </div>
      )}

      <MobileShell
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'assistant') {
            setAssistantQuery(undefined);
          }
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
      >
        {activeTab === 'home' && (
          <HomeScreen
            language={language}
            onNavigateTab={setActiveTab}
            onOpenChecklistModal={(cl) => setActiveChecklist(cl)}
            onOpenDemandeModal={() => setDemandeModalOpen(true)}
            onStartSearchWithQuery={handleStartSearchWithQuery}
            onSelectProcedure={handleSelectProcedure}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantScreen
            language={language}
            onOpenChecklistModal={(cl) => setActiveChecklist(cl)}
            initialQuery={assistantQuery}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorerScreen
            language={language}
            onOpenChecklistModal={(cl) => setActiveChecklist(cl)}
            selectedProcedureFromOutside={selectedProcedure}
            onClearSelectedProcedure={() => setSelectedProcedure(null)}
          />
        )}

        {activeTab === 'documents' && (
          <MyDocumentsScreen
            language={language}
            onOpenChecklistModal={(cl) => setActiveChecklist(cl)}
            onOpenDemandeModal={() => setDemandeModalOpen(true)}
            onSelectProcedure={handleSelectProcedure}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        )}
      </MobileShell>

      {/* First Launch Legal Disclaimer Modal */}
      {showFirstLaunchDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            dir={language === 'ar' || language === 'darija' ? 'rtl' : 'ltr'}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">إشعار قانوني واستقلالية</h3>
                <p className="text-xs text-slate-400">Avertissement de non-affiliation</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
              <p>
                <strong>واش نقدر؟ (Wach Nqder?)</strong> هو تطبيق مدني مستقل،{' '}
                <span className="text-amber-400 font-semibold">غير تابع لأي وزارة، ولا يمثل أي مؤسسة حكومية أو إدارة عمومية مغربية</span>.
              </p>
              <p>
                المعلومات المقدمة هي للإرشاد والتيسير فقط، وتخضع للتحديثات القانونية الدورية. يرجى دائماً مراجعة المواقع والجهات الرسمية المختصة.
              </p>
            </div>

            <button
              onClick={handleAcceptDisclaimer}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>فهمت وأوافق / J'ai compris</span>
            </button>
          </div>
        </div>
      )}

      {/* Smart Checklist Modal Sheet */}
      {activeChecklist && (
        <SmartChecklistModal
          checklist={activeChecklist}
          language={language}
          onClose={() => setActiveChecklist(null)}
          onSave={(updated) => storage.saveChecklist(updated)}
          onDelete={(id) => storage.deleteChecklist(id)}
        />
      )}

      {/* AI Demande Generator Modal */}
      {demandeModalOpen && (
        <DemandeGeneratorModal
          language={language}
          onClose={() => setDemandeModalOpen(false)}
        />
      )}
    </>
  );
}
