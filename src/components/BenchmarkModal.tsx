import React from 'react';
import { X, BookOpen, ArrowRight, Check } from 'lucide-react';
import { LANDMARK_PAPERS } from '../data/landmarkPapers';
import { PaperDocument } from '../types/paper';

interface BenchmarkModalProps {
  currentPaperId: string | null;
  onSelectPaper: (paper: PaperDocument) => void;
  onClose: () => void;
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({
  currentPaperId,
  onSelectPaper,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-900" />
            <h3 className="font-serif-scholarly text-lg font-bold text-stone-900">
              Select Seminal Benchmark Paper
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Papers List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-stone-50/50">
          <p className="text-xs text-stone-600 leading-relaxed font-sans-body">
            Explore how the Research Paper Assistant Agent analyzes seminal academic papers with authentic LaTeX math, quantitative tables, and structured Chain-of-Thought reasoning:
          </p>

          <div className="space-y-3">
            {LANDMARK_PAPERS.map((paper) => {
              const isSelected = currentPaperId === paper.id;
              return (
                <div
                  key={paper.id}
                  onClick={() => {
                    onSelectPaper(paper);
                    onClose();
                  }}
                  className={`p-4 rounded-lg border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-blue-900 ring-2 ring-blue-900/20 shadow-sm'
                      : 'border-stone-200 hover:border-stone-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-sans-body mb-1">
                        <span className="font-mono-code font-semibold text-blue-900">{paper.year}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-xs">{paper.venue}</span>
                      </div>
                      <h4 className="font-serif-scholarly text-base font-bold text-stone-900 leading-snug">
                        {paper.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">
                        By {paper.authors.slice(0, 3).join(', ')}
                        {paper.authors.length > 3 ? ' et al.' : ''}
                      </p>
                      <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                        {paper.abstract}
                      </p>
                    </div>

                    <div className="shrink-0 mt-1">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button className="flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded transition-colors">
                          <span>Load</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>You can also upload any custom academic PDF at any time.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkModal;
