
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { LATEST_VIDEO, SHORTS, FILMS, CLIENT_WORK, IN_PRODUCTION, PROJECT_PAGE_CONFIG, TESTIMONIALS, LIAM_PORTRAIT } from '../constants';
import { Film, Short, LatestVideoData, InProductionData, Message, ProjectHeroConfig, AboutData, Testimonial, OutboundCall, OutboundEmail, AutomationEmail, Newsletter, GmailConfig, MailingList } from '../types';

interface ContentContextType {
  latestVideo: LatestVideoData;
  inProduction: InProductionData;
  shorts: Short[];
  films: Film[];
  clientWork: Film[];
  aboutData: AboutData;
  messages: Message[];
  outboundCalls: OutboundCall[];
  outboundEmails: OutboundEmail[];
  automations: AutomationEmail[];
  newsletters: Newsletter[];
  mailingLists: MailingList[];
  gmailConfig: GmailConfig;
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
  updateAutomation: (id: string, data: Partial<AutomationEmail>) => void;
  addAutomation: () => void;
  deleteAutomation: (id: string) => void;
  updateNewsletter: (id: string, data: Partial<Newsletter>) => void;
  addNewsletter: () => void;
  deleteNewsletter: (id: string) => void;
  addMailingList: (name: string, contacts?: { name: string; email: string }[]) => void;
  updateMailingList: (id: string, data: Partial<MailingList>) => void;
  deleteMailingList: (id: string) => void;
  addContactToList: (listId: string, contact: { name: string; email: string }) => void;
  deleteContactFromList: (listId: string, email: string) => void;
  addOutboundEmail: (email: OutboundEmail) => void;
  connectGmail: () => Promise<void>;
  disconnectGmail: () => void;
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
  sendNewsletter: (newsletterId: string, listId?: string) => Promise<{ success: boolean; count: number; error?: string }>;
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
  const [outboundCalls, setOutboundCalls] = useState<OutboundCall[]>([]);
  const [outboundEmails, setOutboundEmails] = useState<OutboundEmail[]>([]);

  const fetchOutboundData = useCallback(async () => {
    const client = supabase;
    if (!client) return;
    
    const { data: emails } = await client.from('outbound_emails').select('*').order('created_at', { ascending: false });
    if (emails) {
      setOutboundEmails(emails.map(e => ({
        id: e.id,
        leadId: e.lead_id,
        leadName: e.lead_name,
        subject: e.subject,
        timestamp: e.created_at,
        status: e.status,
        type: e.type,
        threadId: e.thread_id,
        thread: e.thread
      })));
    }

    const { data: calls } = await client.from('outbound_calls').select('*').order('created_at', { ascending: false });
    if (calls) {
      setOutboundCalls(calls.map(c => ({
        id: c.id,
        leadId: c.lead_id,
        leadName: c.lead_name,
        timestamp: c.timestamp,
        duration: c.duration,
        status: c.status,
        transcript: c.transcript
      })));
    }
  }, []);
  const [automations, setAutomations] = useState<AutomationEmail[]>([
    { id: '1', name: 'Welcome Email', subject: 'Welcome to Mavestone Studio', content: 'Hi {{name}}, thanks for reaching out!', isActive: true, trigger: 'new_lead' }
  ]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [mailingLists, setMailingLists] = useState<MailingList[]>([
    { id: 'all-crm', name: 'All CRM Leads', contacts: [] }
  ]);
  const [gmailConfig, setGmailConfig] = useState<GmailConfig>({ isConnected: false });

  // Sync All CRM Leads list
  useEffect(() => {
    setMailingLists(prev => prev.map(list => 
      list.id === 'all-crm' 
        ? { ...list, contacts: messages.map(m => ({ name: m.name, email: m.email })) }
        : list
    ));
  }, [messages]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GMAIL_AUTH_SUCCESS') {
        if (event.data.tokens) {
          localStorage.setItem('gmail_tokens', JSON.stringify(event.data.tokens));
        }
        setGmailConfig({ isConnected: true, email: event.data.email });
      }
    };
    window.addEventListener('message', handleOAuthMessage);

    // Check initial status
    const tokens = localStorage.getItem('gmail_tokens');
    fetch('/api/gmail/status', { 
      credentials: 'include',
      headers: tokens ? { 'x-gmail-tokens': tokens } : {}
    })
      .then(res => res.json())
      .then(data => {
        if (data.isConnected) {
          setGmailConfig(prev => ({ ...prev, isConnected: true }));
        }
      });

    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

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
            if (row.key === 'automations') setAutomations(row.data);
            if (row.key === 'newsletters') setNewsletters(row.data);
            if (row.key === 'gmail_config') setGmailConfig(row.data);
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

