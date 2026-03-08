import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

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
}

const idbStorage = {
    getItem: async (name: string) => (await get<string>(name)) ?? null,
    setItem: async (name: string, value: string) => set(name, value),
    removeItem: async (name: string) => del(name),
};

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
            },

            setUser: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
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
        }),
        {
            name: 'mentor-store-v3', // bumped version to clear old schema caches
            storage: createJSONStorage(() => idbStorage),
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
