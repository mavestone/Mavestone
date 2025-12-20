
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LATEST_VIDEO, SHORTS, FILMS, IN_PRODUCTION, PROJECT_PAGE_CONFIG } from '../constants';
import { Film, Short, LatestVideoData, InProductionData, Message, ProjectHeroConfig, SyncSettings } from '../types';

interface ContentContextType {
  latestVideo: LatestVideoData;
  inProduction: InProductionData;
  shorts: Short[];
  films: Film[];
  messages: Message[];
  projectConfig: ProjectHeroConfig;
  syncSettings: SyncSettings;
  isAdminOpen: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  toggleAdmin: () => void;
  openAdmin: () => void;
  closeAdmin: () => void;
  updateLatestVideo: (data: Partial<LatestVideoData>) => void;
  updateInProduction: (data: Partial<InProductionData>) => void;
  updateShort: (id: string, data: Partial<Short>) => void;
  addShort: () => void;
  bulkAddShorts: (newShorts: Short[]) => void;
  deleteShort: (id: string) => void;
  updateFilm: (id: string, data: Partial<Film>) => void;
  addFilm: () => void;
  deleteFilm: (id: string) => void;
  updateProjectConfig: (data: Partial<ProjectHeroConfig>) => void;
  updateSyncSettings: (data: Partial<SyncSettings>) => void;
  saveChanges: () => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  seedDatabase: () => Promise<void>;
  sendMessage: (name: string, email: string, message: string) => Promise<{ success: boolean; error?: any }>;
  fetchMessages: () => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  syncFromYouTube: () => Promise<void>;
  syncShortsFromYouTube: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Content State
  const [latestVideo, setLatestVideo] = useState<LatestVideoData>(LATEST_VIDEO);
  const [inProduction, setInProduction] = useState<InProductionData>(IN_PRODUCTION);
  const [shorts, setShorts] = useState<Short[]>(SHORTS);
  const [films, setFilms] = useState<Film[]>(FILMS);
  const [projectConfig, setProjectConfig] = useState<ProjectHeroConfig>(PROJECT_PAGE_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    youtubeChannelId: 'UCf_CST5v2V7eJ6XqS9T5A-A',
    youtubeApiKey: 'AIzaSyAVGpCJjg9ZVy_rfFE8zk9CM4DPziWt_VM', // Hardcoded as per user request
  });

  useEffect(() => {
    const init = async () => {
      const client = supabase;
      if (!client) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await client.auth.getSession();
        setIsAuthenticated(!!session);

        const { data, error } = await client.from('site_content').select('*');
        if (!error && data) {
          data.forEach(row => {
            if (row.key === 'latest_video') setLatestVideo(row.data);
            if (row.key === 'in_production') setInProduction(row.data);
            if (row.key === 'shorts') setShorts(row.data);
            if (row.key === 'films') setFilms(row.data);
            if (row.key === 'project_config') setProjectConfig(row.data);
            if (row.key === 'sync_settings') setSyncSettings(row.data);
          });
        }
      } catch (e) {
        console.error("Error initializing content:", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    const client = supabase;
    const { data: { subscription } } = client ? client.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
    }) : { data: { subscription: null } };

    return () => {
        subscription?.unsubscribe();
    };
  }, []);

  const toggleAdmin = () => setIsAdminOpen(prev => !prev);
  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const updateLatestVideo = (data: Partial<LatestVideoData>) => setLatestVideo(prev => ({ ...prev, ...data }));
  const updateInProduction = (data: Partial<InProductionData>) => setInProduction(prev => ({ ...prev, ...data }));
  const updateShort = (id: string, data: Partial<Short>) => setShorts(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  const updateFilm = (id: string, data: Partial<Film>) => setFilms(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  const updateProjectConfig = (data: Partial<ProjectHeroConfig>) => setProjectConfig(prev => ({ ...prev, ...data }));
  const updateSyncSettings = (data: Partial<SyncSettings>) => setSyncSettings(prev => ({ ...prev, ...data }));

  const addShort = () => {
    setShorts(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Story",
      views: "0",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      videoId: "",
      showViews: true,
      category: "Reel",
      externalSource: 'manual'
    }]);
  };

  const bulkAddShorts = (newShorts: Short[]) => {
    setShorts(prev => [...prev, ...newShorts]);
  };

  const deleteShort = (id: string) => setShorts(prev => prev.filter(item => item.id !== id));

  const addFilm = () => {
    setFilms(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Project",
      category: "Film",
      tagline: "Tagline",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      videoId: "",
      location: "Location",
      filmType: "Feature",
      genres: "Documentary",
      year: "2024"
    }]);
  };

  const deleteFilm = (id: string) => setFilms(prev => prev.filter(item => item.id !== id));

  const saveChanges = async () => {
    const client = supabase;
    if (!client || !isAuthenticated) return;
    const updates = [
      { key: 'latest_video', data: latestVideo },
      { key: 'in_production', data: inProduction },
      { key: 'shorts', data: shorts },
      { key: 'films', data: films },
      { key: 'project_config', data: projectConfig },
      { key: 'sync_settings', data: syncSettings }
    ];
    const { error } = await client.from('site_content').upsert(updates);
    if (error) throw error;
  };

  const syncFromYouTube = async () => {
    if (!syncSettings.youtubeApiKey || !syncSettings.youtubeChannelId) {
      throw new Error("Missing YouTube API Key or Channel ID in Settings.");
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?key=${syncSettings.youtubeApiKey}&channelId=${syncSettings.youtubeChannelId}&part=snippet,id&order=date&maxResults=1&type=video`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      setLatestVideo({
        title: item.snippet.title,
        description: item.snippet.description,
        image: item.snippet.thumbnails.high.url,
        videoId: item.id.videoId
      });
    } else {
      throw new Error("No videos found on this channel.");
    }
  };

  const syncShortsFromYouTube = async () => {
    if (!syncSettings.youtubeApiKey || !syncSettings.youtubeChannelId) {
        throw new Error("Missing YouTube API Key or Channel ID in Settings.");
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?key=${syncSettings.youtubeApiKey}&channelId=${syncSettings.youtubeChannelId}&part=snippet,id&order=date&maxResults=10&type=video`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.items) {
      const newShorts: Short[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        views: "Synced",
        image: item.snippet.thumbnails.high.url,
        videoId: item.id.videoId,
        showViews: false,
        category: "Shorts",
        externalSource: 'youtube'
      }));
      setShorts(newShorts);
    }
  };

  const uploadImage = async (file: File) => {
    const client = supabase;
    if (!client) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error: uploadError } = await client.storage.from('media').upload(fileName, file);
    if (uploadError) return null;
    const { data } = client.storage.from('media').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const login = (email: string, pass: string) => {
    const client = supabase;
    if (!client) return Promise.resolve({ error: { message: "Supabase not connected" } });
    return client.auth.signInWithPassword({ email, password: pass });
  };

  const logout = async () => { 
    const client = supabase;
    if(client) await client.auth.signOut(); 
    setIsAdminOpen(false); 
    setIsAuthenticated(false); 
  };
  
  const sendMessage = async (name: string, email: string, message: string) => {
    const client = supabase;
    if (!client) return { success: false };
    const { error } = await client.from('messages').insert([{ name, email, message }]);
    return { success: !error, error };
  };

  const fetchMessages = async () => {
    const client = supabase;
    if (!client) return;
    const { data } = await client.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const markMessageRead = async (id: string) => {
    const client = supabase;
    if (!client) return;
    await client.from('messages').update({ read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const seedDatabase = async () => {
    const client = supabase;
    if (!client) return;
    const updates = [
      { key: 'latest_video', data: LATEST_VIDEO },
      { key: 'in_production', data: IN_PRODUCTION },
      { key: 'shorts', data: SHORTS },
      { key: 'films', data: FILMS },
      { key: 'project_config', data: PROJECT_PAGE_CONFIG },
      { key: 'sync_settings', data: { youtubeChannelId: 'UCf_CST5v2V7eJ6XqS9T5A-A', youtubeApiKey: 'AIzaSyAVGpCJjg9ZVy_rfFE8zk9CM4DPziWt_VM' } }
    ];
    await client.from('site_content').upsert(updates);
    window.location.reload();
  };

  return (
    <ContentContext.Provider value={{
      latestVideo, inProduction, shorts, films, messages, projectConfig, syncSettings,
      isAdminOpen, isAuthenticated, isLoading,
      toggleAdmin, openAdmin, closeAdmin,
      updateLatestVideo, updateInProduction, updateShort, addShort, bulkAddShorts, deleteShort,
      updateFilm, addFilm, deleteFilm, updateProjectConfig, updateSyncSettings,
      saveChanges, uploadImage, login, logout, seedDatabase,
      sendMessage, fetchMessages, markMessageRead, syncFromYouTube, syncShortsFromYouTube, syncFromInstagram: async () => {}
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
