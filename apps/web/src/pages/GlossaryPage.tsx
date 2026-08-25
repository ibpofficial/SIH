import React, { useState } from 'react';
import { glossaryData, GlossaryItem } from '../data/glossaryData';
import { BookOpen, Search, Filter, HelpCircle, ArrowUpRight } from 'lucide-react';

export const GlossaryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = glossaryData.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDefinition.toLowerCase().includes(search.toLowerCase()) ||
      (item.abbreviation && item.abbreviation.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-india-saffron" />
            <span>Maritime Shipping & Analytics Glossary</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Single Source of Truth for Shipping, Port Constraints & ML Analytics Terminology
          </p>
        </div>

        <div className="relative w-full md:w-72 font-mono text-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search term, abbreviation, definition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 font-mono text-xs overflow-x-auto pb-1">
        {['ALL', 'SHIPPING', 'PORT', 'FINANCE', 'ML_ANALYTICS'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 font-sans text-sm flex items-center gap-2">
                <span>{item.term}</span>
                {item.abbreviation && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-mono rounded font-bold">
                    {item.abbreviation}
                  </span>
                )}
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-mono rounded font-bold uppercase border border-slate-200">
                {item.category}
              </span>
            </div>

            <div className="text-xs text-slate-800 font-semibold font-sans leading-relaxed">
              {item.shortDefinition}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans pt-1 border-t border-slate-100">
              {item.fullExplanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
