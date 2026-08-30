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
  X,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Cpu,
  Compass,
  Radio
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
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F1B2E] flex flex-col font-sans selection:bg-[#A9793A]/20 selection:text-[#0F1B2E]">
      {/* Top Thin Structural Border */}
      <div className="h-1 w-full bg-[#0F1B2E]" />

      {/* Main Header */}
      <header className="h-16 bg-white border-b border-[#0F1B2E]/10 px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-9 h-9 rounded-lg bg-[#0F1B2E] text-white font-serif font-extrabold text-sm flex items-center justify-center border border-[#A9793A]/40 shadow-xs">
            FIQ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#0F1B2E] tracking-tight text-base font-serif">FreightIQ</span>
              <span className="px-2 py-0.5 bg-[#FAF4EB] text-[#A9793A] border border-[#A9793A]/30 text-[10px] font-bold rounded flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A9793A]" />
                <span>SIH26006 • MARITIME INSTRUMENT</span>
              </span>
            </div>
            <p className="text-[10px] text-[#3E5871] font-mono">Steel Ministry Chartering & Decision Suite</p>
          </div>
        </div>

        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 bg-[#FAFAF8] hover:bg-slate-100 border border-[#0F1B2E]/10 rounded-lg text-xs font-mono text-[#3E5871] transition-colors w-72 justify-between cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#3E5871]" />
            <span>Search routes, ports, vessels...</span>
          </div>
          <kbd className="px-1.5 py-0.5 bg-white border border-[#0F1B2E]/10 rounded text-[10px] text-[#3E5871] font-bold">
            ⌘K
          </kbd>
        </button>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-[#FAFAF8] rounded-md border border-[#0F1B2E]/10 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#3E5871]" />
            <span className="font-semibold text-[#0F1B2E] font-sans">{user?.organizationName}</span>
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-[#0F1B2E]/10">
            <div className="w-8 h-8 rounded-full bg-[#FAF4EB] border border-[#A9793A]/40 flex items-center justify-center text-[#A9793A] font-bold text-xs font-mono">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-[#0F1B2E] leading-tight font-sans">{user?.fullName}</div>
              <div className="text-[10px] text-[#2D6A4F] font-bold font-mono uppercase">{user?.role}</div>
            </div>
          </div>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            title="FreightIQ Help & Guided Tour"
            className="p-2 text-[#3E5871] hover:text-[#0F1B2E] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
          >
            <HelpCircle className="w-4 h-4 text-[#A9793A]" />
            <span className="hidden sm:inline font-bold">Help</span>
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-[#3E5871] hover:text-[#A32D2D] hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Instrument Sidebar */}
        <aside className="w-60 bg-white border-r border-[#0F1B2E]/10 p-4 space-y-5 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-5">
            {navSections.map((sec, sIdx) => {
              const visibleItems = sec.items.filter((item) => user && item.roles.includes(user.role));
              if (visibleItems.length === 0) return null;
              return (
                <div key={sIdx} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#3E5871] font-bold">
                    {sec.title}
                  </div>
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePath === item.path || (activePath === '/' && item.path === '/');
                    return (
                      <button
                        key={item.path}
                        onClick={() => onNavigate(item.path)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#0F1B2E] text-white shadow-xs font-bold'
                            : 'text-[#3E5871] hover:bg-[#FAFAF8] hover:text-[#0F1B2E]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#A9793A]' : 'text-[#3E5871]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer Card */}
          <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-[#0F1B2E]/10 text-xs space-y-1 mt-auto font-mono">
            <div className="flex items-center justify-between text-[#0F1B2E] font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#A9793A] animate-pulse" /> East Coast Hub
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-[#F0F7F4] text-[#2D6A4F] border border-[#2D6A4F]/30 rounded font-bold">
                ONLINE
              </span>
            </div>
            <div className="text-[10px] text-[#3E5871] leading-relaxed pt-0.5">
              Paradip • Vizag • Haldia • Dhamra
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#FAFAF8]">{children}</main>
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
          className="fixed inset-0 z-50 bg-[#0F1B2E]/40 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-in fade-in"
          onClick={() => setIsCommandOpen(false)}
        >
          <div
            className="bg-white border border-[#0F1B2E]/20 rounded-2xl w-full max-w-xl overflow-hidden shadow-xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#0F1B2E]/10 flex items-center justify-between bg-[#FAFAF8]">
              <div className="flex items-center space-x-3 flex-1 mr-2">
                <Search className="w-4 h-4 text-[#3E5871] shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search pages, East Coast ports, vessels..."
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  className="w-full bg-transparent text-[#0F1B2E] text-xs focus:outline-none placeholder-[#3E5871] font-sans"
                />
              </div>

              <button
                onClick={() => setIsCommandOpen(false)}
                className="p-1 text-[#3E5871] hover:text-[#0F1B2E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto font-sans text-xs">
              <div className="px-3 py-1 text-[10px] font-bold text-[#3E5871] uppercase tracking-wider font-mono">
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
                      className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-[#FAFAF8] rounded-lg text-[#3E5871] text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-[#3E5871] group-hover:text-[#0F1B2E]" />
                        <span className="font-semibold text-[#0F1B2E]">{item.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#3E5871] group-hover:text-[#A9793A]" />
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
