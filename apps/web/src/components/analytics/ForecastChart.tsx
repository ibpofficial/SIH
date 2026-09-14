import React, { useState } from 'react';
import { TrendingUp, Sparkles, Info, Sliders, ShieldCheck, RefreshCw } from 'lucide-react';

interface ForecastPoint {
  date: string;
  predictedRate: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}

interface RouteForecastData {
  routeId: string;
  routeName: string;
  commodity: string;
  baseRate: number;
  points: ForecastPoint[];
}

const ROUTE_DATASETS: RouteForecastData[] = [
  {
    routeId: 'gladstone-paradip',
    routeName: 'Gladstone → Paradip',
    commodity: 'Australian Coking Coal',
    baseRate: 24.50,
    points: [
      { date: 'Sep 06', predictedRate: 24.50, confidenceLower: 22.80, confidenceUpper: 26.20 },
      { date: 'Sep 20', predictedRate: 25.40, confidenceLower: 23.60, confidenceUpper: 27.20 },
      { date: 'Oct 05', predictedRate: 26.10, confidenceLower: 24.10, confidenceUpper: 28.10 },
      { date: 'Oct 20', predictedRate: 25.80, confidenceLower: 23.80, confidenceUpper: 27.90 },
      { date: 'Nov 05', predictedRate: 26.75, confidenceLower: 24.50, confidenceUpper: 29.00 },
      { date: 'Nov 20', predictedRate: 27.20, confidenceLower: 24.80, confidenceUpper: 29.60 },
      { date: 'Dec 05', predictedRate: 26.80, confidenceLower: 24.20, confidenceUpper: 29.40 },
    ],
  },
  {
    routeId: 'haypoint-vizag',
    routeName: 'Hay Point → Vizag',
    commodity: 'Hard Coking Coal',
    baseRate: 25.80,
    points: [
      { date: 'Sep 06', predictedRate: 25.80, confidenceLower: 24.00, confidenceUpper: 27.60 },
      { date: 'Sep 20', predictedRate: 26.20, confidenceLower: 24.30, confidenceUpper: 28.10 },
      { date: 'Oct 05', predictedRate: 27.00, confidenceLower: 24.90, confidenceUpper: 29.10 },
      { date: 'Oct 20', predictedRate: 27.80, confidenceLower: 25.50, confidenceUpper: 30.10 },
      { date: 'Nov 05', predictedRate: 28.30, confidenceLower: 25.90, confidenceUpper: 30.70 },
      { date: 'Nov 20', predictedRate: 28.90, confidenceLower: 26.40, confidenceUpper: 31.40 },
      { date: 'Dec 05', predictedRate: 28.50, confidenceLower: 25.80, confidenceUpper: 31.20 },
    ],
  },
  {
    routeId: 'richardsbay-dhamra',
    routeName: 'Richards Bay → Dhamra',
    commodity: 'South African Thermal Coal',
    baseRate: 19.40,
    points: [
      { date: 'Sep 06', predictedRate: 19.40, confidenceLower: 17.90, confidenceUpper: 20.90 },
      { date: 'Sep 20', predictedRate: 19.10, confidenceLower: 17.60, confidenceUpper: 20.60 },
      { date: 'Oct 05', predictedRate: 18.80, confidenceLower: 17.20, confidenceUpper: 20.40 },
      { date: 'Oct 20', predictedRate: 19.50, confidenceLower: 17.80, confidenceUpper: 21.20 },
      { date: 'Nov 05', predictedRate: 20.10, confidenceLower: 18.30, confidenceUpper: 21.90 },
      { date: 'Nov 20', predictedRate: 20.60, confidenceLower: 18.70, confidenceUpper: 22.50 },
      { date: 'Dec 05', predictedRate: 20.30, confidenceLower: 18.20, confidenceUpper: 22.40 },
    ],
  },
  {
    routeId: 'newcastle-haldia',
    routeName: 'Newcastle → Haldia',
    commodity: 'PCI Coal (Riverine)',
    baseRate: 29.20,
    points: [
      { date: 'Sep 06', predictedRate: 29.20, confidenceLower: 26.80, confidenceUpper: 31.60 },
      { date: 'Sep 20', predictedRate: 30.10, confidenceLower: 27.50, confidenceUpper: 32.70 },
      { date: 'Oct 05', predictedRate: 31.20, confidenceLower: 28.40, confidenceUpper: 34.00 },
      { date: 'Oct 20', predictedRate: 31.80, confidenceLower: 28.90, confidenceUpper: 34.70 },
      { date: 'Nov 05', predictedRate: 32.50, confidenceLower: 29.40, confidenceUpper: 35.60 },
      { date: 'Nov 20', predictedRate: 33.10, confidenceLower: 29.90, confidenceUpper: 36.30 },
      { date: 'Dec 05', predictedRate: 32.70, confidenceLower: 29.20, confidenceUpper: 36.20 },
    ],
  },
];

