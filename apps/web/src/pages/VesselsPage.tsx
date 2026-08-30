import React from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import { CharterStampBadge } from '../components/ui/CharterStampBadge';
import { Ship, Radio } from 'lucide-react';

export const VesselsPage: React.FC = () => {
  const { data: vessels, loading } = useFirestoreCollection<any>('vesselTypes');

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/vessels" onNavigate={() => {}} />

      {/* Header Banner */}
      <div className="bg-white border border-[#0F1B2E]/10 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] flex items-center gap-2 font-serif">
              <Ship className="w-5 h-5 text-[#A9793A]" />
              <span>Bulk Vessel Classes Registry</span>
            </h1>
            <span className="px-2.5 py-0.5 bg-[#F0F7F4] text-[#2D6A4F] text-[10px] font-mono rounded font-bold flex items-center gap-1 border border-[#2D6A4F]/30">
              <Radio className="w-3 h-3 text-[#2D6A4F] animate-pulse" />
              <span>REAL-TIME FLEET STREAM</span>
            </span>
          </div>
          <p className="text-xs text-[#3E5871] font-mono mt-1">
            Deadweight Tonnage (DWT), Maximum <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Specifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-[#3E5871] font-mono text-xs bg-white border border-[#0F1B2E]/10 rounded-xl">
            Streaming vessel fleet registry...
          </div>
        ) : vessels.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-3 bg-white border border-[#0F1B2E]/10 rounded-xl">
            <Ship className="w-12 h-12 text-[#3E5871] mx-auto" />
            <div className="text-[#0F1B2E] font-bold text-sm font-serif">No Vessel Classes Registered</div>
            <p className="text-xs text-[#3E5871] max-w-md mx-auto font-sans">
              The vessel class registry stores physical dimensions (DWT, Max Draft, LOA) used by constraint solvers. Use the Data Ingestion Studio to import vessel fleet CSV data.
            </p>
          </div>
        ) : (
          vessels.map((v) => (
            <div key={v.id} className="bg-white border border-[#0F1B2E]/10 rounded-xl p-5 shadow-xs space-y-3 font-mono text-xs hover:border-[#A9793A] transition-colors">
              <div className="flex items-center justify-between border-b border-[#0F1B2E]/10 pb-3">
                <div>
                  <div className="font-bold text-[#0F1B2E] font-serif text-sm">{v.name}</div>
                  <div className="text-[10px] text-[#3E5871] mt-0.5">Capacity DWT: <span className="font-bold text-[#0F1B2E]">{v.minDwt?.toLocaleString()} – {v.maxDwt?.toLocaleString()} MT</span></div>
                </div>
                <CharterStampBadge variant="FEASIBLE" label={v.code} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#0F1B2E]/10">
                  <div className="text-[#3E5871] text-[9px] uppercase font-bold font-sans">Vessel Max <GlossaryTerm termId="draft">Draft</GlossaryTerm></div>
                  <div className="text-base font-bold text-[#A9793A] font-mono mt-0.5">{v.draftM}m</div>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#0F1B2E]/10">
                  <div className="text-[#3E5871] text-[9px] uppercase font-bold font-sans">Length Overall (<GlossaryTerm termId="loa">LOA</GlossaryTerm>)</div>
                  <div className="text-base font-bold text-[#2C5282] font-mono mt-0.5">{v.lengthM}m</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
