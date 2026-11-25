import * as THREE from 'three';

// ==========================================
// PROCEDURAL PBR TEXTURE & BUMP GENERATOR
// ==========================================

const textureCache = new Map();

/**
 * Generates procedural canvas textures for authentic architectural materials
 * (Zero remote network dependencies, instant rendering, high visual fidelity).
 */
export function getProceduralTexture(type, options = {}) {
  const cacheKey = `tex_${type}_${JSON.stringify(options)}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const size = options.size || 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  switch (type) {
    case 'wood_walnut': {
      // Dark walnut wood with rich natural grain rings and organic fibers
      ctx.fillStyle = '#3a2316';
      ctx.fillRect(0, 0, size, size);

      // Fine grain streaks
      for (let i = 0; i < size; i += 2) {
        const grainVal = Math.sin(i * 0.08) * Math.cos(i * 0.02);
        const alpha = 0.08 + Math.random() * 0.12;
        ctx.fillStyle = grainVal > 0 ? `rgba(74, 46, 29, ${alpha})` : `rgba(32, 18, 10, ${alpha})`;
        ctx.fillRect(i, 0, 2, size);
      }

      // Flowing natural wood rings / knots
      ctx.lineWidth = 3;
      for (let k = 0; k < 6; k++) {
        const cx = (k * 90) % size;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(28, 16, 9, 0.15)';
        for (let y = 0; y < size; y += 4) {
          const wobble = Math.sin(y * 0.02 + k) * 14 + Math.sin(y * 0.07) * 4;
          if (y === 0) ctx.moveTo(cx + wobble, y);
          else ctx.lineTo(cx + wobble, y);
        }
        ctx.stroke();
      }
      break;
    }

    case 'wood_oak': {
      // Golden honey / natural oak wood
      ctx.fillStyle = '#bfa175';
      ctx.fillRect(0, 0, size, size);

      for (let i = 0; i < size; i += 2) {
        const alpha = 0.06 + Math.random() * 0.1;
        ctx.fillStyle = i % 8 === 0 ? `rgba(148, 118, 80, ${alpha})` : `rgba(214, 186, 147, ${alpha})`;
        ctx.fillRect(i, 0, 2, size);
      }
      break;
    }

    case 'marble_calacatta': {
      // Polished Calacatta white marble with soft grey and warm amber veining
      ctx.fillStyle = '#f8f8fa';
      ctx.fillRect(0, 0, size, size);

      // Soft crystalline grain
      const imgData = ctx.getImageData(0, 0, size, size);
      for (let p = 0; p < imgData.data.length; p += 4) {
        const noise = (Math.random() - 0.5) * 6;
        imgData.data[p] = Math.min(255, imgData.data[p] + noise);
        imgData.data[p + 1] = Math.min(255, imgData.data[p + 1] + noise);
        imgData.data[p + 2] = Math.min(255, imgData.data[p + 2] + noise);
      }
      ctx.putImageData(imgData, 0, 0);

      // Organic branching veins
      const drawVein = (startX, startY, strokeColor, lineWidth) => {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        let x = startX;
        let y = startY;
        ctx.moveTo(x, y);
        while (y < size && x > 0 && x < size) {
          x += (Math.random() - 0.45) * 16;
          y += Math.random() * 12 + 4;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      for (let v = 0; v < 5; v++) {
        drawVein(Math.random() * size, 0, 'rgba(130, 138, 148, 0.18)', 4 + Math.random() * 5);
        drawVein(Math.random() * size, 0, 'rgba(180, 150, 105, 0.12)', 2 + Math.random() * 3);
      }
      break;
    }

    case 'tile_porcelain': {
      // Large format architectural porcelain tiles with subtle bevel and grout grid
      ctx.fillStyle = '#e2ded6';
      ctx.fillRect(0, 0, size, size);

      const tileSize = size / 4;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#6f6a62'; // Grout color

      for (let x = 0; x <= size; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
      }
      for (let y = 0; y <= size; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }

      // Subtle tile surface gradient
      for (let tx = 0; tx < 4; tx++) {
        for (let ty = 0; ty < 4; ty++) {
          const grad = ctx.createLinearGradient(tx * tileSize, ty * tileSize, (tx + 1) * tileSize, (ty + 1) * tileSize);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0.04)');
          ctx.fillStyle = grad;
          ctx.fillRect(tx * tileSize + 2, ty * tileSize + 2, tileSize - 4, tileSize - 4);
        }
      }
      break;
    }

    case 'plaster_cream': {
      // Cream-colored interior architectural plaster with subtle tactile stipple
      ctx.fillStyle = '#f4efe6';
      ctx.fillRect(0, 0, size, size);

      // Micro-texture stipple
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const alpha = 0.04 + Math.random() * 0.08;
        ctx.fillStyle = Math.random() > 0.5 ? `rgba(255, 255, 255, ${alpha})` : `rgba(180, 168, 150, ${alpha})`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      break;
    }

    case 'fabric_red': {
      // Rich deep red / burgundy woven fabric for bed cover & matching pillows
      ctx.fillStyle = '#8b1d24'; // Deep luxurious wine red
      ctx.fillRect(0, 0, size, size);

      // Cross-weave pattern (warp & weft)
      ctx.fillStyle = 'rgba(50, 8, 12, 0.18)';
      for (let x = 0; x < size; x += 4) {
        ctx.fillRect(x, 0, 2, size);
      }
      ctx.fillStyle = 'rgba(165, 42, 48, 0.22)';
      for (let y = 0; y < size; y += 4) {
        ctx.fillRect(0, y, size, 2);
      }
      break;
    }

    case 'fabric_cream': {
      // Crisp off-white / cream linen weave for sheets and pillows
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = 'rgba(215, 205, 190, 0.15)';
      for (let x = 0; x < size; x += 3) {
        ctx.fillRect(x, 0, 1.5, size);
      }
      for (let y = 0; y < size; y += 3) {
        ctx.fillRect(0, y, size, 1.5);
      }
      break;
    }

    case 'rug_oriental': {
      // Premium architectural woven area rug with ornate burgundy & navy border
      ctx.fillStyle = '#ded5c5'; // Warm ecru center
      ctx.fillRect(0, 0, size, size);

      // Outer border: deep burgundy
      ctx.fillStyle = '#7a1920';
      ctx.fillRect(0, 0, size, 40);
      ctx.fillRect(0, size - 40, size, 40);
      ctx.fillRect(0, 0, 40, size);
      ctx.fillRect(size - 40, 0, 40, size);

      // Inner accent band: navy
      ctx.strokeStyle = '#1b2a47';
      ctx.lineWidth = 12;
      ctx.strokeRect(50, 50, size - 100, size - 100);

      // Center geometric motif
      ctx.fillStyle = 'rgba(122, 25, 32, 0.12)';
      ctx.fillRect(80, 80, size - 160, size - 160);

      ctx.strokeStyle = '#d2a679'; // Gold motif line
      ctx.lineWidth = 4;
      ctx.strokeRect(100, 100, size - 200, size - 200);
      break;
    }

    default:
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;

  if (options.repeat) {
    texture.repeat.set(options.repeat[0], options.repeat[1]);
  }

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates procedural normal/bump maps for physical tactile lighting relief
 */
export function getProceduralBumpMap(type, options = {}) {
  const cacheKey = `bump_${type}_${JSON.stringify(options)}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const size = options.size || 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  if (type.includes('wood')) {
    for (let i = 0; i < size; i += 3) {
      const b = 120 + Math.floor(Math.random() * 40);
      ctx.fillStyle = `rgb(${b},${b},${b})`;
      ctx.fillRect(i, 0, 2, size);
    }
  } else if (type.includes('fabric')) {
    for (let x = 0; x < size; x += 2) {
      for (let y = 0; y < size; y += 2) {
        const val = ((x + y) % 4 === 0) ? 140 : 115;
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  } else {
    // Subtle plaster / stone grain
    for (let i = 0; i < 2000; i++) {
      const v = Math.random() > 0.5 ? 145 : 110;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
  }

  const bumpTex = new THREE.CanvasTexture(canvas);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.RepeatWrapping;

  if (options.repeat) {
    bumpTex.repeat.set(options.repeat[0], options.repeat[1]);
  }

  textureCache.set(cacheKey, bumpTex);
  return bumpTex;
}

// ==========================================
// PHYSICALLY BASED ARCHITECTURAL MATERIALS
// ==========================================

export function createArchitecturalMaterial(type, colorOverride = null, options = {}) {
  switch (type) {
    case 'wood_walnut':
    case 'walnut':
    case 'wood_panel':
    case 'wood': {
      const woodTex = getProceduralTexture('wood_walnut', { repeat: options.repeat || [2, 4] });
      const woodBump = getProceduralBumpMap('wood', { repeat: options.repeat || [2, 4] });
      return new THREE.MeshStandardMaterial({
        map: woodTex,
        bumpMap: woodBump,
        bumpScale: 0.015,
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xffffff),
        roughness: 0.45,
        metalness: 0.02,
      });
    }

    case 'wood_oak':
    case 'oak': {
      const oakTex = getProceduralTexture('wood_oak', { repeat: options.repeat || [3, 4] });
      const oakBump = getProceduralBumpMap('wood', { repeat: options.repeat || [3, 4] });
      return new THREE.MeshStandardMaterial({
        map: oakTex,
        bumpMap: oakBump,
        bumpScale: 0.015,
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xffffff),
        roughness: 0.48,
        metalness: 0.02,
      });
    }

    case 'marble':
    case 'marble_calacatta':
    case 'polished_marble': {
      const marbleTex = getProceduralTexture('marble_calacatta', { repeat: options.repeat || [1, 1] });
      return new THREE.MeshPhysicalMaterial({
        map: marbleTex,
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xffffff),
        roughness: 0.16,
        metalness: 0.04,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
      });
    }

    case 'plaster_cream':
    case 'cream_plaster':
    case 'white_concrete':
    case 'concrete': {
      const plasterTex = getProceduralTexture('plaster_cream', { repeat: options.repeat || [4, 4] });
      const plasterBump = getProceduralBumpMap('plaster', { repeat: options.repeat || [4, 4] });
      return new THREE.MeshStandardMaterial({
        map: plasterTex,
        bumpMap: plasterBump,
        bumpScale: 0.02,
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xffffff),
        roughness: 0.88,
        metalness: 0.01,
      });
    }

    case 'fabric_red':
    case 'bed_cover':
    case 'pillows_red': {
      const fabricTex = getProceduralTexture('fabric_red', { repeat: options.repeat || [4, 4] });
      const fabricBump = getProceduralBumpMap('fabric', { repeat: options.repeat || [4, 4] });
      return new THREE.MeshStandardMaterial({
        map: fabricTex,
        bumpMap: fabricBump,
        bumpScale: 0.018,
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xffffff),
        roughness: 0.86,
        metalness: 0.0,
      });
    }

    case 'fabric_cream':
    case 'bed_sheet':
    case 'pillows_cream': {
      const fabricTex = getProceduralTexture('fabric_cream', { repeat: options.repeat || [4, 4] });
      const fabricBump = getProceduralBumpMap('fabric', { repeat: options.repeat || [4, 4] });
      return new THREE.MeshStandardMaterial({
        map: fabricTex,
        bumpMap: fabricBump,
        bumpScale: 0.015,
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xffffff),
        roughness: 0.88,
        metalness: 0.0,
      });
    }

    case 'curtain_sheer':
    case 'curtain': {
      return new THREE.MeshStandardMaterial({
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xfcfbfa),
        roughness: 0.9,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
    }

    case 'carpet_rug':
    case 'rug': {
      const rugTex = getProceduralTexture('rug_oriental', { repeat: [1, 1] });
      const rugBump = getProceduralBumpMap('fabric', { repeat: [8, 8] });
      return new THREE.MeshStandardMaterial({
        map: rugTex,
        bumpMap: rugBump,
        bumpScale: 0.025,
        roughness: 0.92,
        metalness: 0.0,
      });
    }

    case 'tiles':
    case 'tile_porcelain':
    case 'ceramic': {
      const tileTex = getProceduralTexture('tile_porcelain', { repeat: options.repeat || [4, 4] });
      return new THREE.MeshStandardMaterial({
        map: tileTex,
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xffffff),
        roughness: 0.25,
        metalness: 0.05,
      });
    }

    case 'glass': {
      return new THREE.MeshPhysicalMaterial({
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xe2f0fd),
        metalness: 0.05,
        roughness: 0.03,
        transmission: 0.92,
        transparent: true,
        opacity: 0.35,
        reflectivity: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        ior: 1.52,
      });
    }

    case 'brass':
    case 'gold_metal': {
      return new THREE.MeshStandardMaterial({
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xd4af37),
        roughness: 0.28,
        metalness: 0.92,
      });
    }

    case 'metal':
    case 'black_metal': {
      return new THREE.MeshStandardMaterial({
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0x1a1e24),
        roughness: 0.38,
        metalness: 0.85,
      });
    }

    case 'water': {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x0ea5e9),
        transmission: 0.85,
        transparent: true,
        opacity: 0.8,
        roughness: 0.08,
        metalness: 0.1,
        ior: 1.333,
        clearcoat: 1.0
      });
    }

    case 'grass': {
      return new THREE.MeshStandardMaterial({
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0x284f23),
        roughness: 0.95,
        metalness: 0.0,
      });
    }

    default:
      return new THREE.MeshStandardMaterial({
        color: colorOverride ? new THREE.Color(colorOverride) : new THREE.Color(0xdcdcdc),
        roughness: 0.7,
        metalness: 0.1,
      });
  }
}

