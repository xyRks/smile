import React, { createContext, useContext } from 'react';
import { User } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, passwordHash: string) => boolean;
  register: (username: string, passwordHash: string, displayName?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('mood_diary_users', []);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('mood_diary_current_user', null);

  // We are removing the redundant `user` state derived from `users` and computing it directly to avoid the useEffect warning.
  const user = currentUserId ? users.find(u => u.id === currentUserId) || null : null;

  const login = (username: string, passwordHash: string) => {
    const foundUser = users.find(u => u.username === username && u.passwordHash === passwordHash);
    if (foundUser) {
      setCurrentUserId(foundUser.id);
      return true;
    }
    return false;
  };

  const register = (username: string, passwordHash: string, displayName?: string) => {
    if (users.some(u => u.username === username)) {
      return false; // Username exists
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      passwordHash,
      displayName: displayName || username,
      avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      theme: 'dark',
      createdAt: Date.now(),
      friends: []
    };

    setUsers([...users, newUser]);
    setCurrentUserId(newUser.id);
    return true;
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUserId) return;
    setUsers(users.map(u => u.id === currentUserId ? { ...u, ...updates } : u));
  };

  const addFriend = (friendId: string) => {
    if (!currentUserId || currentUserId === friendId) return;
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === currentUserId) {
        const friends = u.friends || [];
        if (!friends.includes(friendId)) {
          return { ...u, friends: [...friends, friendId] };
        }
      }
      return u;
    }));
  };

  const removeFriend = (friendId: string) => {
    if (!currentUserId) return;
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === currentUserId) {
        return { ...u, friends: (u.friends || []).filter(id => id !== friendId) };
      }
      return u;
    }));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, switchUser, updateProfile, addFriend, removeFriend }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
