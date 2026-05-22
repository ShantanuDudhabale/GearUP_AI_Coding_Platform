// API service for MongoDB backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// API headers with auth
const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// ============ CHAT SESSIONS ============

export const chatAPI = {
    // Get all sessions
    getSessions: async () => {
        const response = await fetch(`${API_URL}/chat/sessions`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch sessions');
        return response.json();
    },

    // Get specific session
    getSession: async (sessionId: string) => {
        const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch session');
        return response.json();
    },

    // Create new session
    createSession: async (sessionId: string, title?: string) => {
        const response = await fetch(`${API_URL}/chat/sessions`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ sessionId, title })
        });
        if (!response.ok) throw new Error('Failed to create session');
        return response.json();
    },

    // Add message to session
    addMessage: async (sessionId: string, message: Record<string, unknown>) => {
        const response = await fetch(`${API_URL}/chat/sessions/${sessionId}/messages`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ message })
        });
        if (!response.ok) throw new Error('Failed to add message');
        return response.json();
    },

    // Delete session
    deleteSession: async (sessionId: string) => {
        const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete session');
        return response.json();
    },

    // Update session title
    updateSession: async (sessionId: string, title: string) => {
        const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ title })
        });
        if (!response.ok) throw new Error('Failed to update session');
        return response.json();
    }
};

// ============ USER STATS ============

export const statsAPI = {
    // Get user stats
    getStats: async () => {
        const response = await fetch(`${API_URL}/stats`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },

    // Update stats
    updateStats: async (stats: Record<string, unknown>) => {
        const response = await fetch(`${API_URL}/stats`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(stats)
        });
        if (!response.ok) throw new Error('Failed to update stats');
        return response.json();
    },

    // Add XP
    addXP: async (amount: number) => {
        const response = await fetch(`${API_URL}/stats/xp`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ amount })
        });
        if (!response.ok) throw new Error('Failed to add XP');
        return response.json();
    },

    // Unlock badge
    unlockBadge: async (badgeId: string) => {
        const response = await fetch(`${API_URL}/stats/badges`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ badgeId })
        });
        if (!response.ok) throw new Error('Failed to unlock badge');
        return response.json();
    },

    // Complete exercise
    completeExercise: async (language: string) => {
        const response = await fetch(`${API_URL}/stats/exercises`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ language })
        });
        if (!response.ok) throw new Error('Failed to complete exercise');
        return response.json();
    },

    // Submit project
    submitProject: async () => {
        const response = await fetch(`${API_URL}/stats/projects`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to submit project');
        return response.json();
    },

    // Complete challenge
    completeChallenge: async (challengeId: string) => {
        const response = await fetch(`${API_URL}/stats/challenges/${challengeId}`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to complete challenge');
        return response.json();
    }
};

// ============ AUTH ============

export const authAPI = {
    // Login
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        
        // Store token
        if (typeof window !== 'undefined' && data.token) {
            localStorage.setItem('token', data.token);
        }
        
        return data;
    },

    // Register
    register: async (username: string, email: string, password: string, dob?: string) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, dob })
        });
        if (!response.ok) throw new Error('Registration failed');
        const data = await response.json();
        
        // Store token
        if (typeof window !== 'undefined' && data.token) {
            localStorage.setItem('token', data.token);
        }
        
        return data;
    },

    // Logout
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    }
};