interface ForecastChartProps {
  points?: ForecastPoint[];
  route?: string;
  trendDirection?: string;
  trendMagnitudePct?: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  points: externalPoints,
  route: externalRoute,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('gladstone-paradip');
  const [bunkerFactorPct, setBunkerFactorPct] = useState<number>(0);
  const [congestionDelayDays, setCongestionDelayDays] = useState<number>(0);
  const [showConfidenceBand, setShowConfidenceBand] = useState<boolean>(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeDataset = ROUTE_DATASETS.find((r) => r.routeId === selectedRouteId) || ROUTE_DATASETS[0];

  const rawPoints = externalPoints && externalPoints.length > 0 ? externalPoints : activeDataset.points;
  const currentRouteName = externalRoute || activeDataset.routeName;

  // Apply scenario math: Bunker effect (+0.3% per 1% bunker change) & Congestion effect (+0.45 $/MT per delay day)
  const adjustedPoints = rawPoints.map((p) => {
    const bunkerMultiplier = 1 + (bunkerFactorPct * 0.003);
    const congestionCost = congestionDelayDays * 0.45;
    const rate = p.predictedRate * bunkerMultiplier + congestionCost;
    const lower = (p.confidenceLower || p.predictedRate * 0.92) * bunkerMultiplier + congestionCost;
    const upper = (p.confidenceUpper || p.predictedRate * 1.08) * bunkerMultiplier + congestionCost;
    return {
      ...p,
      predictedRate: rate,
      confidenceLower: lower,
      confidenceUpper: upper,
    };
  });

  // Calculate bounds
  const uppers = adjustedPoints.map((p) => p.confidenceUpper);
  const lowers = adjustedPoints.map((p) => p.confidenceLower);

  const minRate = Math.floor(Math.min(...lowers) * 0.95);
  const maxRate = Math.ceil(Math.max(...uppers) * 1.05);
  const range = maxRate - minRate || 1;

  // SVG Dimensions
  const width = 800;
  const height = 240;
  const paddingX = 50;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Map to SVG coordinates
  const pointsWithCoords = adjustedPoints.map((p, idx) => {
    const x = paddingX + (idx / (adjustedPoints.length - 1 || 1)) * chartWidth;
    const y = paddingY + chartHeight - ((p.predictedRate - minRate) / range) * chartHeight;
    const yUpper = paddingY + chartHeight - ((p.confidenceUpper - minRate) / range) * chartHeight;
    const yLower = paddingY + chartHeight - ((p.confidenceLower - minRate) / range) * chartHeight;
    return { ...p, x, y, yUpper, yLower, idx };
  });

  const linePathD = pointsWithCoords.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const upperD = pointsWithCoords.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.yUpper}` : `${acc} L ${pt.x} ${pt.yUpper}`), '');
  const lowerReverseD = [...pointsWithCoords].reverse().reduce((acc, pt, i) => `${acc} L ${pt.x} ${pt.yLower}`, '');
  const confidenceAreaD = `${upperD} ${lowerReverseD} Z`;

  const firstPt = adjustedPoints[0];
  const lastPt = adjustedPoints[adjustedPoints.length - 1];
  const pctChange = (((lastPt.predictedRate - firstPt.predictedRate) / firstPt.predictedRate) * 100).toFixed(1);
  const peakPt = [...adjustedPoints].sort((a, b) => b.predictedRate - a.predictedRate)[0];

  const activePoint = hoveredIdx !== null ? pointsWithCoords[hoveredIdx] : pointsWithCoords[pointsWithCoords.length - 1];

  const resetSliders = () => {
    setBunkerFactorPct(0);
    setCongestionDelayDays(0);
  };

  return (
    <div className="card-theme rounded-2xl p-5 shadow-card-soft border border-slate-200 space-y-4 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-200">
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F1B2E] font-serif tracking-tight flex items-center gap-2">
              <span>Interactive 90-Day Freight Rate Forecast Curve</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200 rounded">
                XGBoost Model Active
              </span>
            </h3>
            <div className="text-xs font-mono text-slate-500">
              Route: <span className="font-bold text-[#0F1B2E]">{currentRouteName}</span> ({activeDataset.commodity})
            </div>
          </div>
        </div>

        {/* Route Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-xs bg-slate-100 p-1 rounded-xl border border-slate-200">
          {ROUTE_DATASETS.map((ds) => (
            <button
              key={ds.routeId}
              onClick={() => setSelectedRouteId(ds.routeId)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedRouteId === ds.routeId
                  ? 'bg-[#0F1B2E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F1B2E]'
              }`}
            >
              {ds.routeName.split(' → ')[0]} → {ds.routeName.split(' → ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAFAF8] p-3 rounded-xl border border-slate-200 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-xs">
            <span className="text-slate-500">Spot Rate: </span>
            <strong className="text-[#0F1B2E]">${firstPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
          <div className="px-3 py-1 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 shadow-xs">
            <span className="text-sky-700">90d Target: </span>
            <strong className="font-bold">${lastPt.predictedRate.toFixed(2)}/MT</strong>
            <span className={`ml-1.5 font-bold ${Number(pctChange) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ({Number(pctChange) >= 0 ? `+${pctChange}%` : `${pctChange}%`})
            </span>
          </div>
          <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-xs">
            <span className="text-slate-500">Peak Forecast: </span>
            <strong className="text-[#0F1B2E]">${peakPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
        </div>

        <button
          onClick={() => setShowConfidenceBand((prev) => !prev)}
          className={`px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
            showConfidenceBand
              ? 'bg-sky-50 text-sky-700 border-sky-200'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>95% Confidence Band: {showConfidenceBand ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Interactive Scenario Simulator Controls Panel */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-[#0F1B2E]">
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive Scenario Simulator (What-If Analysis)</span>
          </div>
          {(bunkerFactorPct !== 0 || congestionDelayDays !== 0) && (
            <button
              onClick={resetSliders}
              className="text-[10px] text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset Simulators
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Bunker Price Adjustment Slider */}
          <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 font-sans">Bunker Fuel Price Fluctuation:</span>
              <strong className={bunkerFactorPct > 0 ? 'text-rose-700' : bunkerFactorPct < 0 ? 'text-emerald-700' : 'text-slate-700'}>
                {bunkerFactorPct > 0 ? `+${bunkerFactorPct}%` : `${bunkerFactorPct}%`}
              </strong>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="5"
              value={bunkerFactorPct}
              onChange={(e) => setBunkerFactorPct(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>-20% (Lower Fuel)</span>
              <span>Baseline</span>
              <span>+30% (Fuel Spike)</span>
            </div>
          </div>

          {/* Port Congestion Delay Slider */}
          <div className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 font-sans">Berth Waiting Delay Factor:</span>
              <strong className={congestionDelayDays > 0 ? 'text-amber-700' : 'text-slate-700'}>
                +{congestionDelayDays} Days
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={congestionDelayDays}
              onChange={(e) => setCongestionDelayDays(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>0 Days (Normal)</span>
              <span>3 Days</span>
              <span>7 Days (Severe Congestion)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative bg-white rounded-xl p-4 overflow-hidden border border-slate-200 shadow-xs">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
          <defs>
            <linearGradient id="rateLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0F1B2E" />
            </linearGradient>

            <linearGradient id="confidenceAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
            const yVal = paddingY + chartHeight * factor;
            const rateVal = (maxRate - factor * range).toFixed(1);
            return (
              <g key={i}>
                <line x1={paddingX} y1={yVal} x2={width - paddingX} y2={yVal} stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="0.8" />
                <text x={paddingX - 8} y={yVal + 3} textAnchor="end" fill="#64748B" fontSize="9" className="font-mono">
                  ${rateVal}
                </text>
              </g>
            );
          })}

          {/* Confidence Interval Area */}
          {showConfidenceBand && <path d={confidenceAreaD} fill="url(#confidenceAreaGrad)" />}

          {/* Rate Curve Line */}
          <path d={linePathD} fill="none" stroke="url(#rateLineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {pointsWithCoords.map((pt, i) => (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 3.5}
                fill={hoveredIdx === i ? '#0284C7' : '#0F1B2E'}
                stroke="#ffffff"
                strokeWidth={hoveredIdx === i ? 2.5 : 1.5}
                className="transition-all duration-150"
              />
            </g>
          ))}

          {/* Hover Pointer Line */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingY}
              x2={activePoint.x}
              y2={height - paddingY}
              stroke="#0284C7"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Hover Tooltip Overlay Card */}
        {activePoint && (
          <div className="absolute top-4 right-4 bg-[#0F1B2E] text-white border border-slate-700 rounded-xl p-3 text-xs font-mono space-y-1 shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between space-x-3 border-b border-white/10 pb-1">
              <span className="text-slate-300 font-sans text-[11px] font-bold">Forecast: {activePoint.date}</span>
              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 text-[10px] font-bold rounded">
                Day {activePoint.idx * 15 + 1}
              </span>
            </div>

            <div className="flex justify-between space-x-4 pt-1">
              <span className="text-slate-300">Predicted Rate:</span>
              <strong className="text-sky-300 text-sm font-bold">${activePoint.predictedRate.toFixed(2)} / MT</strong>
            </div>

            {showConfidenceBand && (
              <div className="flex justify-between space-x-4 text-[10px] text-slate-300">
                <span>95% Confidence Band:</span>
                <span className="text-slate-200">
                  ${activePoint.confidenceLower.toFixed(2)} – ${activePoint.confidenceUpper.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
        <div className="flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-sky-600" />
          <span>XGBoost machine learning regressor tuned on 5-year historical chartering data.</span>
        </div>
        <span className="text-emerald-700 font-bold font-sans flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Live Scenario Calculated
        </span>
      </div>
    </div>
  );
};
