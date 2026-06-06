import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Note, BlogPost, MoodType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export function useProfileData(friendId?: string) {
  const { user } = useAuth();
  const [allNotes, setAllNotes] = useLocalStorage<Note[]>('mood_diary_notes', []);
  const [allBlogPosts, setAllBlogPosts] = useLocalStorage<BlogPost[]>('mood_diary_blog_posts', []);

  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // The ID to fetch for (either current user or friend)
  const targetUserId = friendId || user?.id;

  // Filter notes and posts
  useEffect(() => {
    if (targetUserId) {
      // Notes are strictly private. Only show them if looking at own profile.
      if (!friendId && user && user.id === targetUserId) {
        const filteredNotes = allNotes.filter(n => n.userId === targetUserId);
        filteredNotes.sort((a, b) => b.timestamp - a.timestamp);
        setUserNotes(filteredNotes);
      } else {
        setUserNotes([]);
      }

      const filteredPosts = allBlogPosts.filter(p => p.userId === targetUserId);
      filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
      setBlogPosts(filteredPosts);
    } else {
      setUserNotes([]);
      setBlogPosts([]);
    }
  }, [allNotes, allBlogPosts, targetUserId, user, friendId]);

  const addNote = (title: string, content: string) => {
    if (!user) return null;
    const newNote: Note = {
      id: uuidv4(),
      userId: user.id,
      title,
      content,
      timestamp: Date.now(),
    };
    setAllNotes(prev => [...prev, newNote]);
    return newNote;
  };

  const deleteNote = (id: string) => {
    setAllNotes(prev => prev.filter(n => n.id !== id));
  };

  const addBlogPost = (title: string, content: string, moodTag?: MoodType) => {
    if (!user) return null;
    const newPost: BlogPost = {
      id: uuidv4(),
      userId: user.id,
      authorName: user.displayName,
      title,
      content,
      moodTag,
      timestamp: Date.now(),
      reactions: [],
    };
    setAllBlogPosts(prev => [...prev, newPost]);
    return newPost;
  };

  const deleteBlogPost = (id: string) => {
    setAllBlogPosts(prev => prev.filter(p => p.id !== id));
  };

  const addReactionBefore = (postId: string, mood: MoodType) => {
    if (!user) return;
    setAllBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        // Remove existing reaction for this user if any, then add new one
        const otherReactions = post.reactions.filter(r => r.userId !== user.id);
        return {
          ...post,
          reactions: [...otherReactions, { userId: user.id, beforeMood: mood }]
        };
      }
      return post;
    }));
  };

  const addReactionAfter = (postId: string, mood: MoodType) => {
    if (!user) return;
    setAllBlogPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const userReaction = post.reactions.find(r => r.userId === user.id);
        const otherReactions = post.reactions.filter(r => r.userId !== user.id);
        if (userReaction) {
          return {
            ...post,
            reactions: [...otherReactions, { ...userReaction, afterMood: mood }]
          };
        } else {
          // Fallback if they somehow skipped before
           return {
            ...post,
            reactions: [...otherReactions, { userId: user.id, beforeMood: 'neutral', afterMood: mood }]
          };
        }
      }
      return post;
    }));
  };

  return {
    notes: userNotes,
    blogPosts,
    addNote,
    deleteNote,
    addBlogPost,
    deleteBlogPost,
    addReactionBefore,
    addReactionAfter,
  };
}
