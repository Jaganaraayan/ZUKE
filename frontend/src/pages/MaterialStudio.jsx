import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { createArchitecturalMaterial } from '../three/proceduralGenerator';
import {
  Palette,
  Sliders,
  Check,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
  Eye
} from 'lucide-react';
import '../styles/material.css';

const MATERIAL_PRESETS = [
  { id: 'concrete', name: 'Smooth Concrete', color: '#efede8', roughness: 0.85, metalness: 0.05, opacity: 1.0, category: 'Mineral' },
  { id: 'wood', name: 'Teak / Oak Wood', color: '#a36f40', roughness: 0.65, metalness: 0.05, opacity: 1.0, category: 'Organic' },
  { id: 'glass', name: 'Architectural Glazing', color: '#d0e8ff', roughness: 0.05, metalness: 0.1, opacity: 0.45, category: 'Transparent' },
  { id: 'brick', name: 'Terracotta Brick', color: '#9c4f3e', roughness: 0.9, metalness: 0.0, opacity: 1.0, category: 'Mineral' },
  { id: 'marble', name: 'Polished Carrara Marble', color: '#f5f5f7', roughness: 0.2, metalness: 0.15, opacity: 1.0, category: 'Stone' },
  { id: 'granite', name: 'Dark Charcoal Granite', color: '#333842', roughness: 0.4, metalness: 0.2, opacity: 1.0, category: 'Stone' },
  { id: 'stone', name: 'Stacked Limestone', color: '#b8b4a8', roughness: 0.85, metalness: 0.1, opacity: 1.0, category: 'Stone' },
  { id: 'metal', name: 'Black Matte Steel', color: '#22262c', roughness: 0.35, metalness: 0.8, opacity: 1.0, category: 'Metal' },
  { id: 'brass', name: 'Brushed Bronze / Brass', color: '#d2a679', roughness: 0.3, metalness: 0.85, opacity: 1.0, category: 'Metal' },
  { id: 'ceramic', name: 'Glazed Pool Ceramic', color: '#0284c7', roughness: 0.3, metalness: 0.1, opacity: 1.0, category: 'Mineral' },
  { id: 'grass', name: 'Landscape Lawn', color: '#2d5a27', roughness: 0.95, metalness: 0.0, opacity: 1.0, category: 'Organic' }
];

