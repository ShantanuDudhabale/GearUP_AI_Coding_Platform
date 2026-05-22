import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SkillLevel, Challenge, ProjectRecommendation } from '@/types/features';

// ---------- Types ----------
export interface ResponseStep {
    id: 'explanation' | 'example' | 'code';
    title: string;
    content: string;
    language?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string; // User query OR stringified JSON steps for AI
    steps?: ResponseStep[]; // Parsed steps from AI
    language?: string;
    timestamp: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    updatedAt: string;
}

export interface DashboardStats {
    completedLessons: number;
    savedCodes: number;
    weakTopics: string[];
    streak: number;
    xp: number;
    badges: string[];
    skills: SkillLevel[];
    exercisesSolved: number;
    projectsSubmitted: number;
    errorFrequency: number;
    currentLevel: string;
    dailyChallenges: Challenge[];
}

interface AppState {
    // Auth
    user: any | null;
    token: string | null;
    // Status
    isOffline: boolean;
    isListening: boolean;
    isProcessing: boolean;
    showConfetti: boolean;
    showLoginModal: boolean;
    // Content
    currentSessionId: string | null;
    sessions: ChatSession[];
    transcript: string;
    stats: DashboardStats;
    // Actions
    setUser: (user: any | null, token: string | null) => void;
    logout: () => void;
    setSessions: (sessions: ChatSession[]) => void;
    setOffline: (v: boolean) => void;
    setListening: (v: boolean) => void;
    setProcessing: (v: boolean) => void;
    setShowConfetti: (v: boolean) => void;
    setShowLoginModal: (v: boolean) => void;
    setTranscript: (v: string) => void;
    createNewSession: () => string;
    loadSession: (id: string) => void;
    addMessageToSession: (sessionId: string, message: ChatMessage) => void;
    deleteSession: (id: string) => void;
    unlockBadge: (id: string) => void;
    addXP: (amount: number) => void;
    completeExercise: (language: string) => void;
    submitProject: () => void;
    completeChallenge: (challengeId: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isOffline: false,
            isListening: false,
            isProcessing: false,
            showConfetti: false,
            showLoginModal: false,
            currentSessionId: null,
            sessions: [],
            transcript: '',
            stats: {
                completedLessons: 0,
                savedCodes: 0,
                weakTopics: ['Loops', 'Functions', 'Arrays'],
                streak: 3,
                xp: 120,
                badges: [],
                skills: [
                    { skill: 'HTML', level: 45, exercises: 12, lastPracticed: new Date().toISOString() },
                    { skill: 'CSS', level: 38, exercises: 8, lastPracticed: new Date().toISOString() },
                    { skill: 'JavaScript', level: 52, exercises: 15, lastPracticed: new Date().toISOString() },
                    { skill: 'Python', level: 30, exercises: 6, lastPracticed: new Date().toISOString() },
                    { skill: 'Arduino', level: 20, exercises: 3, lastPracticed: new Date().toISOString() },
                ],
                exercisesSolved: 44,
                projectsSubmitted: 3,
                errorFrequency: 12,
                currentLevel: 'Explorer',
                dailyChallenges: [
                    {
                        id: '1',
                        title: 'Create a Button Click Counter',
                        description: 'Build a simple counter that increases when you click a button',
                        difficulty: 'easy',
                        xpReward: 50,
                        language: 'JavaScript',
                        completed: false,
                    },
                    {
                        id: '2',
                        title: 'Build a Temperature Converter',
                        description: 'Convert between Celsius and Fahrenheit',
                        difficulty: 'medium',
                        xpReward: 100,
                        language: 'Python',
                        completed: false,
                    },
                ],
            },

            setUser: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
            setSessions: (sessions) => set({ sessions }),
            setOffline: (v) => set({ isOffline: v }),
            setListening: (v) => set({ isListening: v }),
            setProcessing: (v) => set({ isProcessing: v }),
            setShowConfetti: (v) => set({ showConfetti: v }),
            setShowLoginModal: (v) => set({ showLoginModal: v }),
            setTranscript: (v) => set({ transcript: v }),

            createNewSession: () => {
                const newId = Date.now().toString();
                const newSession: ChatSession = {
                    id: newId,
                    title: 'New Chat',
                    messages: [],
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    sessions: [newSession, ...state.sessions].slice(0, 50),
                    currentSessionId: newId,
                }));
                
