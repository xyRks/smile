import { format } from 'date-fns';
import { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2, Repeat2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

const getMoodEmoji = (mood: string) => {
  switch (mood) {
    case 'happy': return '😊';
    case 'excited': return '🤩';
    case 'neutral': return '😐';
    case 'tired': return '😴';
    case 'sad': return '😢';
    case 'angry': return '😡';
    default: return '❓';
  }
};

const getMoodColor = (mood: string) => {
  switch (mood) {
    case 'happy': return 'bg-green-500/20 text-green-500';
    case 'excited': return 'bg-yellow-500/20 text-yellow-500';
    case 'neutral': return 'bg-gray-500/20 text-gray-500';
    case 'tired': return 'bg-purple-500/20 text-purple-500';
    case 'sad': return 'bg-blue-500/20 text-blue-500';
    case 'angry': return 'bg-red-500/20 text-red-500';
    default: return 'bg-secondary text-foreground';
  }
};

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user, users } = useAuth();


  // The author of the post (who put it on the wall)
  const author = users.find(u => u.id === post.userId);
  // The original author (if it's a repost)
  const originalAuthor = post.originalUserId ? users.find(u => u.id === post.originalUserId) : null;
  const isOwner = user?.id === post.userId;

  if (post.type === 'status') {
    return (
      <Card className="glass-card border-none hover:shadow-md transition-shadow relative overflow-hidden group">
        <CardContent className="p-5 flex gap-4">
          <Link to={`/profile/${author?.id}`} className="shrink-0">
            <Avatar className="h-10 w-10 border border-border shadow-sm">
              <AvatarImage src={author?.avatarUrl} />
              <AvatarFallback>{author?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-start mb-1">
                <Link to={`/profile/${author?.id}`} className="font-medium hover:underline truncate pr-4 text-sm">
                  {author?.displayName}
                </Link>
                <span className="text-xs text-muted-foreground whitespace-nowrap bg-secondary px-2 py-1 rounded-full">
                  {format(new Date(post.timestamp), 'MMM d, h:mm a')}
                </span>
             </div>
             <p className="text-sm mt-2">{post.content}</p>
          </div>
          {isOwner && onDelete && (
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(post.id)}
             >
                <Trash2 size={14} />
             </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (post.type === 'repost' && post.originalEntryId) {
    // Attempt to find the entry (in reality, we need all entries, here we might only have current user's entries or we need to pass the entry in.
    // To keep it simple, if it's someone else's entry, we might not have it in `entries`.
    // A more robust approach stores a snapshot of the entry, but let's try to mock it if not found for the sake of the demo, or fetch from all users).
    // Actually, we don't have a global `allEntries` hook easily available here. Let's just assume we store the mood info in `content` for simplicity during reposting!

    // Fallback: use `post.content` which we will stringify when reposting.
    let repostedData;
    try {
      repostedData = post.content ? JSON.parse(post.content) : null;
    } catch {
      repostedData = null;
    }

    return (
      <Card className="glass-card border-none hover:shadow-md transition-shadow relative overflow-hidden group">
         <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
               <Repeat2 size={14} />
               <Link to={`/profile/${author?.id}`} className="font-medium hover:underline">
                  {author?.displayName}
               </Link>
               <span>reposted</span>
               <span className="ml-auto bg-secondary px-2 py-1 rounded-full">
                 {format(new Date(post.timestamp), 'MMM d, h:mm a')}
               </span>
            </div>

            <div className="border border-border/50 rounded-xl p-4 bg-background/30 flex gap-4 mt-2">
               {repostedData ? (
                 <>
                   <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${getMoodColor(repostedData.mood)}`}>
                     {getMoodEmoji(repostedData.mood)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/profile/${originalAuthor?.id}`} className="font-medium hover:underline text-sm truncate">
                          {originalAuthor?.displayName || 'Someone'}
                        </Link>
                        <span className="text-xs text-muted-foreground">felt</span>
                        <span className="text-sm font-medium capitalize">{repostedData.mood}</span>
                      </div>
                      {repostedData.note && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{repostedData.note}"</p>
                      )}
                   </div>
                 </>
               ) : (
                 <p className="text-sm text-muted-foreground">Original post not found.</p>
               )}
            </div>

            {isOwner && onDelete && (
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(post.id)}
             >
                <Trash2 size={14} />
             </Button>
            )}
         </CardContent>
      </Card>
    );
  }

  return null;
}
