import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, Sparkles, Calendar, PartyPopper, FolderOpen, Settings, LogOut, Menu, X, Bell, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = profile?.business_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.slice(0, 2).toUpperCase();
  const email = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navItems = [
    { path: '/app', label: 'Dashboard', icon: Home },
    { path: '/app/generate', label: 'Generate Content', icon: Sparkles },
    { path: '/app/planner', label: 'Weekly Planner', icon: Calendar },
    { path: '/app/festivals', label: 'Festival Ideas', icon: PartyPopper },
    { path: '/app/library', label: 'Content Library', icon: FolderOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  // Generate breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/app' }];
    
    if (paths.length > 1) {
      const currentPath = paths[paths.length - 1];
      const item = navItems.find(nav => nav.path.endsWith(currentPath));
      if (item) {
        breadcrumbs.push({ label: item.label, path: item.path });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const showBackButton = location.pathname !== '/app';

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className="fixed lg:sticky top-0 left-0 h-screen w-64 glass-card-strong border-r border-white/30 flex flex-col z-50 lg:translate-x-0 transition-transform shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/30 flex items-center justify-between">
          <Logo size="md" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#64748B] hover:text-[#0F172A] p-2 hover:bg-white/40 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${
                      active
                        ? 'text-white'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-[#2EC4B6] to-[#4D9DE0] rounded-xl shadow-[0_8px_24px_rgba(46,196,182,0.3)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {!active && (
                      <div className="absolute inset-0 bg-white/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/30 space-y-2">
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/app/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-white/40 transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/30">
          <motion.div 
            className="glass-card flex items-center gap-3 p-3 rounded-xl border border-white/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#2EC4B6] to-[#4D9DE0] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(46,196,182,0.4)]">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[#0F172A] truncate">{displayName}</div>
              <div className="text-xs text-[#64748B] truncate">{email}</div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="text-[#64748B] hover:text-[#EF4444] transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 glass-card-strong z-30 border-b border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#64748B] hover:text-[#0F172A] p-2 hover:bg-white/40 rounded-xl transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Breadcrumbs */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-[#94A3B8]" />}
                    <Link
                      to={crumb.path}
                      className={`transition-colors ${
                        index === breadcrumbs.length - 1
                          ? 'text-[#0F172A] font-medium'
                          : 'text-[#64748B] hover:text-[#2EC4B6]'
                      }`}
                    >
                      {crumb.label}
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Mobile: Show back button and title */}
              <div className="md:hidden flex items-center gap-3">
                {showBackButton && (
                  <motion.button
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-white/40 rounded-xl transition-all text-[#64748B] hover:text-[#0F172A]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                )}
                <div>
                  <h1 className="text-xl font-bold text-[#0F172A]">Good morning, {displayName}! ☀️</h1>
                  <p className="text-xs text-[#64748B]">Let's create something amazing</p>
                </div>
              </div>
              
              {/* Desktop: Show greeting */}
              <div className="hidden md:block ml-6">
                <h1 className="text-2xl font-bold text-[#0F172A]">Good morning, {displayName}! ☀️</h1>
                <p className="text-sm text-[#64748B]">Let's create something amazing today</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-white/40 rounded-xl transition-all"
              >
                <Bell className="w-6 h-6" />
                <motion.span 
                  className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-[#FF9F1C] to-[#FF6B9D] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 p-2 hover:bg-white/40 rounded-xl transition-all"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#2EC4B6] to-[#4D9DE0] rounded-full flex items-center justify-center text-white text-sm shadow-[0_0_20px_rgba(46,196,182,0.4)]">
                  {initials}
                </div>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Floating Action Button (Mobile) */}
        <AnimatePresence>
          {location.pathname === '/app' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-6 right-6 lg:hidden z-30"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  to="/app/generate"
                  className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2EC4B6] via-[#4D9DE0] to-[#818CF8] rounded-full text-white shadow-[0_8px_32px_rgba(46,196,182,0.4)] hover:shadow-[0_16px_48px_rgba(46,196,182,0.5)]"
                >
                  <Sparkles className="w-7 h-7" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}