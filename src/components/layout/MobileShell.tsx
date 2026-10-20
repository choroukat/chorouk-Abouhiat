import React, { useState, useEffect } from 'react';
import { Language, UserNotification } from '../../types';
import { t } from '../../data/translations';
import { storage } from '../../utils/storage';
import {
  Home,
  Bot,
  Search,
  FolderOpen,
  User,
  Bell,
  Smartphone,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Globe,
  Wifi,
  BatteryMedium,
  Check,
} from 'lucide-react';

interface Props {
  activeTab: 'home' | 'assistant' | 'explore' | 'documents' | 'profile';
  onTabChange: (tab: 'home' | 'assistant' | 'explore' | 'documents' | 'profile') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: React.ReactNode;
}

export const MobileShell: React.FC<Props> = ({
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  children,
}) => {
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>(() =>
    storage.getNotifications()
  );
  const [currentTime, setCurrentTime] = useState('12:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    notifications.forEach((n) => storage.markNotificationRead(n.id));
    setNotifications(storage.getNotifications());
  };

  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start sm:py-6 sm:px-4 selection:bg-emerald-600 selection:text-white"
    >
      {/* Top Floating Control Bar (Desktop view mode switcher) */}
      <aside aria-label="Aperçu et paramètres" className="w-full max-w-md hidden sm:flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-900/80 border border-slate-800 rounded-full text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Wach Nqder? 🇲🇦 Mobile App (Expo & React Native Architecture)</span>
        </div>

        <button
          onClick={() => setDeviceFrameMode(!deviceFrameMode)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          title="Changer de mode d'affichage"
        >
          {deviceFrameMode ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Plein écran</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Cadre Mobile</span>
            </>
          )}
        </button>
      </aside>

      {/* Main Container: Mobile Frame vs Full Screen */}
      <div
        className={`w-full transition-all duration-300 flex flex-col overflow-hidden bg-slate-950 ${
          deviceFrameMode
            ? 'sm:max-w-[430px] sm:h-[880px] sm:max-h-[92vh] sm:rounded-[48px] sm:border-[8px] sm:border-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative'
            : 'max-w-xl min-h-screen sm:rounded-3xl sm:border sm:border-slate-800'
        }`}
      >
        {/* iOS / Android Status Bar (in mobile frame mode) */}
        <header className="pt-2 px-6 pb-1 flex items-center justify-between text-xs font-semibold text-slate-300 select-none shrink-0 bg-slate-950/80 backdrop-blur-md z-30">
          <span>{currentTime}</span>

          {/* Dynamic Island / Camera Notch */}
          <div className="hidden sm:flex items-center justify-center w-28 h-4 bg-black rounded-full border border-slate-800 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] font-mono tracking-tighter text-emerald-400 font-bold">
              INWI 5G
            </span>
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </header>

        {/* Top Header App Bar */}
        <header className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
          <div
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              🇲🇦
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base font-black text-white tracking-tight">Wach Nqder?</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">واش نقدر؟ الإدارة فجيبك</p>
            </div>
          </div>

          {/* Top Actions: Language Selector & Notifications */}
          <div className="flex items-center gap-1.5">
            {/* Quick Language Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-0.5 text-[11px] font-bold">
              <button
                onClick={() => onLanguageChange('darija')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  language === 'darija' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="الدارجة المغربية"
              >
                دارجة
              </button>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  language === 'ar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="العربية الفصحى"
              >
                عربية
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  language === 'fr' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Français"
              >
                FR
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="absolute right-0 top-11 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">الإشعارات والتذكير</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        قراءة الكل
                      </button>
                    )}
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded-xl border ${
                          n.isRead
                            ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                            : 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                        }`}
                      >
                        <h4 className="font-bold text-slate-100">{n.title}</h4>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[9px] text-slate-500 block mt-1">
                          {new Date(n.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto relative bg-slate-950">{children}</main>

        {/* Bottom Tab Navigation Bar */}
        <nav aria-label="Navigation principale" className="px-2 py-2 border-t border-slate-800/90 bg-slate-950/95 backdrop-blur-md flex items-center justify-around z-30 shrink-0">
          {[
            { key: 'home', label: t(language, 'nav_home'), icon: Home },
            { key: 'assistant', label: t(language, 'nav_assistant'), icon: Bot },
            { key: 'explore', label: t(language, 'nav_explore'), icon: Search },
            { key: 'documents', label: t(language, 'nav_documents'), icon: FolderOpen },
            { key: 'profile', label: t(language, 'nav_profile'), icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key as any)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
                  isActive ? 'text-emerald-400 scale-105' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-5 h-1 rounded-full bg-emerald-400" />
                )}
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-emerald-950/60 border border-emerald-800/50' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Home Indicator (iPhone pill) */}
        {deviceFrameMode && (
          <div className="w-32 h-1 bg-slate-700/60 rounded-full mx-auto my-1.5 shrink-0 hidden sm:block" />
        )}
      </div>
    </div>
  );
};
