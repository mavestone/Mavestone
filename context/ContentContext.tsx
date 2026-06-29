
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { LATEST_VIDEO, SHORTS, FILMS, CLIENT_WORK, IN_PRODUCTION, PROJECT_PAGE_CONFIG, TESTIMONIALS, LIAM_PORTRAIT, HIRING_DATA } from '../constants';
import { Film, Short, LatestVideoData, InProductionData, Message, ProjectHeroConfig, AboutData, Testimonial, HiringData, ClientPortal } from '../types';

interface ContentContextType {
  latestVideo: LatestVideoData;
  inProduction: InProductionData;
  shorts: Short[];
  films: Film[];
  clientWork: Film[];
  aboutData: AboutData;
  hiringData: HiringData;
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
  updateHiringData: (data: Partial<HiringData>) => void;
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
  uploadImage: (file: File, onProgress?: (progress: number) => void) => Promise<string | null>;
  login: (email: string, pass: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
  seedDatabase: () => Promise<void>;
  sendMessage: (data: { name: string; email: string; message: string; phone?: string; company?: string; source?: string }) => Promise<{ success: boolean; error?: any }>;
  fetchMessages: () => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  updateMessage: (id: string, data: Partial<Message>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  clientPortals: ClientPortal[];
  updateClientPortal: (id: string, data: Partial<ClientPortal>) => void;
  addClientPortal: () => void;
  deleteClientPortal: (id: string) => void;
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
  const [hiringData, setHiringData] = useState<HiringData>(HIRING_DATA);
  const [projectConfig, setProjectConfig] = useState<ProjectHeroConfig>(PROJECT_PAGE_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientPortals, setClientPortals] = useState<ClientPortal[]>([]);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  }, []);

