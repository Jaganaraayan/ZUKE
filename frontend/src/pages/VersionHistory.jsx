import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import {
  saveVersion,
  getAllVersions,
  deleteVersion,
  renameVersion
} from '../services/versionHistory';
import { parsePromptToScene } from '../services/promptParser';
import {
  History,
  Save,
  RotateCcw,
  Trash2,
  Edit3,
  Check,
  X,
  Clock,
  Layers,
  Sparkles,
  Box,
  Wand2,
  Eye,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import '../styles/versionhistory.css';

export default function VersionHistory() {
  const sceneConfig = useAppStore((s) => s.sceneConfig);
  const setSceneConfig = useAppStore((s) => s.setSceneConfig);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const promptHistory = useAppStore((s) => s.promptHistory);
  const removePromptFromHistory = useAppStore((s) => s.removePromptFromHistory);
  const addPromptToHistory = useAppStore((s) => s.addPromptToHistory);

  const [activeTab, setActiveTab] = useState('models'); // 'models' | 'modifications'
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [selectedModDetail, setSelectedModDetail] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const list = await getAllVersions();
      setVersions(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleManualSave = async () => {
    if (!sceneConfig) {
      setStatusMsg({ type: 'error', text: 'No active 3D model found to save.' });
      setTimeout(() => setStatusMsg(null), 3000);
      return;
    }

    const lastPrompt = promptHistory.length > 0 ? promptHistory[promptHistory.length - 1].prompt : 'Manual Snapshot';
    try {
      await saveVersion(sceneConfig, lastPrompt);
      setStatusMsg({ type: 'success', text: 'New 3D design revision recorded in history!' });
      setTimeout(() => setStatusMsg(null), 3000);
      loadAll();
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to save version.' });
    }
  };

  const handleViewModel = (ver) => {
    if (!ver.sceneConfig) return;
    setSceneConfig(ver.sceneConfig);
    setCurrentPage('workspace3d');
  };

  const handleContinueEditing = (ver) => {
    if (!ver.sceneConfig) return;
    setSceneConfig(ver.sceneConfig);
    setCurrentPage('workspace3d');
  };

  const handleRegenerate = (ver) => {
    if (ver.prompt) {
      // Open generator with this prompt
      setCurrentPage('generator');
    } else if (ver.sceneConfig) {
      setSceneConfig(ver.sceneConfig);
      setCurrentPage('generator');
    }
  };

  const handleDeleteModel = async (id, e) => {
    e?.stopPropagation();
    if (window.confirm('Delete this saved 3D model from history?')) {
      await deleteVersion(id);
      loadAll();
      setStatusMsg({ type: 'info', text: '3D model record deleted.' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleStartRename = (ver, e) => {
    e?.stopPropagation();
    setEditingId(ver.id);
    setEditTitle(ver.name);
  };

  const handleSaveRename = async (id, e) => {
    e?.stopPropagation();
    if (editTitle.trim()) {
      await renameVersion(id, editTitle.trim());
      setEditingId(null);
      loadAll();
    }
  };

  // Modification actions
  const handleApplyAgain = (mod) => {
    if (!mod.prompt) return;
    try {
      const result = parsePromptToScene(mod.prompt, sceneConfig);
      setSceneConfig(result.sceneConfig);
      addPromptToHistory({
        prompt: mod.prompt,
        changes: result.changes,
        affectedComponents: result.affectedComponents,
        timestamp: new Date().toISOString()
      });
      setStatusMsg({ type: 'success', text: `Re-applied prompt modification: "${mod.prompt}"` });
      setTimeout(() => {
        setCurrentPage('workspace3d');
      }, 700);
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to re-apply prompt modification.' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleDeleteModRecord = (index) => {
    removePromptFromHistory(index);
    setStatusMsg({ type: 'info', text: 'Modification history record removed.' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="version-history-page">
      <header className="version-header">
        <div className="version-header-left">
          <div className="version-icon-wrap">
            <History size={24} />
          </div>
          <div>
            <h1>MY GENERATION HISTORY</h1>
            <p>Access your past 3D architectural generations and prompt modification timeline</p>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleManualSave}>
          <Save size={16} />
          <span>Save Current 3D State</span>
        </button>
      </header>

      {/* Tabs bar */}
      <div className="history-tabs-nav">
        <button
          className={`history-tab-btn ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          <Box size={16} />
          <span>3D Generation History</span>
          <span className="tab-counter-badge">{versions.length}</span>
        </button>
        <button
          className={`history-tab-btn ${activeTab === 'modifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('modifications')}
        >
          <Wand2 size={16} />
          <span>Prompt Modification History</span>
          <span className="tab-counter-badge">{promptHistory.length}</span>
        </button>
      </div>

      {statusMsg && (
        <div className={`status-banner ${statusMsg.type}`}>
          {statusMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* TAB 1: 3D Generation History */}
      {activeTab === 'models' && (
        <main className="timeline-container">
          {loading ? (
            <div className="timeline-loading">
              <div className="spinner"></div>
              <p>Scanning saved 3D architectural records...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="timeline-empty">
              <Box size={48} className="empty-icon" />
              <h3>No Saved 3D Models in History</h3>
              <p>Generated 3D scenes from the AI Text-to-3D Generator or 3D Workspace will appear here for rollback, editing, and export.</p>
              <button className="btn btn-secondary mt-4" onClick={handleManualSave}>
                <Save size={15} /> Save Current Model
              </button>
            </div>
          ) : (
            <div className="timeline-list">
              {versions.map((ver, idx) => {
                const date = new Date(ver.timestamp);
                const formattedDate = date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={ver.id} className="timeline-card">
                    <div className="timeline-marker">
                      <span className="marker-dot"></span>
                      {idx < versions.length - 1 && <span className="marker-line"></span>}
                    </div>

                    <div className="timeline-card-content">
                      <div className="card-top-row">
                        <div className="title-area">
                          {editingId === ver.id ? (
                            <div className="rename-box" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="rename-input"
                                autoFocus
                              />
                              <button className="icon-btn-check" onClick={(e) => handleSaveRename(ver.id, e)}>
                                <Check size={14} />
                              </button>
                              <button className="icon-btn-cancel" onClick={() => setEditingId(null)}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="title-view">
                              <h3>{ver.name}</h3>
                              <button
                                className="icon-rename"
                                title="Rename Revision"
                                onClick={(e) => handleStartRename(ver, e)}
                              >
                                <Edit3 size={13} />
                              </button>
                            </div>
                          )}
                          <span className="timestamp">
                            <Clock size={12} /> {formattedDate}
                          </span>
                        </div>

                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleViewModel(ver)}
                            title="View model in 3D viewport"
                          >
                            <Eye size={14} />
                            <span>View Model</span>
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleContinueEditing(ver)}
                            title="Open in 3D workspace to edit geometry & materials"
                          >
                            <Sliders size={14} />
                            <span>Continue Editing</span>
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleRegenerate(ver)}
                            title="Load prompt into AI Generator"
                          >
                            <RefreshCw size={14} />
                            <span>Regenerate</span>
                          </button>
                          <button
                            className="btn btn-sm btn-ghost text-danger"
                            onClick={(e) => handleDeleteModel(ver.id, e)}
                            title="Delete this record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {ver.prompt && (
                        <div className="prompt-quote">
                          <Sparkles size={13} />
                          <p>"{ver.prompt}"</p>
                        </div>
                      )}

                      <div className="meta-pills">
                        <span className="meta-pill">
                          <Layers size={12} /> {ver.sceneConfig?.floors || 1} Floor{ver.sceneConfig?.floors > 1 ? 's' : ''}
                        </span>
                        <span className="meta-pill">
                          Style: {ver.sceneConfig?.style || 'Architectural'}
                        </span>
                        <span className="meta-pill">
                          Roof: {ver.sceneConfig?.roofType || 'Flat'}
                        </span>
                        {ver.sceneConfig?.dimensions && (
                          <span className="meta-pill">
                            Dimensions: {ver.sceneConfig.dimensions.width}m × {ver.sceneConfig.dimensions.length}m
                          </span>
                        )}
                        {ver.sceneConfig?.features && ver.sceneConfig.features.length > 0 && (
                          <span className="meta-pill features-count">
                            +{ver.sceneConfig.features.length} Features
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* TAB 2: Prompt Modification History */}
      {activeTab === 'modifications' && (
        <main className="timeline-container">
          {promptHistory.length === 0 ? (
            <div className="timeline-empty">
              <Wand2 size={48} className="empty-icon" />
              <h3>No Prompt Modifications Recorded</h3>
              <p>Natural-language instructions applied in the AI Geometry Editor or Generator will be preserved here with before/after geometry audits.</p>
            </div>
          ) : (
            <div className="timeline-list">
              {promptHistory.map((mod, idx) => {
                const date = mod.timestamp ? new Date(mod.timestamp) : new Date();
                const formattedDate = date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={idx} className="timeline-card">
                    <div className="timeline-marker">
                      <span className="marker-dot"></span>
                      {idx < promptHistory.length - 1 && <span className="marker-line"></span>}
                    </div>

                    <div className="timeline-card-content">
                      <div className="card-top-row">
                        <div className="title-area">
                          <div className="title-view">
                            <h3>Modification #{promptHistory.length - idx}</h3>
                          </div>
                          <span className="timestamp">
                            <Clock size={12} /> {formattedDate}
                          </span>
                        </div>

                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleApplyAgain(mod)}
                            title="Re-apply this natural-language modification to the active 3D scene"
                          >
                            <Wand2 size={14} />
                            <span>Apply Again</span>
                          </button>
                          <button
                            className="btn btn-sm btn-ghost text-danger"
                            onClick={() => handleDeleteModRecord(idx)}
                            title="Delete this modification record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="prompt-quote">
                        <Sparkles size={13} />
                        <p>"{mod.prompt}"</p>
                      </div>

                      {mod.changes && mod.changes.length > 0 && (
                        <div className="mod-changes-box">
                          <span className="mod-changes-label">Applied Geometry Changes:</span>
                          <div className="mod-tags-row">
                            {mod.changes.map((c, i) => (
                              <span key={i} className="mod-change-pill">
                                <Check size={11} /> {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {mod.affectedComponents && mod.affectedComponents.length > 0 && (
                        <div className="mod-components-box">
                          <span className="mod-changes-label">Affected Scene Components:</span>
                          <div className="mod-tags-row">
                            {mod.affectedComponents.map((comp, i) => (
                              <span key={i} className="mod-comp-pill">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
