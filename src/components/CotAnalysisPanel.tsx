import React from 'react';
import { PaperAnalysisResult } from '../types/paper';

interface CotAnalysisPanelProps {
  analysis: PaperAnalysisResult | null;
  isAnalyzing: boolean;
  onTriggerAnalysis: () => void;
  onOpenExport: () => void;
  error: string | null;
}

export default function CotAnalysisPanel({
  analysis,
  isAnalyzing,
  onTriggerAnalysis,
  onOpenExport,
  error
}: CotAnalysisPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-10 h-10 border-3 border-stone-900 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="font-serif text-base font-semibold text-stone-900 mb-1">
          Synthesizing Chain-of-Thought
        </h3>
        <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
          Gemini is analyzing structural methodology, extracting technical findings, and evaluating limitations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3 font-mono font-bold">
          !
        </div>
        <h3 className="font-serif text-base font-semibold text-stone-900 mb-1">
          Analysis Encountered an Issue
        </h3>
        <p className="text-xs text-stone-600 mb-4 max-w-sm leading-relaxed">
          {error}
        </p>
        <button
          onClick={onTriggerAnalysis}
          className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400 font-serif text-xl">
          🧠
        </div>
        <h3 className="font-serif text-base font-semibold text-stone-900 mb-1">
          Chain-of-Thought Panel Ready
        </h3>
        <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
          Select or upload a research paper to generate a 5-step structured technical breakdown.
        </p>
      </div>
    );
  }

  // Safe field parsing to prevent any .join() or .map() undefined crashes
  const safeProblem = analysis.problem || "No problem statement extracted.";
  const safeMethodology = analysis.methodology || "No methodology details extracted.";
  const safeFindings = analysis.findings || "No key findings extracted.";
  const safeLimitations = analysis.limitations || "No limitations extracted.";
  const safeExecutive = analysis.executive || "No executive summary available.";

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-0.5">
            Structured CoT Output
          </span>
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Synthesis & Key Insights
          </h2>
        </div>
        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-md transition-colors"
        >
          Export Report
        </button>
      </div>

      {/* Step 1: Core Problem */}
      <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
            1
          </span>
          <h4 className="text-xs font-mono font-bold uppercase text-stone-800 tracking-wider">
            Problem Formulation & Scope
          </h4>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-serif pl-7">
          {safeProblem}
        </p>
      </div>

      {/* Step 2: Methodology */}
      <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
            2
          </span>
          <h4 className="text-xs font-mono font-bold uppercase text-stone-800 tracking-wider">
            Technical Methodology
          </h4>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-serif pl-7">
          {safeMethodology}
        </p>
      </div>

      {/* Step 3: Key Findings */}
      <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
            3
          </span>
          <h4 className="text-xs font-mono font-bold uppercase text-stone-800 tracking-wider">
            Key Quantitative Findings
          </h4>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-serif pl-7">
          {safeFindings}
        </p>
      </div>

      {/* Step 4: Limitations */}
      <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
            4
          </span>
          <h4 className="text-xs font-mono font-bold uppercase text-stone-800 tracking-wider">
            Limitations & Constraint Analysis
          </h4>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-serif pl-7">
          {safeLimitations}
        </p>
      </div>

      {/* Step 5: Executive Conclusion */}
      <div className="p-4 rounded-lg bg-stone-900 text-stone-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-white text-stone-900 font-mono text-[10px] flex items-center justify-center font-bold">
            5
          </span>
          <h4 className="text-xs font-mono font-bold uppercase text-stone-200 tracking-wider">
            Executive Synthesis
          </h4>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed font-serif pl-7">
          {safeExecutive}
        </p>
      </div>
    </div>
  );
}
