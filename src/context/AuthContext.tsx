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
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('mood_diary_users', []);
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>('mood_diary_current_user', null);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    if (currentUserId && users.length > 0) {
      const foundUser = users.find(u => u.id === currentUserId);

      if (user?.id !== foundUser?.id) {
         setUser(foundUser || null);
      }
    } else if (user !== null) {


      // Ensure backwards compatibility with users created before the friends feature
      if (foundUser && !foundUser.friends) {
        foundUser.friends = [];
      }
      setUser(foundUser || null);
    } else {
 jules-1579299213238363583-cda1a344
      setUser(null);
    }
  }, [currentUserId, users, user]);

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
      friends: [],
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

  const addFriend = (friendId: string) => {
    if (!user) return;
    if (user.friends?.includes(friendId)) return;

    const currentFriends = user.friends || [];
    updateProfile({ friends: [...currentFriends, friendId] });
  };

  const removeFriend = (friendId: string) => {
    if (!user || !user.friends) return;

    updateProfile({ friends: user.friends.filter(id => id !== friendId) });
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, switchUser, updateProfile, addFriend, removeFriend }}>
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