  const markMessageRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true, status: 'contacted' })
        .eq('id', id);
      
      if (error) throw error;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true, status: 'contacted' } : m));
    } catch (e) {
      console.error("Error marking message read:", e);
    }
  }, []);

  const updateMessage = useCallback(async (id: string, updateData: Partial<Message>) => {
    try {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updateData } : m));
      const { error } = await supabase
        .from('messages')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    } catch (e) {
      console.error("Error updating message:", e);
    }
  }, []);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const init = async () => {
      try {
        const env = (import.meta as any).env || {};
        const isConfigured = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY;
        
        if (!isConfigured) {
          console.warn("Supabase not configured - using local constants only. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
          setIsLoading(false);
          return;
        }

        // Check Auth
        const { data: authData } = await supabase.auth.getSession();
        setIsAuthenticated(!!authData.session);

        // Listen for Auth changes
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setIsAuthenticated(!!session);
        });
        subscription = data.subscription;

        // Fetch Site Content
        const { data: contentData, error: contentError } = await supabase
          .from('site_content')
          .select('*');
        
        if (contentError) {
          console.error("Content fetch error:", contentError);
        } else if (contentData && contentData.length > 0) {
          contentData.forEach((item: any) => {
            const key = item.id;
            const content = item.data;
            if (key === 'latest_video') setLatestVideo(content);
            if (key === 'in_production') setInProduction(content);
            if (key === 'shorts') setShorts(content);
            if (key === 'films') setFilms(content);
            if (key === 'client_work') setClientWork(content);
            if (key === 'project_config') setProjectConfig(content);
            if (key === 'about_data') setAboutData(content);
            if (key === 'hiring_data') setHiringData(content);
            if (key === 'client_portals') setClientPortals(content);
          });
        }
        await fetchMessages();
      } catch (e) {
        console.error("Error initializing content:", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [fetchMessages]);

  const toggleAdmin = () => setIsAdminOpen(prev => !prev);
  const openAdmin = () => setIsAdminOpen(true);
  const closeAdmin = () => setIsAdminOpen(false);

  const updateLatestVideo = (data: Partial<LatestVideoData>) => setLatestVideo(prev => ({ ...prev, ...data }));
  const updateInProduction = (data: Partial<InProductionData>) => setInProduction(prev => ({ ...prev, ...data }));
  const updateAboutData = (data: Partial<AboutData>) => setAboutData(prev => ({ ...prev, ...data }));
  const updateHiringData = (data: Partial<HiringData>) => setHiringData(prev => ({ ...prev, ...data }));
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
  
  const updateClientPortal = (id: string, data: Partial<ClientPortal>) => {
    setClientPortals(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const addClientPortal = () => {
    setClientPortals(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      clientName: "New Client",
      slug: "new-client",
      projectTitle: "Cinematic Film",
      deliveryDate: "June 2026",
      message: "It was a privilege to document your day. These films are yours to keep forever.",
      passcode: "mavestone2026",
      videos: [
        {
          title: "Feature Film",
          duration: "10:00",
          vimeoId: "123456789"
        }
      ],
      downloadLink: ""
    }]);
  };

  const deleteClientPortal = (id: string) => {
    setClientPortals(prev => prev.filter(item => item.id !== id));
  };

  const saveChanges = async () => {
    if (!isAuthenticated) return;
    
    return new Promise<void>(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.error("Save timed out after 20 seconds");
        reject(new Error("Save operation timed out. Please check your connection."));
      }, 20000);

      try {
        const updates = [
          { id: 'latest_video', data: latestVideo },
          { id: 'in_production', data: inProduction },
          { id: 'shorts', data: shorts },
          { id: 'films', data: films },
          { id: 'client_work', data: clientWork },
          { id: 'project_config', data: projectConfig },
          { id: 'about_data', data: aboutData },
          { id: 'hiring_data', data: hiringData },
          { id: 'client_portals', data: clientPortals }
        ];

        const { error } = await supabase
          .from('site_content')
          .upsert(updates, { onConflict: 'id' });
        
        if (error) throw error;

        clearTimeout(timeoutId);
        resolve();
      } catch (e) {
        clearTimeout(timeoutId);
        console.error("Save error:", e);
        reject(e);
      }
    });
  };

  const uploadImage = async (file: File, onProgress?: (progress: number) => void) => {
    console.log("Starting upload for file:", file.name, "Size:", file.size);
    if (onProgress) onProgress(0);
    
    return new Promise<string | null>(async (resolve) => {
      const timeoutId = setTimeout(() => {
        console.error("Upload timed out after 90 seconds");
        alert("Upload timed out. This could be due to a large file, slow connection, or Storage configuration.");
        resolve(null);
      }, 90000);

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        const { error } = await supabase.storage
          .from('medias') // Ensure you have a bucket named 'medias' or change it here
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('medias')
          .getPublicUrl(filePath);

        console.log("Download URL obtained:", publicUrl);
        
        clearTimeout(timeoutId);
        resolve(publicUrl);
      } catch (e: any) {
        clearTimeout(timeoutId);
        console.error("Upload exception:", e);
        alert(`Upload error: ${e.message || 'Unknown error occurred'}`);
        resolve(null);
      }
    });
  };

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      return { error };
    } catch (error) {
      console.error("Google Login Error:", error);
      return { error };
    }
  };

  const logout = async () => { 
    await supabase.auth.signOut();
    setIsAdminOpen(false); 
  };
  
  const sendMessage = async (messageData: { name: string; email: string; message: string; phone?: string; company?: string; source?: string }) => {
    console.log("Attempting to send message:", messageData);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          ...messageData,
          status: 'new',
          priority: 'medium',
          lead_type: 'warm',
          created_at: new Date().toISOString(),
          read: false
        });
      
      if (error) throw error;
      
      fetchMessages();
      return { success: true };
    } catch (error) {
      console.error("Supabase insert message error:", error);
      return { success: false, error };
    }
  };

  const deleteMessage = useCallback(async (id: string) => {
    console.log("Attempting to delete message with ID:", id);
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      console.log("Successfully deleted message:", id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (e: any) {
      console.error("Delete exception:", e);
      alert(`An error occurred while deleting: ${e.message}`);
    }
  }, []);

  const seedDatabase = async () => {
    try {
      const updates = [
        { id: 'latest_video', data: LATEST_VIDEO },
        { id: 'in_production', data: IN_PRODUCTION },
        { id: 'shorts', data: SHORTS },
        { id: 'films', data: FILMS },
        { id: 'client_work', data: CLIENT_WORK },
        { id: 'project_config', data: PROJECT_PAGE_CONFIG },
        { id: 'about_data', data: DEFAULT_ABOUT },
        { id: 'hiring_data', data: HIRING_DATA },
        { id: 'client_portals', data: [
          {
            id: "brandon-tia-default",
            clientName: "Brandon & Tia",
            slug: "brandon-tia",
            projectTitle: "Wedding Film",
            deliveryDate: "June 2026",
            message: "It was a privilege to document your day. These films are yours to keep forever.",
            passcode: "armgard2026",
            videos: [
              {
                title: "Feature Film",
                duration: "12:47",
                vimeoId: "123456789"
              },
              {
                title: "Highlight Reel",
                duration: "3:22",
                vimeoId: "987654321"
              }
            ],
            downloadLink: "https://drive.google.com/drive/folders/your-folder-id"
          }
        ] }
      ];

      await supabase.from('site_content').upsert(updates, { onConflict: 'id' });
      
      const mockMessages = [
        { name: 'John Doe', email: 'john@example.com', message: 'Interested in a cinematic product launch video.', status: 'new', created_at: new Date().toISOString(), read: false },
        { name: 'Sarah Smith', email: 'sarah@example.com', message: 'Looking for a documentary style shoot in Sydney.', status: 'contacted', created_at: new Date().toISOString(), read: true }
      ];

      await supabase.from('messages').insert(mockMessages);

      window.location.reload();
    } catch (e) {
      console.error("Error seeding database:", e);
      alert("Error seeding database. Check console.");
    }
  };

  const contextValue = useMemo(() => ({
    latestVideo, inProduction, shorts, films, clientWork, aboutData, hiringData, messages, projectConfig,
    isAdminOpen, isAuthenticated, isLoading,
    toggleAdmin, openAdmin, closeAdmin,
    updateLatestVideo, updateInProduction, updateAboutData, updateHiringData, updateTestimonial, addTestimonial, deleteTestimonial,
    updateShort, setShorts, addShort, bulkAddShorts, deleteShort,
    updateFilm, addFilm, deleteFilm, updateClientWork, addClientWork, deleteClientWork, updateProjectConfig,
    saveChanges, uploadImage, login, loginWithGoogle, logout, seedDatabase,
    sendMessage, fetchMessages, markMessageRead, updateMessage, deleteMessage,
    clientPortals, updateClientPortal, addClientPortal, deleteClientPortal
  }), [
    latestVideo, inProduction, shorts, films, clientWork, aboutData, hiringData, messages, projectConfig,
    isAdminOpen, isAuthenticated, isLoading,
    toggleAdmin, openAdmin, closeAdmin,
    updateLatestVideo, updateInProduction, updateAboutData, updateHiringData, updateTestimonial, addTestimonial, deleteTestimonial,
    updateShort, setShorts, addShort, bulkAddShorts, deleteShort,
    updateFilm, addFilm, deleteFilm, updateClientWork, addClientWork, deleteClientWork, updateProjectConfig,
    saveChanges, uploadImage, login, loginWithGoogle, logout, seedDatabase,
    sendMessage, fetchMessages, markMessageRead, updateMessage, deleteMessage,
    clientPortals, updateClientPortal, addClientPortal, deleteClientPortal
  ]);

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
