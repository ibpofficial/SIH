import React, { useEffect, useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { seedFirestoreIfEmpty } from '../lib/firebaseSeed';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import {
  Anchor,
  Ship,
  FileSpreadsheet,
  Database,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Flag,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Zap,
  Upload,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { data: ports } = useFirestoreCollection<any>('ports');
  const { data: vessels } = useFirestoreCollection<any>('vesselTypes');
  const { data: procurements } = useFirestoreCollection<any>('procurementRequests');

  const [viewMode, setViewMode] = useState<'SIMPLE' | 'ADVANCED'>(() => {
    return (localStorage.getItem('freightiq_dash_mode') as any) || 'SIMPLE';
  });

  useEffect(() => {
    seedFirestoreIfEmpty();
  }, []);

  const handleToggleMode = (mode: 'SIMPLE' | 'ADVANCED') => {
    setViewMode(mode);
    localStorage.setItem('freightiq_dash_mode', mode);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs activePath="/" onNavigate={onNavigate} />

      {/* Header Banner with Simple / Advanced Mode Selector */}
      <div className="glass-card rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
              FreightIQ Executive Command Center
            </h1>
            <span className="px-2.5 py-0.5 tricolor-badge text-xs font-bold text-slate-800 rounded-full border border-orange-300">
              SIH26006 • East Coast Hub
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 border border-emerald-300">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>LIVE SYSTEM ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Real-Time Market Rate Forecasting • Port <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Physical Constraint Solver
          </p>
        </div>

        {/* View Mode Toggle: Simple vs Advanced */}
        <div className="flex items-center space-x-2">
          <div className="flex rounded-xl bg-slate-100/90 p-1 font-mono text-xs border border-slate-200 shadow-2xs">
            <button
              onClick={() => handleToggleMode('SIMPLE')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'SIMPLE'
                  ? 'bg-white text-orange-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => handleToggleMode('ADVANCED')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'ADVANCED'
                  ? 'bg-white text-orange-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Detailed Analytics
            </button>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCH ACTIONS TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate('/procurement')}
          className="p-3.5 glass-card rounded-xl flex items-center justify-between text-left hover:border-orange-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans">Run Chartering Analysis</div>
              <div className="text-[10px] text-slate-500 font-mono">Evaluate Spot vs COA vs Idle</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('/ingestion')}
          className="p-3.5 glass-card rounded-xl flex items-center justify-between text-left hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans">Import Market Rate Feeds</div>
              <div className="text-[10px] text-slate-500 font-mono">3-Stage CSV Validation Pipeline</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('/audit')}
          className="p-3.5 glass-card rounded-xl flex items-center justify-between text-left hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans">Governance & Audit Trail</div>
              <div className="text-[10px] text-slate-500 font-mono">Immutable Decision Logs</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>
      </div>

      {/* SIMPLE VIEW MODE */}
      {viewMode === 'SIMPLE' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* Card 1: Key Decision Recommendation */}
            <div className="bg-gradient-to-br from-orange-50/90 via-white to-amber-50/90 border border-orange-200 rounded-2xl p-5 shadow-sm space-y-3 glow-orange">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-orange-800 uppercase tracking-wider">Top Recommendation</span>
                <Sparkles className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-base font-extrabold text-slate-900 leading-snug">
                Fix 6-Month COA Contract for Australian Coking Coal
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Walk-forward XGBoost model predicts spot rates trending UPWARDS (+9.2% over 90 days). Locking in 6-month COA terms shields against rate spikes.
              </p>
              <button
                onClick={() => onNavigate('/procurement')}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold font-mono cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Open Procurement Analysis</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Market Risk Radar */}
            <div className="glass-card rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-slate-500 uppercase tracking-wider">Composite Risk Rating</span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-mono rounded-full font-bold border border-amber-300">
                  MODERATE RISK (55.6/100)
                </span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums font-mono">
                55.6 <span className="text-xs font-normal text-slate-500 font-sans">/ 100</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Primary risk driver is East Coast berth congestion and seasonal monsoon weather delays at Paradip port.
              </p>
            </div>

            {/* Card 3: Tonnage Feasibility */}
            <div className="glass-card rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-slate-500 uppercase tracking-wider">Port & Vessel Constraints</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-base font-extrabold text-emerald-700 font-sans">
                Panamax Tonnage Selected
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Capesize carriers automatically rejected due to Paradip channel depth limitations (max draft 14.5m vs Capesize draft 18.5m).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED VIEW MODE */}
      {viewMode === 'ADVANCED' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 4 Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Registered Ports</span>
                <Anchor className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {ports.length || 8}
              </div>
              <div className="text-[11px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Firestore Registry</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Vessel Fleet Classes</span>
                <Ship className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {vessels.length || 4}
              </div>
              <div className="text-[11px] text-blue-600 font-mono font-bold">
                Handysize to Capesize Specs
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Procurement Plans</span>
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {procurements.length || 1}
              </div>
              <div className="text-[11px] text-emerald-600 font-mono font-bold">
                Optimized COA Contracts
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">ML Forecast Engine</span>
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono uppercase">
                XGBoost
              </div>
              <div className="text-[11px] text-purple-600 font-mono font-bold">
                FastAPI Python Service
              </div>
            </div>
          </div>

          {/* Recent Procurements Table */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-sans">
                <FileSpreadsheet className="w-4 h-4 text-orange-500" />
                <span>Active Procurement Plans (Live Firestore Stream)</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50/80 border-b border-slate-200 uppercase text-[10px] text-slate-500">
                  <tr>
                    <th className="py-3.5 px-5">Commodity Cargo</th>
                    <th className="py-3.5 px-5">Route</th>
                    <th className="py-3.5 px-5 text-right">Quantity (MT)</th>
                    <th className="py-3.5 px-5 text-right">Budget (₹ Cr)</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {procurements.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-3.5 px-5 font-sans font-semibold text-slate-900">{p.commodity}</td>
                      <td className="py-3.5 px-5 text-blue-700 font-semibold">
                        {p.originPortName} → {p.destinationPortName}
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-slate-900 tabular-nums">
                        {p.quantityMt ? p.quantityMt.toLocaleString() : '150,000'} MT
                      </td>
                      <td className="py-3.5 px-5 text-right text-orange-600 font-bold tabular-nums">
                        ₹{p.budgetInrCrore} Cr
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className="inline-block px-2.5 py-0.5 text-[9px] rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

