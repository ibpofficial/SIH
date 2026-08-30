import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProcurement?: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: '1. Welcome to FreightIQ!',
      description: 'FreightIQ helps shipping teams decide which vessel to book, when to book, and whether to lock in a contract using real data instead of guesswork.',
      actionText: 'Next: Navigation Overview'
    },
    {
      title: '2. Navigation & Data Registries',
      description: 'Use the left sidebar menu to navigate between Ports Registry, Vessels Fleet, Procurement Requests, and Data Ingestion Studio.',
      actionText: 'Next: Procurement Plans'
    },
    {
      title: '3. Procurement Requests List',
      description: 'The Procurement Requests view lists all bulk cargo plans. Click on any request to view its details or create a new plan.',
      actionText: 'Next: Analyze & Optimize'
    },
    {
      title: '4. Analyze & Optimize Action',
      description: 'Click the "Analyze & Optimize" button on any procurement plan to run the 6-stage decision pipeline (ML Forecast → Port Constraints → Contract Strategy → Idle Repositioning → Composite Risk → Gemini AI).',
      actionText: 'Next: What-If Simulator'
    },
    {
      title: '5. What-If Scenario Simulator',
      description: 'Use the sensitivity sliders on the results screen to stress-test freight rate spikes, port congestion delays, and deadline shifts before committing.',
      actionText: 'Complete Guided Tour'
    }
  ];

  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('freightiq_tour_completed', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('freightiq_tour_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1B2E]/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in">
      <div className="bg-white border border-[#0F1B2E]/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        <div className="p-4 bg-[#FAFAF8] border-b border-[#0F1B2E]/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#A9793A]" />
            <span className="font-bold text-[#0F1B2E] text-xs font-mono uppercase tracking-wider">
              Platform Guided Tour • Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <button onClick={handleSkip} className="p-1 text-[#3E5871] hover:text-[#0F1B2E] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-base font-bold text-[#0F1B2E] font-serif">{step.title}</h3>
          <p className="text-xs text-[#3E5871] leading-relaxed font-sans">{step.description}</p>

          <div className="pt-2 flex items-center justify-between border-t border-[#0F1B2E]/10 text-xs font-mono">
            <button
              onClick={handleSkip}
              className="text-[#3E5871] hover:text-[#0F1B2E] cursor-pointer text-[11px]"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#0F1B2E] hover:bg-[#1A2942] text-white font-bold rounded-lg uppercase tracking-wider shadow-xs cursor-pointer flex items-center space-x-1.5 border border-[#0F1B2E]"
            >
              <span>{step.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A9793A]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
