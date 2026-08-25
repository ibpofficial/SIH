import React from 'react';
import { HelpCircle, X, RotateCcw, BookOpen, Sparkles, Compass } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in font-sans">
      <div className="bg-white w-full max-w-sm h-full border-l border-slate-200 shadow-2xl flex flex-col justify-between p-6 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-india-saffron" />
              <h2 className="font-bold text-slate-900 text-sm">FreightIQ Help & Guidance</h2>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
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
              className="w-full p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-left transition-colors cursor-pointer flex items-center space-x-3 text-orange-900 font-bold"
            >
              <RotateCcw className="w-4 h-4 text-orange-600" />
              <div>
                <div>Restart Guided Platform Tour</div>
                <div className="text-[10px] text-slate-500 font-normal font-sans">Re-run 5-step walkthrough overlay</div>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToGlossary();
              }}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors cursor-pointer flex items-center space-x-3 text-slate-900 font-bold"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <div>
                <div>Maritime & ML Glossary Page</div>
                <div className="text-[10px] text-slate-500 font-normal font-sans">Search definitions for Draft, LOA, MAE, COA</div>
              </div>
            </button>
          </div>

          {/* Plain-Language Platform Intro Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-sans">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-india-saffron" />
              <span>How FreightIQ Works</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              FreightIQ compares time-series freight rate forecasts against port draft constraints and vessel specifications to recommend the optimal chartering contract for East Coast Indian bulk shipments.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-3 text-center">
          FreightIQ SIH26006 • Built for Smart India Hackathon
        </div>
      </div>
    </div>
  );
};
