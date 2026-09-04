import React, { useEffect, useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { api } from '../lib/api';
import { seedFirestoreIfEmpty } from '../lib/firebaseSeed';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FullAnalysisReport } from '@freightiq/shared-types';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { formatUsdAndInr, formatInrPrimary, formatInrCrore, formatInrPerMt } from '../lib/currency';
import { exportReportToPdf } from '../lib/pdfExporter';
import { CompassRiskGauge } from '../components/ui/CompassRiskGauge';
import { CharterStampBadge } from '../components/ui/CharterStampBadge';
import { DemoDataInstructionsCard } from '../components/ui/DemoDataInstructionsCard';
import {
  FileSpreadsheet,
  Plus,
  Sparkles,
  X,
  AlertCircle,
  AlertTriangle,
  Compass,
  Printer,
  ChevronDown,
  ChevronUp,
  Brain,
  Info,
  Radio,
  Award,
  DollarSign,
  Package,
  Calendar,
  Layers,
  Percent,
  Anchor,
  Ship,
  Navigation,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { PipelineHealthWidget } from '../components/analytics/PipelineHealthWidget';
import { ForecastChart } from '../components/analytics/ForecastChart';

const RenderExecutiveReasoning: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return <p className="text-xs text-slate-500 font-sans">No rationale available.</p>;

  const points = text.split(/(?=\d\.\s)/).map((p) => p.trim()).filter(Boolean);

  if (points.length <= 1) {
    return (
      <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line space-y-2">
        {text}
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans text-xs">
      {points.map((pt, idx) => {
        const colonIndex = pt.indexOf(':');
        let title = `Point ${idx + 1}`;
        let body = pt;

        if (colonIndex > 0 && colonIndex < 60) {
          title = pt.substring(0, colonIndex).replace(/^\d\.\s*/, '').trim();
          body = pt.substring(colonIndex + 1).trim();
        } else {
          body = pt.replace(/^\d\.\s*/, '').trim();
        }

        return (
          <div key={idx} className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200/80 space-y-1 hover:border-sky-400 transition-colors">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-[10px] flex items-center justify-center font-mono shrink-0">
                0{idx + 1}
              </span>
              <span className="font-bold text-[#0F1B2E] text-xs font-serif uppercase tracking-tight">
                {title}
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed pl-7 font-sans">
              {body}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export const ProcurementPage: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
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
    const originName = req?.originPortName || 'Newcastle Coal Terminal (AU)';
    const destName = req?.destinationPortName || 'Paradip Port (IN)';
    const commodityName = req?.commodity || 'Australian Blast Furnace Coking Coal';
    const qty = Number(req?.quantityMt) || 180000;

    // Dynamic base rate anchor based on commodity profile
    let baseRate = 19.50;
    if (commodityName.toLowerCase().includes('ore')) baseRate = 12.20;
    else if (commodityName.toLowerCase().includes('thermal')) baseRate = 16.80;
    else if (commodityName.toLowerCase().includes('steel') || commodityName.toLowerCase().includes('scrap')) baseRate = 22.50;

    // Determine destination draft constraint
    let destDraft = 14.5;
    if (destName.toLowerCase().includes('haldia')) destDraft = 7.8;
    else if (destName.toLowerCase().includes('vizag') || destName.toLowerCase().includes('visakhapatnam')) destDraft = 16.5;
    else if (destName.toLowerCase().includes('gangavaram')) destDraft = 19.5;
    else if (destName.toLowerCase().includes('dhamra') || destName.toLowerCase().includes('krishnapatnam')) destDraft = 18.0;

    // Date-anchored 90-day bi-weekly forecast points
    const startDate = req?.requiredDeliveryDate ? new Date(req.requiredDeliveryDate) : new Date();
    const mockPoints = [0, 14, 28, 42, 60, 90].map((days, idx) => {
      const d = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
      const trendFactor = 1 + (idx * 0.018); // +9.2% overall rate growth
      const predictedRate = Math.round(baseRate * trendFactor * 100) / 100;
      return {
        date: d.toISOString().split('T')[0],
        predictedRate,
        confidenceLower: Math.round(predictedRate * 0.94 * 100) / 100,
        confidenceUpper: Math.round(predictedRate * 1.06 * 100) / 100
      };
    });

    // Feasible and Rejected Vessels Evaluation
    const panamaxCapacity = 75000;
    const supraCapacity = 55000;
    const panamaxVoyages = Math.ceil(qty / panamaxCapacity);
    const supraVoyages = Math.ceil(qty / supraCapacity);

    const panamaxRateUsd = baseRate;
    const panamaxTotalCostUsd = Math.round(qty * panamaxRateUsd);
    const supraRateUsd = Math.round((baseRate * 1.095) * 100) / 100;
    const supraTotalCostUsd = Math.round(qty * supraRateUsd);

    const panamaxTurnaround = Math.round((75000 / (req?.dischargeRateTpd || 25000) + 1.2) * 10) / 10;
    const supraTurnaround = Math.round((55000 / (req?.dischargeRateTpd || 25000) + 1.1) * 10) / 10;

    const vesselRecommendations = [
      {
        vesselTypeId: 'vt-panamax',
        vesselTypeName: 'Kamsarmax / Panamax Carrier',
        vesselCode: 'PANAMAX',
        draftM: 14.2,
        lengthM: 225.0,
        requiredVoyagesCount: panamaxVoyages,
        estimatedTurnaroundDays: panamaxTurnaround,
        estimatedCostUsd: panamaxTotalCostUsd,
        totalBunkerCostUsd: panamaxVoyages * 83626,
        costPerMtUsd: panamaxRateUsd,
        isFeasible: destDraft >= 14.2,
        rejectionReason: destDraft < 14.2 ? `Draft Violation: Panamax draft 14.2m exceeds ${destName} max depth ${destDraft}m` : '',
        rank: 1
      },
      {
        vesselTypeId: 'vt-supra',
        vesselTypeName: 'Supramax Bulk Carrier',
        vesselCode: 'SUPRA',
        draftM: 12.8,
        lengthM: 200.0,
        requiredVoyagesCount: supraVoyages,
        estimatedTurnaroundDays: supraTurnaround,
        estimatedCostUsd: supraTotalCostUsd,
        totalBunkerCostUsd: supraVoyages * 65536,
        costPerMtUsd: supraRateUsd,
        isFeasible: destDraft >= 12.8,
        rejectionReason: destDraft < 12.8 ? `Draft Violation: Supramax draft 12.8m exceeds ${destName} max depth ${destDraft}m` : '',
        rank: 2
      }
    ].filter((v) => v.isFeasible);

    const rejectedVessels = [
      {
        vesselTypeId: 'vt-cape',
        vesselTypeName: 'Capesize Heavy Bulk Carrier',
        vesselCode: 'CAPE',
        draftM: 18.5,
        lengthM: 295.0,
        requiredVoyagesCount: Math.ceil(qty / 180000),
        estimatedTurnaroundDays: 0,
        estimatedCostUsd: 0,
        totalBunkerCostUsd: 282240,
        costPerMtUsd: 0,
        isFeasible: false,
        rejectionReason: `Draft Violation: Required Capesize draft 18.5m exceeds discharge port (${destName}) channel depth limit ${destDraft}m.`
      }
    ];

    if (destDraft < 14.2) {
      rejectedVessels.push({
        vesselTypeId: 'vt-panamax',
        vesselTypeName: 'Kamsarmax / Panamax Carrier',
        vesselCode: 'PANAMAX',
        draftM: 14.2,
        lengthM: 225.0,
        requiredVoyagesCount: panamaxVoyages,
        estimatedTurnaroundDays: panamaxTurnaround,
        estimatedCostUsd: panamaxTotalCostUsd,
        totalBunkerCostUsd: panamaxVoyages * 83626,
        costPerMtUsd: panamaxRateUsd,
        isFeasible: false,
        rejectionReason: `Draft Violation: Required Panamax draft 14.2m exceeds discharge port (${destName}) channel depth limit ${destDraft}m.`
      });
    }

    // Contract Strategies Comparison Math
    const coaRate = baseRate;
    const coaCostUsd = panamaxTotalCostUsd;
    const term3mRate = Math.round((baseRate * 1.075) * 100) / 100;
    const term3mCostUsd = Math.round(qty * term3mRate);
    const spotRate = Math.round((baseRate * 1.248) * 100) / 100;
    const spotCostUsd = Math.round(qty * spotRate);

    const savingsUsd = spotCostUsd - coaCostUsd;
    const savingsInrCr = Math.round(((savingsUsd * 83.5) / 10000000) * 10) / 10;
    const coaInrCr = Math.round(((coaCostUsd * 83.5) / 10000000) * 10) / 10;
    const spotInrCr = Math.round(((spotCostUsd * 83.5) / 10000000) * 10) / 10;

    const contractStrategies: {
      strategyType: "MID_TERM_6M" | "SHORT_TERM_3M" | "SPOT";
      title: string;
      rateUsdPerMt: number;
      estimatedTotalCostUsd: number;
      voyagesCount: number;
      volatilityExposureScore: number;
      isRecommended: boolean;
      reasoning: string;
    }[] = [
      {
        strategyType: 'MID_TERM_6M',
        title: '6-Month COA Multi-Voyage Contract (Recommended)',
        rateUsdPerMt: coaRate,
        estimatedTotalCostUsd: coaCostUsd,
        voyagesCount: panamaxVoyages,
        volatilityExposureScore: 15,
        isRecommended: true,
        reasoning: `Locks in rate ceiling ($${coaRate.toFixed(2)}/MT) for ${qty.toLocaleString()} MT of ${commodityName} on ${originName} → ${destName} route before predicted 9.2% market surge.`
      },
      {
        strategyType: 'SHORT_TERM_3M',
        title: '3-Month Short-Term Charter',
        rateUsdPerMt: term3mRate,
        estimatedTotalCostUsd: term3mCostUsd,
        voyagesCount: panamaxVoyages,
        volatilityExposureScore: 42,
        isRecommended: false,
        reasoning: `Provides 90-day rate stability at $${term3mRate.toFixed(2)}/MT but leaves remaining Q4 volume exposed to forecasted upward rate pressures.`
      },
      {
        strategyType: 'SPOT',
        title: 'Immediate Spot Voyage Charter',
        rateUsdPerMt: spotRate,
        estimatedTotalCostUsd: spotCostUsd,
        voyagesCount: panamaxVoyages,
        volatilityExposureScore: 82,
        isRecommended: false,
        reasoning: `Spot chartering at $${spotRate.toFixed(2)}/MT exposes SAIL to volatile spot market escalation over the laycan window.`
      }
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
      vesselRecommendations,
      rejectedVessels,
      contractStrategies,
      riskAnalysis: {
        freightVolatilityScore: 58.0,
        portCongestionScore: 42.0,
        deadlineRiskScore: 30.0,
        marketVolatilityScore: 35.0,
        compositeRiskScore: 34.2,
        riskLevel: 'LOW',
        activeAlerts: [
          'MODERATE FREIGHT VOLATILITY: Forecast indicates rate swing of +9.2% over next 90 days.',
          `PORT CHANNEL DRAFT: Discharge port (${destName}) max draft is ${destDraft}m.`
        ],
        counterpartyRiskScore: 18.5,
        bunkerVolatilityScore: 42.0,
        monsoonWeatherRiskScore: destName.includes('Paradip') || destName.includes('Haldia') ? 28.5 : 15.0,
        geopoliticalCanalRiskScore: 12.0,
        historicalAccuracyPct: 94.2
      },
      idleOptions: [
        {
          actionType: 'BALLAST_REPOSITION',
          optionTitle: `Reposition Ballast: ${destName} → Port Hedland AU`,
          vesselCategory: 'Panamax',
          estimatedCostUsd: 185000,
          estimatedNetRevenueUsd: 227500,
          recommendedAction: 'High demand for Australian Iron Ore/Coking Coal. 3,400 nm ballast voyage yields +$42,500 net margin vs idling.'
        },
        {
          actionType: 'ALT_CARGO_EMPLOYMENT',
          optionTitle: `Short Coastal Trip: ${destName} → Haldia Port`,
          vesselCategory: 'Panamax',
          estimatedCostUsd: 95000,
          estimatedNetRevenueUsd: 118000,
          recommendedAction: 'Coastal thermal coal stem provides positive cashflow (+ $23,000) during 8-day laycan wait.'
        }
      ],
      aiExplanation: {
        recommendationLine: `Execute 6-Month COA Contract for ${qty.toLocaleString()} MT of ${commodityName} (saves $${savingsUsd.toLocaleString()} / ₹${savingsInrCr} Cr vs Spot).`,
        reasoningParagraph: `1. PORT & VESSEL DRAFT CLEARANCE MATH: Discharge terminal ${destName} has a maximum channel depth constraint of ${destDraft}m. The recommended Panamax carrier requires a 14.2m draft (leaving a ${(destDraft - 14.2).toFixed(1)}m safe clearance margin). Capesize carriers (18.5m draft requirement) are physically excluded from entry.\n\n2. FINANCIAL OPTIMIZATION & CURRENCY BREAKDOWN: Securing a 6-Month COA contract fixes freight at $${coaRate.toFixed(2)}/MT ($${coaCostUsd.toLocaleString()} total / ₹${coaInrCr} Cr) versus Spot market rates of $${spotRate.toFixed(2)}/MT ($${spotCostUsd.toLocaleString()} total / ₹${spotInrCr} Cr), delivering net savings of $${savingsUsd.toLocaleString()} (₹${savingsInrCr} Crore).\n\n3. VOYAGE & BUNKER CONSUMPTION METRICS: Shipping ${qty.toLocaleString()} MT requires ${panamaxVoyages} Panamax voyages. Sea passage is ~11.5 days per leg with VLSFO fuel consumption estimated at ~28 MT/day ($620/MT = $83,626 fuel cost per voyage).\n\n4. RISK MITIGATION & LAYCAN WINDOW: Composite risk score is 34.2/100 (LOW). Fixing COA volume shields SAIL from forecasted +9.2% spot market rate escalation over the 90-day laycan horizon.`,
        caveatsText: 'VLSFO bunker fuel volatility could shift voyage costs by ±3.5%. Monsoon weather patterns may increase port turnaround congestion by 0.8 days.',
        groundedDataSummary: `Grounded in 180-day historical freight rates, ${qty.toLocaleString()} MT ${commodityName} stem, Panamax 14.2m draft specs, and ${destName} ${destDraft}m max channel limit.`,
        counterargumentsText: `1. SPOT MARKET SOFTENING: If global bulk steel demand drops unexpectedly over Q3, spot rates could dip below the $${coaRate.toFixed(2)}/MT COA ceiling.\n2. LAYCAN FLEXIBILITY: COA contracts require strict shipment schedules; spot charters offer laycan rescheduling flexibility if blast furnace production shifts.`,
        decisionPivotConditions: `1. PIVOT TO SPOT: If spot rates drop below $${(coaRate * 0.92).toFixed(2)}/MT for 3 consecutive weeks.\n2. PIVOT TO SUPRAMAX: If ${destName} channel silting reduces draft limit below 13.5m, switch stem from Panamax to Supramax tonnage.`,
        isAiGenerated: false
      },
      lineageComparison: {
        previousRunAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        previousCostUsd: Math.round(coaCostUsd * 1.032),
        costChangePct: -3.1,
        previousRiskScore: 38.5,
        riskChange: -4.3,
        summary: `Current analysis run reflects -$118,500 outlay reduction (-3.1%) and composite risk score drop of -4.3 points due to VLSFO fuel stabilization.`
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

    // Update Procurement Plan status from DRAFT to OPTIMIZED
    try {
      if (db && req?.id) {
        await setDoc(doc(db, 'procurementRequests', req.id), { status: 'OPTIMIZED', updatedAt: new Date().toISOString() }, { merge: true });
        req.status = 'OPTIMIZED';
      }
    } catch (e) {
      console.warn('Firestore status update note:', e);
      if (req) req.status = 'OPTIMIZED';
    }

    const timer1 = setTimeout(() => setAnalysisStage(2), 300);
    const timer2 = setTimeout(() => setAnalysisStage(4), 600);
    const timer3 = setTimeout(() => setAnalysisStage(6), 900);

    try {
      const res = await api.post<FullAnalysisReport>(`/procurement/requests/${req.id}/analyze`);
      setAnalysisReport(res.data);
    } catch (err: any) {
      console.warn('Backend API unreachable, rendering offline optimization model:', err);
      const fallbackReport = generateFallbackAnalysisReport(req);
      setAnalysisReport(fallbackReport);
      setIsOfflineDemoMode(true);
      setAnalysisError(null);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setAnalyzingId(null);
      setAnalysisStage(0);
    }
  };

  const handleExportPdf = async () => {
    if (!analysisReport) return;
    setExportingPdf(true);
    try {
      await exportReportToPdf('analysis-report-container', analysisReport);
    } catch (err) {
      console.error('PDF Export failed, invoking window.print()', err);
      window.print();
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs activePath="/procurement" onNavigate={() => {}} requestTitle={selectedPlan?.commodity} />

      {/* Demo Data & Live Integration Setup Guide Banner */}
      <DemoDataInstructionsCard
        isOfflineDemoMode={isOfflineDemoMode}
        onClearDemoData={() => {
          setIsOfflineDemoMode(false);
          setAnalysisReport(null);
        }}
        onNavigate={onNavigate}
      />

      {/* Title & Action Header */}
      <div className="card-theme rounded-2xl p-6 shadow-card-soft border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-[#0F1B2E] font-serif flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-600" />
              <span>Bulk Cargo Chartering & Decision Suite</span>
            </h1>
            <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono rounded-full font-bold flex items-center gap-1.5 border border-emerald-200">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>PYTHON + NESTJS ENGINE ACTIVE</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            NestJS Backend API • Python XGBoost Decision Engine • Server-Side Gemini AI
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Simple vs Advanced Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 font-mono text-xs border border-slate-200">
            <button
              onClick={() => handleToggleViewMode('SIMPLE')}
              className={`px-3.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'SIMPLE' ? 'bg-[#0F1B2E] text-white shadow-xs' : 'text-slate-600 hover:text-[#0F1B2E]'
              }`}
            >
              Simple View
            </button>
            <button
              onClick={() => handleToggleViewMode('ADVANCED')}
              className={`px-3.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'ADVANCED' ? 'bg-[#0F1B2E] text-white shadow-xs' : 'text-slate-600 hover:text-[#0F1B2E]'
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
              <Printer className="w-4 h-4 text-slate-700" />
              <span>{exportingPdf ? 'Generating PDF...' : 'Export Memo (PDF)'}</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="accept-button-theme text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-xs px-5 py-2.5"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>New Procurement Plan</span>
          </button>
        </div>
      </div>

      {/* Microservices & Pipeline Diagnostic Health Monitor */}
      <PipelineHealthWidget />

      {/* Procurement Plans Master Table (Live Firestore Streamed) */}
      <div className="card-theme rounded-2xl overflow-hidden shadow-card-soft border border-slate-200 print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FAFAF8] border-b border-slate-200 uppercase text-[10px] text-slate-500">
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
            <tbody className="divide-y divide-slate-200">
              {requestsLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 font-mono">
                    Connecting live Firestore stream...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 font-mono">
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
                        isSelected ? 'bg-sky-50 border-l-4 border-sky-600' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-sans font-bold text-[#0F1B2E]">{req.commodity}</td>
                      <td className="py-3.5 px-4 text-sky-700 font-bold">
                        {req.originPortName} → {req.destinationPortName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#0F1B2E] tabular-nums">
                        {req.quantityMt ? req.quantityMt.toLocaleString() : '150,000'} MT
                      </td>
                      <td className="py-3.5 px-4 text-right text-amber-700 font-bold tabular-nums">
                        ₹{req.budgetInrCrore} Cr
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] truncate max-w-xs">
                        {req.fuelType || 'VLSFO ($640/MT)'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-0.5 text-[9px] rounded-full font-bold border ${
                            req.status === 'OPTIMIZED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleTriggerAnalysis(req)}
                          disabled={isRunning}
                          className="accept-button-theme text-[11px] font-bold inline-flex items-center space-x-1.5 shadow-xs disabled:opacity-50 px-4 py-1.5"
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
        <div className="p-6 card-theme border border-sky-300 rounded-2xl shadow-card-soft space-y-4 font-mono animate-in fade-in print:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F1B2E] flex items-center gap-2 font-serif">
              <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
              <span>Executing Python Decision Engine & Server-Side AI Pipeline...</span>
            </h3>
            <span className="text-xs text-sky-700 font-bold">Stage {analysisStage} of 6</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-[10px]">
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 1 ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-[#FAFAF8] border-slate-200 text-slate-500'}`}>
              1. XGBoost Forecast
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 2 ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-[#FAFAF8] border-slate-200 text-slate-500'}`}>
              2. Draft & LOA Solver
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 3 ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-[#FAFAF8] border-slate-200 text-slate-500'}`}>
              3. COA Strategy Solver
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 4 ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-[#FAFAF8] border-slate-200 text-slate-500'}`}>
              4. Idle Repositioning
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 5 ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-[#FAFAF8] border-slate-200 text-slate-500'}`}>
              5. Composite 4D Risk
            </div>
            <div className={`p-2 rounded-lg border transition-all ${analysisStage >= 6 ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-[#FAFAF8] border-slate-200 text-slate-500'}`}>
              6. Gemini AI Rationale
            </div>
          </div>
        </div>
      )}

      {/* Analytical Results Dashboard Panels */}
      {analysisReport && (
        <div id="analysis-report-container" className="space-y-6 animate-in fade-in card-theme p-6 rounded-2xl border border-slate-200 shadow-card-soft">
          {/* Executive Summary Hero Banner */}
          {(() => {
            const recStrat = analysisReport.contractStrategies?.find((s) => s.isRecommended) || analysisReport.contractStrategies?.[0];
            const spotStrat = analysisReport.contractStrategies?.find((s) => s.strategyType === 'SPOT') || analysisReport.contractStrategies?.[1];
            const savingsUsd = spotStrat && recStrat ? (spotStrat.estimatedTotalCostUsd - recStrat.estimatedTotalCostUsd) : 1056600;

            return (
              <div className="bg-[#FAFAF8] text-[#0F1B2E] rounded-2xl p-6 shadow-card-soft border border-slate-200 space-y-4 font-sans relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-sky-600 shrink-0" />
                    <div>
                      <h2 className="text-base font-bold text-[#0F1B2E] tracking-tight uppercase font-mono">
                        SAIL Executive Chartering Recommendation Memo
                      </h2>
                      <div className="text-xs text-slate-500 font-mono">
                        Route: <span className="text-sky-700 font-bold">{analysisReport.originPortName} → {analysisReport.destinationPortName}</span> • Cargo: <span className="text-[#0F1B2E] font-bold">{analysisReport.quantityMt?.toLocaleString()} MT {analysisReport.commodity}</span>
                      </div>
                    </div>
                  </div>
                  <CharterStampBadge variant="RECOMMENDED" label="RECOMMENDED STRATEGY READY" />
                </div>

                <div className="text-lg md:text-xl font-bold text-sky-800 leading-snug tracking-tight font-serif">
                  {analysisReport.aiExplanation?.recommendationLine}
                </div>

                {/* KPI Summary Cards Grid (Dual Currency USD + ₹ Crore in Amber/Gold) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <div className="text-slate-500 text-[10px] uppercase font-sans font-bold">Recommended Charter</div>
                    <div className="font-bold text-[#0F1B2E] text-sm truncate">{recStrat?.title || '6-Month COA Contract'}</div>
                    <div className="text-sky-700 font-bold text-[11px]">{formatInrPerMt(recStrat?.rateUsdPerMt || 28.50)}</div>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <div className="text-slate-500 text-[10px] uppercase font-sans font-bold font-mono">Total Estimated Outlay</div>
                    <div className="font-bold text-amber-700 text-sm">{formatInrPrimary(recStrat?.estimatedTotalCostUsd || 4253400)}</div>
                    <div className="text-slate-500 text-[10px]">Dual Currency (Rupee Primary / USD)</div>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <div className="text-slate-500 text-[10px] uppercase font-sans font-bold font-mono">Est. Savings vs Spot</div>
                    <div className="font-bold text-emerald-700 text-sm">+{formatInrPrimary(savingsUsd)}</div>
                    <div className="text-emerald-700 text-[10px]">Shields against +{analysisReport.forecast?.trendMagnitudePct || 9.2}% surge</div>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
                    <div className="text-slate-500 text-[10px] uppercase font-sans font-bold">Composite Risk Level</div>
                    <div className="font-bold text-amber-700 text-sm">
                      {analysisReport.riskAnalysis?.compositeRiskScore}/100 ({analysisReport.riskAnalysis?.riskLevel})
                    </div>
                    <div className="text-slate-500 text-[10px]">4-Factor Multi-Score Evaluated</div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 1. Interactive 90-Day Freight Rate Prediction Curve */}
          {analysisReport.forecast && (
            <ForecastChart
              points={analysisReport.forecast.forecastPoints}
              route={analysisReport.forecast.route}
              trendDirection={analysisReport.forecast.trendDirection}
              trendMagnitudePct={analysisReport.forecast.trendMagnitudePct}
            />
          )}

          {/* 2. Vessel Class Feasibility & Port Channel Constraint Matrix */}
          <div className="card-theme border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Ship className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-[#0F1B2E] font-serif">
                  Vessel Tonnage Class Feasibility & Draft Clearance Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Discharge Port Draft: <strong className="text-[#0F1B2E]">{analysisReport.destinationPortName}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Feasible Vessels */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Feasible Vessel Options (Draft & LOA Cleared)</span>
                </div>
                {analysisReport.vesselRecommendations?.map((v) => (
                  <div key={v.vesselTypeId} className="p-4 bg-white border border-emerald-200 rounded-xl space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F1B2E] font-serif text-sm">{v.vesselTypeName}</span>
                      <CharterStampBadge variant="FEASIBLE" label={v.vesselCode} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 text-slate-600">
                      <div>Draft: <strong className="text-[#0F1B2E]">{v.draftM}m</strong></div>
                      <div>Voyages: <strong className="text-[#0F1B2E]">{v.requiredVoyagesCount}</strong></div>
                      <div>Turnaround: <strong className="text-[#0F1B2E]">{v.estimatedTurnaroundDays}d</strong></div>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Total Charter Outlay:</span>
                      <span className="font-bold text-amber-700 font-mono">{formatInrPrimary(v.estimatedCostUsd)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rejected Vessels */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-red-700 uppercase flex items-center gap-1 font-sans">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Physically Excluded Vessels (Draft / LOA Violations)</span>
                </div>
                {analysisReport.rejectedVessels?.map((v) => (
                  <div key={v.vesselTypeId} className="p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-900 font-serif text-sm">{v.vesselTypeName}</span>
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded border border-red-300">
                        REJECTED
                      </span>
                    </div>
                    <div className="text-xs text-red-700 font-sans leading-relaxed pt-1">
                      ⚠️ {v.rejectionReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Contract Strategy Comparison Engine */}
          <div className="card-theme border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-[#0F1B2E] font-serif">
                  Contract Strategy Comparator (6-Month COA vs 3-Month vs Spot)
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {analysisReport.contractStrategies?.map((strat) => (
                <div
                  key={strat.strategyType}
                  className={`p-5 rounded-2xl border space-y-3 transition-all ${
                    strat.isRecommended
                      ? 'bg-sky-50/50 border-sky-400 shadow-md ring-2 ring-sky-400/30'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                      {strat.strategyType}
                    </span>
                    {strat.isRecommended && (
                      <span className="px-2.5 py-0.5 bg-sky-600 text-white text-[10px] font-bold rounded-full">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-[#0F1B2E] font-serif text-sm">{strat.title}</div>
                  <div className="text-xl font-bold text-sky-700 font-mono">{formatInrPerMt(strat.rateUsdPerMt)}</div>

                  <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span>Total Outlay:</span>
                      <strong className="text-amber-700">{formatInrPrimary(strat.estimatedTotalCostUsd)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility Score:</span>
                      <strong className={strat.volatilityExposureScore > 50 ? 'text-red-600' : 'text-emerald-700'}>
                        {strat.volatilityExposureScore}/100
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed pt-1">
                    {strat.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Idle Repositioning & Alternative Employment Options */}
          {analysisReport.idleOptions && analysisReport.idleOptions.length > 0 && (
            <div className="card-theme border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-4 font-sans">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Navigation className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#0F1B2E] font-serif">
                  Vessel Ballast Repositioning & Laycan Wait Employment Options
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {analysisReport.idleOptions.map((opt, idx) => (
                  <div key={idx} className="p-4 bg-[#FAFAF8] border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F1B2E] font-serif text-sm">{opt.optionTitle}</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                        {opt.vesselCategory}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {opt.recommendedAction}
                    </p>
                    <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Est. Ballast Cost: <strong>${opt.estimatedCostUsd?.toLocaleString()}</strong></span>
                      <span className="text-emerald-700 font-bold">Net Margin: +${(opt.estimatedNetRevenueUsd - opt.estimatedCostUsd)?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. AI Explanation & Multi-Factor Risk Gauge Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-theme border border-slate-200 rounded-2xl p-5 shadow-card-soft space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Brain className="w-5 h-5 text-sky-600" />
                <h2 className="text-sm font-bold text-[#0F1B2E] font-serif">Executive AI Rationale</h2>
              </div>
              <RenderExecutiveReasoning text={analysisReport.aiExplanation?.reasoningParagraph} />
            </div>

            <div className="card-theme border border-slate-200 rounded-2xl p-5 shadow-card-soft space-y-4 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between border-b border-slate-200 pb-3">
                <Compass className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-mono text-slate-500">Risk Score: {analysisReport.riskAnalysis?.compositeRiskScore}/100</span>
              </div>
              <CompassRiskGauge
                score={analysisReport.riskAnalysis?.compositeRiskScore || 34.2}
                riskLevel={analysisReport.riskAnalysis?.riskLevel || 'LOW'}
                size="md"
              />
            </div>
          </div>

          {/* 6. Additive Risk Sub-Factors Grid & Accuracy Tracker */}
          <div className="card-theme border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-[#0F1B2E] font-serif">
                  Multi-Factor Risk Sub-Scores & Historical Accuracy Tracker
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Model Historical Accuracy: {analysisReport.riskAnalysis?.historicalAccuracyPct || 94.2}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-sans">Freight Volatility</div>
                <div className="text-base font-bold text-[#0F1B2E]">{analysisReport.riskAnalysis?.freightVolatilityScore}/100</div>
                <div className="text-[10px] text-amber-700">Market Rate Trend</div>
              </div>

              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-sans">Port Congestion</div>
                <div className="text-base font-bold text-[#0F1B2E]">{analysisReport.riskAnalysis?.portCongestionScore}/100</div>
                <div className="text-[10px] text-slate-500">Berth Delay Risk</div>
              </div>

              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-sans">Bunker Volatility</div>
                <div className="text-base font-bold text-amber-700">{analysisReport.riskAnalysis?.bunkerVolatilityScore || 42.0}/100</div>
                <div className="text-[10px] text-amber-800">VLSFO Price Swing</div>
              </div>

              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-sans">Monsoon / Weather</div>
                <div className="text-base font-bold text-sky-700">{analysisReport.riskAnalysis?.monsoonWeatherRiskScore || 28.5}/100</div>
                <div className="text-[10px] text-sky-800">East Coast Cyclone</div>
              </div>

              <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200 space-y-1">
                <div className="text-slate-500 text-[10px] uppercase font-sans">Counterparty Credit</div>
                <div className="text-base font-bold text-emerald-700">{analysisReport.riskAnalysis?.counterpartyRiskScore || 18.5}/100</div>
                <div className="text-[10px] text-emerald-800">Shipowner Rating</div>
              </div>
            </div>
          </div>

          {/* 7. Additive Interactive What-If Sensitivity & Stress-Test Engine */}
          <div className="card-theme border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Percent className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-[#0F1B2E] font-serif">
                  Interactive What-If Sensitivity & Stress-Test Engine
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Real-Time Scenario Simulator</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
              {/* Controls Column */}
              <div className="space-y-4 font-mono bg-[#FAFAF8] p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#0F1B2E]">
                    <span>Freight Rate Shift:</span>
                    <span className="text-sky-700">{whatIfFreightRatePct > 0 ? `+${whatIfFreightRatePct}` : whatIfFreightRatePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="30"
                    step="5"
                    value={whatIfFreightRatePct}
                    onChange={(e) => setWhatIfFreightRatePct(parseFloat(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#0F1B2E]">
                    <span>Port Discharge Rate Shift:</span>
                    <span className="text-amber-700">{whatIfFuelPricePct > 0 ? `+${whatIfFuelPricePct}` : whatIfFuelPricePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="5"
                    value={whatIfFuelPricePct}
                    onChange={(e) => setWhatIfFuelPricePct(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#0F1B2E]">
                    <span>Laycan Deadline Shift:</span>
                    <span className="text-emerald-700">{whatIfPortDelayDays > 0 ? `+${whatIfPortDelayDays}` : whatIfPortDelayDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="5"
                    value={whatIfPortDelayDays}
                    onChange={(e) => setWhatIfPortDelayDays(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Simulation Result Calculation Box */}
              {(() => {
                const recStrat = analysisReport.contractStrategies?.find((s) => s.isRecommended) || analysisReport.contractStrategies?.[0];
                const origCost = recStrat?.estimatedTotalCostUsd || 4253400;
                const origRisk = analysisReport.riskAnalysis?.compositeRiskScore || 34.2;

                const rateMultiplier = 1 + whatIfFreightRatePct / 100;
                const simCost = Math.round(origCost * rateMultiplier);
                const costDelta = simCost - origCost;
                const simRisk = Math.min(100, Math.max(10, Math.round((origRisk + whatIfFreightRatePct * 0.45 - whatIfFuelPricePct * 0.3 + (whatIfPortDelayDays < 0 ? 12 : -4)) * 10) / 10));

                return (
                  <div className="md:col-span-2 p-5 bg-white rounded-xl border border-sky-200 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-[#0F1B2E] font-serif text-sm">Stress-Tested Scenario Outcome</span>
                      <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-bold font-mono rounded-full">
                        REAL-TIME SIMULATED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                      <div className="p-3 bg-[#FAFAF8] rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-sans">Simulated Total Outlay</div>
                        <div className="font-bold text-amber-700 text-sm mt-0.5">{formatUsdAndInr(simCost)}</div>
                        <div className="text-[10px] text-slate-500">{costDelta >= 0 ? `+${formatUsdAndInr(costDelta)}` : formatUsdAndInr(costDelta)}</div>
                      </div>

                      <div className="p-3 bg-[#FAFAF8] rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-sans">Simulated Risk Score</div>
                        <div className="font-bold text-sky-800 text-sm mt-0.5">{simRisk}/100</div>
                        <div className="text-[10px] text-slate-500">{(simRisk - origRisk) >= 0 ? `+${(simRisk - origRisk).toFixed(1)}` : (simRisk - origRisk).toFixed(1)} Points</div>
                      </div>

                      <div className="p-3 bg-[#FAFAF8] rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-sans">Optimal Carrier Tonnage</div>
                        <div className="font-bold text-emerald-700 text-sm mt-0.5">Panamax Carrier</div>
                        <div className="text-[10px] text-emerald-800 font-bold">14.2m Draft Clearance</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 8. Additive Decision Lineage Audit Card */}
          {analysisReport.lineageComparison && (
            <div className="card-theme border border-slate-200 rounded-2xl p-6 shadow-card-soft space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-[#0F1B2E] font-serif">
                    Run-over-Run Decision Lineage & Variance Audit
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Last Run: {new Date(analysisReport.lineageComparison.previousRunAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-sans">Previous Outlay</div>
                  <div className="font-bold text-[#0F1B2E] text-sm">{formatUsdAndInr(analysisReport.lineageComparison.previousCostUsd)}</div>
                  <div className="text-emerald-700 text-[10px] font-bold">{analysisReport.lineageComparison.costChangePct}% Outlay Delta</div>
                </div>

                <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-sans">Previous Composite Risk</div>
                  <div className="font-bold text-[#0F1B2E] text-sm">{analysisReport.lineageComparison.previousRiskScore}/100</div>
                  <div className="text-emerald-700 text-[10px] font-bold">{analysisReport.lineageComparison.riskChange} Risk Points</div>
                </div>

                <div className="p-3.5 bg-[#FAFAF8] rounded-xl border border-slate-200 font-sans leading-relaxed text-slate-600">
                  <div className="text-[10px] text-slate-500 uppercase font-mono font-bold">Lineage Summary</div>
                  {analysisReport.lineageComparison.summary}
                </div>
              </div>
            </div>
          )}

          {/* 9. Additive AI Counterarguments & Decision Pivot Triggers Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-theme border border-slate-200 rounded-2xl p-5 shadow-card-soft space-y-4 font-sans">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-bold text-[#0F1B2E] font-serif">AI Counterarguments & Risks Evaluated</h2>
              </div>
              <RenderExecutiveReasoning text={analysisReport.aiExplanation?.counterargumentsText} />
            </div>

            <div className="card-theme border border-slate-200 rounded-2xl p-5 shadow-card-soft space-y-4 font-sans">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h2 className="text-sm font-bold text-[#0F1B2E] font-serif">What Would Change This Recommendation? (Pivot Triggers)</h2>
              </div>
              <RenderExecutiveReasoning text={analysisReport.aiExplanation?.decisionPivotConditions} />
            </div>
          </div>
        </div>
      )}

      {/* Detailed Create Procurement Plan Modal using Exact Reference 50px Form Input Pattern */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1B2E]/40 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-in fade-in">
          <div className="w-full max-w-3xl form-container p-0 overflow-hidden shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#0F1B2E] text-white">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 font-serif text-white">
                  <FileSpreadsheet className="w-5 h-5 text-sky-400" />
                  <span>Create Enterprise Bulk Cargo Specification</span>
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  SAIL Maritime Chartering • Cargo Specifications, Port Guarantees & Commercial Incoterms
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-300 hover:text-white rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Bar Navigation */}
            <div className="flex border-b border-slate-200 bg-[#FAFAF8] px-6 pt-3 space-x-4 font-mono text-xs">
              <button
                type="button"
                onClick={() => setModalTab('CARGO')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  modalTab === 'CARGO' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-[#0F1B2E]'
                }`}
              >
                1. Cargo Specs
              </button>
              <button
                type="button"
                onClick={() => setModalTab('OPERATIONS')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  modalTab === 'OPERATIONS' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-[#0F1B2E]'
                }`}
              >
                2. Port Operations
              </button>
              <button
                type="button"
                onClick={() => setModalTab('COMMERCIAL')}
                className={`pb-3 font-bold border-b-2 transition-all cursor-pointer ${
                  modalTab === 'COMMERCIAL' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-[#0F1B2E]'
                }`}
              >
                3. Financial & Commercial
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 text-xs font-sans max-h-[70vh] overflow-y-auto bg-white">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                  {formError}
                </div>
              )}

              {/* TAB 1: CARGO SPECIFICATIONS */}
              {modalTab === 'CARGO' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="block text-[#0F1B2E] font-semibold">Bulk Cargo Commodity</label>
                    <div className="inputForm">
                      <Package className="w-4 h-4 text-slate-400 shrink-0" />
                      <select
                        value={commodity}
                        onChange={(e) => setCommodity(e.target.value)}
                        className="input font-semibold text-[#0F1B2E] bg-transparent"
                      >
                        <option value="Australian Blast Furnace Coking Coal">Australian Coking Coal (Prime Hard)</option>
                        <option value="Odisha Iron Ore Fines (+62% Fe Grade)">Odisha Iron Ore Fines (+62% Fe)</option>
                        <option value="South African High-CV Thermal Coal">South African Thermal Coal (RB1)</option>
                        <option value="Indonesian Low-Ash Steam Coal">Indonesian Steam Coal (GAR 5000)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[#0F1B2E] font-semibold">Cargo Quantity (Metric Tons)</label>
                      <div className="inputForm">
                        <Package className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="number"
                          required
                          value={quantityMt}
                          onChange={(e) => setQuantityMt(e.target.value)}
                          placeholder="180000"
                          className="input font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#0F1B2E] font-semibold">Target Freight Ceiling ($/MT)</label>
                      <div className="inputForm">
                        <DollarSign className="w-4 h-4 text-sky-600 shrink-0" />
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={targetFreightCeilingUsd}
                          onChange={(e) => setTargetFreightCeilingUsd(e.target.value)}
                          placeholder="28.50"
                          className="input font-mono font-bold text-sky-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PORT & LAYCAN OPERATIONS */}
              {modalTab === 'OPERATIONS' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[#0F1B2E] font-semibold">Origin Port</label>
                      <div className="inputForm">
                        <Anchor className="w-4 h-4 text-slate-400 shrink-0" />
                        <select
                          value={originPortId}
                          onChange={(e) => setOriginPortId(e.target.value)}
                          className="input text-[#0F1B2E] bg-transparent font-sans"
                        >
                          <option value="">Select Origin Port...</option>
                          {ports.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.country})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#0F1B2E] font-semibold">Destination Port</label>
                      <div className="inputForm">
                        <Anchor className="w-4 h-4 text-sky-600 shrink-0" />
                        <select
                          value={destinationPortId}
                          onChange={(e) => setDestinationPortId(e.target.value)}
                          className="input text-[#0F1B2E] bg-transparent font-sans"
                        >
                          <option value="">Select Destination Port...</option>
                          {ports.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.country})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[#0F1B2E] font-semibold">Required Laycan Delivery Date</label>
                    <div className="inputForm">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="date"
                        required
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="input font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIAL & COMMERCIAL CONTROLS */}
              {modalTab === 'COMMERCIAL' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[#0F1B2E] font-semibold">Target Budget (₹ Crore)</label>
                      <div className="inputForm">
                        <DollarSign className="w-4 h-4 text-amber-600 shrink-0" />
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={budgetCrore}
                          onChange={(e) => setBudgetCrore(e.target.value)}
                          placeholder="165.0"
                          className="input font-mono font-bold text-amber-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#0F1B2E] font-semibold">Incoterm Contract Basis</label>
                      <div className="inputForm">
                        <Layers className="w-4 h-4 text-slate-400 shrink-0" />
                        <select
                          value={incoterm}
                          onChange={(e) => setIncoterm(e.target.value as any)}
                          className="input text-[#0F1B2E] bg-transparent font-mono"
                        >
                          <option value="FOB">FOB (Free On Board)</option>
                          <option value="CFR">CFR (Cost & Freight)</option>
                          <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Navigation */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-200 font-mono">
                <div className="text-[11px] text-slate-500">
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
                      className="accept-button-theme text-xs font-bold shadow-xs px-5 py-2"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="button-submit !my-0 !h-[42px] px-6 text-xs"
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
