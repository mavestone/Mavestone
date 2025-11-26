
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, AlertCircle, Camera, Loader2, LogOut, Database, Eye, EyeOff, Layout, Clapperboard, Settings, Mail, RefreshCcw } from 'lucide-react';
import { MagneticButton } from './ui/MagneticButton';
import { supabase } from '../lib/supabase';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminOpen, 
    toggleAdmin, 
    latestVideo, 
    updateLatestVideo, 
    inProduction,
    updateInProduction,
    shorts, 
    updateShort,
    saveChanges,
    uploadImage,
    logout,
    seedDatabase,
    isAuthenticated,
    messages,
    fetchMessages,
    markMessageRead
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'messages' | 'settings'>('home');
  const [processingImage, setProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Fetch messages when tab is opened
  useEffect(() => {
      if (activeTab === 'messages' && isAuthenticated) {
          fetchMessages();
      }
  }, [activeTab, isAuthenticated]);

  // Helper to extract ID from various YouTube URL formats
  const extractYouTubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = url.match(regExp);
    const id = match?.[8]?.length === 11 ? match[8] : url;
    return id.trim();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!supabase) {
        alert("Supabase not connected. Add API keys to .env to upload images.");
        return;
    }

    setProcessingImage(true);
    try {
        const publicUrl = await uploadImage(file);
        if (publicUrl) {
            callback(publicUrl);
        } else {
            alert("Upload failed. Ensure you are logged in.");
        }
    } catch (err) {
        console.error(err);
        alert("Upload failed");
    } finally {
        setProcessingImage(false);
    }
  };

  const handleSave = async () => {
    if (!supabase) {
        alert("Supabase not connected. Add API keys to .env to save changes.");
        return;
    }

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

  // Only show if authorized
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
                     <button 
                        onClick={handleSave}
                        className="p-2 rounded-full hover:bg-white/10 text-green-400 transition-colors"
                        title="Quick Save"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    </button>
                    <button 
                        onClick={toggleAdmin}
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('home')}
                    className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 md:gap-2 ${activeTab === 'home' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Layout size={14} /> Home
                </button>
                <button 
                    onClick={() => setActiveTab('projects')}
                    className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 md:gap-2 ${activeTab === 'projects' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Clapperboard size={14} /> Projects
                </button>
                <button 
                    onClick={() => setActiveTab('messages')}
                    className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 md:gap-2 ${activeTab === 'messages' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Mail size={14} /> Inbox
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 md:gap-2 ${activeTab === 'settings' ? 'bg-white/5 text-white border-b-2 border-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Settings size={14} /> Settings
                </button>
            </div>

            <div className="p-6 space-y-8 flex-1 overflow-y-auto">
              {!supabase && (
                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex gap-3">
                    <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                    <div className="text-xs text-red-200/80">
                        <strong className="text-red-500 block mb-1">Offline Mode</strong>
                        Changes will not be saved. Add API keys to .env to connect to Supabase.
                    </div>
                 </div>
              )}

              {/* HOME TAB */}
              {activeTab === 'home' && (
                <div className="space-y-8">
                     {/* Latest Video Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Featured Video</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Title</label>
                            <input 
                            type="text" 
                            value={latestVideo.title}
                            onChange={(e) => updateLatestVideo({ title: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">YouTube Link or ID</label>
                            <input 
                            type="text" 
                            value={latestVideo.videoId}
                            placeholder="Paste full YouTube URL here..."
                            onChange={(e) => updateLatestVideo({ videoId: extractYouTubeId(e.target.value) })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-white/30"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Thumbnail Image</label>
                            <div className="relative">
                                <input 
                                type="text" 
                                value={latestVideo.image}
                                onChange={(e) => updateLatestVideo({ image: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-gray-300 focus:outline-none focus:border-white/30 pr-10"
                                />
                                <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer transition-colors" title="Upload Image">
                                    <Camera size={14} className="text-white" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, (url) => updateLatestVideo({ image: url }))}
                                    />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Description</label>
                            <textarea 
                            rows={3}
                            value={latestVideo.description}
                            onChange={(e) => updateLatestVideo({ description: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30"
                            />
                        </div>
                        </div>
                    </section>

                    {/* Shorts Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400">Shorts</h3>
                        <div className="space-y-4">
                            {shorts.map((short, idx) => (
                                <div key={short.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                                        {/* Toggle View Visibility */}
                                        <button 
                                            onClick={() => updateShort(short.id, { showViews: !short.showViews })}
                                            className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border transition-colors ${short.showViews !== false ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-gray-700 bg-gray-800 text-gray-400'}`}
                                        >
                                            {short.showViews !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                                            {short.showViews !== false ? 'Views On' : 'Views Off'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Title</label>
                                            <input 
                                                type="text" 
                                                value={short.title}
                                                onChange={(e) => updateShort(short.id, { title: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-white/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Views Count</label>
                                            <input 
                                                type="text" 
                                                value={short.views}
                                                onChange={(e) => updateShort(short.id, { views: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-white/30"
                                                placeholder="e.g. 1.2M"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">YouTube ID</label>
                                        <input 
                                            type="text" 
                                            value={short.videoId}
                                            onChange={(e) => updateShort(short.id, { videoId: extractYouTubeId(e.target.value) })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm font-mono text-white focus:outline-none focus:border-white/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Thumbnail</label>
                                        <div className="relative">
                                            <input 
                                            type="text" 
                                            value={short.image}
                                            onChange={(e) => updateShort(short.id, { image: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-gray-300 focus:outline-none focus:border-white/30 pr-10"
                                            />
                                            <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer transition-colors">
                                                <Camera size={12} className="text-white" />
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, (url) => updateShort(short.id, { image: url }))}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-8">
                     {/* Coming Soon Section */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400">Coming Soon (In Production)</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Project Title</label>
                            <input 
                            type="text" 
                            value={inProduction.title}
                            onChange={(e) => updateInProduction({ title: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Status Tag</label>
                            <input 
                            type="text" 
                            value={inProduction.status}
                            placeholder="e.g. Pre-Production, Filming..."
                            onChange={(e) => updateInProduction({ status: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Image</label>
                            <div className="relative">
                                <input 
                                type="text" 
                                value={inProduction.image}
                                onChange={(e) => updateInProduction({ image: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-gray-300 focus:outline-none focus:border-white/30 pr-10"
                                />
                                <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer transition-colors" title="Upload Image">
                                    <Camera size={14} className="text-white" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))}
                                    />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Description</label>
                            <textarea 
                            rows={3}
                            value={inProduction.description}
                            onChange={(e) => updateInProduction({ description: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30"
                            />
                        </div>
                        </div>
                    </section>
                </div>
              )}

              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-green-400">Inbox</h3>
                        <button onClick={fetchMessages} className="text-xs text-gray-500 hover:text-white flex items-center gap-1">
                            <RefreshCcw size={12} /> Refresh
                        </button>
                      </div>

                      {messages.length === 0 ? (
                          <div className="text-center py-12 text-gray-500 text-sm">No messages yet.</div>
                      ) : (
                          <div className="space-y-3">
                              {messages.map((msg) => (
                                  <div 
                                    key={msg.id} 
                                    className={`p-4 rounded-xl border transition-colors ${msg.read ? 'bg-white/5 border-white/5 opacity-70' : 'bg-white/10 border-white/20'}`}
                                  >
                                      <div className="flex justify-between items-start mb-2">
                                          <h4 className="font-bold text-white text-sm">{msg.name}</h4>
                                          <span className="text-[10px] text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                                      </div>
                                      <div className="text-xs text-gray-400 mb-2">{msg.email}</div>
                                      <p className="text-sm text-gray-300 bg-black/30 p-2 rounded-lg mb-2">{msg.message}</p>
                                      
                                      {!msg.read && (
                                          <button 
                                            onClick={() => markMessageRead(msg.id)}
                                            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                          >
                                              <Eye size={10} /> Mark as Read
                                          </button>
                                      )}
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                    <button 
                        onClick={seedDatabase}
                        className="w-full py-4 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white transition-colors border border-white/5 rounded-xl hover:bg-white/5"
                    >
                        <Database size={14} />
                        <span>Populate Default Data (Reset DB)</span>
                    </button>
                    
                    <button 
                        onClick={logout}
                        className="w-full py-4 flex items-center justify-center gap-2 text-xs text-red-500 hover:text-red-400 transition-colors border border-red-500/10 rounded-xl hover:bg-red-500/5"
                    >
                        <LogOut size={14} />
                        <span>Logout Session</span>
                    </button>
                </div>
              )}

              <div className="pt-8 space-y-3 pb-8">
                {saveError && <p className="text-red-400 text-xs text-center">{saveError}</p>}
                
                {activeTab !== 'messages' && (
                    <MagneticButton variant="primary" className="w-full" onClick={handleSave}>
                        {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                        <span>{isSaving ? 'Saving to Cloud...' : 'Save Changes'}</span>
                    </MagneticButton>
                )}
              </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
