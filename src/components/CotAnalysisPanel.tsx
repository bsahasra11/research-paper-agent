import React, { useRef, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Download,
  AlertCircle,
  FileCheck2,
  ChevronDown,
  Layers,
  Gauge,
  Sliders,
  Scale,
} from 'lucide-react';
import { PaperAnalysisResult } from '../types/paper';
import LaTeXRenderer from './LaTeXRenderer';
import { generateMarkdownReport } from '../utils/exportGenerators';

interface CotAnalysisPanelProps {
  analysis: PaperAnalysisResult | null;
  isAnalyzing: boolean;
  onTriggerAnalysis: () => void;
  onOpenExport: () => void;
  error: string | null;
}

export const CotAnalysisPanel: React.FC<CotAnalysisPanelProps> = ({
  analysis,
  isAnalyzing,
  onTriggerAnalysis,
  onOpenExport,
  error,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  const scrollToStep = (stepNumber: number) => {
    setActiveStepTab(stepNumber);
    const refs = [null, step1Ref, step2Ref, step3Ref, step4Ref, step5Ref];
    const targetRef = refs[stepNumber];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyMarkdown = () => {
    if (!analysis) return;
    const md = generateMarkdownReport(analysis);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFCFA] overflow-hidden">
      {/* CoT Stage Progress Navigator Ribbon */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white/95 px-6 py-2.5 backdrop-blur-xs">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs py-0.5">
          <span className="text-[11px] uppercase tracking-wider font-mono-code text-stone-400 mr-1 hidden lg:inline">
            Reasoning Chain:
          </span>
          {[
            { num: 1, label: 'Problem' },
            { num: 2, label: 'Methodology' },
            { num: 3, label: 'Findings & Metrics' },
            { num: 4, label: 'Limitations' },
            { num: 5, label: 'Executive' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => scrollToStep(s.num)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeStepTab === s.num
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span className="font-mono-code text-[11px] opacity-70">0{s.num}.</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 shrink-0">
          {analysis && (
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
              title="Copy analysis report in Markdown format"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy MD'}</span>
            </button>
          )}

          <button
            onClick={onTriggerAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Notice</p>
              <p className="mt-0.5 leading-relaxed">{error}</p>
              <p className="mt-1 text-stone-600">
                You can still explore precomputed landmark benchmark analyses from the top menu.
              </p>
            </div>
          </div>
        )}

        {/* Live Reasoning Animation State */}
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-stone-200 border-t-blue-900 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-blue-900 absolute inset-0 m-auto" />
            </div>
            <h3 className="font-serif-scholarly text-xl font-bold text-stone-900">
              Executing Chain-of-Thought Reasoning
            </h3>
            <p className="text-xs text-stone-500 max-w-md mt-2 leading-relaxed">
              The Research Paper Assistant Agent is reading the paper content and rigorously progressing through all 5 sequential analytical phases.
            </p>

            {/* Stepper simulation indicator */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-5 gap-2 max-w-2xl w-full text-left">
              {[
                '1. Problem Definition',
                '2. Methodology & LaTeX',
                '3. Findings & Metrics',
                '4. Limitations & Biases',
                '5. Executive Takeaway',
              ].map((stepLabel, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white border border-stone-200 rounded text-[11px] font-sans-body shadow-2xs"
                >
                  <span className="block font-mono-code text-[10px] text-blue-900 font-semibold mb-0.5">
                    STAGE 0{idx + 1}
                  </span>
                  <span className="text-stone-700 font-medium">{stepLabel}</span>
                </div>
              ))}
            </div>
          </div>
        ) : !analysis ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileCheck2 className="w-12 h-12 text-stone-300 mb-3" />
            <h3 className="font-serif-scholarly text-lg font-bold text-stone-800">
              No Analysis Generated Yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mt-1.5 leading-relaxed">
              Click &quot;Re-Analyze&quot; above or select a seminal benchmark paper from the document pane on the left.
            </p>
          </div>
        ) : (
          /* Rendered 5-Step CoT Analytical Synthesis */
          <div className="space-y-10">
            {/* Meta Header */}
            <div className="border-b border-stone-200 pb-5">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-sans-body mb-2">
                <span>Chain-of-Thought Synthesis</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-code">{analysis.modelUsed}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(analysis.analyzedAt).toLocaleDateString()}</span>
              </div>
              <h2 className="font-serif-scholarly text-2xl lg:text-3xl font-bold tracking-tight text-stone-900 leading-snug">
                {analysis.paperTitle}
              </h2>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs text-stone-600">
                <span>By {analysis.authors.join(', ')}</span>
                {analysis.institutionOrVenue && (
                  <>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="italic">{analysis.institutionOrVenue}</span>
                  </>
                )}
              </div>
            </div>

            {/* 1. PROBLEM DEFINITION */}
            <section ref={step1Ref} className="scroll-mt-16">
              <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 mb-4">
                <span className="font-mono-code text-xs font-bold text-blue-900 uppercase tracking-widest">
                  01.
                </span>
                <h3 className="font-serif-scholarly text-lg font-bold text-stone-900">
                  Problem Definition
                </h3>
              </div>

              <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-1.5">
                    Central Technical Challenge
                  </h4>
                  <p className="text-sm text-stone-800 leading-relaxed font-sans-body">
                    {analysis.steps.problemDefinition.centralChallenge}
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border-l-2 border-stone-800 rounded-r">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono-code mb-1">
                    Core Open Research Question
                  </h4>
                  <p className="text-sm font-serif-scholarly italic text-stone-900 leading-relaxed">
                    &ldquo;{analysis.steps.problemDefinition.openQuestion}&rdquo;
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-2">
                    Baseline &amp; Prior Art Limitations
                  </h4>
                  <ul className="space-y-2">
                    {analysis.steps.problemDefinition.baselineLimitations.map((lim, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                        <span className="text-stone-400 font-mono-code mt-0.5">•</span>
                        <LaTeXRenderer content={lim} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 2. PROPOSED METHODOLOGY */}
            <section ref={step2Ref} className="scroll-mt-16">
              <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 mb-4">
                <span className="font-mono-code text-xs font-bold text-blue-900 uppercase tracking-widest">
                  02.
                </span>
                <h3 className="font-serif-scholarly text-lg font-bold text-stone-900">
                  Proposed Methodology
                </h3>
              </div>

              <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-1.5">
                    Novel Architecture &amp; System Design
                  </h4>
                  <p className="text-sm text-stone-800 leading-relaxed font-sans-body">
                    {analysis.steps.proposedMethodology.novelArchitecture}
                  </p>
                </div>

                {/* Mathematical Formulation in KaTeX */}
                <div className="p-5 bg-stone-50/70 border border-stone-200 rounded-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono-code mb-3">
                    Mathematical Formulation &amp; Proof
                  </h4>
                  <div className="text-stone-900 text-sm overflow-x-auto py-1">
                    <LaTeXRenderer
                      content={analysis.steps.proposedMethodology.mathematicalFormulation}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-1.5">
                    Algorithmic &amp; Operational Framework
                  </h4>
                  <div className="text-xs text-stone-700 leading-relaxed font-sans-body">
                    <LaTeXRenderer
                      content={analysis.steps.proposedMethodology.algorithmicFramework}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-2">
                    Evaluated Datasets &amp; Empirical Frameworks
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs text-stone-700">
                    {analysis.steps.proposedMethodology.datasetsUsed.map((dataset, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-stone-100 border border-stone-200 rounded text-stone-800 font-sans-body"
                      >
                        {dataset}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. KEY FINDINGS & METRICS */}
            <section ref={step3Ref} className="scroll-mt-16">
              <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 mb-4">
                <span className="font-mono-code text-xs font-bold text-blue-900 uppercase tracking-widest">
                  03.
                </span>
                <h3 className="font-serif-scholarly text-lg font-bold text-stone-900">
                  Key Findings &amp; Quantitative Metrics
                </h3>
              </div>

              <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
                {/* Quantitative Results Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-3">
                    Benchmark Comparison vs Baselines
                  </h4>
                  <div className="overflow-x-auto border border-stone-200 rounded-md">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold font-mono-code">
                          <th className="py-2.5 px-3">Evaluation Metric</th>
                          <th className="py-2.5 px-3">Paper Result</th>
                          <th className="py-2.5 px-3">Baseline Value</th>
                          <th className="py-2.5 px-3">Relative Gain / Delta</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-sans-body">
                        {analysis.steps.keyFindingsAndMetrics.quantitativeResults.map((metric, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-stone-900">
                              {metric.metricName}
                            </td>
                            <td className="py-2.5 px-3 font-mono-code font-bold text-blue-900 tabular-nums">
                              {metric.paperValue}
                            </td>
                            <td className="py-2.5 px-3 font-mono-code text-stone-500 tabular-nums">
                              {metric.baselineValue}
                            </td>
                            <td className="py-2.5 px-3 font-mono-code text-emerald-700 font-semibold tabular-nums">
                              {metric.relativeGain}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-1.5">
                    Baseline Comparison Summary
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans-body">
                    {analysis.steps.keyFindingsAndMetrics.baselineComparisons}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-2">
                    Breakthrough Achievements
                  </h4>
                  <ul className="space-y-2">
                    {analysis.steps.keyFindingsAndMetrics.keyAchievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                        <span className="text-emerald-600 font-bold font-mono-code">✓</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. LIMITATIONS & FUTURE WORK */}
            <section ref={step4Ref} className="scroll-mt-16">
              <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 mb-4">
                <span className="font-mono-code text-xs font-bold text-blue-900 uppercase tracking-widest">
                  04.
                </span>
                <h3 className="font-serif-scholarly text-lg font-bold text-stone-900">
                  Limitations &amp; Future Work
                </h3>
              </div>

              <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-2">
                    Noted Constraints &amp; Theoretical Boundaries
                  </h4>
                  <ul className="space-y-2">
                    {analysis.steps.limitationsAndFutureWork.notedConstraints.map((constraint, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                        <span className="text-amber-600 font-mono-code mt-0.5">•</span>
                        <LaTeXRenderer content={constraint} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono-code mb-1">
                    Hardware &amp; Compute Dependencies
                  </h4>
                  <p className="text-xs text-stone-800 leading-relaxed font-sans-body">
                    {analysis.steps.limitationsAndFutureWork.hardwareDependencies}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-2">
                    Potential Biases &amp; Edge Cases
                  </h4>
                  <ul className="space-y-2">
                    {analysis.steps.limitationsAndFutureWork.potentialBiases.map((bias, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                        <span className="text-stone-400 font-mono-code">•</span>
                        <span>{bias}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono-code mb-2">
                    Open Research Horizons
                  </h4>
                  <ul className="space-y-2">
                    {analysis.steps.limitationsAndFutureWork.openDirections.map((dir, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 leading-relaxed">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                        <span>{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. EXECUTIVE SUMMARY */}
            <section ref={step5Ref} className="scroll-mt-16">
              <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200 mb-4">
                <span className="font-mono-code text-xs font-bold text-blue-900 uppercase tracking-widest">
                  05.
                </span>
                <h3 className="font-serif-scholarly text-lg font-bold text-stone-900">
                  Executive Summary (Fast Technical Review)
                </h3>
              </div>

              <div className="bg-[#FAF9F5] border border-stone-300 rounded-lg p-6 shadow-xs space-y-4">
                <p className="text-xs text-stone-500 font-mono-code uppercase tracking-wider">
                  Three-Bullet Technical Triage:
                </p>
                <div className="space-y-3">
                  {analysis.steps.executiveSummary.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 bg-white border border-stone-200 rounded shadow-2xs"
                    >
                      <span className="font-serif-scholarly text-base font-bold text-blue-900 shrink-0">
                        {idx + 1}.
                      </span>
                      <div className="text-xs text-stone-800 leading-relaxed font-sans-body">
                        <LaTeXRenderer content={bullet} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bottom Floating Export Trigger Bar */}
            <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-stone-500 font-sans-body">
                Structured peer review complete · 5 steps verified
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded transition-colors cursor-pointer"
                >
                  {copied ? 'Copied to Clipboard' : 'Copy Full Markdown'}
                </button>
                <button
                  onClick={onOpenExport}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Reports</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CotAnalysisPanel;
