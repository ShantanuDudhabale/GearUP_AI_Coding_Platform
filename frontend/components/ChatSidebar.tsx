'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { X, MessageSquare, Plus, Trash2, Clock, MessageCircle } from 'lucide-react';

interface ChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
    const { sessions, currentSessionId, loadSession, createNewSession, deleteSession } = useAppStore();

    const handleSelectSession = (id: string) => {
        loadSession(id);
        onClose();
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 150);
    };

    const handleNewSession = () => {
        createNewSession();
        onClose();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteSession(id);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-[90]"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-[100] flex flex-col shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-950/50 rounded-lg">
                                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chat History</h2>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{sessions.length} conversations</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNewSession}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-600 dark:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/50 text-white border border-blue-700 dark:border-blue-600 rounded-lg transition-all font-medium text-sm mb-4"
                            >
                                <Plus className="w-4 h-4" />
                                New Chat
                            </motion.button>

                            {sessions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                        No chats yet
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                        Start a new conversation to begin
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {sessions.map((session) => {
                                        const isActive = session.id === currentSessionId;
                                        const date = new Date(session.updatedAt);
                                        const isToday = new Date().toDateString() === date.toDateString();
                                        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const dateStr = isToday ? timeStr : date.toLocaleDateString([], { month: 'short', day: 'numeric' });

                                        return (
                                            <motion.div
                                                key={session.id}
                                                whileHover={{ x: 4 }}
                                                onClick={() => handleSelectSession(session.id)}
                                                className={`group relative flex flex-col gap-2 w-full px-4 py-3 rounded-lg cursor-pointer transition-all ${
                                                    isActive
                                                        ? 'bg-blue-100 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800'
                                                        : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <span className={`text-sm font-medium line-clamp-2 flex-1 ${
                                                        isActive
                                                            ? 'text-blue-900 dark:text-blue-100'
                                                            : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                        {session.title || 'New Chat'}
                                                    </span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => handleDelete(e, session.id)}
                                                        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-all ml-2"
                                                        title="Delete Chat"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className={isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}>
                                                        {session.messages.length} messages
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span className={isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}>
                                                            {dateStr}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                💾 Saved locally on your device
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
