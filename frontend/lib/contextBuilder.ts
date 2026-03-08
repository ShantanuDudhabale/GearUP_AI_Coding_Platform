/**
 * 📦 Context Builder
 * 
 * Takes raw query + NLP classification and assembles a structured
 * context object — the "prompt" that gets passed to the response generator.
 * 
 * This is the bridge between classifier output and the LLM layer.
 */

import { ClassifiedQuery, DetectedLanguage, DetectedType, DetectedLevel } from './nlpClassifier';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface QueryContext {
    // Raw input
    userInput: string;

    // NLP results (template variables from system prompt)
    language: DetectedLanguage;
    type: DetectedType;
    level: DetectedLevel;

    // Derived metadata
    langKey: string;          // e.g. 'javascript' for code highlighting
    emoji: string;          // Visual tag for the language
    difficultyTag: string;         // e.g. '🟢 Beginner'
    intentLabel: string;          // e.g. 'Project Request'
    topicKeyword: string;          // Main extracted keyword ('loop', 'function', etc.)

    // Flags for response shaping
    isDebugging: boolean;
    isProject: boolean;
    isConcept: boolean;

    // Applicable sub-topic
    subTopic: SubTopic;
}

export type SubTopic =
    | 'loop' | 'function' | 'variable' | 'condition'
    | 'array' | 'class' | 'calculator' | 'quiz'
    | 'todo' | 'website' | 'game' | 'led'
    | 'sensor' | 'flexbox' | 'grid' | 'generic';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LANG_KEY_MAP: Record<DetectedLanguage, string> = {
    'JavaScript': 'javascript',
    'Python': 'python',
    'HTML': 'html',
    'CSS': 'css',
    'C++': 'cpp',
    'Arduino C++': 'arduino',
};

const LANG_EMOJI: Record<DetectedLanguage, string> = {
    'JavaScript': '⚡',
    'Python': '🐍',
    'HTML': '🌐',
    'CSS': '🎨',
    'C++': '💻',
    'Arduino C++': '🤖',
};

const DIFFICULTY_TAGS: Record<DetectedLevel, string> = {
    beginner: '🟢 Beginner',
    intermediate: '🟡 Intermediate',
    advanced: '🔴 Advanced',
};

const INTENT_LABELS: Record<DetectedType, string> = {
    concept: 'Concept Explanation',
    debugging: 'Debugging',
    project: 'Project Request',
    explanation: 'How-To Explanation',
};

function extractSubTopic(q: string): SubTopic {
    const lq = q.toLowerCase();
    const checks: Array<[string[], SubTopic]> = [
        [['for loop', 'while loop', 'loop', 'repeat', 'iterate', 'range('], 'loop'],
        [['function', 'def ', 'arrow function', '=>', 'method'], 'function'],
        [['variable', 'const ', 'let ', 'var ', 'declare', 'store'], 'variable'],
        [['if ', 'else', 'condition', 'boolean', 'true', 'false', 'conditional'], 'condition'],
        [['array', 'list', 'vector', 'slice', 'push', 'pop', 'index'], 'array'],
        [['class', 'object', 'oop', 'inheritance', 'instance'], 'class'],
        [['calculator', 'calc', 'add', 'subtract', 'multiply', 'divide', 'math'], 'calculator'],
        [['quiz', 'trivia', 'question'], 'quiz'],
        [['todo', 'to-do', 'task list', 'checklist'], 'todo'],
        [['website', 'webpage', 'html page', 'web page'], 'website'],
        [['game', 'mini game', 'simon', 'snake', 'tic tac'], 'game'],
        [['led', 'blink', 'light'], 'led'],
        [['sensor', 'analog', 'digital', 'read value', 'temperature'], 'sensor'],
        [['flex', 'flexbox'], 'flexbox'],
        [['grid', 'css grid'], 'grid'],
    ];
    for (const [keywords, topic] of checks) {
        if (keywords.some((kw) => lq.includes(kw))) return topic;
    }
    return 'generic';
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function buildContext(
    rawQuery: string,
    classified: ClassifiedQuery,
): QueryContext {
    const { language, type, level } = classified;

    return {
        userInput: rawQuery.trim(),
        language,
        type,
        level,

        langKey: LANG_KEY_MAP[language],
        emoji: LANG_EMOJI[language],
        difficultyTag: DIFFICULTY_TAGS[level],
        intentLabel: INTENT_LABELS[type],
        topicKeyword: extractSubTopic(rawQuery),

        isDebugging: type === 'debugging',
        isProject: type === 'project',
        isConcept: type === 'concept',

        subTopic: extractSubTopic(rawQuery),
    };
}
