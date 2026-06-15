import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BadgeCheck, Edit2, List, Eye, MessageSquare, Star,
  Plus, ChevronRight, Save, X, Calendar
} from 'lucide-react';
import { user as userApi } from '../api/client';

interface ProfileViewProps {
  onNavigateToShow: (id: number) => void;
  onShowToast: (msg: string) => void;
}

export default function ProfileView({
  onNavigateToShow, onShowToast
}: ProfileViewProps) {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({ watchlistCount: 0, watchHistoryCount: 0 });
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'activity' | 'history'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempBio, setTempBio] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, statsRes, wlRes] = await Promise.all([
          userApi.getProfile(),
          userApi.getStats(),
          userApi.getWatchlist(),
        ]);
        setProfile(profileRes.data || profileRes.user || profileRes);
        setStats(statsRes.data || { watchlistCount: (wlRes.data || []).length, watchHistoryCount: 0 });
        setWatchlist(wlRes.data || []);
      } catch (err: any) {
        onShowToast(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const username = profile?.username || profile?.email || 'User';
  const bio = profile?.bio || '';
  const avatar = profile?.avatar || profile?.avatarUrl || '';
  const coverImage = profile?.coverImage || profile?.coverUrl || '';

  const handleOpenEdit = () => {
    setTempName(username);
    setTempBio(bio);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) {
      onShowToast("Name cannot be empty");
      return;
    }
    // API update not yet implemented; just show locally
    setProfile((prev: any) => ({ ...prev, username: tempName.trim(), bio: tempBio.trim() }));
    setIsEditModalOpen(false);
    onShowToast("Profile updated successfully!");
  };

  if (loading) {
    return <div className="pt-32 text-center text-neutral-500">Loading profile...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-20"
    >
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-xl p-6 relative z-10 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 size={16} className="text-red-500" />
                Edit Profile
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Display Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">Bio</label>
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 px-4 py-2.5 text-sm outline-none h-24 transition-all resize-none"
                  placeholder="Write a short biography..."
                />
              </div>

              <div className="pt-2 flex gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase border border-neutral-800 text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={13} />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <section className="relative w-full h-64 md:h-80 overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10"></div>
        {coverImage ? (
          <img alt="Profile Cover" className="w-full h-full object-cover opacity-60" src={coverImage} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-900/40 to-neutral-900" />
        )}

        <div className="absolute bottom-0 left-0 w-full px-4 md:px-[4%] z-20 pb-4">
          <div className="flex flex-col md:flex-row items-end gap-4 md:gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-neutral-950 overflow-hidden shadow-2xl shrink-0">
              {avatar ? (
                <img alt="Profile Avatar" className="w-full h-full object-cover" src={avatar} />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-2xl font-black">
                  {username[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight truncate">{username}</h1>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <BadgeCheck size={12} fill="currentColor" />
                  Premium
                </span>
                <button onClick={handleOpenEdit}
                  className="ml-auto md:ml-0 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 size={13} />
                  Edit
                </button>
              </div>
              {bio && <p className="text-neutral-400 font-medium text-sm md:text-base mt-2 italic">"{bio}"</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-[4%] mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
        <div onClick={() => { setActiveTab('watchlist'); onShowToast("Viewing saved Watchlist"); }}
          className="bg-neutral-900/60 border border-neutral-900 p-6 rounded-xl flex items-center justify-between group hover:bg-neutral-800/40 hover:border-neutral-800 transition-all cursor-pointer shadow-lg"
        >
          <div>
            <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">Watchlist</p>
            <h3 className="text-red-500 text-3xl font-black mt-1">{stats.watchlistCount || watchlist.length}</h3>
          </div>
          <List size={36} className="text-neutral-700 group-hover:text-red-500 transition-colors" />
        </div>

        <div onClick={() => { setActiveTab('history'); onShowToast("Viewing Watch History"); }}
          className="bg-neutral-900/60 border border-neutral-900 p-6 rounded-xl flex items-center justify-between group hover:bg-neutral-800/40 hover:border-neutral-800 transition-all cursor-pointer shadow-lg"
        >
          <div>
            <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">Watched</p>
            <h3 className="text-red-500 text-3xl font-black mt-1">{stats.watchHistoryCount || 0}</h3>
          </div>
          <Eye size={36} className="text-neutral-700 group-hover:text-red-500 transition-colors" />
        </div>

        <div onClick={() => onShowToast("Reviews feature coming soon")}
          className="bg-neutral-900/60 border border-neutral-900 p-6 rounded-xl flex items-center justify-between group hover:bg-neutral-800/40 hover:border-neutral-800 transition-all cursor-pointer shadow-lg"
        >
          <div>
            <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">Reviews</p>
            <h3 className="text-red-500 text-3xl font-black mt-1">0</h3>
          </div>
          <MessageSquare size={36} className="text-neutral-700 group-hover:text-red-500 transition-colors" />
        </div>
      </section>

      <nav className="px-4 md:px-[4%] mt-12 border-b border-neutral-900 flex gap-8 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
        {(['overview', 'watchlist', 'activity', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 border-b-2 font-bold text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'border-red-600 text-white font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="px-4 md:px-[4%] mt-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="panel-overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Recent Activity</h4>
                <button onClick={() => setActiveTab('activity')}
                  className="text-red-500 text-xs font-bold uppercase tracking-wider hover:underline flex items-center"
                >
                  View All <ChevronRight size={14} className="mt-0.5" />
                </button>
              </div>
              <div className="text-neutral-500 text-sm text-center py-8">No recent activity</div>
            </motion.div>
          )}

          {activeTab === 'watchlist' && (
            <motion.div key="panel-watchlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h4 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-4">My Watchlist</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {watchlist.slice(0, 6).map((item: any) => {
                  const id = item.content?.id || item.id;
                  const title = item.title || item.content?.title || '';
                  const poster = item.posterUrl || item.content?.posterUrl || '';
                  const year = item.year || item.content?.year || '';
                  return (
                    <div key={id} onClick={() => onNavigateToShow(id)}
                      className="group cursor-pointer space-y-2 hover:scale-105 transition-all duration-300"
                    >
                      <div className="aspect-[2/3] bg-neutral-900 rounded-xl overflow-hidden relative border border-neutral-800">
                        <img className="w-full h-full object-cover" src={poster} alt={title} />
                      </div>
                      <div className="px-1 min-w-0">
                        <h5 className="text-xs font-bold text-neutral-200 truncate">{title}</h5>
                        <p className="text-[10px] text-neutral-500 truncate mt-0.5">{year}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div key="panel-activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-12 text-neutral-400 text-center space-y-3"
            >
              <div className="p-3 bg-neutral-900 rounded-full border border-neutral-800 text-neutral-500">
                <Calendar size={24} />
              </div>
              <p className="text-sm font-semibold">Activity log coming soon</p>
              <button onClick={() => setActiveTab('overview')}
                className="text-red-500 text-xs font-bold uppercase tracking-wider hover:underline"
              >
                Back to overview
              </button>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="panel-history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h4 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-4">Watching History</h4>
              <div className="text-neutral-500 text-sm text-center py-8">No watch history yet</div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.div>
  );
}
