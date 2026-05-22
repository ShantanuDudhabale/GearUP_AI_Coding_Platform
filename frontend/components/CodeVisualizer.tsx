'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipForward, RotateCcw, Code, Eye } from 'lucide-react';

interface VisualizationStep {
    line: number;
    code: string;
    description: string;
    variables: Record<string, unknown>;
    output?: string;
}

const exampleCode = {
    loop: `for (let i = 0; i < 5; i++) {
  console.log("Count: " + i);
}`,
    variables: `let name = "Alice";
let age = 10;
let greeting = "Hello, " + name;
console.log(greeting);
age = age + 1;
console.log("Next year: " + age);`,
    function: `function greet(name) {
  return "Hello, " + name + "!";
}

let message = greet("Bob");
console.log(message);`,
};

const visualizationData: Record<string, VisualizationStep[]> = {
    loop: [
        { line: 1, code: 'let i = 0', description: 'Initialize loop variable i to 0', variables: { i: 0 }, output: '' },
        { line: 1, code: 'i < 5', description: 'Check if i (0) is less than 5 → true', variables: { i: 0 }, output: '' },
        { line: 2, code: 'console.log("Count: " + i)', description: 'Print "Count: 0"', variables: { i: 0 }, output: 'Count: 0' },
        { line: 1, code: 'i++', description: 'Increment i from 0 to 1', variables: { i: 1 }, output: '' },
        { line: 1, code: 'i < 5', description: 'Check if i (1) is less than 5 → true', variables: { i: 1 }, output: '' },
        { line: 2, code: 'console.log("Count: " + i)', description: 'Print "Count: 1"', variables: { i: 1 }, output: 'Count: 1' },
        { line: 1, code: 'i++', description: 'Increment i from 1 to 2', variables: { i: 2 }, output: '' },
        { line: 1, code: 'i < 5', description: 'Check if i (2) is less than 5 → true', variables: { i: 2 }, output: '' },
        { line: 2, code: 'console.log("Count: " + i)', description: 'Print "Count: 2"', variables: { i: 2 }, output: 'Count: 2' },
        { line: 1, code: 'i++', description: 'Increment i from 2 to 3', variables: { i: 3 }, output: '' },
        { line: 1, code: 'i < 5', description: 'Check if i (3) is less than 5 → true', variables: { i: 3 }, output: '' },
        { line: 2, code: 'console.log("Count: " + i)', description: 'Print "Count: 3"', variables: { i: 3 }, output: 'Count: 3' },
        { line: 1, code: 'i++', description: 'Increment i from 3 to 4', variables: { i: 4 }, output: '' },
        { line: 1, code: 'i < 5', description: 'Check if i (4) is less than 5 → true', variables: { i: 4 }, output: '' },
        { line: 2, code: 'console.log("Count: " + i)', description: 'Print "Count: 4"', variables: { i: 4 }, output: 'Count: 4' },
        { line: 1, code: 'i++', description: 'Increment i from 4 to 5', variables: { i: 5 }, output: '' },
        { line: 1, code: 'i < 5', description: 'Check if i (5) is less than 5 → false, exit loop', variables: { i: 5 }, output: '' },
    ],
    variables: [
        { line: 1, code: 'let name = "Alice"', description: 'Create variable "name" and assign "Alice"', variables: { name: 'Alice' }, output: '' },
        { line: 2, code: 'let age = 10', description: 'Create variable "age" and assign 10', variables: { name: 'Alice', age: 10 }, output: '' },
        { line: 3, code: 'let greeting = "Hello, " + name', description: 'Create "greeting" by combining "Hello, " with name', variables: { name: 'Alice', age: 10, greeting: 'Hello, Alice' }, output: '' },
        { line: 4, code: 'console.log(greeting)', description: 'Print the greeting', variables: { name: 'Alice', age: 10, greeting: 'Hello, Alice' }, output: 'Hello, Alice' },
        { line: 5, code: 'age = age + 1', description: 'Add 1 to age (10 + 1 = 11)', variables: { name: 'Alice', age: 11, greeting: 'Hello, Alice' }, output: '' },
        { line: 6, code: 'console.log("Next year: " + age)', description: 'Print "Next year: 11"', variables: { name: 'Alice', age: 11, greeting: 'Hello, Alice' }, output: 'Next year: 11' },
    ],
    function: [
        { line: 1, code: 'function greet(name) { ... }', description: 'Define function "greet" that takes a name parameter', variables: {}, output: '' },
        { line: 5, code: 'let message = greet("Bob")', description: 'Call greet function with "Bob"', variables: {}, output: '' },
        { line: 2, code: 'return "Hello, " + name + "!"', description: 'Inside greet: combine "Hello, " + "Bob" + "!"', variables: { name: 'Bob' }, output: '' },
        { line: 5, code: 'message = "Hello, Bob!"', description: 'Function returns "Hello, Bob!" and stores in message', variables: { message: 'Hello, Bob!' }, output: '' },
        { line: 6, code: 'console.log(message)', description: 'Print the message', variables: { message: 'Hello, Bob!' }, output: 'Hello, Bob!' },
    ],
};

