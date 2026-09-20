import React, { useState, useMemo } from 'react';
import { Testimonial, AboutData } from '../types';
import { Plus, Trash2, Camera, User, Check, Search, X, ArrowUpDown, ChevronUp, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { SocialCommentCard } from './SocialCommentCard';

interface AdminTestimonialsSectionProps {
  testimonials: Testimonial[];
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  addTestimonial: (initialPlatform?: 'instagram' | 'youtube' | 'twitter' | 'linkedin') => void;
  deleteTestimonial: (id: string) => void;
  updateAboutData: (updates: Partial<AboutData>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => void;
}

export const AdminTestimonialsSection: React.FC<AdminTestimonialsSectionProps> = ({
  testimonials = [],
  updateTestimonial,
  addTestimonial,
  deleteTestimonial,
  updateAboutData,
  handleImageUpload,
}) => {
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'youtube' | 'twitter' | 'linkedin'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'platform' | 'likes' | 'name'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  const totalCount = testimonials.length;
  const countInstagram = testimonials.filter(t => (t.platform || 'instagram') === 'instagram').length;
  const countYouTube = testimonials.filter(t => t.platform === 'youtube').length;
  const countTwitter = testimonials.filter(t => t.platform === 'twitter').length;
  const countLinkedIn = testimonials.filter(t => t.platform === 'linkedin').length;

  const parseLikes = (likesStr?: string): number => {
    if (!likesStr) return 0;
    const clean = likesStr.toLowerCase().trim();
    if (clean.endsWith('k')) return (parseFloat(clean.replace('k', '')) || 0) * 1000;
    if (clean.endsWith('m')) return (parseFloat(clean.replace('m', '')) || 0) * 1000000;
    return parseFloat(clean) || 0;
  };

  const handleAddComment = (platform?: 'instagram' | 'youtube' | 'twitter' | 'linkedin') => {
    const targetPlatform = platform || (platformFilter !== 'all' ? platformFilter : 'instagram');
    addTestimonial(targetPlatform);

    // If currently filtered to another platform, switch so new item is visible immediately
    if (platformFilter !== 'all' && platformFilter !== targetPlatform) {
      setPlatformFilter(targetPlatform);
    }
    // Set sorting to newest so the prepended card is right at the top
    setSortBy('newest');
    setSearchQuery('');

    // Highlight newly added item briefly
    setTimeout(() => {
      const topId = testimonials[0]?.id;
      if (topId) {
        setNewlyAddedId(topId);
        setTimeout(() => setNewlyAddedId(null), 3000);
      }
    }, 60);
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const items = [...testimonials];
    const currentIndex = items.findIndex(t => t.id === id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[currentIndex];
    items[currentIndex] = items[targetIndex];
    items[targetIndex] = temp;
    updateAboutData({ testimonials: items });
  };

  const displayedTestimonials = useMemo(() => {
    let list = [...testimonials];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t =>
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.username && t.username.toLowerCase().includes(q)) ||
        (t.text && t.text.toLowerCase().includes(q)) ||
        (t.company && t.company.toLowerCase().includes(q))
      );
    }

    // Platform tab filter
    if (platformFilter !== 'all') {
      list = list.filter(t => (t.platform || 'instagram') === platformFilter);
    }

    // Sort order
    if (sortBy === 'platform') {
      const order: Record<string, number> = { instagram: 0, youtube: 1, twitter: 2, linkedin: 3 };
      list.sort((a, b) => {
        const pA = a.platform || 'instagram';
        const pB = b.platform || 'instagram';
        return (order[pA] ?? 99) - (order[pB] ?? 99);
      });
    } else if (sortBy === 'likes') {
      list.sort((a, b) => parseLikes(b.likes) - parseLikes(a.likes));
    } else if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    // 'newest' keeps natural array order where index 0 is newest

    return list;
  }, [testimonials, platformFilter, sortBy, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Area */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 px-2">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-medium text-white">Social Testimonials & Comments</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white/80 border border-white/10">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Add, edit, and style comments for Instagram, YouTube, LinkedIn, or Twitter floating in the 3D 'The People Have Spoken' section.
          </p>
        </div>

        {/* Action Buttons (New comments prepended directly to the top!) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleAddComment()}
            className="px-4 py-2.5 bg-[#C9A96E] hover:bg-[#D8B97E] text-black rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#C9A96E]/20"
            title="Adds a new comment directly to the top of the backend list"
          >
            <Plus size={15} className="stroke-[3]" /> Add Comment to Top
          </button>

          {/* Quick Platform Presets */}
          <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => handleAddComment('instagram')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-pink-300/80 hover:text-pink-200 hover:bg-pink-500/20 transition-all flex items-center gap-1.5"
              title="Add Instagram comment to top"
            >
              <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" />
              <span>+ IG</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddComment('youtube')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-red-400/80 hover:text-red-300 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
              title="Add YouTube comment to top"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>+ YT</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddComment('twitter')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-sky-400/80 hover:text-sky-300 hover:bg-sky-500/20 transition-all flex items-center gap-1.5"
              title="Add Twitter / X comment to top"
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>+ X</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddComment('linkedin')}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#70B5F9]/80 hover:text-[#70B5F9] hover:bg-[#0A66C2]/20 transition-all flex items-center gap-1.5"
              title="Add LinkedIn comment to top"
            >
              <span className="w-2 h-2 rounded-full bg-[#0A66C2]" />
              <span>+ LinkedIn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter, Sort & Search Control Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Platform Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setPlatformFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                platformFilter === 'all'
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>All Platforms</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                platformFilter === 'all' ? 'bg-black/15 text-black' : 'bg-white/10 text-white/50'
              }`}>
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPlatformFilter('instagram')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                platformFilter === 'instagram'
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" />
              <span>Instagram</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                {countInstagram}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPlatformFilter('youtube')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                platformFilter === 'youtube'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>YouTube</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                {countYouTube}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPlatformFilter('twitter')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                platformFilter === 'twitter'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Twitter / X</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                {countTwitter}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPlatformFilter('linkedin')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                platformFilter === 'linkedin'
                  ? 'bg-[#0A66C2]/20 text-[#70B5F9] border border-[#0A66C2]/40 shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0A66C2]" />
              <span>LinkedIn</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                {countLinkedIn}
              </span>
            </button>
          </div>

          {/* Sorting & Search */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Sort selector */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 shrink-0">
              <ArrowUpDown size={14} className="text-[#C9A96E]" />
              <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest" className="bg-[#121212] text-white">Newest at Top (Default)</option>
                <option value="platform" className="bg-[#121212] text-white">By Platform (IG → YT → X → LinkedIn)</option>
                <option value="likes" className="bg-[#121212] text-white">Most Likes</option>
                <option value="name" className="bg-[#121212] text-white">Creator Name (A - Z)</option>
              </select>
            </div>

            {/* Search input */}
            <div className="relative flex-1 sm:w-44 md:w-52">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comments..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-7 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status feedback line */}
        <div className="flex items-center justify-between text-[11px] text-white/40 px-1 pt-2 border-t border-white/5">
          <span>
            Showing <strong className="text-white/80">{displayedTestimonials.length}</strong> of {totalCount} comments
            {platformFilter !== 'all' && (
              <span className="text-[#C9A96E] ml-1 font-medium">({platformFilter.toUpperCase()})</span>
            )}
          </span>
          <span className="text-[10px] text-[#C9A96E]/90 flex items-center gap-1 font-medium">
            <Sparkles size={11} /> New comments appear directly at the top
          </span>
        </div>
      </div>

      {/* List of comments or Empty State */}
      <div className="space-y-6">
        {displayedTestimonials.length === 0 ? (
          <div className="p-12 text-center rounded-2xl admin-glass border border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/30">
              <MessageSquare size={22} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">No comments found</h4>
              <p className="text-xs text-white/40 max-w-sm mx-auto">
                {searchQuery
                  ? `No comments matched "${searchQuery}". Try clearing your search.`
                  : `There are currently no ${platformFilter !== 'all' ? platformFilter : ''} comments.`}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white/70 transition-all"
                >
                  Clear Search
                </button>
              )}
              <button
                type="button"
                onClick={() => handleAddComment(platformFilter !== 'all' ? platformFilter : undefined)}
                className="px-4 py-2 bg-[#C9A96E]/20 text-[#C9A96E] hover:bg-[#C9A96E]/30 border border-[#C9A96E]/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus size={13} /> Add {platformFilter !== 'all' ? platformFilter : ''} Comment at Top
              </button>
            </div>
          </div>
        ) : (
          displayedTestimonials.map((t, index) => {
            const originalIndex = testimonials.findIndex(item => item.id === t.id);
            const isAtTop = originalIndex === 0;
            const isAtBottom = originalIndex === testimonials.length - 1;
            const isNewlyCreated = newlyAddedId === t.id;

            return (
              <div
                key={t.id}
                className={`p-6 md:p-8 rounded-2xl admin-glass group relative space-y-6 transition-all duration-300 ${
                  isNewlyCreated ? 'ring-2 ring-[#C9A96E]/60 bg-[#C9A96E]/[0.02]' : ''
                }`}
              >
                {/* Top bar: Platform selection, Reorder & Delete */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-white/5 text-white/50 border border-white/5">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/40 mr-1">Style As:</span>
                    <button
                      type="button"
                      onClick={() => updateTestimonial(t.id, { platform: 'instagram' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        (t.platform || 'instagram') === 'instagram'
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border border-pink-500/30 shadow-sm'
                          : 'bg-white/5 text-white/40 hover:text-white border border-white/5'
                      }`}
                    >
                      <span>Instagram</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTestimonial(t.id, { platform: 'youtube' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        t.platform === 'youtube'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-sm'
                          : 'bg-white/5 text-white/40 hover:text-white border border-white/5'
                      }`}
                    >
                      <span>YouTube</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTestimonial(t.id, { platform: 'twitter' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        t.platform === 'twitter'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                          : 'bg-white/5 text-white/40 hover:text-white border border-white/5'
                      }`}
                    >
                      <span>Twitter / X</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateTestimonial(t.id, { platform: 'linkedin' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        t.platform === 'linkedin'
                          ? 'bg-[#0A66C2]/20 text-[#70B5F9] border border-[#0A66C2]/40 shadow-sm'
                          : 'bg-white/5 text-white/40 hover:text-white border border-white/5'
                      }`}
                    >
                      <span>LinkedIn</span>
                    </button>
                  </div>

                  {/* Reorder and Delete controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleMove(t.id, 'up')}
                        disabled={isAtTop}
                        className="p-1.5 text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40 rounded hover:bg-white/10 transition-all"
                        title="Move up towards top"
                      >
                        <ChevronUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(t.id, 'down')}
                        disabled={isAtBottom}
                        className="p-1.5 text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40 rounded hover:bg-white/10 transition-all"
                        title="Move down towards bottom"
                      >
                        <ChevronDown size={15} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTestimonial(t.id)}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
                      title="Delete this comment"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Editable Fields */}
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <label className="admin-label block opacity-50 mb-1.5">Comment Text</label>
                      <textarea
                        rows={3}
                        value={t.text}
                        onChange={(e) => updateTestimonial(t.id, { text: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-sans"
                        placeholder="What did they comment? (e.g. That color grade was masterclass 🔥)"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="admin-label block opacity-50 mb-1.5">Username / Handle</label>
                        <input
                          type="text"
                          value={t.username || ''}
                          onChange={(e) => updateTestimonial(t.id, { username: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                          placeholder="e.g. marcusvance.cin"
                        />
                      </div>
                      <div>
                        <label className="admin-label block opacity-50 mb-1.5">Display Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all"
                          placeholder="e.g. Marcus Vance"
                        />
                      </div>
                    </div>

                    {/* Platform Specific Settings */}
                    {t.platform === 'linkedin' && (
                      <div className="space-y-3 p-3.5 bg-[#0A66C2]/10 border border-[#0A66C2]/25 rounded-xl">
                        <div>
                          <label className="admin-label block opacity-70 mb-1.5 text-xs text-[#70B5F9]">Company / Role / Headline (LinkedIn)</label>
                          <input
                            type="text"
                            value={t.company || ''}
                            onChange={(e) => updateTestimonial(t.id, { company: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0A66C2]/50 transition-all"
                            placeholder="e.g. Executive Creative Director · Aperture Media"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="admin-label block opacity-70 text-xs text-[#70B5F9]">Choose LinkedIn Reactions</label>
                            <span className="text-[10px] text-white/40">Click to toggle on / off</span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                            {[
                              { id: 'like', label: 'Like', emoji: '👍', activeBg: 'bg-[#0A66C2] text-white border-[#0A66C2]' },
                              { id: 'celebrate', label: 'Celebrate', emoji: '👏', activeBg: 'bg-[#2E7D32] text-white border-[#2E7D32]' },
                              { id: 'support', label: 'Support', emoji: '🤝', activeBg: 'bg-[#705FC9] text-white border-[#705FC9]' },
                              { id: 'love', label: 'Love', emoji: '❤️', activeBg: 'bg-[#DF704D] text-white border-[#DF704D]' },
                              { id: 'insightful', label: 'Insightful', emoji: '💡', activeBg: 'bg-[#E7A33E] text-white border-[#E7A33E]' },
                              { id: 'funny', label: 'Funny', emoji: '😂', activeBg: 'bg-[#00A0DC] text-white border-[#00A0DC]' },
                            ].map((reaction) => {
                              const currentReactions = t.reactions || ['like', 'love', 'celebrate'];
                              const isSelected = currentReactions.includes(reaction.id as any);
                              return (
                                <button
                                  key={reaction.id}
                                  type="button"
                                  onClick={() => {
                                    let next: any[];
                                    if (isSelected) {
                                      next = currentReactions.filter((r) => r !== reaction.id);
                                      if (next.length === 0) next = [reaction.id];
                                    } else {
                                      next = [...currentReactions, reaction.id];
                                    }
                                    updateTestimonial(t.id, { reactions: next });
                                  }}
                                  className={`p-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center gap-1 border ${
                                    isSelected
                                      ? `${reaction.activeBg} shadow-md shadow-black/40`
                                      : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                                  }`}
                                >
                                  <span className="text-base leading-none">{reaction.emoji}</span>
                                  <span className="text-[10px] leading-tight truncate">{reaction.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {t.platform === 'youtube' && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">❤️</span>
                          <div>
                            <span className="text-xs font-semibold text-white block">Liked by me</span>
                            <span className="text-[10px] text-white/50 block">Show creator avatar & YouTube love heart badge on comment</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateTestimonial(t.id, { likedByMe: !t.likedByMe })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                            t.likedByMe
                              ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                          }`}
                        >
                          <Check size={13} className={t.likedByMe ? 'opacity-100' : 'opacity-20'} />
                          <span>{t.likedByMe ? 'Hearted' : 'Not Hearted'}</span>
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="admin-label block opacity-50 mb-1.5">Likes Count</label>
                        <input
                          type="text"
                          value={t.likes || ''}
                          onChange={(e) => updateTestimonial(t.id, { likes: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all font-mono"
                          placeholder="e.g. 418 or 1.2k"
                        />
                      </div>
                      <div>
                        <label className="admin-label block opacity-50 mb-1.5">Verified Badge</label>
                        <button
                          type="button"
                          onClick={() => updateTestimonial(t.id, { verified: !(t.verified ?? true) })}
                          className={`w-full p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                            (t.verified ?? true)
                              ? 'bg-[#0095F6]/20 border-[#0095F6]/40 text-[#0095F6]'
                              : 'bg-white/5 border-white/10 text-white/40'
                          }`}
                        >
                          <Check size={14} className={(t.verified ?? true) ? 'opacity-100' : 'opacity-20'} />
                          <span>{(t.verified ?? true) ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="admin-label block opacity-50">Profile Picture (PFP)</label>
                        {t.avatar && (
                          <button
                            type="button"
                            onClick={() => updateTestimonial(t.id, { avatar: '' })}
                            className="text-[10px] text-white/40 hover:text-red-400 transition-colors"
                            title="Remove photo and leave blank"
                          >
                            Clear (Leave Blank)
                          </button>
                        )}
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-white/10 bg-white/5 flex items-center justify-center">
                          {t.avatar ? (
                            <img src={t.avatar} className="w-full h-full object-cover" alt={t.name} />
                          ) : (
                            <User size={18} className="text-white/30" />
                          )}
                          <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity" title="Upload avatar">
                            <Camera size={14} className="text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateTestimonial(t.id, { avatar: url }))} />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={t.avatar || ''}
                          onChange={(e) => updateTestimonial(t.id, { avatar: e.target.value })}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] text-white/70 focus:outline-none focus:border-white/20 transition-all font-mono placeholder:text-white/25"
                          placeholder="Avatar Image URL (leave blank for neutral silhouette)"
                        />
                      </div>
                      {!t.avatar && (
                        <span className="text-[10px] text-white/30 mt-1 block">Blank: Displays authentic platform silhouette until you add a photo.</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Live Card Preview */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 min-h-[220px]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-4">Live Preview</span>
                    <div className="w-full flex justify-center">
                      <SocialCommentCard testimonial={t} className="w-full max-w-[320px]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
