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
  Radio
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

      {/* Title & Banner Header with Simple/Advanced Toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">FreightIQ Platform Command</h1>
            <span className="px-2.5 py-0.5 tricolor-badge text-xs font-bold text-slate-800 rounded-full border border-orange-300">
              SIH26006 • East Coast Hub
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 border border-emerald-300">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>FIREBASE REAL-TIME SYNC</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Firestore Database • Live Rate Forecasting & Port <GlossaryTerm termId="draft">Draft</GlossaryTerm> Constraint Solver
          </p>
        </div>

        {/* View Mode Toggle: Simple vs Advanced */}
        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg bg-slate-100 p-1 font-mono text-xs border border-slate-200">
            <button
              onClick={() => handleToggleMode('SIMPLE')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'SIMPLE' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Simple View
            </button>
            <button
              onClick={() => handleToggleMode('ADVANCED')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'ADVANCED' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Advanced View
            </button>
          </div>
        </div>
      </div>

      {/* SIMPLE VIEW MODE */}
      {viewMode === 'SIMPLE' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* Card 1: Key Decision Recommendation */}
            <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-orange-800 uppercase tracking-wider">Top Recommendation</span>
                <Sparkles className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-base font-extrabold text-slate-900">
                Fix 6-Month COA Contract for Australian Coking Coal
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Freight rates are predicted to trend UPWARDS (+9.2% over 90 days). Locking in 6-month terms avoids spot volatility.
              </p>
              <button
                onClick={() => onNavigate('/procurement')}
                className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 font-mono cursor-pointer pt-1"
              >
                <span>View Full Procurement Analysis</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Market Risk Radar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Market Risk Level</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-mono rounded font-bold">
                  MODERATE (55.6/100)
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                55.6 <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Risk is driven primarily by port <GlossaryTerm termId="turnaround">turnaround</GlossaryTerm> congestion delays at Paradip berth #4.
              </p>
            </div>

            {/* Card 3: Tonnage Feasibility */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Port & Vessel Match</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-extrabold text-emerald-700">
                Panamax Tonnage Recommended
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Capesize vessels rejected due to Paradip max <GlossaryTerm termId="draft">draft</GlossaryTerm> limit (14.5m vs 18.5m).
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
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-slate-500">Registered Ports</span>
                <Anchor className="w-5 h-5 text-india-saffron" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                {ports.length || 8}
              </div>
              <div className="text-[11px] text-emerald-600 font-mono mt-1 font-bold">
                Firestore Live Streamed
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-slate-500">Vessels Registry</span>
                <Ship className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                {vessels.length || 4}
              </div>
              <div className="text-[11px] text-blue-600 font-mono mt-1 font-bold">
                Handysize to Capesize
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-slate-500">Active Procurement Plans</span>
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
                {procurements.length || 1}
              </div>
              <div className="text-[11px] text-emerald-600 font-mono mt-1 font-bold">
                Optimized Contracts
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-slate-500">Firebase Project</span>
                <Database className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-2 font-mono uppercase">
                ibpsih
              </div>
              <div className="text-[11px] text-purple-600 font-mono mt-1 font-bold">
                Real-Time Firestore
              </div>
            </div>
          </div>

          {/* Recent Procurements Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-india-saffron" />
                <span>Recent Procurement Plans (Live Firestore Stream)</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] text-slate-500">
                  <tr>
                    <th className="py-3 px-4">Commodity Cargo</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4 text-right">Quantity (MT)</th>
                    <th className="py-3 px-4 text-right">Budget (₹ Cr)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {procurements.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">{p.commodity}</td>
                      <td className="py-3 px-4 text-blue-700">
                        {p.originPortName} → {p.destinationPortName}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                        {p.quantityMt ? p.quantityMt.toLocaleString() : '150,000'} MT
                      </td>
                      <td className="py-3 px-4 text-right text-orange-600 font-bold tabular-nums">
                        ₹{p.budgetInrCrore} Cr
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 text-[9px] rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
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
