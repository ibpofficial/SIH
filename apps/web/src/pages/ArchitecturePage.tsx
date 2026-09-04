import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Server,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  Brain,
  Database,
  Flame,
  Zap,
  Activity,
  HelpCircle,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

export const ArchitecturePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ENGINES' | 'DATA_FLOW' | 'PROBLEM_SOLVED'>('ENGINES');

  const services = [
    {
      id: 'python-engine',
      name: 'Python Decision Engine',
      type: 'ML Solvers & Backtesting',
      cloud: 'Cloud Decision Engine',
      latency: '28ms',
      status: 'XGBoost ML, Draft Solver & Composite Risk Solvers active',
      icon: Cpu,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dotColor: 'bg-emerald-500',
      whatItDoes:
        'Calculates 90-day freight price predictions using XGBoost machine learning models, evaluates vessel draft depth vs port harbor limits, computes 4D composite risk scores, and compares spot vs long-term contract financial scenarios.',
      dataContributed:
        'Predicted freight rates ($/MT & ₹/MT), berth feasibility status (PANAMAX vs CAPESIZE), turnaround days, bunker fuel costs, and 4D risk sub-scores.'
    },
    {
      id: 'nestjs-gateway',
      name: 'NestJS API Gateway',
      type: 'Core Service Router & Auth',
      cloud: 'Cloud API Gateway',
      latency: '22ms',
      status: 'Procurement service, Rate overrides & RBAC active',
      icon: Server,
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
      dotColor: 'bg-sky-500',
      whatItDoes:
        'Acts as the central router connecting the web interface, database, Python ML engine, and AI layer while enforcing JWT authentication, role-based access control, and manual rate override policies.',
      dataContributed:
        'Authenticated user context, procurement plan CRUD operations, manual rate overrides, and audit log security events.'
    },
    {
      id: 'gemini-ai',
      name: 'Google Gemini 1.5 Flash',
      type: 'Executive Reasoning Layer',
      cloud: 'Google AI Cloud',
      latency: '620ms',
      status: 'Live LLM Reasoning Synthesis & Grounded Analytical Rationale',
      icon: Brain,
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      dotColor: 'bg-indigo-500',
      whatItDoes:
        'Synthesizes quantitative metrics into human-readable C-suite executive briefings, provides strategic chartering trade-off advice, and generates AI warning triggers for market risk.',
      dataContributed:
        'Natural language executive briefing, strategic risk mitigation advice, and market trend rationale.'
    },
    {
      id: 'prisma-db',
      name: 'Prisma Relational Database',
      type: 'ORM & Market Rate Storage',
      cloud: 'SQLite / Postgres Store',
      latency: '18ms',
      status: 'Freight rate history, Immutable audit logs, Port & Vessel specs',
      icon: Database,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      dotColor: 'bg-amber-500',
      whatItDoes:
        'Stores structured relational data including port harbor draft channel limits, vessel fleet specs, historical spot freight indexes, user profiles, and immutable audit logs.',
      dataContributed:
        'Historical freight rate baseline index, port channel draft ceilings, vessel DWT capacities, and security audit logs.'
    },
    {
      id: 'firebase-stream',
      name: 'Firebase Firestore Stream',
      type: 'Real-time Client State Sync',
      cloud: 'Firebase Cloud (Always Online)',
      latency: '25ms',
      status: 'Real-time procurement request listeners & UI web sockets active',
      icon: Flame,
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-300',
      dotColor: 'bg-orange-500',
      whatItDoes:
        'Provides instant 24/7 cloud state synchronization across all connected user screens. Firebase automatically persists user data and syncs procurement plans instantly without needing any local server or user terminal setup.',
      dataContributed:
        'Live procurement plan status updates, real-time table syncing, instant CSV data ingestion, and cloud state persistence.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <Breadcrumbs activePath="/architecture" onNavigate={() => {}} />

      {/* Header */}
      <div className="card-theme bg-white border border-slate-200 rounded-2xl p-6 shadow-card-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] font-serif flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-600" />
              <span>How FreightIQ Works: 5 System Engines Stack</span>
            </h1>
            <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono rounded-full font-bold border border-emerald-200">
              SIH26006 LIVE ARCHITECTURE
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Detailed breakdown of Python ML, NestJS Gateway, Gemini AI, Prisma DB & Firebase Cloud Stream
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('ENGINES')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'ENGINES'
                ? 'bg-[#0F1B2E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            5 Stack Engines
          </button>
          <button
            onClick={() => setActiveTab('DATA_FLOW')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'DATA_FLOW'
                ? 'bg-[#0F1B2E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Data Pipeline
          </button>
          <button
            onClick={() => setActiveTab('PROBLEM_SOLVED')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'PROBLEM_SOLVED'
                ? 'bg-[#0F1B2E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Problem Solved
          </button>
        </div>
      </div>

      {/* TAB 1: 5 Engines Grid */}
      {activeTab === 'ENGINES' && (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold font-sans">Every component listed below runs automatically in the cloud. </span>
              <span className="font-mono">
                No local server setup or terminal commands are required. Firebase Cloud keeps data live and synced 24/7.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {services.map((srv) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="card-theme bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-400 transition-all shadow-card-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0F1B2E]">
                        <IconComp className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F1B2E] text-base font-serif">{srv.name}</h3>
                        <div className="text-xs text-slate-500 font-mono">
                          {srv.type} • <span className="font-semibold text-slate-700">{srv.cloud}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{srv.latency}</span>
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${srv.badgeColor}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${srv.dotColor} animate-pulse`} />
                        <span>ACTIVE</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                        What it does (In Simple Words)
                      </div>
                      <p className="text-slate-700 leading-relaxed">{srv.whatItDoes}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">
                        Data Contributed to Decision
                      </div>
                      <p className="text-slate-700 leading-relaxed font-mono bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        {srv.dataContributed}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-500 flex items-center space-x-2">
                    <span className="font-bold text-slate-700">Status Output:</span>
                    <span className="text-emerald-700 font-semibold">{srv.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Data Pipeline */}
      {activeTab === 'DATA_FLOW' && (
        <div className="card-theme bg-white border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-4 text-xs">
          <h3 className="text-base font-bold text-[#0F1B2E] font-serif">
            Step-by-Step Autonomous Data Flow
          </h3>
          <p className="text-slate-600 leading-relaxed font-sans">
            Here is how a bulk cargo procurement request processes automatically through the 5 engines:
          </p>

          <div className="space-y-3 font-mono">
            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#0F1B2E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                1
              </div>
              <div>
                <div className="font-bold text-[#0F1B2E] font-sans">User Initiates Plan or Uploads Data</div>
                <div className="text-slate-600 mt-0.5">
                  User enters cargo request or uploads custom market CSVs in Data Ingestion Studio.
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
            </div>

            <div className="flex items-start space-x-3 p-3 bg-orange-50/80 rounded-xl border border-orange-200">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                2
              </div>
              <div>
                <div className="font-bold text-orange-900 font-sans">
                  Firebase Cloud Sync (25ms) + Prisma DB Lookup (18ms)
                </div>
                <div className="text-orange-800 mt-0.5">
                  Firebase Cloud immediately stores the request and fetches port channel draft limits (e.g. Vizag 14.5m) and historical rate baselines.
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
            </div>

            <div className="flex items-start space-x-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <div>
                <div className="font-bold text-emerald-900 font-sans">
                  Python XGBoost ML & Vessel Solver Execution (28ms)
                </div>
                <div className="text-emerald-800 mt-0.5">
                  Runs 90-day XGBoost rate predictions, checks vessel draft clearance, and computes 6-Month COA vs Spot savings in ₹ Crores.
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
            </div>

            <div className="flex items-start space-x-3 p-3 bg-indigo-50/80 rounded-xl border border-indigo-200">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                4
              </div>
              <div>
                <div className="font-bold text-indigo-900 font-sans">
                  Google Gemini 1.5 Flash Reasoning Synthesis (620ms)
                </div>
                <div className="text-indigo-800 mt-0.5">
                  Generates natural-language executive briefings, strategic risk mitigation advice, and C-suite chartering rationale.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Problem Solved */}
      {activeTab === 'PROBLEM_SOLVED' && (
        <div className="card-theme bg-white border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-4 text-xs font-sans">
          <div className="flex items-center space-x-2 text-sky-700 font-mono font-bold text-xs uppercase">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Smart India Hackathon Problem Statement (SIH26006)</span>
          </div>
          <h3 className="text-base font-bold text-[#0F1B2E] font-serif">
            What Real-World Industry Problem Does FreightIQ Solve?
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Steel producers (such as SAIL, JSPL, and Tata Steel) import millions of metric tons of coking coal and iron ore annually. Manual chartering decisions lead to massive losses:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
            <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 space-y-1.5">
              <div className="font-bold text-red-900 font-sans">1. Demurrage Penalties</div>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                Vessel discharge delays incur heavy penalties ($15,000–$30,000/day per ship).
              </p>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
              <div className="font-bold text-amber-900 font-sans">2. Unhedged Freight Spikes</div>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                Relying purely on spot chartering exposes budgets to sudden 20%+ spot rate surges.
              </p>
            </div>

            <div className="p-4 bg-purple-50/80 rounded-xl border border-purple-200 space-y-1.5">
              <div className="font-bold text-purple-900 font-sans">3. Draft Channel Violations</div>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                Assigning deep-draft ships to shallow ports forces expensive offshore lighterage or re-routing.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#0F1B2E] text-white rounded-xl space-y-2 mt-4">
            <div className="font-bold text-sky-400 font-serif text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>How FreightIQ Solves This:</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              FreightIQ automates the entire process in seconds. It predicts rate surges with XGBoost ML, rejects vessels violating port draft limits, compares 6-Month COA savings in <strong>₹ Crores</strong>, and generates AI-backed executive briefings for immediate audit-proof procurement decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
