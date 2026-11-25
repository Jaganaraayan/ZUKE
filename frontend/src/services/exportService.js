import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

export function exportSceneAsGLB(scene, filename = 'zuke_model') {
  return new Promise((resolve, reject) => {
    if (!scene) {
      reject(new Error('No Three.js scene available for export'));
      return;
    }

    const exporter = new GLTFExporter();
    const options = {
      binary: true,
      onlyVisible: true,
      truncateDrawRange: true
    };

    try {
      exporter.parse(
        scene,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: 'model/gltf-binary' });
            downloadBlob(blob, `${sanitizeFilename(filename)}.glb`);
            resolve(true);
          } else {
            const output = JSON.stringify(result, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            downloadBlob(blob, `${sanitizeFilename(filename)}.gltf`);
            resolve(true);
          }
        },
        (error) => {
          console.error('An error happened during GLTF export:', error);
          reject(error);
        },
        options
      );
    } catch (err) {
      console.error('GLTF Export failed:', err);
      reject(err);
    }
  });
}

export function exportSceneAsOBJ(scene, filename = 'zuke_model') {
  return new Promise((resolve, reject) => {
    if (!scene) {
      reject(new Error('No Three.js scene available for export'));
      return;
    }
    try {
      const exporter = new OBJExporter();
      const result = exporter.parse(scene);
      const blob = new Blob([result], { type: 'text/plain' });
      downloadBlob(blob, `${sanitizeFilename(filename)}.obj`);
      resolve(true);
    } catch (err) {
      console.error('OBJ Export failed:', err);
      reject(err);
    }
  });
}

export function exportCanvasAsPNG(canvas, filename = 'zuke_drawing') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `${sanitizeFilename(filename)}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name) {
  return (name || 'zuke_export').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
}
