
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Mail, Plus, Trash2, LogOut, ExternalLink, Youtube, GripVertical, ChevronUp, ChevronDown, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminOpen, closeAdmin, 
    latestVideo, updateLatestVideo, 
    inProduction, updateInProduction,
    shorts, setShorts, updateShort, addShort, deleteShort,
    films, updateFilm, addFilm, deleteFilm,
    aboutData, updateAboutData, updateTestimonial, addTestimonial, deleteTestimonial,
    projectConfig, updateProjectConfig,
    saveChanges, uploadImage,
    isAuthenticated, fetchMessages, messages, markMessageRead, logout,
    seedDatabase
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'shorts' | 'about' | 'messages'>('home');
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
                        <NavItem id="projects" label="Projects" icon={Clapperboard} />
                        <NavItem id="shorts" label="Shorts" icon={Youtube} />
                        <NavItem id="about" label="About" icon={User} />
                        <NavItem id="messages" label="Inquiries" icon={Mail} />
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
                    <button 
                        onClick={() => { if(confirm("Reset all content to factory defaults?")) seedDatabase() }}
                        className="w-full py-2 text-[9px] text-gray-700 hover:text-red-900 transition-colors uppercase tracking-[0.2em]"
                    >
                        Hard Reset
                    </button>
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
                    {/* HOME TAB */}
                    {activeTab === 'home' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-white/5 pb-4">Main Featured Video</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <input type="text" placeholder="Video Title" value={latestVideo.title} onChange={(e) => updateLatestVideo({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                                <input type="text" placeholder="YouTube URL or ID" value={latestVideo.videoId} onChange={(e) => updateLatestVideo({ videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-300 focus:outline-none" />
                                            </div>
                                            <textarea rows={4} placeholder="Description" value={latestVideo.description} onChange={(e) => updateLatestVideo({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Thumbnail URL" value={latestVideo.image} onChange={(e) => updateLatestVideo({ image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                                <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateLatestVideo({ image: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative group bg-[#0F0F11]">
                                        <img src={latestVideo.image} className="w-full h-full object-cover opacity-80" alt="Preview" />
                                        <div className="absolute inset-0 flex items-center justify-center"><Youtube size={48} className="text-white opacity-40" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === 'about' && (
                        <div className="space-y-8">
                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400 border-b border-white/5 pb-4">Bio Details</h3>
                                        <div className="space-y-4">
                                            <input type="text" placeholder="Subtitle (e.g. 01 / The Visionary)" value={aboutData.subtitle} onChange={(e) => updateAboutData({ subtitle: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                            <textarea rows={6} placeholder="Description" value={aboutData.description} onChange={(e) => updateAboutData({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                            <label className="text-xs text-gray-500 uppercase tracking-widest block mt-4">Testimonials Background</label>
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Background Image URL" value={aboutData.testimonialsBackground || ''} onChange={(e) => updateAboutData({ testimonialsBackground: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                                <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutData({ testimonialsBackground: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 space-y-4">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] relative group bg-[#0F0F11]">
                                        <img src={aboutData.portrait} className="w-full h-full object-cover" alt="Portrait Preview" />
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold"><Camera size={32} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutData({ portrait: url }))} /></label>
                                    </div>
                                    <input type="text" placeholder="Portrait URL" value={aboutData.portrait} onChange={(e) => updateAboutData({ portrait: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] text-gray-500" />
                                </div>
                             </div>

                             <div className="space-y-6">
                                 <div className="flex justify-between items-center px-2">
                                     <h3 className="text-lg font-bold text-white">Client Reviews (Conveyor)</h3>
                                     <button onClick={() => addTestimonial()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add Review</button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {aboutData.testimonials.map((t) => (
                                         <div key={t.id} className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 group relative">
                                             <button onClick={() => deleteTestimonial(t.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                             <div className="space-y-4">
                                                 <textarea rows={3} value={t.text} onChange={(e) => updateTestimonial(t.id, { text: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xs text-white italic" placeholder="Review Text" />
                                                 <div className="flex items-center gap-4">
                                                     <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 group/av">
                                                         <img src={t.avatar} className="w-full h-full object-cover" />
                                                         <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/av:opacity-100 flex items-center justify-center cursor-pointer"><Camera size={14} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateTestimonial(t.id, { avatar: url }))} /></label>
                                                     </div>
                                                     <div className="flex-1 grid grid-cols-2 gap-2">
                                                         <input type="text" value={t.name} onChange={(e) => updateTestimonial(t.id, { name: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="Name" />
                                                         <input type="text" value={t.company} onChange={(e) => updateTestimonial(t.id, { company: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="Company" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* PROJECTS TAB */}
                    {activeTab === 'projects' && (
                        <div className="space-y-8">
                            <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 border-b border-white/5 pb-4">Portfolio Hero Config</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Hero Featured Film</label>
                                        <select value={projectConfig?.featuredFilmId} onChange={(e) => updateProjectConfig({ featuredFilmId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white">
                                            {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                        </select>
                                        <input type="text" placeholder="Label (e.g. M ORIGINAL)" value={projectConfig.label} onChange={(e) => updateProjectConfig({ label: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Overlay Logo Image</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Logo Image URL" value={projectConfig.logoImage || ''} onChange={(e) => updateProjectConfig({ logoImage: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                            <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateProjectConfig({ logoImage: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400 border-b border-white/5 pb-4">In Production / Coming Soon</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={inProduction.title} onChange={(e) => updateInProduction({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                        <input type="text" placeholder="Status (e.g. Post-Production)" value={inProduction.status} onChange={(e) => updateInProduction({ status: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                        <textarea rows={3} placeholder="Description" value={inProduction.description} onChange={(e) => updateInProduction({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                            <img src={inProduction.image} className="w-full h-full object-cover" alt="Production Preview" />
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))} /></label>
                                        </div>
                                        <input type="text" placeholder="Cover URL" value={inProduction.image} onChange={(e) => updateInProduction({ image: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-2 pt-8">
                                <h3 className="text-lg font-bold text-white">Project Gallery</h3>
                                <button onClick={() => addFilm()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add New Project</button>
                            </div>

                            <div className="space-y-6">
                                {films.map((film) => (
                                    <div key={film.id} className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 group">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            <div className="lg:col-span-4 space-y-4">
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                                    <img src={film.image} className="w-full h-full object-cover" alt={film.title} />
                                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateFilm(film.id, { image: url }))} /></label>
                                                </div>
                                                <input type="text" placeholder="Thumbnail URL" value={film.image} onChange={(e) => updateFilm(film.id, { image: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-[10px] text-gray-500" />
                                                <input type="text" placeholder="YouTube URL or ID" value={film.videoId || ''} onChange={(e) => updateFilm(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300" />
                                            </div>
                                            <div className="lg:col-span-8 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <input type="text" placeholder="Project Title" value={film.title} onChange={(e) => updateFilm(film.id, { title: e.target.value })} className="text-xl font-bold bg-transparent text-white border-b border-transparent focus:border-white/20 focus:outline-none w-full mr-4" />
                                                    <button onClick={() => deleteFilm(film.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <input type="text" placeholder="Category" value={film.category} onChange={(e) => updateFilm(film.id, { category: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Tagline" value={film.tagline} onChange={(e) => updateFilm(film.id, { tagline: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Year" value={film.year || ''} onChange={(e) => updateFilm(film.id, { year: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Location" value={film.location || ''} onChange={(e) => updateFilm(film.id, { location: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Film Type (e.g. Feature)" value={film.filmType || ''} onChange={(e) => updateFilm(film.id, { filmType: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Duration (e.g. 1h 20m)" value={film.duration || ''} onChange={(e) => updateFilm(film.id, { duration: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Genres" value={film.genres || ''} onChange={(e) => updateFilm(film.id, { genres: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <textarea rows={3} placeholder="Full Description for Lightbox" value={film.description || ''} onChange={(e) => updateFilm(film.id, { description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SHORTS TAB */}
                    {activeTab === 'shorts' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-lg font-bold text-white">Vertical Stories Feed</h3>
                                <div className="flex gap-4 items-center">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden md:block">Drag to reorder</span>
                                    <button onClick={() => addShort()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add Short</button>
                                </div>
                            </div>

                            <Reorder.Group axis="y" values={shorts} onReorder={setShorts} className="space-y-4">
                                {shorts.map((short) => (
                                    <Reorder.Item 
                                        key={short.id} 
                                        value={short} 
                                        className="bg-[#0F0F11] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-6 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex justify-center cursor-grab active:cursor-grabbing text-gray-700 group-hover:text-white transition-colors"><GripVertical size={20} /></div>
                                            <div className="aspect-[9/16] w-24 rounded-lg overflow-hidden border border-white/10 relative">
                                                <img src={short.image} className="w-full h-full object-cover" alt={short.title} />
                                                <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateShort(short.id, { image: url }))} /></label>
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase tracking-widest text-gray-500">Short Title</label>
                                                <input type="text" value={short.title} onChange={(e) => updateShort(short.id, { title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase tracking-widest text-gray-500">YouTube ID</label>
                                                <input type="text" value={short.videoId} onChange={(e) => updateShort(short.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-300" />
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-[9px] uppercase tracking-widest text-gray-500">Views</label>
                                                    <input type="text" value={short.views} onChange={(e) => updateShort(short.id, { views: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-400" />
                                                </div>
                                                <button onClick={() => deleteShort(short.id)} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    )}

                    {/* MESSAGES TAB */}
                    {activeTab === 'messages' && (
                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                            {messages.length === 0 ? (
                                <div className="col-span-2 py-24 text-center">
                                    <Mail className="mx-auto w-12 h-12 text-gray-800 mb-4" />
                                    <p className="text-gray-500">Inbox is empty.</p>
                                </div>
                            ) : messages.map(msg => (
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
                </div>
            </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