// ==========================================
// PHOTOREALISTIC 3D INTERIOR ASSET BUILDERS
// ==========================================

/**
 * Creates the complete Luxury King-Size Bed Assembly
 * Solid dark walnut bed frame, plush mattress, deep red bed runner, matching pillows, nightstands, lamps & rug.
 */
export function createKingSizeBedAssembly(options = {}) {
  const bedGroup = new THREE.Group();
  bedGroup.name = 'Luxury_King_Bed_Assembly';
  bedGroup.userData = { type: 'Furniture', label: 'Solid Walnut King-Size Cot with Deep Red Bedding' };

  const walnutMat = createArchitecturalMaterial('wood_walnut');
  const brassMat = createArchitecturalMaterial('brass');
  const sheetMat = createArchitecturalMaterial('fabric_cream');
  const redFabricMat = createArchitecturalMaterial('fabric_red');

  // 1. Solid Dark Walnut Bed Frame Base (2.1m W x 2.3m L x 0.34m H)
  const baseFrameGeo = new THREE.BoxGeometry(2.1, 0.24, 2.3);
  const baseFrame = new THREE.Mesh(baseFrameGeo, walnutMat);
  baseFrame.position.set(0, 0.26, 0);
  baseFrame.castShadow = true;
  baseFrame.receiveShadow = true;
  baseFrame.name = 'Cot_Walnut_Base_Frame';
  bedGroup.add(baseFrame);

  // 4 Tapered Walnut Legs
  const legPositions = [
    [-0.95, 0.07, -1.05],
    [0.95, 0.07, -1.05],
    [-0.95, 0.07, 1.05],
    [0.95, 0.07, 1.05]
  ];
  legPositions.forEach(([lx, ly, lz], i) => {
    const legGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.14, 16);
    const leg = new THREE.Mesh(legGeo, walnutMat);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    leg.name = `Cot_Walnut_Leg_${i + 1}`;
    bedGroup.add(leg);
  });

  // 2. High Architectural Walnut Headboard (2.35m W x 1.45m H x 0.14m D)
  const headboardGeo = new THREE.BoxGeometry(2.35, 1.45, 0.14);
  const headboard = new THREE.Mesh(headboardGeo, walnutMat);
  headboard.position.set(0, 0.98, -1.18);
  headboard.castShadow = true;
  headboard.receiveShadow = true;
  headboard.name = 'Cot_Walnut_Headboard';
  bedGroup.add(headboard);

  // Headboard Fluted Decorative Wood Insets (Left & Right Wings)
  [-0.6, 0.6].forEach((hx, i) => {
    const panelGeo = new THREE.BoxGeometry(0.85, 1.25, 0.03);
    const panel = new THREE.Mesh(panelGeo, walnutMat);
    panel.position.set(hx, 0.98, -1.09);
    panel.name = `Headboard_Fluted_Panel_${i + 1}`;
    bedGroup.add(panel);
  });

  // Warm LED Backlight Glow Behind Headboard
  const headboardLight = new THREE.PointLight(0xffeedd, 0.8, 4.0, 2);
  headboardLight.position.set(0, 1.6, -1.25);
  bedGroup.add(headboardLight);

  // 3. Plush Multi-Layer Mattress (1.95m W x 2.1m L x 0.32m H)
  const mattressGeo = new THREE.BoxGeometry(1.95, 0.32, 2.1);
  const mattress = new THREE.Mesh(mattressGeo, sheetMat);
  mattress.position.set(0, 0.48, -0.05);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  mattress.name = 'Cot_Plush_Mattress';
  bedGroup.add(mattress);

  // 4. Deep Red Fabric Bed Cover & Runner (Draped over lower 65% of bed)
  const redCoverGeo = new THREE.BoxGeometry(2.02, 0.08, 1.4);
  const redCover = new THREE.Mesh(redCoverGeo, redFabricMat);
  redCover.position.set(0, 0.66, 0.32);
  redCover.castShadow = true;
  redCover.receiveShadow = true;
  redCover.name = 'Bed_Deep_Red_Cover_Runner';
  bedGroup.add(redCover);

  // Draped Red Sides hanging over mattress edge
  [-1.02, 1.02].forEach((sx, i) => {
    const sideDropGeo = new THREE.BoxGeometry(0.04, 0.26, 1.38);
    const sideDrop = new THREE.Mesh(sideDropGeo, redFabricMat);
    sideDrop.position.set(sx, 0.52, 0.32);
    sideDrop.castShadow = true;
    sideDrop.name = `Red_Cover_Draped_Side_${i + 1}`;
    bedGroup.add(sideDrop);
  });

  // 5. Four Layered Pillows
  // Two Rear Sleeping Pillows (Off-White Linen) angled against headboard
  [-0.52, 0.52].forEach((px, i) => {
    const pillowGeo = new THREE.BoxGeometry(0.72, 0.18, 0.44);
    const pillow = new THREE.Mesh(pillowGeo, sheetMat);
    pillow.position.set(px, 0.72, -0.78);
    pillow.rotation.x = 0.28; // Angled back naturally
    pillow.castShadow = true;
    pillow.name = `Sleeping_Pillow_Cream_${i + 1}`;
    bedGroup.add(pillow);
  });

  // Two Front Decorative Pillows (Matching Deep Red Fabric)
  [-0.45, 0.45].forEach((px, i) => {
    const redPillowGeo = new THREE.BoxGeometry(0.58, 0.16, 0.36);
    const redPillow = new THREE.Mesh(redPillowGeo, redFabricMat);
    redPillow.position.set(px, 0.73, -0.48);
    redPillow.rotation.x = 0.18;
    redPillow.castShadow = true;
    redPillow.name = `Decorative_Pillow_Deep_Red_${i + 1}`;
    bedGroup.add(redPillow);
  });

  // 6. Matching Solid Dark Walnut Nightstands (Left & Right)
  [-1.6, 1.6].forEach((nx, i) => {
    const nsGroup = new THREE.Group();
    nsGroup.name = `Bedside_Nightstand_${i === 0 ? 'Left' : 'Right'}`;

    // Table body
    const nsBodyGeo = new THREE.BoxGeometry(0.6, 0.52, 0.48);
    const nsBody = new THREE.Mesh(nsBodyGeo, walnutMat);
    nsBody.position.set(nx, 0.26, -1.0);
    nsBody.castShadow = true;
    nsBody.receiveShadow = true;
    nsGroup.add(nsBody);

    // Brass pull handle
    const handleGeo = new THREE.BoxGeometry(0.2, 0.02, 0.03);
    const handle = new THREE.Mesh(handleGeo, brassMat);
    handle.position.set(nx, 0.34, -0.74);
    nsGroup.add(handle);

    // Designer Bedside Table Lamp
    const lampStemGeo = new THREE.CylinderGeometry(0.02, 0.08, 0.38, 16);
    const lampStem = new THREE.Mesh(lampStemGeo, brassMat);
    lampStem.position.set(nx, 0.71, -1.0);
    lampStem.castShadow = true;
    nsGroup.add(lampStem);

    // Fabric Lampshade
    const shadeGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.24, 20);
    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xffeed8,
      roughness: 0.9,
      emissive: 0xffcc88,
      emissiveIntensity: 0.4
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(nx, 0.92, -1.0);
    nsGroup.add(shade);

    // Warm Bedside Ambient PointLight
    const lampLight = new THREE.PointLight(0xffddaa, 0.9, 4.5, 2);
    lampLight.position.set(nx, 0.95, -1.0);
    lampLight.castShadow = true;
    lampLight.shadow.bias = -0.002;
    nsGroup.add(lampLight);

    bedGroup.add(nsGroup);
  });

  // 7. Area Rug Under Bed (Woven / Oriental motif)
  const rugGeo = new THREE.PlaneGeometry(3.6, 4.2);
  const rugMat = createArchitecturalMaterial('carpet_rug');
  const rug = new THREE.Mesh(rugGeo, rugMat);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.015, 0.2);
  rug.receiveShadow = true;
  rug.name = 'Bed_Area_Rug';
  bedGroup.add(rug);

  return bedGroup;
}

