import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Share2, Plus, Check,
  Send, ThumbsUp, Star, Tv, Info, ArrowLeft, RectangleHorizontal
} from 'lucide-react';
import { content as contentApi, user as userApi } from '../api/client';

interface ShowDetailsProps {
  contentId: number;
  onBack: () => void;
  onShowToast: (msg: string) => void;
  onNavigateToShow: (id: number) => void;
}

const presetComments = [
  {
    id: "comment-1",
    username: "NeonRider99",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDY97FE6cKRbKk2z5-as4xiCizOK5ujRRCr-Spa7bzc9jTqhEkDOSFzN-QnefpdY3eIZkLt1Q6pGRzEY5J9erfhfNbv_EpfsNS7BITbw0IrqgV4u9Cz-tlzwb8Pbu5BM4AsIp4w3YK3e47V0BC19SbOLy2zCBReA_pukgAz_sYOZcIRkKxDdeyTsnArPlonsVkvubpsXQNzkXd9RJGRIVnElWbxe8m2AOeTWSFsEPYx6IgeHkStElUYESXmTFoOV9LQLRROBuc10PE",
    timeAgo: "2 hours ago",
    text: "The visual direction of this episode is absolutely insane. That chase scene in the rain? Masterpiece.",
    likes: 42
  }
];

