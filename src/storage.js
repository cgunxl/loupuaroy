const DB_NAME = 'auto-clip-db';
const STORE = 'sessions';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSession(data) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const rec = { ts: Date.now(), ...data };
    store.add(rec);
    await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
  } catch (_) { /* ignore */ }
}

export async function loadLatest() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    const rows = await new Promise((res, rej) => { req.onsuccess = () => res(req.result || []); req.onerror = () => rej(req.error); });
    rows.sort((a, b) => b.ts - a.ts);
    return rows[0] || null;
  } catch (_) { return null; }
}