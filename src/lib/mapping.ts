import type { Mapping } from './gemini-client';

export const MAPPING_COLORS = [
  'rgba(59, 130, 246, 0.15)',
  'rgba(234, 179, 8, 0.15)',
  'rgba(168, 85, 247, 0.15)',
  'rgba(236, 72, 153, 0.15)',
  'rgba(6, 182, 212, 0.15)',
  'rgba(249, 115, 22, 0.15)',
  'rgba(34, 197, 94, 0.15)',
  'rgba(99, 102, 241, 0.15)',
];

export const MAPPING_BORDER_COLORS = [
  'rgba(59, 130, 246, 0.6)',
  'rgba(234, 179, 8, 0.6)',
  'rgba(168, 85, 247, 0.6)',
  'rgba(236, 72, 153, 0.6)',
  'rgba(6, 182, 212, 0.6)',
  'rgba(249, 115, 22, 0.6)',
  'rgba(34, 197, 94, 0.6)',
  'rgba(99, 102, 241, 0.6)',
];

export const MAPPING_ACTIVE_COLORS = [
  'rgba(59, 130, 246, 0.35)',
  'rgba(234, 179, 8, 0.35)',
  'rgba(168, 85, 247, 0.35)',
  'rgba(236, 72, 153, 0.35)',
  'rgba(6, 182, 212, 0.35)',
  'rgba(249, 115, 22, 0.35)',
  'rgba(34, 197, 94, 0.35)',
  'rgba(99, 102, 241, 0.35)',
];

export function getColorForIndex(index: number): string {
  return MAPPING_COLORS[index % MAPPING_COLORS.length];
}

export function getBorderColorForIndex(index: number): string {
  return MAPPING_BORDER_COLORS[index % MAPPING_BORDER_COLORS.length];
}

export function getActiveColorForIndex(index: number): string {
  return MAPPING_ACTIVE_COLORS[index % MAPPING_ACTIVE_COLORS.length];
}

export function validateMappings(
  mappings: Mapping[],
  pseudocodeLineCount: number,
  codeLineCount: number
): Mapping[] {
  const valid: Mapping[] = [];
  const usedPseudoRanges: [number, number][] = [];
  const usedCodeRanges: [number, number][] = [];

  for (const mapping of mappings) {
    const [pStart, pEnd] = mapping.pseudocode_lines;
    const [cStart, cEnd] = mapping.code_lines;

    if (pStart < 1 || pEnd > pseudocodeLineCount || pStart > pEnd) continue;
    if (cStart < 1 || cEnd > codeLineCount || cStart > cEnd) continue;

    const pseudoOverlap = usedPseudoRanges.some(
      ([s, e]) => !(pEnd < s || pStart > e)
    );
    const codeOverlap = usedCodeRanges.some(
      ([s, e]) => !(cEnd < s || cStart > e)
    );

    if (!pseudoOverlap && !codeOverlap) {
      valid.push(mapping);
      usedPseudoRanges.push([pStart, pEnd]);
      usedCodeRanges.push([cStart, cEnd]);
    }
  }

  return valid;
}
