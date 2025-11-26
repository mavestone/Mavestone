
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, AlertCircle, Camera, Loader2, LogOut, Database, Eye, EyeOff } from 'lucide-react';
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
    isAuthenticated
  } = useContent();

  const [processingImage, setProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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
        toggleAdmin();
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAdmin}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-white/10 z-[100] shadow-2xl overflow-y-auto"
          >
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-xl py-4 -mt-4 -mx-8 px-8 border-b border-white/5 z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Content Manager
                    {processingImage && <Loader2 className="animate-spin w-4 h-4 text-gray-400" />}
                </h2>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={logout}
                        className="p-2 rounded-full hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                    <button 
                        onClick={toggleAdmin}
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
              </div>

              {!supabase && (
                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex gap-3">
                    <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                    <div className="text-xs text-red-200/80">
                        <strong className="text-red-500 block mb-1">Database Disconnected</strong>
                        You are in preview mode. Updates will not save. Add .env file to connect to Supabase.
                    </div>
                 </div>
              )}

              {/* Alert for Error 153 */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3">
                <AlertCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                <div className="text-xs text-yellow-200/80">
                    <strong className="text-yellow-500 block mb-1">Seeing "Error 153"?</strong>
                    Use videos that allow embedding (no movie trailers or restricted music videos).
                </div>
              </div>

               {/* In Production Section */}
               <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400">In Production</h3>
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

              <div className="pt-4 pb-12 space-y-3">
                {saveError && <p className="text-red-400 text-xs text-center">{saveError}</p>}
                
                <MagneticButton variant="primary" className="w-full" onClick={handleSave}>
                    {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                    <span>{isSaving ? 'Saving to Cloud...' : 'Save Changes'}</span>
                </MagneticButton>

                <button 
                    onClick={seedDatabase}
                    className="w-full py-3 flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-white transition-colors border border-white/5 rounded-full hover:bg-white/5"
                >
                    <Database size={12} />
                    <span>Populate Default Data (Seed DB)</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};