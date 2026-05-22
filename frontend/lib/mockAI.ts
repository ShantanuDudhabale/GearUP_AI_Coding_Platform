/**
 * AI Lesson Generator — calls Ollama directly via the backend proxy
 */

import { ChatMessage, ResponseStep } from '@/store/useAppStore';

const TIMEOUT_MS = 60000;

async function callOllama(query: string): Promise<ResponseStep[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const ollamaUrl = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://127.0.0.1:11434';
    const model = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'qwen2.5-coder:3b';

    const prompt = `You are a coding mentor for beginners aged 5-15. Answer this question in exactly 3 steps.

Question: ${query}

Respond ONLY with valid JSON in this exact format:
{
  "steps": [
    {
      "id": "explanation",
      "title": "STEP 1 – What is it?",
      "content": "Clear explanation here"
    },
    {
      "id": "example",
      "title": "STEP 2 – How does it work?",
      "content": "Detailed example here"
    },
    {
      "id": "code",
      "title": "STEP 3 – Code Example",
      "content": "// working code here",
      "language": "python"
    }
  ]
}`;

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text: string = data.response || '';

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.steps && Array.isArray(parsed.steps)) {
      return parsed.steps as ResponseStep[];
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateLesson(messages: ChatMessage[]): Promise<ResponseStep[]> {
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1];
  const query = lastUserMessage?.content || '';

  const steps = await callOllama(query);

  if (!steps) {
    // Ollama not running — return helpful error
    return [
      {
        id: 'explanation',
        title: 'STEP 1 – AI Not Available',
        content: `The AI mentor requires Ollama to be running.\n\n**To start Ollama:**\n\`\`\`\nollama serve\n\`\`\`\n\nThen pull the model:\n\`\`\`\nollama pull qwen2.5-coder:3b\n\`\`\`\n\nOnce running, refresh and try again!`,
      },
      {
        id: 'example',
        title: 'STEP 2 – Installation',
        content: `1. Download Ollama from https://ollama.ai\n2. Install it\n3. Run: \`ollama serve\`\n4. Pull model: \`ollama pull qwen2.5-coder:3b\`\n5. Refresh this page`,
      },
      {
        id: 'code',
        title: 'STEP 3 – Waiting for Ollama',
        content: `# Start Ollama to get AI responses\n# ollama serve\n# ollama pull qwen2.5-coder:3b`,
        language: 'bash',
      },
    ];
  }

  return steps;
}

export const generateMockLesson = generateLesson;
