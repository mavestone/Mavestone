
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Settings, Mail, Plus, Trash2, Eye, EyeOff, LogOut, ExternalLink, Youtube, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
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
    syncFromYouTube
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
    if (!file || !supabase) return;
    setProcessingImage(true);
    const publicUrl = await uploadImage(file);
    if (publicUrl) callback(publicUrl);
    setProcessingImage(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
        await saveChanges();
    } catch (err) {
        setSaveError("Failed to save.");
    } finally {
        setTimeout(() => setIsSaving(false), 800);
    }
  };

  const handleSyncYouTube = async () => {
    setIsSyncing(true);
    try {
      await syncFromYouTube();
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
            {/* --- SIDEBAR --- */}
            <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#0A0A0A] flex flex-col justify-between p-6">
                <div className="space-y-8">
                    <div className="px-2">
                        <h2 className="text-xl font-bold tracking-tighter text-white">Mavestone<span className="text-white/40">.</span></h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">CMS Dashboard</p>
                    </div>
                    <nav className="space-y-2">
                        <NavItem id="home" label="Home Page" icon={Layout} />
                        <NavItem id="projects" label="Projects" icon={Clapperboard} />
                        <NavItem id="messages" label="Inbox" icon={Mail} />
                        <NavItem id="settings" label="API Settings" icon={Settings} />
                    </nav>
                </div>

                <div className="space-y-4">
                    {saveError && <div className="text-red-400 text-xs px-2">{saveError}</div>}
                    <button onClick={handleSave} className="w-full py-3 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all">
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between px-2">
                        <button onClick={handleClose} className="flex items-center gap-2 text-xs text-gray-500 hover:text-white"><ExternalLink size={14} /> View Site</button>
                        <button onClick={() => { logout(); handleClose(); }} className="text-gray-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-y-auto bg-black relative">
                <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white capitalize">{activeTab} Manager</h1>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"><X size={20} /></button>
                </div>

                <div className="p-8 pb-32 max-w-7xl mx-auto">
                    
                    {/* HOME TAB */}
                    {activeTab === 'home' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-7 space-y-6">
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Featured Video</h3>
                                        <button 
                                            onClick={handleSyncYouTube}
                                            disabled={isSyncing}
                                            className="text-[10px] flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition-all uppercase tracking-widest font-bold"
                                        >
                                            {isSyncing ? <Loader2 className="animate-spin" size={12} /> : <Youtube size={12} />}
                                            Sync from YouTube
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={latestVideo.title} onChange={(e) => updateLatestVideo({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
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
                                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Live Preview</label>
                                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative">
                                    <img src={latestVideo.image} className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div></div></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROJECTS TAB */}
                    {activeTab === 'projects' && (
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 border-b border-white/5 pb-2 mb-2">Portfolio Hero</h3>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-gray-500">Featured Film</label>
                                        <select value={projectConfig?.featuredFilmId} onChange={(e) => updateProjectConfig({ featuredFilmId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white">
                                            {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                        </select>
                                        <input type="text" placeholder="Hero Label" value={projectConfig.label} onChange={(e) => updateProjectConfig({ label: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white" />
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 border-b border-white/5 pb-2 mb-2">Coming Soon</h3>
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={inProduction.title} onChange={(e) => updateInProduction({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white" />
                                        <input type="text" placeholder="Status (e.g. Post-Production)" value={inProduction.status} onChange={(e) => updateInProduction({ status: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white" />
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Image URL" value={inProduction.image} onChange={(e) => updateInProduction({ image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400" />
                                            <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FILMS EDITOR */}
                            <div className="pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-teal-400">Selected Works</h3>
                                    <button onClick={addFilm} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2"><Plus size={14} /> Add Film</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {films.map((film) => (
                                        <div key={film.id} className="p-5 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4 group">
                                            <div className="flex justify-between items-center">
                                                <input type="text" value={film.title} onChange={(e) => updateFilm(film.id, { title: e.target.value })} className="bg-transparent text-white font-bold focus:outline-none w-full" />
                                                <button onClick={() => deleteFilm(film.id)} className="text-gray-600 hover:text-red-500 ml-2 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="text" placeholder="Location" value={film.location} onChange={(e) => updateFilm(film.id, { location: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
                                                <input type="text" placeholder="Year" value={film.year} onChange={(e) => updateFilm(film.id, { year: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg p-2 text-[10px] text-white" />
                                            </div>
                                            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5">
                                                <img src={film.image} className="w-full h-full object-cover" />
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                                    <Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateFilm(film.id, { image: url }))} />
                                                </label>
                                            </div>
                                            <input type="text" placeholder="YouTube ID" value={film.videoId} onChange={(e) => updateFilm(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SHORTS / REELS EDITOR */}
                            <div className="pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-purple-400">Short Stories / Reels</h3>
                                    <button onClick={addShort} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 transition-colors"><Plus size={14} /> Add Manual Reel</button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {shorts.map((short) => (
                                        <div key={short.id} className="aspect-[9/16] rounded-xl overflow-hidden border border-white/5 relative group bg-[#0F0F11]">
                                            <img src={short.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                                                <div className="flex justify-between items-center">
                                                    <button onClick={() => updateShort(short.id, { externalSource: short.externalSource === 'instagram' ? 'youtube' : 'instagram' })} className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/10 text-white">
                                                        {short.externalSource === 'instagram' ? <Instagram size={10} className="inline mr-1" /> : <Youtube size={10} className="inline mr-1" />} 
                                                        {short.externalSource === 'instagram' ? 'IG' : 'YT'}
                                                    </button>
                                                    <button onClick={() => deleteShort(short.id)} className="text-red-400"><Trash2 size={14} /></button>
                                                </div>
                                                <div className="space-y-2">
                                                    <input type="text" placeholder="Title" value={short.title} onChange={(e) => updateShort(short.id, { title: e.target.value })} className="w-full bg-white/10 border border-white/5 text-[10px] p-2 rounded text-white" />
                                                    <input type="text" placeholder={short.externalSource === 'instagram' ? "Reel URL" : "YouTube ID"} value={short.videoId} onChange={(e) => updateShort(short.id, { videoId: short.externalSource === 'instagram' ? e.target.value : extractYouTubeId(e.target.value) })} className="w-full bg-white/10 border border-white/5 text-[10px] p-2 rounded text-blue-300 font-mono" />
                                                    <label className="w-full flex items-center justify-center py-2 bg-white/5 border border-white/5 rounded text-[10px] cursor-pointer hover:bg-white/10 transition-colors">
                                                        <Camera size={12} className="mr-1" /> Update Thumbnail
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

                    {/* MESSAGES TAB */}
                    {activeTab === 'messages' && (
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {messages.length === 0 ? <div className="col-span-2 py-24 text-center text-gray-500">Inbox is empty.</div> : messages.map(msg => (
                                <div key={msg.id} className={`p-6 rounded-2xl border ${msg.read ? 'bg-[#0F0F11] border-white/5 opacity-60' : 'bg-[#121214] border-green-500/30 shadow-lg shadow-green-500/5'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div><h4 className="text-white font-bold">{msg.name}</h4><p className="text-xs text-blue-400">{msg.email}</p></div>
                                        {!msg.read && <button onClick={() => markMessageRead(msg.id)} className="text-[10px] text-green-400 px-2 py-1 bg-green-500/10 rounded font-bold uppercase tracking-widest">Mark Read</button>}
                                    </div>
                                    <p className="text-sm text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="p-8 rounded-3xl bg-[#0F0F11] border border-white/5 space-y-8 shadow-2xl">
                                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">Social & API Settings</h3>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold flex items-center gap-2"><Youtube size={14} /> YouTube Channel Settings</label>
                                        <input type="text" placeholder="YouTube Data API Key" value={syncSettings.youtubeApiKey} onChange={(e) => updateSyncSettings({ youtubeApiKey: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" />
                                        <input type="text" placeholder="YouTube Channel ID (@mavestone)" value={syncSettings.youtubeChannelId} onChange={(e) => updateSyncSettings({ youtubeChannelId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" />
                                        <p className="text-[10px] text-gray-600 leading-relaxed italic">The YouTube API is used to pull your latest video details instantly into the "Home" editor.</p>
                                    </div>
                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold flex items-center gap-2"><Instagram size={14} /> Instagram Management</label>
                                        <p className="text-xs text-gray-400">Instagram API is disabled for stability. For Reels, please manually copy the link from Instagram and paste it into the individual Reel items in the "Projects" tab.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                                <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">Danger Zone</h4>
                                <button className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold hover:bg-red-500/20 transition-colors" onClick={() => { if(confirm("Reset all site content? This cannot be undone.")) useContent().seedDatabase() }}>Factory Reset Site Content</button>
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
