
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Settings, Mail, Plus, Trash2, Eye, EyeOff, LogOut, ExternalLink } from 'lucide-react';
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
    saveChanges, uploadImage,
    isAuthenticated, fetchMessages, messages, markMessageRead, logout
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'messages' | 'settings'>('home');
  const [processingImage, setProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
        // Visual feedback is handled by button state, but we can add a toast later if needed
    } catch (err) {
        setSaveError("Failed to save.");
    } finally {
        setIsSaving(false);
        setTimeout(() => setIsSaving(false), 2000); // Keep visual success state briefly if needed
    }
  };
  
  const handleClose = () => {
      closeAdmin();
      if (location.pathname === '/admin') {
          navigate('/');
      }
  };

  if (!isAuthenticated && isAdminOpen) return null;

  // Sidebar Item Component
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex overflow-hidden font-sans selection:bg-white/20"
        >
            {/* --- SIDEBAR --- */}
            <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-[#0A0A0A] flex flex-col justify-between p-6">
                <div className="space-y-8">
                    {/* Logo Area */}
                    <div className="px-2">
                        <h2 className="text-xl font-bold tracking-tighter text-white">Mavestone<span className="text-white/40">.</span></h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">CMS Dashboard</p>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                        <NavItem id="home" label="Home Page" icon={Layout} />
                        <NavItem id="projects" label="Projects" icon={Clapperboard} />
                        <NavItem id="messages" label="Inbox" icon={Mail} />
                        <NavItem id="settings" label="Settings" icon={Settings} />
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="space-y-4">
                     {saveError && <div className="text-red-400 text-xs px-2">{saveError}</div>}
                    
                    <button 
                        onClick={handleSave}
                        className="w-full py-3 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between px-2">
                        <button onClick={handleClose} className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors">
                            <ExternalLink size={14} /> View Site
                        </button>
                         <button onClick={() => { logout(); handleClose(); }} className="text-gray-500 hover:text-red-400 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 overflow-y-auto bg-black relative">
                {/* Header with Close */}
                <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white capitalize">{activeTab} Manager</h1>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 pb-32 max-w-7xl mx-auto">
                    
                    {/* HOME TAB */}
                    {activeTab === 'home' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Featured Video Inputs */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Featured Video</h3>
                                        {processingImage && <span className="text-xs text-blue-400 flex items-center gap-1"><Loader2 className="animate-spin" size={12}/> Uploading...</span>}
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5 ml-1">Title</label>
                                            <input type="text" value={latestVideo.title} onChange={(e) => updateLatestVideo({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5 ml-1">YouTube Link</label>
                                            <input type="text" value={latestVideo.videoId} onChange={(e) => updateLatestVideo({ videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-300 focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5 ml-1">Description</label>
                                            <textarea rows={4} value={latestVideo.description} onChange={(e) => updateLatestVideo({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5 ml-1">Thumbnail URL</label>
                                            <div className="flex gap-2">
                                                <input type="text" value={latestVideo.image} onChange={(e) => updateLatestVideo({ image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none focus:border-white/30 transition-colors" />
                                                <label className="flex items-center justify-center px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors">
                                                    <Camera size={16} className="text-white" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateLatestVideo({ image: url }))} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Column */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-24">
                                    <label className="block text-xs text-gray-500 mb-2 uppercase tracking-widest">Preview</label>
                                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video relative group">
                                        <img src={latestVideo.image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                                            <h4 className="text-white font-bold truncate">{latestVideo.title}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROJECTS TAB */}
                    {activeTab === 'projects' && (
                        <div className="space-y-8">
                            
                            {/* Top Row: Hero & Production */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Hero Config */}
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4 h-full">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 border-b border-white/5 pb-2 mb-2">Hero Section Config</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] text-gray-500 mb-1">Featured Film (Source)</label>
                                            <select value={projectConfig?.featuredFilmId || ''} onChange={(e) => updateProjectConfig({ featuredFilmId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none">
                                                {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Label Text</label>
                                            <input type="text" value={projectConfig?.label || 'Original'} onChange={(e) => updateProjectConfig({ label: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Autoplay ID</label>
                                            <input type="text" value={projectConfig?.heroVideoId || ''} onChange={(e) => updateProjectConfig({ heroVideoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm font-mono text-white focus:outline-none" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] text-gray-500 mb-1">Logo Image (Optional)</label>
                                            <div className="flex gap-2">
                                                <input type="text" value={projectConfig?.logoImage || ''} onChange={(e) => updateProjectConfig({ logoImage: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-400 focus:outline-none" />
                                                <label className="p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={14} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateProjectConfig({ logoImage: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Coming Soon Config */}
                                <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-4 h-full">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 border-b border-white/5 pb-2 mb-2">In Production</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Title</label>
                                            <input type="text" value={inProduction.title} onChange={(e) => updateInProduction({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Status</label>
                                            <input type="text" value={inProduction.status} onChange={(e) => updateInProduction({ status: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] text-gray-500 mb-1">Description</label>
                                            <textarea rows={2} value={inProduction.description} onChange={(e) => updateInProduction({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                        </div>
                                         <div className="col-span-2">
                                            <label className="block text-[10px] text-gray-500 mb-1">Image URL</label>
                                            <div className="flex gap-2">
                                                <input type="text" value={inProduction.image} onChange={(e) => updateInProduction({ image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-400 focus:outline-none" />
                                                <label className="p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={14} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FILMS GRID */}
                            <div className="pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-teal-400">Selected Works</h3>
                                    <button onClick={addFilm} className="px-3 py-1.5 bg-white text-black hover:bg-gray-200 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"><Plus size={12} /> Add Film</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {films.map((film, idx) => (
                                        <div key={film.id} className="p-5 rounded-2xl bg-[#0F0F11] border border-white/5 hover:border-white/10 transition-colors group relative">
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                 <div className="text-xs font-mono text-gray-600">#{idx + 1}</div>
                                                 <button onClick={() => deleteFilm(film.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                           
                                           <div className="space-y-4 mt-2">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 mb-1">Title</label>
                                                        <input type="text" value={film.title} onChange={(e) => updateFilm(film.id, { title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm font-bold text-white focus:outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 mb-1">Category</label>
                                                        <input type="text" value={film.category} onChange={(e) => updateFilm(film.id, { category: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none" />
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 mb-1">Year</label>
                                                        <input type="text" value={film.year || ''} placeholder="2024" onChange={(e) => updateFilm(film.id, { year: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 mb-1">Loc</label>
                                                        <input type="text" value={film.location || ''} placeholder="USA" onChange={(e) => updateFilm(film.id, { location: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] text-gray-500 mb-1">Type</label>
                                                        <input type="text" value={film.filmType || ''} placeholder="Feature" onChange={(e) => updateFilm(film.id, { filmType: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1">Description</label>
                                                    <textarea rows={2} value={film.description || ''} onChange={(e) => updateFilm(film.id, { description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-400 focus:outline-none resize-none" />
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1">Genres (Comma separated)</label>
                                                    <input type="text" value={film.genres || ''} placeholder="Action, Drama" onChange={(e) => updateFilm(film.id, { genres: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none" />
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1">Image & Video ID</label>
                                                    <div className="flex gap-2 mb-2">
                                                        <input type="text" value={film.image} onChange={(e) => updateFilm(film.id, { image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:outline-none" placeholder="Image URL" />
                                                        <label className="p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={14} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateFilm(film.id, { image: url }))} /></label>
                                                    </div>
                                                    <input type="text" value={film.videoId || ''} onChange={(e) => updateFilm(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300 focus:outline-none" placeholder="YouTube ID" />
                                                </div>
                                           </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             {/* SHORTS GRID */}
                             <div className="pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-purple-400">Short Stories</h3>
                                    <button onClick={addShort} className="px-3 py-1.5 bg-white text-black hover:bg-gray-200 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"><Plus size={12} /> Add Short</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {shorts.map((short, idx) => (
                                        <div key={short.id} className="p-4 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-white/10 transition-colors relative">
                                            <div className="flex justify-between items-center mb-3">
                                                 <span className="text-xs font-mono text-gray-600">#{idx + 1}</span>
                                                 <div className="flex gap-2">
                                                    <button onClick={() => updateShort(short.id, { showViews: !short.showViews })} className={`text-[10px] ${short.showViews !== false ? 'text-green-500' : 'text-gray-600'}`}>
                                                        {short.showViews !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                                                    </button>
                                                    <button onClick={() => deleteShort(short.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                                 </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1">Title</label>
                                                    <input type="text" value={short.title} onChange={(e) => updateShort(short.id, { title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1">YouTube ID</label>
                                                    <input type="text" value={short.videoId} onChange={(e) => updateShort(short.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300 focus:outline-none" />
                                                </div>
                                                 <div>
                                                    <label className="block text-[10px] text-gray-500 mb-1">Thumbnail</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" value={short.image} onChange={(e) => updateShort(short.id, { image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:outline-none" />
                                                        <label className="p-2 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={12} className="text-white" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateShort(short.id, { image: url }))} /></label>
                                                    </div>
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
                         <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-bold text-green-400">Inbox</h3>
                                <button onClick={fetchMessages} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white border border-white/5 transition-colors">Refresh</button>
                            </div>
                            
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 py-24 bg-[#0F0F11] rounded-2xl border border-white/5">No messages yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`p-6 rounded-2xl border transition-all ${msg.read ? 'bg-[#0F0F11] border-white/5 opacity-60 hover:opacity-100' : 'bg-[#121214] border-green-500/30'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-white font-bold text-base mb-0.5">{msg.name}</h4>
                                                    <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 hover:underline">{msg.email}</a>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="text-[10px] text-gray-500 font-mono">{new Date(msg.created_at).toLocaleDateString()}</span>
                                                    {!msg.read && (
                                                        <button onClick={() => markMessageRead(msg.id)} className="text-[10px] text-green-400 bg-green-500/10 px-2 py-1 rounded hover:bg-green-500/20 transition-colors">Mark Read</button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-black/40 p-4 rounded-xl text-sm text-gray-300 leading-relaxed border border-white/5">
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                         <div className="max-w-2xl mx-auto space-y-8">
                             <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                <h3 className="text-lg font-bold text-gray-200 border-b border-white/5 pb-4">System Status</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Database</div>
                                        <div className={`text-lg font-bold ${supabase ? "text-green-400" : "text-red-400"}`}>
                                            {supabase ? "Connected" : "Offline / Mock Mode"}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Auth Status</div>
                                        <div className="text-lg font-bold text-blue-400">Authenticated</div>
                                    </div>
                                </div>

                                <div className="pt-8 mt-8 border-t border-white/5">
                                    <h4 className="text-red-400 text-sm font-bold mb-4 uppercase tracking-widest">Danger Zone</h4>
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                                        <div>
                                            <p className="text-white text-sm font-bold">Reset Database</p>
                                            <p className="text-xs text-red-300/70 mt-1">Reverts all content to initial demo data.</p>
                                        </div>
                                        <button 
                                            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 text-xs font-bold transition-colors" 
                                            onClick={() => { if(confirm("Are you sure? This will overwrite all changes.")) useContent().seedDatabase() }}
                                        >
                                            Reset Content
                                        </button>
                                    </div>
                                </div>
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
