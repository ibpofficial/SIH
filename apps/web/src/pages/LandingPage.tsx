import React from 'react';
import {
  Ship,
  TrendingUp,
  Anchor,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  Flag,
  Sparkles,
  Zap,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-orange-500/10 selection:text-orange-900">
      {/* Subtle Top Accent Line */}
      <div className="h-1 w-full tricolor-stripe" />

      {/* Header */}
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
            FIQ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base font-display">FreightIQ</span>
              <span className="px-2.5 py-0.5 tricolor-badge text-[10px] font-semibold text-slate-700 rounded-full border border-orange-200/60 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-india-saffron" />
                <span>SIH26006 • East Coast Hub</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Smart India Bulk Cargo Chartering Platform</p>
          </div>
        </div>

        <button
          onClick={onStartDemo}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-2"
        >
          <span>Try Interactive Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl mx-auto px-6 md:px-12 py-16 space-y-20">
        {/* HERO SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-slate-100 border border-slate-200/80 rounded-full text-slate-700 text-xs font-medium font-mono">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Intelligent Bulk Cargo Procurement Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight font-display">
            FreightIQ helps shipping teams decide <span className="text-orange-600 font-bold">which vessel to book</span>, when to book, and whether to lock in a contract — using real freight data instead of guesswork.
          </h1>

          <p className="text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Designed specifically for Smart India Hackathon problem statement <strong>SIH26006</strong>, evaluating East Coast Indian ports (Paradip, Visakhapatnam, Haldia, Gangavaram), vessel draft constraints, rate trends, and contract strategy.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onStartDemo}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-2.5"
            >
              <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>Launch Interactive Platform Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HOW IT WORKS SECTION (4 STEPS VISUAL) */}
        <div className="space-y-8 border-t border-slate-200/80 pt-16">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold font-mono text-orange-600 uppercase tracking-wider">Simple 4-Step Decision Flow</h2>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display">How FreightIQ Optimizes Chartering</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono text-xs">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-700 font-extrabold text-sm flex items-center justify-center font-sans">
                1
              </div>
              <div className="font-bold text-slate-900 text-sm font-sans">Enter Cargo Requirements</div>
              <p className="text-slate-500 font-sans leading-relaxed text-[11px]">
                Input cargo quantity, origin loading hub, destination discharge port, and required laycan window.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-sm flex items-center justify-center font-sans">
                2
              </div>
              <div className="font-bold text-slate-900 text-sm font-sans">Check Draft & Rate Forecast</div>
              <p className="text-slate-500 font-sans leading-relaxed text-[11px]">
                Engine verifies port draft & LOA constraints while backtested ML models project 90-day rate curves.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-sm flex items-center justify-center font-sans">
                3
              </div>
              <div className="font-bold text-slate-900 text-sm font-sans">Get Clear AI Recommendation</div>
              <p className="text-slate-500 font-sans leading-relaxed text-[11px]">
                Receive top feasible vessel tonnage recommendations, contract strategy advice, and Gemini AI reasoning.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 font-extrabold text-sm flex items-center justify-center font-sans">
                4
              </div>
              <div className="font-bold text-slate-900 text-sm font-sans">Simulate "What-If" Scenarios</div>
              <p className="text-slate-500 font-sans leading-relaxed text-[11px]">
                Stress-test freight rate spikes, port congestion delays, and deadline shifts before committing.
              </p>
            </div>
          </div>
        </div>

        {/* WHO IT'S FOR SECTION */}
        <div className="space-y-8 border-t border-slate-200/80 pt-16">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold font-mono text-emerald-600 uppercase tracking-wider">Tailored Role Workflows</h2>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display">Who FreightIQ Is Built For</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-orange-600" />
                <span>Chartering & Procurement Managers</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Make data-backed decisions on locking in 6-month COA contracts versus spot market fixtures.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Freight Analysts</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Inspect walk-forward ML backtest metrics (MAE/MAPE) across SARIMAX, Linear Regression, and XGBoost models.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Auditors & Governance Officers</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Review immutable audit logs recording every procurement decision, contract change, and data commit.
              </p>
            </div>
          </div>
        </div>

        {/* PREVIEW CARD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-slate-900 text-sm font-sans">Hero Demo Scenario Preview: Australian Coking Coal → Paradip</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono rounded-md font-semibold border border-emerald-200/80">
              PRE-SEEDED DEMO SCENARIO
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Cargo Quantity</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">200,000 MT</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Recommended Tonnage</div>
              <div className="text-base font-bold text-emerald-700 mt-0.5 font-sans">Panamax Carrier</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Optimal Strategy</div>
              <div className="text-base font-bold text-orange-600 mt-0.5 font-sans">6-Month COA Contract</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs font-mono border-t border-slate-200/80 bg-white">
        FreightIQ • Smart India Hackathon PS SIH26006 • East Coast Indian Ports Chartering Decision Platform
      </footer>
    </div>
  );
};
