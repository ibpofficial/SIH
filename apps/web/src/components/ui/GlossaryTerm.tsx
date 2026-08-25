import React, { useState } from 'react';
import { getGlossaryTerm } from '../../data/glossaryData';
import { HelpCircle, Info } from 'lucide-react';

interface GlossaryTermProps {
  termId: string;
  children?: React.ReactNode;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ termId, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const item = getGlossaryTerm(termId);

  if (!item) {
    return <span>{children || termId}</span>;
  }

  return (
    <span className="relative inline-flex items-center group">
      <span className="border-b border-dashed border-orange-400 font-semibold cursor-help text-slate-900">
        {children || item.abbreviation || item.term}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="ml-1 text-orange-500 hover:text-orange-700 cursor-pointer focus:outline-none"
        aria-label={`Definition for ${item.term}`}
      >
        <HelpCircle className="w-3.5 h-3.5 inline-block" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-slate-100 text-xs rounded-xl shadow-xl z-50 pointer-events-none animate-in fade-in font-sans leading-relaxed">
          <div className="font-bold text-orange-300 border-b border-slate-800 pb-1 mb-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-orange-400" />
            <span>{item.term}</span>
          </div>
          <div className="text-[11px] text-slate-200">{item.shortDefinition}</div>
          <div className="text-[10px] text-slate-400 mt-1 italic">{item.fullExplanation}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </span>
  );
};
