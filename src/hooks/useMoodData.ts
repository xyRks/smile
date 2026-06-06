import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { MoodEntry } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export function useMoodData() {
  const { user } = useAuth();
  const [allEntries, setAllEntries] = useLocalStorage<MoodEntry[]>('mood_diary_entries', []);


  // Filter entries for current user

  const userEntries = useMemo(() => {
    if (user) {
      const filtered = allEntries.filter(entry => entry.userId === user.id);
      // Sort by descending timestamp (newest first)
      filtered.sort((a, b) => b.timestamp - a.timestamp);
      return filtered;
    }
    return [];
  }, [allEntries, user]);

  const addEntry = (entry: Omit<MoodEntry, 'id' | 'userId' | 'timestamp'>) => {
    if (!user) return null;

    const newEntry: MoodEntry = {
      ...entry,
      id: uuidv4(),
      userId: user.id,
      timestamp: Date.now(),
    };

    setAllEntries(prev => [...prev, newEntry]);
    return newEntry;
  };

  const deleteEntry = (id: string) => {
    setAllEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<MoodEntry>) => {
    setAllEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  return {
    entries: userEntries,
    addEntry,
    deleteEntry,
    updateEntry,
  };
}