/**
 * Creates a Premium Minimalist 3-Door Dark Walnut Wardrobe
 */
export function createWardrobeAssembly(options = {}) {
  const wGroup = new THREE.Group();
  wGroup.name = 'Premium_Walnut_Wardrobe';
  wGroup.userData = { type: 'Furniture', label: 'Dark Walnut 3-Door Minimalist Wardrobe' };

  const walnutMat = createArchitecturalMaterial('wood_walnut');
  const brassMat = createArchitecturalMaterial('brass');

  const width = options.width || 2.4;
  const height = options.height || 2.7;
  const depth = options.depth || 0.65;

  // Main Carcass Box
  const bodyGeo = new THREE.BoxGeometry(width, height, depth);
  const body = new THREE.Mesh(bodyGeo, walnutMat);
  body.position.set(0, height / 2, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  body.name = 'Wardrobe_Main_Carcass';
  wGroup.add(body);

  // 3 Vertical Doors with slim brass handles
  const doorW = width / 3 - 0.02;
  [-doorW - 0.01, 0, doorW + 0.01].forEach((dx, i) => {
    // Door panel face reveal
    const doorFaceGeo = new THREE.BoxGeometry(doorW, height - 0.08, 0.02);
    const doorFace = new THREE.Mesh(doorFaceGeo, walnutMat);
    doorFace.position.set(dx, height / 2, depth / 2 + 0.015);
    doorFace.name = `Wardrobe_Door_${i + 1}`;
    wGroup.add(doorFace);

    // Slim vertical brass handle
    const hGeo = new THREE.BoxGeometry(0.02, 0.75, 0.03);
    const hMesh = new THREE.Mesh(hGeo, brassMat);
    hMesh.position.set(dx + (i === 1 ? -0.15 : 0.15), height / 2, depth / 2 + 0.035);
    wGroup.add(hMesh);
  });

  return wGroup;
}

/**
 * Creates Panoramic Windows with Translucent Sheer Curtains & Elegant Wave Drapes
 */
export function createPanoramicWindowAndCurtains(options = {}) {
  const winGroup = new THREE.Group();
  winGroup.name = 'Panoramic_Window_And_Curtains';

  const width = options.width || 5.6;
  const height = options.height || 3.2;

  const glassMat = createArchitecturalMaterial('glass');
  const frameMat = createArchitecturalMaterial('black_metal');
  const sheerMat = createArchitecturalMaterial('curtain_sheer');
  const drapeMat = createArchitecturalMaterial('fabric_cream', '#f0ede6');

  // Outer Window Frame
  const frameGeo = new THREE.BoxGeometry(width, height, 0.1);
  const frameWire = new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), new THREE.LineBasicMaterial({ color: 0x111418, linewidth: 2 }));
  winGroup.add(frameWire);

  // Glass Panes (3 panoramic vertical bays)
  const bayW = width / 3;
  for (let b = 0; b < 3; b++) {
    const paneGeo = new THREE.BoxGeometry(bayW - 0.06, height - 0.06, 0.04);
    const pane = new THREE.Mesh(paneGeo, glassMat);
    pane.position.set(-width / 2 + bayW / 2 + b * bayW, 0, 0);
    winGroup.add(pane);
  }

  // Curtain Rod (Brushed Brass)
  const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, width + 0.4, 16);
  const rodMat = createArchitecturalMaterial('brass');
  const rod = new THREE.Mesh(rodGeo, rodMat);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, height / 2 + 0.1, 0.12);
  winGroup.add(rod);

  // Sheer Translucent Inner Curtain
  const sheerGeo = new THREE.PlaneGeometry(width * 0.7, height - 0.1);
  const sheer = new THREE.Mesh(sheerGeo, sheerMat);
  sheer.position.set(0, -0.05, 0.14);
  winGroup.add(sheer);

  // Elegant Side Drapes (Left & Right) with undulating folds
  [-width / 2 + 0.45, width / 2 - 0.45].forEach((dx, idx) => {
    const drapeGeo = new THREE.BoxGeometry(0.9, height - 0.05, 0.12);
    const drape = new THREE.Mesh(drapeGeo, drapeMat);
    drape.position.set(dx, -0.05, 0.18);
    drape.castShadow = true;
    drape.name = `Window_Side_Drape_${idx === 0 ? 'Left' : 'Right'}`;
    winGroup.add(drape);
  });

  return winGroup;
}