  const updateAutomation = (id: string, data: Partial<AutomationEmail>) => setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const addAutomation = () => setAutomations(prev => [...prev, {
    id: Math.random().toString(36).substr(2, 9),
    name: "New Workflow",
    subject: "Subject Line",
    content: "Email Content",
    isActive: false,
    trigger: 'new_lead',
    delayDays: 0
  }]);
  const deleteAutomation = (id: string) => setAutomations(prev => prev.filter(a => a.id !== id));
  const updateNewsletter = (id: string, data: Partial<Newsletter>) => setNewsletters(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  const addNewsletter = () => setNewsletters(prev => [...prev, {
    id: Math.random().toString(36).substr(2, 9),
    title: 'New Newsletter',
    subject: 'Monthly Update',
    content: '<h1>Hello!</h1><p>Check out our latest work.</p>',
    status: 'draft',
    images: []
  }]);
  const deleteNewsletter = (id: string) => setNewsletters(prev => prev.filter(n => n.id !== id));

  const addMailingList = (name: string, contacts: { name: string; email: string }[] = []) => {
    setMailingLists(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      name,
      contacts
    }]);
  };

  const updateMailingList = (id: string, data: Partial<MailingList>) => {
    setMailingLists(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteMailingList = (id: string) => {
    if (id === 'all-crm') return; // Don't delete the default list
    setMailingLists(prev => prev.filter(l => l.id !== id));
  };

  const addContactToList = (listId: string, contact: { name: string; email: string }) => {
    setMailingLists(prev => prev.map(list => {
      if (list.id === listId) {
        if (list.contacts.some(c => c.email === contact.email)) return list;
        return { ...list, contacts: [...list.contacts, contact] };
      }
      return list;
    }));
  };

  const deleteContactFromList = (listId: string, email: string) => {
    setMailingLists(prev => prev.map(list => {
      if (list.id === listId) {
        return { ...list, contacts: list.contacts.filter(c => c.email !== email) };
      }
      return list;
    }));
  };

  const addOutboundEmail = async (email: OutboundEmail) => {
    const client = supabase;
    if (!client) {
      setOutboundEmails(prev => [email, ...prev]);
      return;
    }

    const { data, error } = await client.from('outbound_emails').insert([{
      lead_id: email.leadId,
      lead_name: email.leadName,
      subject: email.subject,
      status: email.status,
      type: email.type,
      thread_id: email.threadId,
      thread: email.thread
    }]).select();

    if (!error && data?.[0]) {
      const saved = {
        ...email,
        id: data[0].id,
        timestamp: data[0].created_at
      };
      setOutboundEmails(prev => [saved, ...prev]);
    } else {
      console.error("Failed to save outbound email:", error);
      setOutboundEmails(prev => [email, ...prev]);
    }
  };

  const sendNewsletter = async (newsletterId: string, listId?: string) => {
    const newsletter = newsletters.find(n => n.id === newsletterId);
    if (!newsletter || !gmailConfig.isConnected) return { success: false, count: 0 };

    const targetListId = listId || newsletter.targetListId;
    const list = mailingLists.find(l => l.id === targetListId);
    if (!list) return { success: false, count: 0 };

    let successCount = 0;
    let lastError = '';
    for (const contact of list.contacts) {
      try {
        const tokens = localStorage.getItem('gmail_tokens');
        const response = await fetch('/api/gmail/send', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(tokens ? { 'x-gmail-tokens': tokens } : {})
          },
          credentials: 'include',
          body: JSON.stringify({
            to: contact.email,
            subject: newsletter.subject,
            content: newsletter.content.replace('{{name}}', contact.name)
          })
        });
        if (response.ok) {
          const { threadId } = await response.json();
          successCount++;
          
          // Try to find matching lead in CRM to get UUID
          const matchingLead = messages.find(m => m.email === contact.email);
          
          addOutboundEmail({
            id: Math.random().toString(36).substr(2, 9),
            leadId: matchingLead?.id || contact.email,
            leadName: contact.name,
            subject: newsletter.subject,
            timestamp: new Date().toISOString(),
            status: 'sent',
            type: 'outreach',
            threadId,
            thread: [{
              from: 'hello@mavestone.com',
              to: contact.email,
              timestamp: new Date().toISOString(),
              content: newsletter.content.replace('{{name}}', contact.name)
            }]
          });
        } else {
          const err = await response.json();
          lastError = err.details || err.error;
        }
      } catch (e: any) {
        console.error("Failed to send newsletter to", contact.email, e);
        lastError = e.message;
      }
    }

    updateNewsletter(newsletterId, { status: 'sent' });
    return { success: successCount > 0, count: successCount, error: lastError };
  };
  const connectGmail = async () => {
    try {
      const response = await fetch('/api/auth/google/url', { credentials: 'include' });
      const { url } = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        url,
        'gmail_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (error) {
      console.error("Failed to get auth URL:", error);
    }
  };

  const disconnectGmail = async () => {
    try {
      await fetch('/api/gmail/disconnect', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('gmail_tokens');
      setGmailConfig({ isConnected: false });
    } catch (e) {
      console.error("Failed to disconnect Gmail:", e);
    }
  };

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
      { key: 'about_data', data: aboutData },
      { key: 'automations', data: automations },
      { key: 'newsletters', data: newsletters },
      { key: 'gmail_config', data: gmailConfig }
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
    console.log("Attempting to send message:", data);
    const client = supabase;
    if (!client) {
      console.error("Supabase client not initialized");
      return { success: false };
    }
    const { data: inserted, error } = await client.from('messages').insert([{ ...data, status: 'new', priority: 'medium', lead_type: 'warm' }]).select();
    
    if (error) {
      console.error("Supabase insert error:", error);
    }

    if (!error && inserted?.[0]) {
      const newLead = inserted[0];
      fetchMessages();
      // Update CRM list automatically
      addContactToList('all-crm', { name: data.name, email: data.email });

      if (gmailConfig.isConnected) {
        // Trigger automation
        const welcomeEmail = automations.find(a => a.trigger === 'new_lead' && a.isActive);
        if (welcomeEmail) {
          try {
            const tokens = localStorage.getItem('gmail_tokens');
            const subject = welcomeEmail.subject;
            const content = welcomeEmail.content.replace('{{name}}', data.name);
            
            const response = await fetch('/api/gmail/send', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                ...(tokens ? { 'x-gmail-tokens': tokens } : {})
              },
              credentials: 'include',
              body: JSON.stringify({
                to: data.email,
                subject,
                content
              })
            });

            const { threadId } = await response.json();

            addOutboundEmail({
              id: Math.random().toString(36).substr(2, 9),
              leadId: newLead.id, // Use the actual UUID
              leadName: data.name,
              subject,
              timestamp: new Date().toISOString(),
              status: 'sent',
              type: 'inbound',
              threadId,
              thread: [{
                from: 'hello@mavestone.com',
                to: data.email,
                timestamp: new Date().toISOString(),
                content
              }]
            });
          } catch (e) {
            console.error("Failed to send automated email:", e);
          }
        }
      }
    }

    return { success: !error, error };
  };
  const fetchReplies = useCallback(async () => {
    if (!gmailConfig.isConnected) return;
    try {
      const tokens = localStorage.getItem('gmail_tokens');
      const response = await fetch('/api/gmail/replies', {
        headers: { ...(tokens ? { 'x-gmail-tokens': tokens } : {}) },
        credentials: 'include'
      });
      if (response.ok) {
        const { replies } = await response.json();
        if (replies.length > 0) {
          const client = supabase;
          
          setOutboundEmails(prev => {
            let hasChanges = false;
            const updated = prev.map(email => {
              const relevantReplies = replies.filter((r: any) => r.threadId === email.threadId);
              if (relevantReplies.length === 0) return email;

              const newMessages = relevantReplies.filter((r: any) => 
                !email.thread.some((m: any) => m.timestamp === r.timestamp)
              );

              if (newMessages.length === 0) return email;

              hasChanges = true;
              const updatedThread = [...email.thread, ...newMessages.map((r: any) => ({
                from: r.from,
                to: 'hello@mavestone.com',
                timestamp: r.timestamp,
                content: r.content
              }))].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

              // Update DB in background
              if (client) {
                client.from('outbound_emails')
                  .update({ 
                    status: 'replied', 
                    thread: updatedThread,
                    updated_at: new Date().toISOString()
                  })
                  .eq('thread_id', email.threadId)
                  .then(({ error }) => {
                    if (error) console.error("Error updating outbound email in DB:", error);
                  });
              }

              return { ...email, status: 'replied' as const, thread: updatedThread };
            });

            return hasChanges ? updated : prev;
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch replies:", e);
    }
  }, [gmailConfig.isConnected]);

  useEffect(() => {
    if (gmailConfig.isConnected) {
      const interval = setInterval(fetchReplies, 60000); // Check every minute
      fetchReplies();
      return () => clearInterval(interval);
    }
  }, [gmailConfig.isConnected, fetchReplies]);

  const fetchMessages = useCallback(async () => {
    const client = supabase;
    if (!client) return;
    const { data } = await client.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);

    fetchOutboundData();
  }, [fetchOutboundData]);

  const markMessageRead = useCallback(async (id: string) => {
    const client = supabase;
    if (!client) return;
    await client.from('messages').update({ read: true, status: 'contacted' }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true, status: 'contacted' } : m));
  }, []);

  const updateMessage = useCallback(async (id: string, data: Partial<Message>) => {
    const client = supabase;
    if (!client) return;
    
    // Update local state immediately for responsiveness
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    
    // Then update DB
    await client.from('messages').update(data).eq('id', id);
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    console.log("Attempting to delete message with ID:", id);
    const client = supabase;
    if (!client) {
      alert("Database connection not available.");
      return;
    }
    
    try {
      const { error } = await client.from('messages').delete().eq('id', id);
      if (error) {
        console.error("Delete error:", error);
        alert(`Failed to delete lead: ${error.message}`);
      } else {
        console.log("Successfully deleted message:", id);
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    } catch (e: any) {
      console.error("Delete exception:", e);
      alert(`An error occurred while deleting: ${e.message}`);
    }
  }, []);

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
    
    // Seed mock messages
    const mockMessages = [
      { name: 'John Doe', email: 'john@example.com', message: 'Interested in a cinematic product launch video.', status: 'new' },
      { name: 'Sarah Smith', email: 'sarah@example.com', message: 'Looking for a documentary style shoot in Sydney.', status: 'read' }
    ];
    await client.from('messages').insert(mockMessages);

    window.location.reload();
  };

  const contextValue = useMemo(() => ({
    latestVideo, inProduction, shorts, films, clientWork, aboutData, messages, outboundCalls, outboundEmails, projectConfig,
    automations, newsletters, mailingLists, gmailConfig,
    isAdminOpen, isAuthenticated, isLoading,
    toggleAdmin, openAdmin, closeAdmin,
    updateLatestVideo, updateInProduction, updateAboutData, updateTestimonial, addTestimonial, deleteTestimonial,
    updateShort, setShorts, addShort, bulkAddShorts, deleteShort,
    updateFilm, addFilm, deleteFilm, updateClientWork, addClientWork, deleteClientWork, updateProjectConfig,
    updateAutomation, addAutomation, deleteAutomation, updateNewsletter, addNewsletter, deleteNewsletter,
    addMailingList, updateMailingList, deleteMailingList, addContactToList, deleteContactFromList, addOutboundEmail, sendNewsletter,
    connectGmail, disconnectGmail,
    saveChanges, uploadImage, login, logout, seedDatabase,
    sendMessage, fetchMessages, markMessageRead, updateMessage, deleteMessage
  }), [
    latestVideo, inProduction, shorts, films, clientWork, aboutData, messages, outboundCalls, outboundEmails, projectConfig,
    automations, newsletters, mailingLists, gmailConfig,
    isAdminOpen, isAuthenticated, isLoading,
    toggleAdmin, openAdmin, closeAdmin,
    updateLatestVideo, updateInProduction, updateAboutData, updateTestimonial, addTestimonial, deleteTestimonial,
    updateShort, setShorts, addShort, bulkAddShorts, deleteShort,
    updateFilm, addFilm, deleteFilm, updateClientWork, addClientWork, deleteClientWork, updateProjectConfig,
    updateAutomation, addAutomation, deleteAutomation, updateNewsletter, addNewsletter, deleteNewsletter,
    addMailingList, updateMailingList, deleteMailingList, addContactToList, deleteContactFromList, addOutboundEmail, sendNewsletter,
    connectGmail, disconnectGmail,
    saveChanges, uploadImage, login, logout, seedDatabase,
    sendMessage, fetchMessages, markMessageRead, updateMessage, deleteMessage
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