export default function ShowDetails({
  contentId, onBack, onShowToast, onNavigateToShow
}: ShowDetailsProps) {
  const [content, setContent] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeEpisodeIdx, setActiveEpisodeIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeProgress, setCurrentTimeProgress] = useState(25);
  const [comments, setComments] = useState(presetComments);
  const [commentText, setCommentText] = useState("");
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [contentRes, episodesRes] = await Promise.all([
          contentApi.getById(contentId),
          contentApi.getEpisodes(contentId),
        ]);
        setContent(contentRes.data || contentRes);
        setEpisodes(episodesRes.data || []);
      } catch (err: any) {
        onShowToast(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contentId]);

  const activeEpisode = episodes.length > 0 ? episodes[activeEpisodeIdx] : null;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    onShowToast(!isPlaying ? "Playing..." : "Paused");
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setCurrentTimeProgress(Math.min(Math.max(Math.round(pos * 100), 0), 100));
  };

  const handleFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement && videoRef.current) {
      videoRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleSelectEpisode = (idx: number) => {
    setActiveEpisodeIdx(idx);
    setIsPlaying(false);
    setCurrentTimeProgress(0);
    onShowToast(`Loading Episode ${idx + 1}...`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMyList = async () => {
    try {
      if (inList) {
        await userApi.removeFromWatchlist(contentId);
        setInList(false);
        onShowToast('Removed from My List');
      } else {
        await userApi.addToWatchlist(contentId);
        setInList(true);
        onShowToast('Added to My List');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update list');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast("Link copied!");
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    setComments((prev: any[]) => [{
      id: `comment-${Date.now()}`,
      username: "You",
      avatar: "",
      timeAgo: "Just now",
      text: commentText.trim(),
      likes: 0,
    }, ...prev]);
    setCommentText("");
    onShowToast("Comment posted!");
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map((c: any) => {
      if (c.id === commentId) {
        const liked = !c.isLikedByUser;
        return { ...c, likes: liked ? c.likes + 1 : c.likes - 1, isLikedByUser: liked };
      }
      return c;
    }));
  };

  const thumbnail = activeEpisode?.thumbnail || activeEpisode?.posterUrl || content?.posterUrl || '';
  const title = activeEpisode?.title || content?.title || 'Loading...';
  const description = activeEpisode?.description || content?.description || '';
  const genres = content?.genres || [];
  const year = content?.year || '';

  if (loading) {
    return <div className="pt-32 text-center text-neutral-500">Loading content...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="pt-24 pb-20 px-4 md:px-[4%] max-w-7xl mx-auto"
    >
      <button onClick={onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 uppercase text-xs tracking-wider font-bold cursor-pointer group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div ref={videoRef}
            onClick={() => setIsPlaying(!isPlaying)}
            className="group relative aspect-video bg-neutral-950 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center cursor-pointer select-none"
          >
            {thumbnail && (
              <img alt={title} className="absolute inset-0 w-full h-full object-cover opacity-80" src={thumbnail} />
            )}

            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute p-5 bg-red-600/90 text-white rounded-full shadow-2xl z-10 hover:bg-red-500 hover:scale-115 transition-all duration-300"
                >
                  <Play size={32} fill="currentColor" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
              <div onClick={handleProgressClick}
                className="w-full h-1 bg-white/20 hover:h-2 rounded-full mb-4 relative cursor-pointer transition-all group/progress"
              >
                <div className="absolute left-0 top-0 h-full bg-red-600 rounded-full" style={{ width: `${currentTimeProgress}%` }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-600 rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"
                  style={{ left: `${currentTimeProgress}%`, transform: 'translate(-50%, -50%)' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={handlePlayToggle}
                    className="text-white hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>
                  <button onClick={handleMuteToggle}
                    className="text-white hover:text-red-500 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <span className="text-xs font-mono text-neutral-300">0:00 / --:--</span>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); onShowToast("CC Enabled"); }}
                    className="text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-widest border border-neutral-600 px-1.5 py-0.5 rounded"
                  >
                    CC
                  </button>
                  <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); onShowToast("Autoplay ON"); }}
                    className="text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <RectangleHorizontal size={20} />
                  </button>
                  <button onClick={handleFullscreenToggle}
                    className="text-white hover:text-red-500 hover:scale-110 transition-all cursor-pointer"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {content?.title} {episodes.length > 0 ? `- Ep ${activeEpisodeIdx + 1}` : ''}
                </h1>
                <p className="text-sm font-medium text-neutral-400 mt-1">
                  {genres.join(' • ')} {year ? `• ${year}` : ''}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={handleToggleMyList}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    inList
                      ? 'bg-neutral-800 text-white border-neutral-700'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {inList ? <Check size={14} className="text-red-500" /> : <Plus size={14} />}
                  {inList ? 'Added' : 'My List'}
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>

            <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-3xl">{description}</p>
          </div>

          <div className="border-t border-neutral-900 pt-8 mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Comments ({comments.length})</h3>

            <div className="flex gap-4 items-start mb-8">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-800 bg-neutral-800 flex items-center justify-center text-neutral-400 text-sm font-black">
                U
              </div>

              <div className="flex-1 space-y-3">
                <textarea value={commentText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[80px] p-4 text-sm text-white placeholder-neutral-500 outline-none transition-all resize-none"
                />
                <div className="flex justify-end">
                  <button onClick={handlePostComment}
                    className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Send size={12} />
                    Post
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-800 bg-neutral-800 flex items-center justify-center text-neutral-400 text-sm font-black">
                    {comment.username[0]}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{comment.username}</span>
                      <span className="text-xs text-neutral-500">{comment.timeAgo}</span>
                    </div>
                    <p className="text-sm text-neutral-300">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                          comment.isLikedByUser ? 'text-red-500' : 'text-neutral-500 hover:text-white'
                        }`}
                      >
                        <ThumbsUp size={12} className={comment.isLikedByUser ? 'fill-current' : ''} />
                        <span>{comment.likes}</span>
                      </button>
                      <button onClick={() => onShowToast("Replies coming soon")}
                        className="text-xs text-neutral-500 hover:text-white"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {episodes.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-900/50 rounded-xl p-4 sticky top-24">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Tv size={16} className="text-red-500" />
                  Episodes
                </h3>
                <span className="text-[10px] uppercase font-black bg-neutral-800 text-neutral-400 px-2.5 py-1 rounded">
                  Season 1
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
                {episodes.map((ep: any, idx: number) => {
                  const isCurrent = idx === activeEpisodeIdx;
                  return (
                    <div key={ep.id || idx}
                      onClick={() => handleSelectEpisode(idx)}
                      className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-all border ${
                        isCurrent
                          ? 'bg-red-950/20 border-red-900/40 text-red-500'
                          : 'bg-neutral-950/30 border-transparent hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="relative w-28 shrink-0 aspect-video rounded-md overflow-hidden bg-neutral-900">
                        <img alt={ep.title}
                          className={`w-full h-full object-cover transition-opacity ${isCurrent ? 'opacity-50' : 'opacity-80'}`}
                          src={ep.thumbnail || ep.posterUrl || content?.posterUrl}
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Pause size={14} className="text-red-500 fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        {isCurrent && (
                          <span className="text-[9px] uppercase font-extrabold tracking-widest text-red-500 mb-0.5">Now Playing</span>
                        )}
                        <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-neutral-200'}`}>
                          Ep {idx + 1}: {ep.title}
                        </h4>
                        {ep.duration && <span className="text-[10px] text-neutral-500 mt-1">{ep.duration}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
