import { set, get } from 'idb-keyval';

export interface UserProgress {
    badges: string[];
    completedLessons: string[];
    xp: number;
    streak: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    codeBlock?: {
        language: string;
        code: string;
    };
}

const DB_KEYS = {
    PROGRESS: 'user_progress',
    CHAT_HISTORY: 'chat_history',
};

// Initial state
const INITIAL_PROGRESS: UserProgress = {
    badges: [],
    completedLessons: [],
    xp: 0,
    streak: 0,
};

export const saveProgress = async (progress: UserProgress) => {
    await set(DB_KEYS.PROGRESS, progress);
};

export const getProgress = async (): Promise<UserProgress> => {
    const data = await get<UserProgress>(DB_KEYS.PROGRESS);
    return data || INITIAL_PROGRESS;
};

export const saveChatHistory = async (history: ChatMessage[]) => {
    await set(DB_KEYS.CHAT_HISTORY, history);
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
    const data = await get<ChatMessage[]>(DB_KEYS.CHAT_HISTORY);
    return data || [];
};

export const clearData = async () => {
    await set(DB_KEYS.PROGRESS, INITIAL_PROGRESS);
    await set(DB_KEYS.CHAT_HISTORY, []);
}
