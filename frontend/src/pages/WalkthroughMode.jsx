import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import useAppStore from '../store/useAppStore';
import { generateArchitecturalScene } from '../three/proceduralGenerator';
import { getDefaultSceneConfig } from '../services/promptParser';
import {
  Maximize2,
  Footprints,
  ChevronLeft
} from 'lucide-react';
import '../styles/walkthrough.css';

export default function WalkthroughMode() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const speedRef = useRef('walk');
  const sceneConfig = useAppStore((s) => s.sceneConfig);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  // Modal visibility: true on load, false once user clicks to enter
  const [showModal, setShowModal] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [speed, setSpeed] = useState('walk');

  // Trigger walkthrough entry: immediately dismiss modal, remove blur & backdrop, request pointer lock
  const handleEnterWalkthrough = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setShowModal(false);
    const canvas = rendererRef.current?.domElement;
    if (canvas) {
      try {
        const req = canvas.requestPointerLock?.();
        if (req && req.catch) req.catch(() => {});
      } catch (err) {
        console.warn('Pointer lock request error:', err);
      }
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14100c);
    scene.fog = new THREE.FogExp2(0x14100c, 0.015);

    // 2. Camera (FPS Eye Level: 1.65m above ground)
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 300);
    camera.rotation.order = 'YXZ'; // Essential for FPS pitch/yaw separation
    camera.position.set(0, 1.65, 14);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff5e6, 1.4);
    sun.position.set(30, 45, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    scene.add(sun);

    // 5. Generate Architectural Building
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    const cfg = sceneConfig || getDefaultSceneConfig();
    generateArchitecturalScene(cfg, modelGroup);

    // 6. First-Person Controls & Input State
    const keys = { w: false, a: false, s: false, d: false, Shift: false };
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.setFromQuaternion(camera.quaternion);

    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onMouseDown = (e) => {
      if (e.button === 0) {
        isMouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.w = true;
      if (k === 's' || k === 'arrowdown') keys.s = true;
      if (k === 'a' || k === 'arrowleft') keys.a = true;
      if (k === 'd' || k === 'arrowright') keys.d = true;
      if (e.key === 'Shift') keys.Shift = true;
    };

    const onKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.w = false;
      if (k === 's' || k === 'arrowdown') keys.s = false;
      if (k === 'a' || k === 'arrowleft') keys.a = false;
      if (k === 'd' || k === 'arrowright') keys.d = false;
      if (e.key === 'Shift') keys.Shift = false;
    };

    const onMouseMove = (e) => {
      let movementX = 0;
      let movementY = 0;

      if (document.pointerLockElement === renderer.domElement) {
        movementX = e.movementX || 0;
        movementY = e.movementY || 0;
      } else if (isMouseDown) {
        movementX = e.clientX - lastMouseX;
        movementY = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        return;
      }

      euler.y -= movementX * 0.0024;
      euler.x -= movementY * 0.0024;
      // Clamp vertical look (pitch) to ±85 degrees
      euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, euler.x));
      camera.quaternion.setFromEuler(euler);
    };

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === renderer.domElement;
      setIsLocked(locked);
      if (locked) {
        setShowModal(false);
      }
    };

    const dom = renderer.domElement;
    const onDomClick = () => {
      // Re-engage pointer lock when user clicks directly on canvas
      try {
        const req = dom.requestPointerLock?.();
        if (req && req.catch) req.catch(() => {});
      } catch (err) {}
    };

    dom.addEventListener('click', onDomClick);
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    // 7. Animation Loop with FPS Movement Vector
    let animId;
    const moveDir = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const moveSpeed = keys.Shift ? 0.22 : 0.09;
      const targetSpeed = keys.Shift ? 'sprint' : 'walk';
      if (speedRef.current !== targetSpeed) {
        speedRef.current = targetSpeed;
        setSpeed(targetSpeed);
      }

      moveDir.set(0, 0, 0);

      // Forward / Backward
      if (keys.w) moveDir.z -= 1;
      if (keys.s) moveDir.z += 1;

      // Strafe Left / Right
      if (keys.a) moveDir.x -= 1;
      if (keys.d) moveDir.x += 1;

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();

        // Project forward and right vectors onto horizontal plane using euler.y
        const forward = new THREE.Vector3(-Math.sin(euler.y), 0, -Math.cos(euler.y));
        const right = new THREE.Vector3(Math.cos(euler.y), 0, -Math.sin(euler.y));

        if (keys.w || keys.s) {
          camera.position.addScaledVector(forward, -moveDir.z * moveSpeed);
        }
        if (keys.a || keys.d) {
          camera.position.addScaledVector(right, moveDir.x * moveSpeed);
        }
      }

      // Keep eye level at realistic human height (1.65m)
      camera.position.y = 1.65;

      // Clamp movement within site perimeter (±40m)
      camera.position.x = Math.max(-40, Math.min(40, camera.position.x));
      camera.position.z = Math.max(-40, Math.min(40, camera.position.z));

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('click', onDomClick);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      window.removeEventListener('resize', handleResize);
      if (document.pointerLockElement === dom) {
        document.exitPointerLock();
      }
      if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [sceneConfig]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="walkthrough-viewport-wrapper">
      {/* 3D Viewport Mount */}
      <div 
        className="walkthrough-mount" 
        ref={mountRef}
        onClick={() => {
          if (!showModal && rendererRef.current?.domElement) {
            try {
              rendererRef.current.domElement.requestPointerLock?.();
            } catch (err) {}
          }
        }}
      />

      {/* Top HUD Bar */}
      <div className="walkthrough-top-bar">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setCurrentPage('workspace3d')}
        >
          <ChevronLeft size={16} />
          <span>Exit Walkthrough</span>
        </button>

        <div className="walkthrough-status-badge">
          <Footprints size={15} />
          <span>Architectural First-Person Walkthrough</span>
          <span className="speed-badge">{speed.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm" onClick={toggleFullscreen} title="Toggle Fullscreen">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* 
        Entry Modal Popup with Backdrop & Blur.
        Proper conditional rendering: when showModal is false, the popup, blur, 
        and dark overlay are completely removed from the DOM.
      */}
      {showModal && (
        <div 
          className="click-to-engage-overlay"
          onClick={handleEnterWalkthrough}
        >
          <div 
            className="engage-card"
            onClick={(e) => {
              e.stopPropagation();
              handleEnterWalkthrough(e);
            }}
          >
            <Footprints size={32} className="engage-icon" />
            <h3>Click to Enter Walkthrough</h3>
            <p>Engage mouse-look & first-person navigation inside the architectural model</p>
            <div className="controls-summary-grid">
              <span className="key-tag">W / A / S / D</span>
              <span className="key-desc">Walk & Strafe</span>
              <span className="key-tag">Mouse</span>
              <span className="key-desc">Look Around</span>
              <span className="key-tag">Shift</span>
              <span className="key-desc">Sprint Fast</span>
              <span className="key-tag">ESC</span>
              <span className="key-desc">Release Cursor</span>
            </div>
            <button 
              type="button"
              className="engage-btn"
              onClick={handleEnterWalkthrough}
            >
              <Footprints size={16} />
              <span>Enter Walkthrough</span>
            </button>
          </div>
        </div>
      )}

      {/* In-game Crosshair when modal is dismissed */}
      {!showModal && <div className="fps-crosshair">+</div>}

      {/* Bottom Controls HUD */}
      <div className="walkthrough-bottom-hud">
        <div className="hud-key-help">
          <span className="hud-key">W A S D</span> Walk
          <span className="hud-divider">|</span>
          <span className="hud-key">Shift</span> Sprint
          <span className="hud-divider">|</span>
          <span className="hud-key">Mouse</span> Look
          <span className="hud-divider">|</span>
          <span className="hud-key">ESC</span> Release Mouse
        </div>
      </div>
    </div>
  );
}
