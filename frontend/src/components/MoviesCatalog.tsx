/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Star, Loader2, Filter } from 'lucide-react';
import { content as contentApi } from '../api/client';

interface MoviesCatalogProps {
  onNavigateToShow: (id: number) => void;
  onShowToast: (msg: string) => void;
}

export default function MoviesCatalog({
  onNavigateToShow, onShowToast
}: MoviesCatalogProps) {
  const [shows, setShows] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);
  const [genre, setGenre] = useState("all");
  const [year, setYear] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [gridLoading, setGridLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const yearMap: Record<string, number | undefined> = {
    '2024': 2024, '2023': 2023, 'recent': undefined, 'classic': undefined,
  };

  useEffect(() => {
    async function load() {
      setGridLoading(true);
      try {
        const params: any = { type: 'movie', page, limit: 20 };
        if (genre !== 'all') params.genre = genre;
        if (year !== 'all') {
          const y = yearMap[year];
          if (y) params.year = y;
        }
        if (sortBy !== 'trending') params.sort = sortBy === 'newest' ? 'year' : sortBy === 'rating' ? 'rating' : 'title';

        const res = await contentApi.getCatalog(params);
        setShows(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err: any) {
        onShowToast(err.message || 'Failed to load catalog');
      } finally {
        setGridLoading(false);
      }
    }
    load();
  }, [genre, year, sortBy, page]);

  const handleDropdownChange = (filterType: string, value: string) => {
    if (filterType === 'genre') setGenre(value);
    if (filterType === 'year') setYear(value);
    if (filterType === 'sort') setSortBy(value);
    setPage(1);
    onShowToast(`Filtering catalog...`);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    } else {
      onShowToast("No more content available");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-24 pb-20 px-4 md:px-[4%] max-w-7xl mx-auto"
    >
      {/* Title & Toggle buttons bar */}
      <div className="mt-4 mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-black text-white tracking-tight">Movies</h1>
        
        <button 
          onClick={() => setIsCollapsibleOpen(!isCollapsibleOpen)}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider"
        >
          <Filter size={14} className="text-red-500" />
          <span>Filters</span>
        </button>
      </div>

      {/* Select Filters Collapse Bar */}
      <AnimatePresence>
        {isCollapsibleOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-neutral-900/10 backdrop-blur-md py-4 mb-8 flex flex-wrap gap-6 items-center border-y border-neutral-900/60 sticky top-20 z-40"
          >
            {/* Genre trigger */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Genre:</span>
              <select 
                value={genre}
                onChange={(e) => handleDropdownChange('genre', e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs font-bold uppercase text-neutral-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 py-2 px-4 cursor-pointer outline-none transition-all"
              >
                <option value="all">All Genres</option>
                <option value="action">Action</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="thriller">Thriller</option>
                <option value="comedy">Comedy</option>
                <option value="documentary">Documentary</option>
              </select>
            </div>

            {/* Year trigger */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Year:</span>
              <select 
                value={year}
                onChange={(e) => handleDropdownChange('year', e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs font-bold uppercase text-neutral-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 py-2 px-4 cursor-pointer outline-none transition-all"
              >
                <option value="all">Release Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="recent">2020 - 2022</option>
                <option value="classic">Clasics</option>
              </select>
            </div>

            {/* Sort trigger */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => handleDropdownChange('sort', e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs font-bold uppercase text-neutral-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 py-2 px-4 cursor-pointer outline-none transition-all"
              >
                <option value="trending">Trending Now</option>
                <option value="newest">Newest Releases</option>
                <option value="rating">Rating (High - Low)</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Posters catalog */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 tracking-tight transition-opacity duration-300 ${
            gridLoading ? 'opacity-40' : 'opacity-100'
          }`}
        >
          {shows.map((show: any) => (
            <motion.div
              layout
              key={show.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={() => onNavigateToShow(show.id)}
              className="group relative transition-all duration-350 cursor-pointer block hover:scale-105 hover:z-10"
            >
              <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-900/60 relative">
                <img 
                  alt={show.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src={show.posterUrl} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="w-full bg-red-650 hover:bg-red-500 text-white py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg">
                    <Play size={13} fill="currentColor" /> Play
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-black text-white truncate leading-snug">{show.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400 font-bold">
                  <Star size={12} className="text-red-500 fill-current mt-[-1px]" />
                  <span>{show.ratingScore || show.rating || 'N/A'}</span>
                  <span className="ml-auto text-neutral-500 uppercase tracking-wider text-[9px]">
                    {show.genres?.[0] || ''}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Dynamic Appending "Load More" controls */}
      <div className="mt-12 flex justify-center border-t border-neutral-900/50 pt-8">
        <button 
          onClick={handleLoadMore}
          disabled={isLoadingMore || page >= totalPages}
          className="px-16 py-3 bg-neutral-900 hover:bg-neutral-800 hover:text-white border border-neutral-850 rounded-lg font-bold text-xs uppercase tracking-widest text-neutral-400 transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          {isLoadingMore ? (
            <>
              <Loader2 className="animate-spin text-red-500" size={14} />
              <span>Loading...</span>
            </>
          ) : (
            <span>Load More</span>
          )}
        </button>
      </div>

    </motion.div>
  );
}
