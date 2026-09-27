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
  theme?: 'light' | 'dark';
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
  onMappingHover,
  theme = 'dark'
}) => {
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<BundledLanguage, BundledTheme> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Inicializar Shiki una sola vez
  useEffect(() => {
    let hl: HighlighterGeneric<BundledLanguage, BundledTheme> | null = null;
    
    const initHighlighter = async () => {
      hl = await createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: Object.values(languageMap),
      });
      setHighlighter(hl);
    };
    
    initHighlighter();

    return () => {
      hl?.dispose();
    };
  }, []);

  // Renderizar código con Shiki (solo cuando cambie el código, lenguaje o tema)
  useEffect(() => {
    if (!codeContainerRef.current) return;

    const shikiLang = languageMap[language] || 'text';
    const lines = code.split('\n');
    
    // Si Shiki no está listo, mostrar código sin highlighting
    if (!highlighter) {
      const bgColor = theme === 'dark' ? '#24292e' : '#ffffff';
      const textColor = theme === 'dark' ? '#e1e4e8' : '#24292e';
      let html = `<pre style="padding:16px;background:${bgColor};color:${textColor};margin:0"><code>`;
      lines.forEach((line, idx) => {
        html += `<div style="padding:2px 8px">${line || ' '}</div>`;
      });
      html += '</code></pre>';
      codeContainerRef.current.innerHTML = html;
      return;
    }

    // Crear HTML con mappings
    const shikiTheme = theme === 'dark' ? 'github-dark' : 'github-light';
    const bgColor = theme === 'dark' ? '#24292e' : '#ffffff';
    const textColor = theme === 'dark' ? '#e1e4e8' : '#24292e';
    let html = `<pre class="shiki ${shikiTheme}" style="background-color:${bgColor};color:${textColor};padding:0;margin:0"><code>`;
    
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const mappingIndex = mappings.findIndex(m => 
        lineNum >= m.code_lines[0] && lineNum <= m.code_lines[1]
      );
      
      const isFirstLineOfMapping = mappingIndex >= 0 && lineNum === mappings[mappingIndex].code_lines[0];
      
      // Agregar label arriba si es la primera línea
      if (isFirstLineOfMapping && mappings[mappingIndex]?.label) {
        const labelColor = getBorderColorForIndex(mappingIndex);
        html += `<div style="padding:2px 8px;font-size:11px;font-weight:600;color:${labelColor};background:${getColorForIndex(mappingIndex)}">← ${mappings[mappingIndex].label}</div>`;
      }
      
      html += `<div class="code-line" data-line="${lineNum}" data-mapping="${mappingIndex}" style="padding:2px 8px;transition:background 0.15s">`;
      
      // Resaltar la línea con Shiki
      const lineHtml = highlighter.codeToHtml(line, { lang: shikiLang, theme: shikiTheme });
      const codeMatch = lineHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
      html += codeMatch ? codeMatch[1] : line;
      
      html += '</div>';
    });
    
    html += '</code></pre>';
    codeContainerRef.current.innerHTML = html;
  }, [code, language, highlighter, theme, mappings]);

  // Actualizar solo los estilos cuando cambie hoveredMapping (sin re-renderizar todo)
  useEffect(() => {
    if (!codeContainerRef.current) return;

    const codeLines = codeContainerRef.current.querySelectorAll('.code-line');
    codeLines.forEach((lineEl) => {
      const htmlLine = lineEl as HTMLElement;
      const mappingIdx = parseInt(htmlLine.dataset.mapping || '-1');
      
      if (mappingIdx >= 0 && mappings[mappingIdx]) {
        const isHovered = hoveredMapping === mappings[mappingIdx].id;
        const lineBgColor = isHovered ? getActiveColorForIndex(mappingIdx) : getColorForIndex(mappingIdx);
        htmlLine.style.background = lineBgColor;
      } else {
        htmlLine.style.background = 'transparent';
      }
    });
  }, [hoveredMapping, mappings]);

  // Event delegation para hover (mucho más eficiente)
  useEffect(() => {
    if (!codeContainerRef.current) return;

    const container = codeContainerRef.current;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Hover para mappings
      const codeLine = target.closest('.code-line');
      if (codeLine) {
        const mappingIdx = parseInt((codeLine as HTMLElement).dataset.mapping || '-1');
        if (mappingIdx >= 0 && mappings[mappingIdx]) {
          onMappingHover?.(mappings[mappingIdx].id);
        }
      }
      
      // Hover para tooltips en tokens
      if (target.tagName === 'SPAN' && target.closest('.shiki')) {
        const text = target.textContent || '';
        const hoverInfo = getHoverInfo(text);
        
        if (hoverInfo) {
          const rect = target.getBoundingClientRect();
          setTooltip({
            word: text,
            info: hoverInfo,
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      
      // Solo limpiar si realmente salimos del elemento
      if (!target.contains(relatedTarget)) {
        if (target.closest('.code-line')) {
          onMappingHover?.(null);
        }
        if (target.tagName === 'SPAN' && target.closest('.shiki')) {
          setTooltip(null);
        }
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mappings, onMappingHover]);

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
