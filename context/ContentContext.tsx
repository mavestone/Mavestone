
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LATEST_VIDEO, SHORTS, FILMS, CLIENT_WORK, IN_PRODUCTION, PROJECT_PAGE_CONFIG, TESTIMONIALS, LIAM_PORTRAIT } from '../constants';
import { Film, Short, LatestVideoData, InProductionData, Message, ProjectHeroConfig, AboutData, Testimonial } from '../types';

interface ContentContextType {
  latestVideo: LatestVideoData;
  inProduction: InProductionData;
  shorts: Short[];
  films: Film[];
  clientWork: Film[];
  aboutData: AboutData;
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
  updateAboutData: (data: Partial<AboutData>) => void;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;
  addTestimonial: () => void;
  deleteTestimonial: (id: string) => void;
  updateShort: (id: string, data: Partial<Short>) => void;
  setShorts: (shorts: Short[]) => void;
  addShort: () => void;
  bulkAddShorts: (newShorts: Short[]) => void;
  deleteShort: (id: string) => void;
  updateFilm: (id: string, data: Partial<Film>) => void;
  addFilm: () => void;
  deleteFilm: (id: string) => void;
  updateClientWork: (id: string, data: Partial<Film>) => void;
  addClientWork: () => void;
  deleteClientWork: (id: string) => void;
  updateProjectConfig: (data: Partial<ProjectHeroConfig>) => void;
  saveChanges: () => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  seedDatabase: () => Promise<void>;
  sendMessage: (data: { name: string; email: string; message: string; phone?: string; company?: string; source?: string }) => Promise<{ success: boolean; error?: any }>;
  fetchMessages: () => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  updateMessage: (id: string, data: Partial<Message>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const DEFAULT_ABOUT: AboutData = {
    title: "Visualizing The Unseen.",
    subtitle: "01 / The Visionary",
    description: "Liam blends editorial aesthetic with cinematic narrative. Based in Sydney & Tokyo, Mavestone Studio partners with creators who demand more than just visuals—they demand a legacy.",
    portrait: LIAM_PORTRAIT,
    testimonials: TESTIMONIALS,
    testimonialsBackground: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Content State
  const [latestVideo, setLatestVideo] = useState<LatestVideoData>(LATEST_VIDEO);
  const [inProduction, setInProduction] = useState<InProductionData>(IN_PRODUCTION);
  const [shorts, setShorts] = useState<Short[]>(SHORTS);
  const [films, setFilms] = useState<Film[]>(FILMS);
  const [clientWork, setClientWork] = useState<Film[]>(CLIENT_WORK);
  const [aboutData, setAboutData] = useState<AboutData>(DEFAULT_ABOUT);
  const [projectConfig, setProjectConfig] = useState<ProjectHeroConfig>(PROJECT_PAGE_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);

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
            if (row.key === 'client_work') setClientWork(row.data);
            if (row.key === 'project_config') setProjectConfig(row.data);
            if (row.key === 'about_data') setAboutData(row.data);
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
  const updateAboutData = (data: Partial<AboutData>) => setAboutData(prev => ({ ...prev, ...data }));
  const updateTestimonial = (id: string, data: Partial<Testimonial>) => setAboutData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...data } : t)
  }));
  const addTestimonial = () => setAboutData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, {
          id: Math.random().toString(36).substr(2, 9),
          name: "New Client",
          company: "Company",
          text: "Review text here...",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
      }]
  }));
  const deleteTestimonial = (id: string) => setAboutData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
  }));

  const updateShort = (id: string, data: Partial<Short>) => setShorts(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  const updateFilm = (id: string, data: Partial<Film>) => setFilms(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  const updateClientWork = (id: string, data: Partial<Film>) => setClientWork(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  const updateProjectConfig = (data: Partial<ProjectHeroConfig>) => setProjectConfig(prev => ({ ...prev, ...data }));

  const addShort = () => {
    setShorts(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Story",
      views: "0",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      videoId: "",
      showViews: true,
      category: "Short"
    }]);
  };

  const bulkAddShorts = (newShorts: Short[]) => setShorts(prev => [...prev, ...newShorts]);
  const deleteShort = (id: string) => setShorts(prev => prev.filter(item => item.id !== id));

  const addFilm = () => {
    setFilms(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Project",
      category: "Film",
      tagline: "Tagline",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      videoId: "",
      location: "Studio",
      filmType: "Feature",
      year: "2024",
      genres: "Documentary",
      duration: "10m"
    }]);
  };
  const deleteFilm = (id: string) => setFilms(prev => prev.filter(item => item.id !== id));

  const addClientWork = () => {
    setClientWork(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Client Work",
      category: "Commercial",
      tagline: "Tagline",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      videoId: "",
      location: "Location",
      filmType: "Commercial",
      year: "2024",
      genres: "Brand",
      duration: "60s"
    }]);
  };
  const deleteClientWork = (id: string) => setClientWork(prev => prev.filter(item => item.id !== id));

  const saveChanges = async () => {
    const client = supabase;
    if (!client || !isAuthenticated) return;
    const updates = [
      { key: 'latest_video', data: latestVideo },
      { key: 'in_production', data: inProduction },
      { key: 'shorts', data: shorts },
      { key: 'films', data: films },
      { key: 'client_work', data: clientWork },
      { key: 'project_config', data: projectConfig },
      { key: 'about_data', data: aboutData }
    ];
    const { error } = await client.from('site_content').upsert(updates);
    if (error) throw error;
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
  


  const sendMessage = async (data: { name: string; email: string; message: string; phone?: string; company?: string; source?: string }) => {
    const client = supabase;
    if (!client) return { success: false };
    const { error } = await client.from('messages').insert([{ ...data, status: 'new', priority: 'medium' }]);
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
    await client.from('messages').update({ read: true, status: 'contacted' }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true, status: 'contacted' } : m));
  };

  const updateMessage = async (id: string, data: Partial<Message>) => {
    const client = supabase;
    if (!client) return;
    
    // Update local state immediately for responsiveness
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    
    // Then update DB
    await client.from('messages').update(data).eq('id', id);
  };

  const deleteMessage = async (id: string) => {
    const client = supabase;
    if (!client) return;
    const { error } = await client.from('messages').delete().eq('id', id);
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  const seedDatabase = async () => {
    const client = supabase;
    if (!client) return;
    const updates = [
      { key: 'latest_video', data: LATEST_VIDEO },
      { key: 'in_production', data: IN_PRODUCTION },
      { key: 'shorts', data: SHORTS },
      { key: 'films', data: FILMS },
      { key: 'client_work', data: CLIENT_WORK },
      { key: 'project_config', data: PROJECT_PAGE_CONFIG },
      { key: 'about_data', data: DEFAULT_ABOUT }
    ];
    await client.from('site_content').upsert(updates);
    window.location.reload();
  };

  return (
    <ContentContext.Provider value={{
      latestVideo, inProduction, shorts, films, clientWork, aboutData, messages, projectConfig,
      isAdminOpen, isAuthenticated, isLoading,
      toggleAdmin, openAdmin, closeAdmin,
      updateLatestVideo, updateInProduction, updateAboutData, updateTestimonial, addTestimonial, deleteTestimonial,
      updateShort, setShorts, addShort, bulkAddShorts, deleteShort,
      updateFilm, addFilm, deleteFilm, updateClientWork, addClientWork, deleteClientWork, updateProjectConfig,
      saveChanges, uploadImage, login, logout, seedDatabase,
      sendMessage, fetchMessages, markMessageRead, updateMessage, deleteMessage
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
