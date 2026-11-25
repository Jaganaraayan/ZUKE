import React, { useState, useEffect, useRef } from 'react';
import useAppStore from '../store/useAppStore';
import {
  getAllProjects,
  saveProject,
  deleteProjectFromDB,
  exportProjectJSON
} from '../services/storage';
import {
  FolderKanban,
  Plus,
  FolderOpen,
  Copy,
  Trash2,
  Download,
  Upload,
  Edit2,
  Clock,
  Box,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import '../styles/projects.css';

export default function ProjectManager() {
  const projects = useAppStore((s) => s.projects);
  const setProjects = useAppStore((s) => s.setProjects);
  const currentProject = useAppStore((s) => s.currentProject);
  const setCurrentProject = useAppStore((s) => s.setCurrentProject);
  const setSceneConfig = useAppStore((s) => s.setSceneConfig);
  const setSketchData = useAppStore((s) => s.setSketchData);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const importFileRef = useRef(null);

  useEffect(() => {
    async function load() {
      const list = await getAllProjects();
      setProjects(list);
    }
    load();
  }, [setProjects]);

  // Open Project
  const handleOpen = (proj) => {
    setCurrentProject(proj);
    if (proj.sceneConfig) {
      setSceneConfig(proj.sceneConfig);
      setCurrentPage('workspace3d');
    } else if (proj.sketchData) {
      setSketchData(proj.sketchData);
      setCurrentPage('sketch');
    } else {
      setCurrentPage('workspace3d');
    }
  };

  // Create Project
  const handleCreate = () => {
    const id = `proj_${Date.now()}`;
    const newProj = {
      id,
      name: `Design Project #${projects.length + 1}`,
      description: 'Custom architectural 3D model & floor plan study.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Modern Residential',
      style: 'Modern',
      sceneConfig: null,
      sketchData: null
    };

    saveProject(newProj).then(() => {
      setProjects([newProj, ...projects]);
      setCurrentProject(newProj);
      setCurrentPage('sketch');
    });
  };

  // Duplicate Project
  const handleDuplicate = async (proj) => {
    const dup = {
      ...JSON.parse(JSON.stringify(proj)),
      id: `proj_${Date.now()}`,
      name: `${proj.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await saveProject(dup);
    setProjects([dup, ...projects]);
  };

  // Start Rename
  const handleStartRename = (proj) => {
    setEditingId(proj.id);
    setEditName(proj.name);
  };

  // Save Rename
  const handleSaveRename = async (proj) => {
    if (!editName.trim()) return;
    const updated = { ...proj, name: editName.trim() };
    await saveProject(updated);
    setProjects(projects.map(p => p.id === proj.id ? updated : p));
    setEditingId(null);
  };

  // Delete Project
  const handleDelete = async (id) => {
    await deleteProjectFromDB(id);
    setProjects(projects.filter(p => p.id !== id));
    setDeletingId(null);
  };

  // Import JSON Project
  const handleImportJSON = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const imported = {
          ...parsed,
          id: `proj_imported_${Date.now()}`,
          name: parsed.name ? `${parsed.name} (Imported)` : 'Imported Design Project',
          updatedAt: new Date().toISOString()
        };
        await saveProject(imported);
        setProjects([imported, ...projects]);
        alert('Project imported successfully!');
      } catch (err) {
        alert('Invalid project JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
    (p.style && p.style.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="project-manager-container fade-in">
      {/* Header */}
      <div className="pm-header-row">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban size={22} className="text-accent" />
            <h1 className="pm-title">Project Management</h1>
          </div>
          <p className="pm-subtitle">
            Manage your saved architectural models, floor plans, and prompt histories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={importFileRef}
            onChange={handleImportJSON}
            accept=".json"
            style={{ display: 'none' }}
          />
          <button className="btn btn-secondary btn-sm" onClick={() => importFileRef.current?.click()}>
            <Upload size={14} />
            <span>Import JSON</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleCreate}>
            <Plus size={15} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="pm-grid">
        {filtered.map((proj) => {
          const isCurrent = currentProject?.id === proj.id;
          return (
            <div key={proj.id} className={`pm-card ${isCurrent ? 'active-proj' : ''}`}>
              <div className="pm-card-top">
                <div className="pm-thumb-icon">
                  <Box size={24} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  {editingId === proj.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rename-input"
                        autoFocus
                      />
                      <button className="rename-btn" onClick={() => handleSaveRename(proj)}>
                        <Check size={14} className="text-success" />
                      </button>
                      <button className="rename-btn" onClick={() => setEditingId(null)}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <h3 className="pm-card-name truncate" title={proj.name}>
                      {proj.name}
                    </h3>
                  )}
                  <span className="pm-card-date flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(proj.updatedAt || proj.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pm-card-body">
                <p className="pm-card-desc">
                  {proj.description || proj.prompt || 'Architectural project containing 3D geometry and design specifications.'}
                </p>

                <div className="pm-card-tags">
                  <span className="badge badge-accent">{proj.style || 'Modern'}</span>
                  <span className="badge badge-accent">{proj.category || 'Architecture'}</span>
                  {isCurrent && <span className="badge badge-success">Active</span>}
                </div>
              </div>

              <div className="pm-card-footer">
                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  onClick={() => handleStartRename(proj)}
                  title="Rename"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  onClick={() => handleDuplicate(proj)}
                  title="Duplicate"
                >
                  <Copy size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-icon"
                  onClick={() => exportProjectJSON(proj)}
                  title="Export JSON"
                >
                  <Download size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm btn-icon text-danger"
                  onClick={() => setDeletingId(proj.id)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  className="btn btn-primary btn-sm flex-1"
                  onClick={() => handleOpen(proj)}
                >
                  <FolderOpen size={14} />
                  <span>Open</span>
                </button>
              </div>

              {/* Confirm Delete Overlay */}
              {deletingId === proj.id && (
                <div className="delete-confirm-overlay">
                  <p className="text-xs font-semibold mb-2">Delete this project?</p>
                  <div className="flex gap-2">
                    <button className="btn btn-danger btn-sm flex-1" onClick={() => handleDelete(proj.id)}>
                      Delete
                    </button>
                    <button className="btn btn-secondary btn-sm flex-1" onClick={() => setDeletingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
