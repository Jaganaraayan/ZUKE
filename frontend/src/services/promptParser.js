// Prompt Engineering & Modification Layer for ZUKE Architectural Studio

export function parsePromptToScene(promptText, baseConfig = null) {
  const p = (promptText || '').toLowerCase();

  // If modifying an existing scene
  const config = baseConfig ? JSON.parse(JSON.stringify(baseConfig)) : getDefaultSceneConfig();
  const changes = [];
  const affectedComponents = [];

  // 1. Detect Building & Interior Space Type
  if (p.includes('bedroom') || p.includes('cot') || p.includes('king-size') || p.includes('bed cover')) {
    config.buildingType = 'Interior';
    config.roomType = 'bedroom';
    config.features = config.features ? config.features.filter(f => !['swimming_pool', 'balcony', 'landscaped_garden', 'carport'].includes(f)) : [];
    if (!config.features.includes('bedroom')) config.features.push('bedroom');
    changes.push('Configured luxury interior bedroom workspace');
    affectedComponents.push('Space: Bedroom');
  } else if (p.includes('living room') || p.includes('lounge') || p.includes('sofa') || p.includes('fireplace')) {
    config.buildingType = 'Interior';
    config.roomType = 'living_room';
    changes.push('Configured modern luxury living room workspace');
    affectedComponents.push('Space: Living Room');
  } else if (p.includes('kitchen') || p.includes('kitchen island') || p.includes('countertop')) {
    config.buildingType = 'Interior';
    config.roomType = 'kitchen';
    changes.push('Configured gourmet kitchen workspace');
    affectedComponents.push('Space: Kitchen');
  } else if (p.includes('villa') || p.includes('residence') || p.includes('house') || p.includes('mansion') || p.includes('bungalow') || p.includes('duplex') || p.includes('cottage') || p.includes('building') || p.includes('two-storey') || p.includes('2 storey')) {
    config.buildingType = 'Residential';
    config.roomType = 'exterior_villa';
    delete config.bedCoverColor;
    delete config.furnitureWood;
    if (config.features) {
      config.features = config.features.filter(f => !['bedroom', 'wardrobe', 'curtains'].includes(f));
    }
    changes.push('Building type set to Residential Villa');
    affectedComponents.push('Building Type');
  } else if (p.includes('commercial') || p.includes('office') || p.includes('headquarters') || p.includes('hospital') || p.includes('mall')) {
    config.buildingType = 'Commercial';
    config.roomType = 'commercial';
    changes.push('Building type set to Commercial');
    affectedComponents.push('Building Type');
  } else if (p.includes('landscape') || p.includes('pavilion') || p.includes('bridge')) {
    config.buildingType = 'Landscape';
    config.roomType = 'landscape';
    changes.push('Building type set to Landscape / Special');
    affectedComponents.push('Building Type');
  }

  // 1b. Interior Furniture & Design Specifications
  if (p.includes('walnut') || p.includes('dark walnut')) {
    config.furnitureWood = 'dark_walnut';
    config.floorMaterial = 'wood_walnut';
    changes.push('Applied solid dark walnut wood to furniture & flooring');
    affectedComponents.push('Furniture: Solid Walnut Cot & Wardrobe');
  } else if (p.includes('oak')) {
    config.furnitureWood = 'natural_oak';
    config.floorMaterial = 'wood_oak';
    changes.push('Applied natural oak timber finishes');
    affectedComponents.push('Materials: Oak');
  }

  if (p.includes('red') || p.includes('red-themed') || p.includes('red cover') || p.includes('red pillow') || p.includes('burgundy')) {
    config.bedCoverColor = '#8b1d24';
    config.pillowColor = '#8b1d24';
    changes.push('Configured deep red fabric bed cover & matching red pillows');
    affectedComponents.push('Bedding: Deep Red Cover & Pillows');
  }

  if (p.includes('cream') || p.includes('cream-colored') || p.includes('cream walls')) {
    config.wallColor = '#f4efe6';
    changes.push('Applied warm cream-colored plaster to walls');
    affectedComponents.push('Finishes: Cream Walls');
  }

  if (p.includes('wardrobe') || p.includes('closet')) {
    config.hasWardrobe = true;
    changes.push('Integrated minimalist 3-door wooden wardrobe');
    affectedComponents.push('Furniture: Wardrobe');
  }

  if (p.includes('curtain') || p.includes('curtains') || p.includes('large window') || p.includes('large windows')) {
    config.hasCurtains = true;
    config.hasWindows = true;
    changes.push('Added large panoramic windows with elegant layered curtains');
    affectedComponents.push('Openings: Windows & Curtains');
  }

  if (p.includes('ceiling light') || p.includes('ceiling lights') || p.includes('warm light') || p.includes('warm lights')) {
    config.hasCeilingLights = true;
    changes.push('Activated recessed warm LED ceiling spotlights');
    affectedComponents.push('Lighting: Warm Ceiling Downlights');
  }

  // 2. Detect Architectural Style
  if (p.includes('minimalist') || p.includes('minimal')) {
    config.style = 'Minimalist';
    changes.push('Style updated to Minimalist');
    affectedComponents.push('Architectural Style');
  } else if (p.includes('traditional') || p.includes('heritage') || p.includes('kerala') || p.includes('chettinad') || p.includes('haveli') || p.includes('colonial')) {
    config.style = 'Traditional';
    changes.push('Style updated to Traditional');
    affectedComponents.push('Architectural Style');
  } else if (p.includes('luxury') || p.includes('mansion') || p.includes('penthouse') || p.includes('palace')) {
    config.style = 'Luxury';
    changes.push('Style updated to Luxury');
    affectedComponents.push('Architectural Style');
  } else if (p.includes('mediterranean')) {
    config.style = 'Mediterranean';
    changes.push('Style updated to Mediterranean');
    affectedComponents.push('Architectural Style');
  } else if (p.includes('tropical')) {
    config.style = 'Tropical';
    changes.push('Style updated to Tropical');
    affectedComponents.push('Architectural Style');
  } else if (p.includes('modern') || p.includes('contemporary')) {
    config.style = 'Modern';
    changes.push('Style updated to Modern');
    affectedComponents.push('Architectural Style');
  }

  // 3. Detect Floor count
  if (p.includes('5 floors') || p.includes('five floors') || p.includes('5-storey') || p.includes('5 storey')) {
    config.floors = 5;
    config.dimensions.height = config.wallHeight * 5 + 1.2;
    changes.push('Increased building height to 5 floors');
    affectedComponents.push('Building Height / Floors');
  } else if (p.includes('four-storey') || p.includes('4 storey') || p.includes('4 floor') || p.includes('four floors')) {
    config.floors = 4;
    config.dimensions.height = config.wallHeight * 4 + 1.0;
    changes.push('Set floors to 4');
    affectedComponents.push('Building Height / Floors');
  } else if (p.includes('three-storey') || p.includes('three story') || p.includes('3 storey') || p.includes('3 floor') || p.includes('three floors') || p.includes('3 floors')) {
    config.floors = 3;
    config.dimensions.height = config.wallHeight * 3 + 0.8;
    changes.push('Set floors to 3');
    affectedComponents.push('Building Height / Floors');
  } else if (p.includes('two-storey') || p.includes('two story') || p.includes('2 storey') || p.includes('2 floor') || p.includes('two floors') || p.includes('2 floors')) {
    config.floors = 2;
    config.dimensions.height = config.wallHeight * 2 + 0.6;
    changes.push('Set floors to 2');
    affectedComponents.push('Building Height / Floors');
  } else if (p.includes('single-storey') || p.includes('single story') || p.includes('1 storey') || p.includes('1 floor') || p.includes('one storey') || p.includes('one floor')) {
    config.floors = 1;
    config.dimensions.height = config.wallHeight * 1 + 0.4;
    changes.push('Set floors to 1');
    affectedComponents.push('Building Height / Floors');
  }

  // 4. Roof Type Modifications
  if (p.includes('sloped roof') || p.includes('sloping roof') || p.includes('change the flat roof to a sloped roof') || p.includes('pitched roof') || p.includes('gabled') || p.includes('clay tile') || p.includes('terracotta roof')) {
    config.roofType = 'pitched';
    changes.push('Roof changed to Pitched / Sloped Structure');
    affectedComponents.push('Roof Geometry');
  } else if (p.includes('rooftop terrace') || p.includes('roof terrace') || p.includes('terrace') || p.includes('rooftop garden')) {
    config.roofType = 'roof_terrace';
    changes.push('Added Rooftop Terrace with Pergola & Glass Railing');
    affectedComponents.push('Roof Geometry');
  } else if (p.includes('flat roof') || p.includes('flat cantilever') || p.includes('change roof to flat') || p.includes('flat')) {
    config.roofType = 'flat';
    changes.push('Roof changed to Modern Flat Cantilever');
    affectedComponents.push('Roof Geometry');
  } else if (p.includes('mansard') || p.includes('dome')) {
    config.roofType = 'mansard';
    changes.push('Roof changed to Mansard / Classical');
    affectedComponents.push('Roof Geometry');
  }

  // 5. Exterior Material & Facade Modifications
  if (p.includes('modern facade') || p.includes('modern design') || p.includes('facade to a modern design') || p.includes('change the building facade to a modern design')) {
    config.exteriorMaterial = 'white_concrete';
    config.style = 'Modern Minimalist';
    config.windowType = 'panoramic_glass';
    if (!config.features.includes('wood_panels')) config.features.push('wood_panels');
    changes.push('Updated facade to modern minimalist design with panoramic glazing');
    affectedComponents.push('Facade & Materials');
  } else if (p.includes('white') || p.includes('white concrete') || p.includes('white wall') || p.includes('exterior wall color to white')) {
    config.exteriorMaterial = 'white_concrete';
    changes.push('Updated exterior walls to smooth architectural white concrete finish');
    affectedComponents.push('Wall Material / Color');
  } else if (p.includes('wooden panels') || p.includes('wood panels') || p.includes('wooden') || p.includes('wood panel') || p.includes('timber') || p.includes('cedar') || p.includes('wood')) {
    config.exteriorMaterial = 'wood_panel';
    if (!config.features.includes('wood_panels')) config.features.push('wood_panels');
    changes.push('Exterior material updated to Warm Architectural Wood Panels');
    affectedComponents.push('Wall Material');
  } else if (p.includes('brick') || p.includes('red brick')) {
    config.exteriorMaterial = 'brick';
    changes.push('Exterior material updated to Architectural Brick');
    affectedComponents.push('Wall Material');
  } else if (p.includes('glass') || p.includes('curtain wall') || p.includes('transparent')) {
    config.exteriorMaterial = 'glass';
    changes.push('Exterior material updated to Structural Architectural Glass');
    affectedComponents.push('Wall Material');
  } else if (p.includes('stone') || p.includes('limestone') || p.includes('sandstone') || p.includes('marble')) {
    config.exteriorMaterial = 'stone';
    changes.push('Exterior material updated to Natural Masonry Stone');
    affectedComponents.push('Wall Material');
  }

  // 6. Height adjustments
  if (p.includes('increase height') || p.includes('increase building height') || p.includes('taller')) {
    config.wallHeight = Math.min(5.0, config.wallHeight + 0.6);
    config.dimensions.height = config.wallHeight * config.floors + 0.4;
    changes.push(`Building wall height increased to ${config.wallHeight.toFixed(1)}m`);
    affectedComponents.push('Building Height');
  } else if (p.includes('decrease height') || p.includes('lower height') || p.includes('shorter')) {
    config.wallHeight = Math.max(2.4, config.wallHeight - 0.5);
    config.dimensions.height = config.wallHeight * config.floors + 0.4;
    changes.push(`Building wall height reduced to ${config.wallHeight.toFixed(1)}m`);
    affectedComponents.push('Building Height');
  }

  // 7. Width / Length adjustments
  if (p.includes('widen') || p.includes('increase width') || p.includes('wider')) {
    config.dimensions.width = Math.min(30, config.dimensions.width + 3);
    changes.push(`Building width expanded to ${config.dimensions.width}m`);
    affectedComponents.push('Floor Plan Dimensions');
  } else if (p.includes('longer') || p.includes('increase length')) {
    config.dimensions.length = Math.min(40, config.dimensions.length + 4);
    changes.push(`Building length expanded to ${config.dimensions.length}m`);
    affectedComponents.push('Floor Plan Dimensions');
  }

  // 8. Feature additions / removals
  if (!config.features) config.features = [];

  // Swimming Pool
  if (p.includes('add swimming pool') || p.includes('add a swimming pool') || p.includes('add pool') || (p.includes('swimming pool') && !config.features.includes('swimming_pool') && !p.includes('remove pool'))) {
    if (!config.features.includes('swimming_pool')) {
      config.features.push('swimming_pool');
      changes.push('Added outdoor swimming pool with water reflection');
      affectedComponents.push('Landscape: Swimming Pool');
    }
  } else if (p.includes('remove pool') || p.includes('remove swimming pool') || p.includes('delete pool')) {
    config.features = config.features.filter(f => f !== 'swimming_pool');
    changes.push('Removed swimming pool');
    affectedComponents.push('Landscape: Swimming Pool');
  }

  // Balcony
  if (p.includes('add balcony') || p.includes('add a balcony') || (p.includes('balcony') && !config.features.includes('balcony') && !p.includes('remove balcony'))) {
    if (!config.features.includes('balcony')) {
      config.features.push('balcony');
      changes.push('Added first-floor cantilevered balcony with glass railings');
      affectedComponents.push('Architecture: Balcony');
    }
  } else if (p.includes('remove balcony') || p.includes('delete balcony')) {
    config.features = config.features.filter(f => f !== 'balcony');
    changes.push('Removed balcony');
    affectedComponents.push('Architecture: Balcony');
  }

  // Landscaped Garden
  if (p.includes('add garden') || p.includes('add landscaped garden') || p.includes('landscaping') || (p.includes('garden') && !config.features.includes('landscaped_garden') && !p.includes('remove garden'))) {
    if (!config.features.includes('landscaped_garden')) {
      config.features.push('landscaped_garden');
      changes.push('Added landscaped perimeter garden with flora and lawn');
      affectedComponents.push('Landscape: Garden');
    }
  } else if (p.includes('remove garden') || p.includes('delete garden')) {
    config.features = config.features.filter(f => f !== 'landscaped_garden');
    changes.push('Removed garden');
    affectedComponents.push('Landscape: Garden');
  }

  // Carport / Parking area
  if (p.includes('add car parking') || p.includes('add parking') || p.includes('add garage') || p.includes('carport') || p.includes('car parking area')) {
    if (!config.features.includes('carport')) {
      config.features.push('carport');
      changes.push('Added architectural carport / vehicle bay');
      affectedComponents.push('Architecture: Carport');
    }
  } else if (p.includes('remove parking') || p.includes('remove carport') || p.includes('remove garage')) {
    config.features = config.features.filter(f => f !== 'carport');
    changes.push('Removed carport');
    affectedComponents.push('Architecture: Carport');
  }

  // Large glass windows
  if (p.includes('large glass windows') || p.includes('panoramic windows') || p.includes('add glass windows') || p.includes('more windows')) {
    config.windowType = 'panoramic_glass';
    // Regenerate generous windows
    config.windows = generateDefaultWindows(config);
    changes.push('Upgraded to large panoramic architectural glass windows');
    affectedComponents.push('Openings: Windows');
  }

  // Columns / Pillars
  if (p.includes('columns') || p.includes('pillars') || p.includes('carved pillars')) {
    if (!config.features.includes('columns')) {
      config.features.push('columns');
      changes.push('Added structural architectural columns');
      affectedComponents.push('Structure: Columns');
    }
  }

  // Stairs
  if (p.includes('stairs') || p.includes('staircase')) {
    if (!config.features.includes('stairs')) {
      config.features.push('stairs');
      changes.push('Added internal architectural staircase core');
      affectedComponents.push('Interior: Stairs');
    }
  }

  // If no specific match was detected but prompt has text
  if (changes.length === 0 && promptText.trim()) {
    changes.push(`Applied contextual refinement: "${promptText.trim().substring(0, 50)}..."`);
    affectedComponents.push('Architectural Parameters');
  }

  return {
    sceneConfig: config,
    changes,
    affectedComponents: Array.from(new Set(affectedComponents)),
    timestamp: new Date().toISOString()
  };
}

