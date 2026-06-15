/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Search, Download, User as PersonIcon, History } from 'lucide-react';
import { ActivePage } from '../types';

interface BottomNavProps {
  activePage: ActivePage;
  setPage: (page: ActivePage) => void;
  onShowToast: (msg: string) => void;
}

export default function BottomNav({ activePage, setPage, onShowToast }: BottomNavProps) {
  const tabs = [
    { label: 'Home', icon: Home, page: 'home' as ActivePage },
    { label: 'Search', icon: Search, page: 'movies' as ActivePage }, // Movies Catalog acts as Search
    { 
      label: 'Downloads', 
      icon: Download, 
      page: null,
      onClick: () => onShowToast("No active downloads or offline videos") 
    },
    { label: 'History', icon: History, page: 'history' as ActivePage },
    { label: 'Profile', icon: PersonIcon, page: 'profile' as ActivePage }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-900 flex justify-around items-center h-16 px-4 shadow-xl">
      {tabs.map((tab, idx) => {
        const Icon = tab.icon;
        const isActive = tab.page ? activePage === tab.page : false;

        return (
          <button
            key={idx}
            onClick={() => {
              if (tab.page) {
                setPage(tab.page);
              } else if (tab.onClick) {
                tab.onClick();
              }
            }}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive 
                ? 'text-red-500 bg-red-500/10 rounded-full px-3 py-1 scale-105' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Icon size={18} />
            <span className="text-[10px] font-medium tracking-wide mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
