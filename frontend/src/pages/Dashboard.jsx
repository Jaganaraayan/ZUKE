import React, { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import { getAllProjects, saveProject } from '../services/storage';
import { PRESETS } from '../presets/presetData';
import {
  PenTool,
  UploadCloud,
  Sparkles,
  Box,
  Compass,
  FolderKanban,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Download
} from 'lucide-react';
import '../styles/dashboard.css';

export default function Dashboard() {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const projects = useAppStore((s) => s.projects);
  const setProjects = useAppStore((s) => s.setProjects);
  const setCurrentProject = useAppStore((s) => s.setCurrentProject);
  const setSceneConfig = useAppStore((s) => s.setSceneConfig);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const projs = await getAllProjects();
      setProjects(projs);
      setLoading(false);
    }
    loadData();
  }, [setProjects]);

  const handleOpenProject = (proj) => {
    setCurrentProject(proj);
    if (proj.sceneConfig) {
      setSceneConfig(proj.sceneConfig);
      setCurrentPage('workspace3d');
    } else {
      setCurrentPage('sketch');
    }
  };

  const handleCreateNew = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: `Architectural Study #${projects.length + 1}`,
      description: 'New interactive architectural visualization project.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Modern Residential',
      style: 'Modern',
      sceneConfig: null
    };
    saveProject(newProj).then(() => {
      setProjects([newProj, ...projects]);
      setCurrentProject(newProj);
      setCurrentPage('sketch');
    });
  };

  const featuredPresets = PRESETS.slice(0, 4);

  return (
    <div className="dashboard-container fade-in">
      {/* Hero Welcome Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>ZUKE ARCHITECTURAL STUDIO 2.0</span>
          </div>
          <h1 className="hero-title">
            From Sketch to Structure.<br />
            <span>From Imagination to Reality.</span>
          </h1>
          <p className="hero-subtitle">
            Transform hand-drawn floor plans, 2D architectural sketches, and natural-language prompts
            into interactive, fully-editable 3D spatial models.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={handleCreateNew}>
              <Plus size={18} />
              <span>Create New Project</span>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setCurrentPage('sketch')}>
              <PenTool size={18} />
              <span>2D Sketch Studio</span>
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setCurrentPage('generator')}>
              <Sparkles size={18} />
              <span>AI 3D Generator</span>
            </button>
          </div>
        </div>

        {/* Stats card */}
        <div className="hero-stats-card">
          <div className="stat-row">
            <div className="stat-box">
              <span className="stat-number">{projects.length}</span>
              <span className="stat-label">Saved Projects</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">60</span>
              <span className="stat-label">Prompt Presets</span>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-box">
              <span className="stat-number">100%</span>
              <span className="stat-label">Procedural 3D</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">GLB / OBJ</span>
              <span className="stat-label">Real Exports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Cards */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-heading">Studio Workspaces</h2>
            <p className="section-subheading">Access specialized tools for every phase of architectural development</p>
          </div>
        </div>

        <div className="workspaces-grid">
          <div className="workspace-card" onClick={() => setCurrentPage('sketch')}>
            <div className="card-icon-box accent-gold">
              <PenTool size={24} />
            </div>
            <h3 className="card-title">2D Sketch Studio</h3>
            <p className="card-desc">
              Draw precise architectural walls, room layouts, doors, and windows on an interactive snapped grid canvas.
            </p>
            <div className="card-footer-link">
              <span>Launch Studio</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="workspace-card" onClick={() => setCurrentPage('upload')}>
            <div className="card-icon-box accent-blue">
              <UploadCloud size={24} />
            </div>
            <h3 className="card-title">Upload & 2D-to-3D</h3>
            <p className="card-desc">
              Import raster sketches, calibrate real-world scale, auto-detect walls, trace boundaries and extrude directly to 3D.
            </p>
            <div className="card-footer-link">
              <span>Convert Sketch</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="workspace-card" onClick={() => setCurrentPage('generator')}>
            <div className="card-icon-box accent-purple">
              <Sparkles size={24} />
            </div>
            <h3 className="card-title">AI Text-to-3D</h3>
            <p className="card-desc">
              Describe multi-storey villas, commercial offices, or interior spaces in natural language and generate full 3D geometry.
            </p>
            <div className="card-footer-link">
              <span>Open Generator</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="workspace-card" onClick={() => setCurrentPage('workspace3d')}>
            <div className="card-icon-box accent-emerald">
              <Box size={24} />
            </div>
            <h3 className="card-title">Interactive 3D Viewport</h3>
            <p className="card-desc">
              Inspect materials, adjust components in real-time, refine geometry with prompt modifications, and export GLB.
            </p>
            <div className="card-footer-link">
              <span>Enter 3D Viewport</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-heading">Recent Projects</h2>
            <p className="section-subheading">Continue working on your architectural models and floor plans</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage('projects')}>
            <span>View All ({projects.length})</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="empty-projects-panel">
            <FolderKanban size={36} className="text-muted" />
            <p>No projects saved yet. Create your first architectural sketch or AI model.</p>
            <button className="btn btn-primary btn-sm" onClick={handleCreateNew}>
              Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="project-card" onClick={() => handleOpenProject(proj)}>
                <div className="project-thumbnail-preview">
                  <Box size={32} className="thumbnail-icon" />
                  <span className="project-category-badge">{proj.category || 'Architecture'}</span>
                </div>
                <div className="project-details">
                  <h4 className="project-name truncate">{proj.name}</h4>
                  <p className="project-desc truncate">{proj.description || proj.prompt || 'Architectural 3D Model'}</p>
                  <div className="project-meta">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                    </span>
                    <span className="meta-style-tag">{proj.style || 'Modern'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Preset Highlights Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-heading">Preset Prompt Library</h2>
            <p className="section-subheading">Choose from 60 expertly curated architectural designs ready to generate</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage('presets')}>
            <span>Browse All 60 Presets</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="presets-highlight-grid">
          {featuredPresets.map((preset) => (
            <div
              key={preset.id}
              className="preset-highlight-card"
              onClick={() => {
                setCurrentPage('presets');
              }}
            >
              <div className="preset-card-top">
                <span className="preset-tag">{preset.category}</span>
                <span className="preset-style">{preset.style}</span>
              </div>
              <h4 className="preset-name">{preset.name}</h4>
              <p className="preset-prompt-snippet">"{preset.prompt}"</p>
              <div className="preset-card-bottom">
                <span>{preset.params.floors} Storey • {preset.params.exteriorMaterial.replace('_', ' ')}</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
