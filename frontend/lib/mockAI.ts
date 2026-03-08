/**
 * 🤖 AI Lesson Generator
 *
 * Pipeline:
 *   🎤 Voice/Text Input
 *     ↓
 *   🧠 NLP Classifier    (nlpClassifier.ts)  → {language, type, level}
 *     ↓
 *   📦 Context Builder   (contextBuilder.ts) → QueryContext
 *     ↓
 *   🌐 API Route         (/api/mentor)       → Gemini 1.5 Flash
 *     ↓
 *   🎨 Structured Lesson (3 steps → AIResponseCard)
 *
 * Falls back to local mock templates if the API is unavailable.
 */

import { ChatMessage, ResponseStep } from '@/store/useAppStore';
import { classify } from './nlpClassifier';
import { buildContext, QueryContext } from './contextBuilder';

// ─── Gemini API Call ──────────────────────────────────────────────────────────

async function callGeminiAPI(ctx: QueryContext, messages: ChatMessage[]): Promise<ResponseStep[] | null> {
  try {
    const apiMessages = messages.map(m => ({
      role: m.role,
      content: m.role === 'assistant' && m.steps ? JSON.stringify({
        step1: {
          title: m.steps[0]?.title || '',
          content: m.steps[0]?.content || ''
        },
        step2: {
          title: m.steps[1]?.title || '',
          content: m.steps[1]?.content || ''
        },
        step3: {
          title: m.steps[2]?.title || '',
          content: m.steps[2]?.content || '',
          language: m.steps[2]?.language || ''
        }
      }) : m.content
    }));

    const res = await fetch('/api/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: apiMessages,
        language: ctx.language,
        type: ctx.type,
        level: ctx.level,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.steps && Array.isArray(data.steps)) {
      return data.steps as ResponseStep[];
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Local Fallback Templates ─────────────────────────────────────────────────
// Used when GEMINI_API_KEY is not set or the API call fails

function buildFallbackSteps(ctx: QueryContext): ResponseStep[] {
  const tag = `${ctx.difficultyTag} · ${ctx.emoji} ${ctx.language}`;

  const codeByLang: Record<string, string> = {
    python: `# Python Example
def greet(name):
    return f"Hello, {name}! 👋"

print(greet("Coder"))

# Loop example
for i in range(1, 6):
    print(f"Count: {i}")`,

    javascript: `// JavaScript Example
function greet(name) {
  return \`Hello, \${name}! 👋\`;
}
console.log(greet("Coder"));

// Loop example
for (let i = 1; i <= 5; i++) {
  console.log(\`Count: \${i}\`);
}`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World! 🌍</h1>
  <button onclick="alert('You clicked me!')">Click Me!</button>
</body>
</html>`,

    css: `/* CSS Example */
body {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #6C63FF, #00C2FF);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}`,

    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    for (int i = 1; i <= 5; i++) {
        cout << "Count: " << i << endl;
    }
    return 0;
}`,

    arduino: `// Arduino Blink
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(13, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`,
  };

  const code = codeByLang[ctx.langKey] ?? codeByLang['javascript'];

  return [
    {
      id: 'explanation',
      title: `STEP 1 – ${ctx.isDebugging ? 'Understanding the Error 🔍' : ctx.isProject ? 'Planning Your Project 🗺️' : 'Simple Explanation'}`,
      content: `${tag}\n\nGreat question about **"${ctx.userInput}"** in ${ctx.language}!\n\n${ctx.isDebugging
        ? 'When debugging, always:\n• Read the error message — it tells you the exact line\n• Add console.log() / print() to check variable values\n• Look for missing brackets, colons, or semicolons\n\n**You\'ve got this! 💪**'
        : ctx.isProject
          ? 'Great project idea! Before writing code, plan:\n• 🎯 What should it do?\n• 📦 What data do we need?\n• ⚙️ What functions/actions?\n\n**Let\'s build it step by step! 💪**'
          : `${ctx.language} is a powerful language that lets you give computers precise instructions.\n\nThink of it like writing a recipe 🍳 — the computer follows each step exactly.\n\n**You\'ve got this! 💪**`
        }`,
    },
    {
      id: 'example',
      title: `STEP 2 – ${ctx.isDebugging ? 'Before & After Fix' : ctx.isProject ? 'Step-by-Step Plan' : 'Small Example'}`,
      content: `Here's a simple breakdown for **"${ctx.userInput}"**:\n\n• Start with the smallest version that works\n• Test after every few lines\n• Comment your code to explain what each part does\n• Errors are normal — read them carefully, they're clues!\n\n**Pro tip 🐤:** Add print() or console.log() to see what's happening inside your code.`,
    },
    {
      id: 'code',
      title: 'STEP 3 – Full Working Code',
      content: code,
      language: ctx.langKey,
    },
  ];
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Main entry point — called from app/page.tsx on every submission.
 *
 * 1. Classifies the query (language, type, level)
 * 2. Builds a rich context object
 * 3. Tries Gemini API first (real AI response)
 * 4. Falls back to local templates if API is unavailable
 */
/**
 * Modifies the AI wrapper to send the full message history to the backend.
 */
export async function generateLesson(messages: ChatMessage[]): Promise<ResponseStep[]> {
  // Grab the last user message to determine context
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1];
  const rawQuery = lastUserMessage?.content || '';

  // Stage 1: NLP Classifier
  const classified = classify(rawQuery);

  // Stage 2: Context Builder
  const ctx = buildContext(rawQuery, classified);

  // Stage 3: Try real Ollama API
  let steps = await callGeminiAPI(ctx, messages);

  // Stage 4: Fallback to local mock if needed
  if (!steps) {
    console.error('⚠️ USING MOCK DATA — OLLAMA API FAILED OR IS NOT RUNNING');
    console.error('👉 To get FULL AI responses, ensure Ollama is running and OLLAMA_URL/OLLAMA_MODEL are set in .env.local');
    steps = buildFallbackSteps(ctx);
  }

  return steps;
}

// Keep for backward compat if anything still imports the old name
export const generateMockLesson = generateLesson;
