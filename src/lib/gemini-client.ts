export interface Mapping {
  id: string;
  pseudocode_lines: [number, number];
  code_lines: [number, number];
  label?: string;
}

export interface TranslationResult {
  generated_code: string;
  mappings: Mapping[];
}

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish',
  en: 'English',
  zh: 'Chinese (Simplified)',
};

export async function translatePseudocode(
  apiKey: string,
  pseudocode: string,
  targetLanguage: string = 'python',
  userLanguage: string = 'es'
): Promise<TranslationResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
  const langName = LANGUAGE_NAMES[userLanguage] || userLanguage;

  const prompt = `You are a code translation assistant. Convert the following pseudo-code into valid ${targetLanguage} code.

IMPORTANT: Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "generated_code": "string (valid ${targetLanguage} code)",
  "mappings": [
    {
      "id": "fragment_1",
      "pseudocode_lines": [start_line, end_line],
      "code_lines": [start_line, end_line],
      "label": "brief description"
    }
  ]
}

Rules:
- Line numbers are 1-indexed
- Each mapping connects a range of pseudo-code lines to a range of generated code lines
- Mappings must not overlap
- Include all lines in mappings
- Labels should be brief (2-5 words) and MUST be written in ${langName}
- Generate clean, idiomatic ${targetLanguage} code

Pseudo-code to translate:
${pseudocode}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) throw new Error('No response from API');

  try {
    const result = JSON.parse(text) as TranslationResult;
    return result;
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as TranslationResult;
    }
    throw new Error('Failed to parse API response');
  }
}

export async function askAssistant(
  apiKey: string,
  pseudocode: string,
  generatedCode: string,
  question: string,
  history: Array<{ role: string; text: string }>,
  userLanguage: string = 'es'
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
  const langName = LANGUAGE_NAMES[userLanguage] || userLanguage;

  const systemPrompt = `You are a contextual coding assistant for CodeBridge. You help students understand the relationship between pseudo-code and generated code.

CURRENT CONTEXT:
--- Pseudo-code ---
${pseudocode}
--- Generated Code ---
${generatedCode}
---

Rules:
- Only answer questions related to the pseudo-code and code shown above
- Explain WHY certain translations were made
- Be concise, direct, and educational
- If the question is unrelated to the code context, politely redirect
- Respond STRICTLY in ${langName}`;

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "I understand. I'll help explain the relationship between the pseudo-code and generated code." }] },
  ];

  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  contents.push({ role: "user", parts: [{ text: question }] });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.3 }
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}

export async function generateFragmentDetails(
  apiKey: string,
  pseudocode: string,
  generatedCode: string,
  fragmentLabel: string,
  fragmentPseudocode: string,
  fragmentCode: string,
  userLanguage: string = 'es'
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
  const langName = LANGUAGE_NAMES[userLanguage] || userLanguage;

  const prompt = `You are a code documentation inspector (like a VS Code hover tooltip docs window).
Provide a direct, concise, to-the-point technical overview for the selected fragment.

FRAGMENT: "${fragmentLabel}"

PSEUDO-CODE:
${fragmentPseudocode}

GENERATED CODE:
${fragmentCode}

INSTRUCTIONS:
1. Act like a VS Code hover documentation tooltip.
2. DO NOT use conversational greetings, preamble, or filler text (e.g. do NOT say "En este fragmento...", "Esta sección es para...", "Hola").
3. Go STRAIGHT to the essential technical facts:
   - What this fragment specifically does (1 short line)
   - Core language syntax / documentation reference (1-2 bullet points)
   - Key variables/types involved (1 short line)
4. Keep the total output brief (maximum 3-5 lines).
5. Use clean Markdown formatting (e.g. **bold** for key terms, \`code\` for variables and syntax, bullet points).
6. You MUST respond STRICTLY in ${langName}.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}
