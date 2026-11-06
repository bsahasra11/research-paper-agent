import React from 'react';
import { PaperDocument } from '../types/paper';

interface PdfViewerProps {
  currentPaper: PaperDocument | null;
  onSelectPaper: (paper: PaperDocument) => void;
  onFileUpload: (file: File) => void;
  isParsingPdf: boolean;
}

export default function PdfViewer({
  currentPaper,
  onSelectPaper,
  onFileUpload,
  isParsingPdf
}: PdfViewerProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Safely format authors list
  const authorsList = Array.isArray(currentPaper?.authors)
    ? currentPaper.authors.join(', ')
    : currentPaper?.authors || 'Uploaded Document';

  return (
    <div className="h-full flex flex-col bg-stone-50 border-r border-stone-200 overflow-hidden">
      {/* Hidden file input */}
      <input
        id="pdf-file-input"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {isParsingPdf ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-stone-800">Extracting PDF text...</p>
          <p className="text-xs text-stone-500 mt-1">Preparing Chain-of-Thought input context</p>
        </div>
      ) : currentPaper ? (
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Document Header Info */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs mb-4">
            <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-stone-100 text-stone-600 rounded mb-2 uppercase">
              Active Document
            </span>
            <h2 className="font-serif text-lg font-bold text-stone-900 mb-2 leading-snug">
              {currentPaper.title || 'Untitled Document'}
            </h2>
            <p className="text-xs text-stone-600 mb-1 font-medium">
              {authorsList}
            </p>
            {currentPaper.year && (
              <p className="text-xs text-stone-400 font-mono">{currentPaper.year}</p>
            )}
          </div>

          {/* Abstract / Extracted Text Preview */}
          <div className="flex-1 bg-white p-5 rounded-lg border border-stone-200 shadow-xs overflow-y-auto">
            <h3 className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Extracted Abstract / Text
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed font-serif whitespace-pre-wrap">
              {currentPaper.abstract || currentPaper.rawText || 'No text content available.'}
            </p>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-xs flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-stone-200/60 flex items-center justify-center mb-4 text-stone-600 font-serif text-xl">
              📄
            </div>
            <h3 className="font-serif text-base font-semibold text-stone-900 mb-1">
              No Document Selected
            </h3>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Upload a research paper PDF to analyze its methodology, core problem, and findings.
            </p>
            <label
              htmlFor="pdf-file-input"
              className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded-md hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
            >
              Select PDF File
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
