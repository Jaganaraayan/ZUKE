# ZUKE – AI Architectural Studio

> **"From Sketch to Structure. From Imagination to Reality."**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Three.js%20%7C%20Vite-blue.svg)](https://react.dev/)
[![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.10+-green.svg)](https://fastapi.tiangolo.com/)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20r128+-black.svg)](https://threejs.org/)
[![Theme](https://img.shields.io/badge/Theme-Warm%20Beige%20%26%20Espresso-d2a679.svg)](#)

---

## 1. Project Overview

**ZUKE – AI Architectural Studio** is a commercial-grade, full-stack architectural visualization, 2D-to-3D spatial synthesis, and interactive procedural 3D modeling platform. Designed specifically for architects, architecture students, interior designers, civil engineers, real estate developers, and 3D visualization artists, ZUKE bridges the gap between conceptual 2D drafting and real-time interactive 3D modeling.

The platform transforms hand-drawn sketches, raster floor plans (PNG, JPG, WebP), and natural-language text instructions into rich, physically-grounded 3D spatial models featuring genuine Three.js geometry, physically-based materials, real-time lighting and shadows, an AI Natural Language 3D Editor, first-person walkthrough exploration, and instant standard format exports (GLTF, GLB, OBJ).

---

## 2. Problem Statement

Traditional architectural workflows suffer from significant friction:
1. **Tool Fragmentation**: Architects conceptualize in 2D sketching tools, recreate floor plans in CAD software, and manually extrude and texture in complex 3D authoring suites (such as Revit, Rhino, or 3ds Max).
2. **Steep Learning Curves**: Powerful 3D modeling software requires hundreds of hours of training just to make iterative conceptual edits (e.g., adding a cantilever balcony or an extra floor).
3. **Disconnected AI Generators**: Modern generative AI tools usually produce flat, non-navigable raster images or non-editable meshes that cannot be incrementally refined through conversational instructions.
4. **Lack of Instant Walkthrough Experience**: Validating human-scale spatial perception typically requires rendering engines or complex game engine exports.

**ZUKE solves these challenges** by providing an end-to-end studio where conceptual sketches, natural language prompts, procedural 3D synthesis, parametric modification, photorealistic image rendering, and first-person walkthrough exist in one cohesive environment.

---

## 3. Project Objectives

- **Democratize Architectural Modeling**: Enable rapid 3D space generation and modification through natural language commands without sacrificing precision.
- **Parametric 2D-to-3D Synthesis**: Automatically convert 2D architectural drawings and raster floor plans into extruded, textured 3D structures.
- **Context-Aware AI Modification Engine**: Modify *existing* 3D scene graphs (altering heights, adding cantilever balconies, swimming pools, columns, or gardens) while preserving unaffected geometry.
- **Interactive First-Person Exploration**: Provide an immersive, human-eye-level (1.65m) first-person walkthrough mode with intuitive mouse-look and keyboard navigation.
- **Professional Aesthetics**: Deliver a refined, warm architectural design aesthetic utilizing a cohesive warm beige (`#d2a679`) and espresso brown (`#14100c`) palette.

---

## 4. Key Features & Workspaces

### 🏛️ A. AI-Powered 3D Workspace & Natural Language Editor
- **5-Zone Professional Workspace**: Top controls toolbar, Left AI Natural Language Editor, Center real-time 3D Viewport, Right scene inspector/property controls, and Bottom modification history timeline.
- **NLP Architectural Modification Engine**: Modifies the *currently loaded* 3D building instead of creating an unrelated new mesh.
- **Categories of Supported Modifications**:
  - *Structural*: Add/remove floors, adjust ceiling heights, add cantilever balconies, add load-bearing columns, roof adjustments.
  - *Exterior Facade*: Modern minimalist redesign, vertical wooden slats/cladding, structural glass curtain walls, limewash beige plaster.
  - *Environmental*: In-ground swimming pools with water shaders, landscaped perimeter gardens, paved driveways, outdoor canopy carports.
- **Quick Modifiers**: Functional one-click shortcut buttons (Swimming Pool, Balcony, Flat Roof, 3 Floors, Modern Facade, Wooden Panels, Garden, Columns).
- **Undo / Redo Stack**: Multi-state historical restoration preserving exact geometries and transforms.
- **Scene Hierarchy & Properties Inspector**: Raycasting object selection, real-time coordinate readouts, dimension inspection, and material swapping.

### 🚶 B. First-Person Walkthrough Mode
- **Real-Time Human Perspective**: First-person camera positioned at standard human eye-level (1.65m).
- **Smooth Navigation Controls**:
  - `W` / `A` / `S` / `D` or Arrow Keys: Walk & strafe in look direction.
  - `Shift`: Sprint mode.
  - `Mouse`: Continuous pitch & yaw look-around with vertical limits (±85°).
  - `ESC`: Release pointer capture.
- **Instant Modal Dismissal**: One-click entry dismisses the HUD popup and backdrop blur immediately, rendering the complete scene crisp and responsive.

### ✏️ C. 2D Sketch Studio
- HTML5 Canvas drawing surface optimized for stylus, mouse, and touch.
- Wall tools with metric thickness options (0.15m interior partition, 0.25m standard, 0.35m exterior load-bearing).
- Automatic area calculations and real-time dimension tags (`8.0m × 6.0m`).
- Swing doors, sliding windows, and architectural grid snapping.
- **Direct 2D-to-3D Extrusion**: Instantly raises walls into 3D geometry.

### 📐 D. Upload & Tracing Studio (2D-to-3D Floorplan)
- Supports PNG, JPG, JPEG, and WebP floor plans.
- Image preprocessing filters: contrast, brightness, rotation, and binary threshold edge detection.
- Scale calibration: Two-point scale definition for real-world meters-per-pixel mapping.
- Automatic boundary tracing and 3D extrusion.

### 🎨 E. AI Architectural Text-to-Image Studio
- Generates photorealistic architectural interior and exterior photography.
- Multi-engine flexibility: Google Gemini architectural reasoning & Cloudflare Workers AI Flux Realism.
- Detailed architectural specification controls (Room type, wall finishes, flooring, lighting scenarios, camera lens/perspectives).

### 📚 F. Curated 60-Preset Architectural Library
Curated across 6 architectural disciplines (10 presets each):
1. **Modern Residential** (Villas, minimalist homes, glass residences, hillside estates)
2. **Traditional & Cultural** (Kerala-style, South Indian courtyards, Japanese minimalist, Mediterranean)
3. **Luxury Estates** (Penthouses, beachfront mansions, mountain retreats, palace villas)
4. **Commercial Spaces** (Corporate towers, shopping complexes, boutique hotels, coworking hubs)
5. **Interior Design** (Luxury bedrooms, open-plan living rooms, master suites, chef kitchens)
6. **Landscape & Urban** (Terraced rooftop gardens, pavilion structures, reflection pools)

---

## 5. Technology Stack

### Frontend
- **Framework**: React 18, Vite 6
- **3D Graphics**: Three.js (WebGL, OrbitControls, PCFSoftShadowMap, ACESFilmicToneMapping)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Styling**: Modern CSS3 Custom Properties with warm architectural palette

### Backend
- **Framework**: Python 3.10+, FastAPI, Uvicorn
- **AI Integrations**: Google Gemini API (`gemini-2.5-flash`), Cloudflare Workers AI (`flux-1-schnell`)
- **Image Processing**: Pillow (PIL), OpenCV-Python, NumPy
- **Validation**: Pydantic v2

---

## 6. Project Architecture

```
                      ┌─────────────────────────────────────────┐
                      │          ZUKE AI Architectural          │
                      │               Web Studio                │
                      └────────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│ 2D Sketch Studio │             │ AI Text-to-Image │             │  3D Architectural│
│  & Plan Tracing  │             │   Photo Studio   │             │     Workspace    │
└────────┬─────────┘             └────────┬─────────┘             └────────┬─────────┘
         │                                │                                │
         │ Extruded Mesh Data             │ Architectural Prompts          │ Procedural Geometry
         ▼                                ▼                                ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│                    Three.js Procedural Scene & Geometry Engine                     │
│  (Walls, Slabs, Balconies, Columns, Windows, Doors, Swimming Pool, Materials)      │
└─────────────────────────────────────────┬──────────────────────────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
      ┌─────────────────────────┐                     ┌─────────────────────────┐
      │  AI Natural Language    │                     │  First-Person Real-Time │
      │   Modification Engine   │                     │     Walkthrough Mode    │
      └─────────────────────────┘                     └─────────────────────────┘
```

---

## 7. Project Folder Structure

```
ZUKE/
├── .gitignore                  # Git exclusions for dependencies, builds, & secrets
├── .env.example                # Root environment configuration template
├── README.md                   # Comprehensive project documentation
├── vercel.json                 # Deployment configuration
├── backend/
│   ├── .env.example            # Backend API configuration template
│   ├── requirements.txt        # Python backend dependencies
│   └── app/
│       ├── main.py             # FastAPI application entry point
│       ├── models/             # Pydantic schemas and data models
│       ├── routes/             # API route handlers
│       ├── services/           # AI services & image processing
│       └── utils/              # Helper utilities
└── frontend/
    ├── package.json            # Node.js dependencies and scripts
    ├── vite.config.js          # Vite build configuration
    ├── index.html              # Frontend HTML entry point
    └── src/
        ├── App.jsx             # Main application layout and router
        ├── main.jsx            # React root mount
        ├── components/         # Reusable UI components & modals
        ├── pages/              # Studio pages (Workspace3D, TextToImage, etc.)
        ├── presets/            # 60 architectural preset definitions
        ├── services/           # Natural language prompt parser & APIs
        ├── sketch/             # 2D canvas drawing and wall tracing engine
        ├── store/              # Zustand global application state
        ├── styles/             # Modular CSS with warm beige/brown theme
        ├── three/              # Three.js procedural generators & materials
        └── utils/              # Mathematical & export helpers
```

---

## 8. Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **Python**: v3.10 or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Jaganaraayan/ZUKE.git
cd ZUKE
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Backend Setup
```bash
cd ../backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

---

## 9. Environment Variable Configuration

Copy the `.env.example` file in the root or `backend/` directory to `.env`:

```bash
cp .env.example backend/.env
```

Configure your credentials:
```env
# Server settings
PORT=8000
HOST=0.0.0.0
DEBUG=True

# Google Gemini API (Free key from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_TEXT_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=gemini-nano-banana-2.1

# Cloudflare Workers AI (Optional - for image generation)
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_MODEL=@cf/black-forest-labs/flux-1-schnell
```

---

## 10. Running the Application

### Start Backend Server
```bash
cd backend
# Windows
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API documentation will be available at: `http://localhost:8000/docs`

### Start Frontend Application
```bash
cd frontend
npm run dev
```
Open your browser and navigate to: `http://localhost:5173/`

### Build for Production
```bash
cd frontend
npm run build
```

---

## 11. Future Enhancements

- [ ] **BIM IFC Export**: Native export to Industry Foundation Classes (.ifc) for Revit/ArchiCAD interoperability.
- [ ] **Collaborative Multi-User Sessions**: Live multi-cursor architectural design review using WebRTC/WebSockets.
- [ ] **VR / WebXR Support**: Immersive walkthroughs via Meta Quest and WebXR headsets.
- [ ] **Structural Load Analysis Preview**: Simplified finite element stress heatmaps for conceptual load validation.
- [ ] **Daylight & Shadow Studies**: True solar positioning simulation based on geographic latitude and time of year.

---

## 12. Author Information

**Jaganaraayan**
- **GitHub**: [@Jaganaraayan](https://github.com/Jaganaraayan)
- **Repository**: [https://github.com/Jaganaraayan/ZUKE](https://github.com/Jaganaraayan/ZUKE)
- **Project**: ZUKE – AI Architectural Studio

---

## 13. License

This project is licensed under the MIT License - see the LICENSE file for details.
