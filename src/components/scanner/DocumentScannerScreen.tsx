import React, { useState, useRef, useEffect } from 'react';
import { Language, ScannedDocument } from '../../types';
import { t } from '../../data/translations';
import { storage } from '../../utils/storage';
import { scanDb } from '../../utils/indexedDb';
import {
  Camera,
  Upload,
  ShieldAlert,
  Trash2,
  Copy,
  Check,
  FileText,
  AlertCircle,
  RefreshCw,
  Lock,
  X,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  language: Language;
  onSavedScan?: (scan: ScannedDocument) => void;
}

export const DocumentScannerScreen: React.FC<Props> = ({ language, onSavedScan }) => {
  const [scans, setScans] = useState<ScannedDocument[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScannedDocument | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Consent modal state (default: required before any scan)
  const [hasConsent, setHasConsent] = useState<boolean>(() => storage.isScanConsentAccepted());
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'camera' | 'upload' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    scanDb.getAll().then((loaded) => setScans(loaded));
  }, []);

  const triggerScanAction = (action: 'camera' | 'upload') => {
    if (!hasConsent) {
      setPendingAction(action);
      setShowConsentModal(true);
      return;
    }

    if (action === 'camera') {
      startCamera();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleAcceptConsent = () => {
    storage.setScanConsentAccepted();
    setHasConsent(true);
    setShowConsentModal(false);
    if (pendingAction === 'camera') {
      startCamera();
    } else if (pendingAction === 'upload') {
      fileInputRef.current?.click();
    }
    setPendingAction(null);
  };

  const handleDeclineConsent = () => {
    setShowConsentModal(false);
    setPendingAction(null);
    setErrorMsg('Vous avez refusé le traitement OCR par l’IA. Vous pouvez saisir vos démarches manuellement.');
  };

  // Start real camera stream
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraActive(false);
      setErrorMsg('Impossible d’accéder à la caméra. Vous pouvez importer une image.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      processImageOCR(dataUrl, 'image/jpeg', 'Scan Caméra');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 6 * 1024 * 1024) {
      setErrorMsg('Le fichier est trop volumineux. La limite maximale est de 6 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      processImageOCR(base64, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  const processImageOCR = async (imageBase64: string, mimeType: string, filename: string) => {
    setIsScanning(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ocr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Erreur lors du traitement OCR.');
      }

      const ocrResult = await response.json();

      const newScan: ScannedDocument = {
        id: `scan_${Date.now()}`,
        title: filename || 'Document scanné',
        docType: ocrResult.docType || 'other',
        scannedAt: new Date().toISOString(),
        fileData: imageBase64,
        extractedText: ocrResult.extractedText || 'Texte non détecté',
        extractedDetails: ocrResult.extractedDetails,
        fileSizeKb: Math.round(imageBase64.length / 1024),
      };

      // Save to IndexedDB with quota error handling
      await scanDb.save(newScan);
      const updatedList = await scanDb.getAll();
      setScans(updatedList);
      setSelectedScan(newScan);
      if (onSavedScan) onSavedScan(newScan);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erreur lors de l’analyse du document.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeleteScan = async (id: string) => {
    await scanDb.delete(id);
    const updated = await scanDb.getAll();
    setScans(updated);
    if (selectedScan?.id === id) {
      setSelectedScan(null);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRtl = language === 'ar' || language === 'darija';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 space-y-5 pb-24 text-slate-100">
      {/* Title & Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Camera className="w-4 h-4" />
          </span>
          <h1 className="text-xl font-bold text-white">{t(language, 'scanner_title')}</h1>
        </div>
        <p className="text-xs text-slate-400">
          Optionnel : Extraction de texte pour préparer vos démarches administratives.
        </p>
      </div>

      {/* Mandatory Privacy & AI Processing Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <Lock className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
        <div className="space-y-1 text-slate-300">
          <p className="font-semibold text-white">
            Traitement optique sécurisé & Stockage local (IndexedDB)
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Vos scans sont stockés exclusivement dans la mémoire locale de votre appareil. Les images sont envoyées de manière chiffrée à l'API Google Gemini pour extraction OCR et ne sont pas archivées sur notre serveur.
          </p>
        </div>
      </div>

      {/* Camera Live Viewfinder or Trigger Buttons */}
      {cameraActive ? (
        <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-emerald-500 shadow-2xl">
          <video ref={videoRef} autoPlay playsInline className="w-full h-72 object-cover" />
          {/* Viewfinder overlay */}
          <div className="absolute inset-6 border-2 border-dashed border-emerald-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
            <span className="text-[11px] font-mono bg-black/60 px-3 py-1 rounded-full text-emerald-300">
              Alignez le document (Attestation / Diplôme / CIN)
            </span>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6">
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full text-xs font-semibold"
            >
              Annuler
            </button>
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center active:scale-95 transition-transform shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => triggerScanAction('camera')}
            className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl bg-linear-to-b from-emerald-950/40 to-slate-900 border border-emerald-800/40 hover:border-emerald-500 text-emerald-300 transition-all active:scale-98"
          >
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-center">{t(language, 'scanner_take_photo')}</span>
          </button>

          <button
            onClick={() => triggerScanAction('upload')}
            className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all active:scale-98"
          >
            <div className="p-3 rounded-2xl bg-slate-800 text-slate-300">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-center">{t(language, 'scanner_upload_file')}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Loading analysis state */}
      {isScanning && (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm font-semibold text-emerald-300">{t(language, 'scanner_analyzing')}</p>
          <p className="text-xs text-slate-500">Extraction optique via vision IA...</p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Inspected Document Detail Card */}
      {selectedScan && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md">
                {selectedScan.docType.toUpperCase()}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{selectedScan.title}</h3>
              <p className="text-[11px] text-slate-400">
                Scanné le {new Date(selectedScan.scannedAt).toLocaleDateString()} • {selectedScan.fileSizeKb} Ko
              </p>
            </div>
            <button
              onClick={() => handleDeleteScan(selectedScan.id)}
              className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-900/20"
              title={t(language, 'scanner_delete_permanent')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Extracted Details Pill Grid */}
          {selectedScan.extractedDetails && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {selectedScan.extractedDetails.fullName && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Nom détecté</span>
                  <span className="font-semibold text-slate-100">{selectedScan.extractedDetails.fullName}</span>
                </div>
              )}
              {selectedScan.extractedDetails.cinNumber && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">N° Document</span>
                  <span className="font-semibold text-emerald-400 font-mono">
                    {selectedScan.extractedDetails.cinNumber}
                  </span>
                </div>
              )}
              {selectedScan.extractedDetails.validity && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Validité</span>
                  <span className="font-semibold text-slate-100">{selectedScan.extractedDetails.validity}</span>
                </div>
              )}
              {selectedScan.extractedDetails.institution && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Organisme</span>
                  <span className="font-semibold text-slate-100">{selectedScan.extractedDetails.institution}</span>
                </div>
              )}
            </div>
          )}

          {/* Raw Extracted Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                {t(language, 'scanner_extracted_text')}
              </span>
              <button
                onClick={() => handleCopyText(selectedScan.extractedText)}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié' : 'Copier'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {selectedScan.extractedText}
            </pre>
          </div>
        </div>
      )}

      {/* History of Scanned Documents (IndexedDB) */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Mes documents scannés ({scans.length})</span>
        </h3>

        {scans.length === 0 ? (
          <div className="p-6 text-center bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400 text-xs">
            {t(language, 'no_scans')}
          </div>
        ) : (
          <div className="space-y-2">
            {scans.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedScan(s)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedScan?.id === s.id
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{s.title}</h4>
                    <p className="text-[10px] text-slate-400">
                      {s.docType.toUpperCase()} • {new Date(s.scannedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScan(s.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explicit Consent Modal before First Scan */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl text-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Consentement au traitement IA</h3>
                <p className="text-xs text-slate-400">Scan & Reconnaissance de documents</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
              <p>
                Avant de scanner ou d'importer une pièce justificative, veuillez noter les conditions techniques suivantes :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>L'image est transmise de manière chiffrée à notre serveur puis à l'API Google Gemini pour extraction de texte OCR.</li>
                <li>Sur le niveau d'utilisation gratuit de Google, les données soumises peuvent être analysées pour améliorer les modèles.</li>
                <li>
                  <strong className="text-amber-400">Recommandation :</strong> Ne scannez pas de pièces d'identité officielles sensibles si vous n'êtes pas à l'aise avec ce traitement par un tiers.
                </li>
              </ul>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAcceptConsent}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-lg transition-all"
              >
                J'accepte et je comprends
              </button>
              <button
                onClick={handleDeclineConsent}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-semibold transition-colors"
              >
                Refuser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
