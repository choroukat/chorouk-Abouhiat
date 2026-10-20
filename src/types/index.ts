export type Language = 'darija' | 'ar' | 'fr';

export type CategoryType =
  | 'education'
  | 'documents'
  | 'internship'
  | 'administration'
  | 'scholarships'
  | 'identity'
  | 'transport'
  | 'housing'
  | 'applications'
  | 'other';

export interface LocalizedString {
  fr: string;
  ar: string;
  darija: string;
}

export interface RequiredDocument {
  id: string;
  name: LocalizedString;
  copies: number;
  notes?: LocalizedString;
  isOptional?: boolean;
  commonIssuers?: string[];
}

export interface Procedure {
  id: string;
  slug: string;
  title: LocalizedString;
  category: CategoryType;
  description: LocalizedString;
  requiredDocuments: RequiredDocument[];
  eligibility: LocalizedString;
  steps: LocalizedString[];
  location: LocalizedString;
  appointmentRequired: boolean;
  appointmentUrl?: string;
  feesMAD: number;
  deadline?: LocalizedString;
  officialSource: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
  verificationStatus: 'unverified' | 'verified';
  userVerificationDate?: string;
  tags: string[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  isCompleted: boolean;
  copiesRequired?: number;
  notes?: string;
  attachmentName?: string;
  attachmentData?: string; // base64 or local blob
  attachedAt?: string;
}

export interface UserChecklist {
  id: string;
  title: string;
  procedureId?: string;
  category: CategoryType;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  isCustom?: boolean;
}

export interface ScannedDocument {
  id: string;
  title: string;
  docType: 'cin' | 'diploma' | 'attestation' | 'releve' | 'birth_cert' | 'other';
  scannedAt: string;
  fileData: string; // base64 preview
  extractedText: string;
  extractedDetails?: {
    fullName?: string;
    cinNumber?: string;
    birthDate?: string;
    institution?: string;
    validity?: string;
  };
  fileSizeKb: number;
}

export type DemandeType =
  | 'stage'
  | 'inscription'
  | 'attestation'
  | 'diplome'
  | 'releve'
  | 'transfert'
  | 'administrative';

export interface GeneratedDemande {
  id: string;
  type: DemandeType;
  title: string;
  language: 'fr' | 'ar';
  recipientTitle: string;
  fullName: string;
  cinNumber: string;
  cneOrMassar?: string;
  universityOrCompany: string;
  phone: string;
  email: string;
  city: string;
  content: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'deadline' | 'update' | 'reminder' | 'system';
  procedureId?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  preferredLanguage: Language;
  notificationsEnabled: boolean;
  savedProcedureIds: string[];
  isAdmin?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedProcedure?: Procedure;
  suggestedChecklist?: {
    title: string;
    documents: string[];
    procedureId?: string;
  };
  sources?: {
    name: string;
    url: string;
    lastVerifiedDate: string;
  }[];
  warningNotice?: string;
  isAudio?: boolean;
}
