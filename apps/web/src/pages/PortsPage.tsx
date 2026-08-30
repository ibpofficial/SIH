import React from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import { Anchor, Radio } from 'lucide-react';

export const PortsPage: React.FC = () => {
  const { data: ports, loading } = useFirestoreCollection<any>('ports');

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/ports" onNavigate={() => {}} />

      {/* Header Banner */}
      <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] flex items-center gap-2 font-serif">
              <Anchor className="w-5 h-5 text-[#A9793A]" />
              <span>East Coast & Global Ports Registry</span>
            </h1>
            <span className="px-2.5 py-0.5 bg-[#F0F7F4] text-[#2D6A4F] text-[10px] font-mono rounded font-bold flex items-center gap-1 border border-[#2D6A4F]/30">
              <Radio className="w-3 h-3 text-[#2D6A4F] animate-pulse" />
              <span>LIVE REGISTRY STREAM</span>
            </span>
          </div>
          <p className="text-xs text-[#3E5871] font-mono mt-1">
            Max <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Channel Limitations for Constraint Verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-[#3E5871] font-mono text-xs bg-white border border-[#0F1B2E]/10 rounded-xl">
            Streaming ports registry...
          </div>
        ) : ports.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-3 bg-white border border-[#0F1B2E]/10 rounded-xl">
            <Anchor className="w-12 h-12 text-[#3E5871] mx-auto" />
            <div className="text-[#0F1B2E] font-bold text-sm font-serif">No Ports Registered</div>
            <p className="text-xs text-[#3E5871] max-w-md mx-auto font-sans">
              The port registry stores channel depth constraints (Max Draft) and berth length limits (Max LOA). Use the Data Ingestion Studio to import port CSV feeds.
            </p>
          </div>
        ) : (
          ports.map((port) => (
            <div key={port.id} className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-3 font-mono text-xs hover:border-[#A9793A] transition-colors">
              <div className="flex items-center justify-between border-b border-[#0F1B2E]/10 pb-3">
                <div>
                  <div className="font-bold text-[#0F1B2E] font-serif text-sm">{port.name}</div>
                  <div className="text-[10px] text-[#3E5871] mt-0.5">{port.state || port.country}</div>
                </div>
                <span className="px-2.5 py-1 bg-[#FAFAF8] text-[#0F1B2E] text-[10px] font-bold rounded border border-[#0F1B2E]/10 font-mono">
                  {port.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#0F1B2E]/10">
                  <div className="text-[#3E5871] text-[9px] uppercase font-bold font-sans">Max <GlossaryTerm termId="draft">Draft</GlossaryTerm></div>
                  <div className="text-base font-bold text-[#A9793A] font-mono mt-0.5">{port.maxDraftM}m</div>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#0F1B2E]/10">
                  <div className="text-[#3E5871] text-[9px] uppercase font-bold font-sans">Max <GlossaryTerm termId="loa">LOA</GlossaryTerm></div>
                  <div className="text-base font-bold text-[#2C5282] font-mono mt-0.5">{port.maxLoaM}m</div>
                </div>
              </div>

              <div className="text-[10px] text-[#3E5871] pt-1 flex justify-between font-sans border-t border-[#0F1B2E]/10">
                <span>Berth Handling Capacity:</span>
                <span className="font-bold text-[#0F1B2E] font-mono">{port.berthCapacityTpd ? port.berthCapacityTpd.toLocaleString() : '25,000'} TPD</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
