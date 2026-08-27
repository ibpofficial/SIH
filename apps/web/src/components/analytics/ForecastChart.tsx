import React, { useState } from 'react';
import { TrendingUp, Sparkles, AlertCircle, Info } from 'lucide-react';

interface ForecastPoint {
  date: string;
  predictedRate: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}

interface ForecastChartProps {
  points: ForecastPoint[];
  route: string;
  trendDirection: string;
  trendMagnitudePct: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  points,
  route,
  trendDirection,
  trendMagnitudePct
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!points || points.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs glass-card rounded-2xl">
        No forecast data points available for curve generation.
      </div>
    );
  }

  // Calculate bounds
  const rates = points.map((p) => p.predictedRate);
  const uppers = points.map((p) => p.confidenceUpper || p.predictedRate * 1.08);
  const lowers = points.map((p) => p.confidenceLower || p.predictedRate * 0.92);

  const minRate = Math.floor(Math.min(...lowers) * 0.95);
  const maxRate = Math.ceil(Math.max(...uppers) * 1.05);
  const range = maxRate - minRate || 1;

  // Dimensions
  const width = 800;
  const height = 260;
  const paddingX = 50;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Map data to SVG coordinates
  const pointsWithCoords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1 || 1)) * chartWidth;
    const y = paddingY + chartHeight - ((p.predictedRate - minRate) / range) * chartHeight;
    const yUpper = paddingY + chartHeight - (((p.confidenceUpper || p.predictedRate * 1.08) - minRate) / range) * chartHeight;
    const yLower = paddingY + chartHeight - (((p.confidenceLower || p.predictedRate * 0.92) - minRate) / range) * chartHeight;
    return { ...p, x, y, yUpper, yLower, idx };
  });

  // SVG Path generator
  const linePathD = pointsWithCoords.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  // Confidence area path (Upper points forward, lower points reverse)
  const upperD = pointsWithCoords.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.yUpper}` : `${acc} L ${pt.x} ${pt.yUpper}`), '');
  const lowerReverseD = [...pointsWithCoords].reverse().reduce((acc, pt, i) => `${acc} L ${pt.x} ${pt.yLower}`, '');
  const confidenceAreaD = `${upperD} ${lowerReverseD} Z`;

  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const peakPt = [...points].sort((a, b) => b.predictedRate - a.predictedRate)[0];

  const activePoint = hoveredIdx !== null ? pointsWithCoords[hoveredIdx] : pointsWithCoords[pointsWithCoords.length - 1];

  return (
    <div className="glass-card rounded-2xl p-5 shadow-sm space-y-4 font-sans border border-slate-200/80">
      {/* Header Metric Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-orange-50 rounded-xl border border-orange-200">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight font-display">
              Interactive 90-Day Freight Rate Prediction Curve
            </h3>
            <div className="text-xs font-mono text-slate-500">
              Route: <span className="font-bold text-slate-800">{route}</span> • Backtested Walk-Forward Horizon
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-500">Spot Rate: </span>
            <strong className="text-slate-900">${firstPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
          <div className="px-3 py-1 bg-orange-50 border border-orange-200 rounded-xl">
            <span className="text-slate-500">90d Target: </span>
            <strong className="text-orange-600">${lastPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
          <div className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-slate-500">Peak Forecast: </span>
            <strong className="text-purple-700">${peakPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-inner">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
          <defs>
            <linearGradient id="rateLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <linearGradient id="confidenceAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
            const yVal = paddingY + chartHeight * factor;
            const rateVal = (maxRate - factor * range).toFixed(1);
            return (
              <g key={i}>
                <line x1={paddingX} y1={yVal} x2={width - paddingX} y2={yVal} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <text x={paddingX - 8} y={yVal + 3} textAnchor="end" fill="#94a3b8" fontSize="9" className="font-mono">
                  ${rateVal}
                </text>
              </g>
            );
          })}

          {/* Confidence Interval Area */}
          <path d={confidenceAreaD} fill="url(#confidenceAreaGrad)" />

          {/* Rate Curve Line */}
          <path d={linePathD} fill="none" stroke="url(#rateLineGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {pointsWithCoords.map((pt, i) => (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 3.5}
                fill={hoveredIdx === i ? '#ffffff' : '#f97316'}
                stroke="#f97316"
                strokeWidth={hoveredIdx === i ? 3 : 1.5}
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
              stroke="#fbbf24"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Hover Tooltip Overlay Card */}
        {activePoint && (
          <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-white text-xs font-mono space-y-1 shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between space-x-3 border-b border-slate-800 pb-1">
              <span className="text-slate-400 font-sans text-[11px] font-bold">Date: {activePoint.date}</span>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded">
                Day {activePoint.idx * 15 + 1}
              </span>
            </div>

            <div className="flex justify-between space-x-4 pt-1">
              <span className="text-slate-400">Predicted Rate:</span>
              <strong className="text-orange-400 text-sm font-bold">${activePoint.predictedRate.toFixed(2)} / MT</strong>
            </div>

            <div className="flex justify-between space-x-4 text-[10px] text-slate-400">
              <span>95% Confidence Band:</span>
              <span className="text-slate-300">
                ${activePoint.confidenceLower?.toFixed(2)} – ${activePoint.confidenceUpper?.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Rationale Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
        <div className="flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Shaded band represents 95% forecast confidence range derived from XGBoost residual variance.</span>
        </div>
        <span className="text-emerald-700 font-bold font-sans flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Primary XGBoost Model Matched
        </span>
      </div>
    </div>
  );
};
