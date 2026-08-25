import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { AppShell } from './components/shell/AppShell';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PortsPage } from './pages/PortsPage';
import { VesselsPage } from './pages/VesselsPage';
import { ProcurementPage } from './pages/ProcurementPage';
import { DataIngestionPage } from './pages/DataIngestionPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { AuditPage } from './pages/AuditPage';

export const App: React.FC = () => {
  const { isAuthenticated, bypassAuth } = useAuthStore();
  const [activePath, setActivePath] = useState(window.location.pathname === '/landing' ? '/landing' : '/');

  if (activePath === '/landing') {
    return (
      <LandingPage
        onStartDemo={() => {
          bypassAuth();
          setActivePath('/');
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activePath) {
      case '/':
        return <DashboardPage onNavigate={setActivePath} />;
      case '/ports':
        return <PortsPage />;
      case '/vessels':
        return <VesselsPage />;
      case '/procurement':
        return <ProcurementPage />;
      case '/ingestion':
        return <DataIngestionPage />;
      case '/architecture':
        return <ArchitecturePage />;
      case '/roadmap':
        return <RoadmapPage />;
      case '/glossary':
        return <GlossaryPage />;
      case '/audit':
        return <AuditPage />;
      default:
        return <DashboardPage onNavigate={setActivePath} />;
    }
  };

  return (
    <AppShell activePath={activePath} onNavigate={setActivePath}>
      {renderContent()}
    </AppShell>
  );
};

export default App;
