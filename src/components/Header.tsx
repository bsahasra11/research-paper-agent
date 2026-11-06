import React from 'react';
import { PaperDocument } from '../types/paper';

interface HeaderProps {
  currentPaper: PaperDocument | null;
  onOpenUpload: () => void;
  onOpenExport: () => void;
  onOpenBenchmarkSelect: () => void;
  hasAnalysis: boolean;
}

export default function Header({
  currentPaper,
  onOpenUpload,
  onOpenExport,
  onOpenBenchmarkSelect,
  hasAnalysis
}: HeaderProps) {
  // Safely join authors without crashing if undefined or string
  const authorsText = Array.isArray(currentPaper?.authors)
    ? currentPaper.authors.join(', ')
    : currentPaper?.authors || 'Unknown Author';

  return (
    <header className="h-[57px] border-b border-stone-200 bg-white px-4 flex items-center justify-between z-10 shrink-0">
      {/* Left: App Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900 text-white font-serif font-bold text-base">
          Å
        </div>
        <div>
          <h1 className="font-serif text-sm font-semibold text-stone-900 leading-tight">
            Research Paper Agent
          </h1>
          <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">
            Gemini CoT Synthesis
          </p>
        </div>
      </div>

      {/* Center: Current Document Meta */}
      {currentPaper && (
        <div className="hidden md:flex flex-col items-center max-w-md truncate">
          <span className="text-xs font-medium text-stone-800 truncate max-w-xs">
            {currentPaper.title || 'Untitled Document'}
          </span>
          <span className="text-[11px] text-stone-500 truncate max-w-xs">
            {authorsText} {currentPaper.year ? `(${currentPaper.year})` : ''}
          </span>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenBenchmarkSelect}
          className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-md border border-stone-200 transition-colors"
        >
          Benchmarks
        </button>
        <button
          onClick={onOpenUpload}
          className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-md border border-stone-200 transition-colors flex items-center gap-1.5"
        >
          <span>Upload PDF</span>
        </button>
        {hasAnalysis && (
          <button
            onClick={onOpenExport}
            className="px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors"
          >
            Export
          </button>
        )}
      </div>
    </header>
  );
}
