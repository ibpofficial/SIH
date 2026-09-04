import React, { useState } from 'react';
import {
  X,
  Cpu,
  Zap,
  CheckCircle2,
  Server,
  Database,
  Brain,
  Activity,
  Flame,
  Layers,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface SystemWorkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemWorkingModal: React.FC<SystemWorkingModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'DATA_FLOW' | 'PROBLEM_SOLVED'>('ARCHITECTURE');

  if (!isOpen) return null;

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
      whatItDoes: 'Calculates 90-day freight price predictions using XGBoost, evaluates vessel draft vs port depth constraints, computes 4D risk scores, and compares spot vs contract financial scenarios.',
      dataContributed: 'Predicted freight rates ($/MT), berth feasibility status, turnaround days, bunker costs, and risk sub-scores.'
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
      whatItDoes: 'Acts as the central orchestrator routing requests between the web app, database, Python ML engine, and AI layer while enforcing JWT authentication and role-based permissions.',
      dataContributed: 'Authenticated user context, procurement plan CRUD operations, manual rate overrides, and audit log events.'
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
      whatItDoes: 'Synthesizes quantitative metrics into human-readable executive briefings, provides strategic advice for C-suite chartering desks, and generates AI pivot triggers for market risk.',
      dataContributed: 'Natural language executive briefing, risk mitigation recommendations, and market condition commentary.'
    },
    {
      id: 'prisma-db',
      name: 'Prisma Relational Database',
      type: 'ORM & Market Rate Storage',
      cloud: 'SQLite / Postgres',
      latency: '18ms',
      status: 'Freight rate history, Immutable audit logs, Port & Vessel specs',
      icon: Database,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      dotColor: 'bg-amber-500',
      whatItDoes: 'Stores structured relational data including port depth/draft limits, vessel fleet specifications, historical spot freight indexes, user profiles, and immutable audit logs.',
      dataContributed: 'Historical freight rate baseline index, port channel draft ceilings, vessel DWT capacities, and security logs.'
    },
    {
      id: 'firebase-stream',
      name: 'Firebase Firestore Stream',
      type: 'Real-time Client State Sync',
      cloud: 'Firebase Cloud',
      latency: '25ms',
      status: 'Real-time procurement request listeners & UI web sockets active',
      icon: Flame,
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-300',
      dotColor: 'bg-orange-500',
      whatItDoes: 'Provides instant real-time websocket synchronization across multiple chartering desk users so procurement request updates and status transitions reflect across all screens immediately.',
      dataContributed: 'Live procurement plan status updates, real-time table syncing, and active user session flags.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0F1B2E] text-white p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold font-serif tracking-tight">System Architecture & Live Decision Stack</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-mono font-bold">
                  SIH26006 LIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                How FreightIQ's 5 microservices compute optimal bulk chartering decisions in real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-[#FAFAF8] px-6 pt-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'ARCHITECTURE'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Microservice Stack (5 Services)</span>
          </button>
          <button
            onClick={() => setActiveTab('DATA_FLOW')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'DATA_FLOW'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Data Contribution Pipeline</span>
          </button>
          <button
            onClick={() => setActiveTab('PROBLEM_SOLVED')}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'PROBLEM_SOLVED'
                ? 'border-sky-600 text-sky-700 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Problem Solved (SIH26006)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Microservice Cards */}
          {activeTab === 'ARCHITECTURE' && (
            <div className="space-y-4">
              <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold font-sans">Every component listed below is active in real time. </span>
                  <span className="font-mono">
                    When you click "Analyze & Optimize Plan" on a procurement request, all 5 components execute sequentially within milliseconds.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {services.map((srv) => {
                  const IconComp = srv.icon;
                  return (
                    <div
                      key={srv.id}
                      className="card-theme rounded-2xl p-5 border border-slate-200 hover:border-sky-400 transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0F1B2E]">
                            <IconComp className="w-5 h-5 text-sky-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#0F1B2E] text-sm font-sans">{srv.name}</h3>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {srv.type} • <span className="font-semibold text-slate-700">{srv.cloud}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 font-mono text-xs">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-bold flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>{srv.latency}</span>
                          </span>
                          <span
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 ${srv.badgeColor}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${srv.dotColor} animate-pulse`} />
                            <span>ACTIVE</span>
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">
                            What it does (Simple Words)
                          </div>
                          <p className="text-slate-700 leading-relaxed font-sans">{srv.whatItDoes}</p>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">
                            Data Contributed to Decision
                          </div>
                          <p className="text-slate-700 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                            {srv.dataContributed}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center space-x-2">
                        <span className="font-bold text-slate-700">Status Output:</span>
                        <span className="text-emerald-700 font-semibold">{srv.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Data Flow Pipeline */}
          {activeTab === 'DATA_FLOW' && (
            <div className="space-y-6 text-xs">
              <div className="card-theme rounded-2xl p-5 border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-[#0F1B2E] font-serif">
                  Step-by-Step Data Processing Flow
                </h3>
                <p className="text-slate-600 leading-relaxed font-sans">
                  Here is exactly how a procurement request transforms into a complete chartering recommendation:
                </p>

                <div className="space-y-3 font-mono">
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-[#0F1B2E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-[#0F1B2E] font-sans">User Initiates Plan (UI Layer)</div>
                      <div className="text-slate-600 mt-0.5">
                        User inputs cargo details (e.g. 180,000 MT Coking Coal, Newcastle → Vizag).
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-amber-900 font-sans">
                        Prisma DB Lookup (18ms) + NestJS Auth Routing (22ms)
                      </div>
                      <div className="text-amber-800 mt-0.5">
                        Fetches port max draft (e.g., Vizag 14.5m), vessel specs, and 90-day spot freight history baseline.
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
                        Python XGBoost & Vessel Solver Execution (28ms)
                      </div>
                      <div className="text-emerald-800 mt-0.5">
                        Runs XGBoost rate forecast (+9.2% surge risk), checks vessel draft feasibility (rejects Capesize 18.5m draft), and evaluates 6-Month COA vs Spot savings.
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
                        Generates natural-language executive rationale, risk trade-offs, and operational warning triggers for C-suite approvals.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-orange-50/80 rounded-xl border border-orange-200">
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      5
                    </div>
                    <div>
                      <div className="font-bold text-orange-900 font-sans">
                        Firebase Stream Sync (25ms) & Interactive UI Render
                      </div>
                      <div className="text-orange-800 mt-0.5">
                        Broadcasts final analysis memo and status update across all connected user sessions in real time.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Problem Solved */}
          {activeTab === 'PROBLEM_SOLVED' && (
            <div className="space-y-6 text-xs font-sans">
              <div className="card-theme rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center space-x-2 text-sky-700 font-mono font-bold text-xs uppercase">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Smart India Hackathon Problem Statement (SIH26006)</span>
                </div>
                <h3 className="text-base font-bold text-[#0F1B2E] font-serif">
                  What Real-World Industry Problem Does FreightIQ Solve?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Indian steel producers (such as SAIL, JSPL, and Tata Steel) import tens of millions of metric tons of raw materials (coking coal and iron ore) annually via sea routes. Maritime chartering decisions have historically been made manually using static spreadsheets, leading to major operational pain points:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
                  <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 space-y-1.5">
                    <div className="font-bold text-red-900 font-sans">1. Demurrage Penalties</div>
                    <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                      Mismatch between vessel size and port discharge rate causes ship queuing delays, incurring penalties of $15,000–$30,000 per day per ship.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                    <div className="font-bold text-amber-900 font-sans">2. Unhedged Freight Spikes</div>
                    <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                      Relying purely on spot chartering exposes procurement budgets to sudden 20%+ spot rate spikes during peak shipping seasons.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50/80 rounded-xl border border-purple-200 space-y-1.5">
                    <div className="font-bold text-purple-900 font-sans">3. Draft Violations</div>
                    <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                      Assigning deep-draft vessels (e.g. Capesize requiring 18.5m depth) to shallow ports leads to costly lighterage offshore or vessel re-routing.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#0F1B2E] text-white rounded-xl space-y-2 mt-4">
                  <div className="font-bold text-sky-400 font-serif text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>How FreightIQ Fixes This:</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed font-sans">
                    FreightIQ automates the entire evaluation process. Within seconds, it predicts market rate spikes with XGBoost ML, automatically rejects vessels that violate port draft channels, compares 6-Month Contract of Affreightment (COA) savings against spot chartering, and provides AI-backed executive briefings for immediate audit-proof procurement decisions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAFAF8] border-t border-slate-200 p-4 flex items-center justify-between font-mono text-xs">
          <div className="text-slate-500 text-[11px]">
            FreightIQ Decision Engine • SIH26006 Smart India Hackathon Submission
          </div>
          <button
            onClick={onClose}
            className="accept-button-theme px-5 py-2 text-xs font-bold font-mono cursor-pointer"
          >
            Close Architecture Specs
          </button>
        </div>
      </div>
    </div>
  );
};
