
import { Post } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function usePosts() {
  const [allPosts, setAllPosts] = useLocalStorage<Post[]>('mood_diary_posts', []);

  const addPost = (post: Omit<Post, 'id' | 'timestamp'>) => {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setAllPosts(prev => [newPost, ...prev]);
  };

  const getPostsByUser = (userId: string) => {
    return allPosts.filter(p => p.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
  };

  const deletePost = (postId: string) => {
    setAllPosts(prev => prev.filter(p => p.id !== postId));
  };

  return {
    allPosts,
    addPost,
    getPostsByUser,
    deletePost
  };
}
