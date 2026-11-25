import React, { useState, useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import { PRESETS, PRESET_CATEGORIES } from '../presets/presetData';
import {
  Compass,
  Search,
  Star,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Edit3,
  Box,
  Copy,
  Layers,
  Home,
  CheckCircle2,
  X
} from 'lucide-react';
import '../styles/presets.css';

export default function PresetLibrary() {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const setSceneConfig = useAppStore((s) => s.setSceneConfig);
  const favoritePresets = useAppStore((s) => s.favoritePresets);
  const toggleFavoritePreset = useAppStore((s) => s.toggleFavoritePreset);
  const addPromptToHistory = useAppStore((s) => s.addPromptToHistory);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modal for editing preset prompt
  const [editingPreset, setEditingPreset] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Filtered list
  const filteredPresets = useMemo(() => {
    return PRESETS.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (onlyFavorites && !favoritePresets.includes(p.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchPrompt = p.prompt.toLowerCase().includes(q);
        const matchStyle = p.style.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchName && !matchPrompt && !matchStyle && !matchCat) return false;
      }
      return true;
    });
  }, [selectedCategory, onlyFavorites, favoritePresets, searchQuery]);

  // Handle direct 3D generation from preset
  const handleGenerateDirect = (preset, customPromptOverride = null) => {
    const pText = customPromptOverride || preset.prompt;
    const config = {
      buildingType: preset.buildingType,
      style: preset.style,
      floors: preset.params.floors,
      wallHeight: preset.params.wallHeight || 3.2,
      wallThickness: 0.25,
      roofType: preset.params.roofType,
      exteriorMaterial: preset.params.exteriorMaterial,
      dimensions: preset.params.dimensions,
      features: preset.params.features || [],
      prompt: pText
    };

    setSceneConfig(config);
    addPromptToHistory({
      prompt: pText,
      changes: [`Generated preset: ${preset.name}`],
      affectedComponents: ['Full Preset Scene'],
      timestamp: new Date().toISOString()
    });

    if (editingPreset) setEditingPreset(null);
    setCurrentPage('workspace3d');
  };

  const handleOpenEdit = (preset) => {
    setEditingPreset(preset);
    setCustomPrompt(preset.prompt);
  };

  const handleCopyPrompt = (preset) => {
    navigator.clipboard.writeText(preset.prompt);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="preset-library-container fade-in">
      {/* Header & Search */}
      <div className="library-header-section">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass size={22} className="text-accent" />
            <h1 className="library-title">Architectural Prompt Presets</h1>
          </div>
          <p className="library-subtitle">
            Explore 60 complete architectural archetypes across 6 design categories.
          </p>
        </div>

        <div className="search-and-filters">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by architectural style, building type, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <button
            className={`btn btn-sm ${onlyFavorites ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setOnlyFavorites(!onlyFavorites)}
          >
            <Star size={14} fill={onlyFavorites ? '#14100c' : 'none'} />
            <span>Favorites ({favoritePresets.length})</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs-bar">
        <button
          className={`category-tab ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All Archetypes ({PRESETS.length})
        </button>
        {PRESET_CATEGORIES.map(cat => {
          const count = PRESETS.filter(p => p.category === cat).length;
          return (
            <button
              key={cat}
              className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Preset Cards Grid */}
      <div className="presets-grid-layout">
        {filteredPresets.map((preset) => {
          const isFav = favoritePresets.includes(preset.id);
          return (
            <div key={preset.id} className="preset-card-item">
              <div className="preset-card-header">
                <div className="flex items-center gap-2">
                  <span className="preset-cat-label">{preset.category}</span>
                </div>
                <button
                  className="fav-toggle-btn"
                  onClick={() => toggleFavoritePreset(preset.id)}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    size={16}
                    color={isFav ? '#d2a679' : '#6b7280'}
                    fill={isFav ? '#d2a679' : 'none'}
                  />
                </button>
              </div>

              <div className="preset-visual-header" style={{ borderColor: preset.accentColor || '#d2a679' }}>
                <Box size={28} color={preset.accentColor || '#d2a679'} />
                <span className="preset-style-badge">{preset.style}</span>
              </div>

              <div className="preset-body">
                <h3 className="preset-card-name">{preset.name}</h3>
                <p className="preset-prompt-text">"{preset.prompt}"</p>

                <div className="preset-params-chips">
                  <span className="chip-tag">{preset.params.floors} Storey</span>
                  <span className="chip-tag">{preset.params.roofType.replace('_', ' ')}</span>
                  <span className="chip-tag">{preset.params.exteriorMaterial.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="preset-card-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopyPrompt(preset)}
                  title="Copy Prompt text"
                >
                  {copiedId === preset.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenEdit(preset)}
                  title="Customize prompt before generating"
                >
                  <Edit3 size={14} />
                  <span>Customize</span>
                </button>
                <button
                  className="btn btn-primary btn-sm flex-1"
                  onClick={() => handleGenerateDirect(preset)}
                >
                  <Sparkles size={14} />
                  <span>Generate 3D</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPresets.length === 0 && (
        <div className="empty-presets-state">
          <Compass size={40} className="text-muted mb-2" />
          <h3 className="text-lg font-semibold">No Presets Found</h3>
          <p className="text-sm text-muted">Try adjusting your search query or clear category filters.</p>
          <button className="btn btn-secondary btn-sm mt-3" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setOnlyFavorites(false); }}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Customize Prompt Modal */}
      {editingPreset && (
        <div className="preset-modal-backdrop" onClick={() => setEditingPreset(null)}>
          <div className="preset-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <Edit3 size={18} className="text-accent" />
                <h3 className="modal-title">Customize: {editingPreset.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setEditingPreset(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <label className="label">Full Architectural Prompt</label>
              <textarea
                className="textarea"
                rows={5}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />

              <div className="preset-meta-preview mt-4">
                <span className="text-xs text-muted">Style: <strong>{editingPreset.style}</strong></span>
                <span className="text-xs text-muted">Type: <strong>{editingPreset.buildingType}</strong></span>
                <span className="text-xs text-muted">Floors: <strong>{editingPreset.params.floors}</strong></span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditingPreset(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleGenerateDirect(editingPreset, customPrompt)}
              >
                <Sparkles size={16} />
                <span>Generate Customized 3D Model</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
