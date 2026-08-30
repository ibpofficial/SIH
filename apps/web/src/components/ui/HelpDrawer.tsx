import React from 'react';
import { HelpCircle, X, RotateCcw, BookOpen, Sparkles } from 'lucide-react';

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartTour: () => void;
  onNavigateToGlossary: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({
  isOpen,
  onClose,
  onRestartTour,
  onNavigateToGlossary
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1B2E]/40 backdrop-blur-xs flex justify-end animate-in fade-in font-sans">
      <div className="bg-white w-full max-w-sm h-full border-l border-[#0F1B2E]/10 shadow-xl flex flex-col justify-between p-6 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#0F1B2E]/10 pb-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#A9793A]" />
              <h2 className="font-bold text-[#0F1B2E] text-sm font-serif">FreightIQ Help & Guidance</h2>
            </div>
            <button onClick={onClose} className="p-1 text-[#3E5871] hover:text-[#0F1B2E] cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions List */}
          <div className="space-y-3 font-mono text-xs">
            <button
              onClick={() => {
                onClose();
                onRestartTour();
              }}
              className="w-full p-3 bg-[#FAF4EB] hover:bg-[#FAF4EB]/80 border border-[#A9793A]/30 rounded-xl text-left transition-colors cursor-pointer flex items-center space-x-3 text-[#0F1B2E] font-bold"
            >
              <RotateCcw className="w-4 h-4 text-[#A9793A]" />
              <div>
                <div className="font-serif">Restart Guided Platform Tour</div>
                <div className="text-[10px] text-[#3E5871] font-normal font-sans">Re-run 5-step walkthrough overlay</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToGlossary();
              }}
              className="w-full p-3 bg-[#FAFAF8] hover:bg-slate-100 border border-[#0F1B2E]/10 rounded-xl text-left transition-colors cursor-pointer flex items-center space-x-3 text-[#0F1B2E] font-bold"
            >
              <BookOpen className="w-4 h-4 text-[#2C5282]" />
              <div>
                <div className="font-serif">Maritime & ML Glossary Page</div>
                <div className="text-[10px] text-[#3E5871] font-normal font-sans">Search definitions for Draft, LOA, MAE, COA</div>
              </div>
            </button>
          </div>

          {/* Plain-Language Platform Intro Summary */}
          <div className="p-4 bg-[#FAFAF8] border border-[#0F1B2E]/10 rounded-xl space-y-2 text-xs font-sans">
            <div className="font-bold text-[#0F1B2E] flex items-center gap-1.5 font-serif">
              <Sparkles className="w-4 h-4 text-[#A9793A]" />
              <span>How FreightIQ Works</span>
            </div>
            <p className="text-[#3E5871] leading-relaxed text-[11px]">
              FreightIQ compares time-series freight rate forecasts against port draft constraints and vessel specifications to recommend the optimal chartering contract for East Coast Indian bulk shipments.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#3E5871] border-t border-[#0F1B2E]/10 pt-3 text-center">
          FreightIQ SIH26006 • Steel Ministry Chartering Suite
        </div>
      </div>
    </div>
  );
};
