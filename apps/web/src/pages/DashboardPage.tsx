import React, { useEffect, useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { seedFirestoreIfEmpty } from '../lib/firebaseSeed';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import { CompassRiskGauge } from '../components/ui/CompassRiskGauge';
import { CharterStampBadge } from '../components/ui/CharterStampBadge';
import {
  Anchor,
  Ship,
  FileSpreadsheet,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Radio,
  Zap,
  Upload,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { data: ports, loading: loadingPorts } = useFirestoreCollection<any>('ports');
  const { data: vessels, loading: loadingVessels } = useFirestoreCollection<any>('vesselTypes');
  const { data: procurements, loading: loadingProcurements } = useFirestoreCollection<any>('procurementRequests');

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
      <div className="card-theme rounded-2xl p-6 shadow-card-soft border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] font-serif">
              FreightIQ Executive Command Center
            </h1>
            <span className="px-3 py-0.5 bg-sky-50 text-sky-700 text-xs font-bold rounded-full border border-sky-200 font-mono">
              SIH26006 • East Coast Hub
            </span>
            <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono rounded-full font-bold flex items-center gap-1.5 border border-emerald-200">
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
          <div className="flex rounded-xl bg-slate-100 p-1 font-mono text-xs border border-slate-200">
            <button
              onClick={() => handleToggleMode('SIMPLE')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'SIMPLE'
                  ? 'bg-[#0F1B2E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F1B2E]'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => handleToggleMode('ADVANCED')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'ADVANCED'
                  ? 'bg-[#0F1B2E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F1B2E]'
              }`}
            >
              Detailed Analytics
            </button>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCH ACTIONS TOOLBAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <button
          onClick={() => onNavigate('/procurement')}
          className="p-4 card-theme rounded-2xl border border-slate-200 flex items-center justify-between text-left hover:border-sky-500 transition-all cursor-pointer group shadow-card-soft"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F1B2E] font-sans group-hover:text-sky-700">Run Chartering Analysis</div>
              <div className="text-[10px] text-slate-500">Evaluate Spot vs COA vs Idle</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigate('/ingestion')}
          className="p-4 card-theme rounded-2xl border border-slate-200 flex items-center justify-between text-left hover:border-sky-500 transition-all cursor-pointer group shadow-card-soft"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F1B2E] font-sans group-hover:text-sky-700">Import Market Rate Feeds</div>
              <div className="text-[10px] text-slate-500">3-Stage CSV Validation Pipeline</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigate('/audit')}
          className="p-4 card-theme rounded-2xl border border-slate-200 flex items-center justify-between text-left hover:border-emerald-500 transition-all cursor-pointer group shadow-card-soft"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F1B2E] font-sans group-hover:text-emerald-700">Governance & Audit Trail</div>
              <div className="text-[10px] text-slate-500">Immutable Decision Logs</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* SIMPLE VIEW MODE */}
      {viewMode === 'SIMPLE' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* Card 1: Key Decision Recommendation */}
            <div className="card-theme rounded-2xl p-6 shadow-card-soft border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-slate-500 uppercase tracking-wider">Top Recommendation</span>
                <CharterStampBadge variant="RECOMMENDED" label="6-MONTH COA" />
              </div>
              <div className="text-base font-bold text-[#0F1B2E] leading-snug font-serif">
                Fix 6-Month COA Contract for Australian Coking Coal
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                XGBoost model predicts spot rates trending UPWARDS (+9.2% over 90 days). Locking in 6-month COA terms shields against rate spikes.
              </p>
              <button
                onClick={() => onNavigate('/procurement')}
                className="accept-button-theme w-full flex items-center justify-center space-x-2 text-xs"
              >
                <span>Open Procurement Analysis</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Card 2: Composite Risk Gauge Signature Element */}
            <div className="card-theme rounded-2xl p-6 shadow-card-soft border border-slate-200 space-y-3 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono text-slate-500 uppercase tracking-wider">Composite Risk Navigation</span>
                <Sparkles className="w-4 h-4 text-sky-600" />
              </div>
              
              <CompassRiskGauge score={55.6} riskLevel="MODERATE" size="md" />

              <p className="text-xs text-slate-500 leading-relaxed text-center font-sans">
                Primary risk driver: East Coast berth turnaround delays at Paradip discharge terminal.
              </p>
            </div>

            {/* Card 3: Tonnage Feasibility */}
            <div className="card-theme rounded-2xl p-6 shadow-card-soft border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold font-mono text-slate-500 uppercase tracking-wider">Port & Vessel Constraints</span>
                  <CharterStampBadge variant="FEASIBLE" label="PANAMAX TONNAGE" />
                </div>
                <div className="text-base font-bold text-emerald-700 font-serif">
                  Panamax Bulk Carrier Selected
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Capesize carriers automatically rejected due to Paradip channel depth limits (max draft 14.5m vs Capesize draft 18.5m).
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
                <span>Draft Constraint: 14.2m</span>
                <span className="text-emerald-700 font-bold">Passed ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED VIEW MODE */}
      {viewMode === 'ADVANCED' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 4 Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Registered Ports</span>
                <Anchor className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-3xl font-bold text-[#0F1B2E] font-mono tabular-nums font-serif">
                {loadingPorts ? '...' : ports.length}
              </div>
              <div className="text-[11px] text-emerald-700 font-mono font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>Live Firestore Registry</span>
              </div>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Vessel Fleet Classes</span>
                <Ship className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-3xl font-bold text-[#0F1B2E] font-mono tabular-nums font-serif">
                {loadingVessels ? '...' : vessels.length}
              </div>
              <div className="text-[11px] text-slate-500 font-mono font-bold">
                Handysize to Capesize Specs
              </div>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Procurement Plans</span>
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-[#0F1B2E] font-mono tabular-nums font-serif">
                {loadingProcurements ? '...' : procurements.length}
              </div>
              <div className="text-[11px] text-emerald-700 font-mono font-bold">
                Optimized COA Contracts
              </div>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold font-mono uppercase text-slate-500">ML Forecast Engine</span>
                <Database className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-[#0F1B2E] font-mono uppercase font-serif">
                XGBoost
              </div>
              <div className="text-[11px] text-sky-700 font-mono font-bold">
                FastAPI Python Solvers
              </div>
            </div>
          </div>

          {/* Recent Procurements Master Table */}
          <div className="card-theme rounded-2xl overflow-hidden shadow-card-soft border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#FAFAF8]">
              <h2 className="text-sm font-bold text-[#0F1B2E] flex items-center gap-2 font-serif">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                <span>Active Procurement Plans (Live Stream)</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAFAF8] border-b border-slate-200 uppercase text-[10px] text-slate-500">
                  <tr>
                    <th className="py-3.5 px-5">Commodity Cargo</th>
                    <th className="py-3.5 px-5">Route</th>
                    <th className="py-3.5 px-5 text-right">Quantity (MT)</th>
                    <th className="py-3.5 px-5 text-right">Budget (₹ Cr)</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {procurements.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 font-sans font-bold text-[#0F1B2E]">{p.commodity}</td>
                      <td className="py-3.5 px-5 text-sky-700 font-semibold">
                        {p.originPortName} → {p.destinationPortName}
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-[#0F1B2E] tabular-nums">
                        {p.quantityMt ? p.quantityMt.toLocaleString() : '150,000'} MT
                      </td>
                      <td className="py-3.5 px-5 text-right text-amber-700 font-bold tabular-nums">
                        ₹{p.budgetInrCrore} Cr
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className="inline-block px-3 py-0.5 text-[9px] rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
