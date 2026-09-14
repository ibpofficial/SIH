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
      <div className="card-theme bg-white p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
              <Ship className="w-5 h-5 text-amber-600" />
              <span>Bulk Vessel Classes Registry</span>
            </h1>
            <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              REAL-TIME FLEET STREAM
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Deadweight Tonnage (DWT), Maximum <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Specifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs card-theme">
            Streaming vessel fleet registry...
          </div>
        ) : vessels.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-3 card-theme">
            <Ship className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="text-slate-900 font-bold text-sm font-sans">No Vessel Classes Registered</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-sans">
              The vessel class registry stores physical dimensions (DWT, Max Draft, LOA) used by constraint solvers. Use the Data Ingestion Studio to import vessel fleet CSV data.
            </p>
          </div>
        ) : (
          vessels.map((v) => (
            <div key={v.id} className="card-theme space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="font-bold text-slate-900 font-sans text-sm">{v.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Capacity DWT: <span className="font-bold text-slate-900">{v.minDwt?.toLocaleString()} – {v.maxDwt?.toLocaleString()} MT</span></div>
                </div>
                <CharterStampBadge variant="FEASIBLE" label={v.code} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-[9px] uppercase font-bold font-sans">Vessel Max <GlossaryTerm termId="draft">Draft</GlossaryTerm></div>
                  <div className="text-base font-bold text-amber-600 font-mono mt-0.5">{v.draftM}m</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-[9px] uppercase font-bold font-sans">Length Overall (<GlossaryTerm termId="loa">LOA</GlossaryTerm>)</div>
                  <div className="text-base font-bold text-blue-600 font-mono mt-0.5">{v.lengthM}m</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
