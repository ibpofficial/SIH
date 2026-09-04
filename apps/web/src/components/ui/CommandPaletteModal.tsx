import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  FileSpreadsheet,
  Database,
  ShieldCheck,
  Anchor,
  Ship,
  Layers,
  Map,
  BookOpen,
  Lock,
  Globe,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'NAVIGATION' | 'ACTION';
  icon: any;
  path?: string;
  action?: () => void;
  shortcut?: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    { id: 'nav-dash', title: 'Executive Command Center', category: 'NAVIGATION', icon: LayoutDashboard, path: '/', shortcut: 'Shift+D' },
    { id: 'nav-procurement', title: 'Bulk Cargo Procurement & Decision Suite', category: 'NAVIGATION', icon: FileSpreadsheet, path: '/procurement', shortcut: 'Shift+P' },
    { id: 'nav-ingest', title: 'Data Ingestion Studio (3-Stage Pipeline)', category: 'NAVIGATION', icon: Database, path: '/ingestion', shortcut: 'Shift+I' },
    { id: 'nav-audit', title: 'Governance & Immutable Audit Log Trail', category: 'NAVIGATION', icon: ShieldCheck, path: '/audit', shortcut: 'Shift+A' },
    { id: 'nav-ports', title: 'East Coast Port Specifications Registry', category: 'NAVIGATION', icon: Anchor, path: '/ports' },
    { id: 'nav-vessels', title: 'Vessel Fleet Registry & Specifications', category: 'NAVIGATION', icon: Ship, path: '/vessels' },
    { id: 'nav-arch', title: 'System Microservice Architecture & Stack', category: 'NAVIGATION', icon: Layers, path: '/architecture' },
    { id: 'nav-roadmap', title: 'Project Implementation Roadmap', category: 'NAVIGATION', icon: Map, path: '/roadmap' },
    { id: 'nav-glossary', title: 'Maritime Chartering Terms & Dictionary', category: 'NAVIGATION', icon: BookOpen, path: '/glossary' },
    { id: 'nav-landing', title: 'FreightIQ Platform Landing Overview', category: 'NAVIGATION', icon: Globe, path: '/landing' },
    { id: 'nav-auth', title: 'Platform Authentication & Roles', category: 'NAVIGATION', icon: Lock, path: '/login' },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          const item = filteredCommands[selectedIndex];
          if (item.path) {
            onNavigate(item.path);
          } else if (item.action) {
            item.action();
          }
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1B2E]/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden font-sans space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar matching Reference 50px input pattern */}
        <div className="p-4 border-b border-slate-200 bg-[#FAFAF8] flex items-center justify-between gap-3">
          <div className="inputForm w-full">
            <Search className="w-5 h-5 text-sky-600 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search terminal commands, routes, or features... (Ctrl+K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input font-mono text-xs text-[#0F1B2E]"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-mono shrink-0 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Command Items List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1 font-mono text-xs">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-sans text-xs">
              No matching commands or routes found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const IconComp = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    if (cmd.path) onNavigate(cmd.path);
                    else if (cmd.action) cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 border border-sky-300 text-sky-900 shadow-xs'
                      : 'bg-white border border-transparent text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-sans font-bold text-[#0F1B2E]">{cmd.title}</div>
                      <div className="text-[10px] text-slate-500">{cmd.path || cmd.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {cmd.shortcut && (
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 font-mono">
                        {cmd.shortcut}
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-sky-600 translate-x-0.5' : 'text-slate-400'} transition-all`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-[#FAFAF8] border-t border-slate-200 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span><strong className="text-slate-700">↑↓</strong> Navigate</span>
            <span><strong className="text-slate-700">Enter</strong> Select</span>
            <span><strong className="text-slate-700">Esc</strong> Close</span>
          </div>
          <div className="text-sky-700 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>FreightIQ Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};
