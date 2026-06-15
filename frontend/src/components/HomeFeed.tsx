/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Check, ArrowUpRight } from 'lucide-react';
import { content as contentApi } from '../api/client';

interface HomeFeedProps {
  onNavigateToShow: (id: number) => void;
  onShowToast: (msg: string) => void;
  setPage: (page: any) => void;
}

export default function HomeFeed({
  onNavigateToShow, onShowToast, setPage
}: HomeFeedProps) {
  const [featured, setFeatured] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [anime, setAnime] = useState<any[]>([]);
  const [comedy, setComedy] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [featRes, trendRes, animeRes, comedyRes] = await Promise.all([
          contentApi.getFeatured(),
          contentApi.getTrending({ limit: 20 }),
          contentApi.getCatalog({ genre: 'Anime', limit: 20 }),
          contentApi.getCatalog({ genre: 'Comedy', limit: 20 }),
        ]);
        setFeatured(featRes.data || []);
        setTrending(trendRes.data || []);
        setAnime(animeRes.data || []);
        setComedy(comedyRes.data || []);
      } catch (err: any) {
        onShowToast(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    onShowToast(genre === 'all' ? "Showing all genres" : `Filtered homepage to: ${genre}`);
  };

  const heroShow = featured[0];

  const filterByGenre = (items: any[]) =>
    selectedGenre === 'all' ? items : items.filter((s: any) =>
      s.genres?.includes(selectedGenre)
    );

  const filteredTrending = filterByGenre(trending);
  const filteredAnime = filterByGenre(anime);
  const filteredComedy = filterByGenre(comedy);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20 overflow-x-hidden"
    >
      
      {/* Immersive Hero Section Banner */}
      <section className="relative h-[680px] w-full overflow-hidden bg-neutral-950 select-none">
        {heroShow ? (
          <>
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover select-none" 
                alt="Hero" 
                src={heroShow.backdropUrl || heroShow.posterUrl} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-end px-4 md:px-[4%] pb-16 max-w-4xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-red-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded">
                  {heroShow.isFeatured ? 'FEATURED' : 'ORIGINAL'}
                </span>
                <span className="text-neutral-400 font-bold text-xs uppercase tracking-wide">
                  {heroShow.durationMinutes} min
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight drop-shadow-xl">
                {heroShow.title}
              </h2>

              <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3">
                {heroShow.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => onNavigateToShow(heroShow.id)}
                  className="bg-white hover:bg-neutral-200 text-black px-8 py-3 flex items-center gap-2 font-bold rounded-lg transition-all active:scale-95 text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-lg"
                >
                  <Play size={14} fill="currentColor" />
                  Play
                </button>

                <button 
                  onClick={() => setPage('signup')}
                  className="bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white px-8 py-3 flex items-center gap-2 font-bold rounded-lg transition-all active:scale-95 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Free Trial
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            {loading ? 'Loading...' : 'No featured content'}
          </div>
        )}
      </section>

      {/* Horizontal Category Filtering Row Tabs */}
      <section className="px-4 md:px-[4%] -mt-8 relative z-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          {[
            { id: "all", label: "All" },
            { id: "Action", label: "Action" },
            { id: "Comedy", label: "Comedy" },
            { id: "Horror", label: "Horror" },
            { id: "Drama", label: "Drama" },
            { id: "Sci-Fi", label: "Sci-Fi" },
            { id: "Thriller", label: "Thriller" },
            { id: "Documentary", label: "Documentaries" }
          ].map(f => {
            const isSelected = selectedGenre === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleGenreClick(f.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-850'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Group Slider Rows */}
      <section className="px-4 md:px-[4%] mt-12 space-y-12 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          
          {/* TRENDING NOW SLIDER ROW */}
          {filteredTrending.length > 0 && (
            <motion.div layout initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Trending Now</h2>
                <button onClick={() => setPage('movies')}
                  className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
                {filteredTrending.map((show: any) => (
                  <div key={show.id}
                    onClick={() => onNavigateToShow(show.id)}
                    className="relative min-w-[200px] md:min-w-[280px] aspect-video rounded-xl overflow-hidden shrink-0 group transition-all duration-300 hover:scale-[1.03] cursor-pointer bg-neutral-900 border border-neutral-900/60 shadow-lg"
                  >
                    <img className="w-full h-full object-cover" src={show.posterUrl} alt={show.title} />
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="p-3 bg-red-600 rounded-full text-white shadow shadow-red-600/20 cursor-pointer">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* POPULAR ANIME SLIDER ROW */}
          {filteredAnime.length > 0 && (
            <motion.div layout initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Popular Anime</h2>
                <button onClick={() => setPage('movies')}
                  className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
                {filteredAnime.map((show: any) => (
                  <div key={show.id}
                    onClick={() => onNavigateToShow(show.id)}
                    className="relative min-w-[130px] md:min-w-[180px] aspect-[2/3] rounded-xl overflow-hidden shrink-0 group transition-all duration-350 hover:scale-[1.03] cursor-pointer bg-neutral-900 border border-neutral-900/60 shadow-lg"
                  >
                    <img className="w-full h-full object-cover" src={show.posterUrl} alt={show.title} />
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-2.5 bg-red-600 rounded-full text-white cursor-pointer">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* COMEDY/OTHER SPECIALS SLIDER ROW */}
          {filteredComedy.length > 0 && (
            <motion.div layout initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">Comedy Specials & Docs</h2>
                <button onClick={() => setPage('movies')}
                  className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
                {filteredComedy.map((show: any) => (
                  <div key={show.id}
                    onClick={() => onNavigateToShow(show.id)}
                    className="relative min-w-[200px] md:min-w-[280px] aspect-video rounded-xl overflow-hidden shrink-0 group transition-all duration-300 hover:scale-[1.03] cursor-pointer bg-neutral-900 border border-neutral-900/60 shadow-lg"
                  >
                    <img className="w-full h-full object-cover" src={show.posterUrl} alt={show.title} />
                    <div className="absolute inset-0 bg-neutral-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-3 bg-red-600 rounded-full text-white cursor-pointer">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </section>

    </motion.div>
  );
}
