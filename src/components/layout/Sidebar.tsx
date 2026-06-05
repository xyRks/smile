import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Calendar, PieChart, Clock, Settings, LogOut, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: PlusCircle, label: 'Log Mood', path: '/new-entry' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: PieChart, label: 'Insights', path: '/analytics' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: Users, label: 'Friends', path: '/friends' },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-card border-r border-border sticky top-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
            <span className="text-3xl">✨</span> Moodify
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            // Treat active state for friends to also match /friends/:id
            const isActive = location.pathname === item.path || (item.path === '/friends' && location.pathname.startsWith('/friends/'));
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="block relative">
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200",
                  isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}>
                  <Icon size={20} className={cn("transition-transform duration-200", isActive && "scale-110 text-primary")} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <Link to="/settings" className="block relative mb-2">
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200",
              location.pathname === '/settings' ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}>
              <Settings size={20} />
              <span>Settings</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
            <Avatar className="h-10 w-10 border border-border shadow-sm">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName}</p>
              <button
                onClick={logout}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
        <div className="flex items-center justify-around p-2">
          {navItems.filter(item => ['/', '/new-entry', '/calendar', '/friends'].includes(item.path)).map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/friends' && location.pathname.startsWith('/friends/'));
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="relative p-2 flex flex-col items-center gap-1">
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={22} className={cn("relative z-10 transition-transform duration-200", isActive ? "text-primary scale-110" : "text-muted-foreground")} />
                <span className={cn("text-[10px] relative z-10", isActive ? "text-primary font-medium" : "text-muted-foreground")}>{item.label}</span>
              </Link>
            );
          })}
          <Link to="/settings" className="relative p-2 flex flex-col items-center gap-1">
             <Avatar className="h-6 w-6 border border-border shadow-sm">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
