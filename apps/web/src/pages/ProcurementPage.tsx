import React, { useEffect, useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { api } from '../lib/api';
import { seedFirestoreIfEmpty } from '../lib/firebaseSeed';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FullAnalysisReport } from '@freightiq/shared-types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { formatUsd, formatInrCrore, formatUsdAndInr } from '../lib/currency';
import { exportReportToPdf } from '../lib/pdfExporter';
import { CompassRiskGauge } from '../components/ui/CompassRiskGauge';
import { CharterStampBadge } from '../components/ui/CharterStampBadge';
import {
  FileSpreadsheet,
  Plus,
  Sparkles,
  X,
  AlertCircle,
  TrendingUp,
  Ship,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Compass,
  Sliders,
  Printer,
  ChevronDown,
  ChevronUp,
  Brain,
  Info,
  Radio,
  FileText,
  Award
} from 'lucide-react';
import { ForecastChart } from '../components/analytics/ForecastChart';
import { PipelineHealthWidget } from '../components/analytics/PipelineHealthWidget';

export const ProcurementPage: React.FC = () => {
  // Live Firestore Collection Listener
  const { data: requests, loading: requestsLoading } = useFirestoreCollection<any>('procurementRequests');
  const { data: ports } = useFirestoreCollection<any>('ports');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  // View Mode: Simple vs Advanced
  const [viewMode, setViewMode] = useState<'SIMPLE' | 'ADVANCED'>(() => {
    return (localStorage.getItem('freightiq_proc_mode') as any) || 'SIMPLE';
  });

  // What-If Simulator & Strategy State
  const [selectedStrategy, setSelectedStrategy] = useState<'BALANCED' | 'CHEAPEST' | 'SAFEST' | 'FASTEST'>('BALANCED');
  const [whatIfFreightRatePct, setWhatIfFreightRatePct] = useState<number>(0);
  const [whatIfFuelPricePct, setWhatIfFuelPricePct] = useState<number>(0);
  const [whatIfPortDelayDays, setWhatIfPortDelayDays] = useState<number>(0);

  // Pipeline Loading & Error State
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [analysisReport, setAnalysisReport] = useState<FullAnalysisReport | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isOfflineDemoMode, setIsOfflineDemoMode] = useState<boolean>(false);
  const [exportingPdf, setExportingPdf] = useState<boolean>(false);

  // Lineage Disclosure Toggle
  const [showLineage, setShowLineage] = useState(false);

  // Detailed Create Form State & Modal Tabs
  const [modalTab, setModalTab] = useState<'CARGO' | 'OPERATIONS' | 'COMMERCIAL'>('CARGO');
  const [commodity, setCommodity] = useState('Australian Blast Furnace Coking Coal');
  const [quantityMt, setQuantityMt] = useState('180000');
  const [originPortId, setOriginPortId] = useState('');
  const [destinationPortId, setDestinationPortId] = useState('');
  const [fuelType, setFuelType] = useState('VLSFO (Very Low Sulfur Fuel Oil - $640/MT)');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [budgetCrore, setBudgetCrore] = useState('165.0');
  const [incoterm, setIncoterm] = useState<'FOB' | 'CFR' | 'CIF'>('FOB');
  const [targetFreightCeilingUsd, setTargetFreightCeilingUsd] = useState('28.50');
  const [ashContentPct, setAshContentPct] = useState('9.5');
  const [volatileMatterPct, setVolatileMatterPct] = useState('21.0');
  const [csrRating, setCsrRating] = useState('68.0');
  const [dischargeRateTpd, setDischargeRateTpd] = useState('45000');
  const [demurrageRateUsdDay, setDemurrageRateUsdDay] = useState('15000');
  const [maxVesselAgeYears, setMaxVesselAgeYears] = useState('15');
  const [esgCiiGrade, setEsgCiiGrade] = useState('GRADE_B');
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
        incoterm,
        targetFreightCeilingUsd: parseFloat(targetFreightCeilingUsd),
        ashContentPct: parseFloat(ashContentPct),
        volatileMatterPct: parseFloat(volatileMatterPct),
        csrRating: parseFloat(csrRating),
        dischargeRateTpd: parseFloat(dischargeRateTpd),
        demurrageRateUsdDay: parseFloat(demurrageRateUsdDay),
        maxVesselAgeYears: parseInt(maxVesselAgeYears, 10),
        esgCiiGrade,
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

  const generateFallbackAnalysisReport = (req: any): FullAnalysisReport => {
    const originName = req?.originPortName || 'Newcastle AU';
    const destName = req?.destinationPortName || 'Paradip Port';
    const commodityName = req?.commodity || 'Australian Blast Furnace Coking Coal';
    const qty = req?.quantityMt || 180000;

    const mockPoints = [
      { date: '2026-09-01', predictedRate: 29.50, confidenceLower: 27.80, confidenceUpper: 31.20 },
      { date: '2026-09-15', predictedRate: 30.20, confidenceLower: 28.50, confidenceUpper: 31.90 },
      { date: '2026-10-01', predictedRate: 30.80, confidenceLower: 28.90, confidenceUpper: 32.70 },
      { date: '2026-10-15', predictedRate: 31.40, confidenceLower: 29.30, confidenceUpper: 33.50 },
      { date: '2026-11-01', predictedRate: 31.90, confidenceLower: 29.80, confidenceUpper: 34.00 },
      { date: '2026-11-15', predictedRate: 32.20, confidenceLower: 30.10, confidenceUpper: 34.30 }
    ];

    return {
      procurementRequestId: req?.id || 'req-demo',
      commodity: commodityName,
      quantityMt: qty,
      originPortName: originName,
      destinationPortName: destName,
      forecast: {
        route: `${originName} → ${destName}`,
        originPortName: originName,
        destinationPortName: destName,
        vesselTypeName: 'Panamax / Kamsarmax',
        selectedModel: 'XGBoost Regressor (Primary)',
        trendDirection: 'UPWARD',
        trendMagnitudePct: 9.2,
        modelMetrics: [
          { modelName: 'XGBoost Regressor (Primary)', algorithm: 'Gradient Boosted Decision Trees', mae: 1.85, mape: 4.8, isBest: true },
          { modelName: 'SARIMAX Time-Series', algorithm: 'Seasonal AutoRegressive Moving Average', mae: 3.42, mape: 9.1, isBest: false },
          { modelName: 'Feature Linear Regression', algorithm: 'Multi-variable Linregress', mae: 4.10, mape: 11.2, isBest: false },
          { modelName: 'Seasonal Naive Baseline', algorithm: 'Historical Prior Year Average', mae: 5.25, mape: 14.6, isBest: false }
        ],
        forecastPoints: mockPoints
      },
      vesselRecommendations: [
        {
          vesselTypeId: 'vt-panamax',
          vesselTypeName: 'Kamsarmax / Panamax Carrier',
          vesselCode: 'PANAMAX',
          draftM: 14.2,
          lengthM: 225.0,
          requiredVoyagesCount: 3,
          estimatedTurnaroundDays: 3.2,
          estimatedCostUsd: 4253400,
          totalBunkerCostUsd: 250880,
          costPerMtUsd: 23.63,
          isFeasible: true,
          rejectionReason: '',
          rank: 1
        },
        {
          vesselTypeId: 'vt-supra',
          vesselTypeName: 'Supramax Bulk Carrier',
          vesselCode: 'SUPRA',
          draftM: 12.8,
          lengthM: 200.0,
          requiredVoyagesCount: 4,
          estimatedTurnaroundDays: 4.1,
          estimatedCostUsd: 4658000,
          totalBunkerCostUsd: 262144,
          costPerMtUsd: 25.88,
          isFeasible: true,
          rejectionReason: '',
          rank: 2
        }
      ],
      rejectedVessels: [
        {
          vesselTypeId: 'vt-cape',
          vesselTypeName: 'Capesize Heavy Bulk Carrier',
          vesselCode: 'CAPE',
          draftM: 18.5,
          lengthM: 295.0,
          requiredVoyagesCount: 1,
          estimatedTurnaroundDays: 0,
          estimatedCostUsd: 0,
          totalBunkerCostUsd: 282240,
          costPerMtUsd: 0,
          isFeasible: false,
          rejectionReason: 'Draft Violation: Required 18.5m exceeds discharge port max depth 14.5m'
        }
      ],
      contractStrategies: [
        {
          strategyType: 'MID_TERM_6M',
          title: '6-Month COA Multi-Voyage Contract (Recommended)',
          rateUsdPerMt: 23.63,
          estimatedTotalCostUsd: 4253400,
          voyagesCount: 3,
          volatilityExposureScore: 15,
          isRecommended: true,
          reasoning: `Locks in rate ceiling ($23.63/MT) for ${qty.toLocaleString()} MT of ${commodityName} on ${originName} → ${destName} route before predicted 9.2% market surge.`
        },
        {
          strategyType: 'SHORT_TERM_3M',
          title: '3-Month Short-Term Charter',
          rateUsdPerMt: 25.40,
          estimatedTotalCostUsd: 4572000,
          voyagesCount: 3,
          volatilityExposureScore: 42,
          isRecommended: false,
          reasoning: `Provides 90-day rate stability but leaves remaining Q4 volume exposed to forecasted upward rate pressures.`
        },
        {
          strategyType: 'SPOT',
          title: 'Immediate Spot Voyage Charter',
          rateUsdPerMt: 29.50,
          estimatedTotalCostUsd: 5310000,
          voyagesCount: 3,
          volatilityExposureScore: 82,
          isRecommended: false,
          reasoning: `Spot chartering exposes SAIL to volatile spot market escalation over laycan window.`
        }
      ],
      riskAnalysis: {
        freightVolatilityScore: 58.0,
        portCongestionScore: 42.0,
        deadlineRiskScore: 30.0,
        marketVolatilityScore: 35.0,
        compositeRiskScore: 34.2,
        riskLevel: 'LOW',
        activeAlerts: [
          'MODERATE FREIGHT VOLATILITY: Forecast indicates rate swing of +9.2% over next 90 days.',
          'LAYCAN DEADLINE: Recommended laycan window is optimal for current berth capacity.'
        ]
      },
      idleOptions: [
        {
          actionType: 'BALLAST_REPOSITION',
          optionTitle: 'Reposition Ballast: Paradip Port → Port Hedland AU',
          vesselCategory: 'Panamax',
          estimatedCostUsd: 185000,
          estimatedNetRevenueUsd: 227500,
          recommendedAction: 'High demand for Australian Iron Ore/Coking Coal. 3,400 nm ballast voyage yields +$42,500 net margin vs idling.'
        },
        {
          actionType: 'ALT_CARGO_EMPLOYMENT',
          optionTitle: 'Short Coastal Trip: Paradip → Haldia Port',
          vesselCategory: 'Panamax',
          estimatedCostUsd: 95000,
          estimatedNetRevenueUsd: 118000,
          recommendedAction: 'Coastal thermal coal stem provides positive cashflow (+ $23,000) during 8-day laycan wait.'
        }
      ],
      aiExplanation: {
        recommendationLine: `Execute 6-Month COA Contract for ${qty.toLocaleString()} MT of ${commodityName} to save ₹8.8 Crore.`,
        reasoningParagraph: `XGBoost regression models an UPWARD rate trajectory (+9.2%) driven by rising global demand and VLSFO bunker fuel fluctuation. Securing a 6-Month COA contract shields SAIL from spot market surges while utilizing Panamax carriers compatible with ${destName}'s 14.5m draft channel limit.`,
        caveatsText: 'VLSFO bunker fuel volatility could shift voyage costs by ±3.5%. Monsoon weather patterns may increase port turnaround congestion by 0.8 days.',
        groundedDataSummary: `Grounded in 180-day historical Baltic Dry Index data, 76.5k DWT Panamax class specs, and ${destName} 14.5m draft limit.`,
        isAiGenerated: false
      },
      generatedAt: new Date().toISOString()
    };
  };

  const handleTriggerAnalysis = async (req: any) => {
    setSelectedPlan(req);
    setAnalyzingId(req.id);
    setAnalysisStage(1);
    setAnalysisReport(null);
    setAnalysisError(null);
    setIsOfflineDemoMode(false);

    const timer1 = setTimeout(() => setAnalysisStage(2), 300);
    const timer2 = setTimeout(() => setAnalysisStage(4), 600);
    const timer3 = setTimeout(() => setAnalysisStage(6), 900);

    try {
      const res = await api.post<FullAnalysisReport>(`/procurement/requests/${req.id}/analyze`);
      setAnalysisReport(res.data);
    } catch (err: any) {
      console.error('Backend API server unreachable:', err);
      const msg = err.response?.data?.message || err.message || 'Python Decision Engine / NestJS Backend is unreachable.';
      setAnalysisError(`Backend API Failure: ${msg}`);
      setAnalysisReport(null);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setAnalyzingId(null);
      setAnalysisStage(0);
    }
  };

  const handleViewOfflineDemo = (req?: any) => {
    const targetReq = req || selectedPlan || (requests && requests[0]) || { id: 'req-demo' };
    const fallbackReport = generateFallbackAnalysisReport(targetReq);
    setAnalysisReport(fallbackReport);
    setIsOfflineDemoMode(true);
    setAnalysisError(null);
  };

  const handleExportPdf = async () => {
    if (!analysisReport) return;
    setExportingPdf(true);
    try {
      await exportReportToPdf('analysis-report-container', analysisReport);
    } catch (err) {
      console.error('PDF Export failed, invoking fallback window.print()', err);
      window.print();
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs activePath="/procurement" onNavigate={() => {}} requestTitle={selectedPlan?.commodity} />

      {/* Persistent Top Alert Banner when in Offline Demo Mode */}
      {isOfflineDemoMode && (
        <div className="bg-[#FFF8E7] text-[#9C6615] px-4 py-2.5 rounded-full font-mono text-xs font-bold flex items-center justify-between border border-[#9C6615]/30 shadow-card-soft print:hidden">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#9C6615] shrink-0" />
            <span>⚠️ DEMO DATA MODE — Displaying offline synthetic demonstration data (not from live backend API)</span>
          </div>
          <button
            onClick={() => {
              setIsOfflineDemoMode(false);
              setAnalysisReport(null);
            }}
            className="decline-button-theme text-[10px] uppercase font-bold"
          >
            Clear Demo Data
          </button>
        </div>
      )}

      {/* Title & Action Header */}
      <div className="card-theme rounded-2xl p-6 shadow-card-soft border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] font-serif flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#7b57ff]" />
              <span>Bulk Cargo Chartering & Decision Suite</span>
            </h1>
            <span className="px-3 py-0.5 bg-[#F0F7F4] text-[#2D6A4F] text-[10px] font-mono rounded-full font-bold flex items-center gap-1 border border-[#2D6A4F]/30">
              <Radio className="w-3 h-3 text-[#2D6A4F] animate-pulse" />
              <span>PYTHON + NESTJS ENGINE ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-[#3E5871] font-mono mt-0.5">
            NestJS Backend API • Python XGBoost Decision Engine • Server-Side Gemini AI
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Simple vs Advanced Mode Toggle */}
          <div className="flex rounded-full bg-[#DADADA]/60 p-1 font-mono text-xs border border-slate-200">
            <button
              onClick={() => handleToggleViewMode('SIMPLE')}
              className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                viewMode === 'SIMPLE' ? 'bg-[#7b57ff] text-white shadow-xs' : 'text-[#2E2E2E] hover:text-black'
              }`}
            >
              Simple View
            </button>
            <button
              onClick={() => handleToggleViewMode('ADVANCED')}
              className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                viewMode === 'ADVANCED' ? 'bg-[#7b57ff] text-white shadow-xs' : 'text-[#2E2E2E] hover:text-black'
              }`}
            >
              Advanced View
            </button>
          </div>

          {analysisReport && (
            <button
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="decline-button-theme text-xs font-bold font-mono flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-[#2E2E2E]" />
              <span>{exportingPdf ? 'Generating PDF...' : 'Export Memo (PDF)'}</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="accept-button-theme text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-card-soft px-5 py-2.5"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Procurement Plan</span>
          </button>
        </div>
      </div>

      {/* Microservices & Pipeline Diagnostic Health Monitor */}
      <PipelineHealthWidget />

      {/* Procurement Plans Master Table (Live Firestore Streamed) */}
      <div className="card-theme rounded-2xl overflow-hidden shadow-card-soft border border-slate-100 print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAFAF8] border-b border-[#0F1B2E]/10 uppercase text-[10px] text-[#3E5871]">
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
            <tbody className="divide-y divide-[#0F1B2E]/10">
              {requestsLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#3E5871] font-mono">
                    Connecting live Firestore stream...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-[#3E5871] font-mono">
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
                        isSelected ? 'bg-[#7b57ff]/10 border-l-4 border-[#7b57ff]' : 'hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-sans font-bold text-[#0F1B2E]">{req.commodity}</td>
                      <td className="py-3.5 px-4 text-[#2C5282] font-bold">
                        {req.originPortName} → {req.destinationPortName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#0F1B2E] tabular-nums">
                        {req.quantityMt ? req.quantityMt.toLocaleString() : '150,000'} MT
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#7b57ff] font-bold tabular-nums">
                        ₹{req.budgetInrCrore} Cr
                      </td>
                      <td className="py-3.5 px-4 text-[#3E5871] text-[11px] truncate max-w-xs">
                        {req.fuelType || 'VLSFO ($640/MT)'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-0.5 text-[9px] rounded-full font-bold border ${
                            req.status === 'OPTIMIZED'
                              ? 'bg-[#F0F7F4] text-[#2D6A4F] border-[#2D6A4F]/30'
                              : 'bg-[#FFF8E7] text-[#9C6615] border-[#9C6615]/30'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleTriggerAnalysis(req)}
                          disabled={isRunning}
                          className="accept-button-theme text-[11px] font-bold inline-flex items-center space-x-1.5 shadow-card-soft disabled:opacity-50 px-4 py-1.5"
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
        <div className="p-6 card-theme border border-[#7b57ff]/40 rounded-2xl shadow-card-soft space-y-4 font-mono animate-in fade-in print:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F1B2E] flex items-center gap-2 font-serif">
              <Sparkles className="w-4 h-4 text-[#7b57ff] animate-spin" />
              <span>Executing Python Decision Engine & Server-Side AI Pipeline...</span>
            </h3>
            <span className="text-xs text-[#7b57ff] font-bold">Stage {analysisStage} of 6</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-[10px]">
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 1 ? 'bg-[#7b57ff]/10 border-[#7b57ff] text-[#0F1B2E] font-bold' : 'bg-[#FAFAF8] border-[#0F1B2E]/10 text-[#3E5871]'}`}>
              1. XGBoost Forecast
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 2 ? 'bg-[#7b57ff]/10 border-[#7b57ff] text-[#0F1B2E] font-bold' : 'bg-[#FAFAF8] border-[#0F1B2E]/10 text-[#3E5871]'}`}>
              2. Draft & LOA Solver
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 3 ? 'bg-[#7b57ff]/10 border-[#7b57ff] text-[#0F1B2E] font-bold' : 'bg-[#FAFAF8] border-[#0F1B2E]/10 text-[#3E5871]'}`}>
              3. COA Strategy Solver
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 4 ? 'bg-[#7b57ff]/10 border-[#7b57ff] text-[#0F1B2E] font-bold' : 'bg-[#FAFAF8] border-[#0F1B2E]/10 text-[#3E5871]'}`}>
              4. Idle Repositioning
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 5 ? 'bg-[#7b57ff]/10 border-[#7b57ff] text-[#0F1B2E] font-bold' : 'bg-[#FAFAF8] border-[#0F1B2E]/10 text-[#3E5871]'}`}>
              5. Composite 4D Risk
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 6 ? 'bg-[#7b57ff]/10 border-[#7b57ff] text-[#0F1B2E] font-bold' : 'bg-[#FAFAF8] border-[#0F1B2E]/10 text-[#3E5871]'}`}>
              6. Gemini AI Rationale
            </div>
          </div>
        </div>
      )}

      {/* PIPELINE EXECUTION ERROR CARD */}
      {analysisError && (
        <div className="p-5 bg-[#FDF2F2] border border-[#A32D2D]/30 rounded-2xl text-[#A32D2D] text-xs font-mono space-y-3 animate-in fade-in print:hidden shadow-card-soft">
          <div className="font-bold flex items-center gap-2 text-[#A32D2D] text-sm font-serif">
            <AlertCircle className="w-5 h-5 text-[#A32D2D] shrink-0" />
            <span>Decision Engine Microservice Connection Error</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-[#A32D2D]/20 text-[#A32D2D]">{analysisError}</div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-sans">
            <span className="text-[11px] text-[#3E5871]">
              Check Python Decision Engine on port 8000 (`py main.py` in `apps/decision-engine`) and NestJS API on port 4000.
            </span>
            <button
              onClick={() => handleViewOfflineDemo(selectedPlan)}
              className="accept-button-theme text-xs inline-flex items-center space-x-1.5 shadow-card-soft px-4 py-2"
            >
              <Radio className="w-3.5 h-3.5 text-white" />
              <span>View Offline Demo Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Analytical Results Dashboard Panels */}
      {analysisReport && (
        <div id="analysis-report-container" className="space-y-6 animate-in fade-in card-theme p-6 rounded-2xl border border-slate-100 shadow-card-soft">
          {/* TOP REPORT EXPORT ACTION TOOLBAR */}
          <div className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-card-soft border border-slate-100 bg-[#FAFAF8] print:hidden">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#7b57ff]/10 rounded-full border border-[#7b57ff]/30">
                <FileSpreadsheet className="w-5 h-5 text-[#7b57ff]" />
              </div>
              <div>
                <div className="font-bold text-[#0F1B2E] text-sm font-serif">Official Decision Recommendation Dossier</div>
                <div className="text-xs text-[#3E5871] font-mono">
                  Report ID: <span className="font-bold text-[#0F1B2E]">REQ-{analysisReport.procurementRequestId}-{new Date(analysisReport.generatedAt || Date.now()).getTime().toString(36).toUpperCase()}</span> • Generated: {new Date(analysisReport.generatedAt || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMethodologyModalOpen(true)}
                className="decline-button-theme text-xs font-bold font-sans inline-flex items-center space-x-1.5 px-4 py-2"
              >
                <Info className="w-3.5 h-3.5 text-[#2E2E2E]" />
                <span>Methodology & Models</span>
              </button>

              <button
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="accept-button-theme text-xs font-bold font-sans inline-flex items-center space-x-2 shadow-card-soft disabled:opacity-50 px-5 py-2"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>{exportingPdf ? 'Exporting PDF...' : 'Export Decision Memo (PDF)'}</span>
              </button>
            </div>
          </div>

          {/* PART B1: EXECUTIVE SUMMARY BLOCK AT THE VERY TOP */}
          {(() => {
            const recStrat = analysisReport.contractStrategies?.find((s) => s.isRecommended) || analysisReport.contractStrategies?.[0];
            const spotStrat = analysisReport.contractStrategies?.find((s) => s.strategyType === 'SPOT') || analysisReport.contractStrategies?.[1];
            const savingsUsd = spotStrat && recStrat ? (spotStrat.estimatedTotalCostUsd - recStrat.estimatedTotalCostUsd) : 1056600;

            return (
              <div className="bg-[#0F1B2E] text-white rounded-2xl p-6 shadow-card-soft border border-[#0F1B2E] space-y-4 font-sans relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-[#7b57ff] shrink-0" />
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight uppercase font-mono">
                        SAIL Executive Chartering Recommendation Memo
                      </h2>
                      <div className="text-xs text-slate-300 font-mono">
                        Route: <span className="text-white font-bold">{analysisReport.originPortName} → {analysisReport.destinationPortName}</span> • Cargo: <span className="text-[#7b57ff] font-bold">{analysisReport.quantityMt?.toLocaleString()} MT {analysisReport.commodity}</span>
                      </div>
                    </div>
                  </div>
                  <CharterStampBadge variant="RECOMMENDED" label="RECOMMENDED STRATEGY READY" />
                </div>

                {/* 3-Line Big Executive Recommendation Headline */}
                <div className="text-lg md:text-xl font-bold text-[#7b57ff] leading-snug tracking-tight font-serif">
                  {analysisReport.aiExplanation?.recommendationLine}
                </div>

                {/* KPI Summary Cards Grid (Dual Currency USD + ₹ Crore) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                    <div className="text-slate-300 text-[10px] uppercase font-sans">Recommended Charter</div>
                    <div className="font-bold text-white text-sm truncate">{recStrat?.title || '6-Month COA Contract'}</div>
                    <div className="text-[#7b57ff] font-bold text-[11px]">${recStrat?.rateUsdPerMt}/MT Lock</div>
                  </div>

                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                    <div className="text-slate-300 text-[10px] uppercase font-sans">Total Estimated Outlay</div>
                    <div className="font-bold text-white text-sm">{formatUsdAndInr(recStrat?.estimatedTotalCostUsd || 4253400)}</div>
                    <div className="text-slate-400 text-[10px]">Dual Currency (USD / ₹ Cr)</div>
                  </div>

                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                    <div className="text-slate-300 text-[10px] uppercase font-sans">Est. Savings vs Spot</div>
                    <div className="font-bold text-emerald-400 text-sm">+{formatUsdAndInr(savingsUsd)}</div>
                    <div className="text-emerald-300 text-[10px]">Shields against +{analysisReport.forecast?.trendMagnitudePct || 9.2}% surge</div>
                  </div>

                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                    <div className="text-slate-300 text-[10px] uppercase font-sans">Composite Risk Level</div>
                    <div className="font-bold text-amber-300 text-sm">
                      {analysisReport.riskAnalysis?.compositeRiskScore}/100 ({analysisReport.riskAnalysis?.riskLevel})
                    </div>
                    <div className="text-slate-400 text-[10px]">4-Factor Multi-Score Evaluated</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* SECTION 0: GEMINI AI RECOMMENDATION & REASONING SYNTHESIS LAYER */}
          <div className="card-theme border border-slate-100 rounded-2xl p-5 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#0F1B2E]/10 pb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-[#7b57ff]" />
                <div>
                  <h2 className="text-sm font-bold text-[#0F1B2E] font-serif tracking-wide">
                    Executive AI Recommendation & Reasoning Layer
                  </h2>
                  <div className="text-[11px] font-mono text-[#3E5871]">
                    Model: Gemini 1.5 Flash • Grounded Analytical Synthesis
                  </div>
                </div>
              </div>

              <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                analysisReport.aiExplanation.isAiGenerated
                  ? 'bg-[#7b57ff]/10 text-[#7b57ff] border-[#7b57ff]/30'
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {analysisReport.aiExplanation.isAiGenerated ? '✨ Synthesized live via Google Gemini API' : 'Analytical Fallback Reasoning'}
              </span>
            </div>

            {/* 1-Line Recommendation */}
            <div className="p-3.5 bg-[#FAFAF8] border border-slate-200/80 rounded-xl text-xs font-sans font-bold text-[#0F1B2E] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#7b57ff] shrink-0" />
              <span>{analysisReport.aiExplanation.recommendationLine}</span>
            </div>

            {/* Analytical Reasoning Paragraph */}
            <div className="text-xs text-[#0F1B2E] font-sans leading-relaxed bg-[#FAFAF8] p-4 rounded-xl border border-slate-200/80">
              <div className="font-bold text-[#0F1B2E] mb-1 font-serif">Executive Reasoning:</div>
              {analysisReport.aiExplanation.reasoningParagraph}
            </div>

            {/* Honest Caveats */}
            <div className="p-3.5 bg-[#FFF8E7] border border-[#9C6615]/30 rounded-xl text-[#9C6615] text-xs font-sans">
              <div className="font-bold text-[#9C6615] mb-0.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#9C6615]" />
                <span>Operational Caveats & Uncertainty:</span>
              </div>
              <div>{analysisReport.aiExplanation.caveatsText}</div>
            </div>

            {/* Expandable Grounded Data Lineage */}
            <div className="border-t border-[#0F1B2E]/10 pt-2 font-mono text-xs">
              <button
                onClick={() => setShowLineage((prev) => !prev)}
                className="text-[11px] text-[#3E5871] font-bold hover:text-[#0F1B2E] flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showLineage ? 'Hide Grounded Data Lineage' : 'View Grounded Data Lineage (Traceability Disclosure)'}</span>
                {showLineage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showLineage && (
                <div className="mt-2 p-3.5 bg-[#0F1B2E] text-slate-100 rounded-xl text-[10px] leading-relaxed animate-in fade-in">
                  <div className="font-bold text-[#7b57ff] mb-1">Grounded Decision Engine Inputs Passed Server-Side:</div>
                  <div>{analysisReport.aiExplanation.groundedDataSummary}</div>
                </div>
              )}
            </div>
          </div>

          {/* PART B2: DETAILED 4-FACTOR RISK ANALYSIS SUB-SCORES BREAKDOWN WITH COMPASS GAUGE */}
          <div className="card-theme border border-slate-100 rounded-2xl p-5 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#0F1B2E]/10 pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#7b57ff]" />
                <div>
                  <h2 className="text-sm font-bold text-[#0F1B2E] font-serif tracking-wide">
                    Multi-Factor Operational & Freight Risk Navigation
                  </h2>
                  <div className="text-xs font-mono text-[#3E5871]">
                    Composite Score: <span className="font-bold text-[#0F1B2E]">{analysisReport.riskAnalysis?.compositeRiskScore}/100 ({analysisReport.riskAnalysis?.riskLevel} RISK)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Compass Risk Gauge Dial */}
              <div className="flex justify-center">
                <CompassRiskGauge
                  score={analysisReport.riskAnalysis?.compositeRiskScore || 34.2}
                  riskLevel={analysisReport.riskAnalysis?.riskLevel || 'LOW'}
                  size="md"
                />
              </div>

              {/* 4 Individual Sub-Scores Progress Bars */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#FAFAF8] border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex justify-between text-[#3E5871] text-[11px]">
                    <span>Freight Volatility</span>
                    <span className="font-bold text-[#0F1B2E]">{analysisReport.riskAnalysis?.freightVolatilityScore?.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#7b57ff] h-full rounded-full"
                      style={{ width: `${Math.min(100, analysisReport.riskAnalysis?.freightVolatilityScore || 0)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAFAF8] border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex justify-between text-[#3E5871] text-[11px]">
                    <span>Port Congestion</span>
                    <span className="font-bold text-[#0F1B2E]">{analysisReport.riskAnalysis?.portCongestionScore?.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#9C6615] h-full rounded-full"
                      style={{ width: `${Math.min(100, analysisReport.riskAnalysis?.portCongestionScore || 0)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAFAF8] border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex justify-between text-[#3E5871] text-[11px]">
                    <span>Laycan Deadline Risk</span>
                    <span className="font-bold text-[#0F1B2E]">{analysisReport.riskAnalysis?.deadlineRiskScore?.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2C5282] h-full rounded-full"
                      style={{ width: `${Math.min(100, analysisReport.riskAnalysis?.deadlineRiskScore || 0)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAFAF8] border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex justify-between text-[#3E5871] text-[11px]">
                    <span>Market Volatility</span>
                    <span className="font-bold text-[#0F1B2E]">{analysisReport.riskAnalysis?.marketVolatilityScore?.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#3E5871] h-full rounded-full"
                      style={{ width: `${Math.min(100, analysisReport.riskAnalysis?.marketVolatilityScore || 0)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE FREIGHT RATE PREDICTION & BACKTEST SVG CHART */}
          {analysisReport.forecast?.forecastPoints && (
            <ForecastChart
              points={analysisReport.forecast.forecastPoints}
              route={analysisReport.forecast.route || 'Newcastle Port → Paradip Port'}
              trendDirection={analysisReport.forecast.trendDirection || 'UPWARD'}
              trendMagnitudePct={analysisReport.forecast.trendMagnitudePct || 9.2}
            />
          )}

          {/* CONTRACT STRATEGIES COMPARISON SECTION (Part B2 & B3) */}
          {analysisReport.contractStrategies && analysisReport.contractStrategies.length > 0 && (
            <div className="card-theme border border-slate-100 rounded-2xl p-5 shadow-card-soft space-y-4">
              <div className="flex items-center justify-between border-b border-[#0F1B2E]/10 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#7b57ff]" />
                  <div>
                    <h2 className="text-sm font-bold text-[#0F1B2E] font-serif tracking-wide">
                      Contract Strategy & Market Entry Evaluation Matrix
                    </h2>
                    <div className="text-xs font-mono text-[#3E5871]">
                      Comparing COA, Short-Term, and Spot Options
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisReport.contractStrategies.map((strat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${
                      strat.isRecommended
                        ? 'bg-[#F0F7F4] border-[#2D6A4F] shadow-card-soft'
                        : 'bg-[#FAFAF8] border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F1B2E] text-xs font-serif">{strat.title}</span>
                        {strat.isRecommended && (
                          <CharterStampBadge variant="FEASIBLE" label="RECOMMENDED" />
                        )}
                      </div>

                      <div className="space-y-1 font-mono text-xs">
                        <div className="flex justify-between text-[#3E5871]">
                          <span>Freight Rate:</span>
                          <strong className="text-[#0F1B2E]">${strat.rateUsdPerMt}/MT</strong>
                        </div>
                        <div className="flex justify-between text-[#3E5871]">
                          <span>Est. Total Outlay:</span>
                          <strong className="text-[#7b57ff]">{formatUsdAndInr(strat.estimatedTotalCostUsd)}</strong>
                        </div>
                        <div className="flex justify-between text-[#3E5871]">
                          <span>Required Voyages:</span>
                          <strong className="text-[#0F1B2E]">{strat.voyagesCount} Voyages</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#3E5871] font-sans leading-relaxed pt-2 border-t border-[#0F1B2E]/10">
                        {strat.reasoning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WHAT-IF SENSITIVITY SIMULATOR CARD */}
          <div className="card-theme border border-slate-100 rounded-2xl p-5 shadow-card-soft space-y-4 font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#0F1B2E]/10 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#7b57ff]" />
                <div>
                  <h2 className="text-sm font-bold text-[#0F1B2E] font-serif tracking-wide">
                    What-If Sensitivity Simulator & Multi-Strategy Engine
                  </h2>
                  <div className="text-[11px] text-[#3E5871]">
                    Adjust market variables dynamically to recalculate chartering costs and risk ratings
                  </div>
                </div>
              </div>

              {/* Strategy Selector Pills */}
              <div className="flex rounded-full bg-[#DADADA]/60 p-1 text-xs border border-slate-200">
                {(['BALANCED', 'CHEAPEST', 'SAFEST', 'FASTEST'] as const).map((strat) => (
                  <button
                    key={strat}
                    onClick={() => setSelectedStrategy(strat)}
                    className={`px-3.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      selectedStrategy === strat
                        ? 'bg-[#7b57ff] text-white shadow-xs'
                        : 'text-[#2E2E2E] hover:text-black'
                    }`}
                  >
                    {strat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-[#3E5871]">
                  <span>Freight Rate Impact:</span>
                  <span className="font-bold text-[#7b57ff]">{whatIfFreightRatePct > 0 ? `+${whatIfFreightRatePct}%` : `${whatIfFreightRatePct}%`}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="30"
                  step="5"
                  value={whatIfFreightRatePct}
                  onChange={(e) => setWhatIfFreightRatePct(Number(e.target.value))}
                  className="w-full accent-[#7b57ff] cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-[#3E5871]">
                  <span>Bunker Fuel Surcharge:</span>
                  <span className="font-bold text-[#9C6615]">{whatIfFuelPricePct > 0 ? `+${whatIfFuelPricePct}%` : `${whatIfFuelPricePct}%`}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="40"
                  step="5"
                  value={whatIfFuelPricePct}
                  onChange={(e) => setWhatIfFuelPricePct(Number(e.target.value))}
                  className="w-full accent-[#9C6615] cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-[#3E5871]">
                  <span>Port Congestion Delay:</span>
                  <span className="font-bold text-[#2D6A4F]">+{whatIfPortDelayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={whatIfPortDelayDays}
                  onChange={(e) => setWhatIfPortDelayDays(Number(e.target.value))}
                  className="w-full accent-[#2D6A4F] cursor-pointer"
                />
              </div>
            </div>

            {/* Recalculated Strategy Output Banner (Dual Currency) */}
            {(() => {
              const baseCostUsd = analysisReport.contractStrategies?.[0]?.estimatedTotalCostUsd || 4253400;
              const rateFactor = 1 + whatIfFreightRatePct / 100;
              const fuelFactor = 1 + whatIfFuelPricePct / 100;
              const stratMultiplier = selectedStrategy === 'CHEAPEST' ? 0.94 : selectedStrategy === 'SAFEST' ? 1.05 : selectedStrategy === 'FASTEST' ? 1.08 : 1.0;
              
              const recalculatedUsd = baseCostUsd * rateFactor * ((fuelFactor + 1) / 2) * stratMultiplier;
              const savingsUsd = 5310000 - recalculatedUsd;
              const riskVal = selectedStrategy === 'SAFEST' ? 'Low (28/100)' : selectedStrategy === 'CHEAPEST' ? 'Moderate (58/100)' : selectedStrategy === 'FASTEST' ? 'Moderate (52/100)' : 'Low (34/100)';

              return (
                <div className="p-4 bg-[#FAFAF8] border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between text-xs gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1B2E] font-bold font-sans">Active Strategy: {selectedStrategy}</span>
                    <span className="text-[#3E5871]">•</span>
                    <span className="text-[#3E5871]">Fleet: <strong className="text-[#0F1B2E]">3 × Panamax Carriers</strong></span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-[#3E5871]">Recalculated Outlay: </span>
                      <strong className="text-[#7b57ff] text-xs font-bold">{formatUsdAndInr(recalculatedUsd)}</strong>
                    </div>
                    <div>
                      <span className="text-[#3E5871]">Est. Savings: </span>
                      <strong className="text-[#2D6A4F] text-xs font-bold">{formatUsdAndInr(savingsUsd)}</strong>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Detailed Create Procurement Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1B2E]/40 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="card-theme border border-slate-100 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-0 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#0F1B2E]/10 flex items-center justify-between bg-[#0F1B2E] text-white">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 font-serif">
                  <FileSpreadsheet className="w-5 h-5 text-[#7b57ff]" />
                  <span>Create Enterprise Bulk Cargo Procurement Specification</span>
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  SAIL Maritime Chartering • Cargo Specifications, Port Guarantees & Commercial Incoterms
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-300 hover:text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Bar Navigation */}
            <div className="flex border-b border-[#0F1B2E]/10 bg-[#FAFAF8] px-6 pt-3 space-x-4 font-mono text-xs">
              <button
                type="button"
                onClick={() => setModalTab('CARGO')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  modalTab === 'CARGO' ? 'border-[#7b57ff] text-[#7b57ff]' : 'border-transparent text-[#3E5871] hover:text-[#0F1B2E]'
                }`}
              >
                1. Cargo & Quality Specs
              </button>
              <button
                type="button"
                onClick={() => setModalTab('OPERATIONS')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  modalTab === 'OPERATIONS' ? 'border-[#7b57ff] text-[#7b57ff]' : 'border-transparent text-[#3E5871] hover:text-[#0F1B2E]'
                }`}
              >
                2. Port & Laycan Operations
              </button>
              <button
                type="button"
                onClick={() => setModalTab('COMMERCIAL')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  modalTab === 'COMMERCIAL' ? 'border-[#7b57ff] text-[#7b57ff]' : 'border-transparent text-[#3E5871] hover:text-[#0F1B2E]'
                }`}
              >
                3. Financial & IMO ESG Controls
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 text-xs font-sans max-h-[70vh] overflow-y-auto">
              {/* TAB 1: CARGO & QUALITY SPECIFICATIONS */}
              {modalTab === 'CARGO' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-[#0F1B2E] font-bold mb-1">Bulk Cargo Commodity Specification</label>
                    <select
                      value={commodity}
                      onChange={(e) => setCommodity(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0F1B2E] font-semibold focus:outline-none focus:border-[#7b57ff] font-sans"
                    >
                      <option value="Australian Blast Furnace Coking Coal">Australian Blast Furnace Coking Coal (Prime Hard)</option>
                      <option value="Odisha Iron Ore Fines (+62% Fe Grade)">Odisha Iron Ore Fines (+62% Fe Grade)</option>
                      <option value="South African High-CV Thermal Coal">South African High-CV Thermal Coal (RB1 Grade)</option>
                      <option value="Indonesian Low-Ash Steam Coal">Indonesian Low-Ash Steam Coal (GAR 5000)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#0F1B2E] font-bold mb-1">Total Cargo Quantity (Metric Tons)</label>
                      <input
                        type="number"
                        required
                        value={quantityMt}
                        onChange={(e) => setQuantityMt(e.target.value)}
                        placeholder="180000"
                        className="w-full bg-[#FAFAF8] border border-slate-200 rounded-xl px-3.5 py-2 text-[#0F1B2E] focus:outline-none focus:border-[#7b57ff] font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0F1B2E] font-bold mb-1">Target Freight Rate Ceiling ($/MT USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={targetFreightCeilingUsd}
                        onChange={(e) => setTargetFreightCeilingUsd(e.target.value)}
                        placeholder="28.50"
                        className="w-full bg-[#FAFAF8] border border-slate-200 rounded-xl px-3.5 py-2 text-[#7b57ff] focus:outline-none focus:border-[#7b57ff] font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 flex items-center justify-between border-t border-[#0F1B2E]/10 font-mono">
                <div className="text-[11px] text-[#3E5871]">
                  Step {modalTab === 'CARGO' ? '1' : modalTab === 'OPERATIONS' ? '2' : '3'} of 3
                </div>

                <div className="flex items-center space-x-2 font-sans">
                  {modalTab !== 'CARGO' && (
                    <button
                      type="button"
                      onClick={() => setModalTab(modalTab === 'COMMERCIAL' ? 'OPERATIONS' : 'CARGO')}
                      className="decline-button-theme text-xs font-bold px-4 py-2"
                    >
                      Back
                    </button>
                  )}

                  {modalTab !== 'COMMERCIAL' ? (
                    <button
                      type="button"
                      onClick={() => setModalTab(modalTab === 'CARGO' ? 'OPERATIONS' : 'COMMERCIAL')}
                      className="accept-button-theme text-xs font-bold shadow-card-soft px-5 py-2"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="accept-button-theme text-xs font-bold shadow-card-soft disabled:opacity-50 px-6 py-2"
                    >
                      {submitting ? 'Creating Specification...' : 'Submit Enterprise Plan ✓'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
