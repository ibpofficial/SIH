import React, { useEffect, useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { seedFirestoreIfEmpty } from '../lib/firebaseSeed';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import { CompassRiskGauge } from '../components/ui/CompassRiskGauge';
import { CharterStampBadge } from '../components/ui/CharterStampBadge';
import { InteractiveRouteVisualizer } from '../components/analytics/InteractiveRouteVisualizer';
import { BalticIndexWidget } from '../components/analytics/BalticIndexWidget';
import { ForecastChart } from '../components/analytics/ForecastChart';
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
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart2,
  DollarSign,
  Info
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

      {/* Header Banner - Squarish Corners, Inset Depth Shadow, Bold Unboxed Tags */}
      <div className="bg-white rounded-lg p-6 border border-slate-200/90 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
              FreightIQ Executive Command Center
            </h1>
            <span className="text-slate-300 font-light">|</span>
            <span className="font-bold text-slate-900 font-mono text-xs tracking-wide">
              SIH26006 • East Coast Hub
            </span>
            <span className="text-slate-300 font-light">|</span>
            <span className="font-bold text-slate-900 text-xs font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE SYSTEM ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Real-Time Market Rate Forecasting • Port <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Physical Constraint Solver
          </p>
        </div>

        {/* Smooth Depth Animated Toggle (Executive Summary vs Detailed Analytics) */}
        <div className="flex items-center space-x-2">
          <div className="relative p-1 bg-slate-100/90 rounded-lg border border-slate-200/80 shadow-inner flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => handleToggleMode('SIMPLE')}
              className={`relative px-4 py-2 rounded-md font-bold text-xs transition-all duration-200 ease-out cursor-pointer ${
                viewMode === 'SIMPLE'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 translate-y-[-0.5px]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => handleToggleMode('ADVANCED')}
              className={`relative px-4 py-2 rounded-md font-bold text-xs transition-all duration-200 ease-out cursor-pointer ${
                viewMode === 'ADVANCED'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 translate-y-[-0.5px]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Detailed Analytics
            </button>
          </div>
        </div>
      </div>

      {/* QUICK LAUNCH ACTIONS TOOLBAR (Uiverse Inspired Square-Box Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <button
          onClick={() => onNavigate('/procurement')}
          className="p-4 card-theme bg-white rounded-2xl border border-blue-100 flex items-center justify-between text-left hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans group-hover:text-blue-600">Run Chartering Analysis</div>
              <div className="text-[10px] text-slate-500">Evaluate Spot vs COA</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('/about')}
          className="p-4 card-theme bg-white rounded-2xl border border-blue-100 flex items-center justify-between text-left hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans group-hover:text-blue-600">About Platform Systems</div>
              <div className="text-[10px] text-slate-500">10 Systems Breakdown</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('/ingestion')}
          className="p-4 card-theme bg-white rounded-2xl border border-blue-100 flex items-center justify-between text-left hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans group-hover:text-blue-600">Import Market Feeds</div>
              <div className="text-[10px] text-slate-500">3-Stage CSV Validation</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => onNavigate('/audit')}
          className="p-4 card-theme bg-white rounded-2xl border border-blue-100 flex items-center justify-between text-left hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans group-hover:text-emerald-600">Governance & Audit</div>
              <div className="text-[10px] text-slate-500">Immutable Logs</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>
      </div>

      {/* 4 HIGH IMPACT TOP KPI STAT CARDS WITH SPARKLINE INDICATORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Estimated Savings */}
        <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Opt. Savings (FY26)</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#0F1B2E] font-mono tabular-nums font-serif">
              ₹42.8 Cr
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold rounded-md flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
            <span>vs Spot Benchmark</span>
            <span className="text-emerald-700 font-bold">COA Strategy</span>
          </div>
        </div>

        {/* KPI 2: Berth Wait Time */}
        <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2 hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Avg Berth Waiting</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#0F1B2E] font-mono tabular-nums font-serif">
              1.8 Days
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold rounded-md">
              -0.6d Better
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
            <span>East Coast Terminals</span>
            <span className="text-amber-700 font-bold">Paradip Priority</span>
          </div>
        </div>

        {/* KPI 3: Fleet Optimization Rate */}
        <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2 hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Draft Feasibility Rate</span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#0F1B2E] font-mono tabular-nums font-serif">
              98.4%
            </div>
            <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-bold rounded-md">
              Optimal Match
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
            <span>Zero Draft Violations</span>
            <span className="text-sky-700 font-bold">Passed</span>
          </div>
        </div>

        {/* KPI 4: Active Procurement Requests */}
        <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-2 hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold font-mono uppercase text-slate-500">Live Plans</span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold text-[#0F1B2E] font-mono tabular-nums font-serif">
              {loadingProcurements ? '...' : procurements.length}
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
            <span>Total Tonnage</span>
            <span className="text-[#0F1B2E] font-bold">1.25M MT</span>
          </div>
        </div>
      </div>

      {/* BALTIC MARKET BENCHMARK WIDGET */}
      <BalticIndexWidget />

      {/* SIMPLE VIEW MODE CONTENT */}
      {viewMode === 'SIMPLE' && (
        <div className="space-y-6 animate-in fade-in">
          {/* INTERACTIVE MARITIME ROUTE VISUALIZER */}
          <InteractiveRouteVisualizer />

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

      {/* ADVANCED VIEW MODE CONTENT */}
      {viewMode === 'ADVANCED' && (
        <div className="space-y-6 animate-in fade-in">
          {/* ENHANCED FORECAST CHART WITH SCENARIO SIMULATOR */}
          <ForecastChart route="Gladstone → Paradip (Coking Coal)" />

          {/* 4 System Metric Detail Cards */}
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

          {/* EAST COAST PORT CLEARANCE & DRAFT MATRIX */}
          <div className="card-theme rounded-2xl p-6 shadow-card-soft border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-[#0F1B2E] flex items-center gap-2 font-serif">
                <Anchor className="w-4 h-4 text-sky-600" />
                <span>East Coast Discharge Port Physical Constraints Matrix</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">Channel Depth & Max LOA Limits</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F1B2E]">Paradip Port</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold">
                    PANAMAX OK
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] space-y-1">
                  <div>Max Draft: <strong className="text-[#0F1B2E]">14.5 meters</strong></div>
                  <div>Max LOA: <strong className="text-[#0F1B2E]">230 meters</strong></div>
                  <div>Tidal Window: <strong>+1.2m High Tide</strong></div>
                </div>
              </div>

              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F1B2E]">Visakhapatnam</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold">
                    CAPESIZE OK
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] space-y-1">
                  <div>Max Draft: <strong className="text-[#0F1B2E]">16.0 meters</strong></div>
                  <div>Max LOA: <strong className="text-[#0F1B2E]">290 meters</strong></div>
                  <div>Tidal Window: <strong>Deepwater Outer Harbor</strong></div>
                </div>
              </div>

              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F1B2E]">Dhamra Port</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold">
                    CAPESIZE OK
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] space-y-1">
                  <div>Max Draft: <strong className="text-[#0F1B2E]">18.0 meters</strong></div>
                  <div>Max LOA: <strong className="text-[#0F1B2E]">300 meters</strong></div>
                  <div>Tidal Window: <strong>All-Weather Deep Draft</strong></div>
                </div>
              </div>

              <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F1B2E]">Haldia Port</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-bold">
                    SUPRAMAX ONLY
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] space-y-1">
                  <div>Max Draft: <strong className="text-[#0F1B2E]">10.5 meters</strong></div>
                  <div>Max LOA: <strong className="text-[#0F1B2E]">190 meters</strong></div>
                  <div>Tidal Window: <strong>Bore Tide Restricted</strong></div>
                </div>
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
