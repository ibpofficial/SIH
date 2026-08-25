import { z } from 'zod';

export const ModelMetricsSchema = z.object({
  modelName: z.string(),
  algorithm: z.string(),
  mae: z.number(),
  mape: z.number(),
  isBest: z.boolean()
});

export type ModelMetrics = z.infer<typeof ModelMetricsSchema>;

export const ForecastPointSchema = z.object({
  date: z.string(),
  predictedRate: z.number(),
  confidenceLower: z.number(),
  confidenceUpper: z.number()
});

export type ForecastPoint = z.infer<typeof ForecastPointSchema>;

export const ForecastOutputSchema = z.object({
  route: z.string(),
  originPortName: z.string(),
  destinationPortName: z.string(),
  vesselTypeName: z.string(),
  selectedModel: z.string(),
  modelMetrics: z.array(ModelMetricsSchema),
  trendDirection: z.enum(['UPWARD', 'DOWNWARD', 'STABLE']),
  trendMagnitudePct: z.number(),
  forecastPoints: z.array(ForecastPointSchema)
});

export type ForecastOutput = z.infer<typeof ForecastOutputSchema>;

export const VesselRecommendationSchema = z.object({
  vesselTypeId: z.string(),
  vesselTypeName: z.string(),
  vesselCode: z.string(),
  isFeasible: z.boolean(),
  rejectionReason: z.string().optional(),
  draftM: z.number(),
  lengthM: z.number(),
  requiredVoyagesCount: z.number(),
  estimatedTurnaroundDays: z.number(),
  estimatedCostUsd: z.number(),
  rank: z.number().optional()
});

export type VesselRecommendation = z.infer<typeof VesselRecommendationSchema>;

export const ContractStrategyOptionSchema = z.object({
  strategyType: z.enum(['SPOT', 'SHORT_TERM_3M', 'MID_TERM_6M']),
  title: z.string(),
  rateUsdPerMt: z.number(),
  estimatedTotalCostUsd: z.number(),
  voyagesCount: z.number(),
  volatilityExposureScore: z.number(),
  isRecommended: z.boolean(),
  reasoning: z.string()
});

export type ContractStrategyOption = z.infer<typeof ContractStrategyOptionSchema>;

export const IdleOptionSchema = z.object({
  optionTitle: z.string(),
  vesselCategory: z.string(),
  actionType: z.enum(['BALLAST_REPOSITION', 'ALT_CARGO_EMPLOYMENT', 'IDLE_WAIT']),
  estimatedCostUsd: z.number(),
  estimatedNetRevenueUsd: z.number(),
  recommendedAction: z.string()
});

export type IdleOption = z.infer<typeof IdleOptionSchema>;

export const RiskFactorBreakdownSchema = z.object({
  freightVolatilityScore: z.number(),
  portCongestionScore: z.number(),
  deadlineRiskScore: z.number(),
  marketVolatilityScore: z.number(),
  compositeRiskScore: z.number(),
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
  activeAlerts: z.array(z.string())
});

export type RiskFactorBreakdown = z.infer<typeof RiskFactorBreakdownSchema>;

export const AiExplanationSchema = z.object({
  recommendationLine: z.string(),
  reasoningParagraph: z.string(),
  caveatsText: z.string(),
  groundedDataSummary: z.string(),
  isAiGenerated: z.boolean()
});

export type AiExplanation = z.infer<typeof AiExplanationSchema>;

export interface FullAnalysisReport {
  procurementRequestId: string;
  commodity: string;
  quantityMt: number;
  originPortName: string;
  destinationPortName: string;
  forecast: ForecastOutput;
  vesselRecommendations: VesselRecommendation[];
  rejectedVessels: VesselRecommendation[];
  contractStrategies: ContractStrategyOption[];
  idleOptions: IdleOption[];
  riskAnalysis: RiskFactorBreakdown;
  aiExplanation: AiExplanation;
  generatedAt: string;
}

export interface ScenarioSimulationResult {
  originalCostUsd: number;
  simulatedCostUsd: number;
  costDeltaUsd: number;
  costDeltaPct: number;
  originalRiskScore: number;
  simulatedRiskScore: number;
  riskDelta: number;
  originalVessel: string;
  simulatedVessel: string;
  report: FullAnalysisReport;
}
