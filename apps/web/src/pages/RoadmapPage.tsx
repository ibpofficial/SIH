import React from 'react';
import { Compass, Navigation, Radio, Database } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const RoadmapPage: React.FC = () => {
  const items = [
    {
      title: '1. Live AIS Vessel Tracking API Feed',
      status: 'Target Q1 2027',
      icon: Radio,
      color: 'text-[#2C5282] bg-[#EBF8FF] border-[#2C5282]/30',
      description: 'Integrate satellite AIS streams (Spire / MarineTraffic) for live vessel positions, sea speed telemetry, and precise ETA predictions at East Coast discharge berths.'
    },
    {
      title: '2. Multi-Vessel Fleet Scheduling Optimizer',
      status: 'Target Q2 2027',
      icon: Navigation,
      color: 'text-[#2D6A4F] bg-[#F0F7F4] border-[#2D6A4F]/30',
      description: 'Extend single-request vessel matching to global fleet-level linear programming, optimizing multi-vessel fixtures across simultaneous bulk procurement contracts.'
    },
    {
      title: '3. Automated Market Data Feed Scraping',
      status: 'Target Q3 2027',
      icon: Database,
      color: 'text-[#A9793A] bg-[#FAF4EB] border-[#A9793A]/30',
      description: 'Connect direct APIs for Baltic Dry Index (BDI), Capesize 5TC, Platts Coking Coal, and Argus Thermal Coal spot benchmarks for continuous ML retrain loops.'
    },
    {
      title: '4. Real-Time Indian Port Congestion Feed',
      status: 'Target Q4 2027',
      icon: Compass,
      color: 'text-[#9C6615] bg-[#FFF8E7] border-[#9C6615]/30',
      description: 'Ingest live tugboat availability, anchorage queue counts, and monsoon weather radar data across Paradip, Visakhapatnam, and Haldia dock complexes.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/roadmap" onNavigate={() => {}} />

      {/* Title Header */}
      <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] flex items-center gap-2 font-serif">
            <Compass className="w-5 h-5 text-[#A9793A]" />
            <span>Future Scope & Production Roadmap (SIH26006)</span>
          </h1>
          <p className="text-xs text-[#3E5871] font-mono mt-0.5">
            Planned Technical Extensions for Full Commercial FreightIQ Production Rollout
          </p>
        </div>
        <span className="px-3 py-1 bg-[#FAF4EB] text-[#A9793A] border border-[#A9793A]/30 text-xs font-bold rounded font-mono">
          SIH26006 Roadmap
        </span>
      </div>

      {/* Grid of 4 Roadmap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center font-bold border`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="px-2.5 py-0.5 bg-[#FAFAF8] text-[#0F1B2E] rounded text-[10px] font-bold border border-[#0F1B2E]/10">
                  {item.status}
                </span>
              </div>

              <div className="font-bold text-[#0F1B2E] text-sm font-serif">{item.title}</div>
              <p className="text-xs text-[#3E5871] font-sans leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