export default function CodeVisualizer() {
    const [selectedExample, setSelectedExample] = useState<'loop' | 'variables' | 'function'>('loop');
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [outputLines, setOutputLines] = useState<string[]>([]);

    const steps = visualizationData[selectedExample];
    const currentStepData = steps[currentStep];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            const nextStepData = steps[currentStep + 1];
            setCurrentStep(currentStep + 1);
            if (nextStepData.output) {
                setOutputLines(prev => [...prev, nextStepData.output!]);
            }
        } else {
            setIsPlaying(false);
        }
    };

    const reset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
        setOutputLines([]);
    };

    const playAnimation = () => {
        if (isPlaying) {
            setIsPlaying(false);
            return;
        }

        setIsPlaying(true);
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    return prev;
                }
                const nextStepData = steps[prev + 1];
                if (nextStepData.output) {
                    setOutputLines(prevOutput => [...prevOutput, nextStepData.output!]);
                }
                return prev + 1;
            });
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl">
                        <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Code Visualizer
                    </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    See how your code runs step-by-step
                </p>
            </div>

            {/* Example Selection */}
            <div className="flex gap-4 justify-center">
                {[
                    { key: 'loop' as const, label: 'For Loop', icon: '🔄' },
                    { key: 'variables' as const, label: 'Variables', icon: '📦' },
                    { key: 'function' as const, label: 'Functions', icon: '⚡' },
                ].map(example => (
                    <button
                        key={example.key}
                        onClick={() => {
                            setSelectedExample(example.key);
                            reset();
                        }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            selectedExample === example.key
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:shadow-lg'
                        }`}
                    >
                        <span className="mr-2">{example.icon}</span>
                        {example.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Code Display */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Code className="w-5 h-5 text-white" />
                            <h3 className="font-bold text-white">Code</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={playAnimation}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                            >
                                <Play className={`w-5 h-5 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={currentStep >= steps.length - 1}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all disabled:opacity-50"
                            >
                                <SkipForward className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={reset}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                            >
                                <RotateCcw className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
                        <pre className="text-sm font-mono">
                            {exampleCode[selectedExample].split('\n').map((line, idx) => (
                                <div
                                    key={idx}
                                    className={`py-1 px-3 rounded transition-all ${
                                        currentStepData.line === idx + 1
                                            ? 'bg-yellow-200 dark:bg-yellow-900/50 border-l-4 border-yellow-500'
                                            : ''
                                    }`}
                                >
                                    <span className="text-gray-400 mr-4">{idx + 1}</span>
                                    <span className="text-gray-800 dark:text-gray-200">{line}</span>
                                </div>
                            ))}
                        </pre>
                    </div>

                    {/* Progress */}
                    <div className="px-6 py-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                Step {currentStep + 1} / {steps.length}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Visualization Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* Current Step Description */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                        <h4 className="font-bold text-lg mb-2">Current Step:</h4>
                        <p className="text-white/90 text-lg">{currentStepData.description}</p>
                        <div className="mt-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                            <code className="text-sm font-mono">{currentStepData.code}</code>
                        </div>
                    </div>

                    {/* Variables */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">📦</span>
                            Variables
                        </h4>
                        <AnimatePresence mode="popLayout">
                            {Object.keys(currentStepData.variables).length > 0 ? (
                                <div className="space-y-3">
                                    {Object.entries(currentStepData.variables).map(([key, value]) => (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                        >
                                            <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{key}</span>
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 rounded-full font-mono text-sm">
                                                {typeof value === 'string' ? `"${value}"` : String(value)}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No variables yet</p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Output */}
                    <div className="bg-black rounded-2xl p-6 shadow-lg border border-gray-700">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">💻</span>
                            Console Output
                        </h4>
                        <div className="font-mono text-sm text-green-400 space-y-1 min-h-[100px]">
                            {outputLines.length > 0 ? (
                                outputLines.map((line, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        {line}
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-500">No output yet...</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
