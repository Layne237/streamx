/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Bell, User as UserIcon, Settings, History, List, LogOut } from 'lucide-react';
import { ActivePage } from '../types';

interface HeaderProps {
  activePage: ActivePage;
  setPage: (page: ActivePage) => void;
  user: User | null;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
}

export default function Header({ activePage, setPage, user, onLogout, onShowToast }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLinkClick = (page: ActivePage, e: React.MouseEvent) => {
    e.preventDefault();
    setPage(page);
    setDropdownOpen(false);
  };

  const menuItems = [
    { label: 'Home', page: 'home' as ActivePage },
    { label: 'Movies', page: 'movies' as ActivePage },
    { label: 'My List', page: 'mylist' as ActivePage },
    { label: 'History', page: 'history' as ActivePage }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <div className="flex items-center gap-8">
        <button 
          onClick={() => setPage('home')} 
          className="text-2xl font-black tracking-tighter text-red-600 hover:text-red-500 transition-colors uppercase"
          id="brand-logo"
        >
          StreamX
        </button>
        
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-6 items-center">
          {menuItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'text-red-500 border-b-2 border-red-500 pb-1' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {/* Search trigger */}
        <button 
          onClick={() => {
            setPage('movies');
            onShowToast("Search catalog matching input...");
          }}
          className="text-neutral-400 hover:text-white hover:scale-110 transition-all duration-200 p-1 rounded"
          title="Search"
        >
          <Search size={20} />
        </button>

        {/* Notifications trigger */}
        <button 
          onClick={() => onShowToast("No new notifications")}
          className="text-neutral-400 hover:text-white hover:scale-110 transition-all duration-200 p-1 relative rounded"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        {/* Avatar Trigger with hover/click dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            className="w-10 h-10 rounded-lg overflow-hidden border-2 border-red-600/30 hover:border-red-600/80 transition-all duration-300 cursor-pointer hover:scale-105"
            id="profile-dropdown-trigger"
          >
            {user?.avatar ? (
              <img alt={user.username} className="w-full h-full object-cover" src={user.avatar} />
            ) : (
              <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-white text-sm font-black">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-neutral-800">
                <p className="text-sm font-bold text-white truncate">{user.username}</p>
                <p className="text-xs text-neutral-400 truncate mt-0.5">{user?.email || ''}</p>
              </div>

              <button
                onMouseDown={(e) => handleLinkClick('profile', e)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors text-left"
              >
                <UserIcon size={16} />
                Profile
              </button>

              <button
                onMouseDown={(e) => handleLinkClick('mylist', e)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors text-left"
              >
                <List size={16} />
                My List
              </button>

              <button
                onMouseDown={(e) => handleLinkClick('history', e)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors text-left"
              >
                <History size={16} />
                History
              </button>

              <button
                onMouseDown={(e) => handleLinkClick('settings', e)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors text-left"
              >
                <Settings size={16} />
                Account Settings
              </button>

              <hr className="my-1 border-neutral-800" />

              <button
                onMouseDown={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-neutral-800 transition-colors text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
