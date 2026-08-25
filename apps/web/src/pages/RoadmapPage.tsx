import React from 'react';
import { Compass, Sparkles, Navigation, Radio, Database, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const items = [
    {
      title: '1. Live AIS Vessel Tracking API Feed',
      status: 'Target Q1 2027',
      icon: Radio,
      color: 'text-blue-600 bg-blue-100 border-blue-200',
      description: 'Integrate satellite AIS streams (Spire / MarineTraffic) for live vessel positions, sea speed telemetry, and precise ETA predictions at East Coast discharge berths.'
    },
    {
      title: '2. Multi-Vessel Fleet Scheduling Optimizer',
      status: 'Target Q2 2027',
      icon: Navigation,
      color: 'text-emerald-600 bg-emerald-100 border-emerald-200',
      description: 'Extend single-request vessel matching to global fleet-level linear programming, optimizing multi-vessel fixtures across simultaneous bulk procurement contracts.'
    },
    {
      title: '3. Automated Market Data Feed Scraping',
      status: 'Target Q3 2027',
      icon: Database,
      color: 'text-purple-600 bg-purple-100 border-purple-200',
      description: 'Connect direct APIs for Baltic Dry Index (BDI), Capesize 5TC, Platts Coking Coal, and Argus Thermal Coal spot benchmarks for continuous ML retrain loops.'
    },
    {
      title: '4. Real-Time Indian Port Congestion Feed',
      status: 'Target Q4 2027',
      icon: Compass,
      color: 'text-orange-600 bg-orange-100 border-orange-200',
      description: 'Ingest live tugboat availability, anchorage queue counts, and monsoon weather radar data across Paradip, Visakhapatnam, and Haldia dock complexes.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-india-saffron" />
            <span>Future Scope & Production Roadmap (SIH26006)</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Planned Technical Extensions for Full Commercial FreightIQ Production Rollout
          </p>
        </div>
        <span className="px-3 py-1 tricolor-badge text-xs font-bold text-slate-800 rounded-full border border-orange-300 font-mono">
          SIH26006 Roadmap
        </span>
      </div>

      {/* Grid of 4 Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold border border-slate-200">
                  {item.status}
                </span>
              </div>

              <div className="font-bold text-slate-900 text-sm font-sans">{item.title}</div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
