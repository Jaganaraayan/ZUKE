import React from 'react';
import useAppStore from '../store/useAppStore';
import { Plus, Save, Download, Sparkles, FolderOpen, Menu, Layers } from 'lucide-react';
import { exportSceneAsGLB } from '../services/exportService';

const PAGE_TITLES = {
  dashboard: { title: 'Architectural Dashboard', label: 'Overview' },
  sketch: { title: '2D Sketch & Floor Plan Studio', label: 'Drawing Workspace' },
  upload: { title: 'Upload & 2D-to-3D Geometry Converter', label: 'Conversion Workspace' },
  generator: { title: 'AI Text-to-3D Generator & Refiner', label: 'Generative Design' },
  workspace3d: { title: 'Interactive 3D Architectural Viewport', label: 'Model Inspector' },
  presets: { title: 'Architectural Preset Library (60)', label: 'Design Catalog' },
  projects: { title: 'Project Management & History', label: 'Saved Designs' },
  settings: { title: 'Studio Settings & Preferences', label: 'Configuration' },
};

export default function Topbar() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const currentProject = useAppStore((s) => s.currentProject);
  const sceneConfig = useAppStore((s) => s.sceneConfig);
  const toggleMobileMenu = useAppStore((s) => s.toggleMobileMenu);

  const meta = PAGE_TITLES[currentPage] || { title: 'ZUKE Studio', label: 'Architectural Studio' };

  const handleExportGLB = () => {
    if (window.__zuke_three_scene) {
      exportSceneAsGLB(window.__zuke_three_scene, currentProject?.name || 'zuke-architectural-model');
    } else {
      alert('Open the 3D Workspace to export the current 3D scene geometry as GLB.');
      setCurrentPage('workspace3d');
    }
  };

  const handleNewProject = () => {
    setCurrentPage('sketch');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-trigger"
          onClick={toggleMobileMenu}
          title="Open Navigation Menu"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
        <div>
          <span className="topbar-label">{meta.label}</span>
          <h2 className="topbar-title">{meta.title}</h2>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setCurrentPage('projects')}
          title="Open Project Manager"
        >
          <FolderOpen size={15} />
          <span>Projects</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleExportGLB}
          title="Export current 3D scene as GLB"
        >
          <Download size={15} />
          <span>Export GLB</span>
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={handleNewProject}
        >
          <Plus size={15} />
          <span>New Project</span>
        </button>
      </div>
    </header>
  );
}
