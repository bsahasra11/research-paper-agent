import React from 'react';
import { FileUp, Download, Sparkles, BookOpen } from 'lucide-react';
import { PaperDocument } from '../types/paper';

interface HeaderProps {
  currentPaper: PaperDocument | null;
  onOpenUpload: () => void;
  onOpenExport: () => void;
  onOpenBenchmarkSelect: () => void;
  hasAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPaper,
  onOpenUpload,
  onOpenExport,
  onOpenBenchmarkSelect,
  hasAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 border-b border-stone-200 bg-[#FBFBF9]/95 px-6 py-3.5 backdrop-blur-sm">
      {/* Zone 1: Single text element wordmark in editorial serif */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="font-serif-scholarly text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0">
          ScholarCoT
        </a>
        <span className="hidden sm:inline-block text-xs text-stone-400 font-mono-code">
          v2.4
        </span>
      </div>

      {/* Zone 2: Clean unboxed metadata with typographic separators */}
      <div className="hidden md:flex items-center gap-2 text-xs text-stone-600 truncate max-w-2xl font-sans-body">
        {currentPaper ? (
          <>
            <span className="font-medium text-stone-900 truncate max-w-xs" title={currentPaper.title}>
              {currentPaper.title}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate max-w-[180px] text-stone-500">
              {currentPaper.authors?.[0] || 'Unknown Author'}
              {currentPaper.authors && currentPaper.authors.length > 1 ? ` et al.` : ''}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500 font-mono-code tabular-nums">
              {currentPaper.year || '2026'}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500 font-mono-code tabular-nums">
              {currentPaper.pages?.length || 1} {currentPaper.pages?.length === 1 ? 'page' : 'pages'}
            </span>
          </>
        ) : (
          <span className="text-stone-400 italic">No document loaded · Select a landmark paper or upload a PDF</span>
        )}
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenBenchmarkSelect}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          title="Select from pre-indexed seminal papers"
        >
          <BookOpen className="w-3.5 h-3.5 text-stone-600" />
          <span>Benchmarks</span>
        </button>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 hover:border-stone-400 bg-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
        >
          <FileUp className="w-3.5 h-3.5 text-stone-600" />
          <span>Upload PDF</span>
        </button>

        {hasAnalysis && (
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
