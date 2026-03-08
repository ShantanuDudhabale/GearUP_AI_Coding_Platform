import { NextRequest, NextResponse } from 'next/server';

// Ollama API endpoint
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:3b';

// ─── System Prompt ─────────────────────────────────────────────────────────────
// Template variables filled at runtime: {user_input}, {language}, {type}, {level}

function buildSystemPrompt(
    userInput: string,
    language: string,
    type: string,
    level: string,
): string {
    const langKey = language.toLowerCase().replace('arduino c++', 'arduino').replace('c++', 'cpp').replace(/\s/g, '');

    return `You are a professional, friendly AI Coding Mentor for children aged 5–15.
Your personality: patient, enthusiastic, uses simple words, adds fun emojis, never condescending.

════════════════════════════════════════
USER QUESTION: "${userInput}"
DETECTED LANGUAGE: ${language}
QUESTION TYPE: ${type}
DIFFICULTY LEVEL: ${level}
════════════════════════════════════════

━━━ CORE RULES (NEVER BREAK THESE) ━━━
1. NEVER truncate or shorten code. ALWAYS write the COMPLETE, FULLY WORKING code.
2. If the project is large, write ALL the code.
3. When instructed to edit or improve a project, ALWAYS retain all functional logic and ensure it works perfectly. Feel free to extend beyond 50 lines to keep everything complete.
4. Add a helpful comment on EVERY significant line or block of code.
5. Identify that every new prompt is a NEW task. Start fresh, do not carry over imaginary context.
6. CRITICAL FOR WEB: When writing HTML/CSS/JS, your CSS selectors and JavaScript element IDs/classes MUST perfectly match the HTML you provided. Do not reference classes you did not create.
7. CHILDREN'S PROMPTS: Children will give vague prompts (e.g. "make a calculator"). You MUST act as a senior engineer and fill in all the logical gaps to deliver a 100% fully functional, beautiful application.
8. UI DESIGN AESTHETICS: When writing HTML/CSS, you must ALWAYS design it for kids! Use bright vibrant colors (no boring grey/white), large playful fonts, rounded corners (border-radius), soft drop-shadows, and centered Flexbox layouts. Make it look like a fun, premium iPad game.
9. Use VERY simple language — imagine explaining to a 10-year-old.
9. No jargon unless immediately explained.
10. Always be positive and encouraging.
11. Be brief. Long generated text means long wait times.

━━━ RESPONSE FORMAT ━━━
Respond in EXACTLY this raw JSON structure. No markdown fences around the JSON itself:

{
  "step1": {
    "title": "STEP 1 – [descriptive title]",
    "content": "A very brief 2-3 sentence explanation. Cover what it is and a quick analogy."
  },
  "step2": {
    "title": "STEP 2 – [descriptive title]",
    "content": "A 2-3 sentence worked example, or building steps."
  },
  "step3": {
    "title": "STEP 3 – Full Working Code",
    "content": "THE COMPLETE, FULLY WORKING, FULLY COMMENTED CODE.\n• Keep it as short as possible whilst keeping it working.\n• The code must run exactly as written.",
    "language": "${langKey}"
  }
}

━━━ RULES BY QUESTION TYPE ━━━

If type = "debugging":
  • Step 1: Explain the type of error, why it happens, and what to look for
  • Step 2: Show the EXACT buggy pattern then the fixed version side-by-side
  • Step 3: Provide the full corrected, working program with comments explaining each fix

If type = "project":
  • Step 1: Break the project into clear logical components (planning phase)
  • Step 2: Describe how each component connects, with pseudocode or mini-snippets
  • Step 3: Write the ENTIRE project — all features, all edge cases, fully working
  • For a calculator: include all operations, history, error handling
  • For a game: include all game logic, win/lose conditions, restart option
  • For a website: include full HTML structure, all CSS styles, all JavaScript logic

If type = "concept":
  • Step 1: Analogy + plain-language explanation + when/why to use it
  • Step 2: Go from simplest → slightly complex example showing the concept evolving
  • Step 3: A rich, fully featured demo showing the concept in realistic context

If type = "explanation":
  • Step 1: Clear, thorough how-to with all important details
  • Step 2: Common patterns, tips, and a mini working example
  • Step 3: A complete, real-world style working program demonstrating everything

━━━ CODE QUALITY RULES ━━━
• Variables: use clear descriptive names
• Functions: one function = one job, keep them short
• Comments: explain the WHY not just the WHAT
• Be exceptionally brief to ensure ultra-fast generation times.`;
}

