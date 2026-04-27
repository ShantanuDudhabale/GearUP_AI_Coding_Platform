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
    content: string;
    steps?: ResponseStep[];
    language?: string;
    timestamp: string;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    updatedAt: string;
}

export interface RecentInteraction {
    _id: string;
    questionText: string;
    detectedLanguage: string;
    dificultyLevel: string;
    topic: string | null;
    type: 'like' | 'dislike' | 'chat' | 'query';
    createdAt: string;
}

export interface DashboardStats {
    completedLessons: number;
    savedCodes: number;
    weakTopics: string[];
    streak: number;
    xp: number;
    badges: string[];
    level: number;
    highestStreak: number;
    languageStats: Record<string, number>;
    topicStats: Record<string, number>;
    difficultyStats: Record<string, number>;
    mostUsedLanguage: string | null;
    mostUsedTopic: string | null;
    lastInteraction: string | null;
}

// Added extra comprehensive tracking models
export interface CodingExperienceData {
    yearsExperience: number;
    primaryLanguages: string[];
    secondaryLanguages: string[];
    githubUrl: string | null;
    portfolioUrl: string | null;
    description: string;
}

interface AppState {
    // Auth
    user: any | null;
    codingExperience: CodingExperienceData | null;
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
    recentInteractions: RecentInteraction[];
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
    fetchStats: () => Promise<void>;
    fetchSessions: () => Promise<void>;
    fetchRecentInteractions: () => Promise<void>;
}

