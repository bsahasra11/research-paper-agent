import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Search,
  BookOpen,
  Upload,
  Check,
} from 'lucide-react';
import { PaperDocument } from '../types/paper';
import { LANDMARK_PAPERS } from '../data/landmarkPapers';

interface PdfViewerProps {
  currentPaper: PaperDocument | null;
  onSelectPaper: (paper: PaperDocument) => void;
  onFileUpload: (file: File) => void;
  isParsingPdf: boolean;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  currentPaper,
  onSelectPaper,
  onFileUpload,
  isParsingPdf,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'paper' | 'raw'>('paper');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const totalPages = currentPaper?.pages?.length || 1;

  // Reset page when paper changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
  }, [currentPaper?.id]);

  const activePageText = useMemo(() => {
    if (!currentPaper || !currentPaper.pages || currentPaper.pages.length === 0) {
      return currentPaper?.rawText || '';
    }
    const target = currentPaper.pages.find((p) => p.pageNumber === currentPage);
    return target ? target.text : currentPaper.pages[0].text;
  }, [currentPaper, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileUpload(files[0]);
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-[#FAF9F6] border-r border-stone-200 relative ${
        isDragOver ? 'ring-2 ring-blue-700 ring-inset' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Benchmark Paper Quick Switcher Ribbon */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-stone-200 bg-stone-100/80 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-stone-700">
          <BookOpen className="w-3.5 h-3.5 text-stone-500" />
          <span>Paper Source:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[80%]">
          {LANDMARK_PAPERS.map((paper) => {
            const isSelected = currentPaper?.id === paper.id;
            return (
              <button
                key={paper.id}
                onClick={() => onSelectPaper(paper)}
                className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white font-medium shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/80'
                }`}
              >
                {paper.id === 'attention-is-all-you-need'
                  ? 'Transformer (2017)'
                  : paper.id === 'lora-low-rank-adaptation'
                  ? 'LoRA (2021)'
                  : 'FlashAttention (2022)'}
              </button>
            );
          })}
          {currentPaper && !currentPaper.isBenchmark && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-900 text-white font-medium whitespace-nowrap shrink-0">
              <Check className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{currentPaper.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar: Page navigation & Zoom */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-200 bg-white text-xs">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono-code tabular-nums text-stone-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-0.5 bg-stone-100 rounded border border-stone-200">
          <button
            onClick={() => setViewMode('paper')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'paper' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Document
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'raw' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Raw Layer
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 text-stone-600">
          <button
            onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
            className="p-1 rounded hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono-code text-[11px] tabular-nums text-stone-500 min-w-[35px] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
            className="p-1 rounded hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(100)}
            className="p-1 rounded hover:bg-stone-100 hover:text-stone-900 ml-1 cursor-pointer"
            title="Reset to 100%"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* In-Document Search Bar */}
      <div className="px-4 py-2 border-b border-stone-200 bg-[#FAF9F6] flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter paper text (e.g. 'attention', 'Table 1', 'BLEU', 'matrix')..."
          className="w-full text-xs bg-transparent border-none outline-none text-stone-800 placeholder:text-stone-400 font-sans-body"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Document Viewport Area */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start">
        {isParsingPdf ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-stone-800">Parsing PDF Document</p>
            <p className="text-xs text-stone-500 mt-1">Extracting text layers, pages, and metadata...</p>
          </div>
        ) : !currentPaper ? (
          <div className="flex flex-col items-center justify-center h-80 text-center max-w-sm border-2 border-dashed border-stone-300 rounded-xl p-8 bg-white/60">
            <Upload className="w-8 h-8 text-stone-400 mb-3" />
            <h4 className="text-sm font-semibold text-stone-800">No Paper Loaded</h4>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Drag and drop an academic PDF document here, or choose one of the pre-indexed benchmark papers above.
            </p>
          </div>
        ) : viewMode === 'raw' ? (
          /* Raw Extracted Text Layer View */
          <div
            className="w-full max-w-2xl bg-white border border-stone-200 rounded-lg p-5 font-mono-code text-xs leading-relaxed text-stone-800 whitespace-pre-wrap shadow-xs overflow-x-auto"
            style={{ fontSize: `${(zoomLevel / 100) * 12}px` }}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 text-stone-400 text-[11px]">
              <span>RAW EXTRACTED TEXT · PAGE {currentPage}</span>
              <span>{activePageText.length} characters</span>
            </div>
            {searchQuery
              ? highlightText(activePageText, searchQuery)
              : activePageText}
          </div>
        ) : (
          /* Scholarly Formatted Academic Paper Viewer */
          <div
            className="w-full max-w-2xl bg-white border border-stone-300 rounded-sm shadow-md transition-all duration-150 p-10 font-sans-body min-h-[700px]"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Academic Paper First Page Header */}
            {currentPage === 1 && (
              <div className="text-center pb-6 mb-6 border-b border-stone-200">
                <h1 className="font-serif-scholarly text-xl md:text-2xl font-bold tracking-tight text-stone-900 leading-snug">
                  {currentPaper.title}
                </h1>
                <div className="mt-3 text-xs text-stone-600 font-sans-body flex flex-wrap justify-center gap-x-2 gap-y-1">
                  {currentPaper.authors.map((author, idx) => (
                    <span key={idx}>
                      {author}
                      {idx < currentPaper.authors.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
                {currentPaper.venue && (
                  <p className="mt-2 text-[11px] text-stone-400 uppercase tracking-wider font-mono-code">
                    {currentPaper.venue}
                  </p>
                )}

                {/* Abstract Section Box */}
                {currentPaper.abstract && (
                  <div className="mt-6 mx-auto max-w-xl text-left bg-stone-50 border-t border-b border-stone-200 p-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                      Abstract
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans-body">
                      {searchQuery
                        ? highlightText(currentPaper.abstract, searchQuery)
                        : currentPaper.abstract}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Page Body Content */}
            <div className="text-xs leading-loose text-stone-800 whitespace-pre-wrap font-sans-body">
              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-mono-code mb-4">
                Section Excerpt · Page {currentPage}
              </div>
              {searchQuery
                ? highlightText(activePageText, searchQuery)
                : activePageText}
            </div>

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400 font-mono-code">
              <span>{currentPaper.title.slice(0, 30)}...</span>
              <span>— {currentPage} —</span>
              <span>ScholarCoT Viewer</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="pdf-file-input"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-200 text-stone-900 rounded-xs px-0.5 font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default PdfViewer;
