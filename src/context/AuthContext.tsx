import React, { createContext, useContext, useEffect, useState } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('mood_diary_users', []);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('mood_diary_current_user', null);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUserId && users.length > 0) {
      const foundUser = users.find(u => u.id === currentUserId);
      setUser(foundUser || null);
    } else {
      setUser(null);
    }
  }, [currentUserId, users]);

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
    };

    setUsers([...users, newUser]);
    setCurrentUserId(newUser.id);
    return true;
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const switchUser = (userId: string) => {
    if (users.some(u => u.id === userId)) {
      setCurrentUserId(userId);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, switchUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