export function getDefaultSceneConfig() {
  return {
    buildingType: 'Residential',
    style: 'Modern Luxury',
    floors: 2,
    dimensions: {
      width: 14,
      length: 16,
      height: 6.8
    },
    wallHeight: 3.2,
    wallThickness: 0.25,
    roofType: 'flat',
    exteriorMaterial: 'white_concrete',
    windowType: 'panoramic_glass',
    features: ['swimming_pool', 'balcony', 'landscaped_garden', 'wood_panels'],
    roomType: 'exterior_villa',
    environment: {
      skyColor: '#14100c',
      sunPosition: [25, 40, 20],
      lightIntensity: 1.4
    }
  };
}

function generateDefaultWindows(config) {
  const { width, length } = config.dimensions;
  const halfLen = length / 2;
  const windows = [];
  const floors = config.floors || 2;
  const h = config.wallHeight || 3.2;

  for (let f = 0; f < floors; f++) {
    const y = f * h + 1.2;
    windows.push({ position: [-width * 0.28, y, halfLen], width: 2.4, height: 1.8, label: `Facade Glass F${f+1}-L` });
    windows.push({ position: [width * 0.28, y, halfLen], width: 2.4, height: 1.8, label: `Facade Glass F${f+1}-R` });
    // Side windows
    windows.push({ position: [width / 2, y, 0], width: 2.0, height: 1.8, rotation: [0, Math.PI / 2, 0], label: `Side Glass F${f+1}` });
  }
  return windows;
}
