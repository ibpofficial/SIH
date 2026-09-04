import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Database,
  Cpu,
  Brain,
  Server,
  HelpCircle,
  CheckCircle2,
  UploadCloud,
  FileSpreadsheet,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Zap,
  Info,
  Flame,
  ArrowRight
} from 'lucide-react';

interface DemoDataInstructionsCardProps {
  isOfflineDemoMode: boolean;
  onClearDemoData: () => void;
  onNavigate?: (path: string) => void;
}

export const DemoDataInstructionsCard: React.FC<DemoDataInstructionsCardProps> = ({
  isOfflineDemoMode,
  onClearDemoData,
  onNavigate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'CONNECT_REAL' | 'HOW_IT_WORKS'>('CONNECT_REAL');

  return (
    <div className="card-theme rounded-2xl border border-amber-300/80 bg-amber-50/50 overflow-hidden shadow-xs print:hidden transition-all font-sans">
      {/* Banner Top Row */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-amber-900 text-xs font-mono uppercase tracking-wider">
                {isOfflineDemoMode ? '⚠️ Offline Demo Data Active' : 'ℹ️ Demonstration Data & Easy Cloud Setup Guide'}
              </span>
              <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 border border-amber-300 text-[10px] font-mono rounded font-bold">
                SIH26006 GUIDANCE
              </span>
            </div>
            <p className="text-xs text-amber-800 font-sans mt-0.5">
              Currently showing synthetic demonstration data. Expand below to see how to upload your real data in 1 click & how features work.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
          {onNavigate && (
            <button
              onClick={() => onNavigate('/ingestion')}
              className="px-3.5 py-1.5 bg-[#0F1B2E] text-white hover:bg-slate-800 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload Real Data</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <span>{isExpanded ? 'Hide Guide' : 'How to Upload Real Data & Guide'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isOfflineDemoMode && (
            <button
              onClick={onClearDemoData}
              className="decline-button-theme text-[11px] font-mono uppercase font-bold"
            >
              Clear Demo Data
            </button>
          )}
        </div>
      </div>

      {/* Expandable Guide Panel */}
      {isExpanded && (
        <div className="border-t border-amber-200 bg-white p-5 space-y-5 animate-in fade-in duration-200">
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 pb-2 gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('CONNECT_REAL')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'CONNECT_REAL'
                  ? 'bg-[#0F1B2E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-sky-400" />
              <span>How to Upload Real Data (Simple 3 Steps)</span>
            </button>

            <button
              onClick={() => setActiveTab('HOW_IT_WORKS')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'HOW_IT_WORKS'
                  ? 'bg-[#0F1B2E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>How Features Work (Simple Words Guide)</span>
            </button>
          </div>

          {/* TAB 1: How to Upload Real Data (Super Simple) */}
          {activeTab === 'CONNECT_REAL' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-sky-900 flex items-start space-x-3">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Zero technical setup needed!</strong> You do not need to run terminal commands or local servers. FreightIQ uses <strong>Firebase Cloud</strong> to automatically handle data storage and decision calculations live in the cloud.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Step 1 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-[#0F1B2E]">
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <UploadCloud className="w-4 h-4 text-sky-600" />
                    <span>Open Data Ingestion Studio</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed">
                    Click <strong className="text-slate-900">"Data Ingestion Studio"</strong> in the left sidebar menu (or click the black button on the top right of this banner).
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-[#0F1B2E]">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      2
                    </span>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Drag & Drop Your CSV File</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed">
                    Select your Excel or CSV file containing your real freight market rates, port harbor depth limits, or vessel fleet capacities and drop it into the upload box.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-[#0F1B2E]">
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">
                      3
                    </span>
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span>Firebase Cloud Auto-Sync</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs leading-relaxed">
                    Firebase Cloud instantly saves your data, updates all live decision models, and syncs across all user screens automatically — 100% online in the cloud!
                  </p>
                </div>
              </div>

              {onNavigate && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('/ingestion')}
                    className="accept-button-theme px-5 py-2.5 text-xs font-mono font-bold flex items-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Go to Data Ingestion Studio Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: How Features Work (Simple Words) */}
          {activeTab === 'HOW_IT_WORKS' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-900 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  FreightIQ makes complex maritime logistics clear for managers, buyers, and executives. Here is how each feature works in plain words:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="font-bold text-[#0F1B2E] flex items-center space-x-2 font-serif text-sm">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <span>1. XGBoost 90-Day Rate Forecast</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Predicts whether ocean shipping costs for your cargo route will rise or fall over the next 3 months using Machine Learning, so you know whether to lock in a contract now or wait.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="font-bold text-[#0F1B2E] flex items-center space-x-2 font-serif text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. Port & Vessel Constraint Solver</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Checks ship size and underwater draft depth against harbor channel depth (e.g. Vizag max depth 14.5m) to ensure the vessel can safely dock without incurring heavy demurrage fines.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="font-bold text-[#0F1B2E] flex items-center space-x-2 font-serif text-sm">
                    <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                    <span>3. Contract Strategy Comparison (₹ Crores)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Compares long-term 6-Month multi-voyage contracts (COA) against 3-Month and Spot charters, calculating exact net savings in <strong>Indian Rupee Crores (₹ Cr)</strong>.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="font-bold text-[#0F1B2E] flex items-center space-x-2 font-serif text-sm">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    <span>4. What-If Interactive Risk Simulator</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Allows you to move interactive sliders to simulate fuel price increases or port congestion delays, instantly updating total voyage cost predictions and risk gauges.
                  </p>
                </div>
              </div>

              {/* Currency Approach Note */}
              <div className="p-4 bg-[#0F1B2E] text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold text-sm">
                    ₹
                  </div>
                  <div>
                    <div className="font-bold text-white font-serif text-sm">Dual Currency (Rupee Primary ₹ / USD Secondary $)</div>
                    <div className="text-slate-300 text-[11px] font-sans">
                      Financial figures are formatted primarily in <strong>₹ Indian Rupee Crores (₹ Cr)</strong> and <strong>₹ per Metric Ton (₹/MT)</strong>, with <strong>$ USD</strong> in parentheses for international maritime clarity.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
