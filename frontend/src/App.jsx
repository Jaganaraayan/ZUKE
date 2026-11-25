import React, { lazy, Suspense } from 'react';
import useAppStore from './store/useAppStore';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MobileNavBar from './components/MobileNavBar';
import './styles/app.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const SketchStudio = lazy(() => import('./pages/SketchStudio'));
const UploadConvert = lazy(() => import('./pages/UploadConvert'));
const AIGenerator = lazy(() => import('./pages/AIGenerator'));
const Workspace3D = lazy(() => import('./pages/Workspace3D'));
const PresetLibrary = lazy(() => import('./pages/PresetLibrary'));
const ProjectManager = lazy(() => import('./pages/ProjectManager'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const TextToImage = lazy(() => import('./pages/TextToImage'));
const MaterialStudio = lazy(() => import('./pages/MaterialStudio'));
const VersionHistory = lazy(() => import('./pages/VersionHistory'));
const WalkthroughMode = lazy(() => import('./pages/WalkthroughMode'));

function LoadingFallback() {
  return (
    <div className="page-loading">
      <div className="spinner spinner-lg"></div>
      <p>Loading workspace...</p>
    </div>
  );
}

function App() {
  const currentPage = useAppStore((s) => s.currentPage);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'sketch': return <SketchStudio />;
      case 'upload': return <UploadConvert />;
      case 'generator': return <AIGenerator />;
      case 'workspace3d': return <Workspace3D />;
      case 'presets': return <PresetLibrary />;
      case 'projects': return <ProjectManager />;
      case 'settings': return <SettingsPage />;
      case 'texttoimage': return <TextToImage />;
      case 'materials': return <MaterialStudio />;
      case 'versions': return <VersionHistory />;
      case 'walkthrough': return <WalkthroughMode />;
      default: return <Dashboard />;
    }
  };

  const isFullWidth = ['sketch', 'workspace3d', 'upload', 'walkthrough', 'texttoimage'].includes(currentPage);

  return (
    <div className={`app-root ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="main-area">
        {!isFullWidth && <Topbar />}
        <main className={`main-content ${isFullWidth ? 'full-width' : ''}`}>
          <Suspense fallback={<LoadingFallback />}>
            {renderPage()}
          </Suspense>
        </main>
        <MobileNavBar />
      </div>
    </div>
  );
}

export default App;
