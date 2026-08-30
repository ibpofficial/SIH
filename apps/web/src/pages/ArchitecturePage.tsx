import React from 'react';
import { Layers, Cpu, Server, Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/architecture" onNavigate={() => {}} />

      {/* Title Header */}
      <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] flex items-center gap-2 font-serif">
            <Cpu className="w-5 h-5 text-[#A9793A]" />
            <span>Platform System Architecture & Technical Flow</span>
          </h1>
          <p className="text-xs text-[#3E5871] font-mono mt-0.5">
            SIH26006 Enterprise Monorepo Topology & High-Performance Decision Engine Pipeline
          </p>
        </div>
        <span className="px-3 py-1 bg-[#FAF4EB] text-[#A9793A] border border-[#A9793A]/30 text-xs font-bold rounded font-mono">
          Production Architecture
        </span>
      </div>

      {/* Interactive Visual Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        {/* Node 1: React Frontend */}
        <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-[#A9793A] transition-colors">
          <div className="w-9 h-9 rounded-lg bg-[#FAF4EB] text-[#A9793A] border border-[#A9793A]/30 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#0F1B2E] text-sm font-serif">1. Web Application</div>
          <div className="text-[11px] text-[#3E5871] font-sans leading-relaxed">
            React 18 + TypeScript + Vite + Tailwind CSS. Institutional Light Maritime Instrument design system.
          </div>
          <div className="pt-2 text-[10px] text-[#A9793A] font-bold border-t border-[#0F1B2E]/10 flex items-center gap-1">
            <span>Port 3000 (Vite HMR)</span>
            <ArrowRight className="w-3 h-3 ml-auto" />
          </div>
        </div>

        {/* Node 2: NestJS API */}
        <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-[#2C5282] transition-colors">
          <div className="w-9 h-9 rounded-lg bg-[#EBF8FF] text-[#2C5282] border border-[#2C5282]/30 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#0F1B2E] text-sm font-serif">2. Backend Gateway</div>
          <div className="text-[11px] text-[#3E5871] font-sans leading-relaxed">
            Node.js + NestJS REST API with Prisma ORM, SQLite DB, JWT Auth & Audit Logging Interceptors.
          </div>
          <div className="pt-2 text-[10px] text-[#2C5282] font-bold border-t border-[#0F1B2E]/10 flex items-center gap-1">
            <span>Port 4000 (Nest REST)</span>
            <ArrowRight className="w-3 h-3 ml-auto" />
          </div>
        </div>

        {/* Node 3: Python Decision Engine */}
        <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-[#2D6A4F] transition-colors">
          <div className="w-9 h-9 rounded-lg bg-[#F0F7F4] text-[#2D6A4F] border border-[#2D6A4F]/30 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#0F1B2E] text-sm font-serif">3. Python Engine</div>
          <div className="text-[11px] text-[#3E5871] font-sans leading-relaxed">
            FastAPI microservice executing walk-forward ML models, East Coast port constraints, contract strategy & risk engine.
          </div>
          <div className="pt-2 text-[10px] text-[#2D6A4F] font-bold border-t border-[#0F1B2E]/10 flex items-center gap-1">
            <span>Port 8000 (FastAPI)</span>
            <ArrowRight className="w-3 h-3 ml-auto" />
          </div>
        </div>

        {/* Node 4: Gemini Flash AI */}
        <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-[#A9793A] transition-colors">
          <div className="w-9 h-9 rounded-lg bg-[#FAF4EB] text-[#A9793A] border border-[#A9793A]/30 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-bold text-[#0F1B2E] text-sm font-serif">4. Gemini AI Layer</div>
          <div className="text-[11px] text-[#3E5871] font-sans leading-relaxed">
            Server-side Gemini 1.5 Flash API synthesizing computed decision engine data into executive reasoning with fallback.
          </div>
          <div className="pt-2 text-[10px] text-[#A9793A] font-bold border-t border-[#0F1B2E]/10 flex items-center gap-1">
            <span>Gemini REST API</span>
          </div>
        </div>
      </div>

      {/* Technical Highlights Section */}
      <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-6 shadow-xs space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-[#0F1B2E] font-serif border-b border-[#0F1B2E]/10 pb-2">
          Enterprise Security & Grounded AI Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          <div className="p-4 bg-[#FAFAF8] border border-[#0F1B2E]/10 rounded-lg space-y-2">
            <div className="font-bold text-[#0F1B2E] flex items-center gap-2 font-serif">
              <Shield className="w-4 h-4 text-[#2D6A4F]" />
              <span>Zero Hallucination Grounding</span>
            </div>
            <p className="text-[#3E5871] leading-relaxed">
              Gemini AI only receives calculated numbers (forecasts, draft constraints, risk matrices) generated deterministically by the Python Decision Engine. It is forbidden by system instructions from inventing freight rates or vessel recommendations.
            </p>
          </div>

          <div className="p-4 bg-[#FAFAF8] border border-[#0F1B2E]/10 rounded-lg space-y-2">
            <div className="font-bold text-[#0F1B2E] flex items-center gap-2 font-serif">
              <CheckCircle2 className="w-4 h-4 text-[#A9793A]" />
              <span>Resilient Server-Side Fallback</span>
            </div>
            <p className="text-[#3E5871] leading-relaxed">
              If <code className="bg-slate-200 px-1 rounded text-[#0F1B2E]">GEMINI_API_KEY</code> is unconfigured or network issues occur, the system degrades gracefully to template-based analytical reasoning without impacting UI quality or system uptime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
