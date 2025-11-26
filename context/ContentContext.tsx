import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LATEST_VIDEO, SHORTS, FILMS } from '../constants';
import { Film, Short, LatestVideoData } from '../types';

interface ContentContextType {
  latestVideo: LatestVideoData;
  shorts: Short[];
  films: Film[];
  isAdminOpen: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  toggleAdmin: () => void;
  openAdmin: () => void;
  updateLatestVideo: (data: Partial<LatestVideoData>) => void;
  updateShort: (id: string, data: Partial<Short>) => void;
  updateFilm: (id: string, data: Partial<Film>) => void;
  saveChanges: () => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  seedDatabase: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Content State - Initialize with defaults so UI is never empty
  const [latestVideo, setLatestVideo] = useState<LatestVideoData>(LATEST_VIDEO);
  const [shorts, setShorts] = useState<Short[]>(SHORTS);
  const [films, setFilms] = useState<Film[]>(FILMS);

  // 1. Check Auth & Fetch Data on Mount
  useEffect(() => {
    const init = async () => {
      // If supabase client failed to initialize, use static content and stop loading
      if (!supabase) {
        console.warn("Supabase client not initialized. Using static content.");
        setIsLoading(false);
        return;
      }

      try {
        // Check active session
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (!authError && session) {
            setIsAuthenticated(!!session);
        }

        // Fetch Content
        const { data, error } = await supabase.from('site_content').select('*');
        
        if (!error && data && data.length > 0) {
          data.forEach(row => {
            if (row.key === 'latest_video') setLatestVideo(row.data);
            if (row.key === 'shorts') setShorts(row.data);
            if (row.key === 'films') setFilms(row.data);
          });
        } else {
             console.log("Using default content (DB empty or fetch error)");
        }
      } catch (e) {
        console.error("Error initializing content:", e);
        // On error, we just keep the default state (LATEST_VIDEO etc)
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Listen for auth changes
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

  // 2. Actions
  const toggleAdmin = () => setIsAdminOpen(prev => !prev);
  const openAdmin = () => setIsAdminOpen(true);

  const updateLatestVideo = (data: Partial<LatestVideoData>) => {
    setLatestVideo(prev => ({ ...prev, ...data }));
  };

  const updateShort = (id: string, data: Partial<Short>) => {
    setShorts(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const updateFilm = (id: string, data: Partial<Film>) => {
    setFilms(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const saveChanges = async () => {
    if (!supabase) {
        alert("Cannot save: Supabase not connected.");
        return;
    }
    if (!isAuthenticated) return;
    
    const updates = [
      { key: 'latest_video', data: latestVideo },
      { key: 'shorts', data: shorts },
      { key: 'films', data: films }
    ];

    const { error } = await supabase.from('site_content').upsert(updates);
    
    if (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!supabase) {
        alert("Cannot upload: Supabase not connected.");
        return null;
    }
    if (!isAuthenticated) return null;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

        if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
        }

        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        return data.publicUrl;
    } catch (e) {
        console.error("Upload exception:", e);
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
        { key: 'shorts', data: SHORTS },
        { key: 'films', data: FILMS }
      ];
      await supabase.from('site_content').upsert(updates);
      window.location.reload();
  };

  return (
    <ContentContext.Provider value={{
      latestVideo,
      shorts,
      films,
      isAdminOpen,
      isAuthenticated,
      isLoading,
      toggleAdmin,
      openAdmin,
      updateLatestVideo,
      updateShort,
      updateFilm,
      saveChanges,
      uploadImage,
      login,
      logout,
      seedDatabase
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