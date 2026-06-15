/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

import { auth as authApi } from './api/client';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeFeed from './components/HomeFeed';
import MoviesCatalog from './components/MoviesCatalog';
import MyListGrid from './components/MyListGrid';
import ShowDetails from './components/ShowDetails';
import WatchHistoryView from './components/WatchHistoryView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import AuthPages from './components/AuthPages';

import { ActivePage, User } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('sx_token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('sx_user');
    if (cached) {
      try { return JSON.parse(cached); } catch { return null; }
    }
    return null;
  });

  const [activePage, setActivePage] = useState<ActivePage>(() => {
    const cached = localStorage.getItem('sx_active_page');
    return (cached as ActivePage) || 'home';
  });

  const [selectedShowId, setSelectedShowId] = useState<number | null>(() => {
    const cached = localStorage.getItem('sx_selected_show_id');
    return cached ? parseInt(cached, 10) || null : null;
  });

  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sx_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sx_active_page', activePage);
  }, [activePage]);

  useEffect(() => {
    if (selectedShowId) {
      localStorage.setItem('sx_selected_show_id', String(selectedShowId));
    } else {
      localStorage.removeItem('sx_selected_show_id');
    }
  }, [selectedShowId]);

  const handleShowToast = (message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message }]);
    
    // Automatically dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    localStorage.setItem('sx_user', JSON.stringify(loggedInUser));
    setActivePage('home');
    handleShowToast(`Welcome back, ${loggedInUser.username}!`);
  };

  const handleLogout = () => {
    authApi.clearToken();
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('sx_user');
    handleShowToast("Sign out successful.");
  };

  const handleDeleteAccount = () => {
    authApi.clearToken();
    setIsLoggedIn(false);
    setUser(null);
    localStorage.clear();
    handleShowToast("Your account has been deleted. Goodbye!");
  };

  const handleNavigateToShow = (id: number) => {
    setSelectedShowId(id);
    setActivePage('watch');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomeFeed 
            onNavigateToShow={handleNavigateToShow}
            onShowToast={handleShowToast}
            setPage={(p) => setActivePage(p)}
          />
        );
      case 'movies':
        return (
          <MoviesCatalog 
            onNavigateToShow={handleNavigateToShow}
            onShowToast={handleShowToast}
          />
        );
      case 'mylist':
        return (
          <MyListGrid 
            onNavigateToShow={handleNavigateToShow}
            onShowToast={handleShowToast}
            setPage={(p) => setActivePage(p)}
          />
        );
      case 'history':
        return (
          <WatchHistoryView 
            onShowToast={handleShowToast}
            setPage={(p) => setActivePage(p)}
          />
        );
      case 'profile':
        return (
          <ProfileView
            onNavigateToShow={handleNavigateToShow}
            onShowToast={handleShowToast}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            user={user}
            onUpdateUser={(updated) => setUser((prev) => (prev ? { ...prev, ...updated } : prev))}
            onShowToast={handleShowToast}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      case 'watch':
        if (!selectedShowId) {
          return (
            <div className="pt-32 text-center text-neutral-400">
              <p>No active movie or series selected.</p>
              <button 
                onClick={() => setActivePage('home')}
                className="mt-4 px-6 py-2 bg-red-600 text-white border border-neutral-800 rounded"
              >
                Go Home
              </button>
            </div>
          );
        }
        return (
          <ShowDetails 
            contentId={selectedShowId}
            onBack={() => setActivePage('home')}
            onShowToast={handleShowToast}
            onNavigateToShow={handleNavigateToShow}
          />
        );
      default:
        return <div className="pt-32 text-center text-neutral-500">Page not found</div>;
    }
  };

  // Auth Guard
  if (!isLoggedIn) {
    return (
      <AuthPages 
        onAuthSuccess={handleAuthSuccess}
        onShowToast={handleShowToast}
        initialMode="login"
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white pb-16 md:pb-0">
      
      {/* Top sticky bar */}
      <Header 
        activePage={activePage}
        setPage={(p) => setActivePage(p)}
        user={user}
        onLogout={handleLogout}
        onShowToast={handleShowToast}
      />

      {/* Main active viewport layout */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Mobile navigation bottom drawer bar */}
      <BottomNav 
        activePage={activePage}
        setPage={(p) => setActivePage(p)}
        onShowToast={handleShowToast}
      />

      {/* Custom Global Floating Toast Popups Overlay wrapper */}
      <div 
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2.5 items-center w-full max-w-sm px-4 pointer-events-none"
        id="toast-notifications-container"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-neutral-900/90 border border-neutral-800/80 backdrop-blur-md px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 w-full pointer-events-auto"
            >
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse-slow shrink-0" />
              <p className="text-xs font-bold text-neutral-200 tracking-wide flex-1 leading-normal">
                {toast.message}
              </p>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-neutral-500 hover:text-white transition-colors p-1 rounded"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
