import { create } from 'zustand';
import { chatAPI, statsAPI, authAPI } from '@/lib/api';
import { SkillLevel, Challenge } from '@/types/features';

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
    isAuthenticated: boolean;
    // Status
    isOffline: boolean;
    isListening: boolean;
    isProcessing: boolean;
    showConfetti: boolean;
    showLoginModal: boolean;
    isLoading: boolean;
    // Content
    currentSessionId: string | null;
    sessions: ChatSession[];
    transcript: string;
    stats: DashboardStats;
    // Actions
    setUser: (user: any | null, token: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, dob?: string) => Promise<void>;
    logout: () => void;
    setOffline: (v: boolean) => void;
    setListening: (v: boolean) => void;
    setProcessing: (v: boolean) => void;
    setShowConfetti: (v: boolean) => void;
    setShowLoginModal: (v: boolean) => void;
    setTranscript: (v: string) => void;
    // MongoDB Actions
    loadSessions: () => Promise<void>;
    loadStats: () => Promise<void>;
    createNewSession: () => Promise<string>;
    loadSession: (id: string) => void;
    addMessageToSession: (sessionId: string, message: ChatMessage) => Promise<void>;
    deleteSession: (id: string) => Promise<void>;
    unlockBadge: (id: string) => Promise<void>;
    addXP: (amount: number) => Promise<void>;
    completeExercise: (language: string) => Promise<void>;
    submitProject: () => Promise<void>;
    completeChallenge: (challengeId: string) => Promise<void>;
}

const defaultStats: DashboardStats = {
    completedLessons: 0,
    savedCodes: 0,
    weakTopics: ['Loops', 'Functions', 'Arrays'],
    streak: 0,
    xp: 0,
    badges: [],
    skills: [
        { skill: 'HTML', level: 0, exercises: 0, lastPracticed: new Date().toISOString() },
        { skill: 'CSS', level: 0, exercises: 0, lastPracticed: new Date().toISOString() },
        { skill: 'JavaScript', level: 0, exercises: 0, lastPracticed: new Date().toISOString() },
        { skill: 'Python', level: 0, exercises: 0, lastPracticed: new Date().toISOString() },
        { skill: 'Arduino', level: 0, exercises: 0, lastPracticed: new Date().toISOString() },
    ],
    exercisesSolved: 0,
    projectsSubmitted: 0,
    errorFrequency: 0,
    currentLevel: 'Beginner',
    dailyChallenges: [],
};

export const useAppStore = create<AppState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isOffline: false,
    isListening: false,
    isProcessing: false,
    showConfetti: false,
    showLoginModal: false,
    isLoading: false,
    currentSessionId: null,
    sessions: [],
    transcript: '',
    stats: defaultStats,

    setUser: (user, token) => {
        set({ user, token, isAuthenticated: !!token });
        if (token && typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    },

    login: async (email, password) => {
        try {
            set({ isLoading: true });
            const data = await authAPI.login(email, password);
            set({ 
                user: data.user, 
                token: data.token, 
                isAuthenticated: true,
                isLoading: false 
            });
            // Load user data
            await get().loadSessions();
            await get().loadStats();
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (username, email, password, dob) => {
        try {
            set({ isLoading: true });
            const data = await authAPI.register(username, email, password, dob);
            set({ 
                user: data.user, 
                token: data.token, 
                isAuthenticated: true,
                isLoading: false 
            });
            // Load user data
            await get().loadSessions();
            await get().loadStats();
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        authAPI.logout();
        set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            sessions: [],
            stats: defaultStats,
            currentSessionId: null
        });
    },

    setOffline: (v) => set({ isOffline: v }),
    setListening: (v) => set({ isListening: v }),
    setProcessing: (v) => set({ isProcessing: v }),
    setShowConfetti: (v) => set({ showConfetti: v }),
    setShowLoginModal: (v) => set({ showLoginModal: v }),
    setTranscript: (v) => set({ transcript: v }),

    loadSessions: async () => {
        try {
            if (!get().isAuthenticated) return;
            const sessions = await chatAPI.getSessions();
            set({ sessions: sessions.map((s: any) => ({
                id: s.sessionId,
                title: s.title,
                messages: s.messages,
                updatedAt: s.updatedAt
            })) });
        } catch (error) {
            console.error('Failed to load sessions:', error);
        }
    },

    loadStats: async () => {
        try {
            if (!get().isAuthenticated) return;
            const stats = await statsAPI.getStats();
            set({ stats: {
                completedLessons: stats.completedLessons,
                savedCodes: stats.savedCodes,
                weakTopics: stats.weakTopics,
                streak: stats.streak,
                xp: stats.xp,
                badges: stats.badges,
                skills: stats.skills,
                exercisesSolved: stats.exercisesSolved,
                projectsSubmitted: stats.projectsSubmitted,
                errorFrequency: stats.errorFrequency,
                currentLevel: stats.currentLevel,
                dailyChallenges: stats.dailyChallenges
            }});
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    },

    createNewSession: async () => {
        const newId = Date.now().toString();
        try {
            if (get().isAuthenticated) {
                await chatAPI.createSession(newId, 'New Chat');
                await get().loadSessions();
            } else {
                // Offline mode - local only
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
            }
            set({ currentSessionId: newId });
            return newId;
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        }
    },

    loadSession: (id) => set({ currentSessionId: id }),

    deleteSession: async (id) => {
        try {
            if (get().isAuthenticated) {
                await chatAPI.deleteSession(id);
                await get().loadSessions();
            } else {
                set((state) => ({
                    sessions: state.sessions.filter(s => s.id !== id),
                    currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
                }));
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    },

    addMessageToSession: async (sessionId, message) => {
        try {
            if (get().isAuthenticated) {
                await chatAPI.addMessage(sessionId, message as unknown as Record<string, unknown>);
                await get().loadSessions();
                
                // Update stats if AI responded
                if (message.role === 'assistant') {
                    const currentStats = get().stats;
                    await statsAPI.updateStats({
                        ...currentStats,
                        completedLessons: currentStats.completedLessons + 1,
                        savedCodes: currentStats.savedCodes + 1,
                        xp: currentStats.xp + 30
                    });
                    await get().loadStats();
                }
            } else {
                // Offline mode
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

                    return { sessions: newSessions };
                });
            }
        } catch (error) {
            console.error('Failed to add message:', error);
        }
    },

    unlockBadge: async (id) => {
        try {
            if (get().isAuthenticated) {
                await statsAPI.unlockBadge(id);
                await get().loadStats();
            }
        } catch (error) {
            console.error('Failed to unlock badge:', error);
        }
    },

    addXP: async (amount) => {
        try {
            if (get().isAuthenticated) {
                await statsAPI.addXP(amount);
                await get().loadStats();
            }
        } catch (error) {
            console.error('Failed to add XP:', error);
        }
    },

    completeExercise: async (language) => {
        try {
            if (get().isAuthenticated) {
                await statsAPI.completeExercise(language);
                await get().loadStats();
            }
        } catch (error) {
            console.error('Failed to complete exercise:', error);
        }
    },

    submitProject: async () => {
        try {
            if (get().isAuthenticated) {
                await statsAPI.submitProject();
                await get().loadStats();
            }
        } catch (error) {
            console.error('Failed to submit project:', error);
        }
    },

    completeChallenge: async (challengeId) => {
        try {
            if (get().isAuthenticated) {
                await statsAPI.completeChallenge(challengeId);
                await get().loadStats();
            }
        } catch (error) {
            console.error('Failed to complete challenge:', error);
        }
    },
}));
