import React, { useState } from 'react';
import { Ship, Anchor, Navigation, ShieldCheck, AlertTriangle, ArrowRight, Zap, Droplets, Clock } from 'lucide-react';

interface RouteData {
  id: string;
  name: string;
  cargo: string;
  origin: string;
  originCountry: string;
  destination: string;
  destinationCountry: string;
  distanceNm: number;
  transitDays: number;
  activeVessels: number;
  maxDraftAllowed: number;
  typicalDraft: number;
  congestionStatus: 'LOW' | 'MODERATE' | 'HIGH';
  bunkerCostPerDay: number;
  currentVessel: {
    name: string;
    type: string;
    progressPct: number;
    speedKnots: number;
    eta: string;
    draftMeters: number;
  };
}

const ROUTES: RouteData[] = [
  {
    id: 'gladstone-paradip',
    name: 'Gladstone → Paradip',
    cargo: 'Australian Coking Coal',
    origin: 'Gladstone',
    originCountry: 'Australia',
    destination: 'Paradip',
    destinationCountry: 'India (East Coast)',
    distanceNm: 4850,
    transitDays: 14.5,
    activeVessels: 4,
    maxDraftAllowed: 14.5,
    typicalDraft: 14.2,
    congestionStatus: 'MODERATE',
    bunkerCostPerDay: 18500,
    currentVessel: {
      name: 'MV Steel Pioneer',
      type: 'Panamax (74,000 DWT)',
      progressPct: 62,
      speedKnots: 13.8,
      eta: 'Sep 10, 08:30 IST',
      draftMeters: 14.1,
    },
  },
  {
    id: 'haypoint-vizag',
    name: 'Hay Point → Vizag',
    cargo: 'Hard Coking Coal',
    origin: 'Hay Point',
    originCountry: 'Australia',
    destination: 'Visakhapatnam',
    destinationCountry: 'India (East Coast)',
    distanceNm: 5120,
    transitDays: 15.2,
    activeVessels: 3,
    maxDraftAllowed: 16.0,
    typicalDraft: 15.1,
    congestionStatus: 'LOW',
    bunkerCostPerDay: 19200,
    currentVessel: {
      name: 'MV Vizag Titan',
      type: 'Post-Panamax (93,000 DWT)',
      progressPct: 38,
      speedKnots: 14.1,
      eta: 'Sep 14, 14:00 IST',
      draftMeters: 15.0,
    },
  },
  {
    id: 'richardsbay-dhamra',
    name: 'Richards Bay → Dhamra',
    cargo: 'South African Thermal Coal',
    origin: 'Richards Bay',
    originCountry: 'South Africa',
    destination: 'Dhamra',
    destinationCountry: 'India (East Coast)',
    distanceNm: 4430,
    transitDays: 13.1,
    activeVessels: 2,
    maxDraftAllowed: 18.0,
    typicalDraft: 16.8,
    congestionStatus: 'LOW',
    bunkerCostPerDay: 17800,
    currentVessel: {
      name: 'MV Ocean Crest',
      type: 'Capesize (180,000 DWT)',
      progressPct: 84,
      speedKnots: 13.4,
      eta: 'Sep 08, 19:15 IST',
      draftMeters: 16.5,
    },
  },
  {
    id: 'newcastle-haldia',
    name: 'Newcastle → Haldia',
    cargo: 'Pulverized Coal Injection (PCI)',
    origin: 'Newcastle',
    originCountry: 'Australia',
    destination: 'Haldia',
    destinationCountry: 'India (Riverine Port)',
    distanceNm: 5380,
    transitDays: 16.8,
    activeVessels: 2,
    maxDraftAllowed: 10.5,
    typicalDraft: 9.8,
    congestionStatus: 'HIGH',
    bunkerCostPerDay: 14200,
    currentVessel: {
      name: 'MV Ganges Pearl',
      type: 'Supramax (56,000 DWT)',
      progressPct: 45,
      speedKnots: 12.9,
      eta: 'Sep 16, 11:45 IST',
      draftMeters: 9.6,
    },
  },
];

