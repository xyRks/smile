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
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  timestamp: number;
}

export interface MoodReaction {
  userId: string;
  beforeMood: MoodType;
  afterMood?: MoodType;
}

export interface BlogPost {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  content: string;
  timestamp: number;
  moodTag?: MoodType;
  reactions: MoodReaction[];
}