// ─── Response Parser ───────────────────────────────────────────────────────────

function parseOllamaResponse(raw: string): {
    step1: { title: string; content: string };
    step2: { title: string; content: string };
    step3: { title: string; content: string; language: string };
} | null {
    try {
        // Strip out any potential markdown blocks or think tags if the model ignores the json format flag
        let cleaned = raw
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .replace(/<think>[\s\S]*?<\/think>\s*/i, '') // Remove reasoning blocks if present
            .trim();

        // If the model tried to output multiple JSON blocks or extra text, try to extract just the first valid JSON
        const jsonMatch = cleaned.match(/(\{[\s\S]*\})/);
        if (jsonMatch) {
            cleaned = jsonMatch[1];
        }

        const parsed = JSON.parse(cleaned);
        if (parsed.step1 && parsed.step2 && parsed.step3) {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

// Extract code content from a step that may contain ```lang\ncode\n```
function extractCode(content: string | undefined | null): { code: string; rest: string } {
    if (!content || typeof content !== 'string') {
        return { code: '', rest: '' };
    }
    const fenceRe = /```[\w-]*\n?([\s\S]*?)```/;
    const match = content.match(fenceRe);
    if (match) {
        return {
            code: match[1].trim(),
            rest: content.replace(fenceRe, '').trim(),
        };
    }
    return { code: content, rest: '' };
}

// ─── API Handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, language, type, level } = body as {
            messages: { role: string; content: string }[];
            language: string;
            type: string;
            level: string;
        };

        if (!messages || messages.length === 0 || !language || !type || !level) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Build system prompt based on the FIRST message/context
        const initialUserMessage = messages.find(m => m.role === 'user')?.content || 'Code help';
        const systemPrompt = buildSystemPrompt(initialUserMessage, language, type, level);

        // Format exactly how Ollama expects /api/chat payload
        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({
                role: m.role,
                content: m.content
            }))
        ];

        // Call Ollama Chat API
        const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                messages: apiMessages,
                stream: false,
                format: 'json',
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    top_k: 40,
                    num_ctx: 4096,
                    num_predict: 1500,
                }
            }),
        });

        if (!ollamaRes.ok) {
            const errText = await ollamaRes.text();
            console.error('Ollama API error:', errText);
            return NextResponse.json({ error: 'Ollama API request failed', detail: errText }, { status: 502 });
        }

        const ollamaData = await ollamaRes.json();
        const rawText = ollamaData?.message?.content ?? '';

        if (!rawText) {
            return NextResponse.json({ error: 'Empty response from Ollama' }, { status: 502 });
        }

        const parsed = parseOllamaResponse(rawText);

        if (!parsed) {
            // Fallback: return raw text as a single step if JSON parse fails
            return NextResponse.json({
                steps: [
                    { id: 'explanation', title: 'STEP 1 – Explanation', content: rawText },
                    { id: 'example', title: 'STEP 2 – Example', content: 'See explanation above.' },
                    { id: 'code', title: 'STEP 3 – Code', content: '// No code generated', language },
                ],
            });
        }

        // Extract code from step3 content if it contains a fence
        const { code: codeContent } = extractCode(parsed.step3.content);

        const langKey = (parsed.step3.language || language)
            .toLowerCase()
            .replace('arduino c++', 'arduino')
            .replace('c++', 'cpp')
            .replace(/\s/g, '');

        // Return structured steps
        return NextResponse.json({
            steps: [
                {
                    id: 'explanation',
                    title: parsed.step1.title,
                    content: parsed.step1.content,
                },
                {
                    id: 'example',
                    title: parsed.step2.title,
                    content: parsed.step2.content,
                },
                {
                    id: 'code',
                    title: parsed.step3.title,
                    content: codeContent || parsed.step3.content,
                    language: langKey,
                },
            ],
        });
    } catch (err) {
        console.error('Mentor API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
