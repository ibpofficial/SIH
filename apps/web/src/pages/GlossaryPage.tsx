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
      <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] flex items-center gap-2 font-serif">
            <BookOpen className="w-5 h-5 text-[#A9793A]" />
            <span>Maritime Shipping & Analytics Glossary</span>
          </h1>
          <p className="text-xs text-[#3E5871] font-mono mt-0.5">
            Single Source of Truth for Shipping, Port Constraints & ML Analytics Terminology
          </p>
        </div>

        <div className="relative w-full md:w-72 font-mono text-xs">
          <Search className="w-4 h-4 text-[#3E5871] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search term, abbreviation, definition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAFAF8] border border-[#0F1B2E]/10 rounded-lg pl-9 pr-3 py-2 text-[#0F1B2E] placeholder-[#3E5871] focus:outline-none focus:border-[#A9793A]"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 font-mono text-xs overflow-x-auto pb-1">
        {['ALL', 'SHIPPING', 'PORT', 'FINANCE', 'ML_ANALYTICS'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0F1B2E] text-white shadow-xs'
                : 'bg-white border border-[#0F1B2E]/10 text-[#3E5871] hover:bg-[#FAFAF8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0F1B2E] font-serif text-sm flex items-center gap-2">
                <span>{item.term}</span>
                {item.abbreviation && (
                  <span className="px-2 py-0.5 bg-[#FAF4EB] text-[#A9793A] border border-[#A9793A]/30 text-[10px] font-mono rounded font-bold">
                    {item.abbreviation}
                  </span>
                )}
              </span>
              <span className="px-2 py-0.5 bg-[#FAFAF8] text-[#3E5871] text-[9px] font-mono rounded font-bold uppercase border border-[#0F1B2E]/10">
                {item.category}
              </span>
            </div>

            <div className="text-xs text-[#0F1B2E] font-semibold font-sans leading-relaxed">
              {item.shortDefinition}
            </div>

            <p className="text-xs text-[#3E5871] leading-relaxed font-sans pt-1 border-t border-[#0F1B2E]/10">
              {item.fullExplanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
