
// Re-export the existing types
export interface User {
  id: string;
  name: string;
  avatar: string;
  status?: 'online' | 'offline';
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  read?: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessageAt: Date;
  unreadCount?: number;
  isGroup?: boolean;
  name?: string;
  isPinned?: boolean;
  isMuted?: boolean;
}

// Import and re-export Supabase types
export * from './supabase';
