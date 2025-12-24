import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, Users, Calendar, Settings, LogOut, Zap, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Discover', path: '/discover' },
    { icon: Heart, label: 'Ship Friends', path: '/ship' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Users, label: 'Communities', path: '/communities' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 fixed h-screen border-r border-white/5 bg-bg-secondary/30 hidden lg:flex flex-col p-6 glass-card rounded-none">
        <Link to="/home" className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center font-bold text-white shadow-lg shadow-primary-600/20">O</div>
          <span className="text-xl font-bold tracking-tight">Origo</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-medium">
             {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
            <p className="text-xs text-text-tertiary truncate">{user?.college || 'University'}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive ? 'primary' : 'ghost'} 
                  className={`w-full justify-start ${!isActive && 'text-text-secondary hover:text-white'}`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Premium Upgrade */}
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-primary-900/50 to-secondary-900/50 border border-white/10 mb-4">
          <div className="flex items-center gap-2 mb-2 text-yellow-500">
             <Zap size={16} fill="currentColor" />
             <span className="text-sm font-bold">Go Premium</span>
          </div>
          <p className="text-xs text-text-tertiary mb-3">See who viewed your profile & more.</p>
          <Button size="sm" variant="outline" className="w-full text-xs h-8 border-white/20 hover:bg-white/10 text-white">Upgrade</Button>
        </div>

        <button 
          onClick={logout} 
          className="flex items-center gap-3 px-4 py-2 text-sm text-text-tertiary hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
