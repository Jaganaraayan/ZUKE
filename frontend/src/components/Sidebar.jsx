import React from 'react';
import useAppStore from '../store/useAppStore';
import {
  Layers,
  LayoutDashboard,
  PenTool,
  UploadCloud,
  Sparkles,
  Box,
  Compass,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  Info,
  Camera,
  Palette,
  History,
  Footprints
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Workspace' },
  { id: 'generator', label: 'AI 3D Generator', icon: Sparkles, section: 'Workspace' },
  { id: 'workspace3d', label: '3D Workspace', icon: Box, section: 'Workspace' },
  { id: 'sketch', label: '2D Sketch Studio', icon: PenTool, section: 'Workspace' },
  { id: 'upload', label: 'Sketch-to-Render', icon: UploadCloud, section: 'Workspace' },
  { id: 'texttoimage', label: 'AI Text-to-Image', icon: Camera, section: 'Workspace' },
  { id: 'materials', label: 'Material Studio', icon: Palette, section: 'Design & Tools' },
  { id: 'walkthrough', label: 'Walkthrough Mode', icon: Footprints, section: 'Design & Tools' },
  { id: 'versions', label: 'My Generation History', icon: History, section: 'Design & Tools' },
  { id: 'presets', label: 'Preset Library (60)', icon: Compass, section: 'Library' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, section: 'Library' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
];

export default function Sidebar() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const mobileMenuOpen = useAppStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);
  const currentProject = useAppStore((s) => s.currentProject);

  const sections = ['Workspace', 'Design & Tools', 'Library', 'System'];

  const handleNavClick = (id) => {
    setCurrentPage(id);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Layers size={22} />
          </div>
          <div className="sidebar-brand">
            <h1>ZUKE</h1>
            <span>AI Architectural Studio</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section} className="nav-section">
              <div className="nav-section-label">{section}</div>
              {NAV_ITEMS.filter((item) => item.section === section).map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <div
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="nav-item-icon">
                      <Icon size={18} />
                    </span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-card">
            <div className="footer-title">
              <Info size={14} />
              <span>Active Project</span>
            </div>
            <p className="truncate">
              {currentProject ? currentProject.name : 'Untitled Project'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
