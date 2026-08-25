import React from 'react';
import { Layers, Cpu, Server, Database, Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <span>Platform System Architecture & Technical Flow</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            SIH26006 Enterprise Monorepo Topology & High-Performance Decision Engine Pipeline
          </p>
        </div>
        <span className="px-3 py-1 tricolor-badge text-xs font-bold text-slate-800 rounded-full border border-orange-300 font-mono">
          Production Architecture
        </span>
      </div>

      {/* Interactive Visual Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        {/* Node 1: React Frontend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-orange-300 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm font-sans">1. Web Application</div>
          <div className="text-[11px] text-slate-500 font-sans leading-relaxed">
            React 18 + TypeScript + Vite + Tailwind CSS. Minimalist clean light mode with Indian Tri-Color accents.
          </div>
          <div className="pt-2 text-[10px] text-orange-700 font-bold border-t border-slate-100 flex items-center gap-1">
            <span>Port 3000 (Vite HMR)</span>
            <ArrowRight className="w-3 h-3 ml-auto" />
          </div>
        </div>

        {/* Node 2: NestJS API */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm font-sans">2. Backend Gateway</div>
          <div className="text-[11px] text-slate-500 font-sans leading-relaxed">
            Node.js + NestJS REST API with Prisma ORM, SQLite DB, JWT Auth & Audit Logging Interceptors.
          </div>
          <div className="pt-2 text-[10px] text-blue-700 font-bold border-t border-slate-100 flex items-center gap-1">
            <span>Port 4000 (Nest REST)</span>
            <ArrowRight className="w-3 h-3 ml-auto" />
          </div>
        </div>

        {/* Node 3: Python Decision Engine */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-emerald-300 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm font-sans">3. Python Engine</div>
          <div className="text-[11px] text-slate-500 font-sans leading-relaxed">
            FastAPI microservice executing walk-forward ML models, East Coast port constraints, contract strategy & risk engine.
          </div>
          <div className="pt-2 text-[10px] text-emerald-700 font-bold border-t border-slate-100 flex items-center gap-1">
            <span>Port 8000 (FastAPI)</span>
            <ArrowRight className="w-3 h-3 ml-auto" />
          </div>
        </div>

        {/* Node 4: Gemini Flash AI */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2 relative overflow-hidden group hover:border-purple-300 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-900 text-sm font-sans">4. Gemini AI Layer</div>
          <div className="text-[11px] text-slate-500 font-sans leading-relaxed">
            Server-side Gemini 1.5 Flash API synthesizing computed decision engine data into executive reasoning with fallback.
          </div>
          <div className="pt-2 text-[10px] text-purple-700 font-bold border-t border-slate-100 flex items-center gap-1">
            <span>Gemini REST API</span>
          </div>
        </div>
      </div>

      {/* Technical Highlights Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-slate-900 font-sans border-b border-slate-100 pb-2">
          Enterprise Security & Grounded AI Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Zero Hallucination Grounding</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Gemini AI only receives calculated numbers (forecasts, draft constraints, risk matrices) generated deterministically by the Python Decision Engine. It is forbidden by system instructions from inventing freight rates or vessel recommendations.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              <span>Resilient Server-Side Fallback</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              If <code className="bg-slate-200 px-1 rounded text-slate-800">GEMINI_API_KEY</code> is unconfigured or network issues occur, the system silently degrades to template-based analytical reasoning without impacting UI quality or system uptime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
