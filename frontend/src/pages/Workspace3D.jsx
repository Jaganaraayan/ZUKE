import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import useAppStore from '../store/useAppStore';
import {
  generateArchitecturalScene,
  createArchitecturalMaterial
} from '../three/proceduralGenerator';
import { parsePromptToScene, getDefaultSceneConfig } from '../services/promptParser';
import { exportSceneAsGLB, exportSceneAsOBJ } from '../services/exportService';
import { saveVersion } from '../services/versionHistory';
import {
  RotateCcw, Eye, EyeOff, Layers, Sliders, Sun, Grid3x3,
  Download, Sparkles, Maximize2, Box, Compass, Undo2, Redo2,
  Check, CheckCircle2, Trash2, Copy, Save, Footprints, Wand2,
  ChevronDown, ChevronRight, Move, RotateCw, Scaling, Palette,
  PlusCircle, MinusCircle, Loader2, AlertCircle, X, History,
  RefreshCw, CornerDownRight, Clock
} from 'lucide-react';
import '../styles/workspace3d.css';

/* ─── Quick Architectural Modifier shortcuts ─── */
const MODIFICATION_CHIPS = [
  { label: 'Swimming Pool', instruction: 'Add a swimming pool in front of the building', isAdd: true },
  { label: 'Balcony', instruction: 'Add a cantilever balcony on the second floor', isAdd: true },
  { label: 'Flat Roof', instruction: 'Change the roof to a modern flat roof', isAdd: true },
  { label: '3 Floors', instruction: 'Increase the building height to 3 floors', isAdd: true },
  { label: 'Remove Balcony', instruction: 'Remove balcony from the building', isAdd: false },
  { label: 'Modern Facade', instruction: 'Change facade to modern design', isAdd: true },
  { label: 'Wooden Panels', instruction: 'Add wooden panels to the exterior walls', isAdd: true },
  { label: 'Panoramic Glass', instruction: 'Add panoramic glass windows', isAdd: true },
  { label: 'Garden', instruction: 'Create a garden around the building', isAdd: true },
  { label: 'Columns', instruction: 'Add columns to the entrance', isAdd: true },
];

/* ─── Material presets for inspector ─── */
const MATERIAL_PRESETS = [
  'white_concrete', 'glass', 'wood_panel', 'metal', 'stone', 'brick',
  'tile_porcelain', 'plaster_cream', 'wood_walnut', 'brass'
];

