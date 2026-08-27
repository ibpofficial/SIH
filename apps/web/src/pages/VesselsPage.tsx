import React from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import { Ship, Radio, Compass } from 'lucide-react';

export const VesselsPage: React.FC = () => {
  const { data: vessels, loading } = useFirestoreCollection<any>('vesselTypes');

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/vessels" onNavigate={() => {}} />

      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 font-display">
              <Ship className="w-5 h-5 text-blue-600" />
              <span>Bulk Vessel Classes Registry</span>
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 border border-emerald-300">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>REAL-TIME FLEET STREAM</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Deadweight Tonnage (DWT), Maximum <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Specifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 font-mono text-xs glass-card rounded-2xl">
            Streaming vessel fleet registry...
          </div>
        ) : vessels.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-3 glass-card rounded-2xl">
            <Ship className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-slate-900 font-bold text-sm font-sans">No Vessel Classes Registered</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-sans">
              The vessel class registry stores physical dimensions (DWT, Max Draft, LOA) used by constraint solvers. Use the Data Ingestion Studio to import vessel fleet CSV data.
            </p>
          </div>
        ) : (
          vessels.map((v) => (
            <div key={v.id} className="glass-card rounded-2xl p-5 shadow-sm space-y-3 font-mono text-xs hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="font-extrabold text-slate-900 font-sans text-sm">{v.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Capacity DWT: <span className="font-bold text-slate-800">{v.minDwt?.toLocaleString()} – {v.maxDwt?.toLocaleString()} MT</span></div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-[10px] font-bold rounded-full font-mono border border-blue-200 shadow-2xs">
                  {v.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <div className="text-slate-400 text-[9px] uppercase font-bold font-sans">Vessel Max <GlossaryTerm termId="draft">Draft</GlossaryTerm></div>
                  <div className="text-base font-extrabold text-orange-600 font-mono mt-0.5">{v.draftM}m</div>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <div className="text-slate-400 text-[9px] uppercase font-bold font-sans">Length Overall (<GlossaryTerm termId="loa">LOA</GlossaryTerm>)</div>
                  <div className="text-base font-extrabold text-blue-600 font-mono mt-0.5">{v.lengthM}m</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

