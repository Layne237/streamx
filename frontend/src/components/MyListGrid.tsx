import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Trash2, ListChecks, ChevronDown } from 'lucide-react';
import { user as userApi } from '../api/client';

interface MyListGridProps {
  onNavigateToShow: (id: number) => void;
  onShowToast: (msg: string) => void;
  setPage: (page: any) => void;
}

export default function MyListGrid({
  onNavigateToShow, onShowToast, setPage
}: MyListGridProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Movies' | 'Series' | 'Anime'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'Recent' | 'Alpha' | 'Release'>('Recent');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await userApi.getWatchlist();
        setItems(res.data || []);
      } catch (err: any) {
        onShowToast(err.message || 'Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRemove = async (id: number) => {
    setRemovingId(id);
    try {
      await userApi.removeFromWatchlist(id);
      setItems((prev) => prev.filter((i: any) => i.id !== id));
      onShowToast('Removed from My List');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to remove');
    } finally {
      setRemovingId(null);
    }
  };

  const filteredItems = items.filter((item: any) => {
    if (activeTab === 'All') return true;
    const type = item.type || item.content?.type || '';
    const genres = item.genres || item.content?.genres || [];
    if (activeTab === 'Movies') return type === 'movie';
    if (activeTab === 'Series') return type === 'series';
    if (activeTab === 'Anime') return genres.includes('Anime');
    return true;
  });

  const sortedItems = [...filteredItems].sort((a: any, b: any) => {
    if (sortBy === 'Alpha') return (a.title || a.content?.title || '').localeCompare(b.title || b.content?.title || '');
    if (sortBy === 'Release') return ((b.year || b.content?.year || 0) - (a.year || a.content?.year || 0));
    return 0;
  });

  const getTitle = (item: any) => item.title || item.content?.title || 'Unknown';
  const getPoster = (item: any) => item.posterUrl || item.content?.posterUrl || '';
  const getType = (item: any) => {
    const type = item.type || item.content?.type || '';
    const genres = item.genres || item.content?.genres || [];
    if (type === 'series') return 'Series';
    if (genres.includes('Anime')) return 'Anime';
    return 'Movie';
  };
  const getYear = (item: any) => item.year || item.content?.year || '';
  const getId = (item: any) => item.content?.id || item.id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 pb-20 px-4 md:px-[4%] max-w-7xl mx-auto"
    >
      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-sm w-full relative z-10 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Clear My List?</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Are you sure you want to remove all titles from your list? This action cannot be undone.
            </p>
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase text-neutral-400 hover:bg-neutral-800 transition-colors border border-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => { setModalOpen(false); /* API clear all not implemented */ }}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-red-600 text-white shadow-lg shadow-red-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <section className="mt-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">My List</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-neutral-400 font-medium">
              {items.length} saved titles
            </p>
            {items.length > 0 && (
              <button
                onClick={() => setModalOpen(true)}
                className="text-red-500 hover:text-red-400 text-xs font-semibold uppercase tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer ml-1"
              >
                <Trash2 size={13} />
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              onBlur={() => setTimeout(() => setSortDropdownOpen(false), 200)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Sort: {sortBy === 'Recent' ? 'Recently Added' : sortBy === 'Alpha' ? 'A-Z' : 'Release Date'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-1 z-30">
                <button
                  onMouseDown={() => { setSortBy('Recent'); onShowToast('Sorted by Recent'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Recently Added
                </button>
                <button
                  onMouseDown={() => { setSortBy('Alpha'); onShowToast('Sorted Alphabetically'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border-t border-neutral-800/40"
                >
                  Alphabetical (A-Z)
                </button>
                <button
                  onMouseDown={() => { setSortBy('Release'); onShowToast('Sorted by Year'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border-t border-neutral-800/40"
                >
                  Release Date
                </button>
              </div>
            )}
          </div>

          <div className="flex bg-neutral-950 p-1 border border-neutral-900 rounded-xl">
            {(['All', 'Movies', 'Series', 'Anime'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); onShowToast(`Viewing ${tab} items`); }}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/10 scale-105'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-500">Loading...</div>
        ) : sortedItems.length > 0 ? (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedItems.map((item: any) => {
              const id = getId(item);
              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-[2/3] bg-neutral-900 border border-neutral-900/40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  <div onClick={() => onNavigateToShow(id)} className="absolute inset-0 cursor-pointer z-0">
                    <img src={getPoster(item)} alt={getTitle(item)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>
                  </div>

                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10 pointer-events-none group-hover:pointer-events-auto">
                    <button
                      onClick={() => onNavigateToShow(id)}
                      className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
                    >
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </button>
                    <button
                      onClick={() => handleRemove(id)}
                      disabled={removingId === id}
                      className="w-10 h-10 rounded-full bg-neutral-800/80 backdrop-blur-md text-white hover:bg-red-600 flex items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 p-3 w-full pointer-events-none">
                    <p className="text-xs font-extrabold text-white truncate">{getTitle(item)}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] bg-red-600/20 text-red-500 font-extrabold tracking-widest uppercase px-1.5 py-0.5 rounded border border-red-500/10">
                        {getType(item)}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-bold">{getYear(item)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-500">
              <ListChecks size={48} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Your list has no {activeTab !== 'All' ? activeTab.toLowerCase() : ''} items</h3>
              <p className="text-xs text-neutral-400 max-w-xs">
                Start browsing and save your favorite anime shows or movies to watch them here anytime.
              </p>
            </div>
            <button
              onClick={() => setPage('home')}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/10 transition-all active:scale-95 cursor-pointer"
            >
              Explore Catalog
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
