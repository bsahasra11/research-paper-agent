import * as pdfjsLib from 'pdfjs-dist';
import { PaperDocument } from '../types/paper';

// Set up pdf.js worker URL using CDN to avoid bundling complications
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

export async function parsePdfFile(file: File): Promise<PaperDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const numPages = pdfDoc.numPages;
  const pages: { pageNumber: number; text: string }[] = [];
  let fullText = '';

  for (let i = 1; i <= Math.min(numPages, 40); i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ');

    pages.push({
      pageNumber: i,
      text: pageText,
    });
    fullText += `\n--- PAGE ${i} ---\n` + pageText;
  }

  // Attempt to extract title and metadata from the first page
  const firstPageText = pages[0]?.text || '';
  const titleCandidate = extractTitle(firstPageText, file.name);

  // Extract author candidates
  const authors = extractAuthors(firstPageText);

  // Extract abstract candidate
  const abstract = extractAbstract(firstPageText, fullText);

  const formattedFileSize = formatBytes(file.size);

  return {
    id: `upload-${Date.now()}`,
    title: titleCandidate,
    authors: authors.length > 0 ? authors : ['Authors extracted from document'],
    year: extractYear(firstPageText) || new Date().getFullYear().toString(),
    abstract: abstract || 'Abstract extracted directly from document text.',
    pages,
    rawText: fullText.trim(),
    fileSize: formattedFileSize,
    isBenchmark: false,
  };
}

function extractTitle(firstPageText: string, fallbackFileName: string): string {
  if (!firstPageText) {
    return fallbackFileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
  }

  // Look for prominent lines before "Abstract" or "Author"
  const lines = firstPageText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0 && lines[0].length > 10 && lines[0].length < 150) {
    return lines[0];
  }

  // Fallback to searching first 300 characters
  const match = firstPageText.match(/^([A-Z0-9\s:,\-?]{10,120})(?=\s+(by|[A-Z][a-z]+|Abstract))/i);
  if (match && match[1]) {
    return match[1].trim();
  }

  return fallbackFileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
}

function extractAuthors(text: string): string[] {
  // Simple heuristic searching for common author patterns
  const authorMatch = text.match(/by\s+([A-Z][a-z]+\s+[A-Z][a-z]+(?:,\s+[A-Z][a-z]+\s+[A-Z][a-z]+)*)/i);
  if (authorMatch && authorMatch[1]) {
    return authorMatch[1].split(/,\s*/);
  }
  return [];
}

function extractAbstract(firstPageText: string, fullText: string): string {
  const combined = firstPageText + ' ' + fullText.slice(0, 3000);
  const match = combined.match(/abstract[:\s\n]+([\s\S]{50,1200}?)(?=(?:1\.?\s+|introduction|keywords|i\.\s+))/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return combined.slice(0, 500) + '...';
}

function extractYear(text: string): string | null {
  const match = text.match(/\b(20[12]\d|199\d)\b/);
  return match ? match[1] : null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
