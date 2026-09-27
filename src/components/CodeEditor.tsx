import React, { useEffect, useRef, useState } from 'react';
import { createHighlighter, type BundledLanguage, type BundledTheme, type HighlighterGeneric } from 'shiki';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';
import { getHoverInfo, type HoverInfo } from '../lib/hover-data';
import { getColorForIndex, getBorderColorForIndex, getActiveColorForIndex } from '../lib/mapping';
import type { Mapping } from '../lib/gemini-client';

interface CodeEditorProps {
  code: string;
  language: string;
  mappings?: Mapping[];
  hoveredMapping?: string | null;
  onMappingHover?: (mappingId: string | null) => void;
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
  'luau': 'lua',
  'csharp-unity': 'csharp',
};

interface TooltipData {
  word: string;
  info: HoverInfo;
  x: number;
  y: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  language, 
  mappings = [],
  hoveredMapping,
  onMappingHover 
}) => {
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<BundledLanguage, BundledTheme> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Inicializar Shiki
  useEffect(() => {
    const initHighlighter = async () => {
      const hl = await createHighlighter({
        themes: ['github-dark'],
        langs: Object.values(languageMap),
      });
      setHighlighter(hl);
    };
    initHighlighter();

    return () => {
      highlighter?.dispose();
    };
  }, []);

  // Renderizar código con Shiki, mappings y hover
  useEffect(() => {
    if (!highlighter || !codeContainerRef.current) return;

    const shikiLang = languageMap[language] || 'text';
    const lines = code.split('\n');
    
    // Crear HTML con mappings
    let html = '<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8"><code>';
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const mappingIndex = mappings.findIndex(m => 
        lineNum >= m.code_lines[0] && lineNum <= m.code_lines[1]
      );
      
      const isFirstLineOfMapping = mappingIndex >= 0 && lineNum === mappings[mappingIndex].code_lines[0];
      const isHovered = mappingIndex >= 0 && hoveredMapping === mappings[mappingIndex]?.id;
      
      // Agregar label arriba si es la primera línea
      if (isFirstLineOfMapping && mappings[mappingIndex]?.label) {
        const labelColor = getBorderColorForIndex(mappingIndex);
        html += `<div style="padding:2px 8px;font-size:11px;font-weight:600;color:${labelColor};background:${getColorForIndex(mappingIndex)}">← ${mappings[mappingIndex].label}</div>`;
      }
      
      // Background color para la línea
      const bgColor = mappingIndex >= 0 ? (isHovered ? getActiveColorForIndex(mappingIndex) : getColorForIndex(mappingIndex)) : 'transparent';
      
      html += `<div class="code-line" data-line="${lineNum}" data-mapping="${mappingIndex}" style="background:${bgColor};padding:2px 8px;transition:background 0.15s">`;
      
      // Resaltar la línea con Shiki
      const lineHtml = highlighter.codeToHtml(line, { lang: shikiLang, theme: 'github-dark' });
      // Extraer solo el contenido del <code>
      const codeMatch = lineHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
      html += codeMatch ? codeMatch[1] : line;
      
      html += '</div>';
    });
    
    html += '</code></pre>';
    codeContainerRef.current.innerHTML = html;

    // Agregar event listeners para hover en tokens y mappings
    const cleanupFunctions: (() => void)[] = [];

    // Hover para tooltips en tokens
    const tokens = codeContainerRef.current.querySelectorAll('.shiki span');
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

    // Hover para mappings
    const codeLines = codeContainerRef.current.querySelectorAll('.code-line');
    codeLines.forEach((lineEl) => {
      const htmlLine = lineEl as HTMLElement;
      const mappingIdx = parseInt(htmlLine.dataset.mapping || '-1');
      
      if (mappingIdx >= 0 && mappings[mappingIdx]) {
        const handleMouseEnter = () => {
          onMappingHover?.(mappings[mappingIdx].id);
        };
        
        const handleMouseLeave = () => {
          onMappingHover?.(null);
        };
        
        htmlLine.addEventListener('mouseenter', handleMouseEnter);
        htmlLine.addEventListener('mouseleave', handleMouseLeave);
        
        cleanupFunctions.push(() => {
          htmlLine.removeEventListener('mouseenter', handleMouseEnter);
          htmlLine.removeEventListener('mouseleave', handleMouseLeave);
        });
      }
    });

    return () => {
      cleanupFunctions.forEach(fn => fn());
    };
  }, [code, language, highlighter, mappings, hoveredMapping]);

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
        className="code-editor-content overflow-auto"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          minHeight: '400px',
        }}
      />
      
      {tooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-xl p-3 max-w-xs text-sm pointer-events-none border border-gray-700"
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
