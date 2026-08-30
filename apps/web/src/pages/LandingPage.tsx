import React from 'react';
import {
  Ship,
  TrendingUp,
  Anchor,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { CookieConsentCard } from '../components/ui/CookieConsentCard';

interface LandingPageProps {
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo }) => {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F1B2E] font-sans flex flex-col justify-between selection:bg-[#7b57ff]/20 selection:text-[#0F1B2E] relative">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#0F1B2E]/10 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onStartDemo}>
          <div className="w-9 h-9 rounded-xl bg-[#7b57ff] text-white font-serif font-extrabold text-sm flex items-center justify-center shadow-xs">
            FIQ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-[#0F1B2E] tracking-tight text-base font-serif">FreightIQ</span>
              <span className="px-3 py-0.5 bg-[#7b57ff]/10 text-[#7b57ff] border border-[#7b57ff]/30 text-[10px] font-bold rounded-full flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7b57ff]" />
                <span>SIH26006 • MARITIME INSTRUMENT</span>
              </span>
            </div>
            <p className="text-[10px] text-[#3E5871] font-mono">Steel Ministry Chartering & Decision Suite</p>
          </div>
        </div>

        <button
          onClick={onStartDemo}
          className="accept-button-theme font-semibold text-xs rounded-full shadow-card-soft flex items-center space-x-2 px-5 py-2"
        >
          <span>Launch Platform</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl mx-auto px-6 md:px-12 py-16 space-y-16">
        {/* HERO SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#7b57ff]/10 border border-[#7b57ff]/30 rounded-full text-[#7b57ff] text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#7b57ff]" />
            <span>SIH26006 Bulk Cargo Decision Support System</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F1B2E] leading-tight font-serif">
            Empowering maritime procurement teams to optimize <span className="text-[#7b57ff]">vessel tonnage selection</span>, timing, and contract structures with data rigor.
          </h1>

          <p className="text-base text-[#3E5871] font-normal leading-relaxed max-w-2xl mx-auto">
            Built for steel ministry procurement directors to evaluate East Coast Indian port constraints (Paradip, Visakhapatnam, Haldia, Dhamra), vessel draft limits, rate trends, and multi-voyage contract strategies.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onStartDemo}
              className="accept-button-theme font-bold text-sm rounded-full shadow-card-soft flex items-center space-x-2.5 px-7 py-3.5"
            >
              <Zap className="w-4 h-4 text-white fill-white" />
              <span>Launch Interactive Platform Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HOW IT WORKS SECTION (4 STEPS VISUAL CARDS) */}
        <div className="space-y-8 border-t border-[#0F1B2E]/10 pt-14">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold font-mono text-[#7b57ff] uppercase tracking-wider">4-Step Analytical Decision Pipeline</h2>
            <h3 className="text-2xl font-extrabold text-[#0F1B2E] font-serif">How FreightIQ Solves Bulk Chartering</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono text-xs">
            <div className="card-theme rounded-2xl p-5 shadow-card-soft space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#7b57ff] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                01
              </div>
              <div className="font-bold text-[#0F1B2E] text-sm font-serif">Input Cargo Specification</div>
              <p className="text-[#3E5871] font-sans leading-relaxed text-[11px]">
                Input cargo quantity, commodity specs, origin loading port, destination discharge port, and laycan dates.
              </p>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#7b57ff] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                02
              </div>
              <div className="font-bold text-[#0F1B2E] text-sm font-serif">Port Draft & ML Forecast</div>
              <p className="text-[#3E5871] font-sans leading-relaxed text-[11px]">
                Solver verifies draft/LOA limits while walk-forward XGBoost models project 90-day rate trajectories.
              </p>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#7b57ff] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                03
              </div>
              <div className="font-bold text-[#0F1B2E] text-sm font-serif">Executive Recommendation</div>
              <p className="text-[#3E5871] font-sans leading-relaxed text-[11px]">
                Receive optimal vessel class rankings, COA strategy advice, and Gemini AI analytical reasoning.
              </p>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft space-y-2 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-[#7b57ff] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                04
              </div>
              <div className="font-bold text-[#0F1B2E] text-sm font-serif">What-If Sensitivity Engine</div>
              <p className="text-[#3E5871] font-sans leading-relaxed text-[11px]">
                Stress-test rate surges, bunker fuel spikes, and port congestion delays before committing.
              </p>
            </div>
          </div>
        </div>

        {/* ROLE WORKFLOWS SECTION */}
        <div className="space-y-8 border-t border-[#0F1B2E]/10 pt-14">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold font-mono text-[#2D6A4F] uppercase tracking-wider">Institutional Workflows</h2>
            <h3 className="text-2xl font-extrabold text-[#0F1B2E] font-serif">Designed for Maritime Procurement Teams</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
            <div className="card-theme rounded-2xl p-5 shadow-card-soft space-y-2 border border-slate-100">
              <div className="font-bold text-[#0F1B2E] text-sm flex items-center gap-2 font-serif">
                <FileSpreadsheet className="w-4 h-4 text-[#7b57ff]" />
                <span>Chartering & Procurement Directors</span>
              </div>
              <p className="text-[#3E5871] leading-relaxed">
                Evaluate multi-million-dollar COA contracts vs. spot charters with dual-currency USD and ₹ Crore precision.
              </p>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft space-y-2 border border-slate-100">
              <div className="font-bold text-[#0F1B2E] text-sm flex items-center gap-2 font-serif">
                <TrendingUp className="w-4 h-4 text-[#7b57ff]" />
                <span>Freight Quantitative Analysts</span>
              </div>
              <p className="text-[#3E5871] leading-relaxed">
                Benchmark walk-forward ML models (XGBoost, SARIMAX, Linregress) with MAE/MAPE error matrices.
              </p>
            </div>

            <div className="card-theme rounded-2xl p-5 shadow-card-soft space-y-2 border border-slate-100">
              <div className="font-bold text-[#0F1B2E] text-sm flex items-center gap-2 font-serif">
                <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                <span>Governance & Audit Officers</span>
              </div>
              <p className="text-[#3E5871] leading-relaxed">
                Access audit logs recording every procurement specification, contract adjustment, and system event.
              </p>
            </div>
          </div>
        </div>

        {/* HERO DEMO SCENARIO PREVIEW */}
        <div className="card-theme rounded-2xl p-6 shadow-card-soft space-y-4 border border-slate-100">
          <div className="flex items-center justify-between border-b border-[#0F1B2E]/10 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#7b57ff]" />
              <span className="font-bold text-[#0F1B2E] text-sm font-serif">Primary Pre-Seeded Scenario: Coking Coal → Paradip Port</span>
            </div>
            <span className="px-3 py-1 bg-[#7b57ff]/10 text-[#7b57ff] text-[10px] font-mono rounded-full font-bold border border-[#7b57ff]/30">
              OPTIMIZED SPECIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200/80">
              <div className="text-[#3E5871] text-[10px] uppercase font-bold">Cargo Quantity</div>
              <div className="text-base font-bold text-[#0F1B2E] mt-0.5">180,000 MT</div>
            </div>
            <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200/80">
              <div className="text-[#3E5871] text-[10px] uppercase font-bold">Recommended Tonnage</div>
              <div className="text-base font-bold text-[#2D6A4F] mt-0.5 font-sans">Panamax Carrier</div>
            </div>
            <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200/80">
              <div className="text-[#3E5871] text-[10px] uppercase font-bold">Optimal Strategy</div>
              <div className="text-base font-bold text-[#7b57ff] mt-0.5 font-sans">6-Month COA Contract</div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Demo Cookie Consent Card Widget */}
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
        <CookieConsentCard />
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-[#3E5871] text-xs font-mono border-t border-[#0F1B2E]/10 bg-white">
        FreightIQ • Smart India Hackathon PS SIH26006 • East Coast Indian Ports Bulk Chartering Platform
      </footer>
    </div>
  );
};
