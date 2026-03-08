/**
 * 🧠 NLP Classifier
 * 
 * Takes the raw user query and returns structured metadata:
 *   { language, type, level }
 * 
 * This maps directly to the system prompt template variables:
 *   {language} {type} {level}
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type DetectedLanguage =
    | 'JavaScript'
    | 'Python'
    | 'HTML'
    | 'CSS'
    | 'C++'
    | 'Arduino C++';

export type DetectedType =
    | 'concept'        // "what is a loop?"
    | 'debugging'      // "my code gives an error"
    | 'project'        // "make a calculator"
    | 'explanation';   // everything else

export type DetectedLevel =
    | 'beginner'
    | 'intermediate'
    | 'advanced';

export interface ClassifiedQuery {
    language: DetectedLanguage;
    type: DetectedType;
    level: DetectedLevel;
}

// ─── Language Classifier ───────────────────────────────────────────────────────

const LANGUAGE_SIGNALS: Array<{ lang: DetectedLanguage; keywords: string[] }> = [
    {
        lang: 'Arduino C++',
        keywords: [
            'arduino', 'void setup', 'void loop', 'digitalwrite', 'digitalread',
            'analogread', 'analogwrite', 'pinmode', 'serial.print', 'delay(',
            'sensor', 'breadboard', 'resistor', 'led', 'servo', 'motor',
            'nodemcu', 'esp32', 'esp8266', 'raspberry',
        ],
    },
    {
        lang: 'C++',
        keywords: [
            'c++', '#include', 'int main', 'cout', 'cin', 'std::', 'vector',
            'namespace', 'pointer', '*ptr', 'malloc', 'endl',
        ],
    },
    {
        lang: 'Python',
        keywords: [
            'python', 'print(', 'def ', 'elif', 'import ', 'pip ', 'turtle',
            'django', 'flask', 'numpy', 'pandas', 'matplotlib', 'range(',
            'list comprehension', 'lambda', 'indentation', 'indent',
        ],
    },
    {
        lang: 'HTML',
        keywords: [
            'html', '<!doctype', '<div', '<head>', '<body>', '<p>', '<h1',
            'href=', 'src=', 'html tag', 'webpage', 'anchor', '<a ', '<img',
            '<form', '<input', '<button', 'attribute',
        ],
    },
    {
        lang: 'CSS',
        keywords: [
            'css', 'style', 'flexbox', 'flex', 'grid', 'margin:', 'padding:',
            'border-radius', 'selector', 'class selector', 'id selector',
            'animation', 'keyframe', 'media query', 'responsive',
            'display:', 'position:', 'z-index', 'rgba(', 'hex color',
        ],
    },
    {
        lang: 'JavaScript',
        keywords: [
            'javascript', ' js ', '.js', 'console.log', 'addeventlistener',
            'document.', 'innerhtml', 'getelementbyid', 'queryselector',
            'const ', 'let ', 'var ', 'arrow function', '=>', 'promise',
            'async', 'await', 'fetch(', 'json', 'dom', 'event listener',
        ],
    },
];

function classifyLanguage(q: string): DetectedLanguage {
    const lq = q.toLowerCase();
    for (const { lang, keywords } of LANGUAGE_SIGNALS) {
        if (keywords.some((kw) => lq.includes(kw))) return lang;
    }
    return 'JavaScript'; // sensible default for kids
}

// ─── Type Classifier ───────────────────────────────────────────────────────────

function classifyType(q: string): DetectedType {
    const lq = q.toLowerCase();

    const debugSignals = [
        'error', 'bug', 'fix', 'broken', 'not working', 'problem', 'issue',
        'wrong output', 'crash', "doesn't work", 'undefined', 'null',
        'traceback', 'exception', 'syntax error', 'why does', 'why is',
        'fails', 'help me fix', 'what went wrong',
    ];
    const projectSignals = [
        'make a', 'build a', 'create a', 'write a', 'develop a',
        'project', 'app', 'game', 'website', 'calculator', 'quiz',
        'program', 'todo', 'to-do', 'simulation', 'chatbot', 'blink',
    ];
    const conceptSignals = [
        'what is', 'what are', 'what does', 'explain', 'tell me',
        'difference between', 'when to use', 'why do we', 'how does',
        'meaning of', 'define', 'understand',
    ];

    if (debugSignals.some((s) => lq.includes(s))) return 'debugging';
    if (projectSignals.some((s) => lq.includes(s))) return 'project';
    if (conceptSignals.some((s) => lq.includes(s))) return 'concept';
    return 'explanation';
}

// ─── Level Classifier ─────────────────────────────────────────────────────────

function classifyLevel(q: string): DetectedLevel {
    const lq = q.toLowerCase();

    const advancedSignals = [
        'recursion', 'recursive', 'linked list', 'binary tree', 'algorithm',
        'complexity', 'big o', 'pointer', 'memory allocation', 'multithreading',
        'concurrency', 'async await', 'promise chain', 'prototype', 'closure',
        'oop', 'inheritance', 'polymorphism', 'encapsulation', 'data structure',
        'api', 'rest api', 'graphql', 'interrupt', 'timer register', 'bitwise',
    ];
    const beginnerSignals = [
        'what is', 'how to', 'simple', 'basic', 'first time', 'beginner',
        'hello world', 'start coding', 'learn', 'explain to me', 'as a kid',
        'for kids', 'easy', 'simple example', 'variable', 'print', 'output',
        'blink led',
    ];

    if (advancedSignals.some((s) => lq.includes(s))) return 'advanced';
    if (beginnerSignals.some((s) => lq.includes(s))) return 'beginner';
    return 'intermediate';
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function classify(rawQuery: string): ClassifiedQuery {
    return {
        language: classifyLanguage(rawQuery),
        type: classifyType(rawQuery),
        level: classifyLevel(rawQuery),
    };
}
