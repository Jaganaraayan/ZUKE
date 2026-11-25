"""
ZUKE – AI Architectural Visualization and 3D Design Studio
FastAPI Backend API with Cloudflare Workers AI & Google Gemini Integration
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import io
import os
import json
import base64
import urllib.request
import urllib.error
from datetime import date
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="ZUKE – AI Architectural Design API",
    description="Backend API powering 2D-to-3D conversion, procedural geometry synthesis, Google Gemini architectural reasoning, and FLUX / Gemini Nano Banana image generation.",
    version="2.2.0"
)

# Enable CORS for local Vite dev server and production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Usage tracker for free tiers
usage_state = {
    "date": str(date.today()),
    "cf_count": 0,
    "gemini_count": 0
}

def get_cloudflare_credentials(client_account_id: Optional[str] = None, client_api_token: Optional[str] = None):
    account_id = client_account_id or os.getenv("CLOUDFLARE_ACCOUNT_ID")
    api_token = client_api_token or os.getenv("CLOUDFLARE_API_TOKEN")
    model = os.getenv("CLOUDFLARE_MODEL", "@cf/black-forest-labs/flux-1-schnell")
    return account_id, api_token, model

def get_gemini_credentials(client_api_key: Optional[str] = None):
    api_key = client_api_key or os.getenv("GEMINI_API_KEY")
    text_model = os.getenv("GEMINI_TEXT_MODEL", "gemini-2.5-flash")
    image_model = os.getenv("GEMINI_IMAGE_MODEL", "gemini-nano-banana-2.1")
    return api_key, text_model, image_model

class PromptParseRequest(BaseModel):
    prompt: str
    base_config: Optional[Dict[str, Any]] = None

class Convert2DRequest(BaseModel):
    elements: List[Dict[str, Any]]
    wall_height: float = 3.2
    wall_thickness: float = 0.25
    material: str = "white_concrete"

class CloudflareGenerateRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = None
    style: Optional[str] = "Photorealistic"
    scope: Optional[str] = "exterior"
    steps: Optional[int] = 4
    account_id: Optional[str] = None
    api_token: Optional[str] = None

class GeminiEnhanceRequest(BaseModel):
    prompt: str
    style: Optional[str] = "Modern"
    scope: Optional[str] = "exterior"
    api_key: Optional[str] = None
    model: Optional[str] = None

class GeminiGenerateRequest(BaseModel):
    prompt: str
    style: Optional[str] = "Photorealistic"
    scope: Optional[str] = "exterior"
    model: Optional[str] = None
    api_key: Optional[str] = None

class TestConnectionRequest(BaseModel):
    account_id: Optional[str] = None
    api_token: Optional[str] = None

class GeminiTestRequest(BaseModel):
    api_key: Optional[str] = None
    model: Optional[str] = None

@app.get("/")
def root():
    return {
        "product": "ZUKE",
        "description": "AI Architectural Visualization and 3D Design Studio",
        "tagline": "From Sketch to Structure. From Imagination to Reality.",
        "status": "online",
        "version": "2.2.0",
        "supported_providers": [
            "Google Gemini API (gemini-2.5-flash & gemini-nano-banana-2.1)",
            "Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell)"
        ]
    }

@app.get("/api/health")
def health_check():
    cf_acc, cf_tok, cf_mod = get_cloudflare_credentials()
    gem_key, gem_txt, gem_img = get_gemini_credentials()
    return {
        "status": "healthy",
        "engine": "ZUKE Procedural Architectural Engine",
        "cloudflare_configured": bool(cf_acc and cf_tok),
        "gemini_configured": bool(gem_key),
        "gemini_models": {
            "text_reasoning": gem_txt,
            "image_generation": gem_img
        },
        "daily_usage": {
            "date": usage_state["date"],
            "cloudflare_generations": usage_state["cf_count"],
            "gemini_requests": usage_state["gemini_count"]
        }
    }

# ==========================================
# GOOGLE GEMINI API ENDPOINTS
# ==========================================

@app.post("/api/gemini/test-connection")
def test_gemini_connection(req: GeminiTestRequest):
    """
    Validates Google Gemini API key by making a lightweight generateContent call using the free-tier model.
    """
    api_key, text_model, _ = get_gemini_credentials(req.api_key)
    target_model = req.model or text_model

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API Key missing. Please provide your Google AI Studio API key in Settings."
        )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {"parts": [{"text": "Ping. Respond with one word: 'Connected'."}]}
        ]
    }

    try:
        http_req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers, method="POST")
        with urllib.request.urlopen(http_req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
            return {
                "success": True,
                "message": f"Successfully connected to Google Gemini API ({target_model})!",
                "reply": reply
            }
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        if e.code == 400 or e.code == 403:
            raise HTTPException(status_code=401, detail="Invalid Gemini API key or unauthorized project access.")
        elif e.code == 404:
            raise HTTPException(status_code=404, detail=f"Model '{target_model}' not found in Gemini API.")
        elif e.code == 429:
            raise HTTPException(status_code=429, detail="Gemini API rate limit or quota exceeded.")
        else:
            raise HTTPException(status_code=e.code, detail=f"Gemini API error ({e.code}): {err_msg[:200]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini connection failed: {str(e)}")

@app.post("/api/gemini/enhance-prompt")
def gemini_enhance_architectural_prompt(req: GeminiEnhanceRequest):
    """
    Uses Google Gemini free-tier text model (gemini-2.5-flash) to:
    - Analyze architectural requirements
    - Suggest materials, textures, and lighting
    - Produce an optimized, high-fidelity prompt for visualization
    """
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    api_key, text_model, _ = get_gemini_credentials(req.api_key)
    target_model = req.model or text_model

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API key not configured. Please add your Google AI Studio API key in Settings."
        )

    system_instruction = (
        "You are an expert architectural visualization consultant and interior architecture photographer. "
        "Analyze the user's architectural or room design request. Maintain EVERY furniture item, color, fabric, and material explicitly requested. "
        "Return a JSON object with: "
        "1. 'enhanced_prompt': An ultra-detailed professional architectural photograph description specifying exact furniture materials (e.g. solid dark walnut, honed marble), fabric textures (e.g. crisp cotton linen, velvet), natural lighting (e.g. soft morning sunbeams through sheer curtains, warm 2700K recessed ceiling LEDs), realistic physical shadows, and shot on a 35mm tilt-shift lens. Explicitly instruct the model to produce a REAL PHOTOGRAPH, not a cartoon, 3D render, or animation. "
        "2. 'style': The primary architectural style identified (e.g. Contemporary Luxury, Scandinavian, Minimalist). "
        "3. 'materials': An array of 3-5 recommended material and finish textures extracted from the prompt. "
        "4. 'lighting': Suggested lighting conditions. "
        "5. 'environment': Suggested room orientation and window views. "
        "Reply with pure JSON only, without markdown backticks."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {
                "parts": [
                    {"text": f"{system_instruction}\n\nUser Design Request: '{req.prompt.strip()}'. Scope: {req.scope}. Style hint: {req.style}."}
                ]
            }
        ]
    }

    try:
        http_req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers, method="POST")
        with urllib.request.urlopen(http_req, timeout=25) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()

            # Clean markdown codeblocks if returned
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[-1]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]

            parsed = {}
            try:
                parsed = json.loads(raw_text.strip())
            except Exception:
                parsed = {
                    "enhanced_prompt": raw_text.strip(),
                    "style": req.style or "Modern",
                    "materials": ["Smooth Concrete", "Structural Glass", "Natural Timber"],
                    "lighting": "Natural daylight",
                    "environment": "Architectural landscaping"
                }

            usage_state["gemini_count"] += 1
            return {
                "success": True,
                "model_used": target_model,
                "data": parsed
            }
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        if e.code == 401 or e.code == 403:
            raise HTTPException(status_code=401, detail="Invalid Gemini API key.")
        elif e.code == 429:
            raise HTTPException(status_code=429, detail="Gemini free-tier rate limit reached. Please wait a moment.")
        else:
            raise HTTPException(status_code=e.code, detail=f"Gemini API error ({e.code}): {err_msg[:200]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini prompt enhancement failed: {str(e)}")

@app.post("/api/gemini/generate-image")
def gemini_generate_image(req: GeminiGenerateRequest):
    """
    Calls Google's native Gemini image generation model: gemini-nano-banana-2.1.
    Note: As per Google AI Studio documentation, programmatic image-generation models
    may require active billing. If billing is inactive, users receive an informative notice.
    """
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Architectural prompt cannot be empty.")

    api_key, _, default_image_model = get_gemini_credentials(req.api_key)
    target_model = req.model or default_image_model

    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Gemini API Key missing. Please configure your key in Settings → System API."
        )

    # Architectural photorealistic photographic direction
    photorealistic_direction = (
        "Professional architectural interior photography, real photograph, Architectural Digest editorial shot, "
        "accurate furniture scale and geometry, physically accurate lighting, natural bounce light, detailed material textures, "
        "shot on Hasselblad H6D-100c with 35mm tilt-shift lens, f/8, ISO 64, natural color grading. "
        "A real completed room photograph, not an illustration, not a 3D game render, not a cartoon, not an animation."
    )
    full_prompt = (
        f"{photorealistic_direction}. Subject: {req.prompt.strip()}. "
        f"Design style: {req.style}. View: {req.scope}."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {
                "parts": [
                    {"text": full_prompt}
                ]
            }
        ]
    }

    try:
        http_req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers, method="POST")
        with urllib.request.urlopen(http_req, timeout=45) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            candidates = data.get("candidates", [])
            if not candidates:
                raise HTTPException(status_code=500, detail="Gemini returned no candidates.")

            parts = candidates[0].get("content", {}).get("parts", [])
            data_url = None

            for p in parts:
                if "inlineData" in p:
                    mime = p["inlineData"].get("mimeType", "image/png")
                    b64 = p["inlineData"].get("data", "")
                    data_url = f"data:{mime};base64,{b64}"
                    break

            if not data_url:
                # Text-only response or explanation
                text_reply = parts[0].get("text", "") if parts else ""
                raise HTTPException(
                    status_code=400,
                    detail=f"Gemini model returned text instead of image data: '{text_reply[:200]}'. Note that image generation in Google AI Studio requires billing enabled for {target_model}."
                )

            usage_state["gemini_count"] += 1
            return {
                "success": True,
                "image_url": data_url,
                "prompt": req.prompt,
                "model": target_model,
                "style": req.style,
                "scope": req.scope
            }

    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        if e.code == 400 and "billing" in err_msg.lower():
            raise HTTPException(
                status_code=402,
                detail=f"Google Gemini model '{target_model}' requires paid billing in your Google AI Studio / Google Cloud project. To generate without cost, switch to Cloudflare Workers AI free tier in Settings."
            )
        elif e.code == 401 or e.code == 403:
            raise HTTPException(status_code=401, detail="Invalid Gemini API key or unauthorized project.")
        elif e.code == 429:
            raise HTTPException(status_code=429, detail="Gemini API quota exceeded.")
        else:
            raise HTTPException(status_code=e.code, detail=f"Gemini API error ({e.code}): {err_msg[:250]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini image generation failed: {str(e)}")

# ==========================================
# CLOUDFLARE WORKERS AI ENDPOINTS
# ==========================================

@app.post("/api/cloudflare/test-connection")
def test_cloudflare_connection(req: TestConnectionRequest):
    account_id, api_token, model = get_cloudflare_credentials(req.account_id, req.api_token)

    if not account_id or not api_token:
        raise HTTPException(
            status_code=400,
            detail="Cloudflare Account ID or API Token missing. Please configure credentials in Settings."
        )

    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    body = json.dumps({"prompt": "modern architectural pavilion", "num_steps": 4}).encode('utf-8')

    try:
        http_req = urllib.request.Request(url, data=body, headers=headers, method="POST")
        with urllib.request.urlopen(http_req, timeout=20) as resp:
            return {
                "success": True,
                "message": f"Successfully connected to Cloudflare Workers AI ({model})!",
                "status_code": resp.status
            }
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        if e.code == 401 or e.code == 403:
            raise HTTPException(status_code=401, detail="Invalid Cloudflare API Token or insufficient permissions for Workers AI.")
        elif e.code == 404:
            raise HTTPException(status_code=404, detail="Cloudflare Account ID not found or model path incorrect.")
        elif e.code == 429:
            raise HTTPException(status_code=429, detail="Cloudflare Workers AI daily free quota exceeded.")
        else:
            raise HTTPException(status_code=e.code, detail=f"Cloudflare API Error ({e.code}): {err_msg[:200]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")

@app.post("/api/cloudflare/generate")
def generate_architectural_image(req: CloudflareGenerateRequest):
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Architectural prompt cannot be empty.")

    account_id, api_token, model = get_cloudflare_credentials(req.account_id, req.api_token)

    if not account_id or not api_token:
        raise HTTPException(
            status_code=400,
            detail="Cloudflare credentials not configured. Please add your Cloudflare Account ID and API Token in Settings → System API."
        )

    style_suffix = (
        f"Architectural style: {req.style}. Scope: {req.scope}. "
        "Award-winning architectural interior and exterior photography, real completed building photograph, "
        "Architectural Digest editorial, natural sunlight, physically realistic soft shadows, authentic material textures, "
        "shot on Hasselblad H6D-100c with 35mm tilt-shift lens, f/8 aperture, ISO 64, natural color grading. "
        "Real photograph, not an illustration, not a 3D model render, not a cartoon, not an animation, not an isometric diorama."
    )
    full_prompt = f"{req.prompt.strip()}. {style_suffix}"

    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "prompt": full_prompt,
        "num_steps": min(max(req.steps or 4, 4), 8)
    }

    try:
        http_req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method="POST")
        with urllib.request.urlopen(http_req, timeout=45) as resp:
            content_type = resp.headers.get("Content-Type", "")
            raw_data = resp.read()

            if "image" in content_type or raw_data.startswith(b'\x89PNG') or raw_data.startswith(b'\xff\xd8'):
                b64_img = base64.b64encode(raw_data).decode('utf-8')
                mime = "image/png" if raw_data.startswith(b'\x89PNG') else "image/jpeg"
                data_url = f"data:{mime};base64,{b64_img}"
            else:
                try:
                    res_json = json.loads(raw_data.decode('utf-8'))
                    if "result" in res_json and "image" in res_json["result"]:
                        b64_img = res_json["result"]["image"]
                        data_url = f"data:image/png;base64,{b64_img}"
                    elif "image" in res_json:
                        data_url = f"data:image/png;base64,{res_json['image']}"
                    else:
                        raise ValueError("Unexpected JSON response structure from Workers AI")
                except Exception:
                    b64_img = base64.b64encode(raw_data).decode('utf-8')
                    data_url = f"data:image/png;base64,{b64_img}"

            usage_state["cf_count"] += 1

            return {
                "success": True,
                "image_url": data_url,
                "prompt": req.prompt,
                "model": model,
                "style": req.style,
                "scope": req.scope,
                "usage_today": usage_state["cf_count"]
            }

    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        if e.code == 401 or e.code == 403:
            raise HTTPException(status_code=401, detail="Invalid Cloudflare API Token or permission denied.")
        elif e.code == 429:
            raise HTTPException(status_code=429, detail="Cloudflare Workers AI daily free limit exceeded.")
        elif e.code == 504:
            raise HTTPException(status_code=504, detail="Cloudflare Workers AI request timed out.")
        else:
            raise HTTPException(status_code=e.code, detail=f"Cloudflare Generation Error ({e.code}): {err_msg[:250]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

# ==========================================
# PARSER & 2D-to-3D PROCEDURAL ENDPOINTS
# ==========================================

@app.post("/api/parse-prompt")
def parse_prompt_endpoint(req: PromptParseRequest):
    prompt = req.prompt.lower()
    config = req.base_config or {
        "buildingType": "Residential",
        "style": "Modern",
        "floors": 2,
        "wallHeight": 3.2,
        "wallThickness": 0.25,
        "roofType": "flat",
        "exteriorMaterial": "white_concrete",
        "dimensions": {"width": 14, "length": 16, "height": 6.8},
        "features": ["balcony", "landscaped_garden"]
    }

    changes = []
    affected = []

    # Detect style
    styles = ["minimalist", "traditional", "luxury", "contemporary", "mediterranean", "tropical", "industrial"]
    for s in styles:
        if s in prompt:
            config["style"] = s.capitalize()
            changes.append(f"Style updated to {config['style']}")
            affected.append("Architectural Style")
            break

    # Detect roof
    if "flat roof" in prompt or "flat" in prompt:
        config["roofType"] = "flat"
        changes.append("Roof changed to Flat Cantilever")
        affected.append("Roof Geometry")
    elif "pitched" in prompt or "sloping" in prompt or "gable" in prompt:
        config["roofType"] = "pitched"
        changes.append("Roof changed to Pitched Gable")
        affected.append("Roof Geometry")

    # Detect materials
    if "white concrete" in prompt or "concrete" in prompt:
        config["exteriorMaterial"] = "white_concrete"
        changes.append("Exterior material set to White Concrete")
        affected.append("Wall Material")
    elif "wood" in prompt or "timber" in prompt:
        config["exteriorMaterial"] = "wood_panel"
        changes.append("Exterior material set to Architectural Wood Panels")
        affected.append("Wall Material")
    elif "glass" in prompt:
        config["exteriorMaterial"] = "glass"
        changes.append("Exterior material set to Structural Glass")
        affected.append("Wall Material")

    # Detect features
    features = config.get("features", [])
    if "pool" in prompt or "swimming pool" in prompt:
        if "swimming_pool" not in features and "remove" not in prompt:
            features.append("swimming_pool")
            changes.append("Added outdoor swimming pool")
            affected.append("Landscape: Pool")
    if "balcony" in prompt:
        if "balcony" not in features and "remove" not in prompt:
            features.append("balcony")
            changes.append("Added first-floor cantilevered balcony")
            affected.append("Architecture: Balcony")
    if "garden" in prompt:
        if "landscaped_garden" not in features and "remove" not in prompt:
            features.append("landscaped_garden")
            changes.append("Added landscaped garden")
            affected.append("Landscape: Garden")

    config["features"] = list(set(features))

    return {
        "success": True,
        "scene_config": config,
        "changes": changes if changes else ["Analyzed prompt and calibrated architectural parameters."],
        "affected_components": list(set(affected))
    }

@app.post("/api/convert-2d-3d")
def convert_2d_to_3d_endpoint(req: Convert2DRequest):
    valid_elements = [el for el in req.elements if el.get("type") in ["wall", "line", "rect", "door", "window"]]
    
    return {
        "success": True,
        "element_count": len(valid_elements),
        "wall_height": req.wall_height,
        "wall_thickness": req.wall_thickness,
        "material": req.material,
        "status": "Geometry Extrusion Ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