export const InteractiveRouteVisualizer: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('gladstone-paradip');
  const route = ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0];

  const draftMargin = route.maxDraftAllowed - route.currentVessel.draftMeters;
  const isDraftFeasible = draftMargin >= 0.3;

  return (
    <div className="card-theme rounded-2xl p-6 border border-slate-200 space-y-6 shadow-card-soft">
      {/* Visualizer Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
              <Navigation className="w-5 h-5 text-sky-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F1B2E] font-serif tracking-tight">
                East Coast Freight Corridor Live Visualizer
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Real-Time AIS Vessel Tracking • Channel Draft Verification • ETA Monitor
              </p>
            </div>
          </div>
        </div>

        {/* Corridor Tabs Selector */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs bg-slate-100 p-1 rounded-xl border border-slate-200">
          {ROUTES.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRouteId === r.id
                  ? 'bg-[#0F1B2E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F1B2E] hover:bg-slate-200/60'
              }`}
            >
              {r.origin} → {r.destination}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Corridor Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Commodity</div>
          <div className="font-bold text-[#0F1B2E] font-sans truncate">{route.cargo}</div>
        </div>

        <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Distance & Transit</div>
          <div className="font-bold text-sky-700">
            {route.distanceNm.toLocaleString()} NM <span className="text-slate-400">({route.transitDays} days)</span>
          </div>
        </div>

        <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Port Congestion</div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                route.congestionStatus === 'LOW'
                  ? 'bg-emerald-500'
                  : route.congestionStatus === 'MODERATE'
                  ? 'bg-amber-500'
                  : 'bg-red-500 animate-ping'
              }`}
            />
            <span
              className={`font-bold text-[11px] ${
                route.congestionStatus === 'LOW'
                  ? 'text-emerald-700'
                  : route.congestionStatus === 'MODERATE'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {route.congestionStatus} DELAY RISK
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#FAFAF8] rounded-xl border border-slate-200">
          <div className="text-slate-400 text-[10px] uppercase font-bold">Bunker Fuel Daily</div>
          <div className="font-bold text-emerald-700">${route.bunkerCostPerDay.toLocaleString()}/day</div>
        </div>
      </div>

      {/* Interactive Shipping Lane Map Graphic */}
      <div className="relative bg-[#0F1B2E] text-white rounded-2xl p-6 overflow-hidden border border-slate-800 shadow-lg space-y-5">
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Route Header Info */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold font-mono">
              AIS
            </div>
            <div>
              <div className="text-sm font-bold font-serif text-sky-100 flex items-center gap-2">
                <span>{route.currentVessel.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {route.currentVessel.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Current Speed: <strong className="text-emerald-400">{route.currentVessel.speedKnots} kts</strong> • ETA:{' '}
                <strong className="text-white">{route.currentVessel.eta}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Vessel Draft:</span>
            <span className="font-bold text-sky-300">{route.currentVessel.draftMeters}m</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">Max Allowed:</span>
            <span className="font-bold text-emerald-400">{route.maxDraftAllowed}m</span>
            {isDraftFeasible ? (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> PASSED
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" /> DRAFT EXCEEDED
              </span>
            )}
          </div>
        </div>

        {/* Animated Progress Corridor Bar */}
        <div className="relative z-10 space-y-2 py-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-2">
              <Anchor className="w-4 h-4 text-sky-400" />
              <div>
                <span className="font-bold text-white font-sans">{route.origin}</span>
                <span className="text-[10px] text-slate-400 block">{route.originCountry}</span>
              </div>
            </div>

            <div className="text-center font-bold text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/30">
              {route.currentVessel.progressPct}% Voyage Completed
            </div>

            <div className="flex items-center space-x-2 text-right">
              <div>
                <span className="font-bold text-white font-sans">{route.destination}</span>
                <span className="text-[10px] text-slate-400 block">{route.destinationCountry}</span>
              </div>
              <Anchor className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Progress Track */}
          <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-sky-600 via-sky-400 to-emerald-400 rounded-full transition-all duration-500 relative"
              style={{ width: `${route.currentVessel.progressPct}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-white animate-pulse rounded-full" />
            </div>
          </div>

          {/* Vessel Pin Indicator along Track */}
          <div className="relative h-8 w-full">
            <div
              className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${route.currentVessel.progressPct}%` }}
            >
              <div className="p-1.5 bg-sky-500 text-white rounded-full shadow-lg border-2 border-[#0F1B2E] animate-bounce">
                <Ship className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-sky-300 font-bold bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-500/40">
                {route.currentVessel.name}
              </span>
            </div>
          </div>
        </div>

        {/* Key Corridor Insights Bar */}
        <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Remaining Transit:{' '}
              <strong className="text-white">
                {((route.transitDays * (100 - route.currentVessel.progressPct)) / 100).toFixed(1)} days
              </strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>
              Est. Fuel Consumed:{' '}
              <strong className="text-sky-300 font-bold">
                ${((route.bunkerCostPerDay * route.transitDays * route.currentVessel.progressPct) / 100 / 1000).toFixed(1)}k
              </strong>
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Auto-Optimized Charter Route Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
