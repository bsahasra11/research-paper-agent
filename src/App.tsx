import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PdfViewer from './components/PdfViewer';
import CotAnalysisPanel from './components/CotAnalysisPanel';
import ExportModal from './components/ExportModal';
import BenchmarkModal from './components/BenchmarkModal';
import { PaperDocument, PaperAnalysisResult } from './types/paper';
import { LANDMARK_PAPERS } from './data/landmarkPapers';
import { parsePdfFile } from './utils/pdfParser';

export default function App() {
  // Default to seminal paper "Attention Is All You Need" for instant exploration
  const [currentPaper, setCurrentPaper] = useState<PaperDocument | null>(LANDMARK_PAPERS[0]);
  const [currentAnalysis, setCurrentAnalysis] = useState<PaperAnalysisResult | null>(
    LANDMARK_PAPERS[0].precomputedAnalysis || null
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isParsingPdf, setIsParsingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState<boolean>(false);

  // Mobile pane switcher (tabs on mobile viewports)
  const [mobileActivePane, setMobileActivePane] = useState<'doc' | 'cot'>('cot');

  // Trigger server-side Gemini Chain-of-Thought analysis
  const executeAnalysis = useCallback(async (paper: PaperDocument) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperTitle: paper.title,
          authors: paper.authors,
          year: paper.year,
          rawText: paper.rawText,
          pages: paper.pages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with status ${response.status}: Failed to generate analysis.`
        );
      }

      const result: PaperAnalysisResult = await response.json();
      setCurrentAnalysis(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      // If server error or offline, fallback to precomputed if available
      if (paper.precomputedAnalysis) {
        setCurrentAnalysis(paper.precomputedAnalysis);
        setError(
          `Live server request notice: ${err.message}. Loaded precomputed benchmark analysis verified on Gemini 3.8 Flash.`
        );
      } else {
        setError(err.message || 'Failed to complete paper analysis.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Handle uploaded PDF file
  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please upload a valid PDF document (.pdf file format).');
      return;
    }

    setIsParsingPdf(true);
    setError(null);

    try {
      const parsedPaper = await parsePdfFile(file);
      setCurrentPaper(parsedPaper);
      setCurrentAnalysis(null);

      // Automatically initiate Chain-of-Thought reasoning
      await executeAnalysis(parsedPaper);
      setMobileActivePane('cot');
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      setError(
        err.message ||
          'Failed to extract text from the PDF file. Please ensure the document contains searchable text.'
      );
    } finally {
      setIsParsingPdf(false);
    }
  };

  // Open file selector
  const triggerFileInput = () => {
    const input = document.getElementById('pdf-file-input') as HTMLInputElement | null;
    if (input) {
      input.click();
    }
  };

  // Switch active paper
  const handleSelectPaper = (paper: PaperDocument) => {
    setCurrentPaper(paper);
    if (paper.precomputedAnalysis) {
      setCurrentAnalysis(paper.precomputedAnalysis);
      setError(null);
    } else {
      executeAnalysis(paper);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        triggerFileInput();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (currentAnalysis) {
          setIsExportModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAnalysis]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#FBFBF9] text-stone-900 overflow-hidden font-sans-body">
      {/* 3-Zone Editorial Top Bar */}
      <Header
        currentPaper={currentPaper}
        onOpenUpload={triggerFileInput}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenBenchmarkSelect={() => setIsBenchmarkModalOpen(true)}
        hasAnalysis={Boolean(currentAnalysis)}
      />

      {/* Mobile Screen Segmented Switcher */}
      <div className="flex lg:hidden items-center justify-center p-2 bg-stone-100 border-b border-stone-200">
        <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-lg text-xs w-full max-w-xs">
          <button
            onClick={() => setMobileActivePane('doc')}
            className={`flex-1 py-1.5 rounded-md font-medium text-center transition-colors ${
              mobileActivePane === 'doc'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Document Viewer
          </button>
          <button
            onClick={() => setMobileActivePane('cot')}
            className={`flex-1 py-1.5 rounded-md font-medium text-center transition-colors ${
              mobileActivePane === 'cot'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            CoT Analysis {isAnalyzing && '●'}
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Scholarly Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-57px)]">
        {/* Left Pane: PDF Document Stage (5 cols on desktop) */}
        <section
          className={`lg:col-span-5 h-full overflow-hidden ${
            mobileActivePane === 'doc' ? 'block' : 'hidden lg:block'
          }`}
        >
          <PdfViewer
            currentPaper={currentPaper}
            onSelectPaper={handleSelectPaper}
            onFileUpload={handleFileUpload}
            isParsingPdf={isParsingPdf}
          />
        </section>

        {/* Right Pane: 5-Step Chain-of-Thought Synthesis Stage (7 cols on desktop) */}
        <section
          className={`lg:col-span-7 h-full overflow-hidden ${
            mobileActivePane === 'cot' ? 'block' : 'hidden lg:block'
          }`}
        >
          <CotAnalysisPanel
            analysis={currentAnalysis}
            isAnalyzing={isAnalyzing}
            onTriggerAnalysis={() => currentPaper && executeAnalysis(currentPaper)}
            onOpenExport={() => setIsExportModalOpen(true)}
            error={error}
          />
        </section>
      </main>

      {/* Academic Export Modal */}
      {isExportModalOpen && currentAnalysis && (
        <ExportModal
          analysis={currentAnalysis}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Benchmark Selection Modal */}
      {isBenchmarkModalOpen && (
        <BenchmarkModal
          currentPaperId={currentPaper?.id || null}
          onSelectPaper={handleSelectPaper}
          onClose={() => setIsBenchmarkModalOpen(false)}
        />
      )}
    </div>
  );
}
