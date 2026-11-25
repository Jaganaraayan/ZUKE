// Storage Service: IndexedDB + LocalStorage persistence for ZUKE projects

const DB_NAME = 'zuke_architectural_db';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function getAllProjects() {
  try {
    const db = await openDatabase();
    if (!db) {
      const raw = localStorage.getItem('zuke_projects');
      return raw ? JSON.parse(raw) : getInitialProjects();
    }
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result;
        if (!list || list.length === 0) {
          const init = getInitialProjects();
          init.forEach(p => saveProject(p));
          resolve(init);
        } else {
          resolve(list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        }
      };
      req.onerror = () => {
        const raw = localStorage.getItem('zuke_projects');
        resolve(raw ? JSON.parse(raw) : getInitialProjects());
      };
    });
  } catch (err) {
    console.error('Error loading projects:', err);
    return getInitialProjects();
  }
}

export async function saveProject(project) {
  const updated = {
    ...project,
    updatedAt: new Date().toISOString()
  };
  try {
    const db = await openDatabase();
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(updated);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (e) {
    console.warn('IndexedDB save failed, falling back to localStorage', e);
  }
  // Always update localStorage mirror
  try {
    const existing = JSON.parse(localStorage.getItem('zuke_projects') || '[]');
    const idx = existing.findIndex(p => p.id === updated.id);
    if (idx >= 0) {
      existing[idx] = updated;
    } else {
      existing.unshift(updated);
    }
    localStorage.setItem('zuke_projects', JSON.stringify(existing));
  } catch (e) {
    console.warn('LocalStorage mirror error', e);
  }
  return updated;
}

export async function deleteProjectFromDB(id) {
  try {
    const db = await openDatabase();
    if (db) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (e) {
    console.warn('IndexedDB delete error', e);
  }
  try {
    const existing = JSON.parse(localStorage.getItem('zuke_projects') || '[]');
    const filtered = existing.filter(p => p.id !== id);
    localStorage.setItem('zuke_projects', JSON.stringify(filtered));
  } catch (e) {
    console.warn('LocalStorage delete mirror error', e);
  }
}

export function exportProjectJSON(project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_project.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function getInitialProjects() {
  return [
    {
      id: 'proj-demo-1',
      name: 'Modern Lakeside Villa',
      description: 'Two-storey contemporary villa with cantilevered balcony, glass facade and swimming pool.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      prompt: 'Create a modern two-storey luxury villa with glass curtain walls, flat roof, wooden exterior panels, swimming pool and balcony.',
      category: 'Modern Residential',
      style: 'Modern',
      thumbnail: null,
      sceneConfig: {
        buildingType: 'Residential',
        style: 'Modern',
        floors: 2,
        wallHeight: 3.2,
        wallThickness: 0.25,
        roofType: 'flat',
        exteriorMaterial: 'wood_panel',
        dimensions: { width: 14, length: 18, height: 6.8 },
        features: ['swimming_pool', 'balcony', 'landscaped_garden'],
        doors: [{ position: [0, 0, 9], width: 1.8, height: 2.4 }],
        windows: [
          { position: [-4, 1.2, 9], width: 2.2, height: 1.8 },
          { position: [4, 1.2, 9], width: 2.2, height: 1.8 },
          { position: [-4, 4.4, 9], width: 2.2, height: 1.8 },
          { position: [4, 4.4, 9], width: 2.2, height: 1.8 }
        ]
      }
    },
    {
      id: 'proj-demo-2',
      name: 'Heritage Courtyard Residence',
      description: 'Traditional Indian courtyard residence with central open-air atrium, carved pillars and terracotta roof.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      prompt: 'Design a traditional Indian courtyard house with carved teakwood pillars, central courtyard, terracotta sloping roof, and brass accents.',
      category: 'Traditional & Cultural',
      style: 'Traditional',
      thumbnail: null,
      sceneConfig: {
        buildingType: 'Residential',
        style: 'Traditional',
        floors: 2,
        wallHeight: 3.2,
        wallThickness: 0.3,
        roofType: 'terracotta_pitched',
        exteriorMaterial: 'brick',
        dimensions: { width: 15, length: 15, height: 7.0 },
        features: ['central_courtyard', 'carved_pillars'],
        doors: [{ position: [0, 0, 7.5], width: 1.6, height: 2.4 }],
        windows: [{ position: [-3, 1.2, 7.5], width: 1.4, height: 1.6 }]
      }
    }
  ];
}
