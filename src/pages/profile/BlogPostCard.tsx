
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost, MoodType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlogPostCardProps {
  post: BlogPost;
  currentUserId: string;
  onReactBefore: (mood: MoodType) => void;
  onReactAfter: (mood: MoodType) => void;
  readOnly?: boolean; // If viewing from somewhere without reaction ability
}

const MOODS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy' },
  { type: 'excited', emoji: '🤩', label: 'Excited' },
  { type: 'neutral', emoji: '😐', label: 'Neutral' },
  { type: 'tired', emoji: '😴', label: 'Tired' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😡', label: 'Angry' },
];

export function BlogPostCard({ post, currentUserId, onReactBefore, onReactAfter, readOnly = false }: BlogPostCardProps) {
  const userReaction = post.reactions.find(r => r.userId === currentUserId);
  const hasReactedBefore = !!userReaction?.beforeMood;
  const hasReactedAfter = !!userReaction?.afterMood;
  const isAuthor = post.userId === currentUserId;

  const [localBeforeMood, setLocalBeforeMood] = useState<MoodType | null>(userReaction?.beforeMood || null);
  const [isReading, setIsReading] = useState(hasReactedBefore || isAuthor || readOnly);
  const [localAfterMood, setLocalAfterMood] = useState<MoodType | null>(userReaction?.afterMood || null);

  const handleBeforeReaction = (mood: MoodType) => {
    setLocalBeforeMood(mood);
    onReactBefore(mood);
    // Add a slight delay before revealing content for a nice effect
    setTimeout(() => setIsReading(true), 600);
  };

  const handleAfterReaction = (mood: MoodType) => {
    setLocalAfterMood(mood);
    onReactAfter(mood);
  };

  // Helper to aggregate stats
  const getStats = () => {
      const beforeCounts: Record<string, number> = {};
      const afterCounts: Record<string, number> = {};
      post.reactions.forEach(r => {
          if (r.beforeMood) beforeCounts[r.beforeMood] = (beforeCounts[r.beforeMood] || 0) + 1;
          if (r.afterMood) afterCounts[r.afterMood] = (afterCounts[r.afterMood] || 0) + 1;
      });
      return { beforeCounts, afterCounts };
  };

  const stats = getStats();

  return (
    <Card className="glass-card border-none overflow-hidden relative">
      {/* Optional mood highlight line */}
      {post.moodTag && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/50" />
      )}

      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription className="flex justify-between items-center">
            <span>By {post.authorName} • {new Date(post.timestamp).toLocaleDateString()}</span>
            {post.moodTag && <span className="text-xl" title={"Author's mood: " + post.moodTag}>{MOODS.find(m => m.type === post.moodTag)?.emoji}</span>}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {!isReading ? (
            <motion.div
              key="before-read"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8 flex flex-col items-center justify-center text-center space-y-4 bg-secondary/20 rounded-xl border border-dashed border-border"
            >
              <h4 className="font-medium text-lg">Before you read this...</h4>
              <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {MOODS.map(mood => (
                  <Button
                    key={mood.type}
                    variant={localBeforeMood === mood.type ? 'default' : 'outline'}
                    className="text-2xl h-14 w-14 rounded-full"
                    onClick={() => handleBeforeReaction(mood.type)}
                  >
                    {mood.emoji}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                {post.content}
              </div>

              {(!isAuthor && !readOnly) && (
                  <div className="pt-6 border-t border-border/50">
                     {!hasReactedAfter && !localAfterMood ? (
                         <div className="flex flex-col items-center text-center space-y-4">
                             <h4 className="font-medium">You've read the post!</h4>
                             <p className="text-sm text-muted-foreground">Did your mood change? How do you feel now?</p>
                             <div className="flex flex-wrap justify-center gap-2">
                                {MOODS.map(mood => (
                                  <Button
                                    key={mood.type}
                                    variant="outline"
                                    className="text-2xl h-12 w-12 rounded-full"
                                    onClick={() => handleAfterReaction(mood.type)}
                                  >
                                    {mood.emoji}
                                  </Button>
                                ))}
                             </div>
                         </div>
                     ) : (
                        <div className="flex flex-col items-center text-center space-y-2 bg-primary/5 p-4 rounded-xl">
                             <p className="text-sm font-medium text-primary">Thanks for sharing your reaction!</p>
                             <div className="flex items-center gap-4 text-2xl mt-2">
                                 <span className="flex flex-col items-center"><span className="text-sm text-muted-foreground mb-1">Before</span> {MOODS.find(m => m.type === localBeforeMood)?.emoji || '❓'}</span>
                                 <span className="text-muted-foreground text-sm">➡️</span>
                                 <span className="flex flex-col items-center"><span className="text-sm text-muted-foreground mb-1">After</span> {MOODS.find(m => m.type === localAfterMood)?.emoji || '❓'}</span>
                             </div>
                        </div>
                     )}
                  </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {(isReading && post.reactions.length > 0) && (
          <CardFooter className="bg-secondary/10 border-t border-border flex flex-col items-start gap-2 py-4">
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Community Vibes</h5>
              <div className="flex w-full justify-between gap-4 text-sm">
                  <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Mood Before Reading</p>
                      <div className="flex flex-wrap gap-1">
                          {Object.entries(stats.beforeCounts).map(([mood, count]) => (
                              <span key={mood} className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border text-xs">
                                  {MOODS.find(m => m.type === mood)?.emoji} {count as number}
                              </span>
                          ))}
                      </div>
                  </div>
                  <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">Mood After Reading</p>
                      <div className="flex flex-wrap gap-1">
                          {Object.entries(stats.afterCounts).map(([mood, count]) => (
                              <span key={mood} className="inline-flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border text-xs">
                                  {MOODS.find(m => m.type === mood)?.emoji} {count as number}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
          </CardFooter>
      )}
    </Card>
  );
}
