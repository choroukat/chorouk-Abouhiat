import {
  UserChecklist,
  ScannedDocument,
  GeneratedDemande,
  UserProfile,
  UserNotification,
  Language,
} from '../types';

const STORAGE_KEYS = {
  CHECKLISTS: 'wn_checklists_v1',
  SCANS: 'wn_scans_v1',
  DEMANDES: 'wn_demandes_v1',
  SAVED_PROCEDURES: 'wn_saved_procedures_v1',
  NOTIFICATIONS: 'wn_notifications_v1',
  PROFILE: 'wn_profile_v1',
  THEME: 'wn_theme_v1',
  DISCLAIMER_ACCEPTED: 'wn_disclaimer_accepted_v1',
  SCAN_CONSENT_ACCEPTED: 'wn_scan_consent_accepted_v1',
  PROCEDURE_VERIFICATIONS: 'wn_procedure_verifications_v1',
};

// Clean initial empty user profile
const INITIAL_PROFILE: UserProfile = {
  id: `usr_${Date.now()}`,
  fullName: '',
  email: '',
  preferredLanguage: 'darija',
  notificationsEnabled: false,
  savedProcedureIds: [],
  isAdmin: false,
  createdAt: new Date().toISOString(),
};

export const storage = {
  getChecklists(): UserChecklist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKLISTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveChecklist(checklist: UserChecklist) {
    const list = this.getChecklists();
    const idx = list.findIndex((c) => c.id === checklist.id);
    if (idx >= 0) {
      list[idx] = { ...checklist, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...checklist, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(list));
  },

  deleteChecklist(id: string) {
    const list = this.getChecklists().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CHECKLISTS, JSON.stringify(list));
  },

  getScans(): ScannedDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCANS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveScan(scan: ScannedDocument) {
    const list = this.getScans();
    list.unshift(scan);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(list));
  },

  deleteScan(id: string) {
    const list = this.getScans().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(list));
  },

  getDemandes(): GeneratedDemande[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMANDES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDemande(demande: GeneratedDemande) {
    const list = this.getDemandes();
    list.unshift(demande);
    localStorage.setItem(STORAGE_KEYS.DEMANDES, JSON.stringify(list));
  },

  deleteDemande(id: string) {
    const list = this.getDemandes().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DEMANDES, JSON.stringify(list));
  },

  getSavedProcedureIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PROCEDURES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleSaveProcedure(id: string): boolean {
    const saved = this.getSavedProcedureIds();
    let updated: string[];
    let isNowSaved = false;
    if (saved.includes(id)) {
      updated = saved.filter((item) => item !== id);
      isNowSaved = false;
    } else {
      updated = [...saved, id];
      isNowSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_PROCEDURES, JSON.stringify(updated));
    return isNowSaved;
  },

  getNotifications(): UserNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markNotificationRead(id: string) {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  },

  saveProfile(profile: Partial<UserProfile>) {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  isDisclaimerAccepted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED) === 'true';
  },

  setDisclaimerAccepted() {
    localStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, 'true');
  },

  isScanConsentAccepted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SCAN_CONSENT_ACCEPTED) === 'true';
  },

  setScanConsentAccepted() {
    localStorage.setItem(STORAGE_KEYS.SCAN_CONSENT_ACCEPTED, 'true');
  },

  getProcedureVerifications(): Record<string, { status: 'verified' | 'unverified'; date: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROCEDURE_VERIFICATIONS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  setProcedureVerification(id: string, status: 'verified' | 'unverified', date: string) {
    const current = this.getProcedureVerifications();
    current[id] = { status, date };
    localStorage.setItem(STORAGE_KEYS.PROCEDURE_VERIFICATIONS, JSON.stringify(current));
    return current;
  },

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.CHECKLISTS);
    localStorage.removeItem(STORAGE_KEYS.SCANS);
    localStorage.removeItem(STORAGE_KEYS.DEMANDES);
    localStorage.removeItem(STORAGE_KEYS.SAVED_PROCEDURES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SCAN_CONSENT_ACCEPTED);
    localStorage.removeItem(STORAGE_KEYS.PROCEDURE_VERIFICATIONS);
  },
};

