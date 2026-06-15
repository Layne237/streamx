import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Calendar, Trash2 } from 'lucide-react';
import { user as userApi } from '../api/client';

interface WatchHistoryViewProps {
  onShowToast: (msg: string) => void;
  setPage: (page: any) => void;
}

export default function WatchHistoryView({
  onShowToast, setPage
}: WatchHistoryViewProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await userApi.getHistory();
        setItems(res.data || []);
      } catch (err: any) {
        onShowToast(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleClearHistory = async () => {
    try {
      await userApi.clearHistory();
      setItems([]);
      setIsModalOpen(false);
      onShowToast("History cleared successfully");
    } catch (err: any) {
      onShowToast(err.message || 'Failed to clear history');
    }
  };

  const filteredItems = items.filter((item: any) => {
    if (activeFilter === 'all') return true;
    const ts = item.timestamp || item.watchedAt || '';
    const now = new Date();
    const d = new Date(ts);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (activeFilter === 'today') return diff < 1;
    if (activeFilter === 'yesterday') return diff >= 1 && diff < 2;
    if (activeFilter === 'week') return diff < 7;
    return true;
  });

  const getThumbnail = (item: any) =>
    item.thumbnail || item.content?.posterUrl || item.posterUrl || '';
  const getTitle = (item: any) =>
    item.title || item.content?.title || 'Unknown';
  const getInfo = (item: any) =>
    item.info || item.content?.type || '';
  const getProgress = (item: any) =>
    item.progress ?? item.progressPercent ?? 0;

  if (loading) {
    return <div className="pt-32 text-center text-neutral-500">Loading history...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 pb-20 px-4 md:px-[4%] max-w-7xl mx-auto"
    >
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full relative z-10 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Clear Watch History?</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              This will permanently remove all watched items from your history across all connected devices.
            </p>
            <div className="flex gap-4 pt-2">
              <button onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase border border-neutral-800 text-neutral-400 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button onClick={handleClearHistory}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold tracking-wider uppercase text-white shadow-xl active:scale-95 transition-all cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-900 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Watch History</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {([
            { id: 'all' as const, label: 'All Time' },
            { id: 'today' as const, label: 'Today' },
            { id: 'yesterday' as const, label: 'Yesterday' },
            { id: 'week' as const, label: 'Last 7 Days' }
          ]).map(f => (
            <button key={f.id}
              onClick={() => { setActiveFilter(f.id); onShowToast(`Showing: ${f.label}`); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {f.label}
            </button>
          ))}

          {items.length > 0 && (
            <button onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 bg-neutral-900 hover:bg-red-650/10 hover:text-red-500 text-neutral-400 border border-neutral-850 hover:border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ml-2"
            >
              <Trash2 size={13} />
              Clear History
            </button>
          )}

          <span className="text-xs bg-neutral-900 border border-neutral-850 text-neutral-400 px-3 py-1.5 rounded-full font-bold">
            {filteredItems.length} Items
          </span>
        </div>
      </div>

      <div className="relative">
        {filteredItems.length > 0 && (
          <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-red-600 to-transparent opacity-20 hidden md:block" />
        )}

        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            <motion.div layout className="space-y-4">
              {filteredItems.map((item: any, idx: number) => (
                <motion.div key={item.id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-neutral-900 border border-neutral-900/60 p-3.5 rounded-xl hover:border-neutral-800 flex gap-4 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative w-36 h-20 md:w-44 md:h-24 shrink-0 rounded-lg overflow-hidden bg-neutral-950">
                    <img className="w-full h-full object-cover opacity-80" src={getThumbnail(item)} alt={getTitle(item)} />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-800">
                      <div className="h-full bg-red-600" style={{ width: `${getProgress(item)}%` }}></div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center flex-grow min-w-0 pr-1">
                    <h4 className="text-sm font-bold text-white truncate leading-snug">{getTitle(item)}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{getInfo(item)}</p>

                    <div className="mt-3 flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">
                        {getProgress(item) >= 100 ? 'Completed' : `${getProgress(item)}% watched`}
                      </span>

                      <button onClick={() => onShowToast(`Resuming ${getTitle(item)}...`)}
                        className="px-3.5 py-1.5 bg-neutral-800 hover:bg-red-600 hover:text-white rounded-full text-[10px] font-black uppercase tracking-wider text-neutral-300 transition-all cursor-pointer"
                      >
                        {getProgress(item) >= 100 ? 'Watch Again' : 'Resume'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-4"
            >
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-500">
                <RotateCcw size={48} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Your history is clear</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Shows and movies you watch will be recorded here so you can pick up where you left off.
                </p>
              </div>
              <button onClick={() => setPage('home')}
                className="bg-red-600 hover:bg-red-500 text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/10 transition-all active:scale-95 cursor-pointer"
              >
                Browse Catalog
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
