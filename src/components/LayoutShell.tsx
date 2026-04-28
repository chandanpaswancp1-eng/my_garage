import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, Menu, Bell, ChevronDown, X, LogOut } from 'lucide-react';
import { Button } from './UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  sidebarItems: { id: string; label: string; icon: React.ElementType; path: string }[];
  basePath: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebarItems, basePath }) => {
  const { currentUser, setCurrentUser, users, notifications, markNotificationsRead, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Safety check to prevent crashes if user is null
  if (!currentUser) return null;

  const myNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const activeTabId = sidebarItems.find(item => location.pathname === item.path || (item.id === 'dashboard' && location.pathname === basePath))?.id || 'dashboard';

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const user = users.find(u => u.role === e.target.value);
    if (user) {
      setCurrentUser(user);
      navigate('/'); // Redirect to base on role switch
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead(currentUser.id);
    }
  };

  return (
    <div className="flex h-[100dvh] bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col shadow-2xl md:shadow-none border-r border-slate-800`}>
        <div className="flex items-center justify-between md:justify-center h-20 border-b border-slate-700/50 px-6">
          <div className="flex items-center">
            <div className="bg-blue-600/20 p-2 rounded-xl mr-3">
              <Wrench className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">SEWA AUTO</span>
          </div>
          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTabId === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 pb-safe space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center mr-3 shadow-inner border-2 border-slate-700 flex-shrink-0">
              <span className="font-bold text-white text-lg">{currentUser.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 capitalize truncate">{currentUser.role} Account</p>
            </div>
          </div>
          <div className="relative">
             <select 
                className="w-full bg-slate-800 text-sm text-slate-200 border border-slate-700 rounded-xl p-3 appearance-none focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer transition-colors hover:bg-slate-700"
                value={currentUser.role}
                onChange={handleRoleSwitch}
              >
                <option value="admin">Switch to Admin</option>
                <option value="customer">Switch to Customer</option>
                <option value="staff">Switch to Staff</option>
             </select>
             <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
          <Button variant="danger" size="sm" className="w-full h-11" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30 pt-safe">
          <div className="flex items-center">
            <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 ml-2 md:ml-0 capitalize truncate max-w-[200px] sm:max-w-none">{activeTabId.replace('_', ' ')}</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4" ref={notificationRef}>
            <button 
              className="text-slate-500 hover:text-blue-600 relative p-2.5 rounded-full hover:bg-blue-50 transition-all duration-200"
              onClick={handleNotificationClick}
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-16 md:top-20 right-4 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors p-2 -mr-2" onClick={() => markNotificationsRead(currentUser.id)}>Mark all read</button>}
                </div>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {myNotifications.length > 0 ? (
                    myNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(notif => (
                      <div key={notif.id} className={`px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex items-start">
                          <div className={`w-2 h-2 mt-1.5 rounded-full mr-3 flex-shrink-0 ${!notif.read ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                          <div>
                            <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-1.5 font-medium">{new Date(notif.date).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Bell className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">You're all caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar pb-safe">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