// ==========================================
// SCENE GENERATORS: BEDROOM, LIVING, KITCHEN, VILLA
// ==========================================

/**
 * Builds the Ultra-Realistic Luxury Bedroom Scene
 * Exactly matching user specification:
 * - Solid dark walnut wooden king-size cot
 * - Deep red themed bed cover
 * - Matching red pillows & cream sleeping pillows
 * - Cream-colored walls with warm recessed lights
 * - Natural dark walnut wooden flooring
 * - Minimalist wardrobe
 * - Bedside tables with designer lamps
 * - Large panoramic windows with elegant curtains
 */
export function buildInteriorBedroomScene(sceneConfig = {}, rootGroup) {
  const roomW = 7.8;
  const roomH = 3.6;
  const roomD = 8.2;

  const walnutFloorMat = createArchitecturalMaterial('wood_walnut', null, { repeat: [4, 6] });
  const creamWallMat = createArchitecturalMaterial('plaster_cream', sceneConfig.wallColor || '#f4efe6', { repeat: [4, 3] });
  const ceilingMat = createArchitecturalMaterial('plaster_cream', '#fbf9f5');
  const brassMat = createArchitecturalMaterial('brass');

  // 1. Parquet Wooden Floor
  const floorGeo = new THREE.BoxGeometry(roomW, 0.2, roomD);
  const floorMesh = new THREE.Mesh(floorGeo, walnutFloorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  floorMesh.name = 'Bedroom_Walnut_Parquet_Floor';
  floorMesh.userData = { type: 'Floor', label: 'Dark Walnut Parquet Flooring' };
  rootGroup.add(floorMesh);

  // 2. Ceiling with Recessed Downlights
  const ceilingGeo = new THREE.BoxGeometry(roomW, 0.15, roomD);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.position.set(0, roomH + 0.075, 0);
  ceilingMesh.receiveShadow = true;
  ceilingMesh.name = 'Bedroom_Ceiling';
  rootGroup.add(ceilingMesh);

  // 4 Recessed Warm LED Ceiling Downlights (2800K soft warm light)
  const lightCoords = [
    [-1.8, 1.4],
    [1.8, 1.4],
    [-1.8, -1.6],
    [1.8, -1.6]
  ];
  lightCoords.forEach(([lx, lz], i) => {
    // Trim ring
    const ringGeo = new THREE.TorusGeometry(0.1, 0.02, 12, 24);
    const ring = new THREE.Mesh(ringGeo, brassMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(lx, roomH - 0.01, lz);
    rootGroup.add(ring);

    // Downlight Spotlight
    const spot = new THREE.SpotLight(0xfff0dd, 1.8, 7.5, Math.PI / 4, 0.45, 1.8);
    spot.position.set(lx, roomH - 0.05, lz);
    spot.target.position.set(lx, 0, lz);
    spot.castShadow = true;
    spot.shadow.bias = -0.001;
    rootGroup.add(spot);
    rootGroup.add(spot.target);
  });

  // 3. Back Accent Wall (Headboard wall at Z = -roomD/2)
  const backWallGeo = new THREE.BoxGeometry(roomW, roomH, 0.25);
  const backWall = new THREE.Mesh(backWallGeo, creamWallMat);
  backWall.position.set(0, roomH / 2, -roomD / 2);
  backWall.receiveShadow = true;
  backWall.name = 'Headboard_Cream_Wall';
  rootGroup.add(backWall);

  // Architectural Landscape Art piece above bed
  const artFrameGeo = new THREE.BoxGeometry(2.0, 1.0, 0.04);
  const artFrame = new THREE.Mesh(artFrameGeo, createArchitecturalMaterial('wood_walnut'));
  artFrame.position.set(0, 2.3, -roomD / 2 + 0.15);
  artFrame.name = 'Architectural_Framed_Artwork';
  rootGroup.add(artFrame);

  const canvasGeo = new THREE.PlaneGeometry(1.88, 0.88);
  const canvasMat = new THREE.MeshStandardMaterial({
    color: 0xd6cbb8,
    roughness: 0.85
  });
  const artCanvas = new THREE.Mesh(canvasGeo, canvasMat);
  artCanvas.position.set(0, 2.3, -roomD / 2 + 0.18);
  rootGroup.add(artCanvas);

  // 4. Left Wall with Large Panoramic Window (at X = -roomW/2)
  const leftWindowWall = new THREE.Group();
  leftWindowWall.position.set(-roomW / 2 + 0.1, roomH / 2, 0);
  leftWindowWall.rotation.y = Math.PI / 2;

  const windowAssembly = createPanoramicWindowAndCurtains({ width: 5.6, height: roomH - 0.4 });
  leftWindowWall.add(windowAssembly);
  rootGroup.add(leftWindowWall);

  // Natural Sunlight streaming through window from outside
  const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
  sunLight.position.set(-18, 14, 4);
  sunLight.target.position.set(0, 1.2, 0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0004;
  sunLight.name = 'Natural_Daylight_Sun';
  rootGroup.add(sunLight);
  rootGroup.add(sunLight.target);

  // 5. Right Wall with Minimalist Dark Walnut Wardrobe (at X = +roomW/2)
  const rightWallGeo = new THREE.BoxGeometry(0.25, roomH, roomD);
  const rightWall = new THREE.Mesh(rightWallGeo, creamWallMat);
  rightWall.position.set(roomW / 2, roomH / 2, 0);
  rightWall.receiveShadow = true;
  rightWall.name = 'Right_Cream_Wall';
  rootGroup.add(rightWall);

  const wardrobe = createWardrobeAssembly({ width: 2.5, height: 2.8, depth: 0.68 });
  wardrobe.position.set(roomW / 2 - 0.38, 0, 0.8);
  wardrobe.rotation.y = -Math.PI / 2;
  rootGroup.add(wardrobe);

  // 6. Center King-Size Bed Assembly
  const bedAssembly = createKingSizeBedAssembly();
  bedAssembly.position.set(0, 0, -1.4);
  rootGroup.add(bedAssembly);

  return rootGroup;
}

/**
 * Builds the Ultra-Realistic Luxury Living Room Scene
 */
export function buildInteriorLivingRoomScene(sceneConfig = {}, rootGroup) {
  const roomW = 8.6;
  const roomH = 4.0;
  const roomD = 9.0;

  const oakFloorMat = createArchitecturalMaterial('wood_oak', null, { repeat: [5, 6] });
  const creamWallMat = createArchitecturalMaterial('plaster_cream', '#f6f3ed');
  const marbleMat = createArchitecturalMaterial('marble_calacatta');
  const walnutMat = createArchitecturalMaterial('wood_walnut');
  const linenSofaMat = createArchitecturalMaterial('fabric_cream', '#ede9df');

  // Floor
  const floorGeo = new THREE.BoxGeometry(roomW, 0.2, roomD);
  const floorMesh = new THREE.Mesh(floorGeo, oakFloorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  rootGroup.add(floorMesh);

  // Ceiling
  const ceilingGeo = new THREE.BoxGeometry(roomW, 0.15, roomD);
  const ceiling = new THREE.Mesh(ceilingGeo, creamWallMat);
  ceiling.position.set(0, roomH + 0.075, 0);
  rootGroup.add(ceiling);

  // Back Wall with Marble Fireplace
  const backWallGeo = new THREE.BoxGeometry(roomW, roomH, 0.25);
  const backWall = new THREE.Mesh(backWallGeo, creamWallMat);
  backWall.position.set(0, roomH / 2, -roomD / 2);
  rootGroup.add(backWall);

  // Honed Marble Fireplace Feature
  const fpGeo = new THREE.BoxGeometry(2.6, 1.8, 0.35);
  const fp = new THREE.Mesh(fpGeo, marbleMat);
  fp.position.set(0, 0.9, -roomD / 2 + 0.2);
  fp.castShadow = true;
  rootGroup.add(fp);

  // Fireplace Hearth Niche
  const nicheGeo = new THREE.BoxGeometry(1.4, 0.5, 0.25);
  const nicheMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  const niche = new THREE.Mesh(nicheGeo, nicheMat);
  niche.position.set(0, 0.45, -roomD / 2 + 0.3);
  rootGroup.add(niche);

  // Warm Fireplace Glow
  const fpLight = new THREE.PointLight(0xff8833, 1.5, 4.0, 2);
  fpLight.position.set(0, 0.5, -roomD / 2 + 0.45);
  rootGroup.add(fpLight);

  // Luxury Low-Profile Sectional Sofa (L-Shape)
  const sofaGroup = new THREE.Group();
  sofaGroup.name = 'Luxury_Modular_Sectional_Sofa';

  // Main Section
  const mainSofaGeo = new THREE.BoxGeometry(3.2, 0.42, 1.1);
  const mainSofa = new THREE.Mesh(mainSofaGeo, linenSofaMat);
  mainSofa.position.set(0, 0.26, 0.8);
  mainSofa.castShadow = true;
  sofaGroup.add(mainSofa);

  // Sofa Backrest
  const backrestGeo = new THREE.BoxGeometry(3.2, 0.45, 0.28);
  const backrest = new THREE.Mesh(backrestGeo, linenSofaMat);
  backrest.position.set(0, 0.65, 1.25);
  backrest.castShadow = true;
  sofaGroup.add(backrest);

  // Chaise Lounge Wing (L-return)
  const chaiseGeo = new THREE.BoxGeometry(1.1, 0.42, 1.8);
  const chaise = new THREE.Mesh(chaiseGeo, linenSofaMat);
  chaise.position.set(1.05, 0.26, -0.2);
  chaise.castShadow = true;
  sofaGroup.add(chaise);

  rootGroup.add(sofaGroup);

  // Solid Walnut & Marble Coffee Table
  const tableGroup = new THREE.Group();
  tableGroup.name = 'Luxury_Coffee_Table';
  const tableTopGeo = new THREE.BoxGeometry(1.6, 0.08, 0.9);
  const tableTop = new THREE.Mesh(tableTopGeo, walnutMat);
  tableTop.position.set(0, 0.35, -0.4);
  tableTop.castShadow = true;
  tableGroup.add(tableTop);

  const tableBaseGeo = new THREE.BoxGeometry(1.4, 0.3, 0.7);
  const tableBase = new THREE.Mesh(tableBaseGeo, marbleMat);
  tableBase.position.set(0, 0.15, -0.4);
  tableGroup.add(tableBase);
  rootGroup.add(tableGroup);

  // Left Panoramic Window Wall with Curtains
  const leftWindowWall = new THREE.Group();
  leftWindowWall.position.set(-roomW / 2 + 0.1, roomH / 2, 0);
  leftWindowWall.rotation.y = Math.PI / 2;
  leftWindowWall.add(createPanoramicWindowAndCurtains({ width: 6.4, height: roomH - 0.4 }));
  rootGroup.add(leftWindowWall);

  return rootGroup;
}

/**
 * Builds the Ultra-Realistic Gourmet Kitchen Scene
 */
export function buildInteriorKitchenScene(sceneConfig = {}, rootGroup) {
  const roomW = 8.0;
  const roomH = 3.6;
  const roomD = 8.0;

  const floorMat = createArchitecturalMaterial('tile_porcelain', null, { repeat: [4, 4] });
  const wallMat = createArchitecturalMaterial('plaster_cream', '#f5f2eb');
  const marbleMat = createArchitecturalMaterial('marble_calacatta');
  const charcoalMat = createArchitecturalMaterial('metal', '#282b30');
  const brassMat = createArchitecturalMaterial('brass');

  // Tile floor
  const floorGeo = new THREE.BoxGeometry(roomW, 0.2, roomD);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  rootGroup.add(floorMesh);

  // Ceiling
  const ceilingGeo = new THREE.BoxGeometry(roomW, 0.15, roomD);
  const ceiling = new THREE.Mesh(ceilingGeo, wallMat);
  ceiling.position.set(0, roomH + 0.075, 0);
  rootGroup.add(ceiling);

  // Calacatta Marble Waterfall Island (Centerpiece)
  const islandGroup = new THREE.Group();
  islandGroup.name = 'Calacatta_Marble_Waterfall_Island';

  // Island Countertop
  const topGeo = new THREE.BoxGeometry(3.0, 0.1, 1.2);
  const topMesh = new THREE.Mesh(topGeo, marbleMat);
  topMesh.position.set(0, 0.92, 0);
  topMesh.castShadow = true;
  islandGroup.add(topMesh);

  // Waterfall Left Leg
  const leftLegGeo = new THREE.BoxGeometry(0.1, 0.92, 1.2);
  const leftLeg = new THREE.Mesh(leftLegGeo, marbleMat);
  leftLeg.position.set(-1.45, 0.46, 0);
  islandGroup.add(leftLeg);

  // Waterfall Right Leg
  const rightLegGeo = new THREE.BoxGeometry(0.1, 0.92, 1.2);
  const rightLeg = new THREE.Mesh(rightLegGeo, marbleMat);
  rightLeg.position.set(1.45, 0.46, 0);
  islandGroup.add(rightLeg);

  // Undermount Sink & Brass Gooseneck Faucet
  const faucetGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.42, 16);
  const faucet = new THREE.Mesh(faucetGeo, brassMat);
  faucet.position.set(-0.4, 1.16, 0);
  islandGroup.add(faucet);

  rootGroup.add(islandGroup);

  // Back Wall with Matte Charcoal Flat-Panel Cabinetry
  const cabGeo = new THREE.BoxGeometry(5.2, 2.7, 0.7);
  const cab = new THREE.Mesh(cabGeo, charcoalMat);
  cab.position.set(0, 1.35, -roomD / 2 + 0.38);
  cab.castShadow = true;
  rootGroup.add(cab);

  return rootGroup;
}

/**
 * Builds the Upgraded Ultra-Photorealistic Two-Storey Villa Exterior
 */
export function buildExteriorVillaScene(sceneConfig = {}, rootGroup) {
  const {
    dimensions = { width: 14, length: 16, height: 6.8 },
    floors = 2,
    wallHeight = 3.2,
    wallThickness = 0.25,
    exteriorMaterial = 'white_concrete',
    roofType = 'flat',
    features = ['swimming_pool', 'balcony', 'landscaped_garden']
  } = sceneConfig;

  const width = dimensions.width || 14;
  const length = dimensions.length || 16;
  const totalBuildingHeight = floors * wallHeight;

  // Ground Plane
  const groundSize = Math.max(width, length) * 3.0;
  const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
  const groundMat = createArchitecturalMaterial(features.includes('landscaped_garden') ? 'grass' : 'concrete');
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -0.05;
  groundMesh.receiveShadow = true;
  groundMesh.name = 'Ground_Terrain';
  rootGroup.add(groundMesh);

  // Plinth
  const plinthGeo = new THREE.BoxGeometry(width + 1.2, 0.4, length + 1.2);
  const plinthMat = createArchitecturalMaterial('plaster_cream', '#d8d4cb');
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.position.set(0, 0.2, 0);
  plinthMesh.castShadow = true;
  plinthMesh.receiveShadow = true;
  rootGroup.add(plinthMesh);

  const wallMat = createArchitecturalMaterial(exteriorMaterial);
  const glassMat = createArchitecturalMaterial('glass');
  const timberMat = createArchitecturalMaterial('wood_walnut');

  // Walls & Levels
  for (let f = 0; f < floors; f++) {
    const floorY = 0.4 + f * wallHeight;
    const floorGroup = new THREE.Group();
    floorGroup.name = `Storey_Level_${f + 1}`;

    const currentWallY = floorY + wallHeight / 2;

    // North Wall
    const northGeo = new THREE.BoxGeometry(width, wallHeight, wallThickness);
    const northWall = new THREE.Mesh(northGeo, wallMat);
    northWall.position.set(0, currentWallY, -length / 2 + wallThickness / 2);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    floorGroup.add(northWall);

    // Front Panoramic Window Panes
    const winGeo = new THREE.BoxGeometry(width * 0.75, wallHeight - 0.6, 0.05);
    const winMesh = new THREE.Mesh(winGeo, glassMat);
    winMesh.position.set(0, currentWallY, length / 2 - wallThickness / 2);
    floorGroup.add(winMesh);

    // Timber Feature Accents
    const timberGeo = new THREE.BoxGeometry(width * 0.22, wallHeight, wallThickness + 0.05);
    const timberAccent = new THREE.Mesh(timberGeo, timberMat);
    timberAccent.position.set(-width * 0.38, currentWallY, length / 2);
    timberAccent.castShadow = true;
    floorGroup.add(timberAccent);

    rootGroup.add(floorGroup);
  }

  // Roof Geometry (Flat Cantilever, Pitched Gable, or Rooftop Terrace)
  const isPitched = roofType === 'pitched' || roofType === 'sloped' || roofType === 'gable';
  const isTerrace = roofType === 'roof_terrace' || roofType === 'terrace';

  if (isPitched) {
    const pitchGroup = new THREE.Group();
    pitchGroup.name = 'Pitched_Roof_Structure';
    const pitchHeight = 2.4;
    const roofY = 0.4 + totalBuildingHeight;

    const roofMeshMat = createArchitecturalMaterial('tile_porcelain', '#8c2d19');
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2 - 0.8, 0);
    shape.lineTo(0, pitchHeight);
    shape.lineTo(width / 2 + 0.8, 0);
    shape.closePath();

    const extrudeSettings = { depth: length + 1.6, bevelEnabled: false };
    const prismGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const prism = new THREE.Mesh(prismGeo, roofMeshMat);
    prism.position.set(0, roofY, -length / 2 - 0.8);
    prism.castShadow = true;
    prism.receiveShadow = true;
    pitchGroup.add(prism);
    rootGroup.add(pitchGroup);
  } else if (isTerrace) {
    const terraceGroup = new THREE.Group();
    terraceGroup.name = 'Rooftop_Terrace_Assembly';
    const roofY = 0.4 + totalBuildingHeight;

    // Deck slab
    const deckGeo = new THREE.BoxGeometry(width + 1.0, 0.35, length + 1.0);
    const deckMat = createArchitecturalMaterial('wood_walnut');
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, roofY + 0.175, 0);
    deckMesh.receiveShadow = true;
    terraceGroup.add(deckMesh);

    // Glass perimeter railings
    const railMat = createArchitecturalMaterial('glass');
    const frontRailGeo = new THREE.BoxGeometry(width + 0.8, 1.0, 0.06);
    const frontRail = new THREE.Mesh(frontRailGeo, railMat);
    frontRail.position.set(0, roofY + 0.35 + 0.5, length / 2 + 0.4);
    terraceGroup.add(frontRail);

    const backRail = frontRail.clone();
    backRail.position.z = -length / 2 - 0.4;
    terraceGroup.add(backRail);

    // Terrace pergola shading
    const pergolaMat = createArchitecturalMaterial('metal', '#1e2329');
    for (let b = 0; b < 6; b++) {
      const beamGeo = new THREE.BoxGeometry(width * 0.45, 0.1, 0.1);
      const beam = new THREE.Mesh(beamGeo, pergolaMat);
      beam.position.set(width * 0.2, roofY + 2.6, -length * 0.2 + b * 1.0);
      terraceGroup.add(beam);
    }
    rootGroup.add(terraceGroup);
  } else {
    // Standard Modern Flat Roof Cantilever
    const roofGeo = new THREE.BoxGeometry(width + 2.2, 0.4, length + 2.2);
    const roof = new THREE.Mesh(roofGeo, wallMat);
    roof.name = 'Flat_Roof_Cantilever';
    roof.position.set(0, 0.4 + totalBuildingHeight + 0.2, 0);
    roof.castShadow = true;
    roof.receiveShadow = true;
    rootGroup.add(roof);
  }

  // Cantilever Balcony (Attached to first or second floor)
  if (features.includes('balcony')) {
    const balconyGroup = new THREE.Group();
    balconyGroup.name = 'Cantilever_Balcony_Assembly';
    const bFloor = floors >= 2 ? 1 : 0;
    const bY = 0.4 + bFloor * wallHeight;
    const bWidth = width * 0.65;
    const bDepth = 2.4;

    // Balcony slab
    const bSlabGeo = new THREE.BoxGeometry(bWidth, 0.25, bDepth);
    const bSlabMat = createArchitecturalMaterial('plaster_cream', '#eae7e0');
    const bSlab = new THREE.Mesh(bSlabGeo, bSlabMat);
    bSlab.position.set(0, bY + wallHeight - 0.12, length / 2 + bDepth / 2);
    bSlab.castShadow = true;
    bSlab.receiveShadow = true;
    balconyGroup.add(bSlab);

    // Cantilever supports underneath
    const strutMat = createArchitecturalMaterial('metal', '#2b2f36');
    for (const sx of [-bWidth * 0.35, 0, bWidth * 0.35]) {
      const strutGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 12);
      const strut = new THREE.Mesh(strutGeo, strutMat);
      strut.position.set(sx, bY + wallHeight - 0.8, length / 2 + bDepth * 0.4);
      strut.rotation.x = Math.PI / 4;
      balconyGroup.add(strut);
    }

    // Modern glass balustrade railings
    const glassRailMat = createArchitecturalMaterial('glass');
    const frontRailGeo = new THREE.BoxGeometry(bWidth, 1.05, 0.05);
    const frontRail = new THREE.Mesh(frontRailGeo, glassRailMat);
    frontRail.position.set(0, bY + wallHeight + 0.52, length / 2 + bDepth - 0.04);
    balconyGroup.add(frontRail);

    const sideRailGeo = new THREE.BoxGeometry(0.05, 1.05, bDepth);
    const leftRail = new THREE.Mesh(sideRailGeo, glassRailMat);
    leftRail.position.set(-bWidth / 2, bY + wallHeight + 0.52, length / 2 + bDepth / 2);
    balconyGroup.add(leftRail);

    const rightRail = leftRail.clone();
    rightRail.position.x = bWidth / 2;
    balconyGroup.add(rightRail);

    rootGroup.add(balconyGroup);
  }

  // Entrance Architectural Columns
  if (features.includes('columns')) {
    const colGroup = new THREE.Group();
    colGroup.name = 'Entrance_Columns_Assembly';
    const colMat = createArchitecturalMaterial('white_concrete', '#f2efea');
    const colHeight = wallHeight;
    const colRadius = 0.28;

    const colXPositions = [-width * 0.25, -width * 0.08, width * 0.08, width * 0.25];
    colXPositions.forEach((cx, idx) => {
      const colGeo = new THREE.CylinderGeometry(colRadius, colRadius * 1.15, colHeight, 24);
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(cx, 0.4 + colHeight / 2, length / 2 + 1.2);
      col.castShadow = true;
      col.receiveShadow = true;
      col.name = `Entrance_Column_${idx + 1}`;
      colGroup.add(col);

      // Capital & Base plinths
      const baseGeo = new THREE.BoxGeometry(colRadius * 2.8, 0.18, colRadius * 2.8);
      const baseMesh = new THREE.Mesh(baseGeo, colMat);
      baseMesh.position.set(cx, 0.4 + 0.09, length / 2 + 1.2);
      colGroup.add(baseMesh);

      const capMesh = baseMesh.clone();
      capMesh.position.y = 0.4 + colHeight - 0.09;
      colGroup.add(capMesh);
    });
    rootGroup.add(colGroup);
  }

  // Landscaped Garden (Hedges, trees, stone pathway & flora)
  if (features.includes('landscaped_garden')) {
    const gardenGroup = new THREE.Group();
    gardenGroup.name = 'Landscaped_Garden_Assembly';

    const stoneMat = createArchitecturalMaterial('tile_porcelain', '#8c929a');
    const foliageMat = createArchitecturalMaterial('grass', '#1f5f24');
    const trunkMat = createArchitecturalMaterial('wood_walnut', '#3a2012');

    // Stone pathway to entrance
    for (let p = 0; p < 8; p++) {
      const stoneGeo = new THREE.BoxGeometry(2.0, 0.04, 1.2);
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(0, 0.02, length / 2 + 1.4 + p * 1.6);
      stone.receiveShadow = true;
      gardenGroup.add(stone);
    }

    // Architectural topiary trees & perimeter hedges
    const treePositions = [
      [-width / 2 - 3.5, 0, length / 2 + 2],
      [-width / 2 - 4.0, 0, 0],
      [-width / 2 - 3.5, 0, -length / 2 - 2],
      [width / 2 + 3.5, 0, -length / 2 - 2],
      [-3.0, 0, length / 2 + 8.0],
      [3.0, 0, length / 2 + 8.0]
    ];

    treePositions.forEach((pos, i) => {
      const tree = new THREE.Group();
      tree.name = `Garden_Tree_${i + 1}`;

      const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.4, 8);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(0, 1.2, 0);
      trunk.castShadow = true;
      tree.add(trunk);

      const crownGeo = new THREE.SphereGeometry(1.4, 12, 10);
      const crown = new THREE.Mesh(crownGeo, foliageMat);
      crown.position.set(0, 2.8, 0);
      crown.castShadow = true;
      tree.add(crown);

      tree.position.set(pos[0], pos[1], pos[2]);
      gardenGroup.add(tree);
    });

    rootGroup.add(gardenGroup);
  }

  // Parking Space / Carport
  if (features.includes('carport') || features.includes('parking')) {
    const cpGroup = new THREE.Group();
    cpGroup.name = 'Carport_Parking_Assembly';
    const cpWidth = 6.0;
    const cpLength = 8.5;
    const cpX = -width / 2 - cpWidth / 2 - 1.5;

    // Asphalt / Stone driveway bay
    const bayGeo = new THREE.BoxGeometry(cpWidth, 0.08, cpLength);
    const bayMat = createArchitecturalMaterial('concrete', '#2b3036');
    const bay = new THREE.Mesh(bayGeo, bayMat);
    bay.position.set(cpX, 0.04, 0);
    bay.receiveShadow = true;
    cpGroup.add(bay);

    // Carport cantilever canopy
    const canopyMat = createArchitecturalMaterial('metal', '#1b1f24');
    const postMat = createArchitecturalMaterial('metal', '#323942');

    const canopyGeo = new THREE.BoxGeometry(cpWidth + 0.4, 0.15, cpLength + 0.4);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(cpX, 3.2, 0);
    canopy.castShadow = true;
    cpGroup.add(canopy);

    // Support pillars on the outer side
    for (const cz of [-cpLength * 0.4, 0, cpLength * 0.4]) {
      const postGeo = new THREE.BoxGeometry(0.16, 3.2, 0.16);
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(cpX - cpWidth / 2 + 0.2, 1.6, cz);
      post.castShadow = true;
      cpGroup.add(post);
    }

    rootGroup.add(cpGroup);
  }

  // Swimming Pool
  if (features.includes('swimming_pool')) {
    const poolGroup = new THREE.Group();
    poolGroup.name = 'Swimming_Pool_Assembly';
    const poolW = 6.5;
    const poolL = 11.0;
    const poolX = width / 2 + poolW / 2 + 2.5;

    const deckGeo = new THREE.BoxGeometry(poolW + 2.5, 0.1, poolL + 2.5);
    const deckMat = createArchitecturalMaterial('tile_porcelain');
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(poolX, 0, 0);
    deck.receiveShadow = true;
    poolGroup.add(deck);

    const waterGeo = new THREE.PlaneGeometry(poolW - 0.2, poolL - 0.2);
    const water = new THREE.Mesh(waterGeo, createArchitecturalMaterial('water'));
    water.rotation.x = -Math.PI / 2;
    water.position.set(poolX, 0.02, 0);
    poolGroup.add(water);

    rootGroup.add(poolGroup);
  }

  return rootGroup;
}

