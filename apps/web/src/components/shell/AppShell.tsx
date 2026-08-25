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
  Flag,
  X,
  Plus,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Cpu,
  Compass
} from 'lucide-react';
import { HelpDrawer } from '../ui/HelpDrawer';
import { OnboardingTour } from '../onboarding/OnboardingTour';

interface AppShellProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activePath, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Grouped Navigation Sections
  const navSections = [
    {
      title: 'PLANNING & DECISIONS',
      items: [
        { label: 'Dashboard Command', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Procurement Requests', path: '/procurement', icon: FileSpreadsheet, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] }
      ]
    },
    {
      title: 'REFERENCE DATA',
      items: [
        { label: 'Ports Registry', path: '/ports', icon: Anchor, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Vessels Registry', path: '/vessels', icon: Ship, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] }
      ]
    },
    {
      title: 'DATA INGESTION',
      items: [
        { label: 'Data Ingestion Studio', path: '/ingestion', icon: Database, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST'] }
      ]
    },
    {
      title: 'SYSTEM & HELP',
      items: [
        { label: 'System Architecture', path: '/architecture', icon: Cpu, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Future Scope Roadmap', path: '/roadmap', icon: Compass, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Maritime Glossary', path: '/glossary', icon: BookOpen, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Audit Log Viewer', path: '/audit', icon: ShieldCheck, roles: ['ADMIN'] }
      ]
    }
  ];

  const handleCommandSelect = (path: string) => {
    setIsCommandOpen(false);
    setCommandQuery('');
    onNavigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500/10 selection:text-orange-900">
      {/* Subtle Tri-Color Accent Line */}
      <div className="h-1 w-full tricolor-stripe" />

      {/* Main Header */}
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
            FIQ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base font-display">FreightIQ</span>
              <span className="px-2.5 py-0.5 tricolor-badge text-[10px] font-semibold text-slate-700 rounded-full flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-india-saffron" />
                <span>SIH26006 • East Coast Hub</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Smart India Bulk Chartering Platform</p>
          </div>
        </div>

        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-mono text-slate-500 transition-colors w-72 justify-between cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search routes, ports, vessels...</span>
          </div>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-400 font-bold shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-200/80 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-700">{user?.organizationName}</span>
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200/80">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user?.fullName}</div>
              <div className="text-[10px] text-emerald-700 font-semibold font-mono uppercase">{user?.role}</div>
            </div>
          </div>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            title="FreightIQ Help & Guided Tour"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
          >
            <HelpCircle className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline font-semibold">Help</span>
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Minimal Sidebar */}
        <aside className="w-60 bg-white border-r border-slate-200/80 p-4 space-y-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-5">
            {navSections.map((sec, sIdx) => {
              const visibleItems = sec.items.filter((item) => user && item.roles.includes(user.role));
              if (visibleItems.length === 0) return null;
              return (
                <div key={sIdx} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    {sec.title}
                  </div>
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePath === item.path || (activePath === '/' && item.path === '/');
                    return (
                      <button
                        key={item.path}
                        onClick={() => onNavigate(item.path)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer Card */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1 mt-auto">
            <div className="flex items-center justify-between text-slate-800 font-semibold text-[11px]">
              <span className="flex items-center gap-1.5 font-sans">
                <Flag className="w-3.5 h-3.5 text-orange-500" /> East Coast Hub
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-md font-mono font-bold">
                LIVE
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed font-mono pt-0.5">
              Paradip • Vizag • Haldia • Gangavaram • Dhamra
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">{children}</main>
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
      {isCommandOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-in fade-in"
          onClick={() => setIsCommandOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3 flex-1 mr-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search pages, East Coast ports, vessels..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-900 text-xs focus:outline-none placeholder-slate-400 font-sans"
                />
              </div>

              <button
                onClick={() => setIsCommandOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto font-sans text-xs">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Pages & Navigation
              </div>

              {navSections
                .flatMap((s) => s.items)
                .filter((n) => user && n.roles.includes(user.role) && n.label.toLowerCase().includes(commandQuery.toLowerCase()))
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleCommandSelect(item.path)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50 rounded-xl text-slate-700 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                        <span className="font-medium text-slate-900">{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
