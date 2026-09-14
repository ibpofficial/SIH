import React from 'react';
import { TrendingUp, TrendingDown, Activity, Globe, Info } from 'lucide-react';

interface IndexItem {
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  unit: string;
  sparklineData: number[];
  sentiment: string;
}

const BENCHMARKS: IndexItem[] = [
  {
    symbol: 'BDI',
    name: 'Baltic Dry Index',
    value: '1,845',
    change: '+2.4%',
    isPositive: true,
    unit: 'pts',
    sparklineData: [1720, 1750, 1740, 1790, 1810, 1845],
    sentiment: 'Bullish Momentum',
  },
  {
    symbol: 'BPI',
    name: 'Baltic Panamax Index',
    value: '$14,250',
    change: '+1.8%',
    isPositive: true,
    unit: '/day',
    sparklineData: [13600, 13800, 13950, 14100, 14050, 14250],
    sentiment: 'East Coast Demand Surge',
  },
  {
    symbol: 'BSI',
    name: 'Baltic Supramax Index',
    value: '$12,850',
    change: '-0.5%',
    isPositive: false,
    unit: '/day',
    sparklineData: [13100, 13000, 12950, 12900, 12880, 12850],
    sentiment: 'Stable Coastal Freight',
  },
  {
    symbol: 'VLSFO',
    name: 'VLSFO Bunker Fuel (SGP)',
    value: '$625',
    change: '+0.8%',
    isPositive: true,
    unit: '/MT',
    sparklineData: [610, 615, 618, 622, 620, 625],
    sentiment: 'Moderate Fuel Cost',
  },
];

export const BalticIndexWidget: React.FC = () => {
  return (
    <div className="card-theme rounded-2xl p-5 border border-slate-200 space-y-4 shadow-card-soft">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-slate-400 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-sans tracking-tight">
              Global Maritime Freight Market Benchmarks
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Live Baltic Exchange Indices & Singapore VLSFO Bunker Fuel Rates
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>BALTIC EXCHANGE LIVE</span>
        </span>
      </div>

      {/* Grid of 4 Market Indices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {BENCHMARKS.map((item) => {
          const maxVal = Math.max(...item.sparklineData);
          const minVal = Math.min(...item.sparklineData);
          const range = maxVal - minVal || 1;

          // SVG Sparkline Points
          const svgPoints = item.sparklineData
            .map((val, idx) => {
              const x = (idx / (item.sparklineData.length - 1)) * 90 + 5;
              const y = 35 - ((val - minVal) / range) * 25;
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <div
              key={item.symbol}
              className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-2 hover:border-sky-500/50 transition-all"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#0F1B2E]">{item.symbol}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-bold text-[10px] flex items-center gap-1 ${
                    item.isPositive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-lg font-bold text-[#0F1B2E] font-serif tabular-nums">{item.value}</div>
                  <div className="text-[9px] text-slate-500">{item.name}</div>
                </div>

                {/* SVG Mini Sparkline */}
                <svg className="w-20 h-9 overflow-visible">
                  <polyline
                    fill="none"
                    stroke={item.isPositive ? '#059669' : '#E11D48'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={svgPoints}
                  />
                </svg>
              </div>

              <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-slate-500">
                <span>Sentiment:</span>
                <span className="font-bold text-[#0F1B2E]">{item.sentiment}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Benchmark Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-sky-600" />
          <span>Spot freight estimates automatically benchmarked against Baltic Panamax Index (BPI).</span>
        </div>
        <span className="text-sky-700 font-bold">Updated 15 mins ago</span>
      </div>
    </div>
  );
};
