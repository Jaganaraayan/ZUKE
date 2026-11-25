import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import {
  Settings,
  Sliders,
  Ruler,
  Grid,
  Save,
  Key,
  Shield,
  Info,
  Check,
  CheckCircle2,
  Cpu,
  Monitor,
  Cloud,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('zuke_ai_api_key') || '');
  const [apiEndpoint, setApiEndpoint] = useState(localStorage.getItem('zuke_ai_api_endpoint') || 'http://localhost:8000/api');

  // Google Gemini API credentials & state
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('zuke_gemini_api_key') || '');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [geminiTextModel, setGeminiTextModel] = useState(localStorage.getItem('zuke_gemini_text_model') || 'gemini-2.5-flash');
  const [geminiImageModel, setGeminiImageModel] = useState(localStorage.getItem('zuke_gemini_image_model') || 'gemini-nano-banana-2.1');
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState(null);

  // Cloudflare Workers AI credentials (stored locally and sent to backend securely)
  const [cfAccountId, setCfAccountId] = useState(localStorage.getItem('zuke_cf_account_id') || '');
  const [cfApiToken, setCfApiToken] = useState(localStorage.getItem('zuke_cf_api_token') || '');
  const [cfModel, setCfModel] = useState('@cf/black-forest-labs/flux-1-schnell');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestGeminiConnection = async () => {
    setTestingGemini(true);
    setGeminiTestResult(null);

    const baseUrl = apiEndpoint.replace(/\/api\/?$/, '');
    try {
      const res = await fetch(`${baseUrl}/api/gemini/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: geminiApiKey.trim() || undefined,
          model: geminiTextModel
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || `Server error ${res.status}`);
      }

      setGeminiTestResult({
        success: true,
        message: data.message || 'Connected to Google Gemini API!'
      });
    } catch (err) {
      setGeminiTestResult({
        success: false,
        message: err.message || 'Gemini connection failed. Check your API key.'
      });
    } finally {
      setTestingGemini(false);
    }
  };

  const handleClearGeminiConfig = () => {
    setGeminiApiKey('');
    localStorage.removeItem('zuke_gemini_api_key');
    setGeminiTestResult(null);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    const baseUrl = apiEndpoint.replace(/\/api\/?$/, '');
    try {
      const res = await fetch(`${baseUrl}/api/cloudflare/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: cfAccountId.trim() || undefined,
          api_token: cfApiToken.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || `Server error ${res.status}`);
      }

      setTestResult({
        success: true,
        message: data.message || 'Successfully connected to Cloudflare Workers AI!'
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed. Check Account ID, Token, and Backend URL.'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('zuke_ai_api_key', apiKey);
    localStorage.setItem('zuke_ai_api_endpoint', apiEndpoint);
    localStorage.setItem('zuke_cf_account_id', cfAccountId);
    localStorage.setItem('zuke_cf_api_token', cfApiToken);
    localStorage.setItem('zuke_gemini_api_key', geminiApiKey);
    localStorage.setItem('zuke_gemini_text_model', geminiTextModel);
    localStorage.setItem('zuke_gemini_image_model', geminiImageModel);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={22} className="text-accent" />
            <h1 className="text-2xl font-bold">Studio Settings & Configuration</h1>
          </div>
          <p className="text-sm text-muted">Customize drawing dimensions, unit systems, and AI provider integrations.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Section 1: Architectural Dimensions */}
        <div className="panel flex flex-col gap-4">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
            <Ruler size={16} />
            <span>Architectural Standards & Units</span>
          </div>

          <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="label">Unit System</label>
              <select
                className="select-input"
                value={settings.measurementUnit}
                onChange={(e) => updateSettings({ measurementUnit: e.target.value })}
              >
                <option value="meters">Metric (Meters, Centimeters)</option>
                <option value="feet">Imperial (Feet, Inches)</option>
              </select>
            </div>

            <div>
              <label className="label">Default Wall Height</label>
              <select
                className="select-input"
                value={settings.defaultWallHeight}
                onChange={(e) => updateSettings({ defaultWallHeight: Number(e.target.value) })}
              >
                <option value={2.8}>2.8 Meters (Standard Residential)</option>
                <option value={3.0}>3.0 Meters (High Ceiling)</option>
                <option value={3.2}>3.2 Meters (Luxury Residential)</option>
                <option value={3.6}>3.6 Meters (Commercial / Office)</option>
              </select>
            </div>

            <div>
              <label className="label">Default Wall Thickness</label>
              <select
                className="select-input"
                value={settings.defaultWallThickness}
                onChange={(e) => updateSettings({ defaultWallThickness: Number(e.target.value) })}
              >
                <option value={0.15}>0.15m (Interior Partition)</option>
                <option value={0.20}>0.20m (Standard Brick)</option>
                <option value={0.25}>0.25m (Reinforced Exterior)</option>
                <option value={0.30}>0.30m (Heavy Masonry)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded" style={{ background: 'var(--bg-primary)' }}>
                <input
                  type="checkbox"
                  checked={settings.gridSnapping}
                  onChange={(e) => updateSettings({ gridSnapping: e.target.checked })}
                />
                <span>Enable Grid Snapping by Default</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Google Gemini API Integration */}
        <div className="panel flex flex-col gap-4">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Google Gemini Developer API (Google AI Studio)</span>
          </div>

          <div className="p-3 rounded text-xs leading-relaxed" style={{ background: 'var(--accent-bg)', border: '1px solid rgba(198,155,101,0.2)' }}>
            <div className="flex items-center gap-1 font-semibold text-accent mb-1">
              <Shield size={14} />
              <span>Official Gemini Developer API Integration</span>
            </div>
            Powers architectural prompt enhancement, material recommendations, design reasoning via free-tier <strong>gemini-2.5-flash</strong>, and native architectural visualization via <strong>gemini-nano-banana-2.1</strong>. Keys are stored safely and proxied through the ZUKE backend.
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="label">Google AI Studio API Key (GEMINI_API_KEY)</label>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs flex items-center gap-1 text-muted"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                >
                  {showGeminiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showGeminiKey ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showGeminiKey ? 'text' : 'password'}
                className="input"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (from Google AI Studio)"
              />
              <span className="text-xs text-muted mt-1 block">
                Get your key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-accent underline">aistudio.google.com</a>. Free-tier models incur zero cost.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label">Architectural Reasoning Model (Free Tier)</label>
                <select
                  className="select-input"
                  value={geminiTextModel}
                  onChange={(e) => setGeminiTextModel(e.target.value)}
                >
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended, Free Tier)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Fast, Free Tier)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Deep Reasoning)</option>
                </select>
              </div>

              <div>
                <label className="label">Image Generation Model</label>
                <select
                  className="select-input"
                  value={geminiImageModel}
                  onChange={(e) => setGeminiImageModel(e.target.value)}
                >
                  <option value="gemini-nano-banana-2.1">gemini-nano-banana-2.1 (Google Image Model)</option>
                  <option value="gemini-3.1-flash-image">gemini-3.1-flash-image (Nano Banana 2)</option>
                  <option value="gemini-3-pro-image">gemini-3-pro-image (Nano Banana Pro)</option>
                </select>
              </div>
            </div>

            <div className="p-2.5 rounded text-xs bg-dark border border-subtle text-muted">
              ℹ️ <strong>Billing Transparency:</strong> Free-tier Gemini accounts can freely run prompt analysis, material suggestions, and architectural enhancement. Image-generation models like <code>gemini-nano-banana-2.1</code> in Google AI Studio may require billing to be enabled on your Google Cloud project. If billing is inactive, you can use the built-in free Cloudflare FLUX.1 tier below!
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleTestGeminiConnection}
                disabled={testingGemini}
              >
                {testingGemini ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Pinging Google Gemini API...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Test Gemini Connection</span>
                  </>
                )}
              </button>

              {geminiApiKey && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm text-danger"
                  onClick={handleClearGeminiConfig}
                  title="Clear Gemini Configuration"
                >
                  <Trash2 size={13} />
                  <span>Clear Gemini Key</span>
                </button>
              )}

              {geminiTestResult && (
                <span className={`flex items-center gap-1.5 text-xs ${geminiTestResult.success ? 'text-success' : 'text-danger'}`}>
                  {geminiTestResult.success ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>{geminiTestResult.message}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Cloudflare Workers AI */}
        <div className="panel flex flex-col gap-4">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
            <Cloud size={16} />
            <span>Cloudflare Workers AI (FREE Tier) – FLUX.1 Schnell</span>
          </div>

          <div className="p-3 rounded text-xs leading-relaxed" style={{ background: 'var(--accent-bg)', border: '1px solid rgba(198,155,101,0.2)' }}>
            <div className="flex items-center gap-1 font-semibold text-accent mb-1">
              <Shield size={14} />
              <span>Free Image Generation Provider</span>
            </div>
            Uses Cloudflare Workers AI with <strong>@cf/black-forest-labs/flux-1-schnell</strong>. Requests are securely proxied through the ZUKE backend — API credentials are never exposed publicly in browser network logs or client bundles.
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="label">Backend API URL</label>
              <input
                type="text"
                className="input"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="http://localhost:8000/api"
              />
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label">Cloudflare Account ID</label>
                <input
                  type="text"
                  className="input"
                  value={cfAccountId}
                  onChange={(e) => setCfAccountId(e.target.value)}
                  placeholder="e.g. 7c94b29a... (from Cloudflare Dashboard)"
                />
              </div>

              <div>
                <label className="label">Cloudflare API Token</label>
                <input
                  type="password"
                  className="input"
                  value={cfApiToken}
                  onChange={(e) => setCfApiToken(e.target.value)}
                  placeholder="Workers AI token with Read permissions"
                />
              </div>
            </div>

            <div>
              <label className="label">AI Model</label>
              <input
                type="text"
                className="input"
                value={cfModel}
                disabled
                style={{ opacity: 0.8, background: 'rgba(255,255,255,0.03)' }}
              />
              <span className="text-xs text-muted mt-1 block">
                Default: <strong>@cf/black-forest-labs/flux-1-schnell</strong> (free tier fast architectural image synthesis).
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleTestConnection}
                disabled={testingConnection}
              >
                {testingConnection ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Pinging Cloudflare Workers AI...</span>
                  </>
                ) : (
                  <>
                    <Cloud size={14} />
                    <span>Test Cloudflare Connection</span>
                  </>
                )}
              </button>

              {testResult && (
                <span className={`flex items-center gap-1.5 text-xs ${testResult.success ? 'text-success' : 'text-danger'}`}>
                  {testResult.success ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>{testResult.message}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: System Diagnostics */}
        <div className="panel flex flex-col gap-3">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
            <Monitor size={16} />
            <span>Platform Status & Capabilities</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div className="p-3 rounded" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <span className="text-muted block mb-1">Graphics Engine</span>
              <strong className="text-accent">Three.js WebGL2</strong>
            </div>
            <div className="p-3 rounded" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <span className="text-muted block mb-1">Model Exporters</span>
              <strong className="text-accent">GLTF / GLB / OBJ</strong>
            </div>
            <div className="p-3 rounded" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <span className="text-muted block mb-1">Persistence</span>
              <strong className="text-accent">IndexedDB + LocalStorage</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 size={16} />
              <span>Settings saved successfully!</span>
            </span>
          ) : <div />}

          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
