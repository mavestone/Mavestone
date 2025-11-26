
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

  // Content State
  const [latestVideo, setLatestVideo] = useState<LatestVideoData>(LATEST_VIDEO);
  const [shorts, setShorts] = useState<Short[]>(SHORTS);
  const [films, setFilms] = useState<Film[]>(FILMS);

  // 1. Check Auth & Fetch Data on Mount
  useEffect(() => {
    const init = async () => {
      // Check active session
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      // Fetch Content
      try {
        const { data, error } = await supabase.from('site_content').select('*');
        
        if (data && data.length > 0) {
          data.forEach(row => {
            if (row.key === 'latest_video') setLatestVideo(row.data);
            if (row.key === 'shorts') setShorts(row.data);
            if (row.key === 'films') setFilms(row.data);
          });
        } else {
            // Fallback to local storage if DB is empty or connection fails temporarily
            // This ensures site works even if keys are missing in dev
             const savedVideo = localStorage.getItem('mavestone_latest_video');
             const savedShorts = localStorage.getItem('mavestone_shorts');
             const savedFilms = localStorage.getItem('mavestone_films');
             
             if (savedVideo) setLatestVideo(JSON.parse(savedVideo));
             if (savedShorts) setShorts(JSON.parse(savedShorts));
             if (savedFilms) setFilms(JSON.parse(savedFilms));
        }
      } catch (e) {
        console.error("Error fetching content:", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
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
    if (!isAuthenticated) return null;

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
  };

  const login = async (email: string, pass: string) => {
    return await supabase.auth.signInWithPassword({ email, password: pass });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdminOpen(false);
  };

  const seedDatabase = async () => {
      // Emergency function to populate DB with defaults
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