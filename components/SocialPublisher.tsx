
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Clock, CheckCircle2, Send, Image as ImageIcon, Instagram, Linkedin, Youtube, Link2, Calendar, Trash2, AlertCircle } from 'lucide-react';

type PlatformId = 'instagram' | 'tiktok' | 'linkedin' | 'youtube' | 'twitter';
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

interface SocialAccount {
  id: PlatformId;
  name: string;
  handle?: string;
  connected: boolean;
  color: string;
  bg: string;
  dotColor: string;
}

interface ScheduledPost {
  id: string;
  content: string;
  platforms: PlatformId[];
  scheduledDate: string;
  scheduledTime: string;
  status: PostStatus;
  mediaUrl?: string;
  createdAt: string;
}

const ACCOUNTS: SocialAccount[] = [
  { id: 'instagram',  name: 'Instagram',  connected: false, color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20',   dotColor: 'bg-pink-400' },
  { id: 'tiktok',     name: 'TikTok',     connected: false, color: 'text-white',      bg: 'bg-white/5 border-white/10',          dotColor: 'bg-white' },
  { id: 'linkedin',   name: 'LinkedIn',   connected: false, color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',   dotColor: 'bg-blue-400' },
  { id: 'youtube',    name: 'YouTube',    connected: false, color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',     dotColor: 'bg-red-400' },
  { id: 'twitter',    name: 'Twitter/X',  connected: false, color: 'text-gray-300',   bg: 'bg-gray-500/10 border-gray-500/20',   dotColor: 'bg-gray-400' },
];

const PLATFORM_ICONS: Record<PlatformId, React.ReactNode> = {
  instagram: <Instagram size={18} />,
  tiktok:    <span className="text-base font-black leading-none">T</span>,
  linkedin:  <Linkedin size={18} />,
  youtube:   <Youtube size={18} />,
  twitter:   <span className="text-base font-black leading-none">𝕏</span>,
};

const STATUS_META: Record<PostStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  draft:     { label: 'Draft',     icon: <AlertCircle size={12} />,    cls: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
  scheduled: { label: 'Scheduled', icon: <Clock size={12} />,          cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  published: { label: 'Published', icon: <CheckCircle2 size={12} />,   cls: 'text-green-400 bg-green-400/10 border-green-400/20' },
  failed:    { label: 'Failed',    icon: <AlertCircle size={12} />,    cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

const STORAGE_KEY = 'mavestone_social_posts';

function loadPosts(): ScheduledPost[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function savePosts(posts: ScheduledPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// ── ACCOUNT CARD ───────────────────────────────────────────────────────────────
const AccountCard: React.FC<{ account: SocialAccount; onToggle: () => void }> = ({ account, onToggle }) => (
  <div className={`p-4 rounded-2xl border ${account.connected ? account.bg : 'bg-white/[0.02] border-white/5'} transition-all`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`flex items-center gap-3 ${account.connected ? account.color : 'text-gray-600'}`}>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${account.connected ? account.bg : 'bg-white/5'} border ${account.connected ? '' : 'border-white/10'}`}>
          {PLATFORM_ICONS[account.id]}
        </div>
        <div>
          <p className={`text-sm font-bold ${account.connected ? 'text-white' : 'text-gray-500'}`}>{account.name}</p>
          {account.handle && <p className="text-[10px] text-gray-600">{account.handle}</p>}
        </div>
      </div>
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold ${account.connected ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-gray-600'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${account.connected ? 'bg-green-400' : 'bg-gray-600'}`} />
        {account.connected ? 'Connected' : 'Not connected'}
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
        account.connected
          ? 'bg-transparent border-white/10 text-gray-500 hover:text-red-400 hover:border-red-400/20'
          : 'bg-white text-black border-transparent hover:bg-gray-200'
      }`}
    >
      {account.connected ? 'Disconnect' : 'Connect Account'}
    </button>
  </div>
);

// ── POST COMPOSER ──────────────────────────────────────────────────────────────
const PostComposer: React.FC<{
  accounts: SocialAccount[];
  onSchedule: (post: Omit<ScheduledPost, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}> = ({ accounts, onSchedule, onClose }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [postNow, setPostNow] = useState(false);

  const toggle = (id: PlatformId) => setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const handleSubmit = () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;
    onSchedule({
      content,
      platforms: selectedPlatforms,
      scheduledDate: postNow ? new Date().toISOString().split('T')[0] : scheduledDate,
      scheduledTime: postNow ? new Date().toTimeString().slice(0, 5) : scheduledTime,
      status: postNow ? 'published' : 'scheduled',
    });
    onClose();
  };

  const charCount = content.length;
  const charLimit = 2200;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0F0F11] rounded-3xl border border-white/10 flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Create Post</h3>
          <button onClick={onClose} className="p-2 rounded-full text-gray-600 hover:text-white hover:bg-white/10 transition-all"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Platform selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Post To</label>
            <div className="flex flex-wrap gap-2">
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => toggle(acc.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedPlatforms.includes(acc.id)
                      ? `${acc.bg} ${acc.color}`
                      : 'bg-white/[0.02] border-white/10 text-gray-600 hover:border-white/20'
                  }`}
                >
                  {PLATFORM_ICONS[acc.id]} {acc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Caption / Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value.slice(0, charLimit))}
              rows={7}
              placeholder="Write your post caption..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/30 resize-none"
            />
            <p className={`text-right text-[10px] ${charCount > charLimit * 0.9 ? 'text-red-400' : 'text-gray-700'}`}>{charCount}/{charLimit}</p>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Schedule</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPostNow(!postNow)}
                className={`px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                  postNow ? 'bg-white text-black border-transparent' : 'bg-white/[0.02] border-white/10 text-gray-600 hover:border-white/20'
                }`}
              >
                Post Now
              </button>
              {!postNow && (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-24 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none [color-scheme:dark]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || selectedPlatforms.length === 0}
            className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Send size={14} /> {postNow ? 'Publish Now' : 'Schedule Post'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export const SocialPublisher: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>(ACCOUNTS);
  const [posts, setPosts] = useState<ScheduledPost[]>(loadPosts);
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeView, setActiveView] = useState<'queue' | 'accounts'>('queue');

  const toggleAccount = (id: PlatformId) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, connected: !a.connected } : a));
  };

  const addPost = (post: Omit<ScheduledPost, 'id' | 'createdAt'>) => {
    const newPost: ScheduledPost = { ...post, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    savePosts(updated);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
    if (b.status === 'scheduled' && a.status !== 'scheduled') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-8">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Schedule and publish across all platforms.</p>
        <button onClick={() => setComposerOpen(true)} className="admin-btn-primary">
          <Plus size={13} /> New Post
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Scheduled', val: posts.filter(p => p.status === 'scheduled').length, color: 'var(--accent-teal)' },
          { label: 'Published', val: posts.filter(p => p.status === 'published').length, color: 'var(--accent-green)' },
          { label: 'Drafts',    val: posts.filter(p => p.status === 'draft').length,     color: 'var(--accent-amber)' },
          { label: 'Connected', val: accounts.filter(a => a.connected).length,           color: 'var(--accent-purple)' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl text-center admin-card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
            <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b" style={{ borderColor: 'var(--border-default)' }} role="tablist">
        {(['queue', 'accounts'] as const).map(v => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            role="tab"
            aria-selected={activeView === v}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest border-b-2 -mb-px transition-all capitalize ${
              activeView === v ? 'border-[#00C9A7] text-[#00C9A7]' : 'border-transparent hover:text-gray-400'
            }`}
            style={{ color: activeView === v ? 'var(--accent-teal)' : 'var(--text-muted)' }}
          >{v === 'queue' ? 'Post Queue' : 'Connected Accounts'}</button>
        ))}
      </div>

      {/* Queue */}
      {activeView === 'queue' && (
        <div className="space-y-3">
          {sortedPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-[#0F0F11] border border-white/5 border-dashed space-y-3">
              <Calendar size={36} className="text-gray-800" />
              <p className="text-gray-600 text-sm font-medium">No posts yet</p>
              <button onClick={() => setComposerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/20 transition-all">
                <Plus size={12} /> Create your first post
              </button>
            </div>
          )}
          {sortedPosts.map(post => {
            const meta = STATUS_META[post.status];
            return (
              <div key={post.id} className="p-5 rounded-2xl bg-[#0F0F11] border border-white/5 flex gap-4">
                {/* Platforms */}
                <div className="flex flex-col items-center gap-1.5 pt-0.5">
                  {post.platforms.map(pid => {
                    const acc = accounts.find(a => a.id === pid);
                    return (
                      <div key={pid} className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] border ${acc?.bg || 'bg-white/5 border-white/10'} ${acc?.color || 'text-gray-400'}`}>
                        {PLATFORM_ICONS[pid]}
                      </div>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{post.content}</p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${meta.cls}`}>
                      {meta.icon} {meta.label}
                    </div>
                    {(post.scheduledDate || post.scheduledTime) && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-600">
                        <Clock size={10} /> {post.scheduledDate} {post.scheduledTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button onClick={() => deletePost(post.id)} className="p-2 text-gray-700 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all self-start">
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Accounts */}
      {activeView === 'accounts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(acc => (
            <AccountCard key={acc.id} account={acc} onToggle={() => toggleAccount(acc.id)} />
          ))}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-gray-700 min-h-[120px]">
            <Link2 size={20} />
            <p className="text-[10px] font-bold uppercase tracking-widest">More platforms coming</p>
          </div>
        </div>
      )}

      {/* Composer modal */}
      <AnimatePresence>
        {composerOpen && (
          <PostComposer accounts={accounts} onSchedule={addPost} onClose={() => setComposerOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
