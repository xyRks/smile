import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Notebook, FileText, Plus, Trash2 } from 'lucide-react';
import { BlogPostCard } from './BlogPostCard';

export function Profile() {
  const { user } = useAuth();
  const { notes, blogPosts, addNote, deleteNote, addBlogPost, deleteBlogPost, addReactionBefore, addReactionAfter } = useProfileData();
  const [activeTab, setActiveTab] = useState<'notes' | 'blog'>('notes');

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMood, setNewPostMood] = useState<any>('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      addNote(newNoteTitle, newNoteContent);
      setNewNoteTitle('');
      setNewNoteContent('');
    }
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle.trim() && newPostContent.trim()) {
      addBlogPost(newPostTitle, newPostContent, newPostMood || undefined);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostMood('');
    }
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center gap-6 pb-6 border-b border-border">
        <Avatar className="h-20 w-20 border-4 border-primary/20">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback className="text-2xl">{user?.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user?.displayName}</h1>
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Notebook className="inline-block mr-2 h-4 w-4" />
          Private Notes
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`pb-2 px-1 border-b-2 font-medium transition-colors ${activeTab === 'blog' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <FileText className="inline-block mr-2 h-4 w-4" />
          Public Blog
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'notes' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="glass-card border-none bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Add New Private Note</CardTitle>
                <CardDescription>Only you can see these notes.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddNote} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="noteTitle">Title</Label>
                    <Input id="noteTitle" value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noteContent">Content</Label>
                    <textarea
                      id="noteContent"
                      value={newNoteContent}
                      onChange={e => setNewNoteContent(e.target.value)}
                      required
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Save Note</Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No private notes yet.</p>
              ) : (
                notes.map(note => (
                  <Card key={note.id} className="glass-card border-none">
                    <CardHeader className="flex flex-row justify-between items-start">
                      <div>
                        <CardTitle>{note.title}</CardTitle>
                        <CardDescription>{new Date(note.timestamp).toLocaleString()}</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'blog' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="glass-card border-none bg-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">Publish to Blog</CardTitle>
                <CardDescription>Share your thoughts with friends. They can react to your posts based on their mood!</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="postTitle">Title</Label>
                    <Input id="postTitle" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postContent">Content</Label>
                    <textarea
                      id="postContent"
                      value={newPostContent}
                      onChange={e => setNewPostContent(e.target.value)}
                      required
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Overall Mood (Optional)</Label>
                    <select
                      value={newPostMood}
                      onChange={e => setNewPostMood(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">None</option>
                      <option value="happy">Happy 😊</option>
                      <option value="excited">Excited 🤩</option>
                      <option value="neutral">Neutral 😐</option>
                      <option value="tired">Tired 😴</option>
                      <option value="sad">Sad 😢</option>
                      <option value="angry">Angry 😡</option>
                    </select>
                  </div>
                  <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Publish Post</Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {blogPosts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No blog posts published yet.</p>
              ) : (
                blogPosts.map(post => (
                  <div key={post.id} className="relative">
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBlogPost(post.id)}
                        className="absolute right-2 top-2 z-10 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                     <BlogPostCard
                        post={post}
                        currentUserId={user?.id || ''}
                        onReactBefore={(mood) => addReactionBefore(post.id, mood)}
                        onReactAfter={(mood) => addReactionAfter(post.id, mood)}
                     />
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
