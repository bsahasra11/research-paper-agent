import React, { useMemo } from 'react';
import katex from 'katex';

interface LaTeXRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({
  content,
  className = '',
  block = false,
}) => {
  // If block is explicitly true, treat the whole content as LaTeX block
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    if (block) {
      try {
        return katex.renderToString(content.trim(), {
          displayMode: true,
          throwOnError: false,
        });
      } catch (err) {
        console.error('KaTeX render error:', err);
        return `<pre class="text-xs text-rose-600">${content}</pre>`;
      }
    }

    // Process mixed markdown/latex text with $$...$$ (display) and $...$ (inline)
    try {
      // First replace block equations: $$...$$ or \[...\]
      let processed = content;

      // Match block math: $$...$$
      processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="my-3 overflow-x-auto py-1 text-center">${katex.renderToString(
            math.trim(),
            { displayMode: true, throwOnError: false }
          )}</div>`;
        } catch {
          return `$$${math}$$`;
        }
      });

      // Match block math: \[...\]
      processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
        try {
          return `<div class="my-3 overflow-x-auto py-1 text-center">${katex.renderToString(
            math.trim(),
            { displayMode: true, throwOnError: false }
          )}</div>`;
        } catch {
          return `\\[${math}\\]`;
        }
      });

      // Match inline math: $...$ (avoiding double $$ and currency like $100)
      processed = processed.replace(/(?<!\$)\$([^\$\n]+?)\$(?!\$)/g, (_, math) => {
        // Simple sanity check: if it looks like currency like "$20 or $50", don't render as math
        if (/^\d+(\.\d+)?(\s*(million|billion|k|M|B))?$/i.test(math.trim())) {
          return `$${math}$`;
        }
        try {
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `$${math}$`;
        }
      });

      // Match inline math: \(...\)
      processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `\\(${math}\\)`;
        }
      });

      // Preserve clean linebreaks if not inside tags
      return processed.replace(/\n\n/g, '<br/><br/>');
    } catch (e) {
      console.error('Error parsing LaTeX content:', e);
      return content;
    }
  }, [content, block]);

  return (
    <div
      className={`leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default LaTeXRenderer;
