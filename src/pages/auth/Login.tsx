import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageTransition } from '@/components/layout/PageTransition';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, users, switchUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate slight network delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 600));

    // Basic hash simulation for demo
    const fakeHash = btoa(password);
    const success = login(username, fakeHash);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  const handleQuickSwitch = (userId: string) => {
    switchUser(userId);
    navigate('/');
  };

  return (
    <PageTransition>
      <AuthLayout title="Welcome back" subtitle="Enter your details to access your diary.">

        {users.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-medium mb-3 text-muted-foreground">Quick Switch</p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleQuickSwitch(u.id)}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-secondary/50 transition-colors shrink-0 snap-start"
                >
                  <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary transition-colors">
                    <AvatarImage src={u.avatarUrl} />
                    <AvatarFallback>{u.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium truncate w-14 text-center">{u.displayName}</span>
                </button>
              ))}
            </div>
            <div className="h-px bg-border my-6" />
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              className="bg-background/50 backdrop-blur-sm border-white/20 focus-visible:ring-primary h-12"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="bg-background/50 backdrop-blur-sm border-white/20 focus-visible:ring-primary h-12"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-destructive font-medium"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-md mt-6 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-primary/25"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" /> Sign In
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline flex inline-flex items-center gap-1">
              Create one <UserPlus className="h-3 w-3" />
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PageTransition>
  );
}
