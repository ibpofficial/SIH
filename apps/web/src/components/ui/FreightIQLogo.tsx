import React from 'react';

interface FreightIQLogoProps {
  className?: string;
  size?: number;
}

export const FreightIQLogo: React.FC<FreightIQLogoProps> = ({ className = 'h-9 w-auto', size = 36 }) => {
  return (
    <svg
      width={size * 1.85}
      height={size}
      viewBox="0 0 380 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Main Center Castle Tower */}
      <path
        d="M142 62 H154 V45 H166 V62 H178 V45 H190 V62 H202 V45 H214 V62 H226 V52 H238 V62 H250 V115 H142 Z"
        fill="currentColor"
      />
      {/* Center Tower Window */}
      <path
        d="M182 72 Q196 60 210 72 V92 H182 Z"
        fill="white"
      />

      {/* Left Castle Tower */}
      <path
        d="M75 92 H88 V76 H98 V92 H108 V76 H118 V92 H128 V76 H142 V120 H75 Z"
        fill="currentColor"
      />
      {/* Left Tower Window */}
      <path
        d="M98 94 Q105 87 112 94 V106 H98 Z"
        fill="white"
      />

      {/* Right Castle Tower */}
      <path
        d="M250 92 H264 V76 H274 V92 H284 V76 H294 V92 H304 V76 H315 V120 H250 Z"
        fill="currentColor"
      />
      {/* Right Tower Window */}
      <path
        d="M274 94 Q281 87 288 94 V106 H274 Z"
        fill="white"
      />

      {/* Upper Ship Structure & Bridge on Stern */}
      <path
        d="M38 108 L75 108 L75 125 L38 125 Z M55 92 H72 V108 H55 Z"
        fill="currentColor"
      />

      {/* Main Cargo Container Deck */}
      <path
        d="M38 118 H338 V152 L35 152 Z"
        fill="currentColor"
      />

      {/* Main Ship Hull Body */}
      <path
        d="M32 150 L332 120 C345 120 358 126 365 132 C340 148 300 168 280 174 C180 182 80 178 32 166 Z"
        fill="currentColor"
      />

      {/* Container Rows White Separator Lines */}
      <path
        d="M75 128 H330 V131 H75 Z M75 138 H320 V141 H75 Z M75 147 H305 V150 H75 Z"
        fill="white"
      />

      {/* Vertical Container Division Lines */}
      <path
        d="M102 122 V152 M130 122 V152 M158 122 V152 M186 122 V152 M214 122 V152 M242 122 V150 M270 122 V146 M298 122 V140"
        stroke="white"
        strokeWidth="3.5"
      />

      {/* Water Wave Line Baseline */}
      <path
        d="M15 178 C90 188 180 178 270 174 C310 172 345 176 370 180 C340 186 280 188 200 188 C120 188 50 184 15 178 Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FreightIQLogo;
