
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LATEST_VIDEO, SHORTS, FILMS, IN_PRODUCTION, PROJECT_PAGE_CONFIG } from '../constants';
import { Film, Short, LatestVideoData, InProductionData, Message, ProjectHeroConfig } from '../types';

interface ContentContextType {
  latestVideo: LatestVideoData;
  inProduction: InProductionData;
  shorts: Short[];
  films: Film[];
  messages: Message[];
  projectConfig: ProjectHeroConfig;
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
  deleteShort: (id: string) => void;
  updateFilm: (id: string, data: Partial<Film>) => void;
  addFilm: () => void;
  deleteFilm: (id: string) => void;
  updateProjectConfig: (data: Partial<ProjectHeroConfig>) => void;
  saveChanges: () => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  seedDatabase: () => Promise<void>;
  sendMessage: (name: string, email: string, message: string) => Promise<{ success: boolean; error?: any }>;
  fetchMessages: () => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
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

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        console.warn("Supabase client not initialized. Using static content.");
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (!authError && session) {
            setIsAuthenticated(!!session);
        }

        const { data, error } = await supabase.from('site_content').select('*');
        
        if (!error && data && data.length > 0) {
          data.forEach(row => {
            if (row.key === 'latest_video') setLatestVideo(row.data);
            if (row.key === 'in_production') setInProduction(row.data);
            if (row.key === 'shorts') setShorts(row.data);
            if (row.key === 'films') setFilms(row.data);
            if (row.key === 'project_config') setProjectConfig(row.data);
          });
        }
      } catch (e) {
        console.error("Error initializing content:", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    let subscription: any = null;
    if (supabase) {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });
        subscription = data.subscription;
    }

    return () => {
        if (subscription) subscription.unsubscribe();
    };
  }, []);

  const toggleAdmin = () => setIsAdminOpen(prev => !prev);
  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const updateLatestVideo = (data: Partial<LatestVideoData>) => {
    setLatestVideo(prev => ({ ...prev, ...data }));
  };

  const updateInProduction = (data: Partial<InProductionData>) => {
    setInProduction(prev => ({ ...prev, ...data }));
  };

  const updateShort = (id: string, data: Partial<Short>) => {
    setShorts(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const addShort = () => {
    const newShort: Short = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Short Film",
      views: "0",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop",
      videoId: "",
      showViews: true,
      category: "Short"
    };
    setShorts(prev => [...prev, newShort]);
  };

  const deleteShort = (id: string) => {
    setShorts(prev => prev.filter(item => item.id !== id));
  };

  const updateFilm = (id: string, data: Partial<Film>) => {
    setFilms(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const addFilm = () => {
    const newFilm: Film = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Project",
      category: "Film",
      tagline: "New tagline",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop",
      videoId: "",
      description: "Description goes here...",
      location: "Location",
      year: new Date().getFullYear().toString(),
      filmType: "Feature",
      genres: "Genre",
      duration: "0m"
    };
    setFilms(prev => [...prev, newFilm]);
  };

  const deleteFilm = (id: string) => {
    setFilms(prev => prev.filter(item => item.id !== id));
  };

  const updateProjectConfig = (data: Partial<ProjectHeroConfig>) => {
    setProjectConfig(prev => ({ ...prev, ...data }));
  };

  const saveChanges = async () => {
    if (!supabase) {
        alert("Cannot save: Supabase not connected.");
        return;
    }
    if (!isAuthenticated) return;
    
    const updates = [
      { key: 'latest_video', data: latestVideo },
      { key: 'in_production', data: inProduction },
      { key: 'shorts', data: shorts },
      { key: 'films', data: films },
      { key: 'project_config', data: projectConfig }
    ];

    const { error } = await supabase.from('site_content').upsert(updates);
    
    if (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!supabase || !isAuthenticated) return null;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

        if (uploadError) return null;

        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (e) {
        return null;
    }
  };

  const login = async (email: string, pass: string) => {
    if (!supabase) return { error: { message: "Supabase not configured" } };
    return await supabase.auth.signInWithPassword({ email, password: pass });
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setIsAdminOpen(false);
    setIsAuthenticated(false);
  };

  const seedDatabase = async () => {
      if (!supabase) {
          alert("Supabase not connected.");
          return;
      }
      const updates = [
        { key: 'latest_video', data: LATEST_VIDEO },
        { key: 'in_production', data: IN_PRODUCTION },
        { key: 'shorts', data: SHORTS },
        { key: 'films', data: FILMS },
        { key: 'project_config', data: PROJECT_PAGE_CONFIG }
      ];
      await supabase.from('site_content').upsert(updates);
      window.location.reload();
  };

  const sendMessage = async (name: string, email: string, message: string) => {
    if (!supabase) return { success: false, error: 'Database not connected' };
    try {
        const { error } = await supabase.from('messages').insert([{ name, email, message }]);
        if (error) throw error;
        return { success: true };
    } catch (e) {
        return { success: false, error: e };
    }
  };

  const fetchMessages = async () => {
      if (!supabase || !isAuthenticated) return;
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!error && data) setMessages(data);
  };

  const markMessageRead = async (id: string) => {
      if (!supabase || !isAuthenticated) return;
      const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
      if (!error) setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  return (
    <ContentContext.Provider value={{
      latestVideo, inProduction, shorts, films, messages, projectConfig,
      isAdminOpen, isAuthenticated, isLoading,
      toggleAdmin, openAdmin, closeAdmin,
      updateLatestVideo, updateInProduction, updateShort, addShort, deleteShort,
      updateFilm, addFilm, deleteFilm, updateProjectConfig,
      saveChanges, uploadImage, login, logout, seedDatabase,
      sendMessage, fetchMessages, markMessageRead
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
