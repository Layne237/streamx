/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: number;
  isLikedByUser?: boolean;
}

export interface Show {
  id: string;
  title: string;
  genres: string[];
  year: number;
  ratingScore: number;
  maturity: string;
  duration: string;
  description: string;
  poster: string;
  backdrop: string;
  matchPercentage?: number;
  isOriginal?: boolean;
  episodes?: Episode[];
}

export interface User {
  username: string;
  email: string;
  plan: string;
  avatar: string;
  coverImage: string;
  isPremium: boolean;
  bio: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  progress: number; // percentage 0-100
  info: string; // e.g., "S2 • E8" or "Feature Film"
  remaining?: string;
  thumbnail: string;
  timestamp: string; // "Today" or "Yesterday" or "Last 7 Days"
}

export type ActivePage = 'home' | 'movies' | 'watch' | 'mylist' | 'profile' | 'settings' | 'history' | 'signup' | 'login';
export type ProfileTab = 'overview' | 'watchlist' | 'activity' | 'history';
export type SettingsTab = 'account' | 'subscription' | 'playback' | 'notifications';
