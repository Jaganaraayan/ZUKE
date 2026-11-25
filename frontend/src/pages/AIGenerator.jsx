import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import useAppStore from '../store/useAppStore';
import { generateArchitecturalScene } from '../three/proceduralGenerator';
import { parsePromptToScene, getDefaultSceneConfig } from '../services/promptParser';
import { PRESETS } from '../presets/presetData';
import { exportSceneAsGLB } from '../services/exportService';
import { saveVersion } from '../services/versionHistory';
import {
  Sparkles,
  Wand2,
  Box,
  Compass,
  Maximize2,
  Download,
  RefreshCw,
  Info,
  Lightbulb,
  PlusCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import '../styles/generator.css';

const QUICK_ADDITIONS = [
  { label: '+ Swimming Pool', text: 'with an outdoor swimming pool and stone deck' },
  { label: '+ Balcony', text: 'with a spacious first-floor cantilevered balcony' },
  { label: '+ Garden', text: 'surrounded by a landscaped garden and stone pathway' },
  { label: '+ Flat Roof', text: 'with a modern flat cantilever roof' },
  { label: '+ Wood Panels', text: 'with warm architectural wood exterior panels' },
  { label: '+ Panoramic Glass', text: 'with floor-to-ceiling panoramic glass windows' },
  { label: '+ Carport', text: 'including an integrated covered carport parking area' },
  { label: '+ Columns', text: 'supported by grand structural architectural columns' },
  { label: '+ Minimalist Style', text: 'designed in a clean minimalist architectural style' }
];

export default function AIGenerator() {
  const previewMountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelGroupRef = useRef(null);

  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const sceneConfig = useAppStore((s) => s.sceneConfig);
  const setSceneConfig = useAppStore((s) => s.setSceneConfig);
  const addPromptToHistory = useAppStore((s) => s.addPromptToHistory);

  // User types or selects prompt first
  const [promptText, setPromptText] = useState(
    'Create a modern two-storey luxury villa with glass windows, a flat roof, wooden exterior panels, a swimming pool, landscaped garden and a spacious balcony.'
  );
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(Boolean(sceneConfig));
  const [lastGeneratedInfo, setLastGeneratedInfo] = useState(null);
  const [generationSuccessMsg, setGenerationSuccessMsg] = useState(null);

  // Initialize preview Three.js scene
  useEffect(() => {
    if (!previewMountRef.current) return;
    const container = previewMountRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14100c);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 500);
    camera.position.set(24, 18, 28);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(amb);
    const sun = new THREE.DirectionalLight(0xfff8e8, 1.3);
    sun.position.set(20, 35, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    scene.add(sun);

    const grid = new THREE.GridHelper(50, 50, 0xd2a679, 0x3c3026);
    grid.position.y = -0.04;
    scene.add(grid);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Only render model if one exists from earlier generation
    if (sceneConfig) {
      generateArchitecturalScene(sceneConfig, modelGroup);
      setHasGenerated(true);
    }

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!previewMountRef.current) return;
      const nw = previewMountRef.current.clientWidth;
      const nh = previewMountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (previewMountRef.current && renderer.domElement) {
        previewMountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update preview when modelGroup or sceneConfig updates
  useEffect(() => {
    if (modelGroupRef.current && sceneConfig && hasGenerated) {
      generateArchitecturalScene(sceneConfig, modelGroupRef.current);
    }
  }, [sceneConfig, hasGenerated]);

  // Select a preset prompt (populates the prompt text space)
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setPromptText(found.prompt);
    }
  };

  // Select a random preset (populates the prompt text space)
  const handleRandomPreset = () => {
    const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setSelectedPresetId(randomPreset.id);
    setPromptText(randomPreset.prompt);
  };

  // Append a modifier phrase to the prompt text space
  const handleAppendAddition = (additionText) => {
    setPromptText(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return `Create a building ${additionText}.`;
      if (trimmed.toLowerCase().includes(additionText.toLowerCase())) return trimmed;
      const clean = trimmed.endsWith('.') ? trimmed.slice(0, -1) : trimmed;
      return `${clean}, ${additionText}.`;
    });
  };

  // Explicitly generate when the user clicks the Generate button
  const handleGenerateClick = async (e) => {
    e?.preventDefault();
    const textToRun = promptText.trim();
    if (!textToRun || isGenerating) return;

    setIsGenerating(true);
    setGenerationSuccessMsg(null);

    setTimeout(async () => {
      // Parse prompt into structured 3D parameters
      const parsed = parsePromptToScene(textToRun, sceneConfig);
      const generatedCfg = parsed.sceneConfig;

      setSceneConfig(generatedCfg);
      setHasGenerated(true);

      if (modelGroupRef.current) {
        generateArchitecturalScene(generatedCfg, modelGroupRef.current);
      }

      addPromptToHistory({
        prompt: textToRun,
        changes: parsed.changes,
        affectedComponents: parsed.affectedComponents,
        timestamp: new Date().toISOString()
      });

      // Also persist to IndexedDB version history
      try {
        await saveVersion(generatedCfg, textToRun);
      } catch (err) {
        console.warn('Auto-save to versions:', err);
      }

      setLastGeneratedInfo({
        style: generatedCfg.style,
        floors: generatedCfg.floors,
        dimensions: `${generatedCfg.dimensions.width}m × ${generatedCfg.dimensions.length}m`,
        features: generatedCfg.features.length
      });

      setGenerationSuccessMsg(`3D Model Generated: ${parsed.changes.slice(0, 3).join(', ')}`);
      setIsGenerating(false);

      setTimeout(() => setGenerationSuccessMsg(null), 5000);
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerateClick();
    }
  };

  const handleOpenIn3D = () => {
    setCurrentPage('workspace3d');
  };

  const handleExportGLB = () => {
    if (sceneRef.current && hasGenerated) {
      exportSceneAsGLB(sceneRef.current, `zuke_model_${sceneConfig?.style || 'architecture'}`);
    } else {
      alert('Please generate a 3D model first before exporting.');
    }
  };

  return (
    <div className="generator-page-container fade-in">
      {/* Left Dedicated Prompt Space */}
      <div className="generator-prompt-space-panel">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <div className="generator-sparkle-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="panel-title">AI Text-to-3D Generator</h2>
              <p className="panel-subtitle">Select a preset or customize your prompt, then click Generate to synthesize the 3D model</p>
            </div>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="prompt-composer-card">
          {/* Preset Selector Dropdown */}
          <div className="preset-selector-row mb-2">
            <label className="prompt-box-label">
              <Compass size={13} className="text-accent" />
              <span>Select Preset Prompt:</span>
            </label>
            <div className="flex items-center gap-2">
              <select
                className="preset-select-dropdown"
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
              >
                <option value="">-- Choose from 60 Architectural Presets --</option>
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRandomPreset}
                title="Load a random architectural preset"
              >
                <RefreshCw size={13} />
                <span>Random</span>
              </button>
            </div>
          </div>

          {/* Typing Area */}
          <div className="flex items-center justify-between mb-1 mt-2">
            <span className="prompt-box-label">
              <Lightbulb size={13} className="text-accent" />
              <span>Type or Edit Your Architectural Prompt:</span>
            </span>
          </div>

          <textarea
            className="prompt-typing-textarea"
            rows={5}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your architectural concept here (e.g., 'Modern two-storey luxury villa with glass curtain walls, flat roof, wooden panels, swimming pool, and balcony')..."
          />

          {/* Quick Additions to Prompt (Click to Append into Textbox) */}
          <div className="prompt-modifiers-section">
            <span className="modifier-hint-text">Click to Add Architectural Elements to Your Prompt:</span>
            <div className="modifier-chips-container">
              {QUICK_ADDITIONS.map((mod, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="mod-chip-btn"
                  onClick={() => handleAppendAddition(mod.text)}
                  title={`Add "${mod.label}" to your prompt text`}
                >
                  <PlusCircle size={11} className="mr-1" />
                  <span>{mod.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Big Prominent Generate Button */}
          <button
            className="btn btn-primary btn-lg w-full mt-4 generate-cta-btn"
            onClick={handleGenerateClick}
            disabled={isGenerating || !promptText.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                <span>Synthesizing 3D Architectural Model...</span>
              </>
            ) : (
              <>
                <Wand2 size={18} className="mr-2" />
                <span>Generate 3D Architectural Model</span>
              </>
            )}
          </button>

          {generationSuccessMsg && (
            <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-2">
              <CheckCircle2 size={14} className="flex-shrink-0" />
              <span>{generationSuccessMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Real-Time 3D Preview Panel */}
      <div className="generator-preview-panel">
        <div className="preview-top-bar">
          <div>
            <h3 className="preview-title">Real-Time Procedural 3D Viewport</h3>
            <p className="preview-sub">Interactive Three.js engine • Orbit, Rotate, Zoom, Pan</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportGLB}
              disabled={!hasGenerated}
              title="Download GLB"
            >
              <Download size={14} />
              <span>Export GLB</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleOpenIn3D}
              disabled={!hasGenerated}
            >
              <Maximize2 size={14} />
              <span>Full 3D Workspace</span>
            </button>
          </div>
        </div>

        <div className="preview-canvas-container" ref={previewMountRef}>
          {/* Placeholder before first generation */}
          {!hasGenerated && !isGenerating && (
            <div className="ready-placeholder-overlay">
              <div className="placeholder-icon-circle">
                <Wand2 size={32} />
              </div>
              <h4>Ready to Generate 3D Model</h4>
              <p>
                Type your design description or select a preset on the left, then click{' '}
                <strong>"Generate 3D Architectural Model"</strong>.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="generating-overlay">
              <div className="spinner spinner-lg"></div>
              <p>Constructing 3D Architectural Geometry...</p>
            </div>
          )}
        </div>

        {/* Bottom Status / Summary */}
        <div className="preview-bottom-bar">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-accent" />
            <span className="text-xs text-secondary">
              {hasGenerated 
                ? 'Model generated: Orbit with left click, Pan with right click, Zoom with scroll.' 
                : 'Select or write your prompt, then click Generate.'}
            </span>
          </div>
          {lastGeneratedInfo && (
            <span className="badge badge-accent">
              {lastGeneratedInfo.style} • {lastGeneratedInfo.floors} Storeys • {lastGeneratedInfo.dimensions}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
