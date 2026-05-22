/**
 * Chat Service - Handles syncing chat history with backend database
 * Saves all chats to MongoDB so users can access them after logging in
 */

import { ChatSession, ChatMessage } from '@/store/useAppStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Fetch all chat sessions for the current user from database
 */
export async function fetchChatSessions(): Promise<ChatSession[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('⚠️ No auth token found - user not authenticated');
      return [];
    }

    const response = await fetch(`${API_BASE}/api/chat/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch sessions: ${response.status} ${response.statusText}`);
      if (response.status === 401) {
        console.error('Authentication failed - token may be invalid');
        localStorage.removeItem('token');
      }
      return [];
    }

    const sessions = await response.json();
    console.log('✅ Fetched chat sessions from database:', sessions.length);
    return sessions;
  } catch (error) {
    console.error('❌ Error fetching chat sessions:', error);
    return [];
  }
}

/**
 * Create a new chat session in the database
 */
export async function createChatSession(sessionId: string, title: string): Promise<ChatSession | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found');
      return null;
    }

    const response = await fetch(`${API_BASE}/api/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId, title }),
    });

    if (!response.ok) {
      console.error('Failed to create session:', response.status);
      return null;
    }

    const session = await response.json();
    console.log('✅ Created chat session in database:', sessionId);
    return session;
  } catch (error) {
    console.error('❌ Error creating chat session:', error);
    return null;
  }
}

/**
 * Add a message to a chat session in the database
 */
export async function addMessageToDatabase(
  sessionId: string,
  message: ChatMessage
): Promise<ChatSession | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found');
      return null;
    }

    const response = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      console.error('Failed to add message:', response.status);
      return null;
    }

    const session = await response.json();
    console.log('✅ Added message to database:', sessionId);
    return session;
  } catch (error) {
    console.error('❌ Error adding message:', error);
    return null;
  }
}

/**
 * Delete a chat session from the database
 */
export async function deleteChatSessionFromDatabase(sessionId: string): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found');
      return false;
    }

    const response = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to delete session:', response.status);
      return false;
    }

    console.log('✅ Deleted chat session from database:', sessionId);
    return true;
  } catch (error) {
    console.error('❌ Error deleting chat session:', error);
    return false;
  }
}

/**
 * Update session title in the database
 */
export async function updateSessionTitle(sessionId: string, title: string): Promise<ChatSession | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found');
      return null;
    }

    const response = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      console.error('Failed to update session title:', response.status);
      return null;
    }

    const session = await response.json();
    console.log('✅ Updated session title in database:', sessionId);
    return session;
  } catch (error) {
    console.error('❌ Error updating session title:', error);
    return null;
  }
}

/**
 * Sync local sessions with database
 * This is called when user logs in to load their chat history
 */
export async function syncSessionsWithDatabase(): Promise<ChatSession[]> {
  try {
    console.log('🔄 Syncing chat sessions with database...');
    const sessions = await fetchChatSessions();
    console.log('✅ Sync complete. Loaded', sessions.length, 'sessions');
    return sessions;
  } catch (error) {
    console.error('❌ Error syncing sessions:', error);
    return [];
  }
}

/**
 * Batch sync - save all local sessions to database
 * Useful for ensuring all chats are backed up
 */
export async function batchSyncSessions(sessions: ChatSession[]): Promise<boolean> {
  try {
    console.log('🔄 Batch syncing', sessions.length, 'sessions to database...');
    
    for (const session of sessions) {
      // Create session if it doesn't exist
      await createChatSession(session.id, session.title);
      
      // Add all messages
      for (const message of session.messages) {
        await addMessageToDatabase(session.id, message);
      }
    }
    
    console.log('✅ Batch sync complete');
    return true;
  } catch (error) {
    console.error('❌ Error batch syncing sessions:', error);
    return false;
  }
}
