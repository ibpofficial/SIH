import React from 'react';
import { Compass } from 'lucide-react';

interface CompassRiskGaugeProps {
  score: number; // 0 to 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompassRiskGauge: React.FC<CompassRiskGaugeProps> = ({
  score,
  riskLevel,
  size = 'md'
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score || 0));
  
  // Angle: 0 score = -120deg, 100 score = 120deg
  const angleDeg = -120 + (normalizedScore / 100) * 240;

  // Determine desaturated color palette
  let strokeColor = '#2D6A4F'; // Moss Green (LOW)
  let badgeBg = 'bg-[#F0F7F4] text-[#2D6A4F] border-[#2D6A4F]/30';

  if (riskLevel === 'MODERATE' || (normalizedScore > 35 && normalizedScore <= 60)) {
    strokeColor = '#9C6615'; // Amber (MODERATE)
    badgeBg = 'bg-[#FFF8E7] text-[#9C6615] border-[#9C6615]/30';
  } else if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL' || normalizedScore > 60) {
    strokeColor = '#A32D2D'; // Rust Red (HIGH/CRITICAL)
    badgeBg = 'bg-[#FDF2F2] text-[#A32D2D] border-[#A32D2D]/30';
  }

  const dim = size === 'sm' ? 100 : size === 'lg' ? 180 : 130;
  const radius = dim / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * (circumference * 0.67);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white border border-[#0F1B2E]/10 rounded-xl space-y-2 font-mono">
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        {/* Outer Compass Dial Circle */}
        <svg width={dim} height={dim} className="transform -rotate-90">
          {/* Background Arc */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.33}
            strokeLinecap="round"
          />
          {/* Active Risk Score Arc */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="7"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Compass Cardinal Points Marks (N, E, S, W) */}
        <div className="absolute inset-0 flex flex-col justify-between p-1.5 text-[8px] text-[#3E5871] font-extrabold select-none pointer-events-none">
          <div className="text-center font-serif text-[9px]">N</div>
          <div className="flex justify-between items-center px-1">
            <span>W</span>
            <span>E</span>
          </div>
          <div className="text-center font-serif text-[9px]">S</div>
        </div>

        {/* Center Score Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold font-mono text-[#0F1B2E] tracking-tight">
            {normalizedScore.toFixed(1)}
          </span>
          <span className="text-[9px] text-[#3E5871] uppercase font-sans">/ 100 SCORE</span>
        </div>
      </div>

      {/* Compass Needle / Direction indicator */}
      <div className="flex items-center space-x-1 text-xs">
        <Compass className="w-3.5 h-3.5 text-[#A9793A]" />
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase font-mono ${badgeBg}`}>
          {riskLevel} RISK
        </span>
      </div>
    </div>
  );
};
