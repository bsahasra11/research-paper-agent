import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, FileText } from 'lucide-react';
import { PaperAnalysisResult } from '../types/paper';
import {
  generateMarkdownReport,
  generateLaTeXDocument,
  downloadFile,
} from '../utils/exportGenerators';

interface ExportModalProps {
  analysis: PaperAnalysisResult;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ analysis, onClose }) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'latex' | 'json'>('markdown');
  const [copied, setCopied] = useState<boolean>(false);

  const markdownContent = React.useMemo(() => generateMarkdownReport(analysis), [analysis]);
  const latexContent = React.useMemo(() => generateLaTeXDocument(analysis), [analysis]);
  const jsonContent = React.useMemo(() => JSON.stringify(analysis, null, 2), [analysis]);

  const currentContent =
    activeTab === 'markdown'
      ? markdownContent
      : activeTab === 'latex'
      ? latexContent
      : jsonContent;

  const currentExtension =
    activeTab === 'markdown' ? 'md' : activeTab === 'latex' ? 'tex' : 'json';
  const currentMimeType =
    activeTab === 'markdown'
      ? 'text/markdown'
      : activeTab === 'latex'
      ? 'application/x-tex'
      : 'application/json';

  const sanitizedTitle = (analysis.paperTitle || 'paper-analysis')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  const handleDownload = () => {
    downloadFile(
      `${sanitizedTitle}-analysis.${currentExtension}`,
      currentContent,
      currentMimeType
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white border border-stone-300 rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[88vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <h3 className="font-serif-scholarly text-lg font-bold text-stone-900">
              Export Academic Analysis
            </h3>
            <p className="text-xs text-stone-500 font-sans-body mt-0.5">
              Structured Chain-of-Thought report for {analysis.paperTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-stone-50 border-b border-stone-200 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'markdown'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>
            <button
              onClick={() => setActiveTab('latex')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'latex'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>LaTeX (.tex)</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="font-mono-code font-bold text-[11px]">&#123;&#125;</span>
              <span>JSON Data</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-300 hover:bg-stone-50 rounded-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Preview Viewport */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#1C1917] text-stone-200 font-mono-code text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap">{currentContent}</pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>
            {activeTab === 'latex'
              ? 'Ready to compile in Overleaf or pdflatex (includes amsmath, booktabs)'
              : activeTab === 'markdown'
              ? 'GitHub-flavored academic markdown with KaTeX math markers'
              : 'Machine-readable structured JSON schema'}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
