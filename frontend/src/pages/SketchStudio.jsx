import React, { useEffect, useRef, useState } from 'react';
import useAppStore from '../store/useAppStore';
import { exportCanvasAsPNG } from '../services/exportService';
import { convert2DSketchTo3D } from '../three/proceduralGenerator';
import {
  PenTool,
  Slash,
  Square,
  DoorOpen,
  Maximize,
  Eraser,
  MousePointer,
  RotateCcw,
  RotateCw,
  Trash2,
  Grid,
  ZoomIn,
  ZoomOut,
  Hand,
  Download,
  Box,
  Save,
  Check,
  Ruler
} from 'lucide-react';
import '../styles/sketch.css';

export default function SketchStudio() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const setSketchData = useAppStore((s) => s.setSketchData);
  const setSceneConfig = useAppStore((s) => s.setSceneConfig);

  // Tools: 'select', 'freehand', 'line', 'wall', 'rect', 'door', 'window', 'eraser', 'pan'
  const [activeTool, setActiveTool] = useState('wall');
  const [drawingMode, setDrawingMode] = useState('floorplan'); // 'freehand', 'floorplan', 'outline', 'room'
  const [wallThickness, setWallThickness] = useState(12); // pixels (0.24m in real scale)
  const [lineThickness, setLineThickness] = useState(3);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(25); // 25px = 0.5m
  const [zoom, setZoom] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Elements on canvas
  const [elements, setElements] = useState([
    // Initial sample room perimeter
    { id: 'w1', type: 'wall', x1: 200, y1: 150, x2: 600, y2: 150, thickness: 12, length: '8.0m' },
    { id: 'w2', type: 'wall', x1: 600, y1: 150, x2: 600, y2: 450, thickness: 12, length: '6.0m' },
    { id: 'w3', type: 'wall', x1: 600, y1: 450, x2: 200, y2: 450, thickness: 12, length: '8.0m' },
    { id: 'w4', type: 'wall', x1: 200, y1: 450, x2: 200, y2: 150, thickness: 12, length: '6.0m' },
    { id: 'd1', type: 'door', x: 400, y: 450, width: 40, height: 14, label: 'Door (0.8m)' },
    { id: 'win1', type: 'window', x: 300, y: 150, width: 60, height: 12, label: 'Window (1.2m)' },
    { id: 'win2', type: 'window', x: 500, y: 150, width: 60, height: 12, label: 'Window (1.2m)' }
  ]);

  // History for Undo / Redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Snap coordinates
  const snap = (val) => {
    if (!snapToGrid) return val;
    return Math.round(val / gridSize) * gridSize;
  };

  // Convert canvas pointer to world coords (taking pan & zoom into account)
  const getWorldCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const x = (clientX - rect.left - panOffset.x) / zoom;
    const y = (clientY - rect.top - panOffset.y) / zoom;
    return { x, y };
  };

  // Redraw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // 1. Draw Architectural Grid
    drawGrid(ctx, width / zoom + Math.abs(panOffset.x), height / zoom + Math.abs(panOffset.y));

    // 2. Draw Elements
    elements.forEach(el => drawElement(ctx, el, el.id === selectedId));

    // 3. Draw Active Drawing Element
    if (currentElement) {
      drawElement(ctx, currentElement, false, true);
    }

    ctx.restore();
  }, [elements, currentElement, selectedId, zoom, panOffset, gridSize, snapToGrid]);

  // Grid Renderer
  const drawGrid = (ctx, maxW, maxH) => {
    ctx.save();
    ctx.strokeStyle = '#1a2330';
    ctx.lineWidth = 1;

    const startX = Math.floor(-panOffset.x / zoom / gridSize) * gridSize;
    const startY = Math.floor(-panOffset.y / zoom / gridSize) * gridSize;
    const endX = startX + (canvasRef.current.width / zoom) + gridSize * 2;
    const endY = startY + (canvasRef.current.height / zoom) + gridSize * 2;

    ctx.beginPath();
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // Major grid lines every 5 units (meters)
    ctx.strokeStyle = '#283647';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = startX; x <= endX; x += gridSize * 4) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize * 4) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();
    ctx.restore();
  };

  // Render individual element
  const drawElement = (ctx, el, isSelected = false, isPreview = false) => {
    ctx.save();
    if (isSelected) {
      ctx.shadowColor = '#d2a679';
      ctx.shadowBlur = 8;
    }

    switch (el.type) {
      case 'freehand':
        if (!el.points || el.points.length < 2) return;
        ctx.strokeStyle = isSelected ? '#d2a679' : (isPreview ? '#e2b378' : '#f3f4f6');
        ctx.lineWidth = el.thickness || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
          ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
        break;

      case 'line':
        ctx.strokeStyle = isSelected ? '#d2a679' : '#e5e7eb';
        ctx.lineWidth = el.thickness || 3;
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
        drawDimensionLabel(ctx, el.x1, el.y1, el.x2, el.y2);
        break;

      case 'wall':
        // Double-line architectural wall with solid core or hatch
        const dx = el.x2 - el.x1;
        const dy = el.y2 - el.y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;

        ctx.strokeStyle = isSelected ? '#d2a679' : '#ffffff';
        ctx.fillStyle = isSelected ? 'rgba(198, 155, 101, 0.4)' : '#334155';
        ctx.lineWidth = 2;

        const perpX = (-dy / len) * (el.thickness / 2);
        const perpY = (dx / len) * (el.thickness / 2);

        ctx.beginPath();
        ctx.moveTo(el.x1 + perpX, el.y1 + perpY);
        ctx.lineTo(el.x2 + perpX, el.y2 + perpY);
        ctx.lineTo(el.x2 - perpX, el.y2 - perpY);
        ctx.lineTo(el.x1 - perpX, el.y1 - perpY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        drawDimensionLabel(ctx, el.x1, el.y1, el.x2, el.y2);
        break;

      case 'rect':
        ctx.strokeStyle = isSelected ? '#d2a679' : '#38bdf8';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 2;
        ctx.strokeRect(el.x, el.y, el.w, el.h);
        ctx.fillRect(el.x, el.y, el.w, el.h);

        // Room dimensions
        const rW = (Math.abs(el.w) / 50).toFixed(1);
        const rH = (Math.abs(el.h) / 50).toFixed(1);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Room: ${rW}m × ${rH}m`, el.x + el.w / 2, el.y + el.h / 2);
        break;

      case 'door':
        // Architectural swing door symbol
        ctx.fillStyle = '#d2a679';
        ctx.strokeStyle = '#d2a679';
        ctx.lineWidth = 2;
        ctx.fillRect(el.x - el.width / 2, el.y - el.height / 2, el.width, el.height);

        // Swing arc
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.arc(el.x - el.width / 2, el.y, el.width, 0, Math.PI / 2);
        ctx.stroke();
        ctx.setLineDash([]);
        break;

      case 'window':
        // Architectural window symbol: double line with glass fill
        ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;
        ctx.fillRect(el.x - el.width / 2, el.y - el.height / 2, el.width, el.height);
        ctx.strokeRect(el.x - el.width / 2, el.y - el.height / 2, el.width, el.height);
        break;
    }
    ctx.restore();
  };

  // Dimension label helper
  const drawDimensionLabel = (ctx, x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    // 50 pixels = 1.0 meter
    const meters = (distPx / 50).toFixed(1);

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    ctx.save();
    ctx.fillStyle = '#d2a679';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${meters}m`, midX, midY - 14);
    ctx.restore();
  };

  // Canvas Mouse Down
  const handleMouseDown = (e) => {
    if (activeTool === 'pan' || e.button === 1 || e.spaceKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    const { x, y } = getWorldCoords(e);
    const sx = snap(x);
    const sy = snap(y);

    if (activeTool === 'select') {
      // Find element under cursor
      const clicked = elements.findLast(el => isPointNearElement(x, y, el));
      setSelectedId(clicked ? clicked.id : null);
      return;
    }

    if (activeTool === 'eraser') {
      const clicked = elements.findLast(el => isPointNearElement(x, y, el));
      if (clicked) {
        pushHistory();
        setElements(prev => prev.filter(e => e.id !== clicked.id));
      }
      return;
    }

    // New drawing element
    setIsDrawing(true);
    pushHistory();

    const id = `el_${Date.now()}`;
    if (activeTool === 'freehand') {
      setCurrentElement({ id, type: 'freehand', points: [{ x, y }], thickness: lineThickness });
    } else if (activeTool === 'wall') {
      setCurrentElement({ id, type: 'wall', x1: sx, y1: sy, x2: sx, y2: sy, thickness: wallThickness });
    } else if (activeTool === 'line') {
      setCurrentElement({ id, type: 'line', x1: sx, y1: sy, x2: sx, y2: sy, thickness: lineThickness });
    } else if (activeTool === 'rect') {
      setCurrentElement({ id, type: 'rect', x: sx, y: sy, w: 0, h: 0 });
    } else if (activeTool === 'door') {
      setElements(prev => [...prev, { id, type: 'door', x: sx, y: sy, width: 40, height: 14 }]);
      setIsDrawing(false);
    } else if (activeTool === 'window') {
      setElements(prev => [...prev, { id, type: 'window', x: sx, y: sy, width: 60, height: 12 }]);
      setIsDrawing(false);
    }
  };

  // Canvas Mouse Move
  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (!isDrawing || !currentElement) return;

    const { x, y } = getWorldCoords(e);
    const sx = snap(x);
    const sy = snap(y);

    if (currentElement.type === 'freehand') {
      setCurrentElement(prev => ({
        ...prev,
        points: [...prev.points, { x, y }]
      }));
    } else if (currentElement.type === 'wall' || currentElement.type === 'line') {
      setCurrentElement(prev => ({
        ...prev,
        x2: sx,
        y2: sy
      }));
    } else if (currentElement.type === 'rect') {
      setCurrentElement(prev => ({
        ...prev,
        w: sx - prev.x,
        h: sy - prev.y
      }));
    }
  };

  // Canvas Mouse Up
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDrawing && currentElement) {
      setElements(prev => [...prev, currentElement]);
      setCurrentElement(null);
      setIsDrawing(false);
      setRedoStack([]);
    }
  };

  // Check point proximity for selection
  const isPointNearElement = (px, py, el) => {
    if (el.type === 'rect') {
      return px >= el.x && px <= el.x + el.w && py >= el.y && py <= el.y + el.h;
    }
    if (el.type === 'door' || el.type === 'window') {
      return Math.abs(px - el.x) < el.width / 2 + 10 && Math.abs(py - el.y) < el.height / 2 + 10;
    }
    if (el.type === 'wall' || el.type === 'line') {
      // Distance from point to line segment
      const dx = el.x2 - el.x1;
      const dy = el.y2 - el.y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return Math.hypot(px - el.x1, py - el.y1) < 15;
      let t = ((px - el.x1) * dx + (py - el.y1) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
      const projX = el.x1 + t * dx;
      const projY = el.y1 + t * dy;
      return Math.hypot(px - projX, py - projY) < (el.thickness || 15);
    }
    return false;
  };

  // History Undo / Redo
  const pushHistory = () => {
    setHistory(prev => [...prev, elements]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack(prev => [...prev, elements]);
    setElements(last);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, elements]);
    setElements(next);
    setRedoStack(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (window.confirm('Clear current drawing canvas?')) {
      pushHistory();
      setElements([]);
      setSelectedId(null);
    }
  };

  // Export 2D Canvas as PNG
  const handleExportPNG = () => {
    if (canvasRef.current) {
      exportCanvasAsPNG(canvasRef.current, 'zuke_floor_plan');
    }
  };

  // Convert 2D Sketch to 3D Geometry
  const handleConvertTo3D = () => {
    // Scale coords to meters (50px = 1m) and center them
    const convertedElements = elements.map(el => {
      if (el.type === 'wall' || el.type === 'line') {
        return {
          ...el,
          x1: (el.x1 - 400) / 50,
          y1: (el.y1 - 300) / 50,
          x2: (el.x2 - 400) / 50,
          y2: (el.y2 - 300) / 50,
        };
      }
      if (el.type === 'rect') {
        return {
          ...el,
          x: (el.x - 400) / 50,
          y: (el.y - 300) / 50,
          w: el.w / 50,
          h: el.h / 50,
        };
      }
      return el;
    });

    const sketchPayload = {
      elements: convertedElements,
      wallHeight: 3.2,
      wallThickness: 0.25,
    };

    setSketchData(sketchPayload);

    // Build scene config representing the sketched structure
    const generatedConfig = {
      buildingType: 'Residential',
      style: 'Modern Custom Traced',
      floors: 1,
      wallHeight: 3.2,
      wallThickness: 0.25,
      roofType: 'flat',
      exteriorMaterial: 'white_concrete',
      dimensions: { width: 16, length: 14, height: 3.5 },
      features: ['landscaped_garden'],
      sketchGeometry: sketchPayload
    };

    setSceneConfig(generatedConfig);
    setCurrentPage('workspace3d');
  };

  // Resize canvas to fill container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="sketch-studio-root">
      {/* Top Toolbar */}
      <div className="sketch-toolbar">
        <div className="tool-section">
          <span className="tool-section-label">Drawing Tools</span>
          <div className="tool-buttons">
            <button
              className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
              onClick={() => setActiveTool('select')}
              title="Select / Move"
            >
              <MousePointer size={16} />
              <span>Select</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'wall' ? 'active' : ''}`}
              onClick={() => setActiveTool('wall')}
              title="Architectural Wall (Thick)"
            >
              <Square size={16} />
              <span>Wall</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'line' ? 'active' : ''}`}
              onClick={() => setActiveTool('line')}
              title="Straight Line / Partition"
            >
              <Slash size={16} />
              <span>Line</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'rect' ? 'active' : ''}`}
              onClick={() => setActiveTool('rect')}
              title="Room Rectangle"
            >
              <Maximize size={16} />
              <span>Room</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'freehand' ? 'active' : ''}`}
              onClick={() => setActiveTool('freehand')}
              title="Freehand Sketch"
            >
              <PenTool size={16} />
              <span>Sketch</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'door' ? 'active' : ''}`}
              onClick={() => setActiveTool('door')}
              title="Place Door"
            >
              <DoorOpen size={16} />
              <span>Door</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'window' ? 'active' : ''}`}
              onClick={() => setActiveTool('window')}
              title="Place Window"
            >
              <Box size={16} />
              <span>Window</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'eraser' ? 'active' : ''}`}
              onClick={() => setActiveTool('eraser')}
              title="Eraser"
            >
              <Eraser size={16} />
              <span>Eraser</span>
            </button>
            <button
              className={`tool-btn ${activeTool === 'pan' ? 'active' : ''}`}
              onClick={() => setActiveTool('pan')}
              title="Pan Canvas"
            >
              <Hand size={16} />
              <span>Pan</span>
            </button>
          </div>
        </div>

        <div className="sketch-divider"></div>

        {/* Thickness & Snapping */}
        <div className="tool-section">
          <span className="tool-section-label">Wall & Grid</span>
          <div className="flex items-center gap-2">
            <label className="sketch-input-label">
              Wall Thk:
              <select value={wallThickness} onChange={(e) => setWallThickness(Number(e.target.value))}>
                <option value={8}>0.15m (Thin)</option>
                <option value={12}>0.25m (Standard)</option>
                <option value={18}>0.35m (Exterior)</option>
              </select>
            </label>

            <button
              className={`btn btn-sm ${snapToGrid ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSnapToGrid(!snapToGrid)}
              title="Toggle Grid Snapping"
            >
              <Grid size={14} />
              <span>Snap {snapToGrid ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        <div className="sketch-divider"></div>

        {/* Actions: Undo / Redo / Clear / Export */}
        <div className="tool-section">
          <span className="tool-section-label">Actions</span>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-icon" onClick={handleUndo} disabled={history.length === 0} title="Undo">
              <RotateCcw size={16} />
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleRedo} disabled={redoStack.length === 0} title="Redo">
              <RotateCw size={16} />
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleClear} title="Clear Canvas">
              <Trash2 size={16} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleExportPNG} title="Export drawing as PNG">
              <Download size={14} />
              <span>Export PNG</span>
            </button>
          </div>
        </div>

        <div className="sketch-spacer"></div>

        {/* Big Action: Convert 2D to 3D */}
        <button className="btn btn-primary btn-lg" onClick={handleConvertTo3D}>
          <Box size={18} />
          <span>CONVERT 2D TO 3D</span>
        </button>
      </div>

      {/* Main Drawing Surface */}
      <div className="sketch-canvas-wrapper" ref={containerRef}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        />

        {/* Zoom Controls Overlay */}
        <div className="sketch-zoom-dock">
          <button className="zoom-btn" onClick={() => setZoom(z => Math.min(2.5, z + 0.15))} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <span className="zoom-indicator">{Math.round(zoom * 100)}%</span>
          <button className="zoom-btn" onClick={() => setZoom(z => Math.max(0.4, z - 0.15))} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button className="zoom-btn" onClick={() => { setZoom(1.0); setPanOffset({ x: 0, y: 0 }); }} title="Reset View">
            1:1
          </button>
        </div>

        {/* Drawing Status Bar */}
        <div className="sketch-status-bar">
          <div className="status-item">
            <Ruler size={13} />
            <span>Scale: 50px = 1.0 Meter</span>
          </div>
          <div className="status-item">
            <span>Elements: {elements.length}</span>
          </div>
          <div className="status-item">
            <span>Mode: {activeTool.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
