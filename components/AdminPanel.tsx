
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Settings, Mail, Plus, Trash2, LogOut, ExternalLink, Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  // Added seedDatabase to destructuring from useContent
  const { 
    isAdminOpen, closeAdmin, 
    latestVideo, updateLatestVideo, 
    inProduction, updateInProduction,
    shorts, updateShort, addShort, deleteShort,
    films, updateFilm, addFilm, deleteFilm,
    projectConfig, updateProjectConfig,
    syncSettings, updateSyncSettings,
    saveChanges, uploadImage,
    isAuthenticated, fetchMessages, messages, markMessageRead, logout,
    syncFromYouTube, syncShortsFromYouTube,
    seedDatabase
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'messages' | 'settings'>('home');
  const [processingImage, setProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      if (activeTab === 'messages' && isAuthenticated) fetchMessages();
  }, [activeTab, isAuthenticated, fetchMessages]);

  const extractYouTubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = url.match(regExp);
    return match?.[8]?.length === 11 ? match[8] : url.trim();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    const client = supabase;
    if (!file || !client) return;
    setProcessingImage(true);
    try {
        const publicUrl = await uploadImage(file);
        if (publicUrl) callback(publicUrl);
    } finally {
        setProcessingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
        await saveChanges();
    } catch (err) {
        setSaveError("Failed to save changes.");
    } finally {
        setTimeout(() => setIsSaving(false), 800);
    }
  };

  const handleSyncYouTubeFeatured = async () => {
    setIsSyncing(true);
    try {
      await syncFromYouTube();
      alert("Featured video updated from YouTube!");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncYouTubeShorts = async () => {
    setIsSyncing(true);
    try {
      await syncShortsFromYouTube();
      alert("Vertical Shorts (<=60s) updated from your channel!");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleClose = () => {
      closeAdmin();
      if (location.pathname === '/admin') navigate('/');
  };

  if (!isAuthenticated && isAdminOpen) return null;

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === id 
            ? 'bg-white text-black font-bold shadow-lg shadow-white/10' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        <Icon size={18} />
        <span className="text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex overflow-hidden font-sans"
        >
            {/* SIDEBAR */}
            <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#0A0A0A] flex flex-col justify-between p-6">
                <div className="space-y-8">
                    <div className="px-2">
                        <h2 className="text-xl font-bold tracking-tighter text-white">Mavestone<span className="text-white/40">.</span></h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Studio CMS</p>
                    </div>
                    <nav className="space-y-2">
                        <NavItem id="home" label="Home" icon={Layout} />
                        <NavItem id="projects" label="Work" icon={Clapperboard} />
                        <NavItem id="messages" label="Mail" icon={Mail} />
                        <NavItem id="settings" label="Config" icon={Settings} />
                    </nav>
                </div>

                <div className="space-y-4">
                    {saveError && <div className="text-red-400 text-[10px] px-2">{saveError}</div>}
                    <button onClick={handleSave} className="w-full py-3 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all">
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between px-2">
                        <button onClick={handleClose} className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"><ExternalLink size={14} /> Exit</button>
                        <button onClick={() => { logout(); handleClose(); }} className="text-gray-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto bg-black relative">
                <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white capitalize">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        {processingImage && <span className="flex items-center gap-2 text-blue-400 text-xs font-bold animate-pulse"><Loader2 size={12} className="animate-spin" /> Uploading...</span>}
                        <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                    </div>
                </div>

                <div className="p-8 pb-32 max-w-7xl mx-auto">
                    {activeTab === 'home' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Featured Film</h3>
                                        <button onClick={handleSyncYouTubeFeatured} disabled={isSyncing} className="text-[10px] flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition-all uppercase tracking-widest font-bold">
                                            {isSyncing ? <Loader2 className="animate-spin" size={12} /> : <Youtube size={12} />}
                                            Sync Latest Video
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={latestVideo.title} onChange={(e) => updateLatestVideo({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30" />
                                        <input type="text" placeholder="YouTube ID" value={latestVideo.videoId} onChange={(e) => updateLatestVideo({ videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-300 focus:outline-none" />
                                        <textarea rows={4} placeholder="Description" value={latestVideo.description} onChange={(e) => updateLatestVideo({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Thumbnail URL" value={latestVideo.image} onChange={(e) => updateLatestVideo({ image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                            <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateLatestVideo({ image: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-5">
                                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Preview</label>
                                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative group">
                                    <img src={latestVideo.image} className="w-full h-full object-cover opacity-80" alt="Preview" />
                                    <div className="absolute inset-0 flex items-center justify-center"><Youtube size={48} className="text-white opacity-40" /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 border-b border-white/5 pb-2 mb-2">Portfolio Hero</h3>
                                    <div className="space-y-4">
                                        <select value={projectConfig?.featuredFilmId} onChange={(e) => updateProjectConfig({ featuredFilmId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white">
                                            {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                        </select>
                                        <input type="text" placeholder="Label (e.g. ORIGINALS)" value={projectConfig.label} onChange={(e) => updateProjectConfig({ label: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400 border-b border-white/5 pb-2 mb-2">Coming Soon</h3>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={inProduction.title} onChange={(e) => updateInProduction({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                        <input type="text" placeholder="Status" value={inProduction.status} onChange={(e) => updateInProduction({ status: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Image URL" value={inProduction.image} onChange={(e) => updateInProduction({ image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                            <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-teal-400">Selected Works</h3>
                                    <button onClick={() => addFilm()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add Film</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {films.map((film) => (
                                        <div key={film.id} className="p-5 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4 group">
                                            <div className="flex justify-between items-center">
                                                <input type="text" value={film.title} onChange={(e) => updateFilm(film.id, { title: e.target.value })} className="bg-transparent text-white font-bold focus:outline-none w-full" />
                                                <button onClick={() => deleteFilm(film.id)} className="text-gray-600 hover:text-red-500 ml-2 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5">
                                                <img src={film.image} className="w-full h-full object-cover" alt={film.title} />
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateFilm(film.id, { image: url }))} />
                                                </label>
                                            </div>
                                            <input type="text" placeholder="YouTube ID" value={film.videoId || ''} onChange={(e) => updateFilm(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300 focus:outline-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-purple-400">Short Stories Feed</h3>
                                    <div className="flex gap-3">
                                        <button onClick={handleSyncYouTubeShorts} disabled={isSyncing} className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-purple-500/20 transition-all">
                                            {isSyncing ? <Loader2 className="animate-spin" size={14} /> : <Youtube size={14} />} 
                                            Sync Shorts
                                        </button>
                                        <button onClick={() => addShort()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Manual</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {shorts.map((short) => (
                                        <div key={short.id} className="aspect-[9/16] rounded-xl overflow-hidden border border-white/5 relative group bg-[#0F0F11]">
                                            <img src={short.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={short.title} />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                                                <div className="flex justify-between items-center">
                                                    <Youtube size={14} className="text-white/40" />
                                                    <button onClick={() => deleteShort(short.id)} className="text-red-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                                <div className="space-y-2">
                                                    <input type="text" placeholder="Title" value={short.title} onChange={(e) => updateShort(short.id, { title: e.target.value })} className="w-full bg-white/10 border border-white/5 text-[10px] p-2 rounded text-white focus:outline-none" />
                                                    <input type="text" placeholder="YouTube ID" value={short.videoId} onChange={(e) => updateShort(short.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-white/10 border border-white/5 text-[10px] p-2 rounded text-blue-300 font-mono focus:outline-none" />
                                                    <label className="w-full flex items-center justify-center py-2 bg-white/5 border border-white/5 rounded text-[10px] cursor-pointer hover:bg-white/10 transition-colors">
                                                        <Camera size={12} className="mr-1" /> Thumb
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateShort(short.id, { image: url }))} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {messages.length === 0 ? <div className="col-span-2 py-24 text-center text-gray-500">No messages yet.</div> : messages.map(msg => (
                                <div key={msg.id} className={`p-6 rounded-2xl border transition-all ${msg.read ? 'bg-[#0F0F11] border-white/5 opacity-60' : 'bg-[#121214] border-green-500/30 shadow-lg shadow-green-500/5'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div><h4 className="text-white font-bold">{msg.name}</h4><p className="text-xs text-blue-400">{msg.email}</p></div>
                                        {!msg.read && <button onClick={() => markMessageRead(msg.id)} className="text-[10px] text-green-400 px-2 py-1 bg-green-500/10 rounded font-bold uppercase tracking-widest hover:bg-green-500/20 transition-colors">Mark Read</button>}
                                    </div>
                                    <p className="text-sm text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="p-8 rounded-3xl bg-[#0F0F11] border border-white/5 space-y-8 shadow-2xl">
                                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">YouTube API</h3>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2"><Youtube size={14} /> Global Channel Settings</label>
                                        <input type="text" placeholder="API Key" value={syncSettings.youtubeApiKey} onChange={(e) => updateSyncSettings({ youtubeApiKey: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" />
                                        <input type="text" placeholder="Channel ID" value={syncSettings.youtubeChannelId} onChange={(e) => updateSyncSettings({ youtubeChannelId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" />
                                        <p className="text-[10px] text-gray-600 italic">
                                            Current ID for @mavestone is UCf_CST5v2V7eJ6XqS9T5A-A.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                                <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">Hard Reset</h4>
                                <button className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold hover:bg-red-500/20 transition-all" onClick={() => { if(confirm("Reset all content?")) seedDatabase() }}>Restore Factory Data</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
