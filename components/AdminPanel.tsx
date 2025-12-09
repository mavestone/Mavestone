
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, AlertCircle, Camera, Loader2, LogOut, Database, Eye, EyeOff, Layout, Clapperboard, Settings, Mail, RefreshCcw, Plus, Trash2 } from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';
import { supabase } from '../lib/supabase';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminOpen, closeAdmin, 
    latestVideo, updateLatestVideo, 
    inProduction, updateInProduction,
    shorts, updateShort, addShort, deleteShort,
    films, updateFilm, addFilm, deleteFilm,
    projectConfig, updateProjectConfig,
    saveChanges, uploadImage, logout, seedDatabase,
    isAuthenticated, messages, fetchMessages, markMessageRead
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'messages' | 'settings'>('home');
  const [processingImage, setProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
      if (activeTab === 'messages' && isAuthenticated) fetchMessages();
  }, [activeTab, isAuthenticated]);

  const extractYouTubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = url.match(regExp);
    const id = match?.[8]?.length === 11 ? match[8] : url;
    return id.trim();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    setProcessingImage(true);
    try {
        const publicUrl = await uploadImage(file);
        if (publicUrl) callback(publicUrl);
        else alert("Upload failed.");
    } catch (err) {
        console.error(err);
    } finally {
        setProcessingImage(false);
    }
  };

  const handleSave = async () => {
    if (!supabase) return;
    setIsSaving(true);
    setSaveError('');
    try {
        await saveChanges();
        alert("Changes saved to cloud successfully!");
    } catch (err) {
        setSaveError("Failed to save. Check internet connection.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isAuthenticated && isAdminOpen) return null;

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-white/10 z-[100] shadow-2xl overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0A0A0A] z-20 sticky top-0">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Mavestone CMS
                    {processingImage && <Loader2 className="animate-spin w-4 h-4 text-gray-400" />}
                </h2>
                <div className="flex items-center gap-2">
                     <button onClick={handleSave} className="p-2 rounded-full hover:bg-white/10 text-green-400 transition-colors">
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    </button>
                    <button onClick={closeAdmin} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto">
                <button onClick={() => setActiveTab('home')} className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest ${activeTab === 'home' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500'}`}>
                    <Layout size={14} className="inline mr-1" /> Home
                </button>
                <button onClick={() => setActiveTab('projects')} className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest ${activeTab === 'projects' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500'}`}>
                    <Clapperboard size={14} className="inline mr-1" /> Projects
                </button>
                <button onClick={() => setActiveTab('messages')} className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest ${activeTab === 'messages' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500'}`}>
                    <Mail size={14} className="inline mr-1" /> Inbox
                </button>
                <button onClick={() => setActiveTab('settings')} className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest ${activeTab === 'settings' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500'}`}>
                    <Settings size={14} className="inline mr-1" /> Settings
                </button>
            </div>

            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              {/* HOME TAB */}
              {activeTab === 'home' && (
                <div className="space-y-8">
                     <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Featured Video</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Title</label>
                                <input type="text" value={latestVideo.title} onChange={(e) => updateLatestVideo({ title: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">YouTube Link</label>
                                <input type="text" value={latestVideo.videoId} onChange={(e) => updateLatestVideo({ videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-mono text-white focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Thumbnail</label>
                                <div className="relative">
                                    <input type="text" value={latestVideo.image} onChange={(e) => updateLatestVideo({ image: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-gray-300 focus:outline-none pr-10" />
                                    <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer"><Camera size={14} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateLatestVideo({ image: url }))} /></label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                <textarea rows={3} value={latestVideo.description} onChange={(e) => updateLatestVideo({ description: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                            </div>
                        </div>
                    </section>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-8">
                    {/* Hero Config */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-red-400">Page Hero Config</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                             <div>
                                <label className="block text-xs text-gray-500 mb-1">Hero Label (e.g. Original)</label>
                                <input type="text" value={projectConfig?.label || 'Original'} onChange={(e) => updateProjectConfig({ label: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Autoplay Video ID</label>
                                <input type="text" value={projectConfig?.heroVideoId || ''} onChange={(e) => updateProjectConfig({ heroVideoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-mono text-white focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Featured Film (by ID)</label>
                                <select 
                                    value={projectConfig?.featuredFilmId || ''} 
                                    onChange={(e) => updateProjectConfig({ featuredFilmId: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none"
                                >
                                    {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Coming Soon */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400">Coming Soon (In Production)</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Title</label>
                                <input type="text" value={inProduction.title} onChange={(e) => updateInProduction({ title: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Status</label>
                                <input type="text" value={inProduction.status} onChange={(e) => updateInProduction({ status: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Image</label>
                                <div className="relative">
                                    <input type="text" value={inProduction.image} onChange={(e) => updateInProduction({ image: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-gray-300 focus:outline-none pr-10" />
                                    <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer"><Camera size={14} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))} /></label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                <textarea rows={3} value={inProduction.description} onChange={(e) => updateInProduction({ description: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                            </div>
                        </div>
                    </section>

                    {/* Selected Works (Films) */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-teal-400">Selected Works</h3>
                            <button onClick={addFilm} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-1 text-white"><Plus size={10} /> Add Film</button>
                        </div>
                        <div className="space-y-4">
                            {films.map((film, idx) => (
                                <div key={film.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative group">
                                     <button onClick={() => deleteFilm(film.id)} className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12} /></button>
                                    <div className="text-xs font-mono text-gray-500">#{idx + 1}</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Title</label>
                                            <input type="text" value={film.title} onChange={(e) => updateFilm(film.id, { title: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                        </div>
                                         <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Category</label>
                                            <input type="text" value={film.category} onChange={(e) => updateFilm(film.id, { category: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Description (More Info)</label>
                                        <textarea rows={2} value={film.description || ''} onChange={(e) => updateFilm(film.id, { description: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Match %</label>
                                            <input type="text" value={film.match || ''} placeholder="98% Match" onChange={(e) => updateFilm(film.id, { match: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Rating</label>
                                            <input type="text" value={film.maturityRating || ''} placeholder="TV-14" onChange={(e) => updateFilm(film.id, { maturityRating: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Year</label>
                                            <input type="text" value={film.year || ''} placeholder="2024" onChange={(e) => updateFilm(film.id, { year: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">YouTube ID</label>
                                        <input type="text" value={film.videoId || ''} onChange={(e) => updateFilm(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm font-mono text-white focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Image</label>
                                        <div className="relative">
                                            <input type="text" value={film.image} onChange={(e) => updateFilm(film.id, { image: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none pr-10" />
                                            <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer"><Camera size={12} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateFilm(film.id, { image: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                     {/* Shorts Section */}
                     <section className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400">Short Stories</h3>
                            <button onClick={addShort} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-1 text-white"><Plus size={10} /> Add Short</button>
                        </div>
                        <div className="space-y-4">
                            {shorts.map((short, idx) => (
                                <div key={short.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative">
                                    <button onClick={() => deleteShort(short.id)} className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12} /></button>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                                        <button onClick={() => updateShort(short.id, { showViews: !short.showViews })} className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border ${short.showViews !== false ? 'border-green-500/30 text-green-400' : 'border-gray-700 text-gray-400'}`}>
                                            {short.showViews !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Title</label>
                                            <input type="text" value={short.title} onChange={(e) => updateShort(short.id, { title: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">YouTube ID</label>
                                            <input type="text" value={short.videoId} onChange={(e) => updateShort(short.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm font-mono text-white focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Thumbnail</label>
                                        <div className="relative">
                                            <input type="text" value={short.image} onChange={(e) => updateShort(short.id, { image: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none pr-10" />
                                            <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer"><Camera size={12} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateShort(short.id, { image: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-white/5 bg-[#0A0A0A] z-20 sticky bottom-0">
                 {saveError && <p className="text-red-400 text-xs text-center mb-2">{saveError}</p>}
                 {activeTab !== 'messages' && (
                    <MagneticButton variant="primary" className="w-full" onClick={handleSave}>
                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </MagneticButton>
                 )}
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
