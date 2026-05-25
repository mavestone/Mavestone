
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Mail, Plus, Trash2, LogOut, Youtube, GripVertical, User, Users, CheckCircle2, Clock, Phone, FileText, TrendingUp, MessageSquare, Table, List, AlertCircle, Edit3, Search, ChevronDown, PanelLeftClose, PanelLeftOpen, Zap, Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Message } from '../types';

const getLeadNumber = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 9000) + 1000;
};

const CRMLeadItem: React.FC<{ 
    msg: Message; 
    updateMessage: (id: string, data: Partial<Message>) => void; 
    deleteMessage: (id: string) => void; 
    markMessageRead: (id: string) => void; 
    isHighlighted?: boolean;
    onViewContact: (id: string) => void;
}> = ({ msg, updateMessage, deleteMessage, markMessageRead, isHighlighted, onViewContact }) => {
    const [localNotes, setLocalNotes] = useState(msg.notes || '');
    const [localValue, setLocalValue] = useState(msg.value || 0);
    const [isAiDrafting, setIsAiDrafting] = useState(false);

    const handleAiAnalyze = async () => {
        setIsAiDrafting(true);
        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
            const ai = new GoogleGenerativeAI(apiKey);
            const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent({
                contents: [{
                    role: 'user',
                    parts: [{ text: `Analyze this lead: Name: ${msg.name}, Message: "${msg.message}", Notes: "${msg.notes || 'None'}", Value: $${msg.value || 0}. System: Analyze the lead and provide a 2-sentence summary with a suggested priority (low/medium/high) and next best action.` }]
                }]
            });
            const res = await result.response;
            const analysis = res.text() || '';
            setLocalNotes(prev => `${prev}\n\nAI ANALYSIS: ${analysis}`);
            updateMessage(msg.id, { notes: `${msg.notes || ''}\n\nAI ANALYSIS: ${analysis}` });
        } catch (error) {
            console.error("AI Analysis failed:", error);
        } finally {
            setIsAiDrafting(false);
        }
    };

    useEffect(() => {
        setLocalNotes(msg.notes || '');
    }, [msg.notes]);

    useEffect(() => {
        setLocalValue(msg.value || 0);
    }, [msg.value]);

    return (
        <div id={`lead-${msg.id}`} className={`p-6 rounded-2xl admin-glass transition-all ${isHighlighted ? 'ring-2 ring-blue-500 border-blue-500' : ''} ${msg.read ? '' : 'border-blue-500/30 shadow-lg shadow-blue-500/5'}`}>
            <div className="flex flex-col lg:flex-row justify-between gap-6 font-admin">
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <button 
                                    onClick={() => onViewContact(msg.id)}
                                    className="text-xl font-medium text-white hover:text-blue-400 transition-colors text-left"
                                >
                                    {msg.name}
                                </button>
                                <span className="admin-label opacity-40">#{getLeadNumber(msg.id)}</span>
                                {msg.company && <span className="text-[#e8e8e8] opacity-60 text-sm">@ {msg.company}</span>}
                                {!msg.read && <span className="px-2.5 py-1 bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-[11px] font-semibold rounded-full uppercase tracking-wider">New</span>}
                                <select 
                                    value={msg.lead_type || 'warm'} 
                                    onChange={(e) => updateMessage(msg.id, { lead_type: e.target.value as any })}
                                    className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border focus:outline-none transition-colors ${
                                        msg.lead_type === 'cold' ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'bg-[#eab308]/15 border-[#eab308]/30 text-[#eab308]'
                                    }`}
                                >
                                    <option value="warm">Warm Lead</option>
                                    <option value="cold">Cold Outreach</option>
                                </select>
                                <select 
                                    value={msg.priority || 'medium'} 
                                    onChange={(e) => updateMessage(msg.id, { priority: e.target.value as any })}
                                    className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border focus:outline-none transition-colors ${
                                        msg.priority === 'high' ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                                        msg.priority === 'low' ? 'bg-gray-500/15 border-gray-500/30 text-gray-400' :
                                        'bg-blue-500/15 border-blue-500/30 text-blue-400'
                                    }`}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                                <select 
                                    value={msg.scope || 'one-off'} 
                                    onChange={(e) => updateMessage(msg.id, { scope: e.target.value as any })}
                                    className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 focus:outline-none"
                                >
                                    <option value="one-off">One-off</option>
                                    <option value="retainer">Retainer</option>
                                </select>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-[14px] text-[#e8e8e8] opacity-70">
                                <a href={`mailto:${msg.email}`} className="hover:text-blue-400 transition-colors flex items-center gap-2"><Mail size={14} /> {msg.email}</a>
                                {msg.phone && <a href={`tel:${msg.phone}`} className="hover:text-white transition-colors flex items-center gap-2"><Phone size={14} /> {msg.phone}</a>}
                                <span className="flex items-center gap-2"><Clock size={14} /> {new Date(msg.created_at).toLocaleDateString()}</span>
                                {msg.source && <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider opacity-60"><TrendingUp size={12} /> {msg.source}</span>}
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                            <select 
                                value={msg.status || 'new'} 
                                onChange={(e) => updateMessage(msg.id, { status: e.target.value as any })}
                                className={`text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border focus:outline-none transition-colors ${
                                    msg.status === 'converted' ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' :
                                    msg.status === 'contacted' ? 'bg-[#3b82f6]/15 border-[#3b82f6]/30 text-[#3b82f6]' :
                                    msg.status === 'qualified' ? 'bg-[#22c55e]/15 border-[#22c55e]/30 text-[#22c55e]' :
                                    msg.status === 'lost' ? 'bg-[#ef4444]/15 border-[#ef4444]/30 text-[#ef4444]' :
                                    'bg-blue-500/15 border-blue-500/30 text-blue-400'
                                }`}
                            >
                                <option value="new">New Lead</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                            <div className="flex items-center gap-3">
                                <span className="admin-label">Value:</span>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#22c55e] text-sm">$</span>
                                    <input 
                                        type="number" 
                                        value={localValue} 
                                        onChange={(e) => setLocalValue(parseInt(e.target.value) || 0)}
                                        onBlur={() => updateMessage(msg.id, { value: localValue })}
                                        className="bg-white/5 border border-white/10 rounded-lg pl-6 pr-3 py-1.5 text-sm text-white w-28 focus:outline-none focus:border-white/20"
                                    />
                                    {msg.scope === 'retainer' && <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-[11px] opacity-40 uppercase tracking-wider">p/m</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <p className="admin-label mb-4 flex items-center gap-2"><MessageSquare size={14} /> Message Content</p>
                        <p className="admin-body italic opacity-80">"{msg.message}"</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="admin-label ml-1 flex items-center gap-2"><FileText size={14} /> Internal Notes</label>
                            <button 
                                onClick={handleAiAnalyze}
                                disabled={isAiDrafting}
                                className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2 hover:text-blue-300 transition-colors disabled:opacity-50"
                            >
                                <Zap size={12} fill="currentColor" /> {isAiDrafting ? 'Analyzing...' : 'AI Analyze'}
                            </button>
                        </div>
                        <textarea 
                            value={localNotes} 
                            onChange={(e) => setLocalNotes(e.target.value)}
                            onBlur={() => updateMessage(msg.id, { notes: localNotes })}
                            placeholder="Add follow-up notes, project scope, or budget details..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-[14px] text-[#e8e8e8] focus:outline-none focus:border-white/20 transition-all min-h-[100px] leading-relaxed"
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
                    <button 
                        onClick={() => { 
                            console.log("Delete clicked for lead card:", msg.id);
                            if(window.confirm("Permanently delete this lead?")) deleteMessage(msg.id);
                        }}
                        className="w-full py-3 text-gray-600 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-auto border border-transparent hover:border-red-500/20 rounded-xl"
                    >
                        <Trash2 size={14} /> Delete Lead
                    </button>
                </div>
            </div>
        </div>
    );
};

const SpreadsheetRow: React.FC<{ 
    msg: Message; 
    updateMessage: (id: string, data: Partial<Message>) => void; 
    deleteMessage: (id: string) => void; 
    onEdit: (id: string) => void;
    onViewContact: (id: string) => void;
    isHighlighted?: boolean;
}> = ({ msg, updateMessage, deleteMessage, onEdit, onViewContact, isHighlighted }) => {
    const [localValue, setLocalValue] = useState(msg.value || 0);

    useEffect(() => {
        setLocalValue(msg.value || 0);
    }, [msg.value]);

    return (
        <tr id={`lead-${msg.id}`} key={msg.id} className={`border-t border-white/5 transition-colors ${isHighlighted ? 'bg-blue-500/10' : 'hover:bg-white/[0.01]'}`}>
            <td className="p-4">
                <div className="flex items-center gap-2 mb-1">
                    <button 
                        onClick={() => onViewContact(msg.id)}
                        className="font-bold text-white hover:text-blue-400 transition-colors text-left"
                    >
                        {msg.name}
                    </button>
                    <span className="text-[8px] font-black text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-widest">#{getLeadNumber(msg.id)}</span>
                </div>
                <div className="text-[10px] text-gray-500">{msg.email}</div>
            </td>
            <td className="p-4">
                <select 
                    value={msg.lead_type || 'warm'} 
                    onChange={(e) => updateMessage(msg.id, { lead_type: e.target.value as any })}
                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded border focus:outline-none transition-colors ${
                        msg.lead_type === 'cold' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    }`}
                >
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                </select>
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
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                        <span className={`${msg.status === 'converted' ? 'text-green-400' : 'text-emerald-500'} text-xs`}>$</span>
                        <input 
                            type="number" 
                            value={localValue} 
                            onChange={(e) => setLocalValue(parseInt(e.target.value) || 0)}
                            onBlur={() => updateMessage(msg.id, { value: localValue })}
                            className={`bg-transparent border-none p-0 text-xs ${msg.status === 'converted' ? 'text-green-400 font-bold' : 'text-white'} w-20 focus:outline-none`}
                        />
                        {msg.scope === 'retainer' && <span className="text-[10px] text-gray-500">p/m</span>}
                    </div>
                    {msg.status === 'converted' && (
                        <div className="text-[8px] font-black uppercase tracking-widest text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded w-fit border border-green-500/20">Revenue</div>
                    )}
                </div>
            </td>
            <td className="p-4">
                <div className="flex flex-col gap-2">
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
                    <select 
                        value={msg.scope || 'one-off'} 
                        onChange={(e) => updateMessage(msg.id, { scope: e.target.value as any })}
                        className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border border-white/10 bg-black/20 text-gray-500 focus:outline-none"
                    >
                        <option value="one-off">One-off</option>
                        <option value="retainer">Retainer</option>
                    </select>
                </div>
            </td>
            <td className="p-4 text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleDateString()}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onViewContact(msg.id)}
                        className="p-2 text-gray-500 hover:text-emerald-400 transition-colors"
                        title="View Outbound History"
                    >
                        <TrendingUp size={14} />
                    </button>
                    <button 
                        onClick={() => onEdit(msg.id)}
                        className="p-2 text-gray-500 hover:text-white transition-colors"
                        title="Edit Lead / Notes"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button 
                        onClick={() => { 
                            console.log("Delete clicked for lead:", msg.id);
                            if(window.confirm("Permanently delete this lead?")) deleteMessage(msg.id);
                        }}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

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
    hiringData, updateHiringData,
    saveChanges, uploadImage,
    isAuthenticated, fetchMessages, messages, markMessageRead, updateMessage, deleteMessage, logout
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'shorts' | 'about' | 'hiring' | 'crm'>('home');
  
  const [crmView, setCrmView] = useState<'cards' | 'spreadsheet'>('spreadsheet');
  const [highlightedLeadId, setHighlightedLeadId] = useState<string | null>(null);
  const [crmSort, setCrmSort] = useState<'date' | 'status' | 'priority' | 'value'>('date');
  const [crmSearch, setCrmSearch] = useState('');
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['content', 'leads']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
        prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  useEffect(() => {
      setDbStatus('ok');
  }, [activeTab]);
  const [processingImage, setProcessingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    if (!file) return;
    setProcessingImage(true);
    setUploadProgress(0);
    try {
        const publicUrl = await uploadImage(file, (p) => setUploadProgress(Math.round(p)));
        if (publicUrl) callback(publicUrl);
    } finally {
        setProcessingImage(false);
        setUploadProgress(0);
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
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-300 font-manrope ${
            activeTab === id 
            ? 'bg-white/10 text-white font-medium backdrop-blur-md border border-white/10' 
            : 'text-[#e8e8e8] opacity-50 hover:opacity-100 hover:bg-white/5'
        }`}
    >
        <Icon size={18} />
        <span className="text-[14px] tracking-wide">{label}</span>
    </button>
  );

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex bg-[#0f0f0f] font-admin"
        >
            {/* MOBILE HAMBURGER TOGGLE */}
            <div className="md:hidden fixed top-6 left-6 z-[150]">
                <button 
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white"
                >
                    {isMobileSidebarOpen ? <X size={20} /> : <List size={20} />}
                </button>
            </div>
            {/* SIDEBAR */}
            <motion.aside 
                initial={false}
                animate={{ 
                    width: isSidebarCollapsed ? 0 : 320,
                    x: (isSidebarCollapsed || (!isMobileSidebarOpen && window.innerWidth < 768)) ? -320 : 0
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`flex-shrink-0 bg-[#111111] border-r border-white/5 flex flex-col justify-between z-[110] relative ${
                    isMobileSidebarOpen ? 'fixed inset-y-0 left-0 w-[320px] shadow-2xl' : ''
                }`}
            >
                <div className="p-8 space-y-10 min-w-[320px] overflow-y-auto scrollbar-hide">
                    <div className="flex items-center gap-3 px-2">
                        <div className="flex flex-col">
                            <h2 className="text-white font-bold text-2xl leading-none tracking-tight font-manrope">Mavestone.</h2>
                            <p className="admin-label mt-2 text-[10px] opacity-30">Admin Panel</p>
                        </div>
                    </div>

                    <nav className="space-y-8">
                        <div>
                            <button 
                                onClick={() => toggleCategory('content')}
                                className="w-full flex items-center justify-between admin-label mb-4 px-2 hover:text-white transition-colors group"
                            >
                                <span className="font-manrope">Content Management</span>
                                <motion.div
                                    animate={{ rotate: expandedCategories.includes('content') ? 0 : -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={14} className="opacity-40 group-hover:opacity-100" />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {expandedCategories.includes('content') && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-1"
                                    >
                                        <NavItem id="home" label="Home" icon={Layout} />
                                        <NavItem id="projects" label="Projects" icon={Clapperboard} />
                                        <NavItem id="shorts" label="Shorts" icon={Youtube} />
                                        <NavItem id="about" label="About" icon={User} />
                                        <NavItem id="hiring" label="Hiring" icon={FileText} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div>
                            <button 
                                onClick={() => toggleCategory('leads')}
                                className="w-full flex items-center justify-between admin-label mb-4 px-2 hover:text-white transition-colors group"
                            >
                                <span className="font-manrope">Lead Management</span>
                                <motion.div
                                    animate={{ rotate: expandedCategories.includes('leads') ? 0 : -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={14} className="opacity-40 group-hover:opacity-100" />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {expandedCategories.includes('leads') && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-1"
                                    >
                                        <NavItem id="crm" label="Leads Table" icon={Users} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>
                </div>

                <div className="p-8 space-y-6 min-w-[320px]">
                    {saveError && <div className="text-red-400 text-[11px] px-2">{saveError}</div>}
                    <button onClick={handleSave} className="w-full py-3.5 bg-[#22c55e]/10 border border-[#22c55e]/20 hover:bg-[#22c55e]/20 text-[#22c55e] rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm transition-all">
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between px-2">
                        <button onClick={() => { logout(); handleClose(); }} className="text-[#e8e8e8] opacity-50 hover:opacity-100 hover:text-red-400 transition-colors flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold"><LogOut size={18} /> Logout</button>
                        <button 
                            onClick={() => setIsSidebarCollapsed(true)}
                            className="p-2 text-white/20 hover:text-white transition-colors"
                            title="Collapse Sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* EXPAND BUTTON (Visible when collapsed) */}
            <AnimatePresence>
                {isSidebarCollapsed && (
                    <motion.button 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="fixed bottom-8 left-8 z-[110] p-3 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3 font-bold text-[11px] uppercase tracking-wider"
                    >
                        <PanelLeftOpen size={18} />
                        <span>Show Sidebar</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <main 
                className="flex-1 flex flex-col bg-[#0f0f0f] relative overflow-hidden"
                style={{
                    backgroundImage: 
                        activeTab === 'crm' ? 'radial-gradient(ellipse at top left, rgba(59,130,246,0.06) 0%, transparent 60%)' :
                        'none'
                }}
            >
                <div className="flex-shrink-0 sticky top-0 z-20 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 px-10 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white tracking-tight font-manrope">
                            {activeTab === 'crm' ? 'Leads' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        {processingImage && (
                            <span className="flex items-center gap-2 text-blue-400 text-[11px] font-semibold">
                                <Loader2 size={14} className="animate-spin" /> 
                                Uploading {uploadProgress}%...
                            </span>
                        )}
                        <button onClick={handleClose} className="p-2.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                </div>

                <div className={`flex-1 overflow-y-auto relative p-10 pb-32 w-full max-w-[1600px] mx-auto`}>
                    {/* HOME TAB */}
                    {activeTab === 'home' && (
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="p-8 rounded-2xl admin-glass space-y-8">
                                        <h3 className="admin-label text-blue-400 border-b border-white/5 pb-4">Main Featured Video</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <input type="text" placeholder="Video Title" value={latestVideo.title} onChange={(e) => updateLatestVideo({ title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                                <input type="text" placeholder="YouTube URL or ID" value={latestVideo.videoId} onChange={(e) => updateLatestVideo({ videoId: extractYouTubeId(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono text-blue-300 focus:outline-none focus:border-white/20 transition-all" />
                                            </div>
                                            <textarea rows={4} placeholder="Description" value={latestVideo.description} onChange={(e) => updateLatestVideo({ description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                            <div className="flex gap-3">
                                                <input type="text" placeholder="Thumbnail URL" value={latestVideo.image} onChange={(e) => updateLatestVideo({ image: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                                <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateLatestVideo({ image: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative group admin-glass">
                                        <img src={latestVideo.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="Preview" />
                                        <div className="absolute inset-0 flex items-center justify-center"><Youtube size={64} className="text-white opacity-20 group-hover:opacity-40 transition-opacity" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === 'about' && (
                        <div className="space-y-10">
                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="p-8 rounded-2xl admin-glass space-y-8">
                                        <h3 className="admin-label text-orange-400 border-b border-white/5 pb-4">Bio Details</h3>
                                        <div className="space-y-4">
                                            <input type="text" placeholder="Subtitle (e.g. 01 / The Visionary)" value={aboutData.subtitle} onChange={(e) => updateAboutData({ subtitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                            <textarea rows={6} placeholder="Description" value={aboutData.description} onChange={(e) => updateAboutData({ description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                            <label className="admin-label block mt-6 opacity-45">Testimonials Background</label>
                                            <div className="flex gap-3">
                                                <input type="text" placeholder="Background Image URL" value={aboutData.testimonialsBackground || ''} onChange={(e) => updateAboutData({ testimonialsBackground: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                                <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutData({ testimonialsBackground: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 space-y-4">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] relative group admin-glass">
                                        <img src={aboutData.portrait} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" alt="Portrait Preview" />
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold"><Camera size={32} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutData({ portrait: url }))} /></label>
                                    </div>
                                    <input type="text" placeholder="Portrait URL" value={aboutData.portrait} onChange={(e) => updateAboutData({ portrait: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white/30 focus:outline-none focus:border-white/20 transition-all" />
                                </div>
                             </div>

                             <div className="space-y-8">
                                 <div className="flex justify-between items-center px-2">
                                     <h3 className="text-xl font-medium text-white">Client Reviews</h3>
                                     <button onClick={() => addTestimonial()} className="px-6 py-2.5 bg-white/10 border border-white/10 backdrop-blur-md text-white rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"><Plus size={14} /> Add Review</button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {aboutData.testimonials.map((t) => (
                                         <div key={t.id} className="p-8 rounded-2xl admin-glass group relative">
                                             <button onClick={() => deleteTestimonial(t.id)} className="absolute top-6 right-6 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                             <div className="space-y-6">
                                                 <textarea rows={3} value={t.text} onChange={(e) => updateTestimonial(t.id, { text: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 italic focus:outline-none focus:border-white/20 transition-all" placeholder="Review Text" />
                                                 <div className="flex items-center gap-4">
                                                     <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 group/av border border-white/10">
                                                         <img src={t.avatar} className="w-full h-full object-cover" />
                                                         <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/av:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateTestimonial(t.id, { avatar: url }))} /></label>
                                                     </div>
                                                     <div className="flex-1 grid grid-cols-2 gap-3">
                                                         <input type="text" value={t.name} onChange={(e) => updateTestimonial(t.id, { name: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all" placeholder="Name" />
                                                         <input type="text" value={t.company} onChange={(e) => updateTestimonial(t.id, { company: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/20 transition-all" placeholder="Company" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* HIRING TAB */}
                    {activeTab === 'hiring' && (
                        <div className="space-y-10">
                            <div className="p-8 rounded-2xl admin-glass space-y-8">
                                <h3 className="admin-label text-yellow-400 border-b border-white/5 pb-4">Hiring Details</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input type="text" placeholder="Title Line 1" value={hiringData.titleLine1} onChange={(e) => updateHiringData({ titleLine1: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                        <input type="text" placeholder="Title Line 2 (Highlighted)" value={hiringData.titleLine2} onChange={(e) => updateHiringData({ titleLine2: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-yellow-300 focus:outline-none focus:border-white/20 transition-all font-bold" />
                                        <input type="text" placeholder="Title Line 3" value={hiringData.titleLine3} onChange={(e) => updateHiringData({ titleLine3: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="admin-label block opacity-45">Hero Portrait Photo</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Image URL" value={hiringData.heroImage || ''} onChange={(e) => updateHiringData({ heroImage: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                            <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*,.gif" onChange={(e) => handleImageUpload(e, (url) => updateHiringData({ heroImage: url }))} /></label>
                                        </div>
                                    </div>
                                    <textarea rows={3} placeholder="Intro Paragraph 1" value={hiringData.introParagraph1} onChange={(e) => updateHiringData({ introParagraph1: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                    <textarea rows={3} placeholder="Intro Paragraph 2" value={hiringData.introParagraph2} onChange={(e) => updateHiringData({ introParagraph2: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                    <textarea rows={3} placeholder="Quote" value={hiringData.introParagraph3} onChange={(e) => updateHiringData({ introParagraph3: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-blue-300 italic focus:outline-none focus:border-white/20 transition-all" />
                                </div>
                            </div>
                            <div className="p-8 rounded-2xl admin-glass space-y-8">
                                <h3 className="admin-label text-blue-400 border-b border-white/5 pb-4">The Kind of Work We Make (Media)</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="admin-label block opacity-45">Card 1 (Travel Films) Media (Image/GIF)</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Media URL" value={hiringData.card1Media || ''} onChange={(e) => updateHiringData({ card1Media: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                            <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*,.gif" onChange={(e) => handleImageUpload(e, (url) => updateHiringData({ card1Media: url }))} /></label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="admin-label block opacity-45">Card 2 (Reels) Media (Image/GIF)</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Media URL" value={hiringData.card2Media || ''} onChange={(e) => updateHiringData({ card2Media: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                            <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*,.gif" onChange={(e) => handleImageUpload(e, (url) => updateHiringData({ card2Media: url }))} /></label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="admin-label block opacity-45">Card 3 (Documentary) Media (Image/GIF)</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Media URL" value={hiringData.card3Media || ''} onChange={(e) => updateHiringData({ card3Media: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                            <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*,.gif" onChange={(e) => handleImageUpload(e, (url) => updateHiringData({ card3Media: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 rounded-2xl admin-glass space-y-8">
                                <h3 className="admin-label text-purple-400 border-b border-white/5 pb-4">Role & Requirements</h3>
                                <div className="space-y-4">
                                    <label className="admin-label block opacity-45">Role Requirements (One per line)</label>
                                    <textarea 
                                        rows={6} 
                                        value={hiringData.roleRequirements.join('\n')} 
                                        onChange={(e) => updateHiringData({ roleRequirements: e.target.value.split('\n') })} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" 
                                    />
                                    <label className="admin-label block mt-6 opacity-45">What makes a great applicant</label>
                                    <textarea 
                                        rows={5} 
                                        value={hiringData.applicantParagraph} 
                                        onChange={(e) => updateHiringData({ applicantParagraph: e.target.value })} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" 
                                    />
                                </div>
                            </div>
                            <div className="p-8 rounded-2xl admin-glass space-y-8">
                                <h3 className="admin-label text-orange-400 border-b border-white/5 pb-4">The Process</h3>
                                <div className="space-y-4">
                                    <label className="admin-label block opacity-45">Process Steps (One per line)</label>
                                    <textarea 
                                        rows={4} 
                                        value={hiringData.processSteps.join('\n')} 
                                        onChange={(e) => updateHiringData({ processSteps: e.target.value.split('\n') })} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" 
                                    />
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <h4 className="admin-label text-white/80 border-b border-white/5 pb-2">Primary Button</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="admin-label block opacity-45 mb-1">Button Label</label>
                                                <input type="text" placeholder="e.g. Download Footage" value={hiringData.cta1Label || 'Download Footage'} onChange={(e) => updateHiringData({ cta1Label: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                            </div>
                                            <div>
                                                <label className="admin-label block opacity-45 mb-1">Link URL</label>
                                                <input type="text" placeholder="https://" value={hiringData.cta1URL || hiringData.callToActionURL || ''} onChange={(e) => updateHiringData({ cta1URL: e.target.value, callToActionURL: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                            </div>
                                            <div>
                                                <label className="admin-label block opacity-45 mb-1">Button Color (Hex)</label>
                                                <div className="flex gap-2 items-center">
                                                    <input type="color" value={hiringData.cta1Color || '#E8A020'} onChange={(e) => updateHiringData({ cta1Color: e.target.value })} className="w-10 h-10 rounded bg-transparent border-0 cursor-pointer p-0" />
                                                    <input type="text" placeholder="#E8A020" value={hiringData.cta1Color || '#E8A020'} onChange={(e) => updateHiringData({ cta1Color: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all uppercase" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <h4 className="admin-label text-white/80 border-b border-white/5 pb-2">Secondary Button</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="admin-label block opacity-45 mb-1">Button Label</label>
                                                <input type="text" placeholder="e.g. Submit Your Edit" value={hiringData.cta2Label || 'Submit Your Edit'} onChange={(e) => updateHiringData({ cta2Label: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                            </div>
                                            <div>
                                                <label className="admin-label block opacity-45 mb-1">Link URL (optional)</label>
                                                <input type="text" placeholder="https://" value={hiringData.cta2URL || ''} onChange={(e) => updateHiringData({ cta2URL: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROJECTS TAB */}
                    {activeTab === 'projects' && (
                        <div className="space-y-10">
                            <div className="p-8 rounded-2xl admin-glass space-y-8">
                                <h3 className="admin-label text-red-400 border-b border-white/5 pb-4">Portfolio Hero Config</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <label className="admin-label opacity-45 ml-1">Hero Featured Film</label>
                                        <select value={projectConfig?.featuredFilmId} onChange={(e) => updateProjectConfig({ featuredFilmId: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all">
                                            {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="admin-label opacity-45 ml-1">Overlay Logo Image (Full Lockup)</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Logo Image URL" value={projectConfig.logoImage || ''} onChange={(e) => updateProjectConfig({ logoImage: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                            <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*,.svg" onChange={(e) => handleImageUpload(e, (url) => updateProjectConfig({ logoImage: url }))} /></label>
                                        </div>
                                        
                                        <div className="space-y-3 pt-4 border-t border-white/5">
                                            <label className="admin-label opacity-45 ml-1">Custom "M" Logo (Upload SVG)</label>
                                            <p className="text-[10px] text-gray-500 mb-4">Upload a custom SVG file to replace the default 'M' logo. This allows for clean vector scaling.</p>
                                            
                                            <div className="flex flex-col gap-4">
                                                <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Upload size={20} className="text-white/60" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-bold text-white uppercase tracking-widest">Select SVG File</p>
                                                        <p className="text-[10px] text-gray-500">Vector graphics work best (.svg)</p>
                                                    </div>
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept=".svg" 
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => {
                                                                const content = ev.target?.result as string;
                                                                updateProjectConfig({ customLogoSvg: content });
                                                            };
                                                            reader.readAsText(file);
                                                        }} 
                                                    />
                                                </label>

                                                {projectConfig.customLogoSvg && (
                                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 flex items-center justify-center text-red-500" dangerouslySetInnerHTML={{ __html: projectConfig.customLogoSvg }} />
                                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Current SVG Active</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => updateProjectConfig({ customLogoSvg: '' })}
                                                            className="text-[10px] text-red-400 font-bold uppercase tracking-widest hover:text-red-300 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-2xl admin-glass space-y-8">
                                <h3 className="admin-label text-orange-400 border-b border-white/5 pb-4">In Production / Coming Soon</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={inProduction.title} onChange={(e) => updateInProduction({ title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                        <input type="text" placeholder="Status (e.g. Post-Production)" value={inProduction.status} onChange={(e) => updateInProduction({ status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                        <textarea rows={3} placeholder="Description" value={inProduction.description} onChange={(e) => updateInProduction({ description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-white/10 bg-white/5 admin-glass">
                                            <img src={inProduction.image} className="w-full h-full object-cover opacity-80" alt="Production Preview" />
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))} /></label>
                                        </div>
                                        <input type="text" placeholder="Cover URL" value={inProduction.image} onChange={(e) => updateInProduction({ image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white/30 focus:outline-none focus:border-white/20 transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-2 pt-10">
                                <h3 className="text-xl font-medium text-white">Selected Works</h3>
                                <button onClick={() => addFilm()} className="px-6 py-2.5 bg-white/10 border border-white/10 backdrop-blur-md text-white rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"><Plus size={14} /> Add New Project</button>
                            </div>

                            <div className="space-y-8">
                                {films.map((film) => (
                                    <div key={film.id} className="p-8 rounded-2xl admin-glass group">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                            <div className="lg:col-span-4 space-y-6">
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 admin-glass">
                                                    <img src={film.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" alt={film.title} />
                                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateFilm(film.id, { image: url }))} /></label>
                                                </div>
                                                <div className="space-y-3">
                                                    <input type="text" placeholder="Thumbnail URL" value={film.image} onChange={(e) => updateFilm(film.id, { image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white/30 focus:outline-none focus:border-white/20 transition-all" />
                                                    <input type="text" placeholder="YouTube URL or ID" value={film.videoId || ''} onChange={(e) => updateFilm(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono text-blue-300 focus:outline-none focus:border-white/20 transition-all" />
                                                </div>
                                            </div>
                                            <div className="lg:col-span-8 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <input type="text" placeholder="Project Title" value={film.title} onChange={(e) => updateFilm(film.id, { title: e.target.value })} className="text-2xl font-medium bg-transparent text-white border-b border-transparent focus:border-white/20 focus:outline-none w-full mr-4 transition-all" />
                                                    <button onClick={() => deleteFilm(film.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Category</span>
                                                        <input type="text" placeholder="Category" value={film.category} onChange={(e) => updateFilm(film.id, { category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Tagline</span>
                                                        <input type="text" placeholder="Tagline" value={film.tagline} onChange={(e) => updateFilm(film.id, { tagline: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Year</span>
                                                        <input type="text" placeholder="Year" value={film.year || ''} onChange={(e) => updateFilm(film.id, { year: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Location</span>
                                                        <input type="text" placeholder="Location" value={film.location || ''} onChange={(e) => updateFilm(film.id, { location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Film Type</span>
                                                        <input type="text" placeholder="Film Type (e.g. Feature)" value={film.filmType || ''} onChange={(e) => updateFilm(film.id, { filmType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Duration</span>
                                                        <input type="text" placeholder="Duration (e.g. 1h 20m)" value={film.duration || ''} onChange={(e) => updateFilm(film.id, { duration: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Genres</span>
                                                        <input type="text" placeholder="Genres" value={film.genres || ''} onChange={(e) => updateFilm(film.id, { genres: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <span className="admin-label opacity-45 ml-1">Description</span>
                                                    <textarea rows={3} placeholder="Full Description for Lightbox" value={film.description || ''} onChange={(e) => updateFilm(film.id, { description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center px-2 pt-10 border-t border-white/5 mt-12">
                                <h3 className="text-xl font-medium text-white">Client Work</h3>
                                <button onClick={() => addClientWork()} className="px-6 py-2.5 bg-white/10 border border-white/10 backdrop-blur-md text-white rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-white/20 transition-all"><Plus size={14} /> Add Client Project</button>
                            </div>

                             <div className="space-y-8">
                                {clientWork.map((film) => (
                                    <div key={film.id} className="p-8 rounded-2xl admin-glass group">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                            <div className="lg:col-span-4 space-y-6">
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 admin-glass">
                                                    <img src={film.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" alt={film.title} />
                                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateClientWork(film.id, { image: url }))} /></label>
                                                </div>
                                                <div className="space-y-3">
                                                    <input type="text" placeholder="Thumbnail URL" value={film.image} onChange={(e) => updateClientWork(film.id, { image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-white/30 focus:outline-none focus:border-white/20 transition-all" />
                                                    <input type="text" placeholder="YouTube URL or ID" value={film.videoId || ''} onChange={(e) => updateClientWork(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono text-blue-300 focus:outline-none focus:border-white/20 transition-all" />
                                                </div>
                                            </div>
                                            <div className="lg:col-span-8 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <input type="text" placeholder="Project Title" value={film.title} onChange={(e) => updateClientWork(film.id, { title: e.target.value })} className="text-2xl font-medium bg-transparent text-white border-b border-transparent focus:border-white/20 focus:outline-none w-full mr-4 transition-all" />
                                                    <button onClick={() => deleteClientWork(film.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Category</span>
                                                        <input type="text" placeholder="Category" value={film.category} onChange={(e) => updateClientWork(film.id, { category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Tagline</span>
                                                        <input type="text" placeholder="Tagline" value={film.tagline} onChange={(e) => updateClientWork(film.id, { tagline: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Year</span>
                                                        <input type="text" placeholder="Year" value={film.year || ''} onChange={(e) => updateClientWork(film.id, { year: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Location</span>
                                                        <input type="text" placeholder="Location" value={film.location || ''} onChange={(e) => updateClientWork(film.id, { location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Film Type</span>
                                                        <input type="text" placeholder="Film Type (e.g. Feature)" value={film.filmType || ''} onChange={(e) => updateClientWork(film.id, { filmType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Duration</span>
                                                        <input type="text" placeholder="Duration (e.g. 1h 20m)" value={film.duration || ''} onChange={(e) => updateClientWork(film.id, { duration: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <span className="admin-label opacity-45 ml-1">Genres</span>
                                                        <input type="text" placeholder="Genres" value={film.genres || ''} onChange={(e) => updateClientWork(film.id, { genres: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <span className="admin-label opacity-45 ml-1">Description</span>
                                                    <textarea rows={3} placeholder="Full Description for Lightbox" value={film.description || ''} onChange={(e) => updateClientWork(film.id, { description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                                </div>
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

                    {/* CRM / LEADS TAB */}
                    {activeTab === 'crm' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="p-6 rounded-2xl admin-glass" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)' }}>
                                    <p className="admin-label mb-2 opacity-45 text-[#6366f1]">Total Leads</p>
                                    <p className="text-[28px] font-semibold text-white leading-none">{messages.length}</p>
                                </div>
                                <div className="p-6 rounded-2xl admin-glass" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)' }}>
                                    <p className="admin-label mb-2 opacity-45 text-[#22c55e]">New</p>
                                    <p className="text-[28px] font-semibold text-white leading-none">{messages.filter(m => m.status === 'new' || !m.status).length}</p>
                                </div>
                                <div className="p-6 rounded-2xl admin-glass" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(234,179,8,0.04) 100%)' }}>
                                    <p className="admin-label mb-2 opacity-45 text-[#eab308]">Contacted</p>
                                    <p className="text-[28px] font-semibold text-white leading-none">{messages.filter(m => m.status === 'contacted').length}</p>
                                </div>
                                <div className="p-6 rounded-2xl admin-glass" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)' }}>
                                    <p className="admin-label mb-2 opacity-45 text-[#10b981]">Converted</p>
                                    <p className="text-[28px] font-semibold text-white leading-none">{messages.filter(m => m.status === 'converted').length}</p>
                                </div>
                                <div className="p-6 rounded-2xl admin-glass" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 100%)' }}>
                                    <p className="admin-label mb-2 opacity-45 text-[#06b6d4]">Pipeline Value</p>
                                    <p className="text-[28px] font-semibold text-white leading-none">${messages.reduce((acc, m) => acc + (m.value || 0), 0).toLocaleString()}</p>
                                </div>
                                <div className="p-6 rounded-2xl admin-glass" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(244,63,94,0.04) 100%)' }}>
                                    <p className="admin-label mb-2 opacity-45 text-[#f43f5e]">Total Revenue</p>
                                    <p className="text-[28px] font-semibold text-white leading-none">${messages.filter(m => m.status === 'converted').reduce((acc, m) => acc + (m.value || 0), 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6 admin-glass p-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                                        <button 
                                            onClick={() => setCrmView('cards')}
                                            className={`p-2 rounded-lg transition-all ${crmView === 'cards' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                                            title="Card View"
                                        >
                                            <List size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setCrmView('spreadsheet')}
                                            className={`p-2 rounded-lg transition-all ${crmView === 'spreadsheet' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                                            title="Spreadsheet View"
                                        >
                                            <Table size={18} />
                                        </button>
                                    </div>

                                    {dbStatus === 'error' && (
                                        <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[11px] font-semibold">
                                            <AlertCircle size={14} />
                                            <span>Database Schema Mismatch</span>
                                            <button 
                                                onClick={() => alert("Please run this SQL in your Supabase SQL Editor:\n\nALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';\nALTER TABLE messages ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';\nALTER TABLE messages ADD COLUMN IF NOT EXISTS notes TEXT;\nALTER TABLE messages ADD COLUMN IF NOT EXISTS value INTEGER DEFAULT 0;\nALTER TABLE messages ADD COLUMN IF NOT EXISTS source TEXT;\nALTER TABLE messages ADD COLUMN IF NOT EXISTS company TEXT;\nALTER TABLE messages ADD COLUMN IF NOT EXISTS phone TEXT;")}
                                                className="underline ml-2 hover:text-white"
                                            >
                                                Show Fix
                                            </button>
                                        </div>
                                    )}
                                    {dbStatus === 'ok' && (
                                        <div className="flex items-center gap-3 px-4 py-2 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full text-[#22c55e] text-[11px] font-semibold">
                                            <CheckCircle2 size={14} />
                                            <span>Database Connected</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                        <input 
                                            type="text"
                                            placeholder="Search leads..."
                                            value={crmSearch}
                                            onChange={(e) => setCrmSearch(e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 w-64 md:w-80 transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="admin-label">Sort By:</span>
                                        <select 
                                            value={crmSort}
                                            onChange={(e) => setCrmSort(e.target.value as any)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
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
                                {(() => {
                                    const filtered = messages.filter(msg => {
                                        const searchLower = crmSearch.toLowerCase();
                                        return (
                                            msg.id.toLowerCase().includes(searchLower) ||
                                            msg.name.toLowerCase().includes(searchLower) ||
                                            msg.email.toLowerCase().includes(searchLower) ||
                                            (msg.company || '').toLowerCase().includes(searchLower) ||
                                            (msg.message || '').toLowerCase().includes(searchLower) ||
                                            (msg.notes || '').toLowerCase().includes(searchLower) ||
                                            (msg.phone || '').toLowerCase().includes(searchLower)
                                        );
                                    });

                                    if (messages.length === 0) {
                                        return (
                                            <div className="py-24 text-center bg-[#0F0F11] rounded-3xl border border-white/5">
                                                <Users className="mx-auto w-12 h-12 text-gray-800 mb-4" />
                                                <p className="text-gray-500">No leads captured yet.</p>
                                            </div>
                                        );
                                    }

                                    if (filtered.length === 0) {
                                        return (
                                            <div className="py-24 text-center bg-[#0F0F11] rounded-3xl border border-white/5">
                                                <Search className="mx-auto w-12 h-12 text-gray-800 mb-4" />
                                                <p className="text-gray-500">No leads match your search "{crmSearch}"</p>
                                                <button 
                                                    onClick={() => setCrmSearch('')}
                                                    className="mt-4 text-blue-400 hover:underline text-sm"
                                                >
                                                    Clear search
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <>
                                            {crmView === 'cards' ? (
                                                <div className="space-y-4">
                                                    {[...filtered].sort((a, b) => {
                                                        if (crmSort === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                                                        if (crmSort === 'status') return (a.status || '').localeCompare(b.status || '');
                                                        if (crmSort === 'priority') {
                                                            const pMap = { high: 3, medium: 2, low: 1 };
                                                            return (pMap[b.priority || 'medium'] || 0) - (pMap[a.priority || 'medium'] || 0);
                                                        }
                                                        if (crmSort === 'value') return (b.value || 0) - (a.value || 0);
                                                        return 0;
                                                    }).map(msg => (
                                                        <CRMLeadItem 
                                                            key={msg.id} 
                                                            msg={msg} 
                                                            updateMessage={updateMessage} 
                                                            deleteMessage={deleteMessage} 
                                                            markMessageRead={markMessageRead} 
                                                            isHighlighted={highlightedLeadId === msg.id}
                                                            onViewContact={(id) => {
                                                                setHighlightedLeadId(id);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0F0F11]">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Name</th>
                                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Type</th>
                                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Value / Revenue</th>
                                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Priority</th>
                                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                                                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {[...filtered].sort((a, b) => {
                                                                if (crmSort === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                                                                if (crmSort === 'status') return (a.status || '').localeCompare(b.status || '');
                                                                if (crmSort === 'priority') {
                                                                    const pMap = { high: 3, medium: 2, low: 1 };
                                                                    return (pMap[b.priority || 'medium'] || 0) - (pMap[a.priority || 'medium'] || 0);
                                                                }
                                                                if (crmSort === 'value') return (b.value || 0) - (a.value || 0);
                                                                return 0;
                                                            }).map(msg => (
                                                                 <SpreadsheetRow 
                                                                    key={msg.id} 
                                                                    msg={msg} 
                                                                    updateMessage={updateMessage} 
                                                                    deleteMessage={deleteMessage} 
                                                                    onViewContact={(id) => {
                                                                        setHighlightedLeadId(id);
                                                                    }}
                                                                    onEdit={(id) => {
                                                                        setHighlightedLeadId(id);
                                                                        setCrmView('cards');
                                                                        setTimeout(() => {
                                                                            document.getElementById(`lead-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                            setTimeout(() => setHighlightedLeadId(null), 2000);
                                                                        }, 100);
                                                                    }}
                                                                    isHighlighted={highlightedLeadId === msg.id}
                                                                />
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
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
