import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Anchor,
  Ship,
  FileSpreadsheet,
  Database,
  ShieldCheck,
  LogOut,
  Building2,
  Search,
  HelpCircle,
  BookOpen,
  Cpu,
  Compass,
  Radio,
  Sparkles,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { HelpDrawer } from '../ui/HelpDrawer';
import { OnboardingTour } from '../onboarding/OnboardingTour';
import { CommandPaletteModal } from '../ui/CommandPaletteModal';
import { SystemWorkingModal } from '../ui/SystemWorkingModal';
import { FreightIQLogo } from '../ui/FreightIQLogo';

interface AppShellProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activePath, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isWorkingModalOpen, setIsWorkingModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('freightiq_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('freightiq_sidebar_collapsed', String(next));
      return next;
    });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Procurement Requests', path: '/procurement', icon: FileSpreadsheet, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] }
      ]
    },
    {
      title: 'REGISTRIES & FEEDS',
      items: [
        { label: 'Ports Registry', path: '/ports', icon: Anchor, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Vessels Registry', path: '/vessels', icon: Ship, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Data Ingestion Studio', path: '/ingestion', icon: Database, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST'] }
      ]
    },
    {
      title: 'SYSTEM & GOVERNANCE',
      items: [
        { label: 'About Systems', path: '/about', icon: Info, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Engine Architecture', path: '/architecture', icon: Cpu, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Maritime Glossary', path: '/glossary', icon: BookOpen, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Audit Trail Logs', path: '/audit', icon: ShieldCheck, roles: ['ADMIN'] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Main Header - Clean, Box-Less, Elegant White Design */}
      <header className="h-16 bg-white border-b border-blue-100 px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand Logo & Retractable Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-blue-500" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-500" />
            )}
          </button>

          <div className="flex items-center space-x-2.5 cursor-pointer group" onClick={() => onNavigate('/')}>
            <FreightIQLogo size={32} className="text-slate-900 transition-transform group-hover:scale-105" />
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-slate-900 tracking-tight text-lg font-serif">FreightIQ</span>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Maritime Decision Engine</span>
            </div>
          </div>
        </div>

        {/* Minimalist Command Search Trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-blue-100 rounded-lg text-xs font-mono text-slate-500 transition-all cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span>Search routes, ports, vessels...</span>
          <kbd className="text-[10px] text-slate-400 font-mono pl-2 opacity-70">
            ⌘K
          </kbd>
        </button>

        {/* Clean Right Actions */}
        <div className="flex items-center space-x-5 text-xs font-sans">
          {/* About Link */}
          <button
            onClick={() => onNavigate('/about')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePath === '/about' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About</span>
          </button>

          {/* Working Engines Link */}
          <button
            onClick={() => setIsWorkingModalOpen(true)}
            className="text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Working</span>
          </button>

          {/* Help Link */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Help</span>
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-slate-200" />

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs font-mono border border-blue-200">
              {user?.fullName?.charAt(0)}
            </div>
            <span className="hidden lg:inline text-xs font-medium text-slate-800">
              {user?.fullName}
            </span>
          </div>

          {/* Logout Icon */}
          <button
            onClick={logout}
            title="Sign Out"
            className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Retractable Sidebar */}
        <aside
          className={`bg-white border-r border-blue-100 p-3 space-y-5 flex flex-col justify-between shrink-0 overflow-y-auto transition-all duration-200 ${
            isSidebarCollapsed ? 'w-16 items-center' : 'w-60'
          }`}
        >
          <div className="space-y-5 w-full">
            {navSections.map((sec, sIdx) => {
              const visibleItems = sec.items.filter((item) => user && item.roles.includes(user.role));
              if (visibleItems.length === 0) return null;
              return (
                <div key={sIdx} className="space-y-1">
                  {!isSidebarCollapsed && (
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold truncate">
                      {sec.title}
                    </div>
                  )}
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePath === item.path || (activePath === '/' && item.path === '/');
                    return (
                      <button
                        key={item.path}
                        onClick={() => onNavigate(item.path)}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`w-full flex items-center rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2.5'
                        } ${
                          isActive
                            ? 'bg-blue-500 text-white font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer Quick Action */}
          <div className="mt-auto space-y-2 w-full">
            <button
              onClick={() => setIsWorkingModalOpen(true)}
              title="5 Stack Working Engines"
              className={`w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-mono font-bold flex items-center transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse shrink-0" />
                {!isSidebarCollapsed && <span>Working Engines</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[9px] px-1.5 py-0.5 bg-blue-700 text-blue-100 rounded font-bold">
                  5 STACK
                </span>
              )}
            </button>

            {!isSidebarCollapsed && (
              <div className="p-3 bg-slate-50 rounded-lg border border-blue-100 text-xs space-y-1 font-mono">
                <div className="flex items-center justify-between text-slate-800 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-blue-500 animate-pulse" /> East Coast Desk
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">
                    ONLINE
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate pt-0.5">
                  Paradip • Vizag • Dhamra
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white text-slate-800">{children}</main>
      </div>

      {/* Help Overlay */}
      <HelpDrawer
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onRestartTour={() => setIsTourOpen(true)}
        onNavigateToGlossary={() => onNavigate('/glossary')}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* Search Command Modal */}
      <CommandPaletteModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={onNavigate}
      />

      {/* System Architecture "Working" Modal */}
      <SystemWorkingModal
        isOpen={isWorkingModalOpen}
        onClose={() => setIsWorkingModalOpen(false)}
      />
    </div>
  );
};
