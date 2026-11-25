// 60 Built-in Architectural Prompt Presets for ZUKE
// Exactly 6 categories x 10 presets each = 60 architectural designs

export const PRESET_CATEGORIES = [
  'Modern Residential',
  'Traditional & Cultural',
  'Luxury Architecture',
  'Commercial Architecture',
  'Interior Design',
  'Landscape & Special Structures',
];

export const PRESETS = [
  // ==========================================
  // CATEGORY 1: MODERN RESIDENTIAL (10)
  // ==========================================
  {
    id: 'p01',
    name: 'Modern Two-Storey Villa',
    category: 'Modern Residential',
    style: 'Modern',
    buildingType: 'Residential',
    prompt: 'Create a modern two-storey luxury villa with glass curtain walls, flat cantilevered roof, wooden exterior panels, outdoor swimming pool, landscaped garden, and a spacious first-floor balcony with glass railings.',
    params: {
      floors: 2,
      wallHeight: 3.2,
      roofType: 'flat',
      exteriorMaterial: 'wood_panel',
      windowType: 'panoramic_glass',
      features: ['swimming_pool', 'balcony', 'landscaped_garden'],
      dimensions: { width: 14, length: 18, height: 6.8 }
    },
    accentColor: '#3B82F6',
    iconName: 'Home'
  },
  {
    id: 'p02',
    name: 'Minimalist Single-Storey Home',
    category: 'Modern Residential',
    style: 'Minimalist',
    buildingType: 'Residential',
    prompt: 'Design a clean minimalist single-storey residence featuring smooth white concrete walls, floor-to-ceiling sliding glass doors, zen gravel courtyard, recessed warm LED lighting, and an integrated open carport.',
    params: {
      floors: 1,
      wallHeight: 3.4,
      roofType: 'flat',
      exteriorMaterial: 'white_concrete',
      windowType: 'floor_to_ceiling',
      features: ['carport', 'zen_courtyard'],
      dimensions: { width: 12, length: 15, height: 3.6 }
    },
    accentColor: '#6B7280',
    iconName: 'Maximize2'
  },
  {
    id: 'p03',
    name: 'Luxury Glass House',
    category: 'Modern Residential',
    style: 'Contemporary',
    buildingType: 'Residential',
    prompt: 'Generate an iconic luxury glass house with steel frame structural columns, 360-degree transparent facade, polished limestone flooring, floating wooden stairs, and panoramic surrounding forest views.',
    params: {
      floors: 2,
      wallHeight: 3.5,
      roofType: 'flat_overhang',
      exteriorMaterial: 'glass',
      windowType: 'curtain_wall',
      features: ['floating_stairs', 'steel_columns', 'perimeter_deck'],
      dimensions: { width: 16, length: 16, height: 7.2 }
    },
    accentColor: '#06B6D4',
    iconName: 'Box'
  },
  {
    id: 'p04',
    name: 'Contemporary Family Residence',
    category: 'Modern Residential',
    style: 'Contemporary',
    buildingType: 'Residential',
    prompt: 'Construct a contemporary two-storey family residence with asymmetric cubic volumes, textured dark brick accents, charcoal window frames, upper deck terrace, double garage, and a child-friendly rear lawn.',
    params: {
      floors: 2,
      wallHeight: 3.0,
      roofType: 'mixed_flat',
      exteriorMaterial: 'brick_accent',
      windowType: 'casement',
      features: ['double_garage', 'rear_lawn', 'upper_terrace'],
      dimensions: { width: 13, length: 16, height: 6.4 }
    },
    accentColor: '#F59E0B',
    iconName: 'Users'
  },
  {
    id: 'p05',
    name: 'Modern Tropical Villa',
    category: 'Modern Residential',
    style: 'Tropical',
    buildingType: 'Residential',
    prompt: 'Design a modern tropical villa featuring wide timber louvered screens, sloping clay tile hip roof, infinity lap pool with submerged daybeds, lush palm landscaping, and open-air pavilion living spaces.',
    params: {
      floors: 1,
      wallHeight: 3.6,
      roofType: 'sloped_hip',
      exteriorMaterial: 'timber_and_stone',
      windowType: 'louvered',
      features: ['infinity_pool', 'palm_garden', 'outdoor_pavilion'],
      dimensions: { width: 15, length: 20, height: 5.2 }
    },
    accentColor: '#10B981',
    iconName: 'Sun'
  },
  {
    id: 'p06',
    name: 'Urban Compact House',
    category: 'Modern Residential',
    style: 'Modern',
    buildingType: 'Residential',
    prompt: 'Build a space-efficient three-storey urban narrow-lot house with vertical wood slatted facade, perforated metal privacy panels, internal lightwell atrium, rooftop green terrace, and ground level micro-garage.',
    params: {
      floors: 3,
      wallHeight: 2.9,
      roofType: 'roof_terrace',
      exteriorMaterial: 'vertical_slats',
      windowType: 'ribbon_window',
      features: ['lightwell_atrium', 'roof_terrace', 'micro_garage'],
      dimensions: { width: 6, length: 12, height: 9.0 }
    },
    accentColor: '#8B5CF6',
    iconName: 'LayoutGrid'
  },
  {
    id: 'p07',
    name: 'Modern Courtyard House',
    category: 'Modern Residential',
    style: 'Modern',
    buildingType: 'Residential',
    prompt: 'Create a modern single-storey home organized around a central open-air atrium courtyard with a mature olive tree, water feature, sliding glass walls on all four inward sides, and polished concrete floors.',
    params: {
      floors: 1,
      wallHeight: 3.2,
      roofType: 'flat',
      exteriorMaterial: 'smooth_stucco',
      windowType: 'sliding_atrium',
      features: ['central_courtyard', 'water_feature', 'tree_atrium'],
      dimensions: { width: 16, length: 16, height: 3.5 }
    },
    accentColor: '#14B8A6',
    iconName: 'Square'
  },
  {
    id: 'p08',
    name: 'Sustainable Residential Home',
    category: 'Modern Residential',
    style: 'Sustainable',
    buildingType: 'Residential',
    prompt: 'Generate an eco-friendly sustainable home with integrated angled solar photovoltaic roof panels, rainwater harvesting cisterns, rammed earth exterior walls, triple-glazed windows, and natural cross-ventilation fins.',
    params: {
      floors: 2,
      wallHeight: 3.0,
      roofType: 'solar_angled',
      exteriorMaterial: 'rammed_earth',
      windowType: 'triple_glazed',
      features: ['solar_panels', 'rainwater_system', 'ventilation_fins'],
      dimensions: { width: 12, length: 14, height: 6.5 }
    },
    accentColor: '#84CC16',
    iconName: 'Feather'
  },
  {
    id: 'p09',
    name: 'Luxury Rooftop Residence',
    category: 'Modern Residential',
    style: 'Luxury',
    buildingType: 'Residential',
    prompt: 'Design a top-tier penthouse rooftop residence with glass enclosure pavilion, perimeter wraparound sun deck, heated jacuzzi plunge pool, outdoor firepit lounge, and uninterrupted skyline views.',
    params: {
      floors: 1,
      wallHeight: 3.4,
      roofType: 'cantilever_pergola',
      exteriorMaterial: 'composite_glass',
      windowType: 'frameless_glass',
      features: ['jacuzzi', 'firepit_lounge', 'wraparound_deck'],
      dimensions: { width: 18, length: 14, height: 3.8 }
    },
    accentColor: '#F43F5E',
    iconName: 'Compass'
  },
  {
    id: 'p10',
    name: 'Modern Hillside Villa',
    category: 'Modern Residential',
    style: 'Modern',
    buildingType: 'Residential',
    prompt: 'Construct a tiered modern hillside villa stepped across three cascading levels, anchored by exposed board-marked concrete foundation walls, cantilevered viewing decks, and an infinity pool projecting over the slope.',
    params: {
      floors: 3,
      wallHeight: 3.1,
      roofType: 'stepped_flat',
      exteriorMaterial: 'board_marked_concrete',
      windowType: 'full_height_view',
      features: ['cantilevered_deck', 'stepped_levels', 'projecting_pool'],
      dimensions: { width: 15, length: 18, height: 9.8 }
    },
    accentColor: '#EC4899',
    iconName: 'TrendingUp'
  },

  // ==========================================
  // CATEGORY 2: TRADITIONAL AND CULTURAL (10)
  // ==========================================
  {
    id: 'p11',
    name: 'Traditional Indian Courtyard House',
    category: 'Traditional & Cultural',
    style: 'Traditional',
    buildingType: 'Residential',
    prompt: 'Design a traditional Indian Haveli courtyard house featuring carved teakwood pillars, central Tulsi courtyard with stone pavers, terracotta sloping roof tiles, jali lattice stone screens, and ornamental brass accents.',
    params: {
      floors: 2,
      wallHeight: 3.3,
      roofType: 'terracotta_pitched',
      exteriorMaterial: 'sandstone_and_lime',
      windowType: 'jali_screens',
      features: ['central_courtyard', 'carved_pillars', 'brass_accents'],
      dimensions: { width: 15, length: 15, height: 7.0 }
    },
    accentColor: '#D97706',
    iconName: 'Columns'
  },
  {
    id: 'p12',
    name: 'South Indian Heritage Home',
    category: 'Traditional & Cultural',
    style: 'Traditional',
    buildingType: 'Residential',
    prompt: 'Create a heritage Chettinad-inspired South Indian home with grand Athangudi tiled verandas, Burmese teak wood columns, inner thinnai sitting platform, ornate double wooden doorway, and brass oil lamp niches.',
    params: {
      floors: 1,
      wallHeight: 3.6,
      roofType: 'pitched_clay_tiles',
      exteriorMaterial: 'brick_lime_plaster',
      windowType: 'wooden_barred',
      features: ['veranda_thinnai', 'teak_columns', 'ornate_entryway'],
      dimensions: { width: 16, length: 18, height: 5.5 }
    },
    accentColor: '#B45309',
    iconName: 'Shield'
  },
  {
    id: 'p13',
    name: 'Traditional Kerala-Style House',
    category: 'Traditional & Cultural',
    style: 'Traditional',
    buildingType: 'Residential',
    prompt: 'Construct an authentic Kerala Nalukettu traditional house with steep pitched gables, red Mangalore roof tiles, exposed laterite stone masonry, Nadumuttam open rain courtyard, and carved wooden charupadi railings.',
    params: {
      floors: 2,
      wallHeight: 3.0,
      roofType: 'kerala_gabled_steep',
      exteriorMaterial: 'laterite_stone',
      windowType: 'wooden_slat_windows',
      features: ['nadumuttam_courtyard', 'charupadi_benches', 'steep_gables'],
      dimensions: { width: 14, length: 16, height: 6.8 }
    },
    accentColor: '#92400E',
    iconName: 'Home'
  },
  {
    id: 'p14',
    name: 'Tamil Nadu-Inspired Residence',
    category: 'Traditional & Cultural',
    style: 'Traditional',
    buildingType: 'Residential',
    prompt: 'Model a Tamil Nadu vernacular residence featuring an open front Thinnai porch, terracotta pot tile roof, carved granite pillars, mud-plastered warm ochre walls, brass knocker timber doors, and sacred geometric kolam court.',
    params: {
      floors: 1,
      wallHeight: 3.2,
      roofType: 'terracotta_sloped',
      exteriorMaterial: 'ochre_plaster',
      windowType: 'carved_timber',
      features: ['thinnai_porch', 'granite_pillars', 'kolam_court'],
      dimensions: { width: 13, length: 15, height: 4.8 }
    },
    accentColor: '#C2410C',
    iconName: 'Maximize'
  },
  {
    id: 'p15',
    name: 'Colonial-Style Bungalow',
    category: 'Traditional & Cultural',
    style: 'Colonial',
    buildingType: 'Residential',
    prompt: 'Design a grand colonial-style bungalow with high 4-meter ceilings, wraparound covered verandah supported by classical Tuscan columns, louvered green shutters, manicured hedge gardens, and a pitched slate roof.',
    params: {
      floors: 1,
      wallHeight: 4.0,
      roofType: 'pitched_slate',
      exteriorMaterial: 'whitewashed_brick',
      windowType: 'louvered_shutter',
      features: ['wraparound_verandah', 'tuscan_columns', 'hedge_gardens'],
      dimensions: { width: 20, length: 22, height: 6.0 }
    },
    accentColor: '#047857',
    iconName: 'Grid'
  },
  {
    id: 'p16',
    name: 'Mediterranean Villa',
    category: 'Traditional & Cultural',
    style: 'Mediterranean',
    buildingType: 'Residential',
    prompt: 'Build a romantic Mediterranean coastal villa featuring stucco off-white curved walls, terracotta barrel tile roofing, arched stone doorways, wrought iron Juliet balconies, bougainvillea pergolas, and terra cotta tiled patio.',
    params: {
      floors: 2,
      wallHeight: 3.2,
      roofType: 'terracotta_barrel',
      exteriorMaterial: 'warm_stucco',
      windowType: 'arched_divided_lite',
      features: ['arched_doorways', 'juliet_balconies', 'bougainvillea_pergola'],
      dimensions: { width: 14, length: 16, height: 6.6 }
    },
    accentColor: '#EA580C',
    iconName: 'Compass'
  },
  {
    id: 'p17',
    name: 'Japanese Minimalist House',
    category: 'Traditional & Cultural',
    style: 'Japanese',
    buildingType: 'Residential',
    prompt: 'Generate an authentic Japanese minimalist residence with light Hinoki cedar wood framing, sliding Shoji paper screens, tatami floor modules, Genkan recessed stone entry, and an Engawa perimeter wooden veranda overlooking a karesansui dry garden.',
    params: {
      floors: 1,
      wallHeight: 2.8,
      roofType: 'gentle_slope_irimoja',
      exteriorMaterial: 'cedar_timber',
      windowType: 'shoji_sliding',
      features: ['engawa_deck', 'karesansui_zen_garden', 'genkan_entry'],
      dimensions: { width: 12, length: 14, height: 4.2 }
    },
    accentColor: '#78716C',
    iconName: 'Minus'
  },
  {
    id: 'p18',
    name: 'Traditional Wooden Residence',
    category: 'Traditional & Cultural',
    style: 'Rustic',
    buildingType: 'Residential',
    prompt: 'Design an alpine-inspired traditional timber home constructed with interlocking solid fir logs, exposed post-and-beam joinery, a wide steep snow-shedding pitched roof, stone chimney hearth, and a covered timber porch.',
    params: {
      floors: 2,
      wallHeight: 2.9,
      roofType: 'steep_alpine_pitch',
      exteriorMaterial: 'solid_timber_logs',
      windowType: 'timber_mullion',
      features: ['stone_chimney', 'covered_timber_porch', 'log_joinery'],
      dimensions: { width: 12, length: 14, height: 7.2 }
    },
    accentColor: '#854D0E',
    iconName: 'Folder'
  },
  {
    id: 'p19',
    name: 'Rustic Countryside Farmhouse',
    category: 'Traditional & Cultural',
    style: 'Farmhouse',
    buildingType: 'Residential',
    prompt: 'Create a charming modern farmhouse with board-and-batten white siding, standing seam black metal gable roof, expansive front porch with rocking chairs, reclaimed red brick foundation, and oversized barn-style sliding doors.',
    params: {
      floors: 2,
      wallHeight: 3.1,
      roofType: 'black_metal_gable',
      exteriorMaterial: 'white_board_batten',
      windowType: 'double_hung_black_frame',
      features: ['front_porch', 'sliding_barn_door', 'brick_foundation'],
      dimensions: { width: 13, length: 17, height: 6.8 }
    },
    accentColor: '#475569',
    iconName: 'Layers'
  },
  {
    id: 'p20',
    name: 'Traditional Stone House',
    category: 'Traditional & Cultural',
    style: 'Traditional',
    buildingType: 'Residential',
    prompt: 'Model a rugged traditional stone masonry cottage built from dry-stacked natural limestone blocks, deep-set small recessed windows, heavy slate shingle roof, arched timber entryway, and an English cottage flower perimeter.',
    params: {
      floors: 2,
      wallHeight: 2.9,
      roofType: 'heavy_slate_gable',
      exteriorMaterial: 'stacked_limestone',
      windowType: 'deep_recessed',
      features: ['limestone_masonry', 'arched_timber_door', 'flower_perimeter'],
      dimensions: { width: 11, length: 14, height: 6.4 }
    },
    accentColor: '#52525B',
    iconName: 'Server'
  },

  // ==========================================
  // CATEGORY 3: LUXURY ARCHITECTURE (10)
  // ==========================================
  {
    id: 'p21',
    name: 'Luxury Mansion',
    category: 'Luxury Architecture',
    style: 'Luxury',
    buildingType: 'Residential',
    prompt: 'Generate an elite neoclassical luxury mansion with symmetrical grand dual staircases, fluted Corinthian columns, central rotunda dome, double-height entrance foyer, four-car motor court, and manicured water fountain.',
    params: {
      floors: 3,
      wallHeight: 3.8,
      roofType: 'rotunda_dome_mansard',
      exteriorMaterial: 'polished_marble',
      windowType: 'tall_classical_arched',
      features: ['motor_court_fountain', 'fluted_columns', 'grand_rotunda'],
      dimensions: { width: 22, length: 26, height: 12.5 }
    },
    accentColor: '#EAB308',
    iconName: 'Award'
  },
  {
    id: 'p22',
    name: 'Modern Luxury Beachfront Villa',
    category: 'Luxury Architecture',
    style: 'Luxury Modern',
    buildingType: 'Residential',
    prompt: 'Design an ultra-luxury beachfront villa with white cantilevered floor plates, glass-bottom cantilevered pool extending over sandy dunes, outdoor champagne bar, automated motorized glass curtains, and private teak boardwalk to the ocean.',
    params: {
      floors: 2,
      wallHeight: 3.6,
      roofType: 'cantilever_flat',
      exteriorMaterial: 'ultra_white_concrete',
      windowType: 'motorized_glass_wall',
      features: ['glass_bottom_pool', 'teak_boardwalk', 'champagne_bar'],
      dimensions: { width: 16, length: 22, height: 7.8 }
    },
    accentColor: '#0284C7',
    iconName: 'Anchor'
  },
  {
    id: 'p23',
    name: 'Luxury Penthouse',
    category: 'Luxury Architecture',
    style: 'Luxury Contemporary',
    buildingType: 'Residential',
    prompt: 'Build a double-height luxury skyscraper penthouse with 7-meter soaring ceilings, bookmatched Calacatta marble fireplace wall, sculptural spiral glass staircase, infinity edge sky spa, and automated smart louvers.',
    params: {
      floors: 2,
      wallHeight: 3.6,
      roofType: 'glass_skylight_ceiling',
      exteriorMaterial: 'glass_and_titanium',
      windowType: 'structural_curtain_wall',
      features: ['spiral_glass_stairs', 'sky_spa', 'marble_fireplace'],
      dimensions: { width: 18, length: 18, height: 7.6 }
    },
    accentColor: '#6366F1',
    iconName: 'Cloud'
  },
  {
    id: 'p24',
    name: 'Luxury Mountain Retreat',
    category: 'Luxury Architecture',
    style: 'Luxury Alpine',
    buildingType: 'Residential',
    prompt: 'Construct a premier luxury mountain chalet blending dark charred Shou Sugi Ban wood, heavy granite monolith piers, heated outdoor hydrotherapy pool with fire beacons, glass wine cellar tower, and panoramic snow peak vistas.',
    params: {
      floors: 2,
      wallHeight: 3.4,
      roofType: 'asymmetrical_mono_pitch',
      exteriorMaterial: 'shou_sugi_ban_and_granite',
      windowType: 'panoramic_thermally_broken',
      features: ['hydrotherapy_pool', 'wine_cellar_tower', 'fire_beacons'],
      dimensions: { width: 16, length: 20, height: 7.5 }
    },
    accentColor: '#475569',
    iconName: 'Mountain'
  },
  {
    id: 'p25',
    name: 'Premium Glass Mansion',
    category: 'Luxury Architecture',
    style: 'Minimalist Luxury',
    buildingType: 'Residential',
    prompt: 'Design a minimalist glass mansion built on floating mirrored pedestals, surrounded by reflective water moats, featuring 10-meter seamless glass panes, internal tropical courtyard oasis, and subterranean supercar gallery showroom.',
    params: {
      floors: 2,
      wallHeight: 3.8,
      roofType: 'thin_blade_cantilever',
      exteriorMaterial: 'optical_white_glass',
      windowType: 'seamless_frameless',
      features: ['reflective_moat', 'supercar_gallery', 'tropical_oasis'],
      dimensions: { width: 20, length: 24, height: 8.2 }
    },
    accentColor: '#38BDF8',
    iconName: 'Eye'
  },
  {
    id: 'p26',
    name: 'Luxury Duplex Residence',
    category: 'Luxury Architecture',
    style: 'Contemporary Luxury',
    buildingType: 'Residential',
    prompt: 'Generate an executive luxury duplex residence featuring double-height corner glass cube, floating illuminated walnut stairs, bespoke bronze privacy louvers, private elevator core, and dual master suites with garden terraces.',
    params: {
      floors: 2,
      wallHeight: 3.3,
      roofType: 'flat_green_roof',
      exteriorMaterial: 'bronze_and_limestone',
      windowType: 'corner_glass_cube',
      features: ['corner_glass_cube', 'illuminated_stairs', 'private_elevator'],
      dimensions: { width: 14, length: 16, height: 7.0 }
    },
    accentColor: '#D97706',
    iconName: 'Copy'
  },
  {
    id: 'p27',
    name: 'Contemporary Palace-Inspired Home',
    category: 'Luxury Architecture',
    style: 'Modern Royal',
    buildingType: 'Residential',
    prompt: 'Create a contemporary palatial residence with expansive colonnaded porticos, monumental 5-meter pivot front door, geometric mirrored pools, gold leaf architectural trim, and royal courtyard with illuminated marble fountains.',
    params: {
      floors: 2,
      wallHeight: 4.2,
      roofType: 'sculptural_flat_canopy',
      exteriorMaterial: 'travertine_stone',
      windowType: 'tall_monumental',
      features: ['pivot_door', 'mirrored_pools', 'marble_fountains'],
      dimensions: { width: 24, length: 30, height: 9.0 }
    },
    accentColor: '#CA8A04',
    iconName: 'Crown'
  },
  {
    id: 'p28',
    name: 'Luxury Swimming Pool Villa',
    category: 'Luxury Architecture',
    style: 'Modern Resort',
    buildingType: 'Residential',
    prompt: 'Build a resort-grade luxury villa wrapped around an extensive 25-meter infinity pool, featuring sunken underwater lounge with glass viewports, swim-up cocktail bar, floating stepping stones, and integrated jacuzzi cascades.',
    params: {
      floors: 2,
      wallHeight: 3.2,
      roofType: 'cantilevered_floating',
      exteriorMaterial: 'white_teak_combo',
      windowType: 'retractable_glass',
      features: ['sunken_pool_lounge', 'swim_up_bar', 'floating_stones'],
      dimensions: { width: 18, length: 22, height: 6.8 }
    },
    accentColor: '#0EA5E9',
    iconName: 'Droplet'
  },
  {
    id: 'p29',
    name: 'Modern Estate Residence',
    category: 'Luxury Architecture',
    style: 'Modern Estate',
    buildingType: 'Residential',
    prompt: 'Design a private gated modern country estate comprising main residence and guest pavilion wings, connecting glass gallery bridge, tennis court, helipad lawn, wine vineyard terraces, and extensive stone perimeter fencing.',
    params: {
      floors: 2,
      wallHeight: 3.4,
      roofType: 'low_slope_zinc',
      exteriorMaterial: 'natural_fieldstone',
      windowType: 'steel_frame_divided',
      features: ['guest_wing', 'glass_bridge', 'tennis_court'],
      dimensions: { width: 22, length: 28, height: 7.4 }
    },
    accentColor: '#15803D',
    iconName: 'Map'
  },
  {
    id: 'p30',
    name: 'Luxury Smart Home',
    category: 'Luxury Architecture',
    style: 'High-Tech Modern',
    buildingType: 'Residential',
    prompt: 'Construct a futuristic luxury smart home with electrochromic dynamic tinting glass, automated robotic louvers, integrated rooftop weather dome, induction charging driveway, LED accent facade veins, and biometric entry portals.',
    params: {
      floors: 2,
      wallHeight: 3.5,
      roofType: 'aerodynamic_monolith',
      exteriorMaterial: 'matte_composite_carbon',
      windowType: 'electrochromic_smart',
      features: ['smart_louvers', 'charging_driveway', 'facade_light_veins'],
      dimensions: { width: 15, length: 18, height: 7.4 }
    },
    accentColor: '#A855F7',
    iconName: 'Cpu'
  },

  // ==========================================
  // CATEGORY 4: COMMERCIAL ARCHITECTURE (10)
  // ==========================================
  {
    id: 'p31',
    name: 'Modern Office Building',
    category: 'Commercial Architecture',
    style: 'Commercial Modern',
    buildingType: 'Commercial',
    prompt: 'Design a state-of-the-art 4-storey commercial office building with high-performance double-skin glass facade, solar shading vertical louvers, landscaped sky gardens on alternating floors, and double-height corporate reception atrium.',
    params: {
      floors: 4,
      wallHeight: 3.6,
      roofType: 'commercial_flat_mep',
      exteriorMaterial: 'double_skin_curtain_wall',
      windowType: 'low_e_tinted',
      features: ['sky_gardens', 'solar_louvers', 'reception_atrium'],
      dimensions: { width: 24, length: 30, height: 15.2 }
    },
    accentColor: '#2563EB',
    iconName: 'Briefcase'
  },
  {
    id: 'p32',
    name: 'Corporate Headquarters',
    category: 'Commercial Architecture',
    style: 'Iconic Corporate',
    buildingType: 'Commercial',
    prompt: 'Build an iconic 6-storey corporate headquarters building with parametric diagrid structural steel exoskeleton, cantilevering executive boardroom pod, central sunlight atrium, and landscaped public plaza with water cascades.',
    params: {
      floors: 6,
      wallHeight: 3.8,
      roofType: 'rooftop_helipad_deck',
      exteriorMaterial: 'steel_diagrid_glass',
      windowType: 'structural_diagrid',
      features: ['cantilevered_boardroom', 'plaza_cascades', 'diagrid_exoskeleton'],
      dimensions: { width: 28, length: 36, height: 24.0 }
    },
    accentColor: '#1D4ED8',
    iconName: 'Building2'
  },
  {
    id: 'p33',
    name: 'Shopping Mall',
    category: 'Commercial Architecture',
    style: 'Retail Architecture',
    buildingType: 'Commercial',
    prompt: 'Generate an open-concept lifestyle shopping mall with barrel-vaulted tensile glass atrium roof, curved multi-tier shopping gallerias, indoor botanical promenade, central event arena, and food hall outdoor terraces.',
    params: {
      floors: 3,
      wallHeight: 4.5,
      roofType: 'barrel_vault_skylight',
      exteriorMaterial: 'perforated_copper_panels',
      windowType: 'retail_display_glass',
      features: ['curved_gallerias', 'botanical_promenade', 'event_arena'],
      dimensions: { width: 35, length: 45, height: 14.5 }
    },
    accentColor: '#F97316',
    iconName: 'ShoppingBag'
  },
  {
    id: 'p34',
    name: 'Luxury Hotel',
    category: 'Commercial Architecture',
    style: 'Hospitality Luxury',
    buildingType: 'Commercial',
    prompt: 'Design a 5-star luxury boutique hotel with stepped landscaped balconies on each guest room, grand curved porte-cochère driveway, top-floor infinity sky pool, glass scenic elevator cores, and rooftop cocktail lounge.',
    params: {
      floors: 5,
      wallHeight: 3.5,
      roofType: 'hotel_sky_lounge_deck',
      exteriorMaterial: 'natural_travertine_glass',
      windowType: 'balcony_sliding_suites',
      features: ['porte_cochere', 'sky_pool', 'scenic_elevators'],
      dimensions: { width: 26, length: 38, height: 18.5 }
    },
    accentColor: '#E11D48',
    iconName: 'Hotel'
  },
  {
    id: 'p35',
    name: 'Modern Restaurant',
    category: 'Commercial Architecture',
    style: 'Hospitality Modern',
    buildingType: 'Commercial',
    prompt: 'Create a destination fine-dining restaurant featuring exposed steel timber portal frames, glass wine tasting cube, open theatrical exhibition kitchen, outdoor dining patio covered by bioclimatic pergola, and water canal borders.',
    params: {
      floors: 1,
      wallHeight: 4.2,
      roofType: 'butterfly_sloped_roof',
      exteriorMaterial: 'charred_wood_and_glass',
      windowType: 'crittall_steel_windows',
      features: ['exhibition_kitchen', 'pergola_patio', 'wine_cube'],
      dimensions: { width: 16, length: 22, height: 5.4 }
    },
    accentColor: '#D97706',
    iconName: 'Coffee'
  },
  {
    id: 'p36',
    name: 'Contemporary Cafe',
    category: 'Commercial Architecture',
    style: 'Industrial Contemporary',
    buildingType: 'Commercial',
    prompt: 'Model a hip contemporary cafe with expansive fold-up bifold industrial garage doors, polished terrazzo counter with brass inlays, indoor mezzanine study loft, exposed black ductwork, and sunlit planter boxes.',
    params: {
      floors: 2,
      wallHeight: 3.2,
      roofType: 'flat_with_skylights',
      exteriorMaterial: 'exposed_brick_and_steel',
      windowType: 'industrial_bifold',
      features: ['mezzanine_loft', 'terrazzo_counter', 'street_bifold_doors'],
      dimensions: { width: 10, length: 14, height: 6.2 }
    },
    accentColor: '#B45309',
    iconName: 'CupSoda'
  },
  {
    id: 'p37',
    name: 'Educational Institution',
    category: 'Commercial Architecture',
    style: 'Institutional Modern',
    buildingType: 'Commercial',
    prompt: 'Design a modern university learning center featuring wide collaborative stepped amphitheater seating, central glass library cube, solar shading terracotta louvers, open outdoor courtyards, and accessible green rooftop study spaces.',
    params: {
      floors: 3,
      wallHeight: 3.8,
      roofType: 'accessible_green_roof',
      exteriorMaterial: 'terracotta_baguette_screens',
      windowType: 'vertical_strip_glazing',
      features: ['stepped_amphitheater', 'glass_library_cube', 'outdoor_courtyards'],
      dimensions: { width: 30, length: 40, height: 12.0 }
    },
    accentColor: '#059669',
    iconName: 'BookOpen'
  },
  {
    id: 'p38',
    name: 'Modern Hospital',
    category: 'Commercial Architecture',
    style: 'Healthcare Modern',
    buildingType: 'Commercial',
    prompt: 'Build an advanced 4-storey hospital medical complex with clean antimicrobial white ceramic panels, separate emergency ambulance bay canopy, biophilic healing atrium with vertical plant walls, and top-tier clinical pods.',
    params: {
      floors: 4,
      wallHeight: 3.8,
      roofType: 'hospital_helipad_flat',
      exteriorMaterial: 'antimicrobial_white_panels',
      windowType: 'sealed_continuous_ribbon',
      features: ['healing_biophilic_atrium', 'ambulance_bay_canopy', 'green_terrace'],
      dimensions: { width: 32, length: 44, height: 16.0 }
    },
    accentColor: '#0284C7',
    iconName: 'Crosshair'
  },
  {
    id: 'p39',
    name: 'Commercial Showroom',
    category: 'Commercial Architecture',
    style: 'Commercial Modern',
    buildingType: 'Commercial',
    prompt: 'Create a premier automobile and design showroom with 8-meter column-free span, full-height anti-reflective glass curtain walls, revolving spotlight exhibition turntables, clean white polished epoxy floors, and VIP lounge mezzanine.',
    params: {
      floors: 2,
      wallHeight: 4.5,
      roofType: 'aerodynamic_curved_metal',
      exteriorMaterial: 'frameless_structural_glass',
      windowType: 'seamless_super_span',
      features: ['revolving_turntables', 'mezzanine_lounge', 'column_free_span'],
      dimensions: { width: 20, length: 28, height: 8.8 }
    },
    accentColor: '#475569',
    iconName: 'Tv'
  },
  {
    id: 'p40',
    name: 'Coworking Office Space',
    category: 'Commercial Architecture',
    style: 'Commercial Modern',
    buildingType: 'Commercial',
    prompt: 'Design a dynamic 3-storey coworking campus with flexible modular phone booths, central communal bleacher staircase, barista espresso bar, acoustic felt wall baffles, glass conference pods, and outdoor hot-desk terrace.',
    params: {
      floors: 3,
      wallHeight: 3.4,
      roofType: 'rooftop_event_deck',
      exteriorMaterial: 'timber_composite_and_glass',
      windowType: 'large_grid_mullion',
      features: ['bleacher_staircase', 'acoustic_pods', 'espresso_communal_bar'],
      dimensions: { width: 22, length: 26, height: 10.8 }
    },
    accentColor: '#8B5CF6',
    iconName: 'Users2'
  },

  // ==========================================
  // CATEGORY 5: INTERIOR DESIGN (10)
  // ==========================================
  {
    id: 'p41',
    name: 'Modern Luxury Living Room',
    category: 'Interior Design',
    style: 'Luxury Interior',
    buildingType: 'Interior',
    prompt: 'Design a sophisticated open luxury living room with double-height ceiling, bookmatched Statuario marble slab fireplace, low-profile modular velvet sectional sofa, sculptural brass chandelier, and motorized sheer curtains.',
    params: {
      floors: 1,
      wallHeight: 4.5,
      roofType: 'coffered_indirect_led',
      exteriorMaterial: 'interior_wood_and_marble',
      windowType: 'double_height_curtain_wall',
      features: ['marble_fireplace', 'sculptural_chandelier', 'velvet_sectional'],
      dimensions: { width: 8, length: 12, height: 4.5 }
    },
    accentColor: '#D97706',
    iconName: 'Tv'
  },
  {
    id: 'p42',
    name: 'Minimalist Bedroom',
    category: 'Interior Design',
    style: 'Minimalist Interior',
    buildingType: 'Interior',
    prompt: 'Create a serene minimalist bedroom with low platform oak wood bed, concealed perimeter cove lighting, soft lime-washed walls, floating nightstands, floor-to-ceiling flush acoustic wardrobe doors, and sheer linen drapery.',
    params: {
      floors: 1,
      wallHeight: 3.0,
      roofType: 'flat_cove_lit',
      exteriorMaterial: 'lime_wash_plaster',
      windowType: 'ribbon_garden_view',
      features: ['low_platform_bed', 'cove_lighting', 'flush_wardrobes'],
      dimensions: { width: 5, length: 6, height: 3.0 }
    },
    accentColor: '#78716C',
    iconName: 'Moon'
  },
  {
    id: 'p43',
    name: 'Luxury Master Bedroom Suite',
    category: 'Interior Design',
    style: 'Luxury Interior',
    buildingType: 'Interior',
    prompt: 'Model a palatial master bedroom suite with king-size leather upholstered headboard wall, private lounge seating area with gas fireplace, walk-through dressing room with smoked glass cabinetry, and en-suite view.',
    params: {
      floors: 1,
      wallHeight: 3.4,
      roofType: 'recessed_tray_ceiling',
      exteriorMaterial: 'fabric_paneling_and_brass',
      windowType: 'panoramic_sliding_balcony',
      features: ['gas_fireplace', 'dressing_room', 'lounge_seating'],
      dimensions: { width: 7, length: 9, height: 3.4 }
    },
    accentColor: '#C026D3',
    iconName: 'Star'
  },
  {
    id: 'p44',
    name: 'Contemporary Kitchen',
    category: 'Interior Design',
    style: 'Contemporary Interior',
    buildingType: 'Interior',
    prompt: 'Design a sleek contemporary kitchen with 3.5-meter waterfall quartz island, matte black handleless cabinetry, integrated induction cooktop with downdraft extractor, fluted glass pantry, and LED under-cabinet illumination.',
    params: {
      floors: 1,
      wallHeight: 3.2,
      roofType: 'flat_flush_mount',
      exteriorMaterial: 'matte_laminate_and_quartz',
      windowType: 'splashback_window',
      features: ['waterfall_quartz_island', 'handleless_cabinets', 'fluted_glass_pantry'],
      dimensions: { width: 6, length: 7, height: 3.2 }
    },
    accentColor: '#475569',
    iconName: 'Utensils'
  },
  {
    id: 'p45',
    name: 'Modern Bathroom Spa',
    category: 'Interior Design',
    style: 'Spa Minimalist',
    buildingType: 'Interior',
    prompt: 'Generate a tranquil master bathroom spa featuring freestanding oval stone soaking tub, walk-in curbless rain shower with slate tiles, floating twin oak vanities, backlit circular mirrors, and indoor river stone plant bed.',
    params: {
      floors: 1,
      wallHeight: 3.0,
      roofType: 'flat_waterproof',
      exteriorMaterial: 'large_format_porcelain_slate',
      windowType: 'frosted_high_clerestory',
      features: ['freestanding_soaking_tub', 'curbless_rain_shower', 'backlit_mirrors'],
      dimensions: { width: 4.5, length: 5.5, height: 3.0 }
    },
    accentColor: '#0D9488',
    iconName: 'Sparkles'
  },
  {
    id: 'p46',
    name: 'Open-Plan Living and Dining',
    category: 'Interior Design',
    style: 'Contemporary Open',
    buildingType: 'Interior',
    prompt: 'Construct a flowing open-plan living and dining space connected by continuous microcement floors, 10-seater live-edge solid walnut dining table, linear suspended pendant lighting, and seamless indoor-outdoor patio integration.',
    params: {
      floors: 1,
      wallHeight: 3.6,
      roofType: 'exposed_concrete_plank',
      exteriorMaterial: 'microcement_and_timber',
      windowType: 'floor_to_ceiling_pocketing',
      features: ['walnut_dining_table', 'linear_pendant', 'microcement_floor'],
      dimensions: { width: 9, length: 14, height: 3.6 }
    },
    accentColor: '#D97706',
    iconName: 'Maximize2'
  },
  {
    id: 'p47',
    name: 'Modern Home Office',
    category: 'Interior Design',
    style: 'Modern Interior',
    buildingType: 'Interior',
    prompt: 'Design an inspiring executive home office with floor-to-ceiling custom dark walnut bookshelves with library ladder, cantilevered minimalist executive desk, soundproofing acoustic wood slat accent wall, and garden courtyard view.',
    params: {
      floors: 1,
      wallHeight: 3.2,
      roofType: 'acoustic_baffle_ceiling',
      exteriorMaterial: 'walnut_bookshelves_slats',
      windowType: 'corner_garden_view',
      features: ['bookshelves_ladder', 'cantilever_desk', 'acoustic_slat_wall'],
      dimensions: { width: 5, length: 6, height: 3.2 }
    },
    accentColor: '#2563EB',
    iconName: 'Laptop'
  },
  {
    id: 'p48',
    name: 'Luxury Hotel Suite Interior',
    category: 'Interior Design',
    style: 'Hospitality Luxury',
    buildingType: 'Interior',
    prompt: 'Build an ultra-luxe presidential hotel suite with curved velvet banquette seating, private wet bar with mirrored bronze shelving, motorized blackout drapery, marble bathroom with city views, and integrated acoustic ambient audio.',
    params: {
      floors: 1,
      wallHeight: 3.5,
      roofType: 'recessed_plaster_cove',
      exteriorMaterial: 'silk_wallcovering_bronze',
      windowType: 'panoramic_skyline',
      features: ['curved_banquette', 'bronze_wet_bar', 'skyline_views'],
      dimensions: { width: 8, length: 11, height: 3.5 }
    },
    accentColor: '#F59E0B',
    iconName: 'Smile'
  },
  {
    id: 'p49',
    name: 'Contemporary Apartment Interior',
    category: 'Interior Design',
    style: 'Contemporary Interior',
    buildingType: 'Interior',
    prompt: 'Model a vibrant contemporary urban apartment interior featuring multi-functional plywood storage partitions, terrazzo kitchen breakfast bar, cozy window seat nook with cushions, exposed concrete ceiling, and track spotlighting.',
    params: {
      floors: 1,
      wallHeight: 3.0,
      roofType: 'exposed_concrete_slab',
      exteriorMaterial: 'birch_plywood_and_concrete',
      windowType: 'urban_black_mullion',
      features: ['plywood_storage_wall', 'terrazzo_breakfast_bar', 'window_seat_nook'],
      dimensions: { width: 7, length: 9, height: 3.0 }
    },
    accentColor: '#10B981',
    iconName: 'Grid'
  },
  {
    id: 'p50',
    name: 'Minimalist Studio Apartment',
    category: 'Interior Design',
    style: 'Compact Minimalist',
    buildingType: 'Interior',
    prompt: 'Design a hyper-efficient minimalist studio apartment utilizing a revolving central divider cabinet with TV swivel, foldaway wall Murphy bed, integrated compact kitchenette, clean white epoxy floor, and acoustic slatted panels.',
    params: {
      floors: 1,
      wallHeight: 2.8,
      roofType: 'flush_white_ceiling',
      exteriorMaterial: 'white_lacquer_wood_slats',
      windowType: 'large_picture_window',
      features: ['revolving_divider', 'murphy_bed', 'compact_kitchenette'],
      dimensions: { width: 5, length: 7, height: 2.8 }
    },
    accentColor: '#6B7280',
    iconName: 'Box'
  },

  // ==========================================
  // CATEGORY 6: LANDSCAPE & SPECIAL STRUCTURES (10)
  // ==========================================
  {
    id: 'p51',
    name: 'Modern Swimming Pool Design',
    category: 'Landscape & Special Structures',
    style: 'Modern Landscape',
    buildingType: 'Landscape',
    prompt: 'Design a 20-meter infinity swimming pool with zero-edge glass weir, submerged shallow sun shelf with lounger platforms, floating stone steps leading to sunken fire pit island, and mood-adaptive fiber optic star floor lighting.',
    params: {
      floors: 1,
      wallHeight: 1.5,
      roofType: 'open_sky',
      exteriorMaterial: 'blue_mosaic_and_travertine',
      windowType: 'open_air',
      features: ['infinity_glass_weir', 'sunken_fire_pit_island', 'sun_shelf'],
      dimensions: { width: 12, length: 22, height: 2.0 }
    },
    accentColor: '#0EA5E9',
    iconName: 'LifeBuoy'
  },
  {
    id: 'p52',
    name: 'Landscaped Residential Garden',
    category: 'Landscape & Special Structures',
    style: 'Landscape Design',
    buildingType: 'Landscape',
    prompt: 'Create a contemporary architectural garden featuring tiered corten steel retaining planters, Japanese maples, sculptural basalt water bubblers, floating bluestone stepping paths over creeping thyme, and integrated low-voltage lighting.',
    params: {
      floors: 1,
      wallHeight: 1.2,
      roofType: 'open_sky',
      exteriorMaterial: 'corten_steel_and_bluestone',
      windowType: 'open_air',
      features: ['corten_retaining_walls', 'water_bubblers', 'bluestone_paths'],
      dimensions: { width: 14, length: 20, height: 2.5 }
    },
    accentColor: '#16A34A',
    iconName: 'Trees'
  },
  {
    id: 'p53',
    name: 'Modern Rooftop Garden',
    category: 'Landscape & Special Structures',
    style: 'Urban Landscape',
    buildingType: 'Landscape',
    prompt: 'Build a sky-high modern rooftop garden with modular cedar planters, wind-protecting laminated glass perimeter railings, steel louvered shade pergola, synthetic turf putting green, and lounge cabanas with city skyline backdrop.',
    params: {
      floors: 1,
      wallHeight: 2.8,
      roofType: 'pergola_louvers',
      exteriorMaterial: 'cedar_and_glass_balustrade',
      windowType: 'glass_windscreen',
      features: ['louvered_pergola', 'cedar_planters', 'cabana_lounges'],
      dimensions: { width: 15, length: 18, height: 3.2 }
    },
    accentColor: '#10B981',
    iconName: 'Sun'
  },
  {
    id: 'p54',
    name: 'Outdoor Entertainment Area',
    category: 'Landscape & Special Structures',
    style: 'Outdoor Living',
    buildingType: 'Landscape',
    prompt: 'Design an outdoor luxury entertainment area featuring stainless steel outdoor kitchen with wood-fired pizza oven, built-in teppanyaki grill, motorized retractable canvas awning, polished concrete bar, and outdoor surround sound.',
    params: {
      floors: 1,
      wallHeight: 3.2,
      roofType: 'retractable_canvas_awning',
      exteriorMaterial: 'stainless_and_board_concrete',
      windowType: 'open_pavilion',
      features: ['pizza_oven', 'teppanyaki_grill', 'concrete_bar'],
      dimensions: { width: 8, length: 14, height: 3.4 }
    },
    accentColor: '#EA580C',
    iconName: 'Flame'
  },
  {
    id: 'p55',
    name: 'Modern Pavilion',
    category: 'Landscape & Special Structures',
    style: 'Sculptural Modern',
    buildingType: 'Special',
    prompt: 'Generate an architectural garden pavilion featuring a wafer-thin folded origami white concrete canopy, slender angled steel columns, polished black granite reflection pool base, and minimal frameless glass windscreen walls.',
    params: {
      floors: 1,
      wallHeight: 3.2,
      roofType: 'origami_folded_concrete',
      exteriorMaterial: 'ultra_thin_concrete_steel',
      windowType: 'frameless_glass',
      features: ['origami_canopy', 'angled_steel_columns', 'reflection_pool'],
      dimensions: { width: 10, length: 10, height: 3.5 }
    },
    accentColor: '#6366F1',
    iconName: 'Tent'
  },
  {
    id: 'p56',
    name: 'Contemporary Community Center',
    category: 'Landscape & Special Structures',
    style: 'Civic Modern',
    buildingType: 'Special',
    prompt: 'Construct a welcoming contemporary community center with sweeping curved glued-laminated timber (glulam) roof beams, floor-to-ceiling glass lobby opening onto public plaza, multipurpose event hall, and youth workshop maker spaces.',
    params: {
      floors: 2,
      wallHeight: 4.2,
      roofType: 'curved_glulam_timber',
      exteriorMaterial: 'glulam_timber_and_glass',
      windowType: 'curtain_wall_double_glazed',
      features: ['glulam_beams', 'public_plaza', 'multipurpose_hall'],
      dimensions: { width: 22, length: 32, height: 8.5 }
    },
    accentColor: '#2563EB',
    iconName: 'Users'
  },
  {
    id: 'p57',
    name: 'Modern Parking Structure',
    category: 'Landscape & Special Structures',
    style: 'Industrial Modern',
    buildingType: 'Special',
    prompt: 'Design an aesthetically elevated 3-tier parking structure with undulating kinetic aluminum facade flaps that shimmer in the wind, integrated EV rapid charging bays, vertical vine trellis green screens, and rooftop solar canopy.',
    params: {
      floors: 3,
      wallHeight: 3.2,
      roofType: 'solar_canopy_deck',
      exteriorMaterial: 'kinetic_aluminum_facade',
      windowType: 'open_ventilated_mesh',
      features: ['kinetic_facade', 'ev_charging_bays', 'green_screen_trellis'],
      dimensions: { width: 24, length: 34, height: 10.5 }
    },
    accentColor: '#64748B',
    iconName: 'Compass'
  },
  {
    id: 'p58',
    name: 'Sustainable Green Building',
    category: 'Landscape & Special Structures',
    style: 'Eco Modern',
    buildingType: 'Special',
    prompt: 'Model a benchmark net-zero sustainable environmental exhibition pavilion with living vertical exterior moss walls, passive earth-cooling ventilation tubes, integrated rooftop wind micro-turbines, and carbon-sequestering mass timber framing.',
    params: {
      floors: 2,
      wallHeight: 3.5,
      roofType: 'green_living_roof_turbines',
      exteriorMaterial: 'cross_laminated_timber_mass',
      windowType: 'passive_house_certified',
      features: ['living_moss_walls', 'wind_micro_turbines', 'mass_timber_frame'],
      dimensions: { width: 16, length: 20, height: 7.8 }
    },
    accentColor: '#16A34A',
    iconName: 'Globe'
  },
  {
    id: 'p59',
    name: 'Modern Pedestrian Bridge',
    category: 'Landscape & Special Structures',
    style: 'Parametric Engineering',
    buildingType: 'Special',
    prompt: 'Design a sculptural 40-meter pedestrian footbridge with twisting parametric steel ribbon canopy, integrated recessed warm handrail lighting, non-slip timber deck walkway, and glass floor viewing portholes suspended over water.',
    params: {
      floors: 1,
      wallHeight: 3.0,
      roofType: 'twisting_steel_ribbon',
      exteriorMaterial: 'structural_corten_and_glass',
      windowType: 'glass_balustrade_portholes',
      features: ['parametric_ribbon', 'glass_viewing_portholes', 'handrail_lighting'],
      dimensions: { width: 5, length: 40, height: 4.8 }
    },
    accentColor: '#F59E0B',
    iconName: 'Navigation'
  },
  {
    id: 'p60',
    name: 'Contemporary Exhibition Pavilion',
    category: 'Landscape & Special Structures',
    style: 'Contemporary Sculptural',
    buildingType: 'Special',
    prompt: 'Construct a landmark temporary contemporary exhibition pavilion with translucent PTFE membrane tensile canopy, fluid curvilinear interior partitions, interactive projection-mapped floors, and zero-waste demountable steel node frame.',
    params: {
      floors: 1,
      wallHeight: 5.0,
      roofType: 'tensile_ptfe_membrane',
      exteriorMaterial: 'translucent_membrane_steel',
      windowType: 'curvilinear_open_portals',
      features: ['tensile_membrane', 'demountable_steel_frame', 'projection_floors'],
      dimensions: { width: 18, length: 24, height: 6.2 }
    },
    accentColor: '#8B5CF6',
    iconName: 'Sparkles'
  }
];

// Helper functions for preset querying
export const getPresetById = (id) => PRESETS.find(p => p.id === id);
export const getPresetsByCategory = (cat) => PRESETS.filter(p => p.category === cat);
export const searchPresets = (query) => {
  if (!query || !query.trim()) return PRESETS;
  const q = query.toLowerCase();
  return PRESETS.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.prompt.toLowerCase().includes(q) ||
    p.style.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.buildingType.toLowerCase().includes(q)
  );
};
