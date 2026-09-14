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
      <div className="card-theme bg-white p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 font-sans">
              <Anchor className="w-5 h-5 text-amber-600" />
              <span>East Coast & Global Ports Registry</span>
            </h1>
            <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              LIVE REGISTRY STREAM
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Max <GlossaryTerm termId="draft">Draft</GlossaryTerm> & <GlossaryTerm termId="loa">LOA</GlossaryTerm> Channel Limitations for Constraint Verification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs card-theme">
            Streaming ports registry...
          </div>
        ) : ports.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-3 card-theme">
            <Anchor className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="text-slate-900 font-bold text-sm font-sans">No Ports Registered</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-sans">
              The port registry stores channel depth constraints (Max Draft) and berth length limits (Max LOA). Use the Data Ingestion Studio to import port CSV feeds.
            </p>
          </div>
        ) : (
          ports.map((port) => (
            <div key={port.id} className="card-theme space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="font-bold text-slate-900 font-sans text-sm">{port.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{port.state || port.country}</div>
                </div>
                <span className="text-xs font-bold font-mono text-slate-700">
                  • {port.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-[9px] uppercase font-bold font-sans">Max <GlossaryTerm termId="draft">Draft</GlossaryTerm></div>
                  <div className="text-base font-bold text-amber-600 font-mono mt-0.5">{port.maxDraftM}m</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-[9px] uppercase font-bold font-sans">Max <GlossaryTerm termId="loa">LOA</GlossaryTerm></div>
                  <div className="text-base font-bold text-blue-600 font-mono mt-0.5">{port.maxLoaM}m</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-1 flex justify-between font-sans border-t border-slate-100">
                <span>Berth Handling Capacity:</span>
                <span className="font-bold text-slate-900 font-mono">{port.berthCapacityTpd ? port.berthCapacityTpd.toLocaleString() : '25,000'} TPD</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
