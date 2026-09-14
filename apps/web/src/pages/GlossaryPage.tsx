import React, { useState } from 'react';
import { glossaryData } from '../data/glossaryData';
import { BookOpen, Search } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

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
      <Breadcrumbs activePath="/glossary" onNavigate={() => {}} />

      {/* Header */}
      <div className="card-theme bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>Maritime Shipping & Analytics Glossary</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Single Source of Truth for Shipping, Port Constraints & ML Analytics Terminology
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="inputForm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search term, abbreviation, definition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input font-sans text-xs text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 font-mono text-xs overflow-x-auto pb-1">
        {['ALL', 'SHIPPING', 'PORT', 'FINANCE', 'ML_ANALYTICS'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
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
          <div key={item.id} className="card-theme bg-white p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 font-sans text-sm flex items-center gap-2">
                <span>{item.term}</span>
                {item.abbreviation && (
                  <span className="text-xs font-mono font-bold text-amber-700">
                    ({item.abbreviation})
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                • {item.category}
              </span>
            </div>

            <div className="text-xs text-slate-900 font-semibold font-sans leading-relaxed">
              {item.shortDefinition}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans pt-2 border-t border-slate-100">
              {item.fullExplanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
