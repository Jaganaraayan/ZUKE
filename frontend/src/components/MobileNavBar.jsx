import React from 'react';
import useAppStore from '../store/useAppStore';
import {
  LayoutDashboard,
  Sparkles,
  Box,
  PenTool,
  UploadCloud,
  Menu
} from 'lucide-react';

export default function MobileNavBar() {
  const currentPage = useAppStore((s) => s.currentPage);
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);
  const toggleMobileMenu = useAppStore((s) => s.toggleMobileMenu);

  const PRIMARY_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'generator', label: 'AI Gen', icon: Sparkles },
    { id: 'workspace3d', label: '3D View', icon: Box },
    { id: 'sketch', label: 'Sketch', icon: PenTool },
    { id: 'upload', label: 'Render', icon: UploadCloud }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {PRIMARY_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
      <button
        className="mobile-nav-btn"
        onClick={toggleMobileMenu}
        aria-label="More options"
      >
        <Menu size={18} />
        <span>Menu</span>
      </button>
    </nav>
  );
}
