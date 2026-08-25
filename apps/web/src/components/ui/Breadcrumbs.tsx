import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  activePath: string;
  onNavigate: (path: string) => void;
  requestTitle?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activePath, onNavigate, requestTitle }) => {
  const getBreadcrumbItems = () => {
    switch (activePath) {
      case '/':
        return [{ label: 'Dashboard Command', path: '/' }];
      case '/ports':
        return [{ label: 'Dashboard', path: '/' }, { label: 'Ports Registry', path: '/ports' }];
      case '/vessels':
        return [{ label: 'Dashboard', path: '/' }, { label: 'Vessels Registry', path: '/vessels' }];
      case '/procurement':
        return [{ label: 'Dashboard', path: '/' }, { label: 'Procurement Requests', path: '/procurement' }];
      case '/ingestion':
        return [{ label: 'Dashboard', path: '/' }, { label: 'Data Ingestion Studio', path: '/ingestion' }];
      case '/architecture':
        return [{ label: 'Dashboard', path: '/' }, { label: 'System Architecture', path: '/architecture' }];
      case '/roadmap':
        return [{ label: 'Dashboard', path: '/' }, { label: 'Future Scope Roadmap', path: '/roadmap' }];
      case '/glossary':
        return [{ label: 'Dashboard', path: '/' }, { label: 'Maritime Glossary', path: '/glossary' }];
      case '/audit':
        return [{ label: 'Dashboard', path: '/' }, { label: 'Audit Log Viewer', path: '/audit' }];
      default:
        return [{ label: 'Dashboard', path: '/' }];
    }
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-500 mb-3" aria-label="Breadcrumb">
      <button
        onClick={() => onNavigate('/')}
        className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
      >
        <Home className="w-3 h-3 text-slate-400" />
        <span>FreightIQ</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <button
            onClick={() => onNavigate(item.path)}
            className={`transition-colors cursor-pointer ${
              idx === items.length - 1 ? 'font-bold text-slate-900' : 'hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}

      {requestTitle && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="font-bold text-orange-600 truncate max-w-xs">{requestTitle}</span>
        </>
      )}
    </nav>
  );
};
