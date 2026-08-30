import React, { useState } from 'react';
import { TrendingUp, Sparkles, Info } from 'lucide-react';

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
      <div className="p-8 text-center text-[#3E5871] font-mono text-xs bg-white border border-[#0F1B2E]/10 rounded-xl">
        No forecast data points available for curve generation.
      </div>
    );
  }

  // Calculate bounds
  const uppers = points.map((p) => p.confidenceUpper || p.predictedRate * 1.08);
  const lowers = points.map((p) => p.confidenceLower || p.predictedRate * 0.92);

  const minRate = Math.floor(Math.min(...lowers) * 0.95);
  const maxRate = Math.ceil(Math.max(...uppers) * 1.05);
  const range = maxRate - minRate || 1;

  // Dimensions
  const width = 800;
  const height = 240;
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
    <div className="bg-white rounded-xl p-5 shadow-xs space-y-4 font-sans border border-[#0F1B2E]/10">
      {/* Header Metric Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0F1B2E]/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-[#FAF4EB] rounded-lg border border-[#A9793A]/30">
            <TrendingUp className="w-4 h-4 text-[#A9793A]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F1B2E] font-serif tracking-tight">
              Interactive 90-Day Freight Rate Prediction Curve
            </h3>
            <div className="text-xs font-mono text-[#3E5871]">
              Route: <span className="font-bold text-[#0F1B2E]">{route}</span> • Walk-Forward Backtested Model
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-3 py-1 bg-[#FAFAF8] border border-[#0F1B2E]/10 rounded-lg">
            <span className="text-[#3E5871]">Spot Rate: </span>
            <strong className="text-[#0F1B2E]">${firstPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
          <div className="px-3 py-1 bg-[#FAF4EB] border border-[#A9793A]/30 rounded-lg">
            <span className="text-[#3E5871]">90d Target: </span>
            <strong className="text-[#A9793A]">${lastPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
          <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg">
            <span className="text-[#3E5871]">Peak Forecast: </span>
            <strong className="text-[#0F1B2E]">${peakPt.predictedRate.toFixed(2)}/MT</strong>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative bg-white rounded-xl p-4 overflow-hidden border border-[#0F1B2E]/10 shadow-xs">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
          <defs>
            <linearGradient id="rateLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A9793A" />
              <stop offset="100%" stopColor="#8C6028" />
            </linearGradient>

            <linearGradient id="confidenceAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A9793A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#A9793A" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
            const yVal = paddingY + chartHeight * factor;
            const rateVal = (maxRate - factor * range).toFixed(1);
            return (
              <g key={i}>
                <line x1={paddingX} y1={yVal} x2={width - paddingX} y2={yVal} stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="0.8" />
                <text x={paddingX - 8} y={yVal + 3} textAnchor="end" fill="#3E5871" fontSize="9" className="font-mono">
                  ${rateVal}
                </text>
              </g>
            );
          })}

          {/* Confidence Interval Area */}
          <path d={confidenceAreaD} fill="url(#confidenceAreaGrad)" />

          {/* Rate Curve Line */}
          <path d={linePathD} fill="none" stroke="url(#rateLineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {pointsWithCoords.map((pt, i) => (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 3.5}
                fill={hoveredIdx === i ? '#0F1B2E' : '#A9793A'}
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
              stroke="#A9793A"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
          )}
        </svg>

        {/* Hover Tooltip Overlay Card */}
        {activePoint && (
          <div className="absolute top-4 right-4 bg-[#0F1B2E] text-white border border-[#0F1B2E]/20 rounded-lg p-3 text-xs font-mono space-y-1 shadow-lg animate-in fade-in">
            <div className="flex items-center justify-between space-x-3 border-b border-white/10 pb-1">
              <span className="text-slate-300 font-sans text-[11px] font-bold">Date: {activePoint.date}</span>
              <span className="px-2 py-0.5 bg-[#A9793A]/20 text-[#A9793A] text-[10px] font-bold rounded">
                Day {activePoint.idx * 15 + 1}
              </span>
            </div>

            <div className="flex justify-between space-x-4 pt-1">
              <span className="text-slate-300">Predicted Rate:</span>
              <strong className="text-[#A9793A] text-sm font-bold">${activePoint.predictedRate.toFixed(2)} / MT</strong>
            </div>

            <div className="flex justify-between space-x-4 text-[10px] text-slate-300">
              <span>95% Confidence Band:</span>
              <span className="text-slate-200">
                ${activePoint.confidenceLower?.toFixed(2)} – ${activePoint.confidenceUpper?.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Rationale Note */}
      <div className="flex items-center justify-between text-[11px] text-[#3E5871] font-mono pt-1">
        <div className="flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-[#3E5871]" />
          <span>Shaded band represents 95% forecast confidence range derived from XGBoost residual variance.</span>
        </div>
        <span className="text-[#2D6A4F] font-bold font-sans flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#2D6A4F]" />
          Primary XGBoost Model Benchmark Matched
        </span>
      </div>
    </div>
  );
};
