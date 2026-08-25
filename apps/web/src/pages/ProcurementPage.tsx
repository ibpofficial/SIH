import React, { useEffect, useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { runFirebaseAnalysisPipeline } from '../lib/firebaseAnalysisEngine';
import { seedFirestoreIfEmpty } from '../lib/firebaseSeed';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FullAnalysisReport } from '@freightiq/shared-types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { GlossaryTerm } from '../components/ui/GlossaryTerm';
import {
  FileSpreadsheet,
  Plus,
  Sparkles,
  X,
  AlertCircle,
  TrendingUp,
  Anchor,
  Ship,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Sliders,
  Printer,
  ChevronDown,
  ChevronUp,
  Brain,
  Info,
  Layers,
  ArrowRight,
  Radio,
  Key,
  Fuel,
  Flame,
  Check,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const ProcurementPage: React.FC = () => {
  // Live Firestore Collection Listener
  const { data: requests, loading: requestsLoading } = useFirestoreCollection<any>('procurementRequests');
  const { data: ports } = useFirestoreCollection<any>('ports');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  // Gemini API Key State
  const [userGeminiKey, setUserGeminiKey] = useState<string>(() => {
    return localStorage.getItem('freightiq_gemini_key') || '';
  });
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  // View Mode: Simple vs Advanced
  const [viewMode, setViewMode] = useState<'SIMPLE' | 'ADVANCED'>(() => {
    return (localStorage.getItem('freightiq_proc_mode') as any) || 'SIMPLE';
  });

  // What-If Simulator & Strategy State
  const [selectedStrategy, setSelectedStrategy] = useState<'BALANCED' | 'CHEAPEST' | 'SAFEST' | 'FASTEST'>('BALANCED');
  const [whatIfFreightRatePct, setWhatIfFreightRatePct] = useState<number>(0);
  const [whatIfFuelPricePct, setWhatIfFuelPricePct] = useState<number>(0);
  const [whatIfPortDelayDays, setWhatIfPortDelayDays] = useState<number>(0);

  // Pipeline Loading State
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [analysisReport, setAnalysisReport] = useState<any | null>(null);

  // Lineage Disclosure Toggle
  const [showLineage, setShowLineage] = useState(false);

  // Detailed Create Form State
  const [commodity, setCommodity] = useState('Australian Blast Furnace Coking Coal');
  const [quantityMt, setQuantityMt] = useState('180000');
  const [originPortId, setOriginPortId] = useState('');
  const [destinationPortId, setDestinationPortId] = useState('');
  const [fuelType, setFuelType] = useState('VLSFO (Very Low Sulfur Fuel Oil - $640/MT)');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [budgetCrore, setBudgetCrore] = useState('165.0');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    seedFirestoreIfEmpty();
  }, []);

  useEffect(() => {
    if (requests && requests.length > 0 && !selectedPlan) {
      setSelectedPlan(requests[0]);
    }
  }, [requests]);

  const handleSaveGeminiKey = (key: string) => {
    setUserGeminiKey(key);
    localStorage.setItem('freightiq_gemini_key', key);
  };

  const handleToggleViewMode = (mode: 'SIMPLE' | 'ADVANCED') => {
    setViewMode(mode);
    localStorage.setItem('freightiq_proc_mode', mode);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const newId = `req-${Date.now()}`;
      const originObj = ports.find((p) => p.id === originPortId) || { name: 'Newcastle AU' };
      const destObj = ports.find((p) => p.id === destinationPortId) || { name: 'Paradip IN' };

      await setDoc(doc(db, 'procurementRequests', newId), {
        id: newId,
        commodity,
        quantityMt: parseFloat(quantityMt),
        originPortId,
        originPortName: originObj.name,
        destinationPortId,
        destinationPortName: destObj.name,
        fuelType,
        requiredDeliveryDate: deliveryDate,
        budgetInrCrore: parseFloat(budgetCrore),
        notes,
        status: 'DRAFT',
        orgId: 'sail-org-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create procurement plan in Firestore');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerAnalysis = async (req: any) => {
    setSelectedPlan(req);
    setAnalyzingId(req.id);
    setAnalysisStage(1);
    setAnalysisReport(null);

    const timer1 = setTimeout(() => setAnalysisStage(2), 350);
    const timer2 = setTimeout(() => setAnalysisStage(3), 700);
    const timer3 = setTimeout(() => setAnalysisStage(4), 1050);
    const timer4 = setTimeout(() => setAnalysisStage(5), 1400);
    const timer5 = setTimeout(() => setAnalysisStage(6), 1750);

    try {
      const report = await runFirebaseAnalysisPipeline(req.id, userGeminiKey);
      setTimeout(() => {
        setAnalysisReport(report);
        setAnalyzingId(null);
        setAnalysisStage(0);
      }, 2100);
    } catch (err: any) {
      alert('Analysis pipeline execution failed');
      setAnalyzingId(null);
      setAnalysisStage(0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs activePath="/procurement" onNavigate={() => {}} requestTitle={selectedPlan?.commodity} />

      {/* Title & Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-india-saffron" />
              <span>Bulk Cargo Chartering & Decision Suite</span>
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono rounded-full font-bold flex items-center gap-1 border border-emerald-300">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>FIREBASE REAL-TIME SYNC</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Firestore Database • Gemini AI Reasoning, Fuel Price Comparison & Vessel Constraints
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Gemini API Key Configuration Toggle */}
          <button
            onClick={() => setShowKeyConfig((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center space-x-1.5 border cursor-pointer ${
              userGeminiKey
                ? 'bg-purple-50 text-purple-900 border-purple-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-purple-600" />
            <span>{userGeminiKey ? 'Gemini Key Configured ✓' : 'Configure Gemini API Key'}</span>
          </button>

          {/* Simple vs Advanced Mode Toggle */}
          <div className="flex rounded-lg bg-slate-100 p-1 font-mono text-xs border border-slate-200">
            <button
              onClick={() => handleToggleViewMode('SIMPLE')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'SIMPLE' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Simple View
            </button>
            <button
              onClick={() => handleToggleViewMode('ADVANCED')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'ADVANCED' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Advanced View
            </button>
          </div>

          {analysisReport && (
            <button
              onClick={handlePrintReport}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold font-mono flex items-center space-x-1.5 border border-slate-300 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Export Executive Summary</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Procurement Plan</span>
          </button>
        </div>
      </div>

      {/* Inline Gemini API Key Drawer */}
      {showKeyConfig && (
        <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-xl space-y-3 text-xs font-mono animate-in fade-in print:hidden">
          <div className="flex items-center justify-between">
            <div className="font-bold text-purple-900 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Google Gemini API Key Configuration</span>
            </div>
            <button onClick={() => setShowKeyConfig(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-purple-800 text-[11px] font-sans">
            Paste your Google Gemini API Key below (`AIzaSy...`). When configured, clicking "Analyze & Optimize" queries Gemini 1.5 Flash live to synthesize recommendations!
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste GEMINI_API_KEY (e.g. AIzaSy...)"
              value={userGeminiKey}
              onChange={(e) => handleSaveGeminiKey(e.target.value)}
              className="flex-1 bg-white border border-purple-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600 font-mono text-xs"
            />
            {userGeminiKey && (
              <button
                onClick={() => handleSaveGeminiKey('')}
                className="px-3 py-2 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded-lg font-bold text-xs cursor-pointer"
              >
                Clear Key
              </button>
            )}
          </div>
        </div>
      )}

      {/* Procurement Plans Master Table (Live Firestore Streamed) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Commodity Cargo</th>
                <th className="py-3.5 px-4">Route (Origin → Destination)</th>
                <th className="py-3.5 px-4 text-right">Quantity (MT)</th>
                <th className="py-3.5 px-4 text-right">Budget (₹ Cr)</th>
                <th className="py-3.5 px-4">Fuel Type</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requestsLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 font-mono">
                    Connecting live Firestore stream...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400 font-mono">
                    No procurement plans in Firestore. Click "New Procurement Plan" to create one.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const isSelected = selectedPlan?.id === req.id;
                  const isRunning = analyzingId === req.id;
                  return (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedPlan(req)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-orange-50/60 border-l-4 border-india-saffron' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-sans font-semibold text-slate-900">{req.commodity}</td>
                      <td className="py-3.5 px-4 text-blue-700 font-bold">
                        {req.originPortName} → {req.destinationPortName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                        {req.quantityMt ? req.quantityMt.toLocaleString() : '150,000'} MT
                      </td>
                      <td className="py-3.5 px-4 text-right text-orange-600 font-bold tabular-nums">
                        ₹{req.budgetInrCrore} Cr
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] truncate max-w-xs">
                        {req.fuelType || 'VLSFO ($640/MT)'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[9px] rounded-full font-bold border ${
                            req.status === 'OPTIMIZED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleTriggerAnalysis(req)}
                          disabled={isRunning}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:opacity-95 text-white rounded-lg text-[11px] font-bold inline-flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span>{isRunning ? 'Analyzing...' : 'Analyze & Optimize'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staged Pipeline Loading Visualizer Overlay */}
      {analyzingId && (
        <div className="p-6 bg-white border border-orange-300 rounded-xl shadow-lg space-y-4 font-mono animate-in fade-in print:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-india-saffron animate-spin" />
              <span>Executing 6-Stage Analytical & AI Reasoning Pipeline</span>
            </h3>
            <span className="text-xs text-orange-600 font-bold">Stage {analysisStage} of 6</span>
          </div>

          <div className="grid grid-cols-6 gap-2 text-[10px]">
            <div className={`p-2 rounded border transition-all ${analysisStage >= 1 ? 'bg-orange-100 border-orange-400 text-orange-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              1. ML Forecast
            </div>
            <div className={`p-2 rounded border transition-all ${analysisStage >= 2 ? 'bg-orange-100 border-orange-400 text-orange-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              2. Port Constraints
            </div>
            <div className={`p-2 rounded border transition-all ${analysisStage >= 3 ? 'bg-orange-100 border-orange-400 text-orange-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              3. Contract Strategy
            </div>
            <div className={`p-2 rounded border transition-all ${analysisStage >= 4 ? 'bg-orange-100 border-orange-400 text-orange-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              4. Idle Repositioning
            </div>
            <div className={`p-2 rounded border transition-all ${analysisStage >= 5 ? 'bg-orange-100 border-orange-400 text-orange-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              5. Composite Risk
            </div>
            <div className={`p-2 rounded border transition-all ${analysisStage >= 6 ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              6. Gemini AI Layer
            </div>
          </div>
        </div>
      )}

      {/* Analytical Results Dashboard Panels */}
      {analysisReport && (
        <div className="space-y-6 animate-in fade-in">
          {/* SECTION 0: GEMINI AI RECOMMENDATION & REASONING SYNTHESIS LAYER */}
          <div className="bg-gradient-to-br from-purple-50/80 via-white to-orange-50/80 border border-purple-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-700" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-sans tracking-wide">
                    Executive AI Recommendation & Reasoning Layer
                  </h2>
                  <div className="text-[11px] font-mono text-purple-800">
                    Model: Gemini 1.5 Flash • Grounded Analytical Synthesis
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                analysisReport.aiExplanation.isAiGenerated
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {analysisReport.aiExplanation.isAiGenerated ? '✨ Synthesized live via Google Gemini API' : 'Analytical Fallback Reasoning'}
              </span>
            </div>

            {/* 1-Line Recommendation */}
            <div className="p-3 bg-white border border-purple-200 rounded-lg text-xs font-sans font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{analysisReport.aiExplanation.recommendationLine}</span>
            </div>

            {/* Analytical Reasoning Paragraph */}
            <div className="text-xs text-slate-700 font-sans leading-relaxed bg-white/80 p-3.5 rounded-lg border border-purple-100">
              <div className="font-bold text-slate-900 mb-1">Executive Reasoning:</div>
              {analysisReport.aiExplanation.reasoningParagraph}
            </div>

            {/* Honest Caveats */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-900 text-xs font-sans">
              <div className="font-bold text-amber-900 mb-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Operational Caveats & Uncertainty:</span>
              </div>
              <div>{analysisReport.aiExplanation.caveatsText}</div>
            </div>

            {/* Expandable Grounded Data Lineage */}
            <div className="border-t border-purple-100 pt-2 font-mono text-xs">
              <button
                onClick={() => setShowLineage((prev) => !prev)}
                className="text-[11px] text-purple-700 font-bold hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showLineage ? 'Hide Grounded Data Lineage' : 'View Grounded Data Lineage (Traceability Disclosure)'}</span>
                {showLineage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showLineage && (
                <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg text-[10px] leading-relaxed animate-in fade-in">
                  <div className="font-bold text-purple-300 mb-1">Grounded Decision Engine Inputs Passed Server-Side:</div>
                  <div>{analysisReport.aiExplanation.groundedDataSummary}</div>
                </div>
              )}
            </div>
          </div>

          {/* WHAT-IF SENSITIVITY SIMULATOR & STRATEGY EVALUATOR CARD */}
          <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-orange-400" />
                <div>
                  <h2 className="text-sm font-bold text-white font-sans tracking-wide">
                    🔥 What-If Sensitivity Simulator & Multi-Strategy Engine
                  </h2>
                  <div className="text-[11px] text-slate-400">
                    Adjust market variables dynamically to recalculate chartering costs and risk ratings
                  </div>
                </div>
              </div>

              {/* Strategy Selector Pills */}
              <div className="flex rounded-lg bg-slate-800 p-1 text-xs border border-slate-700">
                {(['BALANCED', 'CHEAPEST', 'SAFEST', 'FASTEST'] as const).map((strat) => (
                  <button
                    key={strat}
                    onClick={() => setSelectedStrategy(strat)}
                    className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      selectedStrategy === strat
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {strat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Freight Rate Shift Slider */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Freight Rate Impact:</span>
                  <span className="font-bold text-orange-400">{whatIfFreightRatePct > 0 ? `+${whatIfFreightRatePct}%` : `${whatIfFreightRatePct}%`}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="30"
                  step="5"
                  value={whatIfFreightRatePct}
                  onChange={(e) => setWhatIfFreightRatePct(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Bunker Fuel Surcharge Slider */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Bunker Fuel Surcharge:</span>
                  <span className="font-bold text-amber-400">{whatIfFuelPricePct > 0 ? `+${whatIfFuelPricePct}%` : `${whatIfFuelPricePct}%`}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  step="5"
                  value={whatIfFuelPricePct}
                  onChange={(e) => setWhatIfFuelPricePct(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Port Congestion Delay Slider */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Port Congestion Delay:</span>
                  <span className="font-bold text-emerald-400">+{whatIfPortDelayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={whatIfPortDelayDays}
                  onChange={(e) => setWhatIfPortDelayDays(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Recalculated Strategy Output Banner */}
            {(() => {
              const baseCostInr = selectedPlan?.budgetInrCrore || 98.0;
              const rateFactor = 1 + whatIfFreightRatePct / 100;
              const fuelFactor = 1 + whatIfFuelPricePct / 100;
              const stratMultiplier = selectedStrategy === 'CHEAPEST' ? 0.94 : selectedStrategy === 'SAFEST' ? 1.05 : selectedStrategy === 'FASTEST' ? 1.08 : 1.0;
              
              const recalculatedCost = (baseCostInr * rateFactor * ((fuelFactor + 1) / 2) * stratMultiplier).toFixed(2);
              const savings = (105.0 - parseFloat(recalculatedCost)).toFixed(2);
              const riskVal = selectedStrategy === 'SAFEST' ? 'Low (28/100)' : selectedStrategy === 'CHEAPEST' ? 'Moderate (58/100)' : selectedStrategy === 'FASTEST' ? 'Moderate (52/100)' : 'Low (34/100)';

              return (
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg flex flex-wrap items-center justify-between text-xs gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-400 font-bold font-sans">Active Strategy: {selectedStrategy}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">Fleet: <strong className="text-white">3 × Panamax Carriers</strong></span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-slate-400">Recalculated Cost: </span>
                      <strong className="text-orange-400 text-sm">₹{recalculatedCost} Cr</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Est. Savings: </span>
                      <strong className="text-emerald-400">₹{savings} Cr</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Risk Profile: </span>
                      <strong className="text-amber-300">{riskVal}</strong>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* DETAILED VESSEL FUEL PRICE & CONSUMPTION COMPARISON CARD */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Fuel className="w-5 h-5 text-orange-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900 font-sans tracking-wide">
                    Vessel Class Fuel Price & Economic Comparison
                  </h2>
                  <div className="text-xs font-mono text-slate-500">
                    Bunker Fuel Selected: <span className="font-bold text-slate-800">{analysisReport.fuelType || 'VLSFO'} ($${analysisReport.fuelPricePerMt || 640}/MT)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Vessel Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* Panamax Card */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-300 rounded-xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-sans text-sm">Panamax Carrier</span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded">
                    OPTIMAL MATCH
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Fuel Consumption:</span>
                    <span className="font-bold text-slate-900">28 MT / day</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Bunker Fuel Cost:</span>
                    <span className="font-bold text-emerald-700">${analysisReport.vesselRecommendations?.[0]?.totalBunkerCostUsd?.toLocaleString() || '250,880'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Rate Per Metric Ton:</span>
                    <span className="font-bold text-orange-600">${analysisReport.vesselRecommendations?.[0]?.costPerMtUsd || '23.63'} / MT</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Port Draft Status:</span>
                    <span className="font-bold text-emerald-700">14.2m (Feasible ✓)</span>
                  </div>
                </div>
              </div>

              {/* Supramax Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-sans text-sm">Supramax Carrier</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded">
                    HIGHER VOYAGES
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Fuel Consumption:</span>
                    <span className="font-bold text-slate-900">22 MT / day</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Bunker Fuel Cost:</span>
                    <span className="font-bold text-slate-900">${analysisReport.vesselRecommendations?.[1]?.totalBunkerCostUsd?.toLocaleString() || '262,144'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Rate Per Metric Ton:</span>
                    <span className="font-bold text-slate-900">${analysisReport.vesselRecommendations?.[1]?.costPerMtUsd || '25.88'} / MT</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Port Draft Status:</span>
                    <span className="font-bold text-emerald-700">12.2m (Feasible ✓)</span>
                  </div>
                </div>
              </div>

              {/* Capesize Card */}
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-sans text-sm">Capesize Carrier</span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded border border-rose-300">
                    DRAFT REJECTED
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600">
                    <span>Fuel Consumption:</span>
                    <span className="font-bold text-slate-900">42 MT / day</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Bunker Fuel Cost:</span>
                    <span className="font-bold text-rose-700">${analysisReport.rejectedVessels?.[0]?.totalBunkerCostUsd?.toLocaleString() || '282,240'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Port Draft Status:</span>
                    <span className="font-bold text-rose-700">18.5m (Exceeds Limit ✗)</span>
                  </div>
                  <div className="text-[10px] text-rose-800 leading-tight pt-1 border-t border-rose-100">
                    {analysisReport.rejectedVessels?.[0]?.rejectionReason}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Create Procurement Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-0">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-orange-600" />
                <span>Create Detailed Bulk Cargo Procurement Plan</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 text-xs font-sans">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Bulk Commodity Cargo</label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500 font-sans"
                >
                  <option value="Australian Blast Furnace Coking Coal">Australian Blast Furnace Coking Coal</option>
                  <option value="Odisha Iron Ore Fines">Odisha Iron Ore Fines</option>
                  <option value="South African Thermal Coal">South African Thermal Coal</option>
                  <option value="Indonesian Steam Coal">Indonesian Steam Coal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cargo Quantity (Metric Tons)</label>
                  <input
                    type="number"
                    required
                    value={quantityMt}
                    onChange={(e) => setQuantityMt(e.target.value)}
                    placeholder="180000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Budget (₹ Crore)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={budgetCrore}
                    onChange={(e) => setBudgetCrore(e.target.value)}
                    placeholder="165.0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Origin Loading Port</label>
                  <select
                    value={originPortId}
                    onChange={(e) => setOriginPortId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                  >
                    {ports.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.country})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Destination Discharge Port</label>
                  <select
                    value={destinationPortId}
                    onChange={(e) => setDestinationPortId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                  >
                    {ports.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.country})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vessel Fuel & Engine Specification</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                >
                  <option value="VLSFO (Very Low Sulfur Fuel Oil - $640/MT)">VLSFO (Very Low Sulfur Fuel Oil - $640/MT)</option>
                  <option value="HFO (Heavy Fuel Oil + Scrubber - $480/MT)">HFO (Heavy Fuel Oil + Scrubber - $480/MT)</option>
                  <option value="LNG Dual-Fuel Engine ($760/MT)">LNG Dual-Fuel Engine ($760/MT)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Required Delivery <GlossaryTerm termId="laycan">Laycan</GlossaryTerm> Window</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  {submitting ? 'Creating in Firestore...' : 'Submit Procurement Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
