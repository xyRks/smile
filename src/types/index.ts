export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'tired' | 'excited';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  note: string;
  tags: string[];
  energyLevel: number; // 1-5
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // Basic hash
  displayName: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: number;
  friends?: string[]; // Array of friend user IDs
  statusText?: string; // User's short status line
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Post {
  id: string;
  userId: string; // The user whose wall this is on
  type: 'status' | 'repost';
  content?: string; // For status updates
  originalPostId?: string; // If reposting another post
  originalEntryId?: string; // If reposting a mood entry
  originalUserId?: string; // The original author
  timestamp: number;
}
