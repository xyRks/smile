import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from './AuthLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';

export function Register() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 600));

    const fakeHash = btoa(password);
    const success = register(username, fakeHash, displayName);

    if (success) {
      navigate('/');
    } else {
      setError('Username already exists. Please choose another.');
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthLayout title="Create Account" subtitle="Start your emotional wellness journey today.">

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="e.g. John Doe"
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
              className="bg-background/50 backdrop-blur-sm border-white/20 focus-visible:ring-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Unique identifier"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
              className="bg-background/50 backdrop-blur-sm border-white/20 focus-visible:ring-primary h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
                <UserPlus className="mr-2 h-5 w-5" /> Create Account
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline flex inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Sign in
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PageTransition>
  );
}
