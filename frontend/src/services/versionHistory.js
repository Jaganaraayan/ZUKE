// IndexedDB-based version history for ZUKE 3D scenes
const DB_NAME = 'zuke_version_db';
const DB_VERSION = 1;
const STORE_NAME = 'versions';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function countVersions() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).count();
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(0);
    });
  } catch (err) {
    console.error('Count error:', err);
    return 0;
  }
}

export async function saveVersion(sceneConfig, promptText = '', name = null, cameraConfig = null) {
  try {
    const db = await openDB();
    const id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const versionCount = await countVersions();
    const version = {
      id,
      versionNumber: versionCount + 1,
      name: name || `Design Revision #${versionCount + 1}`,
      timestamp: new Date().toISOString(),
      prompt: promptText || '',
      sceneConfig: sceneConfig ? JSON.parse(JSON.stringify(sceneConfig)) : null,
      cameraConfig: cameraConfig || null,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).add(version);
      tx.oncomplete = () => resolve(version);
      tx.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn('Fallback saving version to localStorage:', err);
    const id = `v_${Date.now()}`;
    const version = {
      id,
      versionNumber: 1,
      name: name || 'Design Revision #1',
      timestamp: new Date().toISOString(),
      prompt: promptText || '',
      sceneConfig: sceneConfig ? JSON.parse(JSON.stringify(sceneConfig)) : null,
    };
    const existing = JSON.parse(localStorage.getItem('zuke_versions_fallback') || '[]');
    existing.unshift(version);
    localStorage.setItem('zuke_versions_fallback', JSON.stringify(existing.slice(0, 30)));
    return version;
  }
}

export async function getAllVersions() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).index('timestamp').getAll();
      req.onsuccess = (e) => {
        const results = e.target.result || [];
        resolve(results.reverse());
      };
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn('Loading versions from localStorage fallback:', err);
    const existing = JSON.parse(localStorage.getItem('zuke_versions_fallback') || '[]');
    return existing;
  }
}

export async function getVersion(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    const existing = JSON.parse(localStorage.getItem('zuke_versions_fallback') || '[]');
    return existing.find(v => v.id === id) || null;
  }
}

export async function deleteVersion(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    const existing = JSON.parse(localStorage.getItem('zuke_versions_fallback') || '[]');
    localStorage.setItem('zuke_versions_fallback', JSON.stringify(existing.filter(v => v.id !== id)));
  }
}

export async function renameVersion(id, newName) {
  try {
    const db = await openDB();
    const version = await getVersion(id);
    if (!version) return;
    version.name = newName;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(version);
      tx.oncomplete = () => resolve(version);
      tx.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    const existing = JSON.parse(localStorage.getItem('zuke_versions_fallback') || '[]');
    const target = existing.find(v => v.id === id);
    if (target) target.name = newName;
    localStorage.setItem('zuke_versions_fallback', JSON.stringify(existing));
  }
}