export default function MaterialStudio() {
  const selectedObject = useAppStore((s) => s.selectedObject);
  const setSelectedObject = useAppStore((s) => s.setSelectedObject);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  const [activeMaterial, setActiveMaterial] = useState(MATERIAL_PRESETS[0]);
  const [customColor, setCustomColor] = useState(MATERIAL_PRESETS[0].color);
  const [roughness, setRoughness] = useState(MATERIAL_PRESETS[0].roughness);
  const [metalness, setMetalness] = useState(MATERIAL_PRESETS[0].metalness);
  const [opacity, setOpacity] = useState(MATERIAL_PRESETS[0].opacity);
  const [appliedHistory, setAppliedHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const handleSelectPreset = (preset) => {
    setActiveMaterial(preset);
    setCustomColor(preset.color);
    setRoughness(preset.roughness);
    setMetalness(preset.metalness);
    setOpacity(preset.opacity);
  };

  const applyToSelectedMesh = () => {
    const scene = window.__zuke_three_scene;
    if (!scene) {
      setFeedback({ type: 'warn', msg: 'No active 3D viewport found. Open 3D Workspace first.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    if (!selectedObject) {
      setFeedback({ type: 'warn', msg: 'Please select an architectural element in the 3D Workspace first.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Find in live scene
    let targetMesh = null;
    scene.traverse((child) => {
      if (child.uuid === selectedObject.uuid) {
        targetMesh = child;
      }
    });

    if (targetMesh && targetMesh.isMesh) {
      const newMat = createArchitecturalMaterial(activeMaterial.id, customColor);
      newMat.roughness = roughness;
      newMat.metalness = metalness;
      newMat.opacity = opacity;
      newMat.transparent = opacity < 1.0;
      targetMesh.material = newMat;

      setAppliedHistory(prev => [
        { name: activeMaterial.name, target: targetMesh.name || 'Component', time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ]);

      setFeedback({ type: 'success', msg: `Applied ${activeMaterial.name} to ${targetMesh.name}!` });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'warn', msg: 'Selected object could not be modified in live scene.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const applyToAllCategory = (catType) => {
    const scene = window.__zuke_three_scene;
    if (!scene) {
      setFeedback({ type: 'warn', msg: 'Open 3D Workspace first to initialize the 3D scene.' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    let count = 0;
    scene.traverse((child) => {
      if (child.isMesh && child.userData?.type === catType) {
        const newMat = createArchitecturalMaterial(activeMaterial.id, customColor);
        newMat.roughness = roughness;
        newMat.metalness = metalness;
        newMat.opacity = opacity;
        newMat.transparent = opacity < 1.0;
        child.material = newMat;
        count++;
      }
    });

    if (count > 0) {
      setFeedback({ type: 'success', msg: `Updated ${count} '${catType}' elements to ${activeMaterial.name}!` });
    } else {
      setFeedback({ type: 'warn', msg: `No '${catType}' elements found in current model.` });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="material-studio-page">
      <header className="material-header">
        <div className="flex items-center gap-3">
          <div className="mat-header-icon">
            <Palette size={22} />
          </div>
          <div>
            <h1>Material Customization Studio</h1>
            <p>Physically-Based Shading (PBR) & architectural finish management</p>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={() => setCurrentPage('workspace3d')}>
          <Eye size={15} />
          <span>Return to 3D Workspace</span>
        </button>
      </header>

      {feedback && (
        <div className={`mat-feedback-alert ${feedback.type}`}>
          <Info size={15} />
          <span>{feedback.msg}</span>
        </div>
      )}

      <div className="mat-main-layout">
        {/* Left Column: Preset Palette Grid */}
        <div className="mat-library-card">
          <div className="card-header-bar">
            <h2>Architectural Materials</h2>
            <span className="badge badge-accent">{MATERIAL_PRESETS.length} Finishes</span>
          </div>

          <div className="mat-presets-grid">
            {MATERIAL_PRESETS.map((m) => (
              <div
                key={m.id}
                className={`mat-card-item ${activeMaterial.id === m.id ? 'active' : ''}`}
                onClick={() => handleSelectPreset(m)}
              >
                <div
                  className="mat-swatch-circle"
                  style={{
                    backgroundColor: m.color,
                    boxShadow: activeMaterial.id === m.id ? `0 0 12px ${m.color}88` : 'none'
                  }}
                />
                <div className="mat-card-info">
                  <span className="mat-name">{m.name}</span>
                  <span className="mat-cat">{m.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: PBR Parameter Editor */}
        <div className="mat-editor-card">
          <div className="card-header-bar">
            <h2>PBR Material Properties</h2>
            <span className="active-tag">{activeMaterial.name}</span>
          </div>

          <div className="mat-controls-list">
            {/* Color preview row */}
            <div className="mat-preview-row">
              <div
                className="big-material-sphere"
                style={{
                  backgroundColor: customColor,
                  opacity: opacity,
                  boxShadow: `0 8px 24px ${customColor}44`
                }}
              />
              <div className="color-picker-wrap">
                <label className="prop-label">Base Color Override</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="hex-picker"
                  />
                  <span className="hex-text">{customColor}</span>
                </div>
              </div>
            </div>

            {/* Roughness Slider */}
            <div className="mat-slider-group">
              <div className="slider-label-row">
                <span>Surface Roughness</span>
                <span>{Math.round(roughness * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={roughness}
                onChange={(e) => setRoughness(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="slider-hint">
                <span>0% Mirror Gloss</span>
                <span>100% Matte Diffuse</span>
              </div>
            </div>

            {/* Metalness Slider */}
            <div className="mat-slider-group">
              <div className="slider-label-row">
                <span>Metalness (Dielectric vs Conductor)</span>
                <span>{Math.round(metalness * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={metalness}
                onChange={(e) => setMetalness(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="slider-hint">
                <span>0% Non-Metal (Concrete/Wood)</span>
                <span>100% Metallic (Steel/Brass)</span>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="mat-slider-group">
              <div className="slider-label-row">
                <span>Opacity & Transparency</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="mat-actions-section">
              <button className="btn btn-primary btn-lg w-full" onClick={applyToSelectedMesh}>
                <Check size={16} />
                <span>Apply to Selected Object</span>
              </button>

              <div className="batch-apply-grid">
                <button className="btn btn-secondary btn-sm" onClick={() => applyToAllCategory('Wall')}>
                  Apply to All Walls
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => applyToAllCategory('Roof')}>
                  Apply to Roof
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => applyToAllCategory('Floor')}>
                  Apply to Slabs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