export default function Workspace3D() {
  /* ─── DOM & Three.js Refs ─── */
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelGroupRef = useRef(null);
  const selectionBoxRef = useRef(null);

  /* ─── Global Store ─── */
  const sceneConfig = useAppStore((s) => s.sceneConfig);
  const setSceneConfig = useAppStore((s) => s.setSceneConfig);
  const selectedObject = useAppStore((s) => s.selectedObject);
  const setSelectedObject = useAppStore((s) => s.setSelectedObject);
  const promptHistory = useAppStore((s) => s.promptHistory);
  const addPromptToHistory = useAppStore((s) => s.addPromptToHistory);

  /* ─── Viewport State ─── */
  const [activeView, setActiveView] = useState('iso');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);

  /* ─── Undo / Redo History Stack ─── */
  const [historyStack, setHistoryStack] = useState(() => [sceneConfig || getDefaultSceneConfig()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  /* ─── AI Natural Language Editor (Left Panel) ─── */
  const [editPrompt, setEditPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [modificationFeedback, setModificationFeedback] = useState(null);

  /* ─── Right Panel: Hierarchy & Inspector ─── */
  const [hierarchyTree, setHierarchyTree] = useState([]);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [objProps, setObjProps] = useState(null);
  const [inspectorFeedback, setInspectorFeedback] = useState(null);
  const [rightPanelTab, setRightPanelTab] = useState('hierarchy'); // 'hierarchy' | 'inspector'

  /* ─── Bottom Area: Status & History drawer ─── */
  const [bottomOpen, setBottomOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Workspace Ready • 3D Scene Loaded');

  /* ═══════════════════════════════════════════
     THREE.JS SCENE INITIALIZATION
     ═══════════════════════════════════════════ */
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = Math.max(container.clientWidth || 0, 400);
    const height = Math.max(container.clientHeight || 0, 400);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14100c);
    scene.fog = new THREE.Fog(0x14100c, 80, 260);
    sceneRef.current = scene;
    window.__zuke_three_scene = scene;

    const currentCfg = sceneConfig || getDefaultSceneConfig();
    if (!sceneConfig) setSceneConfig(currentCfg);

    const isInterior = Boolean(
      currentCfg?.roomType && currentCfg.roomType !== 'exterior_villa' &&
      (currentCfg.roomType.includes('bedroom') || currentCfg.roomType.includes('living') || currentCfg.roomType.includes('kitchen'))
    );

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    if (isInterior) {
      camera.position.set(2.8, 2.2, 5.2);
    } else {
      camera.position.set(24, 16, 26);
    }
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 1;
    controls.maxDistance = 200;
    if (isInterior) {
      controls.target.set(0, 1.4, -0.6);
    } else {
      controls.target.set(0, 3, 0);
    }
    controls.update();
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    ambientLight.name = 'Ambient_Light';
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0x1a2230, 0.7);
    hemiLight.position.set(0, 50, 0);
    hemiLight.name = 'Hemi_Light';
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff8eb, 1.5);
    dirLight.position.set(28, 42, 22);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 160;
    dirLight.shadow.camera.left = -35;
    dirLight.shadow.camera.right = 35;
    dirLight.shadow.camera.top = 35;
    dirLight.shadow.camera.bottom = -35;
    dirLight.shadow.bias = -0.0005;
    dirLight.name = 'Sun_Light';
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x90b5e0, 0.5);
    fillLight.position.set(-25, 20, -25);
    fillLight.name = 'Fill_Light';
    scene.add(fillLight);

    // Helpers
    const gridHelper = new THREE.GridHelper(60, 60, 0xd2a679, 0x3c3026);
    gridHelper.position.y = -0.04;
    gridHelper.name = 'Grid_Helper';
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.set(0, 0.01, 0);
    axesHelper.name = 'Axes_Helper';
    scene.add(axesHelper);

    // Selection Bounding Box
    const boxHelper = new THREE.BoxHelper(new THREE.Mesh(), 0xd2a679);
    boxHelper.visible = false;
    scene.add(boxHelper);
    selectionBoxRef.current = boxHelper;

    // Architectural Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Build initial architectural scene
    generateArchitecturalScene(currentCfg, modelGroup);
    updateHierarchyList(modelGroup);

    // Animation loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      if (boxHelper.visible && selectedObject) {
        boxHelper.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // Raycasting for click-to-select in 3D scene
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(modelGroup.children, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        if (target.name === 'Ground_Terrain') return;
        setSelectedObject(target);
        boxHelper.setFromObject(target);
        boxHelper.visible = true;
        syncPropsFromObject(target);
        setRightPanelTab('inspector');
      } else {
        boxHelper.visible = false;
        setSelectedObject(null);
        setObjProps(null);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  /* ─── Regenerate Scene when sceneConfig changes ─── */
  useEffect(() => {
    if (modelGroupRef.current && sceneConfig) {
      generateArchitecturalScene(sceneConfig, modelGroupRef.current);
      updateHierarchyList(modelGroupRef.current);
      if (selectionBoxRef.current) selectionBoxRef.current.visible = false;
      setSelectedObject(null);
      setObjProps(null);
    }
  }, [sceneConfig]);

  /* ═══════════════════════════════════════════
     PROPS & HIERARCHY HELPERS
     ═══════════════════════════════════════════ */
  const syncPropsFromObject = useCallback((obj) => {
    if (!obj) return;
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size);

    setObjProps({
      name: obj.name || 'Architectural Element',
      type: obj.userData?.type || 'Mesh',
      posX: parseFloat(obj.position.x.toFixed(2)),
      posY: parseFloat(obj.position.y.toFixed(2)),
      posZ: parseFloat(obj.position.z.toFixed(2)),
      rotX: parseFloat(((obj.rotation.x * 180) / Math.PI).toFixed(1)),
      rotY: parseFloat(((obj.rotation.y * 180) / Math.PI).toFixed(1)),
      rotZ: parseFloat(((obj.rotation.z * 180) / Math.PI).toFixed(1)),
      scaleX: parseFloat(obj.scale.x.toFixed(2)),
      scaleY: parseFloat(obj.scale.y.toFixed(2)),
      scaleZ: parseFloat(obj.scale.z.toFixed(2)),
      sizeW: size.x.toFixed(2),
      sizeH: size.y.toFixed(2),
      sizeD: size.z.toFixed(2),
      material: obj.material?.type || 'Standard',
      color: obj.material?.color ? `#${obj.material.color.getHexString()}` : '#ffffff',
      roughness: obj.material?.roughness ?? 0.5,
      metalness: obj.material?.metalness ?? 0,
      opacity: obj.material ? obj.material.opacity : 1.0,
    });
  }, []);

  const updateHierarchyList = useCallback((group) => {
    const list = [];
    const traverse = (node, depth = 0) => {
      if (node.children && node.children.length > 0) {
        list.push({ id: node.uuid, name: node.name || 'Group', type: 'group', depth, object: node, childCount: node.children.length });
        if (!collapsedGroups.has(node.uuid)) {
          node.children.forEach(c => traverse(c, depth + 1));
        }
      } else if (node.isMesh) {
        list.push({ id: node.uuid, name: node.name || 'Component', type: 'mesh', depth, object: node });
      }
    };
    traverse(group);
    setHierarchyTree(list);
  }, [collapsedGroups]);

  /* ═══════════════════════════════════════════
     CAMERA & VIEW MODES
     ═══════════════════════════════════════════ */
  const setView = (view) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    setActiveView(view);

    const isInterior = Boolean(
      sceneConfig?.roomType && sceneConfig.roomType !== 'exterior_villa' &&
      (sceneConfig.roomType.includes('bedroom') || sceneConfig.roomType.includes('living') || sceneConfig.roomType.includes('kitchen'))
    );

    const views = isInterior ? {
      top:    { pos: [0, 8.5, -0.6],       target: [0, 0, -0.6] },
      front:  { pos: [0, 1.8, 5.6],        target: [0, 1.4, -0.6] },
      rear:   { pos: [0, 1.8, -6.0],       target: [0, 1.4, -0.6] },
      right:  { pos: [5.8, 1.8, -0.6],     target: [0, 1.4, -0.6] },
      left:   { pos: [-5.8, 1.8, -0.6],    target: [0, 1.4, -0.6] },
      iso:    { pos: [2.8, 2.2, 5.2],      target: [0, 1.4, -0.6] },
    } : {
      top:    { pos: [0, 48, 0.001],       target: [0, 0, 0] },
      front:  { pos: [0, 8, 38],           target: [0, 4, 0] },
      rear:   { pos: [0, 8, -38],          target: [0, 4, 0] },
      right:  { pos: [38, 8, 0],           target: [0, 4, 0] },
      left:   { pos: [-38, 8, 0],          target: [0, 4, 0] },
      iso:    { pos: [24, 16, 26],         target: [0, 3, 0] },
    };

    const v = views[view] || views.iso;
    cam.position.set(...v.pos);
    ctrl.target.set(...v.target);
    ctrl.update();
  };

  const toggleGrid = () => {
    if (!sceneRef.current) return;
    const grid = sceneRef.current.getObjectByName('Grid_Helper');
    if (grid) { grid.visible = !showGrid; setShowGrid(!showGrid); }
  };

  const toggleAxes = () => {
    if (!sceneRef.current) return;
    const axes = sceneRef.current.getObjectByName('Axes_Helper');
    if (axes) { axes.visible = !showAxes; setShowAxes(!showAxes); }
  };

  const toggleWireframe = () => {
    if (!modelGroupRef.current) return;
    const next = !wireframeMode;
    setWireframeMode(next);
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) child.material.wireframe = next;
    });
  };

  /* ═══════════════════════════════════════════
     AI NATURAL LANGUAGE MODIFICATION ENGINE
     ═══════════════════════════════════════════ */
  const applyInstruction = (instructionText) => {
    const prompt = instructionText.trim();
    if (!prompt || isModifying) return;

    setIsModifying(true);
    setModificationFeedback(null);
    setStatusMessage(`AI Processing: "${prompt}"...`);

    setTimeout(() => {
      try {
        const result = parsePromptToScene(prompt, sceneConfig);
        const newConfig = result.sceneConfig;

        // Push to undo stack
        const newHistory = historyStack.slice(0, historyIndex + 1);
        newHistory.push(newConfig);
        setHistoryStack(newHistory);
        setHistoryIndex(newHistory.length - 1);

        // Update active scene
        setSceneConfig(newConfig);

        // Record in persistent history
        addPromptToHistory({
          prompt,
          changes: result.changes,
          affectedComponents: result.affectedComponents,
          timestamp: new Date().toISOString()
        });

        const statusText = `Applied: ${result.changes.join(' • ')}`;
        setModificationFeedback({
          type: 'success',
          text: statusText,
          changes: result.changes
        });
        setStatusMessage(statusText);
        setEditPrompt('');
      } catch (err) {
        setModificationFeedback({
          type: 'error',
          text: 'Failed to apply modification. Please refine your instruction.'
        });
        setStatusMessage('Error executing modification instruction');
      }
      setIsModifying(false);
      setTimeout(() => setModificationFeedback(null), 5000);
    }, 250);
  };

  const handleApplyModification = () => {
    applyInstruction(editPrompt);
  };

  const handleShortcutClick = (chip) => {
    applyInstruction(chip.instruction);
  };

  /* ═══════════════════════════════════════════
     UNDO / REDO / RESET
     ═══════════════════════════════════════════ */
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      const prevCfg = historyStack[nextIdx];
      setSceneConfig(prevCfg);
      setStatusMessage(`Undo applied (${nextIdx + 1} of ${historyStack.length})`);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const nextCfg = historyStack[nextIdx];
      setSceneConfig(nextCfg);
      setStatusMessage(`Redo applied (${nextIdx + 1} of ${historyStack.length})`);
    }
  };

  const handleResetScene = () => {
    const defaultCfg = getDefaultSceneConfig();
    setSceneConfig(defaultCfg);
    setHistoryStack([defaultCfg]);
    setHistoryIndex(0);
    setStatusMessage('Scene reset to default architectural configuration');
  };

  /* ═══════════════════════════════════════════
     RIGHT PANEL: OBJECT INSPECTOR ACTIONS
     ═══════════════════════════════════════════ */
  const handlePropChange = (field, val) => {
    if (!selectedObject) return;
    setObjProps(prev => ({ ...prev, [field]: val }));

    const num = parseFloat(val) || 0;
    switch (field) {
      case 'posX': selectedObject.position.x = num; break;
      case 'posY': selectedObject.position.y = num; break;
      case 'posZ': selectedObject.position.z = num; break;
      case 'rotX': selectedObject.rotation.x = (num * Math.PI) / 180; break;
      case 'rotY': selectedObject.rotation.y = (num * Math.PI) / 180; break;
      case 'rotZ': selectedObject.rotation.z = (num * Math.PI) / 180; break;
      case 'scaleX': selectedObject.scale.x = num || 1; break;
      case 'scaleY': selectedObject.scale.y = num || 1; break;
      case 'scaleZ': selectedObject.scale.z = num || 1; break;
      case 'color':
        if (selectedObject.material?.color) selectedObject.material.color.set(val);
        break;
      case 'roughness':
        if (selectedObject.material) { selectedObject.material.roughness = num; selectedObject.material.needsUpdate = true; }
        break;
      case 'metalness':
        if (selectedObject.material) { selectedObject.material.metalness = num; selectedObject.material.needsUpdate = true; }
        break;
      case 'opacity':
        if (selectedObject.material) { selectedObject.material.transparent = true; selectedObject.material.opacity = num; selectedObject.material.needsUpdate = true; }
        break;
      default: break;
    }
    if (selectionBoxRef.current) selectionBoxRef.current.update();
  };

  const handleMaterialChange = (matType) => {
    if (!selectedObject || !selectedObject.isMesh) return;
    const newMat = createArchitecturalMaterial(matType);
    selectedObject.material = newMat;
    syncPropsFromObject(selectedObject);
  };

  const handleApplyInspector = () => {
    if (!selectedObject) return;
    if (selectionBoxRef.current) selectionBoxRef.current.update();
    updateHierarchyList(modelGroupRef.current);
    setInspectorFeedback({ type: 'success', text: 'Properties applied to 3D object' });
    setTimeout(() => setInspectorFeedback(null), 2500);
  };

  const handleResetInspector = () => {
    if (!selectedObject) return;
    syncPropsFromObject(selectedObject);
    setInspectorFeedback({ type: 'info', text: 'Reset to scene values' });
    setTimeout(() => setInspectorFeedback(null), 2000);
  };

  const toggleGroupCollapse = (uuid) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(uuid)) next.delete(uuid); else next.add(uuid);
      return next;
    });
  };

  useEffect(() => {
    if (modelGroupRef.current) updateHierarchyList(modelGroupRef.current);
  }, [collapsedGroups, updateHierarchyList]);

  /* ─── Exports ─── */
  const handleExportGLB = () => {
    if (sceneRef.current) exportSceneAsGLB(sceneRef.current, sceneConfig?.style ? `${sceneConfig.style}_model` : 'zuke_model');
  };

  const handleExportOBJ = () => {
    if (modelGroupRef.current) exportSceneAsOBJ(modelGroupRef.current, 'zuke_geometry');
  };

  /* ═══════════════════════════════════════════
     RENDER 5-ZONE ARCHITECTURAL WORKSPACE
     ═══════════════════════════════════════════ */
  return (
    <div className="ws3d-root">
      {/* ─── 1. TOP TOOLBAR ─── */}
      <header className="ws3d-top-toolbar">
        {/* Left: View projection shortcuts */}
        <div className="ws3d-tb-section">
          <div className="ws3d-brand-pill">
            <Sparkles size={14} className="ws3d-brand-icon" />
            <span>ZUKE ArchViz 3D</span>
          </div>

          <div className="ws3d-tb-sep" />

          {['iso', 'top', 'front', 'rear', 'left', 'right'].map(v => (
            <button
              key={v}
              className={`ws3d-tb-btn ${activeView === v ? 'active' : ''}`}
              onClick={() => setView(v)}
              title={`${v.toUpperCase()} View`}
            >
              {v === 'iso' ? 'Perspective' : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Center: Undo, Redo, Reset, Helpers */}
        <div className="ws3d-tb-section">
          <button
            className="ws3d-tb-icon-btn"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            className="ws3d-tb-icon-btn"
            onClick={handleRedo}
            disabled={historyIndex >= historyStack.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
          <button
            className="ws3d-tb-icon-btn"
            onClick={handleResetScene}
            title="Reset Scene to Default"
          >
            <RefreshCw size={15} />
          </button>

          <div className="ws3d-tb-sep" />

          <button
            className={`ws3d-tb-icon-btn ${showGrid ? 'active' : ''}`}
            onClick={toggleGrid}
            title="Toggle Ground Grid"
          >
            <Grid3x3 size={15} />
          </button>
          <button
            className={`ws3d-tb-icon-btn ${showAxes ? 'active' : ''}`}
            onClick={toggleAxes}
            title="Toggle Coordinate Axes"
          >
            <Compass size={15} />
          </button>
          <button
            className={`ws3d-tb-icon-btn ${wireframeMode ? 'active' : ''}`}
            onClick={toggleWireframe}
            title="Toggle Wireframe Shading"
          >
            <Box size={15} />
          </button>
        </div>

        {/* Right: Save, Mode, Export */}
        <div className="ws3d-tb-section">
          <button
            className="ws3d-tb-icon-btn"
            onClick={async () => {
              const lastPrompt = promptHistory.length > 0 ? promptHistory[promptHistory.length - 1].prompt : 'Snapshot';
              await saveVersion(sceneConfig, lastPrompt);
              setStatusMessage('Architectural version saved successfully');
              alert('Version saved to project history!');
            }}
            title="Save Version"
          >
            <Save size={15} />
          </button>

          <button
            className="ws3d-tb-btn"
            onClick={() => useAppStore.getState().setCurrentPage('walkthrough')}
            title="Enter Walkthrough Mode"
          >
            <Footprints size={14} /> Walkthrough
          </button>

          <button className="ws3d-tb-btn export-btn" onClick={handleExportGLB} title="Export GLB">
            <Download size={13} /> GLB
          </button>
          <button className="ws3d-tb-btn export-btn" onClick={handleExportOBJ} title="Export OBJ">
            <Download size={13} /> OBJ
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN WORKSPACE BODY (Left Panel + Center Viewport + Right Panel) ─── */}
      <div className="ws3d-main-layout">
        {/* ─── LEFT PANEL: AI NATURAL LANGUAGE EDITOR ─── */}
        <aside className="ws3d-panel ws3d-panel-left">
          <div className="ws3d-panel-header">
            <div className="ws3d-panel-title">
              <Wand2 size={16} className="ws3d-gold-text" />
              <span>AI Natural Language Editor</span>
            </div>
            <span className="ws3d-pill-badge">Active Engine</span>
          </div>

          <div className="ws3d-panel-content">
            {/* Prompt Input Box */}
            <div className="ws3d-prompt-box">
              <label className="ws3d-input-label">Describe Scene Modification</label>
              <textarea
                className="ws3d-prompt-textarea"
                rows={4}
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe how you want to modify your 3D scene (e.g. Add a swimming pool, Increase building height, Add cantilever balcony, Change facade to modern design)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleApplyModification();
                  }
                }}
              />
              <div className="ws3d-prompt-hint">Tip: Press Ctrl+Enter to apply prompt</div>
            </div>

            {/* Apply Prompt Modification Button */}
            <button
              className="ws3d-apply-prompt-btn"
              onClick={handleApplyModification}
              disabled={isModifying || !editPrompt.trim()}
            >
              {isModifying ? (
                <>
                  <Loader2 size={16} className="ws3d-spin" />
                  <span>Processing Architectural NLP...</span>
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  <span>Apply Prompt Modification</span>
                </>
              )}
            </button>

            {/* Modification Feedback Alert */}
            {modificationFeedback && (
              <div className={`ws3d-feedback-banner ${modificationFeedback.type}`}>
                {modificationFeedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                <div className="ws3d-feedback-body">
                  <div className="ws3d-feedback-text">{modificationFeedback.text}</div>
                  {modificationFeedback.changes && (
                    <div className="ws3d-feedback-tags">
                      {modificationFeedback.changes.map((c, i) => (
                        <span key={i} className="ws3d-change-chip">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Architectural Modifiers */}
            <div className="ws3d-modifiers-section">
              <div className="ws3d-section-heading">Quick Architectural Modifiers</div>
              <p className="ws3d-section-sub">Click a modifier to immediately apply structural and environmental changes:</p>
              <div className="ws3d-modifiers-grid">
                {MODIFICATION_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    className={`ws3d-modifier-chip ${chip.isAdd ? 'chip-add' : 'chip-remove'}`}
                    onClick={() => handleShortcutClick(chip)}
                    disabled={isModifying}
                    title={chip.instruction}
                  >
                    {chip.isAdd ? <PlusCircle size={12} /> : <MinusCircle size={12} />}
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Context Card */}
            <div className="ws3d-context-card">
              <div className="ws3d-context-header">Current Model Context</div>
              <div className="ws3d-context-grid">
                <div className="ws3d-ctx-row"><span>Building Type:</span><strong>{sceneConfig?.buildingType || 'Residential'}</strong></div>
                <div className="ws3d-ctx-row"><span>Style:</span><strong>{sceneConfig?.style || 'Modern'}</strong></div>
                <div className="ws3d-ctx-row"><span>Floors:</span><strong>{sceneConfig?.floors || 2} Floors</strong></div>
                <div className="ws3d-ctx-row"><span>Roof:</span><strong>{sceneConfig?.roofType || 'flat'}</strong></div>
                <div className="ws3d-ctx-row"><span>Material:</span><strong>{sceneConfig?.exteriorMaterial || 'concrete'}</strong></div>
                <div className="ws3d-ctx-row"><span>Features:</span><strong>{(sceneConfig?.features || []).length} active</strong></div>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── CENTER: 3D VIEWPORT ─── */}
        <main className="ws3d-viewport-center" ref={mountRef}>
          {/* Overlay Watermark/Engine Badge */}
          <div className="ws3d-engine-badge">
            <span className="ws3d-engine-name">ZUKE 3D ENGINE</span>
            <span className="ws3d-engine-spec">{sceneConfig?.style || 'Modern'} • {sceneConfig?.floors || 2}F • PBR Ready</span>
          </div>
        </main>

        {/* ─── RIGHT PANEL: SCENE PROPERTIES & MODIFICATION CONTROLS ─── */}
        <aside className="ws3d-panel ws3d-panel-right">
          <div className="ws3d-panel-tabs">
            <button
              className={`ws3d-ptab ${rightPanelTab === 'hierarchy' ? 'active' : ''}`}
              onClick={() => setRightPanelTab('hierarchy')}
            >
              <Layers size={14} />
              <span>Scene Graph ({hierarchyTree.length})</span>
            </button>
            <button
              className={`ws3d-ptab ${rightPanelTab === 'inspector' ? 'active' : ''}`}
              onClick={() => setRightPanelTab('inspector')}
            >
              <Sliders size={14} />
              <span>Inspector {selectedObject && '•'}</span>
            </button>
          </div>

          <div className="ws3d-panel-content">
            {/* TAB A: Scene Components Tree */}
            {rightPanelTab === 'hierarchy' && (
              <div className="ws3d-hierarchy-view">
                <div className="ws3d-hierarchy-header">
                  <span>Scene Components</span>
                  <span className="ws3d-badge">{hierarchyTree.length} Items</span>
                </div>
                <div className="ws3d-tree-container">
                  {hierarchyTree.length === 0 ? (
                    <div className="ws3d-empty-state">
                      <Box size={28} />
                      <p>Building scene components graph...</p>
                    </div>
                  ) : (
                    hierarchyTree.map((item) => (
                      <div
                        key={item.id}
                        className={`ws3d-tree-row ${selectedObject === item.object ? 'selected' : ''}`}
                        style={{ paddingLeft: `${item.depth * 14 + 10}px` }}
                        onClick={() => {
                          setSelectedObject(item.object);
                          if (selectionBoxRef.current) {
                            selectionBoxRef.current.setFromObject(item.object);
                            selectionBoxRef.current.visible = true;
                          }
                          syncPropsFromObject(item.object);
                          setRightPanelTab('inspector');
                        }}
                      >
                        {item.type === 'group' ? (
                          <button
                            className="ws3d-collapse-btn"
                            onClick={(e) => { e.stopPropagation(); toggleGroupCollapse(item.id); }}
                          >
                            {collapsedGroups.has(item.id) ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
                          </button>
                        ) : (
                          <div className="ws3d-mesh-bullet" />
                        )}
                        <span className="ws3d-tree-label" title={item.name}>{item.name}</span>
                        {item.childCount && <span className="ws3d-child-count">{item.childCount}</span>}

                        <div className="ws3d-tree-tools" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="ws3d-tool-btn"
                            title={item.object.visible ? 'Hide' : 'Show'}
                            onClick={() => {
                              item.object.visible = !item.object.visible;
                              updateHierarchyList(modelGroupRef.current);
                            }}
                          >
                            {item.object.visible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                          </button>
                          <button
                            className="ws3d-tool-btn"
                            title="Duplicate Object"
                            onClick={() => {
                              const clone = item.object.clone();
                              clone.position.x += 1.5;
                              clone.name = `${item.object.name || 'Component'}_Copy`;
                              (item.object.parent || modelGroupRef.current).add(clone);
                              updateHierarchyList(modelGroupRef.current);
                            }}
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            className="ws3d-tool-btn danger"
                            title="Delete Object"
                            onClick={() => {
                              if (item.object.parent) {
                                item.object.parent.remove(item.object);
                                if (selectedObject === item.object) {
                                  setSelectedObject(null);
                                  if (selectionBoxRef.current) selectionBoxRef.current.visible = false;
                                }
                                updateHierarchyList(modelGroupRef.current);
                              }
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB B: Object Inspector & Shading */}
            {rightPanelTab === 'inspector' && (
              <div className="ws3d-inspector-view">
                {!selectedObject || !objProps ? (
                  <div className="ws3d-empty-inspector">
                    <Box size={32} className="ws3d-empty-cube" />
                    <h4>No Object Selected</h4>
                    <p>Click any architectural component in the 3D viewport or scene graph to inspect and modify properties.</p>
                  </div>
                ) : (
                  <div className="ws3d-inspector-fields">
                    <div className="ws3d-insp-card">
                      <div className="ws3d-insp-title">{objProps.name}</div>
                      <div className="ws3d-insp-subtitle">{objProps.type}</div>
                    </div>

                    {/* Transform: Position */}
                    <div className="ws3d-insp-section">
                      <div className="ws3d-insp-sec-title"><Move size={12} /> Position (X, Y, Z)</div>
                      <div className="ws3d-axis-row">
                        {['X', 'Y', 'Z'].map(axis => (
                          <label key={axis} className="ws3d-axis-field">
                            <span className={`ws3d-axis-tag tag-${axis.toLowerCase()}`}>{axis}</span>
                            <input
                              type="number"
                              step="0.1"
                              value={objProps[`pos${axis}`]}
                              onChange={(e) => handlePropChange(`pos${axis}`, e.target.value)}
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Transform: Rotation */}
                    <div className="ws3d-insp-section">
                      <div className="ws3d-insp-sec-title"><RotateCw size={12} /> Rotation (Deg)</div>
                      <div className="ws3d-axis-row">
                        {['X', 'Y', 'Z'].map(axis => (
                          <label key={axis} className="ws3d-axis-field">
                            <span className={`ws3d-axis-tag tag-${axis.toLowerCase()}`}>{axis}</span>
                            <input
                              type="number"
                              step="1"
                              value={objProps[`rot${axis}`]}
                              onChange={(e) => handlePropChange(`rot${axis}`, e.target.value)}
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Transform: Scale */}
                    <div className="ws3d-insp-section">
                      <div className="ws3d-insp-sec-title"><Scaling size={12} /> Scale</div>
                      <div className="ws3d-axis-row">
                        {['X', 'Y', 'Z'].map(axis => (
                          <label key={axis} className="ws3d-axis-field">
                            <span className={`ws3d-axis-tag tag-${axis.toLowerCase()}`}>{axis}</span>
                            <input
                              type="number"
                              step="0.1"
                              value={objProps[`scale${axis}`]}
                              onChange={(e) => handlePropChange(`scale${axis}`, e.target.value)}
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="ws3d-insp-section">
                      <div className="ws3d-insp-sec-title"><Box size={12} /> Dimensions (m)</div>
                      <div className="ws3d-dims-row">
                        <span>W: {objProps.sizeW}m</span>
                        <span>H: {objProps.sizeH}m</span>
                        <span>D: {objProps.sizeD}m</span>
                      </div>
                    </div>

                    {/* Appearance & Material */}
                    <div className="ws3d-insp-section">
                      <div className="ws3d-insp-sec-title"><Palette size={12} /> Appearance & Shading</div>
                      <div className="ws3d-color-picker-row">
                        <span>Base Color:</span>
                        <input
                          type="color"
                          value={objProps.color}
                          onChange={(e) => handlePropChange('color', e.target.value)}
                        />
                      </div>
                      <div className="ws3d-slider-field">
                        <div className="ws3d-slider-top">
                          <span>Roughness</span>
                          <span>{objProps.roughness.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={objProps.roughness}
                          onChange={(e) => handlePropChange('roughness', e.target.value)}
                        />
                      </div>
                      <div className="ws3d-slider-field">
                        <div className="ws3d-slider-top">
                          <span>Metalness</span>
                          <span>{objProps.metalness.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={objProps.metalness}
                          onChange={(e) => handlePropChange('metalness', e.target.value)}
                        />
                      </div>
                      <div className="ws3d-slider-field">
                        <div className="ws3d-slider-top">
                          <span>Opacity</span>
                          <span>{objProps.opacity.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={objProps.opacity}
                          onChange={(e) => handlePropChange('opacity', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="ws3d-insp-section">
                      <div className="ws3d-insp-sec-title">Material Presets</div>
                      <div className="ws3d-preset-chips">
                        {MATERIAL_PRESETS.map((m) => (
                          <button
                            key={m}
                            className="ws3d-pchip"
                            onClick={() => handleMaterialChange(m)}
                          >
                            {m.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ws3d-insp-btn-row">
                      <button className="ws3d-insp-save-btn" onClick={handleApplyInspector}>
                        <Check size={14} /> Apply Changes
                      </button>
                      <button className="ws3d-insp-reset-btn" onClick={handleResetInspector}>
                        <RotateCcw size={14} /> Reset
                      </button>
                    </div>

                    {inspectorFeedback && (
                      <div className={`ws3d-mini-feedback ${inspectorFeedback.type}`}>
                        <CheckCircle2 size={13} /> {inspectorFeedback.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ─── 3. BOTTOM AREA: MODIFICATION HISTORY & OPERATION STATUS ─── */}
      <footer className="ws3d-bottom-bar">
        <div className="ws3d-status-indicator">
          <div className="ws3d-status-dot" />
          <span className="ws3d-status-text">{statusMessage}</span>
        </div>

        <div className="ws3d-bottom-actions">
          <span className="ws3d-history-count">
            Stack: {historyIndex + 1} / {historyStack.length}
          </span>
          <button
            className={`ws3d-history-toggle-btn ${bottomOpen ? 'active' : ''}`}
            onClick={() => setBottomOpen(!bottomOpen)}
          >
            <History size={14} />
            <span>Modification History ({promptHistory.length})</span>
            {bottomOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Drawer overlay for modification history */}
        {bottomOpen && (
          <div className="ws3d-history-drawer">
            <div className="ws3d-drawer-header">
              <div className="ws3d-drawer-title">
                <Clock size={15} />
                <span>Scene Modification Timeline</span>
              </div>
              <button className="ws3d-drawer-close" onClick={() => setBottomOpen(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="ws3d-drawer-list">
              {promptHistory.length === 0 ? (
                <div className="ws3d-drawer-empty">No prompt modifications recorded yet. Use the AI Natural Language Editor to modify your building.</div>
              ) : (
                promptHistory.slice().reverse().map((item, idx) => (
                  <div key={idx} className="ws3d-timeline-item">
                    <div className="ws3d-timeline-time">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="ws3d-timeline-content">
                      <div className="ws3d-timeline-prompt">"{item.prompt}"</div>
                      {item.changes && item.changes.length > 0 && (
                        <div className="ws3d-timeline-changes">
                          {item.changes.map((c, i) => (
                            <span key={i} className="ws3d-timeline-tag">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
