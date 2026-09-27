import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Code2, Play, Key, Heart, Share2, Sparkles, ChevronDown,
  BookOpen, Globe, Terminal, Loader2, Check, ExternalLink
} from 'lucide-react';
import { Language, t } from './i18n';
import { translatePseudocode, type Mapping, type TranslationResult } from './lib/gemini-client';
import { validateMappings, getColorForIndex, getActiveColorForIndex } from './lib/mapping';
import { getHoverInfo } from './lib/hover-data';
import { executePython, initPyodide } from './lib/pyodide';
import { Tutorial } from './components/Tutorial';
import { Assistant } from './components/Assistant';

// Demo data for landing
const DEMO_PSEUDO = `Set list numbers to [1, 2, 3, 4, 5]
Set total to 0
For each number in numbers:
  Add number to total
Show total`;

const DEMO_CODE = `numbers = [1, 2, 3, 4, 5]
total = 0
for number in numbers:
    total += number
print(total)`;

const DEMO_MAPPINGS: Mapping[] = [
  { id: 'm1', pseudocode_lines: [1, 1], code_lines: [1, 1], label: 'Variable setup' },
  { id: 'm2', pseudocode_lines: [2, 2], code_lines: [2, 2], label: 'Initialize total' },
  { id: 'm3', pseudocode_lines: [3, 4], code_lines: [3, 4], label: 'Loop & accumulate' },
  { id: 'm4', pseudocode_lines: [5, 5], code_lines: [5, 5], label: 'Output result' },
];

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('codebridge_lang');
    return (saved as Language) || 'es';
  });
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('codebridge_apikey') || '');
  const [pseudocode, setPseudocode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredMapping, setHoveredMapping] = useState<string | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ word: string; info: any; x: number; y: number } | null>(null);

  const studioRef = useRef<HTMLDivElement>(null);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('codebridge_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('codebridge_apikey', apiKey);
  }, [apiKey]);

  // Check tutorial
  useEffect(() => {
    const seen = localStorage.getItem('codebridge_tutorial_seen');
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  // Init Pyodide
  useEffect(() => {
    initPyodide().catch(() => {});
  }, []);

  // Load Pyodide script
  useEffect(() => {
    if (!document.querySelector('script[src*="pyodide"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      document.head.appendChild(script);
    }
  }, []);

  const scrollToStudio = () => {
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleComplete = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }
    if (!pseudocode.trim()) return;

    setIsGenerating(true);
    try {
      const result: TranslationResult = await translatePseudocode(apiKey, pseudocode);
      const pseudoLines = pseudocode.split('\n').length;
      const codeLines = result.generated_code.split('\n').length;
      const validMappings = validateMappings(result.mappings || [], pseudoLines, codeLines);
      
      setGeneratedCode(result.generated_code);
      setMappings(validMappings);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecute = async () => {
    if (!generatedCode.trim()) return;
    setIsExecuting(true);
    setOutput('');
    try {
      const result = await executePython(generatedCode);
      setOutput(result);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleShare = () => {
    const text = t('shareText', lang);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTutorialNext = () => {
    if (tutorialStep < 5) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      localStorage.setItem('codebridge_tutorial_seen', 'true');
    }
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
    localStorage.setItem('codebridge_tutorial_seen', 'true');
  };

  // Handle hover on code editor
  const handleCodeEditorHover = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const token = target.closest('.mtk1, .mtk6, .mtk11, .mtk22, span');
    if (token) {
      const word = token.textContent?.trim() || '';
      const info = getHoverInfo(word);
      if (info) {
        setHoverInfo({ word, info, x: e.clientX, y: e.clientY });
        return;
      }
    }
    setHoverInfo(null);
  }, []);

  // Render line with mapping colors
  const renderColoredLines = (text: string, lineMappings: Mapping[], side: 'pseudo' | 'code') => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const lineNum = idx + 1;
      const mappingIndex = lineMappings.findIndex(m => {
        const range = side === 'pseudo' ? m.pseudocode_lines : m.code_lines;
        return lineNum >= range[0] && lineNum <= range[1];
      });
      
      const bgColor = mappingIndex >= 0 ? getColorForIndex(mappingIndex) : 'transparent';
      const isHovered = mappingIndex >= 0 && hoveredMapping === lineMappings[mappingIndex]?.id;
      const hoverBg = isHovered && mappingIndex >= 0 ? getActiveColorForIndex(mappingIndex) : bgColor;

      return (
        <div
          key={idx}
          className={`px-3 py-0.5 transition-colors duration-150 cursor-pointer ${isHovered ? 'ring-1 ring-inset ring-blue-400/30' : ''}`}
          style={{ backgroundColor: hoverBg }}
          onMouseEnter={() => {
            if (mappingIndex >= 0) setHoveredMapping(lineMappings[mappingIndex].id);
          }}
          onMouseLeave={() => setHoveredMapping(null)}
        >
          <span className="text-gray-800 dark:text-gray-200 font-mono text-sm whitespace-pre-wrap">{line || ' '}</span>
          {isHovered && lineMappings[mappingIndex]?.label && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic">
              ← {lineMappings[mappingIndex].label}
            </span>
          )}
        </div>
      );
    });
  };

  // Language selector
  const LanguageSelector = () => (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-gray-500" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Language)}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <Tutorial
          step={tutorialStep}
          lang={lang}
          onNext={handleTutorialNext}
          onSkip={handleTutorialSkip}
          totalSteps={6}
        />
      )}

      {/* Hover Tooltip */}
      {hoverInfo && (
        <div
          className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-xl p-3 max-w-xs text-sm pointer-events-none"
          style={{ left: hoverInfo.x + 12, top: hoverInfo.y - 10 }}
        >
          <div className="font-bold text-blue-300 mb-1">{hoverInfo.word}</div>
          {hoverInfo.info.signature && (
            <code className="text-xs text-green-300 block mb-1">{hoverInfo.info.signature}</code>
          )}
          <p className="text-gray-300">{hoverInfo.info.description}</p>
          <a
            href={hoverInfo.info.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs mt-1 inline-flex items-center gap-1 hover:underline"
          >
            <ExternalLink size={10} /> Docs
          </a>
        </div>
      )}

      {/* ====== LANDING SECTION ====== */}
      <section className="min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <Code2 size={28} className="text-blue-500" />
            <span className="text-xl font-bold">CodeBridge</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <a
              href="https://ko-fi.com/maximilianoabascal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Heart size={14} />
              {t('donateButton', lang)}
            </a>
          </div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="text-center max-w-3xl mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('landingTitle', lang)}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              {t('landingSubtitle', lang)}
            </p>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('landingDescription', lang)}
            </p>
          </div>

          {/* Demo */}
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-4 mb-12">
            {/* Pseudo-code demo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <BookOpen size={14} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('pseudoLabel', lang)}</span>
              </div>
              <div className="p-2">
                {renderColoredLines(DEMO_PSEUDO, DEMO_MAPPINGS, 'pseudo')}
              </div>
            </div>

            {/* Code demo */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Terminal size={14} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('codeLabel', lang)}</span>
              </div>
              <div className="p-2">
                {renderColoredLines(DEMO_CODE, DEMO_MAPPINGS, 'code')}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToStudio}
            className="flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles size={20} />
            {t('startButton', lang)}
            <ChevronDown size={20} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ====== STUDIO SECTION ====== */}
      <section ref={studioRef} className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Studio Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Code2 size={24} className="text-blue-500" />
              {t('studioTitle', lang)}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {/* API Key */}
              <div className="relative">
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    apiKey ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  <Key size={14} />
                  {apiKey ? '✓ API Key' : t('apiKeyLabel', lang)}
                </button>
                {showApiKeyInput && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-30">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      {t('apiKeyLabel', lang)}
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={t('apiKeyPlaceholder', lang)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      <ExternalLink size={10} />
                      {t('apiKeyHelp', lang)}
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <button
                onClick={handleComplete}
                disabled={isGenerating || !pseudocode.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {t('completeButton', lang)}
              </button>

              <button
                onClick={handleExecute}
                disabled={isExecuting || !generatedCode.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isExecuting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                {isExecuting ? t('executing', lang) : t('executeButton', lang)}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                {copied ? t('copied', lang) : t('shareButton', lang)}
              </button>

              <a
                href="https://ko-fi.com/maximilianoabascal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Heart size={14} />
                {t('donateButton', lang)}
              </a>
            </div>
          </div>

          {/* Editors Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Pseudo-code Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <BookOpen size={14} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('pseudoLabel', lang)}</span>
                {mappings.length > 0 && (
                  <span className="ml-auto text-xs text-gray-400">
                    {lang === 'es' ? 'Colores = mapeo con código' : lang === 'zh' ? '颜色 = 代码映射' : 'Colors = mapping to code'}
                  </span>
                )}
              </div>
              <div className="h-[400px] overflow-auto flex">
                {/* Line number indicators with mapping colors */}
                {mappings.length > 0 && (
                  <div className="flex-shrink-0 w-2 flex flex-col">
                    {pseudocode.split('\n').map((_, idx) => {
                      const lineNum = idx + 1;
                      const mappingIndex = mappings.findIndex(m => 
                        lineNum >= m.pseudocode_lines[0] && lineNum <= m.pseudocode_lines[1]
                      );
                      const bgColor = mappingIndex >= 0 ? getColorForIndex(mappingIndex) : 'transparent';
                      return (
                        <div
                          key={idx}
                          className="h-[1.625rem] transition-colors duration-150"
                          style={{ backgroundColor: bgColor }}
                          onMouseEnter={() => {
                            if (mappingIndex >= 0) setHoveredMapping(mappings[mappingIndex].id);
                          }}
                          onMouseLeave={() => setHoveredMapping(null)}
                        />
                      );
                    })}
                  </div>
                )}
                {/* Always editable textarea */}
                <textarea
                  value={pseudocode}
                  onChange={(e) => {
                    setPseudocode(e.target.value);
                    // Clear mappings when pseudo-code changes
                    if (mappings.length > 0) {
                      setMappings([]);
                    }
                  }}
                  placeholder={lang === 'es' ? 'Escribí tu pseudo-código acá...' : lang === 'zh' ? '在这里写你的伪代码...' : 'Write your pseudo-code here...'}
                  className="flex-1 h-full p-4 resize-none font-mono text-sm bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none placeholder-gray-400 whitespace-pre-wrap"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Generated Code */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Terminal size={14} className="text-green-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('codeLabel', lang)}</span>
                {generatedCode && (
                  <span className="ml-auto text-xs text-gray-400">
                    {lang === 'es' ? 'Pasá el mouse para explicaciones' : lang === 'zh' ? '悬停查看解释' : 'Hover for explanations'}
                  </span>
                )}
              </div>
              <div
                className="h-[400px] overflow-auto"
                onMouseMove={handleCodeEditorHover}
                onMouseLeave={() => setHoverInfo(null)}
              >
                {generatedCode ? (
                  mappings.length > 0 ? (
                    renderColoredLines(generatedCode, mappings, 'code')
                  ) : (
                    <pre className="p-4 font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {generatedCode}
                    </pre>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <div className="text-center">
                      <Code2 size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">
                        {lang === 'es' ? 'El código generado aparecerá acá' : lang === 'zh' ? '生成的代码将显示在这里' : 'Generated code will appear here'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output */}
          {output && (
            <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden mb-4">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Terminal size={14} />
                  {t('outputLabel', lang)}
                </span>
                <button
                  onClick={() => setOutput('')}
                  className="text-xs text-gray-400 hover:text-gray-200"
                >
                  {t('clearOutput', lang)}
                </button>
              </div>
              <pre className="p-4 text-sm text-green-400 font-mono whitespace-pre-wrap max-h-48 overflow-auto">
                {output}
              </pre>
            </div>
          )}

          {/* Generating indicator */}
          {isGenerating && (
            <div className="text-center py-4">
              <Loader2 size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">{t('generating', lang)}</p>
            </div>
          )}

          {/* Mapping Legend */}
          {mappings.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                {lang === 'es' ? 'Mapeo de fragmentos' : lang === 'zh' ? '片段映射' : 'Fragment Mapping'}
              </h4>
              <div className="flex flex-wrap gap-3">
                {mappings.map((m, i) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all hover:scale-105"
                    style={{ backgroundColor: getColorForIndex(i) }}
                    onMouseEnter={() => setHoveredMapping(m.id)}
                    onMouseLeave={() => setHoveredMapping(null)}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getColorForIndex(i).replace('0.15', '0.8') }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {m.label || `Fragment ${i + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center py-8 border-t border-gray-200 dark:border-gray-800 mt-8">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <a
                href="https://ko-fi.com/maximilianoabascal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Heart size={16} />
                {t('donateButton', lang)} — Ko-fi
              </a>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                {copied ? t('copied', lang) : t('shareButton', lang)}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              CodeBridge — {lang === 'es' ? 'Hecho con ❤️ para quienes aprenden a programar' : lang === 'zh' ? '为学编程的人用 ❤️ 制作' : 'Made with ❤️ for those learning to code'}
            </p>
          </footer>
        </div>
      </section>

      {/* Assistant */}
      <Assistant
        lang={lang}
        apiKey={apiKey}
        pseudocode={pseudocode}
        generatedCode={generatedCode}
        isOpen={assistantOpen}
        onToggle={() => setAssistantOpen(!assistantOpen)}
      />
    </div>
  );
}
