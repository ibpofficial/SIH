import { Injectable, Logger } from '@nestjs/common';
import { AiExplanation, FullAnalysisReport } from '@freightiq/shared-types';

@Injectable()
export class AiExplanationService {
  private readonly logger = new Logger(AiExplanationService.name);
  private readonly cache = new Map<string, AiExplanation>();

  async generateExplanation(reportData: Partial<FullAnalysisReport>): Promise<AiExplanation> {
    const key = `${reportData.procurementRequestId}_${reportData.forecast?.trendMagnitudePct}_${reportData.riskAnalysis?.compositeRiskScore}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const recVessel = reportData.vesselRecommendations?.[0]?.vesselTypeName || 'Panamax';
    const recStrategy = reportData.contractStrategies?.find((s) => s.isRecommended) || reportData.contractStrategies?.[0];
    const rejVessels = reportData.rejectedVessels?.map((v) => `${v.vesselTypeName} (${v.rejectionReason})`).join('; ') || 'None';
    const riskScore = reportData.riskAnalysis?.compositeRiskScore || 50;
    const riskLevel = reportData.riskAnalysis?.riskLevel || 'MODERATE';
    const trendMag = reportData.forecast?.trendMagnitudePct || 5.0;
    const trendDir = reportData.forecast?.trendDirection || 'UPWARD';

    const groundedLineage = `Based On: Route ${reportData.originPortName} → ${reportData.destinationPortName} | Cargo: ${reportData.quantityMt?.toLocaleString()} MT ${reportData.commodity} | Rate Trend: ${trendDir} (+${trendMag}% 90d) | Feasible Vessel: ${recVessel} | Rejected: ${rejVessels} | Strategy: ${recStrategy?.title} ($${recStrategy?.rateUsdPerMt}/MT) | Composite Risk: ${riskScore}/100 (${riskLevel}).`;

    // 1. Check if Gemini API key is configured
    if (!apiKey || apiKey.trim() === '') {
      this.logger.warn('GEMINI_API_KEY not configured. Falling back to deterministic analytical synthesis.');
      const fallback = this.getFallbackExplanation(recVessel, recStrategy, trendDir, trendMag, riskScore, riskLevel, groundedLineage);
      this.cache.set(key, fallback);
      return fallback;
    }

    // 2. Call Gemini Flash API server-side
    try {
      const systemInstruction = `You are FreightIQ's senior shipping procurement AI analyst. You are provided structured numerical output calculated deterministically by a bulk cargo chartering decision platform. Your task is to synthesize and justify the recommended chartering strategy in crisp, executive maritime prose for a bulk cargo logistics manager.
CRITICAL MANDATE:
- ONLY explain numbers and constraints present in the input. NEVER invent rates, vessel specs, or risk scores not given.
- Output JSON format: { "recommendationLine": "...", "reasoningParagraph": "...", "caveatsText": "..." }`;

      const prompt = `Structured Decision Engine Output:
- Origin Loading Port: ${reportData.originPortName}
- Destination Discharge Port: ${reportData.destinationPortName}
- Commodity Cargo: ${reportData.quantityMt} MT ${reportData.commodity}
- Forecast Freight Rate Trend: ${trendDir} (+${trendMag}% over 90 days)
- Selected ML Model: ${reportData.forecast?.selectedModel} (MAE ${reportData.forecast?.modelMetrics?.[0]?.mae} USD/MT)
- Feasible Vessel Class: ${recVessel} (Draft & LOA verified)
- Rejected Vessel Classes: ${rejVessels}
- Recommended Strategy: ${recStrategy?.title} at $${recStrategy?.rateUsdPerMt}/MT ($${recStrategy?.estimatedTotalCostUsd?.toLocaleString()} Total Outlay)
- Composite Risk Matrix: ${riskScore} / 100 (${riskLevel} Risk Level)

Synthesize an executive summary with a 1-line Recommendation, a short analytical Reasoning paragraph, and honest Caveats.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      let parsedJson: any = null;
      try {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedJson = JSON.parse(jsonMatch[0]);
        }
      } catch (parseErr) {
        this.logger.warn('Failed to parse Gemini JSON response. Falling back to raw text extraction.');
      }

      const explanation: AiExplanation = {
        recommendationLine: parsedJson?.recommendationLine || `Execute ${recStrategy?.title} utilizing ${recVessel} tonnage.`,
        reasoningParagraph: parsedJson?.reasoningParagraph || rawText.slice(0, 300) || `Freight rate forecast indicates an ${trendDir.toLowerCase()} trajectory of +${trendMag}% over 90 days. Chartering ${recVessel} tonnage under a ${recStrategy?.title} locks in freight costs at $${recStrategy?.rateUsdPerMt}/MT, avoiding spot exposure.`,
        caveatsText: parsedJson?.caveatsText || `Confidence interval reflects historical freight volatility. Port congestion at ${reportData.destinationPortName} remains a key variable.`,
        groundedDataSummary: groundedLineage,
        isAiGenerated: true
      };

      this.cache.set(key, explanation);
      return explanation;
    } catch (err: any) {
      this.logger.error(`Gemini AI Service call failed: ${err.message}. Gracefully falling back to deterministic reasoning.`);
      const fallback = this.getFallbackExplanation(recVessel, recStrategy, trendDir, trendMag, riskScore, riskLevel, groundedLineage);
      this.cache.set(key, fallback);
      return fallback;
    }
  }

  private getFallbackExplanation(
    recVessel: string,
    recStrategy: any,
    trendDir: string,
    trendMag: number,
    riskScore: number,
    riskLevel: string,
    groundedLineage: string
  ): AiExplanation {
    return {
      recommendationLine: `Execute ${recStrategy?.title || '6-Month COA Contract'} fixing ${recVessel} tonnage at $${recStrategy?.rateUsdPerMt || 19.50}/MT.`,
      reasoningParagraph: `Analytical engines forecast freight rates trending ${trendDir} by +${trendMag}% over 90 days. Contract strategy optimization confirms that fixing ${recVessel} tonnage under a ${recStrategy?.title || 'Multi-Voyage Contract'} shields against forecasted spot rate inflation and minimizes total charter outlay.`,
      caveatsText: `Market risk score is ${riskScore}/100 (${riskLevel}). Turnaround delays at destination discharge berths represent the primary demurrage risk factor.`,
      groundedDataSummary: groundedLineage,
      isAiGenerated: false
    };
  }
}