const idbStorage = {
    getItem: async (name: string) => (await get<string>(name)) ?? null,
    setItem: async (name: string, value: string) => set(name, value),
    removeItem: async (name: string) => del(name),
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const defaultStats: DashboardStats = {
    completedLessons: 0,
    savedCodes: 0,
    weakTopics: [],
    streak: 0,
    xp: 0,
    badges: [],
    level: 1,
    highestStreak: 0,
    languageStats: {},
    topicStats: {},
    difficultyStats: {},
    mostUsedLanguage: null,
    mostUsedTopic: null,
    lastInteraction: null,
};

// Keyword language scanner for auto-tracking interactions
const guessLanguage = (query: string): string => {
    const text = query.toLowerCase();
    if (text.includes('python') || text.includes('def ')) return 'python';
    if (text.includes('java') || text.includes('public class')) return 'java';
    if (text.includes('script') || text.includes('function ') || text.includes('console.log')) return 'javascript';
    if (text.includes('c++') || text.includes('#include')) return 'cpp';
    if (text.includes('ruby')) return 'ruby';
    if (text.includes('go ') || text.includes('func ')) return 'go';
    if (text.includes('rust') || text.includes('fn ')) return 'rust';
    if (text.includes('sql') || text.includes('select ') || text.includes('insert into')) return 'sql';
    return 'javascript'; // Default
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            codingExperience: null,
            token: null,
            isOffline: false,
            isListening: false,
            isProcessing: false,
            showConfetti: false,
            showLoginModal: false,
            currentSessionId: null,
            sessions: [],
            transcript: '',
            stats: defaultStats,
            recentInteractions: [],

            setUser: (user, token) => {
                const oldToken = get().token;
                // user object usually contains codingExperience from /api/auth/me
                const experience = user?.codingExperience || null;
                set({ user, token, codingExperience: experience });
                if (user && token && oldToken !== token) {
                    get().fetchStats();
                    get().fetchSessions();
                    get().fetchRecentInteractions();
                }
            },

            logout: () => set({
                user: null,
                codingExperience: null,
                token: null,
                sessions: [],
                recentInteractions: [],
                stats: defaultStats,
            }),

            setOffline: (v) => set({ isOffline: v }),
            setListening: (v) => set({ isListening: v }),
            setProcessing: (v) => set({ isProcessing: v }),
            setShowConfetti: (v) => set({ showConfetti: v }),
            setShowLoginModal: (v) => set({ showLoginModal: v }),
            setTranscript: (v) => set({ transcript: v }),

            fetchStats: async () => {
                const { token } = get();
                if (!token) return;
                try {
                    const res = await fetch(`${API_URL}/progress`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const p = data.progress;
                        if (p) {
                            const toObj = (val: any): Record<string, number> => {
                                if (!val) return {};
                                if (val instanceof Map) return Object.fromEntries(val);
                                if (typeof val === 'object') return val;
                                return {};
                            };

                            set({
                                stats: {
                                    completedLessons: p.solvedQuestions || 0,
                                    savedCodes: p.totalInteractions || 0,
                                    weakTopics: p.mostlyIteractedTopic ? [p.mostlyIteractedTopic] : [],
                                    streak: p.strikeCount || 0,
                                    xp: p.xp_points || 0,
                                    badges: p.achievements || [],
                                    level: p.level || 1,
                                    highestStreak: p.HighestStreak || 0,
                                    languageStats: toObj(p.languageStats),
                                    topicStats: toObj(p.topicStats),
                                    difficultyStats: toObj(p.difficultyStats),
                                    mostUsedLanguage: p.mostlyIteractedLanguage || null,
                                    mostUsedTopic: p.mostlyIteractedTopic || null,
                                    lastInteraction: p.lastInteraction || null,
                                }
                            });
                        }
                    }
                } catch (err) {
                    console.error('Failed to fetch stats:', err);
                }
            },

            fetchRecentInteractions: async () => {
                const { token } = get();
                if (!token) return;
                try {
                    const res = await fetch(`${API_URL}/interactions/recent?limit=10`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        set({ recentInteractions: data.interactions || [] });
                    }
                } catch (err) {
                    console.error('Failed to fetch recent interactions:', err);
                }
            },

            fetchSessions: async () => {
                const { token } = get();
                if (!token) return;
                try {
                    const res = await fetch(`${API_URL}/sessions`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.sessions) {
                            set({ sessions: data.sessions });
                        }
                    }
                } catch (err) {
                    console.error('Failed to fetch sessions:', err);
                }
            },

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

                const { token } = get();
                if (token) {
                    fetch(`${API_URL}/sessions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ sessionId: newId, title: 'New Chat', messages: [] })
                    }).catch(console.error);
                }

                return newId;
            },

            loadSession: (id) => set({ currentSessionId: id }),

            deleteSession: (id) => {
                set((state) => ({
                    sessions: state.sessions.filter(s => s.id !== id),
                    currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
                }));

                const { token } = get();
                if (token) {
                    fetch(`${API_URL}/sessions/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).catch(console.error);
                }
            },

            addMessageToSession: (sessionId, message) => {
                set((state) => {
                    const sessionIndex = state.sessions.findIndex((s) => s.id === sessionId);
                    if (sessionIndex === -1) return state;

                    const activeSession = state.sessions[sessionIndex];
                    let title = activeSession.title;

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
                    newSessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

                    // Optimistic update
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
                });

                const { token, sessions } = get();
                const updatedSession = sessions.find(s => s.id === sessionId);

                if (token && message.role === 'user') {
                    // Send interaction log for tracking minute details permanently
                    const guessedLanguage = guessLanguage(message.content);
                    fetch(`${API_URL}/interactions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            type: 'query',
                            questionText: message.content,
                            questionType: 'text',
                            detectedLanguage: guessedLanguage,
                            dificultyLevel: 'medium', // Default
                            topic: 'general',
                            sessionId
                        })
                    }).then(() => {
                        // REFETCH data silently to immediately sync DB timeline updates across the app dashboard
                        get().fetchStats();
                        get().fetchRecentInteractions();
                    }).catch(console.error);
                }

                if (token && updatedSession) {
                    fetch(`${API_URL}/sessions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            sessionId,
                            title: updatedSession.title,
                            messages: updatedSession.messages
                        })
                    }).catch(console.error);
                }
            },

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
        }),
        {
            name: 'gearup-store-v2', // bumped to purge old cache formats safely
            storage: createJSONStorage(() => idbStorage),
            partialize: (s) => ({
                sessions: s.sessions,
                stats: s.stats,
                currentSessionId: s.currentSessionId,
                user: s.user,
                token: s.token,
                codingExperience: s.codingExperience,
                recentInteractions: s.recentInteractions,
            }),
        }
    )
);
