import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import Breadcrumbs from './ui/Breadcrumbs';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { apiFetch } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path ? 'nav-link-active' : 'nav-link';

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return;
      try {
        const data = await apiFetch('/notifications');
        if (Array.isArray(data)) {
          setUnreadCount(data.filter(n => !n.readStatus).length);
        }
      } catch {}
    };
    fetchUnread();
    const id = user ? setInterval(fetchUnread, 30000) : null;
    return () => { if (id) clearInterval(id); };
  }, [user, location.pathname]);

  const customerLinks = [
    { to: '/customer/dashboard', label: 'Dashboard' },
    { to: '/customer/parcels', label: 'My Parcels' },
    { to: '/customer/shops', label: 'Verified Shops' },
    { to: '/customer/add-parcel', label: 'Add Parcel' },
    { to: '/customer/notifications', label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { to: '/customer/profile', label: 'Profile' },
  ];
  const shopkeeperLinks = [
    { to: '/shopkeeper/dashboard', label: 'Dashboard' },
    { to: '/shopkeeper/incoming', label: 'Incoming' },
    { to: '/shopkeeper/pending-pickups', label: 'Pending Pickups' },
    { to: '/shopkeeper/revenue', label: 'Revenue' },
    { to: '/shopkeeper/notifications', label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { to: '/shopkeeper/profile', label: 'Profile' },
  ];
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/shops', label: 'Shops' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/parcels', label: 'Parcels' },
    { to: '/admin/analytics', label: 'Analytics' },
    { to: '/admin/notifications', label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
  ];

  const navLinks =
    user?.role === 'customer' ? customerLinks :
    user?.role === 'shopkeeper' ? shopkeeperLinks :
    user?.role === 'admin' ? adminLinks : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white tracking-tight">GramPickup</span>
            </Link>

            {/* Desktop Nav */}
            {user && (
              <nav className="hidden lg:flex items-center gap-6">
                {navLinks.map(l => (
                  <Link key={l.to} to={l.to} className={isActive(l.to)}>{l.label}</Link>
                ))}
              </nav>
            )}

            {!user && (
              <nav className="hidden lg:flex items-center gap-6">
                <Link to="/"       className={isActive('/')}>Home</Link>
                <Link to="/about"  className={isActive('/about')}>About</Link>
                <Link to="/contact" className={isActive('/contact')}>Contact</Link>
              </nav>
            )}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="btn-ghost p-2 rounded-lg"
                aria-label="Toggle dark mode"
              >
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>

              {user ? (
                <div className="hidden lg:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary text-xs py-1.5 px-3">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost">Sign In</Link>
                  <Link to="/register" className="btn-primary">Register</Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden btn-ghost p-2">
                {mobileOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl animate-slide-in flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="font-bold text-gray-900 dark:text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="btn-ghost p-1.5"><XIcon /></button>
            </div>

            {user && (
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 capitalize">{user.role}</p>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
              {user ? (
                navLinks.map(l => (
                  <Link key={l.to} to={l.to}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === l.to
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >{l.label}</Link>
                ))
              ) : (
                <>
                  <Link to="/"       className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">Home</Link>
                  <Link to="/about"   className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">About</Link>
                  <Link to="/contact" className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">Contact</Link>
                </>
              )}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
              {user ? (
                <button onClick={handleLogout} className="btn-danger w-full">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link to="/register" className="btn-primary w-full text-center" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {user && <Breadcrumbs />}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} GramPickup — Built by Aryan Sharma, DTU
          </p>
          <div className="flex gap-4">
            <Link to="/about" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">About</Link>
            <Link to="/contact" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
