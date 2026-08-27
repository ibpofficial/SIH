import React from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import { Ship, Radio } from 'lucide-react';

export const VesselsPage: React.FC = () => {
  const { data: vessels, loading } = useFirestoreCollection<any>('vesselTypes');

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/vessels" onNavigate={() => {}} />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Ship className="w-5 h-5 text-blue-600" />
              <span>Bulk Vessel Classes Registry</span>
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 border border-emerald-300">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>FIREBASE REAL-TIME</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            DWT Deadweight Tonnage, <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Specifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-8 text-center text-slate-400 font-mono text-xs">
            Streaming vessel classes from registry...
          </div>
        ) : vessels.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-3 bg-white border border-slate-200 rounded-xl">
            <Ship className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-slate-900 font-bold text-sm">No Vessel Classes Registered</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-mono">
              The vessel class registry contains physical specifications (DWT, Max Draft, LOA) used by constraint solvers. Use the Data Ingestion Studio to import vessel fleet CSV data.
            </p>
          </div>
        ) : (
          vessels.map((v) => (
            <div key={v.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <div className="font-bold text-slate-900 font-sans text-sm">{v.name}</div>
                  <div className="text-[10px] text-slate-500">DWT Range: {v.minDwt?.toLocaleString()} – {v.maxDwt?.toLocaleString()} MT</div>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded font-mono border border-blue-200">
                  {v.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-400 text-[9px] uppercase font-bold">Vessel <GlossaryTerm termId="draft">Draft</GlossaryTerm></div>
                  <div className="text-sm font-bold text-orange-600 font-mono mt-0.5">{v.draftM}m</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-slate-400 text-[9px] uppercase font-bold">Length Overall (<GlossaryTerm termId="loa">LOA</GlossaryTerm>)</div>
                  <div className="text-sm font-bold text-blue-600 font-mono mt-0.5">{v.lengthM}m</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
