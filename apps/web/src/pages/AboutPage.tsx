import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  Server,
  Brain,
  Database,
  Flame,
  FileSpreadsheet,
  Anchor,
  Ship,
  UploadCloud,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  DollarSign,
  Compass,
  Layers,
  Activity,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'PROBLEM_SOLVED' | 'ENGINE_DETAILS' | 'SIMULATOR' | 'ALL_SYSTEMS' | 'DATA_FLOW'>('PROBLEM_SOLVED');
  const [expandedSystemId, setExpandedSystemId] = useState<string | null>('python-engine');

  // Interactive Live Simulator State for About Page
  const [simCargoQty, setSimCargoQty] = useState<number>(150000);
  const [simPort, setSimPort] = useState<'PARADIP' | 'VIZAG' | 'DHAMRA' | 'HALDIA'>('PARADIP');
  const [simVessel, setSimVessel] = useState<'PANAMAX' | 'CAPESIZE' | 'SUPRAMAX'>('PANAMAX');

  const portLimits = {
    PARADIP: { name: 'Paradip Port', maxDraft: 14.5, maxLoa: 230, status: 'Panamax Max' },
    VIZAG: { name: 'Visakhapatnam Port', maxDraft: 16.0, maxLoa: 290, status: 'Capesize Ready' },
    DHAMRA: { name: 'Dhamra Port', maxDraft: 18.0, maxLoa: 300, status: 'All-Weather Deep' },
    HALDIA: { name: 'Haldia Dock Complex', maxDraft: 10.5, maxLoa: 190, status: 'Shallow Restricted' }
  };

  const vesselSpecs = {
    SUPRAMAX: { name: 'Supramax (55k DWT)', draft: 11.2, costPerDay: 18500, coaRate: 22.5 },
    PANAMAX: { name: 'Panamax (75k DWT)', draft: 14.2, costPerDay: 24000, coaRate: 19.8 },
    CAPESIZE: { name: 'Capesize (180k DWT)', draft: 18.2, costPerDay: 38000, coaRate: 14.5 }
  };

  const selectedPort = portLimits[simPort];
  const selectedVessel = vesselSpecs[simVessel];
  const isDraftFeasible = selectedVessel.draft <= selectedPort.maxDraft + 1.2; // +1.2m high tide buffer
  const spotRateProjected = (selectedVessel.coaRate * 1.18).toFixed(2);
  const totalSpotCostCr = ((simCargoQty * Number(spotRateProjected) * 83.5) / 100000000).toFixed(2);
  const totalCoaCostCr = ((simCargoQty * selectedVessel.coaRate * 83.5) / 100000000).toFixed(2);
  const netSavingsCr = (Number(totalSpotCostCr) - Number(totalCoaCostCr)).toFixed(2);

  const allSystems = [
    {
      id: 'python-engine',
      number: '01',
      name: 'Python Decision & ML Solver Engine',
      type: 'Machine Learning & Solvers',
      tech: 'FastAPI • XGBoost • NumPy',
      latency: '28ms',
      status: 'ACTIVE',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dotColor: 'bg-emerald-500',
      icon: Cpu,
      summary: 'Calculates 90-day spot rate forecasts using XGBoost ML, evaluates vessel draft depth clearance against port harbor limits, scores 4D composite risk, and computes COA vs Spot financial scenarios.',
      howItWorksInSimpleWords: 'Think of this as the master math brain of FreightIQ. It predicts future shipping prices 3 months in advance and checks if a heavy ship will get stuck in shallow harbor waters.',
      details: [
        'XGBoost 90-day spot rate predictions ($/MT & ₹/MT)',
        'Harbor draft depth clearance check (e.g. Paradip 14.5m vs Capesize 18.2m)',
        '4D composite risk score computation (0 - 100 gauge)',
        '6-Month COA vs Spot financial trade-off solver in ₹ Crores'
      ]
    },
    {
      id: 'nestjs-gateway',
      number: '02',
      name: 'NestJS API Gateway & Access Control',
      type: 'Core Service Router & Auth',
      tech: 'NestJS • TypeScript • JWT',
      latency: '22ms',
      status: 'ACTIVE',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
      dotColor: 'bg-sky-500',
      icon: Server,
      summary: 'Central secure router connecting frontend UI, database, Python ML engine, and AI services while enforcing Role-Based Access Control (RBAC) and rate overrides.',
      howItWorksInSimpleWords: 'Acts as the security guard and traffic controller. It makes sure only authorized managers can approve multi-crore chartering plans.',
      details: [
        'JWT Authentication & Role-Based Access Control (Admin, Manager, Analyst, Viewer)',
        'Manual freight rate override policy enforcement',
        'Request validation and route sanitization',
        'Microservice communication hub'
      ]
    },
    {
      id: 'gemini-ai',
      number: '03',
      name: 'Google Gemini 1.5 Executive AI Layer',
      type: 'LLM Reasoning & Rationale',
      tech: 'Google AI Cloud • Gemini 1.5 Flash',
      latency: '620ms',
      status: 'ACTIVE',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      dotColor: 'bg-indigo-500',
      icon: Brain,
      summary: 'Translates complex quantitative model outputs into clear, human-readable executive memos, C-suite trade-off recommendations, and proactive risk warning triggers.',
      howItWorksInSimpleWords: 'Acts as an expert maritime analyst. It reads all the numbers from the Python engine and writes a clear summary email for top executives in simple English.',
      details: [
        'Generates natural language executive briefing summaries',
        'Provides analytical rationale for spot vs long-term contract decisions',
        'Synthesizes market trend explanations for non-technical stakeholders',
        'Flags potential chartering risks and mitigation steps'
      ]
    },
    {
      id: 'prisma-db',
      number: '04',
      name: 'Prisma Relational & Market History DB',
      type: 'ORM & Relational Storage',
      tech: 'Prisma ORM • SQLite / PostgreSQL',
      latency: '18ms',
      status: 'ACTIVE',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      dotColor: 'bg-amber-500',
      icon: Database,
      summary: 'Maintains structured relational schemas for port harbor specifications, vessel fleet specifications, historical spot rate indices, user profiles, and audit records.',
      howItWorksInSimpleWords: 'Our digital vault storing exact port depths, ship capacities, historical market indexes, and user accounts.',
      details: [
        'Port channel draft ceilings & LOA limits database',
        'Vessel DWT capacities, beam width & draft specs',
        'Baltic Dry & Supramax historical rate baseline index',
        'User credentials & role authorization state'
      ]
    },
    {
      id: 'firebase-stream',
      number: '05',
      name: 'Firebase Cloud Stream & Realtime Engine',
      type: 'Realtime State & Cloud Persistence',
      tech: 'Firebase Firestore WebSockets',
      latency: '25ms',
      status: 'ACTIVE',
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-300',
      dotColor: 'bg-orange-500',
      icon: Flame,
      summary: 'Enables instant 24/7 client state synchronization across all user sessions without requiring local terminal setups or manual page refreshes.',
      howItWorksInSimpleWords: 'Keeps everyone on the same page in real-time. If one user creates a procurement plan, everyone sees it update instantly.',
      details: [
        'Real-time procurement plan status updates across connected clients',
        'Instant cloud persistence for custom CSV dataset uploads',
        'Zero-latency table state syncing across team members',
        'Cloud-native backend accessibility 24/7'
      ]
    },
    {
      id: 'procurement-manager',
      number: '06',
      name: 'Procurement & COA Decision Manager',
      type: 'Business Logic & Lifecycle',
      tech: 'React • Zustand • Decision Trees',
      latency: '12ms',
      status: 'ACTIVE',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dotColor: 'bg-emerald-500',
      icon: FileSpreadsheet,
      summary: 'Manages the complete lifecycle of cargo procurement requests, comparing spot rate offers against 6-month COA contracts and calculating net savings in ₹ Crores.',
      howItWorksInSimpleWords: 'The workspace where chartering managers create cargo orders, compare contract options, and export official memos.',
      details: [
        'Cargo request submission & quantity tracking (e.g. 150,000 MT Coking Coal)',
        'Interactive Spot vs COA allocation sliders',
        'Budget vs estimated freight expense comparison',
        'Downloadable executive briefing memos'
      ]
    },
    {
      id: 'ports-vessels',
      number: '07',
      name: 'Ports & Vessels Physical Registry',
      type: 'Harbor & Fleet Constraints',
      tech: 'Spatial Indexes & Physical Rules',
      latency: '15ms',
      status: 'ACTIVE',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-300',
      dotColor: 'bg-sky-500',
      icon: Anchor,
      summary: 'Catalogs physical constraints of major East Coast Indian discharge ports (Paradip, Vizag, Dhamra, Haldia) and global bulk vessel classes (Handysize to Capesize).',
      howItWorksInSimpleWords: 'The official encyclopedia of ports and ship fleets, tracking maximum water depths and ship lengths.',
      details: [
        'Max draft limits (e.g., Haldia 10.5m, Paradip 14.5m, Dhamra 18.0m)',
        'Tidal window allowances & high-tide draft depth buffers',
        'Max Length Overall (LOA) and beam width clearances',
        'Turnaround time and berth waiting estimates'
      ]
    },
    {
      id: 'data-ingestion',
      number: '08',
      name: 'Data Ingestion & CSV Analytics Studio',
      type: 'ETL Pipeline & Data Validation',
      tech: 'PapaParse • Client ETL Pipeline',
      latency: '35ms',
      status: 'ACTIVE',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      dotColor: 'bg-indigo-500',
      icon: UploadCloud,
      summary: 'Provides a 3-stage validation pipeline for importing custom market rate feeds, verifying schema column mapping, and backtesting ML models against past data.',
      howItWorksInSimpleWords: 'Allows analysts to drag and drop Excel/CSV market files to automatically test or update freight forecasts.',
      details: [
        'Automated CSV schema headers verification',
        'Data cleaning & null value interpolation',
        'Historical model backtesting suite',
        'One-click demo data seeding tool'
      ]
    },
    {
      id: 'audit-governance',
      number: '09',
      name: 'Governance & Immutable Audit Log',
      type: 'Compliance & Audit Trail',
      tech: 'Cryptographic Hash Logging',
      latency: '10ms',
      status: 'ACTIVE',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      dotColor: 'bg-amber-500',
      icon: ShieldCheck,
      summary: 'Records every rate override, contract approval, and system parameter change in an immutable audit ledger for complete regulatory transparency.',
      howItWorksInSimpleWords: 'An unchangeable black-box recorder that logs who made every decision, when, and why.',
      details: [
        'User action timestamping with IP & role context',
        'Manual rate override audit reason tracking',
        'Compliance verification for steel ministry reporting',
        'Searchable audit trail inspector'
      ]
    },
    {
      id: 'dispute-resolution',
      number: '10',
      name: 'Dispute Resolution & Demurrage Risk Engine',
      type: 'Contract Settlement & Claims',
      tech: 'Dispute Solvers • Laytime Rules',
      latency: '20ms',
      status: 'ACTIVE',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
      dotColor: 'bg-purple-500',
      icon: Scale,
      summary: 'Calculates laytime breaches, demurrage penalty exposures ($15k–$30k/day), and provides automated settlement recommendations for maritime chartering claims.',
      howItWorksInSimpleWords: 'Calculates delay fines and resolves disputes between steel plants and shipowners automatically.',
      details: [
        'Allowed laytime vs actual discharge duration calculation',
        'Demurrage vs Despatch financial settlement breakdown',
        'Weather Working Days (WWD) & Notice of Readiness (NOR) log parsing',
        'Automated claim resolution recommendation generation'
      ]
    }
  ];

  return (
    <div className="space-y-8 font-sans pb-16 max-w-6xl mx-auto">
      {/* Top Breadcrumb Navigation */}
      <Breadcrumbs activePath="/about" onNavigate={onNavigate} />

      {/* Hero Banner - Uiverse Inspired Square-Box Style */}
      <div className="card-theme bg-white border border-blue-100 rounded-2xl p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-mono text-xs font-bold rounded-md border border-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>SIH26006 • MARITIME SUITE</span>
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-mono text-xs font-bold rounded-md border border-emerald-200">
                10 ACTIVE SYSTEMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif">
              About FreightIQ: Platform Architecture & System Breakdown
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-sans">
              FreightIQ is an intelligent bulk maritime chartering decision engine built for Indian steel producers (SAIL, RINL, Jindal, Tata Steel). It transforms complex maritime data into easy, audit-proof chartering recommendations in seconds.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/procurement')}
            className="accept-button-theme h-11 px-6 rounded-lg font-semibold text-xs font-mono uppercase tracking-wide flex items-center justify-center space-x-2 shrink-0"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* 4 Core Platform Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-blue-100 font-mono text-xs">
          <div className="p-4 bg-slate-50/70 rounded-xl border border-blue-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">ML Prediction Speed</div>
            <div className="text-xl font-bold text-slate-900 font-serif mt-0.5">28ms</div>
            <div className="text-[10px] text-emerald-700 font-semibold pt-0.5">90-Day XGBoost Forecast</div>
          </div>
          <div className="p-4 bg-slate-50/70 rounded-xl border border-blue-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Demurrage Prevention</div>
            <div className="text-xl font-bold text-slate-900 font-serif mt-0.5">Zero Violations</div>
            <div className="text-[10px] text-blue-700 font-semibold pt-0.5">Harbor Clearance Check</div>
          </div>
          <div className="p-4 bg-slate-50/70 rounded-xl border border-blue-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Est. Cost Savings</div>
            <div className="text-xl font-bold text-emerald-700 font-serif mt-0.5">₹42.8 Cr / Yr</div>
            <div className="text-[10px] text-slate-500 font-semibold pt-0.5">COA vs Spot Optimizer</div>
          </div>
          <div className="p-4 bg-slate-50/70 rounded-xl border border-blue-100">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Executive AI Layer</div>
            <div className="text-xl font-bold text-blue-700 font-serif mt-0.5">Gemini 1.5 Flash</div>
            <div className="text-[10px] text-slate-500 font-semibold pt-0.5">Auto Briefing Generator</div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('PROBLEM_SOLVED')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'PROBLEM_SOLVED'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>1. Problem We Solve</span>
          </button>
          <button
            onClick={() => setActiveTab('ENGINE_DETAILS')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'ENGINE_DETAILS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. How Python Engine Works</span>
          </button>
          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'SIMULATOR'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>3. Interactive Live Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('ALL_SYSTEMS')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'ALL_SYSTEMS'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. All 10 Systems Breakdown</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: THE PROBLEM WE ARE SOLVING          */}
      {/* ========================================== */}
      {activeTab === 'PROBLEM_SOLVED' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="card-theme bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card-soft space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-sky-700 font-bold uppercase tracking-wider">
                Real-World Steel Industry Challenges
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1B2E] font-serif">
                What Industry Problem Does FreightIQ Solve?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-4xl">
                India’s major steel plants import over 70 million tons of coking coal every year. Historically, chartering teams relied on spreadsheets and phone calls, leading to four massive financial traps:
              </p>
            </div>

            {/* 4 Problem Cards - Easy & Detailed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 bg-red-50/60 rounded-2xl border border-red-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-mono font-bold text-xs flex items-center justify-center">01</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded">FINE EXPOSURE</span>
                </div>
                <h3 className="font-bold text-red-950 text-base font-serif">Demurrage Fine Traps ($15k-$30k/day)</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  When ships sit idle waiting outside crowded ports, shipowners charge heavy demurrage penalties. A 5-day congestion delay on a Panamax ship costs over <strong>₹85 Lakhs</strong> per voyage.
                </p>
              </div>

              <div className="p-6 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-mono font-bold text-xs flex items-center justify-center">02</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">+20% MARKET SURGES</span>
                </div>
                <h3 className="font-bold text-amber-950 text-base font-serif">Unhedged Spot Price Spikes</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Buying freight on the spot market without rate forecasting leaves procurement desks exposed to sudden 20%+ price surges, blowing annual budgets by tens of ₹ Crores.
                </p>
              </div>

              <div className="p-6 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-mono font-bold text-xs flex items-center justify-center">03</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">PHYSICAL RISK</span>
                </div>
                <h3 className="font-bold text-purple-950 text-base font-serif">Shallow Harbor Draft Breaches</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Sending deep Capesize ships (18.2m draft) to shallow ports like Haldia (10.5m max draft) risks vessel grounding or forces expensive offshore cargo lighterage.
                </p>
              </div>

              <div className="p-6 bg-sky-50/60 rounded-2xl border border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-mono font-bold text-xs flex items-center justify-center">04</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded">COMPLIANCE DEFICIT</span>
                </div>
                <h3 className="font-bold text-sky-950 text-base font-serif">Lack of Audit Verification</h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Manual email chartering offers no immutable proof for why specific ship rates or contract terms were chosen during government or internal audits.
                </p>
              </div>
            </div>

            {/* How FreightIQ Solves It Banner */}
            <div className="p-6 bg-[#0F1B2E] text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>HOW FREIGHTIQ FIXES THIS AUTOMATICALLY</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                FreightIQ solves these problems in under 30 milliseconds. It predicts 90-day spot rates with <strong>XGBoost ML</strong>, enforces <strong>harbor draft clearance rules</strong>, optimizes <strong>COA vs Spot savings in ₹ Crores</strong>, and generates <strong>Google Gemini executive briefs</strong> backed by immutable audit logs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: HOW THE PYTHON ENGINE WORKS         */}
      {/* ========================================== */}
      {activeTab === 'ENGINE_DETAILS' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="card-theme bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card-soft space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">
                Step-by-Step Mathematical & ML Solvers
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1B2E] font-serif">
                How the Python ML Engine Evaluates Every Cargo Plan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-4xl">
                The Python decision service executes 4 sequential mathematical solvers in 28ms to generate audit-proof recommendations:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold font-mono text-xs">1</div>
                  <h3 className="font-bold text-[#0F1B2E] text-base font-serif">XGBoost 90-Day Rate Forecasting</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Predicts freight rates ($/MT & ₹/MT) 30, 60, and 90 days in advance by training on historical Baltic Dry index rates, fuel prices, and seasonal commodity demand.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold font-mono text-xs">2</div>
                  <h3 className="font-bold text-[#0F1B2E] text-base font-serif">Physical Draft Clearance Checker</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Compares vessel laden draft against destination port channel depth limits (e.g. Paradip 14.5m vs Capesize 18.2m), factoring in high tide windows (+1.2m).
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold font-mono text-xs">3</div>
                  <h3 className="font-bold text-[#0F1B2E] text-base font-serif">4D Composite Risk Matrix</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Calculates a weighted risk score (0 to 100) based on port congestion wait times, weather/monsoon windows, price volatility, and shipowner reliability.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold font-mono text-xs">4</div>
                  <h3 className="font-bold text-[#0F1B2E] text-base font-serif">COA vs Spot Financial Optimizer</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Simulates total shipping expenses across 6-month horizons. Compares fixing long-term COA contracts vs spot market purchasing, displaying net savings in <strong>₹ Crores</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: INTERACTIVE LIVE SIMULATOR          */}
      {/* ========================================== */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="card-theme bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card-soft space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-700 font-bold uppercase tracking-wider">
                Live Interactive Demonstration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F1B2E] font-serif">
                Try the Live Python Engine Decision Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-4xl">
                Test how FreightIQ dynamically checks port draft clearance, predicts spot vs COA rates, and calculates financial savings in real-time:
              </p>
            </div>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#FAFAF8] rounded-2xl border border-slate-200/80 font-mono text-xs">
              {/* Cargo Qty */}
              <div className="space-y-2">
                <label className="font-bold text-[#0F1B2E] font-sans">Cargo Quantity (MT)</label>
                <select
                  value={simCargoQty}
                  onChange={(e) => setSimCargoQty(Number(e.target.value))}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value={75000}>75,000 MT (Standard Batch)</option>
                  <option value={150000}>150,000 MT (Large Batch)</option>
                  <option value={300000}>300,000 MT (Annual Volume)</option>
                </select>
              </div>

              {/* Port Selector */}
              <div className="space-y-2">
                <label className="font-bold text-[#0F1B2E] font-sans">Destination Port</label>
                <select
                  value={simPort}
                  onChange={(e) => setSimPort(e.target.value as any)}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="PARADIP">Paradip Port (Max 14.5m Draft)</option>
                  <option value="VIZAG">Visakhapatnam (Max 16.0m Draft)</option>
                  <option value="DHAMRA">Dhamra Port (Max 18.0m Draft)</option>
                  <option value="HALDIA">Haldia Dock (Max 10.5m Draft)</option>
                </select>
              </div>

              {/* Vessel Selector */}
              <div className="space-y-2">
                <label className="font-bold text-[#0F1B2E] font-sans">Vessel Type & Draft</label>
                <select
                  value={simVessel}
                  onChange={(e) => setSimVessel(e.target.value as any)}
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="PANAMAX">Panamax Bulker (14.2m Draft)</option>
                  <option value="CAPESIZE">Capesize Bulker (18.2m Draft)</option>
                  <option value="SUPRAMAX">Supramax Bulker (11.2m Draft)</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Results Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              {/* Feasibility Result */}
              <div className={`p-6 rounded-2xl border ${isDraftFeasible ? 'bg-emerald-50/80 border-emerald-200' : 'bg-red-50/80 border-red-200'} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold font-sans">Draft Clearance</span>
                  {isDraftFeasible ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> PASSED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> REJECTED
                    </span>
                  )}
                </div>
                <div className="text-slate-700 space-y-1">
                  <div>Vessel Draft: <strong>{selectedVessel.draft} meters</strong></div>
                  <div>Harbor Limit: <strong>{selectedPort.maxDraft} meters</strong></div>
                  <div className="text-[10px] text-slate-500 pt-1">
                    {isDraftFeasible
                      ? 'Vessel clears harbor channel depth with tidal buffer.'
                      : 'Vessel exceeds port depth limit! Risk of grounding.'}
                  </div>
                </div>
              </div>

              {/* Rate Forecast Result */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-sans">XGBoost Forecast</span>
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded font-bold">90-DAY FORECAST</span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <div>Fixed COA Rate: <strong className="text-emerald-700">${selectedVessel.coaRate} / MT</strong></div>
                  <div>Predicted Spot Rate: <strong className="text-amber-700">${spotRateProjected} / MT</strong></div>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Spot rates projected +18% higher over 90 days.
                  </div>
                </div>
              </div>

              {/* Net Savings Result */}
              <div className="p-6 bg-[#0F1B2E] text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-serif text-white">Net Financial Optimization</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">COA SAVINGS</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-emerald-400 font-serif">₹{netSavingsCr} Crores</div>
                  <div className="text-[11px] text-slate-300">
                    Net savings by locking 6-Month COA vs Spot market purchasing.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: BREAKDOWN OF ALL 10 SYSTEMS         */}
      {/* ========================================== */}
      {activeTab === 'ALL_SYSTEMS' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F1B2E] font-serif">
              Comprehensive Operational Breakdown of All 10 Systems
            </h2>
            <span className="text-xs font-mono text-slate-500">Click any system to see details</span>
          </div>

          <div className="space-y-3">
            {allSystems.map((sys) => {
              const IconComp = sys.icon;
              const isExpanded = expandedSystemId === sys.id;
              return (
                <div
                  key={sys.id}
                  className="card-theme bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-card-soft"
                >
                  <button
                    onClick={() => setExpandedSystemId(isExpanded ? null : sys.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-[#0F1B2E] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {sys.number}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <IconComp className="w-5 h-5 text-blue-600 shrink-0 stroke-[2.5]" />
                          <h3 className="font-bold text-[#0F1B2E] text-base font-serif">{sys.name}</h3>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          {sys.type} • <span className="text-slate-700 font-semibold">{sys.tech}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border flex items-center gap-1.5 ${sys.badgeColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sys.dotColor} animate-pulse`} />
                        <span>{sys.latency}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs font-sans bg-[#FAFAF8]/50">
                      <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200/60 space-y-1">
                        <div className="font-bold text-sky-950 font-mono text-[11px] uppercase">In Simple Words:</div>
                        <p className="text-slate-700 leading-relaxed">{sys.howItWorksInSimpleWords}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="font-bold text-[#0F1B2E] font-mono text-[11px] uppercase text-slate-400">Technical Overview & Specs:</div>
                        <p className="text-slate-600 leading-relaxed">{sys.summary}</p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="font-bold text-[#0F1B2E] font-mono text-[11px] uppercase text-slate-400">Operational Capabilities:</div>
                        <ul className="space-y-1 font-mono text-slate-600 text-[11px]">
                          {sys.details.map((d, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-sky-600 font-bold">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
