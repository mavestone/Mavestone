
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Mail, Plus, Trash2, LogOut, ExternalLink, Youtube, GripVertical, User, Users, CheckCircle2, Clock, Phone, FileText, TrendingUp, MessageSquare, Table, List } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminOpen, closeAdmin, 
    latestVideo, updateLatestVideo, 
    inProduction, updateInProduction,
    shorts, setShorts, updateShort, addShort, deleteShort,
    films, updateFilm, addFilm, deleteFilm,
    clientWork, updateClientWork, addClientWork, deleteClientWork,
    aboutData, updateAboutData, updateTestimonial, addTestimonial, deleteTestimonial,
    projectConfig, updateProjectConfig,
    saveChanges, uploadImage,
    isAuthenticated, fetchMessages, messages, markMessageRead, updateMessage, deleteMessage, logout,
    seedDatabase
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'shorts' | 'about' | 'crm'>('home');
  const [crmView, setCrmView] = useState<'cards' | 'spreadsheet'>('cards');
  const [crmSort, setCrmSort] = useState<'date' | 'status' | 'priority' | 'value'>('date');
  const [processingImage, setProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      if (activeTab === 'crm' && isAuthenticated) fetchMessages();
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
                        <NavItem id="crm" label="CRM / Leads" icon={Users} />
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
                                <h3 className="text-lg font-bold text-white">Selected Works (Originals)</h3>
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

                            <div className="flex justify-between items-center px-2 pt-8 border-t border-white/5 mt-12">
                                <h3 className="text-lg font-bold text-white">Client Work</h3>
                                <button onClick={() => addClientWork()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add Client Project</button>
                            </div>

                             <div className="space-y-6">
                                {clientWork.map((film) => (
                                    <div key={film.id} className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 group">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            <div className="lg:col-span-4 space-y-4">
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                                    <img src={film.image} className="w-full h-full object-cover" alt={film.title} />
                                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateClientWork(film.id, { image: url }))} /></label>
                                                </div>
                                                <input type="text" placeholder="Thumbnail URL" value={film.image} onChange={(e) => updateClientWork(film.id, { image: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-[10px] text-gray-500" />
                                                <input type="text" placeholder="YouTube URL or ID" value={film.videoId || ''} onChange={(e) => updateClientWork(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300" />
                                            </div>
                                            <div className="lg:col-span-8 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <input type="text" placeholder="Project Title" value={film.title} onChange={(e) => updateClientWork(film.id, { title: e.target.value })} className="text-xl font-bold bg-transparent text-white border-b border-transparent focus:border-white/20 focus:outline-none w-full mr-4" />
                                                    <button onClick={() => deleteClientWork(film.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <input type="text" placeholder="Category" value={film.category} onChange={(e) => updateClientWork(film.id, { category: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Tagline" value={film.tagline} onChange={(e) => updateClientWork(film.id, { tagline: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Year" value={film.year || ''} onChange={(e) => updateClientWork(film.id, { year: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Location" value={film.location || ''} onChange={(e) => updateClientWork(film.id, { location: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Film Type (e.g. Feature)" value={film.filmType || ''} onChange={(e) => updateClientWork(film.id, { filmType: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Duration (e.g. 1h 20m)" value={film.duration || ''} onChange={(e) => updateClientWork(film.id, { duration: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Genres" value={film.genres || ''} onChange={(e) => updateClientWork(film.id, { genres: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <textarea rows={3} placeholder="Full Description for Lightbox" value={film.description || ''} onChange={(e) => updateClientWork(film.id, { description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none" />
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

                    {/* CRM TAB */}
                    {activeTab === 'crm' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">Total Leads</p>
                                    <p className="text-2xl font-black text-white">{messages.length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                                    <p className="text-[10px] text-green-400 uppercase tracking-widest font-bold mb-1">New</p>
                                    <p className="text-2xl font-black text-white">{messages.filter(m => m.status === 'new' || !m.status).length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                    <p className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1">Contacted</p>
                                    <p className="text-2xl font-black text-white">{messages.filter(m => m.status === 'contacted').length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">Converted</p>
                                    <p className="text-2xl font-black text-white">{messages.filter(m => m.status === 'converted').length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-1">Pipeline Value</p>
                                    <p className="text-2xl font-black text-white">${messages.reduce((acc, m) => acc + (m.value || 0), 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0F0F11] p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setCrmView('cards')}
                                        className={`p-2 rounded-lg transition-all ${crmView === 'cards' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        title="Card View"
                                    >
                                        <List size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setCrmView('spreadsheet')}
                                        className={`p-2 rounded-lg transition-all ${crmView === 'spreadsheet' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        title="Spreadsheet View"
                                    >
                                        <Table size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sort By:</span>
                                        <select 
                                            value={crmSort}
                                            onChange={(e) => setCrmSort(e.target.value as any)}
                                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/20"
                                        >
                                            <option value="date">Date Received</option>
                                            <option value="status">Lead Status</option>
                                            <option value="priority">Priority</option>
                                            <option value="value">Deal Value</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="py-24 text-center bg-[#0F0F11] rounded-3xl border border-white/5">
                                        <Users className="mx-auto w-12 h-12 text-gray-800 mb-4" />
                                        <p className="text-gray-500">No leads captured yet.</p>
                                    </div>
                                ) : (
                                    <>
                                        {crmView === 'cards' ? (
                                            <div className="space-y-4">
                                                {[...messages].sort((a, b) => {
                                                    if (crmSort === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                                                    if (crmSort === 'status') return (a.status || '').localeCompare(b.status || '');
                                                    if (crmSort === 'priority') {
                                                        const pMap = { high: 3, medium: 2, low: 1 };
                                                        return (pMap[b.priority || 'medium'] || 0) - (pMap[a.priority || 'medium'] || 0);
                                                    }
                                                    if (crmSort === 'value') return (b.value || 0) - (a.value || 0);
                                                    return 0;
                                                }).map(msg => (
                                                    <div key={msg.id} className={`p-6 rounded-2xl border transition-all ${msg.read ? 'bg-[#0F0F11] border-white/5' : 'bg-[#121214] border-blue-500/30 shadow-lg shadow-blue-500/5'}`}>
                                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                            <div className="flex-1 space-y-4">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <div className="flex items-center gap-3 mb-1">
                                                                            <h4 className="text-lg font-bold text-white">{msg.name}</h4>
                                                                            {msg.company && <span className="text-gray-500 text-sm">@ {msg.company}</span>}
                                                                            {!msg.read && <span className="px-2 py-0.5 bg-blue-500 text-[8px] font-black uppercase tracking-widest rounded text-white">New</span>}
                                                                            <select 
                                                                                value={msg.priority || 'medium'} 
                                                                                onChange={(e) => updateMessage(msg.id, { priority: e.target.value as any })}
                                                                                className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border focus:outline-none transition-colors ${
                                                                                    msg.priority === 'high' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                                                                                    msg.priority === 'low' ? 'bg-gray-500/20 border-gray-500/30 text-gray-400' :
                                                                                    'bg-blue-500/20 border-blue-500/30 text-blue-400'
                                                                                }`}
                                                                            >
                                                                                <option value="low">Low Priority</option>
                                                                                <option value="medium">Medium Priority</option>
                                                                                <option value="high">High Priority</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="flex flex-wrap items-center gap-4 text-xs">
                                                                            <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline flex items-center gap-1"><Mail size={12} /> {msg.email}</a>
                                                                            {msg.phone && <a href={`tel:${msg.phone}`} className="text-gray-400 hover:text-white flex items-center gap-1"><Phone size={12} /> {msg.phone}</a>}
                                                                            <span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> {new Date(msg.created_at).toLocaleDateString()}</span>
                                                                            {msg.source && <span className="text-gray-600 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full text-[10px]"><TrendingUp size={10} /> {msg.source}</span>}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="flex flex-col items-end gap-2">
                                                                        <select 
                                                                            value={msg.status || 'new'} 
                                                                            onChange={(e) => updateMessage(msg.id, { status: e.target.value as any })}
                                                                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border focus:outline-none transition-colors ${
                                                                                msg.status === 'converted' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                                                msg.status === 'contacted' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                                                                                msg.status === 'qualified' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                                                msg.status === 'lost' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                                                'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                                            }`}
                                                                        >
                                                                            <option value="new">New Lead</option>
                                                                            <option value="contacted">Contacted</option>
                                                                            <option value="qualified">Qualified</option>
                                                                            <option value="converted">Converted</option>
                                                                            <option value="lost">Lost</option>
                                                                        </select>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Value:</span>
                                                                            <div className="relative">
                                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-500 text-xs">$</span>
                                                                                <input 
                                                                                    type="number" 
                                                                                    value={msg.value || 0} 
                                                                                    onChange={(e) => updateMessage(msg.id, { value: parseInt(e.target.value) || 0 })}
                                                                                    className="bg-black/40 border border-white/10 rounded-lg pl-5 pr-2 py-1 text-xs text-white w-24 focus:outline-none focus:border-emerald-500/50"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageSquare size={12} /> Message Content</p>
                                                                    <p className="text-sm text-gray-300 leading-relaxed italic">"{msg.message}"</p>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={12} /> Internal Notes</label>
                                                                    <textarea 
                                                                        value={msg.notes || ''} 
                                                                        onChange={(e) => updateMessage(msg.id, { notes: e.target.value })}
                                                                        placeholder="Add follow-up notes, project scope, or budget details..."
                                                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-xs text-gray-300 focus:outline-none focus:border-white/20 transition-all min-h-[80px]"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="lg:w-48 flex flex-col gap-2">
                                                                {!msg.read && (
                                                                    <button 
                                                                        onClick={() => markMessageRead(msg.id)}
                                                                        className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                                                    >
                                                                        <CheckCircle2 size={14} /> Mark as Read
                                                                    </button>
                                                                )}
                                                                <a 
                                                                    href={`mailto:${msg.email}?subject=Mavestone Inquiry - Re: ${msg.name}`}
                                                                    className="w-full py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                                                                >
                                                                    <Mail size={14} /> Send Email
                                                                </a>
                                                                <button 
                                                                    onClick={() => { if(confirm("Permanently delete this lead?")) deleteMessage(msg.id) }}
                                                                    className="w-full py-3 text-gray-600 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-auto"
                                                                >
                                                                    <Trash2 size={14} /> Delete Lead
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0F0F11]">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Name</th>
                                                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Priority</th>
                                                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Value</th>
                                                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                                                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[...messages].sort((a, b) => {
                                                            if (crmSort === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                                                            if (crmSort === 'status') return (a.status || '').localeCompare(b.status || '');
                                                            if (crmSort === 'priority') {
                                                                const pMap = { high: 3, medium: 2, low: 1 };
                                                                return (pMap[b.priority || 'medium'] || 0) - (pMap[a.priority || 'medium'] || 0);
                                                            }
                                                            if (crmSort === 'value') return (b.value || 0) - (a.value || 0);
                                                            return 0;
                                                        }).map(msg => (
                                                            <tr key={msg.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors">
                                                                <td className="p-4">
                                                                    <div className="font-bold text-white">{msg.name}</div>
                                                                    <div className="text-[10px] text-gray-500">{msg.email}</div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <select 
                                                                        value={msg.status || 'new'} 
                                                                        onChange={(e) => updateMessage(msg.id, { status: e.target.value as any })}
                                                                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border focus:outline-none transition-colors ${
                                                                            msg.status === 'converted' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                                            msg.status === 'contacted' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                                                                            msg.status === 'qualified' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                                            msg.status === 'lost' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                                        }`}
                                                                    >
                                                                        <option value="new">New</option>
                                                                        <option value="contacted">Contacted</option>
                                                                        <option value="qualified">Qualified</option>
                                                                        <option value="converted">Converted</option>
                                                                        <option value="lost">Lost</option>
                                                                    </select>
                                                                </td>
                                                                <td className="p-4">
                                                                    <select 
                                                                        value={msg.priority || 'medium'} 
                                                                        onChange={(e) => updateMessage(msg.id, { priority: e.target.value as any })}
                                                                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border focus:outline-none transition-colors ${
                                                                            msg.priority === 'high' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                                                                            msg.priority === 'low' ? 'bg-gray-500/20 border-gray-500/30 text-gray-400' :
                                                                            'bg-blue-500/20 border-blue-500/30 text-blue-400'
                                                                        }`}
                                                                    >
                                                                        <option value="low">Low</option>
                                                                        <option value="medium">Medium</option>
                                                                        <option value="high">High</option>
                                                                    </select>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-emerald-500 text-xs">$</span>
                                                                        <input 
                                                                            type="number" 
                                                                            value={msg.value || 0} 
                                                                            onChange={(e) => updateMessage(msg.id, { value: parseInt(e.target.value) || 0 })}
                                                                            className="bg-transparent border-none p-0 text-xs text-white w-20 focus:outline-none"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-xs text-gray-500">
                                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <button 
                                                                            onClick={() => { if(confirm("Permanently delete this lead?")) deleteMessage(msg.id) }}
                                                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                        <a 
                                                                            href={`mailto:${msg.email}`}
                                                                            className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                                                                            title="Email"
                                                                        >
                                                                            <Mail size={14} />
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </>
                                )}
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
