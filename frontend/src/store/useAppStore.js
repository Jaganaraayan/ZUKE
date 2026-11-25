import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // Navigation
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Projects
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...updates } : state.currentProject,
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),

  // 3D Scene State
  sceneConfig: null,
  setSceneConfig: (config) => set({ sceneConfig: config }),
  updateSceneConfig: (updates) => set((state) => ({
    sceneConfig: state.sceneConfig ? { ...state.sceneConfig, ...updates } : updates,
  })),

  // Selected object in 3D workspace
  selectedObject: null,
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  // Generation history
  promptHistory: [],
  setPromptHistory: (history) => set({ promptHistory: history }),
  addPromptToHistory: (entry) => set((state) => ({
    promptHistory: [...state.promptHistory, entry],
  })),
  removePromptFromHistory: (index) => set((state) => ({
    promptHistory: state.promptHistory.filter((_, i) => i !== index),
  })),
  undoPromptHistory: () => set((state) => {
    if (state.promptHistory.length === 0) return state;
    return { promptHistory: state.promptHistory.slice(0, -1) };
  }),

  // Sketch state
  sketchData: null,
  setSketchData: (data) => set({ sketchData: data }),

  // Upload state
  uploadedImage: null,
  setUploadedImage: (img) => set({ uploadedImage: img }),

  // UI state
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  // Settings
  settings: {
    theme: 'dark',
    gridSnapping: true,
    autoSave: true,
    defaultWallHeight: 3.0,
    defaultWallThickness: 0.2,
    measurementUnit: 'meters',
  },
  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates },
  })),

  // Favorites (preset IDs)
  favoritePresets: [],
  toggleFavoritePreset: (id) => set((state) => ({
    favoritePresets: state.favoritePresets.includes(id)
      ? state.favoritePresets.filter(f => f !== id)
      : [...state.favoritePresets, id],
  })),
}));

export default useAppStore;
