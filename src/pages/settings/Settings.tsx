import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Moon, Sun, Monitor, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Settings() {
  const { user, updateProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [theme, setTheme] = useState(user?.theme || 'dark');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');

    // Simulate delay
    await new Promise(r => setTimeout(r, 600));

    updateProfile({ displayName, theme: theme as 'light' | 'dark' | 'system' });

    setIsSaving(false);
    setSaveMessage('Profile updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleGenerateNewAvatar = async () => {
    if (!user) return;

    // Use a random seed for the DiceBear API
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    updateProfile({ avatarUrl: newAvatarUrl });
  };

  if (!user) return null;

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="grid gap-8">

        {/* Profile Settings */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and avatar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="text-3xl">{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <button
                  onClick={handleGenerateNewAvatar}
                  className="absolute inset-0 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                  title="Generate new avatar"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 space-y-2 w-full">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-background/50 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={user.username}
                disabled
                className="bg-secondary/50 text-muted-foreground opacity-70"
              />
              <p className="text-xs text-muted-foreground mt-1">Usernames cannot be changed.</p>
            </div>

          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how Moodify looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                <Sun className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                <Moon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                <Monitor className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <Button
            variant="outline"
            className="w-full md:w-auto border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {saveMessage && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-green-500 font-medium"
              >
                {saveMessage}
              </motion.span>
            )}
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving || displayName === ''}
              className="w-full md:w-auto shadow-lg shadow-primary/20"
            >
              {isSaving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
