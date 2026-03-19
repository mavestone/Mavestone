
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight, Trash2, Film, List, LayoutGrid, Calendar as CalendarIcon, Columns, FileText } from 'lucide-react';

type Status = 'Idea' | 'Scripted' | 'Filming' | 'Editing' | 'Published';

interface ContentItem {
  id: string;
  title: string;
  category: string[];
  status: Status;
  platform: string[];
  notes: string;
  script: string;
  dueDate: string;
  createdAt: string;
}

const STATUSES: Status[] = ['Idea', 'Scripted', 'Filming', 'Editing', 'Published'];
const PLATFORMS = ['LinkedIn', 'TikTok', 'Instagram Reels', 'YouTube', 'Twitter/X'];
const CATEGORIES = ['Education', 'Entertainment', 'Documentary', 'Brand', 'Client Work', 'Personal'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_META: Record<Status, { dot: string; badge: string; border: string; hex: string }> = {
  Idea:      { dot: 'bg-gray-500',              badge: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',        border: 'border-l-[#555555]',   hex: '#555555' },
  Scripted:  { dot: 'bg-[#A78BFA]',             badge: 'bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/20',    border: 'border-l-[#A78BFA]',   hex: '#A78BFA' },
  Filming:   { dot: 'bg-[#F5A623]',             badge: 'bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20',    border: 'border-l-[#F5A623]',   hex: '#F5A623' },
  Editing:   { dot: 'bg-[#00C9A7]',             badge: 'bg-[#00C9A7]/10 text-[#00C9A7] border border-[#00C9A7]/20',    border: 'border-l-[#00C9A7]',   hex: '#00C9A7' },
  Published: { dot: 'bg-[#2ECC71]',             badge: 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20',    border: 'border-l-[#2ECC71]',   hex: '#2ECC71' },
};

const PLATFORM_META: Record<string, string> = {
  LinkedIn:          'bg-blue-700/30 text-blue-300 border border-blue-700/40',
  TikTok:            'bg-pink-600/20 text-pink-300 border border-pink-600/30',
  'Instagram Reels': 'bg-purple-600/20 text-purple-300 border border-purple-600/30',
  YouTube:           'bg-red-600/20 text-red-300 border border-red-600/30',
  'Twitter/X':       'bg-gray-600/20 text-gray-300 border border-gray-600/30',
};

const STORAGE_KEY = 'mavestone_content_items';

function loadItems(): ContentItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveItems(items: ContentItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function newItem(): ContentItem {
  return { id: crypto.randomUUID(), title: '', category: [], status: 'Idea', platform: [], notes: '', script: '', dueDate: '', createdAt: new Date().toISOString() };
}

// ── LIST VIEW ──────────────────────────────────────────────────────────────────
const ListView: React.FC<{ items: ContentItem[]; onSelect: (i: ContentItem) => void }> = ({ items, onSelect }) => (
  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }} className="overflow-hidden">
    <table className="w-full" role="grid">
      <thead>
        <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-default)' }}>
          {[['Title', 'w-80'], ['Category', 'w-40'], ['Status', 'w-32'], ['Platform', 'w-48'], ['Notes', '']].map(([h, w]) => (
            <th key={h} className={`text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest ${w}`} style={{ color: 'var(--text-secondary)' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.length === 0 && (
          <tr>
            <td colSpan={5} className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <Film size={36} style={{ color: 'var(--text-muted)' }} />
                <p className="font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>No content yet</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click New to add your first piece</p>
              </div>
            </td>
          </tr>
        )}
        {items.map(item => (
          <tr
            key={item.id}
            onClick={() => onSelect(item)}
            className="admin-table-row cursor-pointer border-l-2 transition-all"
            style={{ borderColor: 'var(--border-default)', borderLeftColor: STATUS_META[item.status].hex }}
          >
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                {/* 16:9 thumbnail placeholder */}
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '6px' }} className="w-14 h-8 flex items-center justify-center shrink-0 border border-white/[0.06]">
                  <Film size={12} style={{ color: 'var(--text-muted)' }} />
                </div>
                <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.title || 'Untitled'}</span>
              </div>
            </td>
            <td className="px-5 py-3">
              <div className="flex flex-wrap gap-1">
                {item.category.map(c => (
                  <span key={c} className="admin-pill" style={{ background: 'rgba(0,201,167,0.1)', color: 'var(--accent-teal)', border: '1px solid rgba(0,201,167,0.2)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-5 py-3">
              <span className={`admin-pill ${STATUS_META[item.status].badge}`}>
                <span className={`admin-pill-dot ${STATUS_META[item.status].dot}`} />
                {item.status}
              </span>
            </td>
            <td className="px-5 py-3">
              <div className="flex flex-wrap gap-1">
                {item.platform.map(p => <span key={p} className={`admin-pill ${PLATFORM_META[p] || 'bg-gray-600/20 text-gray-300 border border-gray-600/30'}`}>{p}</span>)}
              </div>
            </td>
            <td className="px-5 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── BOARD VIEW ─────────────────────────────────────────────────────────────────
const BoardView: React.FC<{
  items: ContentItem[];
  onSelect: (i: ContentItem) => void;
  onStatusChange: (id: string, s: Status) => void;
}> = ({ items, onSelect, onStatusChange }) => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {STATUSES.map(status => {
      const col = items.filter(i => i.status === status);
      return (
        <div key={status} className="flex-shrink-0 w-60 space-y-2">
          <div className="flex items-center gap-2 px-1 pb-2 border-b border-white/5">
            <div className={`w-2 h-2 rounded-full ${STATUS_META[status].dot}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{status}</span>
            <span className="text-[10px] text-gray-700 ml-auto">{col.length}</span>
          </div>
          <div className="space-y-2 min-h-16">
            {col.map(item => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="p-3 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-white/10 cursor-pointer transition-all"
              >
                <div className="flex items-start gap-2">
                  <Film size={12} className="text-gray-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-white font-medium leading-snug">{item.title || 'Untitled'}</p>
                </div>
                {item.platform.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.platform.map(p => <span key={p} className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${PLATFORM_META[p] || 'bg-gray-600/20 text-gray-300 border border-gray-600/30'}`}>{p}</span>)}
                  </div>
                )}
                {item.category.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.category.map(c => <span key={c} className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-teal-600/20 text-teal-300 border border-teal-600/30">{c}</span>)}
                  </div>
                )}
                {/* Quick status change */}
                <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100">
                  {STATUSES.filter(s => s !== status).map(s => (
                    <button
                      key={s}
                      onClick={e => { e.stopPropagation(); onStatusChange(item.id, s); }}
                      className={`w-2 h-2 rounded-full ${STATUS_META[s].dot} hover:scale-150 transition-transform`}
                      title={`Move to ${s}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// ── CALENDAR VIEW ──────────────────────────────────────────────────────────────
const CalendarView: React.FC<{
  items: ContentItem[];
  month: Date;
  onMonthChange: (m: Date) => void;
  onSelect: (i: ContentItem) => void;
}> = ({ items, month, onMonthChange, onSelect }) => {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const today = new Date();
  const isToday = (d: number) => d === today.getDate() && m === today.getMonth() && year === today.getFullYear();
  const dayItems = (d: number) => items.filter(i => {
    if (!i.dueDate) return false;
    const dt = new Date(i.dueDate + 'T00:00:00');
    return dt.getFullYear() === year && dt.getMonth() === m && dt.getDate() === d;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{MONTHS[m]} {year}</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => onMonthChange(new Date(year, m - 1, 1))} className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
          <button onClick={() => onMonthChange(new Date())} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-colors">Today</button>
          <button onClick={() => onMonthChange(new Date(year, m + 1, 1))} className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="rounded-2xl bg-[#0F0F11] border border-white/5 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/5">
          {DAYS.map(d => <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-600">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const di = day ? dayItems(day) : [];
            return (
              <div key={i} className={`min-h-[90px] p-2 border-b border-r border-white/5 ${day ? 'hover:bg-white/[0.02]' : 'bg-black/20'}`}>
                {day && (
                  <>
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday(day) ? 'bg-white text-black' : 'text-gray-500'}`}>{day}</span>
                    <div className="space-y-0.5">
                      {di.map(item => (
                        <button key={item.id} onClick={() => onSelect(item)} className={`w-full text-left px-1.5 py-0.5 rounded text-[9px] font-bold truncate ${STATUS_META[item.status].badge}`}>
                          {item.title || 'Untitled'}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── GALLERY VIEW ───────────────────────────────────────────────────────────────
const GalleryView: React.FC<{ items: ContentItem[]; onSelect: (i: ContentItem) => void }> = ({ items, onSelect }) => (
  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map(item => (
      <div key={item.id} onClick={() => onSelect(item)} className="rounded-2xl bg-[#0F0F11] border border-white/5 hover:border-white/10 cursor-pointer transition-all overflow-hidden">
        <div className="aspect-video bg-white/[0.03] border-b border-white/5 flex items-center justify-center relative">
          <FileText size={28} className="text-gray-800" />
          {item.script && <p className="absolute inset-0 p-3 text-[9px] text-gray-700 overflow-hidden leading-relaxed">{item.script}</p>}
        </div>
        <div className="p-3 space-y-2">
          <p className="text-sm font-bold text-white leading-snug truncate">{item.title || 'Untitled'}</p>
          <div className="flex flex-wrap gap-1">
            {item.platform.map(p => <span key={p} className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${PLATFORM_META[p] || 'bg-gray-600/20 text-gray-300 border border-gray-600/30'}`}>{p}</span>)}
          </div>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${STATUS_META[item.status].badge}`}>
            <div className={`w-1 h-1 rounded-full ${STATUS_META[item.status].dot}`} />{item.status}
          </div>
        </div>
      </div>
    ))}
    {items.length === 0 && (
      <div className="col-span-4 py-16 text-center text-gray-700 text-sm">No items yet — click New to add one.</div>
    )}
  </div>
);

// ── ITEM MODAL ─────────────────────────────────────────────────────────────────
const ItemModal: React.FC<{
  item: ContentItem;
  onChange: (u: Partial<ContentItem>) => void;
  onDelete: () => void;
  onClose: () => void;
}> = ({ item, onChange, onDelete, onClose }) => {
  const toggle = (field: 'category' | 'platform', val: string) => {
    const arr = item[field] as string[];
    onChange({ [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
  };

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
        className="w-full max-w-2xl bg-[#0F0F11] rounded-3xl border border-white/10 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3 flex-1 mr-4">
            <Film size={18} className="text-purple-400 shrink-0" />
            <input
              type="text"
              value={item.title}
              onChange={e => onChange({ title: e.target.value })}
              placeholder="Untitled"
              className="text-xl font-bold text-white bg-transparent border-none outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onDelete} className="p-2 rounded-full text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={15} /></button>
            <button onClick={onClose} className="p-2 rounded-full text-gray-600 hover:text-white hover:bg-white/10 transition-all"><X size={15} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => onChange({ status: s })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                    item.status === s ? STATUS_META[s].badge : 'bg-transparent text-gray-600 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${STATUS_META[s].dot}`} />{s}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Topic / Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => toggle('category', c)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    item.category.includes(c) ? 'bg-teal-600/20 text-teal-300 border-teal-600/30' : 'bg-transparent text-gray-600 border-white/10 hover:border-white/20'
                  }`}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => toggle('platform', p)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                    item.platform.includes(p) ? PLATFORM_META[p] || 'bg-gray-600/20 text-gray-300 border-gray-600/30' : 'bg-transparent text-gray-600 border-white/10 hover:border-white/20'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Due Date</label>
            <input
              type="date"
              value={item.dueDate}
              onChange={e => onChange({ dueDate: e.target.value })}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 [color-scheme:dark]"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Notes / Ideas</label>
            <textarea
              value={item.notes}
              onChange={e => onChange({ notes: e.target.value })}
              rows={3}
              placeholder="Notes, ideas, references..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          {/* Script */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Script</label>
            <textarea
              value={item.script}
              onChange={e => onChange({ script: e.target.value })}
              rows={10}
              placeholder="Write your script here..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/30 resize-none font-mono leading-relaxed"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const VIEWS = [
  { id: 'list' as const,     label: 'All Videos',       icon: List },
  { id: 'board' as const,    label: 'Production Board', icon: Columns },
  { id: 'calendar' as const, label: 'Calendar',         icon: CalendarIcon },
  { id: 'gallery' as const,  label: 'Table',            icon: LayoutGrid },
];

export const ContentPlanner: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>(loadItems);
  const [view, setView] = useState<'list' | 'board' | 'calendar' | 'gallery'>('list');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [calMonth, setCalMonth] = useState(() => new Date());
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => { saveItems(items); }, [items]);

  const filteredItems = categoryFilter === 'All'
    ? items
    : items.filter(i => i.category.some(c => c.toLowerCase().includes(categoryFilter.toLowerCase())));

  const addItem = () => {
    const item = newItem();
    setItems(prev => [item, ...prev]);
    setSelectedItem(item);
  };

  const updateItem = (id: string, updates: Partial<ContentItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    setSelectedItem(prev => prev?.id === id ? { ...prev, ...updates } : prev);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Page action bar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', 'Documentary', 'Short Form', 'Education', 'Brand', 'Personal'].map(f => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f)}
              className={`px-3 py-1.5 rounded-[999px] text-[11px] font-medium transition-all border ${
                categoryFilter === f
                  ? 'bg-[#00C9A7]/15 border-[#00C9A7] text-[#00C9A7]'
                  : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
              }`}
            >{f}</button>
          ))}
        </div>
        <button onClick={addItem} className="admin-btn-primary">
          <Plus size={13} /> New
        </button>
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-0 border-b border-white/5">
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest border-b-2 -mb-px transition-all ${
              view === v.id ? 'text-white border-white' : 'text-gray-600 border-transparent hover:text-gray-400'
            }`}
          >
            <v.icon size={12} />{v.label}
          </button>
        ))}
      </div>

      {/* Views */}
      {view === 'list' && <ListView items={filteredItems} onSelect={setSelectedItem} />}
      {view === 'board' && <BoardView items={filteredItems} onSelect={setSelectedItem} onStatusChange={(id, s) => updateItem(id, { status: s })} />}
      {view === 'calendar' && <CalendarView items={filteredItems} month={calMonth} onMonthChange={setCalMonth} onSelect={setSelectedItem} />}
      {view === 'gallery' && <GalleryView items={filteredItems} onSelect={setSelectedItem} />}

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            onChange={u => updateItem(selectedItem.id, u)}
            onDelete={() => deleteItem(selectedItem.id)}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