                // Save new session to database
                if (typeof window !== 'undefined') {
                    import('@/lib/chatService').then(({ createChatSession }) => {
                        createChatSession(newId, 'New Chat').catch(err => 
                            console.error('Failed to create session in database:', err)
                        );
                    });
                }
                
                return newId;
            },

            loadSession: (id) => set({ currentSessionId: id }),

            deleteSession: (id) =>
                set((state) => ({
                    sessions: state.sessions.filter(s => s.id !== id),
                    currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
                })),

            addMessageToSession: (sessionId, message) =>
                set((state) => {
                    const sessionIndex = state.sessions.findIndex((s) => s.id === sessionId);
                    if (sessionIndex === -1) return state;

                    const activeSession = state.sessions[sessionIndex];
                    let title = activeSession.title;

                    // Auto-title on first user message
                    if (message.role === 'user' && activeSession.messages.length === 0) {
                        title = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
                    }

                    const updatedSession = {
                        ...activeSession,
                        title,
                        messages: [...activeSession.messages, message],
                        updatedAt: new Date().toISOString(),
                    };

                    const newSessions = [...state.sessions];
                    newSessions[sessionIndex] = updatedSession;

                    // Move updated session to top
                    newSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                    // Check if AI responded (completed a lesson turn)
                    const statsUpdate = message.role === 'assistant' ? {
                        completedLessons: state.stats.completedLessons + 1,
                        savedCodes: state.stats.savedCodes + 1,
                        xp: state.stats.xp + 30,
                    } : {};

                    return {
                        sessions: newSessions,
                        stats: {
                            ...state.stats,
                            ...statsUpdate,
                        },
                    };
                }),

            unlockBadge: (id) =>
                set((state) => {
                    if (state.stats.badges.includes(id)) return state;
                    return {
                        stats: {
                            ...state.stats,
                            badges: [...state.stats.badges, id],
                            xp: state.stats.xp + 50,
                        },
                    };
                }),

            addXP: (amount) =>
                set((state) => ({
                    stats: { ...state.stats, xp: state.stats.xp + amount },
                })),

            completeExercise: (language) =>
                set((state) => {
                    const skills = state.stats.skills.map(s =>
                        s.skill === language
                            ? { ...s, level: Math.min(100, s.level + 2), exercises: s.exercises + 1, lastPracticed: new Date().toISOString() }
                            : s
                    );
                    return {
                        stats: {
                            ...state.stats,
                            exercisesSolved: state.stats.exercisesSolved + 1,
                            skills,
                            xp: state.stats.xp + 20,
                        },
                    };
                }),

            submitProject: () =>
                set((state) => ({
                    stats: {
                        ...state.stats,
                        projectsSubmitted: state.stats.projectsSubmitted + 1,
                        xp: state.stats.xp + 100,
                    },
                })),

            completeChallenge: (challengeId) =>
                set((state) => {
                    const challenges = state.stats.dailyChallenges.map(c =>
                        c.id === challengeId ? { ...c, completed: true } : c
                    );
                    const challenge = state.stats.dailyChallenges.find(c => c.id === challengeId);
                    return {
                        stats: {
                            ...state.stats,
                            dailyChallenges: challenges,
                            xp: state.stats.xp + (challenge?.xpReward || 0),
                        },
                    };
                }),
        }),
        {
            name: 'mentor-store-v4',
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({
                sessions: s.sessions,
                stats: s.stats,
                currentSessionId: s.currentSessionId,
                user: s.user,
                token: s.token,
            }),
        }
    )
);
