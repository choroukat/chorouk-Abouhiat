import { ScannedDocument } from '../types';

const DB_NAME = 'WachNqder_Storage_v1';
const DB_VERSION = 1;
const STORE_NAME = 'scanned_documents';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      return reject(new Error('IndexedDB non supporté par ce navigateur.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const scanDb = {
  async getAll(): Promise<ScannedDocument[]> {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('Failed to read scans from IndexedDB:', err);
      return [];
    }
  },

  async save(scan: ScannedDocument): Promise<void> {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(scan);
        req.onsuccess = () => resolve();
        req.onerror = (e: any) => {
          if (e.target?.error?.name === 'QuotaExceededError') {
            reject(
              new Error('Espace de stockage saturé sur votre appareil. Veuillez supprimer d’anciens scans.')
            );
          } else {
            reject(req.error);
          }
        };
      });
    } catch (err: any) {
      if (err?.name === 'QuotaExceededError') {
        throw new Error('Espace de stockage saturé sur votre appareil.');
      }
      throw err;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('Failed to delete scan from IndexedDB:', err);
    }
  },

  async clear(): Promise<void> {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error('Failed to clear scans from IndexedDB:', err);
    }
  },
};
