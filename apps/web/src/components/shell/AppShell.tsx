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
  Sparkles
} from 'lucide-react';
import { HelpDrawer } from '../ui/HelpDrawer';
import { OnboardingTour } from '../onboarding/OnboardingTour';
import { CommandPaletteModal } from '../ui/CommandPaletteModal';
import { SystemWorkingModal } from '../ui/SystemWorkingModal';

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
        { label: '⚡ How Engines Work (Stack)', path: '/architecture', icon: Cpu, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Future Scope Roadmap', path: '/roadmap', icon: Compass, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Maritime Glossary', path: '/glossary', icon: BookOpen, roles: ['ADMIN', 'PROCUREMENT_MANAGER', 'ANALYST', 'VIEWER'] },
        { label: 'Audit Log Viewer', path: '/audit', icon: ShieldCheck, roles: ['ADMIN'] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F1B2E] flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-900">
      {/* Top Structural Accent Line */}
      <div className="h-1 w-full bg-[#0F1B2E]" />

      {/* Main Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand Logo & Tag */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-[#0F1B2E] text-white font-serif font-extrabold text-sm flex items-center justify-center border border-slate-700 shadow-sm">
            FIQ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#0F1B2E] tracking-tight text-base font-serif">FreightIQ</span>
              <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold rounded-md flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span>SIH26006 • MARITIME SUITE</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Steel Ministry Chartering Desk & Decision Engine</p>
          </div>
        </div>

        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setIsCommandOpen(true)}
          className="hidden md:flex items-center space-x-2 px-3.5 py-2 bg-[#FAFAF8] hover:bg-slate-100 border border-slate-200 hover:border-sky-500/60 rounded-xl text-xs font-mono text-slate-500 transition-all w-80 justify-between cursor-pointer group shadow-xs"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
            <span>Search routes, ports, vessels...</span>
          </div>
          <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700 font-bold font-mono">
            ⌘K / Ctrl+K
          </kbd>
        </button>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-[#FAFAF8] rounded-xl border border-slate-200 text-xs">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-[#0F1B2E] font-sans">{user?.organizationName}</span>
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 font-bold text-xs font-mono">
              {user?.fullName?.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-[#0F1B2E] leading-tight font-sans">{user?.fullName}</div>
              <div className="text-[10px] text-emerald-700 font-bold font-mono uppercase">{user?.role}</div>
            </div>
          </div>

          {/* Working / System Architecture Button */}
          <button
            onClick={() => setIsWorkingModalOpen(true)}
            title="See live 5 microservices, data contribution, and response latencies"
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 font-mono text-xs font-bold shadow-xs hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Working</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            title="FreightIQ Help & Guided Tour"
            className="p-2 text-slate-600 hover:text-sky-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline font-bold">Help</span>
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Instrument Sidebar */}
        <aside className="w-60 bg-white border-r border-slate-200 p-4 space-y-5 flex flex-col justify-between shrink-0 overflow-y-auto">
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
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0F1B2E] text-white font-bold shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F1B2E]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Sidebar Quick Button for 5 Engines Stack */}
          <div className="mt-auto space-y-2">
            <button
              onClick={() => setIsWorkingModalOpen(true)}
              className="w-full py-2.5 px-3 bg-[#0F1B2E] hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Working Engines</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold">
                5 STACK
              </span>
            </button>

            {/* Footer Terminal Card */}
            <div className="p-3.5 bg-[#FAFAF8] rounded-2xl border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-[#0F1B2E] font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" /> East Coast Desk
                </span>
                <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold">
                  ONLINE
                </span>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed pt-0.5">
                Paradip • Vizag • Haldia • Dhamra
              </div>
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#FAFAF8] text-[#0F1B2E]">{children}</main>
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