// ==========================================
// MAIN GENERATION DISPATCHER
// ==========================================

export function generateArchitecturalScene(sceneConfig = {}, targetGroup = null) {
  const root = targetGroup || new THREE.Group();
  root.name = 'ZUKE_Architectural_Scene';

  // Dispose previous children
  while (root.children.length > 0) {
    const child = root.children[0];
    root.remove(child);
    if (child.geometry) child.geometry.dispose();
  }

  const bType = (sceneConfig.buildingType || '').toLowerCase();
  const roomType = (sceneConfig.roomType || sceneConfig.spaceType || '').toLowerCase();
  const styleStr = (sceneConfig.style || '').toLowerCase();

  // Detect interior bedroom request
  if (
    roomType.includes('bedroom') ||
    bType.includes('bedroom') ||
    styleStr.includes('bedroom') ||
    (sceneConfig.features && sceneConfig.features.includes('bedroom')) ||
    (sceneConfig.bedCoverColor || sceneConfig.furnitureWood)
  ) {
    return buildInteriorBedroomScene(sceneConfig, root);
  }

  // Detect interior living room
  if (roomType.includes('living') || bType.includes('living') || (sceneConfig.features && sceneConfig.features.includes('velvet_sectional'))) {
    return buildInteriorLivingRoomScene(sceneConfig, root);
  }

  // Detect interior kitchen
  if (roomType.includes('kitchen') || bType.includes('kitchen')) {
    return buildInteriorKitchenScene(sceneConfig, root);
  }

  // Detect general interior (defaults to luxury bedroom if unspecified interior)
  if (bType.includes('interior')) {
    return buildInteriorBedroomScene(sceneConfig, root);
  }

  // Exterior building / villa
  return buildExteriorVillaScene(sceneConfig, root);
}

