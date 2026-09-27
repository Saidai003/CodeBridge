import React, { useEffect, useRef, useState } from 'react';
import { createHighlighter, type BundledLanguage, type BundledTheme, type HighlighterGeneric } from 'shiki';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { getHoverInfo, type HoverInfo } from '../lib/hover-data';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

// Mapeo de lenguajes personalizados a lenguajes de Shiki
const languageMap: Record<string, BundledLanguage> = {
  'python': 'python',
  'javascript': 'javascript',
  'typescript': 'typescript',
  'java': 'java',
  'cpp': 'cpp',
  'csharp': 'csharp',
  'go': 'go',
  'ruby': 'ruby',
  'php': 'php',
  'swift': 'swift',
  'kotlin': 'kotlin',
  'luau': 'lua', // Luau es similar a Lua
  'csharp-unity': 'csharp', // Unity usa C#
};

interface TooltipData {
  word: string;
  info: HoverInfo;
  x: number;
  y: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, readOnly = false }) => {
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<BundledLanguage, BundledTheme> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Inicializar Shiki
  useEffect(() => {
    const initHighlighter = async () => {
      const hl = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: Object.values(languageMap),
      });
      setHighlighter(hl);
    };
    initHighlighter();

    return () => {
      highlighter?.dispose();
    };
  }, []);

  // Renderizar código con Shiki y agregar event listeners
  useEffect(() => {
    if (!highlighter || !codeContainerRef.current) return;

    const shikiLang = languageMap[language] || 'text';
    const html = highlighter.codeToHtml(code, {
      lang: shikiLang,
      theme: 'github-dark',
    });

    codeContainerRef.current.innerHTML = html;

    // Agregar event listeners para hover en cada token
    const tokens = codeContainerRef.current.querySelectorAll('.shiki span');
    const cleanupFunctions: (() => void)[] = [];

    tokens.forEach((token) => {
      const htmlToken = token as HTMLElement;
      
      const handleMouseEnter = () => {
        const text = htmlToken.textContent || '';
        const hoverInfo = getHoverInfo(text);
        
        if (hoverInfo) {
          const rect = htmlToken.getBoundingClientRect();
          setTooltip({
            word: text,
            info: hoverInfo,
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
        }
      };

      const handleMouseLeave = () => {
        setTooltip(null);
      };

      htmlToken.addEventListener('mouseenter', handleMouseEnter);
      htmlToken.addEventListener('mouseleave', handleMouseLeave);

      cleanupFunctions.push(() => {
        htmlToken.removeEventListener('mouseenter', handleMouseEnter);
        htmlToken.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    return () => {
      cleanupFunctions.forEach(fn => fn());
    };
  }, [code, language, highlighter]);

  // Posicionar tooltip con Floating UI
  useEffect(() => {
    if (!tooltip || !tooltipRef.current) return;

    const virtualElement = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: tooltip.y,
        left: tooltip.x,
        right: tooltip.x,
        bottom: tooltip.y,
      }),
    };

    computePosition(virtualElement as any, tooltipRef.current, {
      placement: 'top',
      middleware: [offset(10), flip(), shift()],
    }).then(({ x, y }) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.left = `${x}px`;
        tooltipRef.current.style.top = `${y}px`;
      }
    });
  }, [tooltip]);

  return (
    <div className="relative">
      <div
        ref={codeContainerRef}
        className="code-editor-content"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          padding: '16px',
          overflow: 'auto',
          minHeight: '400px',
        }}
      />
      
      {tooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-xl p-3 max-w-xs text-sm pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-bold text-blue-300 mb-1">{tooltip.word}</div>
          {tooltip.info.signature && (
            <code className="text-xs text-green-300 block mb-1">{tooltip.info.signature}</code>
          )}
          <p className="text-gray-300">{tooltip.info.description}</p>
          <a
            href={tooltip.info.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs mt-1 inline-flex items-center gap-1 hover:underline"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Docs
          </a>
        </div>
      )}
    </div>
  );
};