// Convert 2D Wall Tracing segments into 3D Extruded Geometry (Preserved & Enhanced)
export function convert2DSketchTo3D(sketchData, options = {}) {
  const {
    wallHeight = 3.0,
    wallThickness = 0.25,
    material = 'white_concrete'
  } = options;

  const group = new THREE.Group();
  group.name = 'Converted_2D_Architectural_Model';

  const wallMat = createArchitecturalMaterial(material);
  const floorMat = createArchitecturalMaterial('wood_walnut');

  const elements = sketchData?.elements || [];
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

  elements.forEach((el) => {
    if (el.type === 'wall' || el.type === 'line') {
      const dx = el.x2 - el.x1;
      const dz = el.y2 - el.y1;
      const len = Math.sqrt(dx * dx + dz * dz);
      if (len < 0.01) return;

      const angle = Math.atan2(dz, dx);
      const midX = (el.x1 + el.x2) / 2;
      const midZ = (el.y1 + el.y2) / 2;

      minX = Math.min(minX, el.x1, el.x2);
      maxX = Math.max(maxX, el.x1, el.x2);
      minZ = Math.min(minZ, el.y1, el.y2);
      maxZ = Math.max(maxZ, el.y1, el.y2);

      const wallGeo = new THREE.BoxGeometry(len, wallHeight, wallThickness);
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.set(midX, wallHeight / 2, midZ);
      wallMesh.rotation.y = -angle;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      wallMesh.name = `Extruded_Wall_${el.id || Math.random().toString(36).substring(7)}`;
      group.add(wallMesh);
    }
  });

  if (minX !== Infinity && maxX !== -Infinity) {
    const floorW = (maxX - minX) + 2.0;
    const floorL = (maxZ - minZ) + 2.0;
    const floorGeo = new THREE.BoxGeometry(floorW, 0.2, floorL);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set((minX + maxX) / 2, -0.1, (minZ + maxZ) / 2);
    floorMesh.receiveShadow = true;
    floorMesh.name = 'Extruded_Base_Floor';
    group.add(floorMesh);
  }

  return group;
}
