
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Mail, Plus, Trash2, LogOut, Youtube, GripVertical, User, Users, CheckCircle2, Clock, Phone, FileText, TrendingUp, MessageSquare, Table, List, AlertCircle, Edit3, PhoneCall, Search, ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen, Megaphone, Zap, Image as ImageIcon, Send, Settings, Link2, FileUp, Eye, Instagram, Linkedin, Slack } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Message } from '../types';

const getEmailLink = (email: string, name: string, isConnected: boolean) => {
    if (isConnected) {
        return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Mavestone Inquiry - Re: ${name}`;
    }
    return `mailto:${email}?subject=Mavestone Inquiry - Re: ${name}`;
};

const CRMLeadItem: React.FC<{ 
    msg: Message; 
    updateMessage: (id: string, data: Partial<Message>) => void; 
    deleteMessage: (id: string) => void; 
    markMessageRead: (id: string) => void; 
    isHighlighted?: boolean;
    onViewContact: (id: string) => void;
    outboundEmails: any[];
}> = ({ msg, updateMessage, deleteMessage, markMessageRead, isHighlighted, onViewContact, outboundEmails }) => {
    const { gmailConfig } = useContent();
    const [localNotes, setLocalNotes] = useState(msg.notes || '');
    const [localValue, setLocalValue] = useState(msg.value || 0);

    useEffect(() => {
        setLocalNotes(msg.notes || '');
    }, [msg.notes]);

    useEffect(() => {
        setLocalValue(msg.value || 0);
    }, [msg.value]);

    return (
        <div id={`lead-${msg.id}`} className={`p-6 rounded-2xl border transition-all ${isHighlighted ? 'ring-2 ring-blue-500 border-blue-500' : ''} ${msg.read ? 'bg-[#0F0F11] border-white/5' : 'bg-[#121214] border-blue-500/30 shadow-lg shadow-blue-500/5'}`}>
            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <button 
                                    onClick={() => onViewContact(msg.id)}
                                    className="text-lg font-bold text-white hover:text-blue-400 transition-colors text-left"
                                >
                                    {msg.name}
                                </button>
                                {msg.company && <span className="text-gray-500 text-sm">@ {msg.company}</span>}
                                {!msg.read && <span className="px-2 py-0.5 bg-blue-500 text-[8px] font-black uppercase tracking-widest rounded text-white">New</span>}
                                <select 
                                    value={msg.lead_type || 'warm'} 
                                    onChange={(e) => updateMessage(msg.id, { lead_type: e.target.value as any })}
                                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border focus:outline-none transition-colors ${
                                        msg.lead_type === 'cold' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                    }`}
                                >
                                    <option value="warm">Warm Lead</option>
                                    <option value="cold">Cold Outreach</option>
                                </select>
                                <select 
                                    value={msg.priority || 'medium'} 
                                    onChange={(e) => updateMessage(msg.id, { priority: e.target.value as any })}
                                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border focus:outline-none transition-colors ${
                                        msg.priority === 'high' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                                        msg.priority === 'low' ? 'bg-gray-500/20 border-gray-500/30 text-gray-400' :
                                        'bg-blue-500/20 border-blue-500/30 text-blue-400'
                                    }`}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                                <select 
                                    value={msg.scope || 'one-off'} 
                                    onChange={(e) => updateMessage(msg.id, { scope: e.target.value as any })}
                                    className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 bg-black/20 text-gray-400 focus:outline-none"
                                >
                                    <option value="one-off">One-off</option>
                                    <option value="retainer">Retainer</option>
                                </select>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                                <a href={`mailto:${msg.email}`} className="text-blue-400 hover:underline flex items-center gap-1"><Mail size={12} /> {msg.email}</a>
                                {msg.phone && <a href={`tel:${msg.phone}`} className="text-gray-400 hover:text-white flex items-center gap-1"><Phone size={12} /> {msg.phone}</a>}
                                <span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> {new Date(msg.created_at).toLocaleDateString()}</span>
                                {msg.source && <span className="text-gray-600 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full text-[10px]"><TrendingUp size={10} /> {msg.source}</span>}
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                            <select 
                                value={msg.status || 'new'} 
                                onChange={(e) => updateMessage(msg.id, { status: e.target.value as any })}
                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border focus:outline-none transition-colors ${
                                    msg.status === 'converted' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                    msg.status === 'contacted' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                                    msg.status === 'qualified' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    msg.status === 'lost' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                }`}
                            >
                                <option value="new">New Lead</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Value:</span>
                                <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-500 text-xs">$</span>
                                    <input 
                                        type="number" 
                                        value={localValue} 
                                        onChange={(e) => setLocalValue(parseInt(e.target.value) || 0)}
                                        onBlur={() => updateMessage(msg.id, { value: localValue })}
                                        className="bg-black/40 border border-white/10 rounded-lg pl-5 pr-2 py-1 text-xs text-white w-24 focus:outline-none focus:border-emerald-500/50"
                                    />
                                    {msg.scope === 'retainer' && <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">p/m</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 p-5 rounded-xl border border-white/5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageSquare size={12} /> Message Content</p>
                        <p className="text-sm text-gray-300 leading-relaxed italic">"{msg.message}"</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={12} /> Internal Notes</label>
                        <textarea 
                            value={localNotes} 
                            onChange={(e) => setLocalNotes(e.target.value)}
                            onBlur={() => updateMessage(msg.id, { notes: localNotes })}
                            placeholder="Add follow-up notes, project scope, or budget details..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-xs text-gray-300 focus:outline-none focus:border-white/20 transition-all min-h-[80px]"
                        />
                    </div>

                    {/* Recent Outbound Activity */}
                    {outboundEmails.filter(e => e.leadId === msg.id || e.leadId === msg.email).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Mail size={10} /> Recent Outbound Activity
                            </h4>
                            <div className="space-y-2">
                                {outboundEmails
                                    .filter(e => e.leadId === msg.id || e.leadId === msg.email)
                                    .slice(0, 2)
                                    .map(email => (
                                        <div key={email.id} className="text-[10px] bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-300">{email.subject}</span>
                                                <span className="text-[8px] text-gray-500">{new Date(email.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-500 line-clamp-1 italic">"{email.thread[email.thread.length - 1].content}"</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
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
                        onClick={() => onViewContact(msg.id)}
                        className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <TrendingUp size={14} /> View History
                    </button>
                    <a 
                        href={getEmailLink(msg.email, msg.name, gmailConfig.isConnected)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                        <Mail size={14} /> Send Email
                    </a>
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
}> = ({ msg, updateMessage, deleteMessage, onEdit, onViewContact }) => {
    const { gmailConfig } = useContent();
    const [localValue, setLocalValue] = useState(msg.value || 0);

    useEffect(() => {
        setLocalValue(msg.value || 0);
    }, [msg.value]);

    return (
        <tr key={msg.id} className="border-t border-white/5 hover:bg-white/[0.01] transition-colors">
            <td className="p-4">
                <button 
                    onClick={() => onViewContact(msg.id)}
                    className="font-bold text-white hover:text-blue-400 transition-colors text-left"
                >
                    {msg.name}
                </button>
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
                    <a 
                        href={getEmailLink(msg.email, msg.name, gmailConfig.isConnected)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                        title="Email"
                    >
                        <Mail size={14} />
                    </a>
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
    automations, updateAutomation, addAutomation, deleteAutomation, newsletters, updateNewsletter, addNewsletter, deleteNewsletter,
    mailingLists, addMailingList, updateMailingList, deleteMailingList, addContactToList, sendNewsletter,
    gmailConfig, connectGmail, disconnectGmail,
    saveChanges, uploadImage,
    isAuthenticated, fetchMessages, messages, outboundCalls, outboundEmails, markMessageRead, updateMessage, deleteMessage, logout
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'shorts' | 'about' | 'crm' | 'communication' | 'automations'>('home');
  const [crmView, setCrmView] = useState<'cards' | 'spreadsheet'>('spreadsheet');
  const [outboundFilter, setOutboundFilter] = useState<'all' | 'warm' | 'cold'>('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [highlightedLeadId, setHighlightedLeadId] = useState<string | null>(null);
  const [crmSort, setCrmSort] = useState<'date' | 'status' | 'priority' | 'value'>('date');
  const [crmSearch, setCrmSearch] = useState('');
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [isSiteChangesOpen, setIsSiteChangesOpen] = useState(true);
  const [automationsTab, setAutomationsTab] = useState<'workflows' | 'newsletters' | 'lists'>('workflows');
  const [commApp, setCommApp] = useState<'gmail' | 'whatsapp'>('gmail');
  const [commSearch, setCommSearch] = useState('');
  const [selectedCommId, setSelectedCommId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previewNewsletterId, setPreviewNewsletterId] = useState<string | null>(null);
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [isGmailSettingsOpen, setIsGmailSettingsOpen] = useState(false);

  useEffect(() => {
      const checkSchema = async () => {
          if (!isAuthenticated || activeTab !== 'crm' || !supabase) return;
          try {
              const { error } = await supabase.from('messages').select('status, notes, priority, value, source, company, phone').limit(1);
              if (error) {
                  setDbStatus('error');
              } else {
                  setDbStatus('ok');
              }
          } catch (e) {
              setDbStatus('error');
          }
      };
      checkSchema();
  }, [isAuthenticated, activeTab]);
  const [processingImage, setProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
      if ((activeTab === 'crm' || activeTab === 'automations') && isAuthenticated) fetchMessages();
  }, [activeTab, isAuthenticated, fetchMessages]);

  const extractYouTubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = url.match(regExp);
    return match?.[8]?.length === 11 ? match[8] : url.trim();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    const client = supabase;
    if (!file || !client) return;
    setProcessingImage(true);
    try {
        const publicUrl = await uploadImage(file);
        if (publicUrl) callback(publicUrl);
    } finally {
        setProcessingImage(false);
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
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            activeTab === id 
            ? 'bg-white text-black font-bold shadow-lg shadow-white/10' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        <Icon size={18} />
        <span className="text-sm tracking-wide">{label}</span>
    </button>
  );

  return (
    <AnimatePresence>
      {isAdminOpen && (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex overflow-hidden font-sans"
        >
            {/* SIDEBAR */}
            <motion.aside 
                initial={false}
                animate={{ 
                    width: isSidebarCollapsed ? 0 : 256,
                    x: isSidebarCollapsed ? -256 : 0
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="flex-shrink-0 border-r border-white/10 bg-[#0A0A0A] flex flex-col justify-between overflow-hidden z-30"
            >
                <div className="p-6 space-y-8 min-w-[256px]">
                    <div className="px-2">
                        <h2 className="text-xl font-bold tracking-tighter text-white">Mavestone<span className="text-white/40">.</span></h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Studio CMS</p>
                    </div>
                    <nav className="space-y-4">
                        <div className="space-y-2">
                            <button 
                                onClick={() => setIsSiteChangesOpen(!isSiteChangesOpen)}
                                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors group"
                            >
                                <span className="group-hover:translate-x-1 transition-transform">Site Changes</span>
                                {isSiteChangesOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                            <AnimatePresence initial={false}>
                                {isSiteChangesOpen && (
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="pt-4 border-t border-white/5 space-y-1">
                            <NavItem id="crm" label="CRM" icon={Users} />
                            <NavItem id="communication" label="Communication" icon={PhoneCall} />
                            <NavItem id="automations" label="Automations" icon={Megaphone} />
                        </div>
                    </nav>
                </div>

                <div className="p-6 space-y-4 min-w-[256px]">
                    {saveError && <div className="text-red-400 text-[10px] px-2">{saveError}</div>}
                    <button onClick={handleSave} className="w-full py-3 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all">
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-end px-2">
                        <button onClick={() => { logout(); handleClose(); }} className="text-gray-500 hover:text-red-400 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold"><LogOut size={16} /> Logout</button>
                    </div>
                    <div className="space-y-2 w-full">
                        <div className="flex items-center justify-end">
                            <button 
                                onClick={() => setIsSidebarCollapsed(true)}
                                className="p-2 text-gray-600 hover:text-white transition-colors"
                                title="Collapse Sidebar"
                            >
                                <PanelLeftClose size={16} />
                            </button>
                        </div>
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
                        className="fixed bottom-8 left-8 z-[110] p-2.5 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                    >
                        <PanelLeftOpen size={16} />
                        <span>Show Sidebar</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto bg-black relative">
                <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white uppercase">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        {processingImage && <span className="flex items-center gap-2 text-blue-400 text-xs font-bold animate-pulse"><Loader2 size={12} className="animate-spin" /> Uploading...</span>}
                        <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                    </div>
                </div>

                <div className="p-8 pb-32 max-w-7xl mx-auto">
                    {/* HOME TAB */}
                    {activeTab === 'home' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-white/5 pb-4">Main Featured Video</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <input type="text" placeholder="Video Title" value={latestVideo.title} onChange={(e) => updateLatestVideo({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                                <input type="text" placeholder="YouTube URL or ID" value={latestVideo.videoId} onChange={(e) => updateLatestVideo({ videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm font-mono text-blue-300 focus:outline-none" />
                                            </div>
                                            <textarea rows={4} placeholder="Description" value={latestVideo.description} onChange={(e) => updateLatestVideo({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Thumbnail URL" value={latestVideo.image} onChange={(e) => updateLatestVideo({ image: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                                <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateLatestVideo({ image: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative group bg-[#0F0F11]">
                                        <img src={latestVideo.image} className="w-full h-full object-cover opacity-80" alt="Preview" />
                                        <div className="absolute inset-0 flex items-center justify-center"><Youtube size={48} className="text-white opacity-40" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ABOUT TAB */}
                    {activeTab === 'about' && (
                        <div className="space-y-8">
                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400 border-b border-white/5 pb-4">Bio Details</h3>
                                        <div className="space-y-4">
                                            <input type="text" placeholder="Subtitle (e.g. 01 / The Visionary)" value={aboutData.subtitle} onChange={(e) => updateAboutData({ subtitle: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                            <textarea rows={6} placeholder="Description" value={aboutData.description} onChange={(e) => updateAboutData({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                            <label className="text-xs text-gray-500 uppercase tracking-widest block mt-4">Testimonials Background</label>
                                            <div className="flex gap-2">
                                                <input type="text" placeholder="Background Image URL" value={aboutData.testimonialsBackground || ''} onChange={(e) => updateAboutData({ testimonialsBackground: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                                <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutData({ testimonialsBackground: url }))} /></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 space-y-4">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] relative group bg-[#0F0F11]">
                                        <img src={aboutData.portrait} className="w-full h-full object-cover" alt="Portrait Preview" />
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold"><Camera size={32} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateAboutData({ portrait: url }))} /></label>
                                    </div>
                                    <input type="text" placeholder="Portrait URL" value={aboutData.portrait} onChange={(e) => updateAboutData({ portrait: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] text-gray-500" />
                                </div>
                             </div>

                             <div className="space-y-6">
                                 <div className="flex justify-between items-center px-2">
                                     <h3 className="text-lg font-bold text-white">Client Reviews (Conveyor)</h3>
                                     <button onClick={() => addTestimonial()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add Review</button>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {aboutData.testimonials.map((t) => (
                                         <div key={t.id} className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 group relative">
                                             <button onClick={() => deleteTestimonial(t.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                             <div className="space-y-4">
                                                 <textarea rows={3} value={t.text} onChange={(e) => updateTestimonial(t.id, { text: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-xs text-white italic" placeholder="Review Text" />
                                                 <div className="flex items-center gap-4">
                                                     <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 group/av">
                                                         <img src={t.avatar} className="w-full h-full object-cover" />
                                                         <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/av:opacity-100 flex items-center justify-center cursor-pointer"><Camera size={14} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateTestimonial(t.id, { avatar: url }))} /></label>
                                                     </div>
                                                     <div className="flex-1 grid grid-cols-2 gap-2">
                                                         <input type="text" value={t.name} onChange={(e) => updateTestimonial(t.id, { name: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="Name" />
                                                         <input type="text" value={t.company} onChange={(e) => updateTestimonial(t.id, { company: e.target.value })} className="bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white" placeholder="Company" />
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* PROJECTS TAB */}
                    {activeTab === 'projects' && (
                        <div className="space-y-8">
                            <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 border-b border-white/5 pb-4">Portfolio Hero Config</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Hero Featured Film</label>
                                        <select value={projectConfig?.featuredFilmId} onChange={(e) => updateProjectConfig({ featuredFilmId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white">
                                            {films.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                        </select>
                                        <input type="text" placeholder="Label (e.g. M ORIGINAL)" value={projectConfig.label} onChange={(e) => updateProjectConfig({ label: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest ml-1">Overlay Logo Image</label>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Logo Image URL" value={projectConfig.logoImage || ''} onChange={(e) => updateProjectConfig({ logoImage: e.target.value })} className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:outline-none" />
                                            <label className="flex items-center px-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer"><Camera size={16} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateProjectConfig({ logoImage: url }))} /></label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-orange-400 border-b border-white/5 pb-4">In Production / Coming Soon</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input type="text" placeholder="Title" value={inProduction.title} onChange={(e) => updateInProduction({ title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                        <input type="text" placeholder="Status (e.g. Post-Production)" value={inProduction.status} onChange={(e) => updateInProduction({ status: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                        <textarea rows={3} placeholder="Description" value={inProduction.description} onChange={(e) => updateInProduction({ description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                            <img src={inProduction.image} className="w-full h-full object-cover" alt="Production Preview" />
                                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateInProduction({ image: url }))} /></label>
                                        </div>
                                        <input type="text" placeholder="Cover URL" value={inProduction.image} onChange={(e) => updateInProduction({ image: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-gray-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-2 pt-8">
                                <h3 className="text-lg font-bold text-white">Selected Works (Originals)</h3>
                                <button onClick={() => addFilm()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add New Project</button>
                            </div>

                            <div className="space-y-6">
                                {films.map((film) => (
                                    <div key={film.id} className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 group">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            <div className="lg:col-span-4 space-y-4">
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                                    <img src={film.image} className="w-full h-full object-cover" alt={film.title} />
                                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateFilm(film.id, { image: url }))} /></label>
                                                </div>
                                                <input type="text" placeholder="Thumbnail URL" value={film.image} onChange={(e) => updateFilm(film.id, { image: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-[10px] text-gray-500" />
                                                <input type="text" placeholder="YouTube URL or ID" value={film.videoId || ''} onChange={(e) => updateFilm(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300" />
                                            </div>
                                            <div className="lg:col-span-8 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <input type="text" placeholder="Project Title" value={film.title} onChange={(e) => updateFilm(film.id, { title: e.target.value })} className="text-xl font-bold bg-transparent text-white border-b border-transparent focus:border-white/20 focus:outline-none w-full mr-4" />
                                                    <button onClick={() => deleteFilm(film.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <input type="text" placeholder="Category" value={film.category} onChange={(e) => updateFilm(film.id, { category: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Tagline" value={film.tagline} onChange={(e) => updateFilm(film.id, { tagline: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Year" value={film.year || ''} onChange={(e) => updateFilm(film.id, { year: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Location" value={film.location || ''} onChange={(e) => updateFilm(film.id, { location: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Film Type (e.g. Feature)" value={film.filmType || ''} onChange={(e) => updateFilm(film.id, { filmType: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Duration (e.g. 1h 20m)" value={film.duration || ''} onChange={(e) => updateFilm(film.id, { duration: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Genres" value={film.genres || ''} onChange={(e) => updateFilm(film.id, { genres: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <textarea rows={3} placeholder="Full Description for Lightbox" value={film.description || ''} onChange={(e) => updateFilm(film.id, { description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center px-2 pt-8 border-t border-white/5 mt-12">
                                <h3 className="text-lg font-bold text-white">Client Work</h3>
                                <button onClick={() => addClientWork()} className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"><Plus size={14} /> Add Client Project</button>
                            </div>

                             <div className="space-y-6">
                                {clientWork.map((film) => (
                                    <div key={film.id} className="p-6 rounded-2xl bg-[#0F0F11] border border-white/5 group">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                            <div className="lg:col-span-4 space-y-4">
                                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                                    <img src={film.image} className="w-full h-full object-cover" alt={film.title} />
                                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><Camera size={24} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateClientWork(film.id, { image: url }))} /></label>
                                                </div>
                                                <input type="text" placeholder="Thumbnail URL" value={film.image} onChange={(e) => updateClientWork(film.id, { image: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-[10px] text-gray-500" />
                                                <input type="text" placeholder="YouTube URL or ID" value={film.videoId || ''} onChange={(e) => updateClientWork(film.id, { videoId: extractYouTubeId(e.target.value) })} className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs font-mono text-blue-300" />
                                            </div>
                                            <div className="lg:col-span-8 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <input type="text" placeholder="Project Title" value={film.title} onChange={(e) => updateClientWork(film.id, { title: e.target.value })} className="text-xl font-bold bg-transparent text-white border-b border-transparent focus:border-white/20 focus:outline-none w-full mr-4" />
                                                    <button onClick={() => deleteClientWork(film.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <input type="text" placeholder="Category" value={film.category} onChange={(e) => updateClientWork(film.id, { category: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Tagline" value={film.tagline} onChange={(e) => updateClientWork(film.id, { tagline: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Year" value={film.year || ''} onChange={(e) => updateClientWork(film.id, { year: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Location" value={film.location || ''} onChange={(e) => updateClientWork(film.id, { location: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Film Type (e.g. Feature)" value={film.filmType || ''} onChange={(e) => updateClientWork(film.id, { filmType: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" placeholder="Duration (e.g. 1h 20m)" value={film.duration || ''} onChange={(e) => updateClientWork(film.id, { duration: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                    <input type="text" placeholder="Genres" value={film.genres || ''} onChange={(e) => updateClientWork(film.id, { genres: e.target.value })} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white" />
                                                </div>
                                                <textarea rows={3} placeholder="Full Description for Lightbox" value={film.description || ''} onChange={(e) => updateClientWork(film.id, { description: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none" />
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

                    {/* CRM TAB */}
                    {activeTab === 'crm' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">Total Leads</p>
                                    <p className="text-2xl font-black text-white">{messages.length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                                    <p className="text-[10px] text-green-400 uppercase tracking-widest font-bold mb-1">New</p>
                                    <p className="text-2xl font-black text-white">{messages.filter(m => m.status === 'new' || !m.status).length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                    <p className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1">Contacted</p>
                                    <p className="text-2xl font-black text-white">{messages.filter(m => m.status === 'contacted').length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                    <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">Converted</p>
                                    <p className="text-2xl font-black text-white">{messages.filter(m => m.status === 'converted').length}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-1">Pipeline Value</p>
                                    <p className="text-2xl font-black text-white">${messages.reduce((acc, m) => acc + (m.value || 0), 0).toLocaleString()}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <p className="text-[10px] text-green-400 uppercase tracking-widest font-bold mb-1">Total Revenue</p>
                                    <p className="text-2xl font-black text-white">${messages.filter(m => m.status === 'converted').reduce((acc, m) => acc + (m.value || 0), 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0F0F11] p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setCrmView('cards')}
                                            className={`p-2 rounded-lg transition-all ${crmView === 'cards' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                            title="Card View"
                                        >
                                            <List size={18} />
                                        </button>
                                        <button 
                                            onClick={() => setCrmView('spreadsheet')}
                                            className={`p-2 rounded-lg transition-all ${crmView === 'spreadsheet' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                            title="Spreadsheet View"
                                        >
                                            <Table size={18} />
                                        </button>
                                    </div>

                                    {dbStatus === 'error' && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold">
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
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-[10px] font-bold">
                                            <CheckCircle2 size={14} />
                                            <span>Database Connected</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                        <input 
                                            type="text"
                                            placeholder="Search leads..."
                                            value={crmSearch}
                                            onChange={(e) => setCrmSearch(e.target.value)}
                                            className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-white/20 w-48 md:w-64"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sort By:</span>
                                        <select 
                                            value={crmSort}
                                            onChange={(e) => setCrmSort(e.target.value as any)}
                                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/20"
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
                                                                setSelectedLeadId(id);
                                                                setActiveTab('communication');
                                                            }}
                                                            outboundEmails={outboundEmails}
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
                                                                        setSelectedLeadId(id);
                                                                        setActiveTab('communication');
                                                                    }}
                                                                    onEdit={(id) => {
                                                                        setHighlightedLeadId(id);
                                                                        setCrmView('cards');
                                                                        setTimeout(() => {
                                                                            document.getElementById(`lead-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                            setTimeout(() => setHighlightedLeadId(null), 2000);
                                                                        }, 100);
                                                                    }}
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

                    {/* COMMUNICATION TAB */}
                    {activeTab === 'communication' && (
                        <div className="flex h-[calc(100vh-160px)] -m-8 bg-[#050505] overflow-hidden">
                            {/* App Sidebar */}
                            <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-[#0A0A0A] rounded-r-[2rem] z-10 shadow-2xl">
                                <button 
                                    onClick={() => setCommApp('gmail')}
                                    className={`p-4 rounded-2xl transition-all duration-300 ${commApp === 'gmail' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-110' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    title="Gmail"
                                >
                                    <Mail size={24} />
                                </button>
                                <button 
                                    onClick={() => setCommApp('whatsapp')}
                                    className={`p-4 rounded-2xl transition-all duration-300 ${commApp === 'whatsapp' ? 'bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20 scale-110' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    title="WhatsApp"
                                >
                                    <MessageSquare size={24} />
                                </button>
                                <div className="mt-auto flex flex-col gap-8 pb-6">
                                    <button className="p-4 text-gray-800 cursor-not-allowed opacity-20" title="Instagram"><Instagram size={24} /></button>
                                    <button className="p-4 text-gray-800 cursor-not-allowed opacity-20" title="LinkedIn"><Linkedin size={24} /></button>
                                    <button className="p-4 text-gray-800 cursor-not-allowed opacity-20" title="Slack"><Slack size={24} /></button>
                                </div>
                            </div>

                            {/* Inbox Content */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Message List */}
                                <div className={`flex-1 flex flex-col border-r border-white/5 transition-all duration-500 ${selectedCommId ? 'max-w-md' : 'max-w-none'}`}>
                                    {/* Search Bar Area */}
                                    <div className="p-6 border-b border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
                                                <Search size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="Search all communication..."
                                                value={commSearch}
                                                onChange={(e) => setCommSearch(e.target.value)}
                                                className="w-full bg-[#151515] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Inbox List */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        <div className="flex items-center justify-between px-2 mb-4">
                                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">
                                                {commApp === 'gmail' ? 'Gmail' : 'WhatsApp'}
                                            </h2>
                                            <div className="flex items-center gap-1">
                                                {['all', 'warm', 'cold'].map(f => (
                                                    <button 
                                                        key={f}
                                                        onClick={() => setOutboundFilter(f as any)}
                                                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${outboundFilter === f ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {commApp === 'gmail' ? (
                                            [...outboundEmails]
                                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .filter(e => (!selectedLeadId || e.leadId === selectedLeadId) && (outboundFilter === 'all' || e.type === (outboundFilter === 'warm' ? 'inbound' : 'outreach')))
                                                .filter(e => 
                                                    e.leadName.toLowerCase().includes(commSearch.toLowerCase()) || 
                                                    e.subject.toLowerCase().includes(commSearch.toLowerCase()) ||
                                                    e.thread.some(m => m.content.toLowerCase().includes(commSearch.toLowerCase()))
                                                )
                                                .map(email => (
                                                    <motion.div 
                                                        layout
                                                        key={email.id} 
                                                        onClick={() => setSelectedCommId(email.id)}
                                                        className={`p-4 rounded-2xl border transition-all group cursor-pointer ${
                                                            selectedCommId === email.id 
                                                            ? 'bg-red-500/10 border-red-500/30' 
                                                            : 'bg-[#0F0F11] border-white/5 hover:border-red-500/20 hover:bg-[#151517]'
                                                        }`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-sm border border-red-500/20">
                                                                {email.leadName.charAt(0)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-0.5">
                                                                    <h4 className="font-bold text-white truncate text-sm">{email.leadName}</h4>
                                                                    <span className="text-[9px] text-gray-600 whitespace-nowrap ml-2">{new Date(email.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <p className="text-[11px] text-gray-400 font-medium truncate mb-1">{email.subject}</p>
                                                                <p className="text-[10px] text-gray-500 line-clamp-1 opacity-60">{email.thread[email.thread.length - 1]?.content}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                        ) : (
                                            [...outboundCalls]
                                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .filter(c => !selectedLeadId || c.leadId === selectedLeadId)
                                                .filter(c => c.leadName.toLowerCase().includes(commSearch.toLowerCase()) || c.transcript.toLowerCase().includes(commSearch.toLowerCase()))
                                                .map(call => (
                                                    <motion.div 
                                                        layout
                                                        key={call.id} 
                                                        onClick={() => setSelectedCommId(call.id)}
                                                        className={`p-4 rounded-2xl border transition-all group cursor-pointer ${
                                                            selectedCommId === call.id 
                                                            ? 'bg-[#25D366]/10 border-[#25D366]/30' 
                                                            : 'bg-[#0F0F11] border-white/5 hover:border-[#25D366]/20 hover:bg-[#151517]'
                                                        }`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] font-bold text-sm border border-[#25D366]/20">
                                                                {call.leadName.charAt(0)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-0.5">
                                                                    <h4 className="font-bold text-white truncate text-sm">{call.leadName}</h4>
                                                                    <span className="text-[9px] text-gray-600 whitespace-nowrap ml-2">{new Date(call.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <p className="text-[10px] text-gray-500 line-clamp-2 opacity-60 italic">"{call.transcript}"</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                        )}
                                    </div>
                                </div>

                                {/* Message Detail View */}
                                <AnimatePresence mode="wait">
                                    {selectedCommId ? (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex-1 flex flex-col bg-[#080808]"
                                        >
                                            {commApp === 'gmail' ? (
                                                (() => {
                                                    const email = outboundEmails.find(e => e.id === selectedCommId);
                                                    if (!email) return null;
                                                    return (
                                                        <>
                                                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 font-bold text-xl border border-red-500/20">
                                                                        {email.leadName.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-white text-lg">{email.leadName}</h3>
                                                                        <p className="text-xs text-gray-500">{email.subject}</p>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => setSelectedCommId(null)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                                                            </div>
                                                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                                                {email.thread.map((msg, idx) => (
                                                                    <div key={idx} className={`flex flex-col ${msg.from === 'hello@mavestone.com' ? 'items-end' : 'items-start'}`}>
                                                                        <div className="flex items-center gap-2 mb-2 px-1">
                                                                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{msg.from === 'hello@mavestone.com' ? 'You' : email.leadName}</span>
                                                                            <span className="text-[10px] text-gray-700">{new Date(msg.timestamp).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed ${
                                                                            msg.from === 'hello@mavestone.com' 
                                                                            ? 'bg-red-500/10 border border-red-500/20 text-red-50 shadow-xl shadow-red-500/5 rounded-tr-none' 
                                                                            : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                                                                        }`}>
                                                                            {msg.content}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="p-6 border-t border-white/5 bg-[#0A0A0A]">
                                                                <div className="relative">
                                                                    <textarea 
                                                                        placeholder="Write a reply..."
                                                                        value={replyContent}
                                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                                        rows={4}
                                                                        className="w-full bg-[#151515] border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all resize-none"
                                                                    />
                                                                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                                                        <button 
                                                                            onClick={async () => {
                                                                                if (!replyContent.trim()) return;
                                                                                setIsSendingReply(true);
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
                                                                                            to: email.thread[0].from === 'hello@mavestone.com' ? email.thread[0].to : email.thread[0].from,
                                                                                            subject: `Re: ${email.subject}`,
                                                                                            content: replyContent,
                                                                                            threadId: email.threadId
                                                                                        })
                                                                                    });
                                                                                    if (response.ok) {
                                                                                        setReplyContent('');
                                                                                        fetchMessages();
                                                                                    }
                                                                                } finally {
                                                                                    setIsSendingReply(false);
                                                                                }
                                                                            }}
                                                                            disabled={isSendingReply || !replyContent.trim()}
                                                                            className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                                                                        >
                                                                            {isSendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                                            Send Reply
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })()
                                            ) : (
                                                (() => {
                                                    const call = outboundCalls.find(c => c.id === selectedCommId);
                                                    if (!call) return null;
                                                    return (
                                                        <>
                                                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] font-bold text-xl border border-[#25D366]/20">
                                                                        {call.leadName.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-white text-lg">{call.leadName}</h3>
                                                                        <p className="text-xs text-gray-500">WhatsApp Call / Transcript</p>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => setSelectedCommId(null)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                                                            </div>
                                                            <div className="flex-1 overflow-y-auto p-8">
                                                                <div className="max-w-2xl mx-auto space-y-8">
                                                                    <div className="p-8 rounded-3xl bg-[#25D366]/5 border border-[#25D366]/10 space-y-6">
                                                                        <div className="flex items-center justify-between border-b border-[#25D366]/10 pb-4">
                                                                            <div className="flex items-center gap-2 text-[#25D366]">
                                                                                <PhoneCall size={16} />
                                                                                <span className="text-xs font-black uppercase tracking-widest">Call Details</span>
                                                                            </div>
                                                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(call.timestamp).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-8">
                                                                            <div>
                                                                                <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Duration</p>
                                                                                <p className="text-white font-mono">{call.duration}</p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Status</p>
                                                                                <span className="px-2 py-0.5 rounded bg-[#25D366]/10 text-[#25D366] text-[10px] font-black uppercase tracking-widest">{call.status}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="pt-6 border-t border-[#25D366]/10">
                                                                            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-4 flex items-center gap-2"><MessageSquare size={12} /> AI Transcript</p>
                                                                            <p className="text-sm text-gray-300 leading-relaxed italic">"{call.transcript}"</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })()
                                            )}
                                        </motion.div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center bg-[#080808]">
                                            <div className="text-center space-y-4 opacity-20">
                                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                    {commApp === 'gmail' ? <Mail size={48} /> : <MessageSquare size={48} />}
                                                </div>
                                                <p className="text-white font-bold tracking-widest uppercase text-xs">Select a message to view</p>
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* AUTOMATIONS TAB */}
                    {activeTab === 'automations' && (
                        <div className="space-y-12">
                            <header className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-bold tracking-tighter text-white uppercase">Automations<span className="text-emerald-500">.</span></h2>
                                    <button 
                                        onClick={() => setIsGmailSettingsOpen(true)}
                                        className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                        title="Gmail Settings"
                                    >
                                        <Settings size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                    {[
                                        { id: 'workflows', label: 'Workflows', icon: Zap },
                                        { id: 'newsletters', label: 'Newsletters', icon: Megaphone },
                                        { id: 'lists', label: 'Mailing Lists', icon: Users }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setAutomationsTab(tab.id as any)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                automationsTab === tab.id 
                                                ? 'bg-white text-black' 
                                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <tab.icon size={14} /> {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </header>

                            {automationsTab === 'workflows' && (
                                <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="text-yellow-400" /> Automated Workflows</h3>
                                    <button onClick={addAutomation} className="px-6 py-2 bg-yellow-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600 transition-all flex items-center gap-2">
                                        <Plus size={14} /> New Workflow
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {automations.map(auto => (
                                        <div key={auto.id} className="p-6 rounded-3xl bg-[#0F0F11] border border-white/5 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2 flex-1 mr-4">
                                                    <input 
                                                        type="text"
                                                        value={auto.name}
                                                        onChange={(e) => updateAutomation(auto.id, { name: e.target.value })}
                                                        className="text-lg font-bold text-white bg-transparent border-none p-0 focus:outline-none w-full"
                                                    />
                                                    <div className="flex items-center gap-3">
                                                        <select 
                                                            value={auto.trigger}
                                                            onChange={(e) => updateAutomation(auto.id, { trigger: e.target.value as any })}
                                                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[8px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none"
                                                        >
                                                            <option value="new_lead">New Lead</option>
                                                            <option value="newsletter_signup">Newsletter Signup</option>
                                                            <option value="manual">Manual</option>
                                                        </select>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Delay:</span>
                                                            <input 
                                                                type="number"
                                                                value={auto.delayDays || 0}
                                                                onChange={(e) => updateAutomation(auto.id, { delayDays: parseInt(e.target.value) })}
                                                                className="w-12 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[8px] font-bold text-gray-300 focus:outline-none"
                                                            />
                                                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Days</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button 
                                                        onClick={() => updateAutomation(auto.id, { isActive: !auto.isActive })}
                                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                            auto.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-500 border border-white/10'
                                                        }`}
                                                    >
                                                        {auto.isActive ? 'Active' : 'Paused'}
                                                    </button>
                                                    <button onClick={() => deleteAutomation(auto.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Subject</label>
                                                    <input 
                                                        type="text"
                                                        value={auto.subject}
                                                        onChange={(e) => updateAutomation(auto.id, { subject: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Content</label>
                                                    <textarea 
                                                        value={auto.content}
                                                        onChange={(e) => updateAutomation(auto.id, { content: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-white/20 min-h-[120px]"
                                                    />
                                                    <p className="text-[10px] text-gray-600 italic">Tip: Use {"{{name}}"} to personalize the email.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            )}

                            {automationsTab === 'lists' && (
                                <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-purple-400" /> Mailing Lists</h3>
                                    <div className="flex items-center gap-3">
                                        <label className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer">
                                            <FileUp size={14} /> Import CSV
                                            <input 
                                                type="file" 
                                                accept=".csv" 
                                                className="hidden" 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (event) => {
                                                            const text = event.target?.result as string;
                                                            const lines = text.split('\n');
                                                            const contacts = lines.slice(1).map(line => {
                                                                const [name, email] = line.split(',');
                                                                return { name: name?.trim(), email: email?.trim() };
                                                            }).filter(c => c.name && c.email);
                                                            addMailingList(`Imported ${new Date().toLocaleDateString()}`, contacts);
                                                        };
                                                        reader.readAsText(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <button onClick={() => addMailingList("New List")} className="px-6 py-2 bg-purple-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all flex items-center gap-2">
                                            <Plus size={14} /> Create List
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mailingLists.map(list => (
                                        <div key={list.id} className="p-6 rounded-3xl bg-[#0F0F11] border border-white/5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <input 
                                                    type="text"
                                                    value={list.name}
                                                    onChange={(e) => updateMailingList(list.id, { name: e.target.value })}
                                                    className="bg-transparent border-none p-0 font-bold text-white focus:outline-none"
                                                    disabled={list.id === 'all-crm'}
                                                />
                                                {list.id !== 'all-crm' && (
                                                    <button onClick={() => deleteMailingList(list.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{list.contacts.length} Contacts</p>
                                                <div className="flex -space-x-2">
                                                    {list.contacts.slice(0, 3).map((c, i) => (
                                                        <div key={i} className="w-6 h-6 rounded-full bg-purple-500/20 border border-[#0F0F11] flex items-center justify-center text-[8px] font-bold text-purple-400">
                                                            {c.name[0]}
                                                        </div>
                                                    ))}
                                                    {list.contacts.length > 3 && (
                                                        <div className="w-6 h-6 rounded-full bg-white/5 border border-[#0F0F11] flex items-center justify-center text-[8px] font-bold text-gray-400">
                                                            +{list.contacts.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/5 space-y-3">
                                                <div className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Name" 
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                const name = (e.target as HTMLInputElement).value;
                                                                const emailInput = (e.target as HTMLInputElement).nextElementSibling as HTMLInputElement;
                                                                const email = emailInput.value;
                                                                if (name && email) {
                                                                    addContactToList(list.id, { name, email });
                                                                    (e.target as HTMLInputElement).value = '';
                                                                    emailInput.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <input 
                                                        type="email" 
                                                        placeholder="Email" 
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                const email = (e.target as HTMLInputElement).value;
                                                                const nameInput = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
                                                                const name = nameInput.value;
                                                                if (name && email) {
                                                                    addContactToList(list.id, { name, email });
                                                                    (e.target as HTMLInputElement).value = '';
                                                                    nameInput.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-[8px] text-gray-600 uppercase tracking-widest">Or add from CRM:</p>
                                                    <select 
                                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[8px] font-bold text-gray-400 uppercase tracking-widest focus:outline-none max-w-[120px]"
                                                        onChange={(e) => {
                                                            const email = e.target.value;
                                                            const contact = messages.find(m => m.email === email);
                                                            if (contact) {
                                                                addContactToList(list.id, { name: contact.name, email: contact.email });
                                                            }
                                                            e.target.value = '';
                                                        }}
                                                    >
                                                        <option value="">Select Contact</option>
                                                        {messages.filter(m => !list.contacts.some(c => c.email === m.email)).map(m => (
                                                            <option key={m.id} value={m.email}>{m.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            )}

                            {automationsTab === 'newsletters' && (
                                <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Megaphone className="text-blue-400" /> Monthly Newsletters</h3>
                                    <button onClick={addNewsletter} className="px-6 py-2 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
                                        <Plus size={14} /> Create Newsletter
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {newsletters.length === 0 ? (
                                        <div className="py-24 text-center bg-[#0F0F11] rounded-3xl border border-white/5">
                                            <Megaphone className="mx-auto w-12 h-12 text-gray-800 mb-4" />
                                            <p className="text-gray-500">No newsletters created yet.</p>
                                        </div>
                                    ) : (
                                        newsletters.map(news => (
                                            <div key={news.id} className="p-8 rounded-3xl bg-[#0F0F11] border border-white/5 space-y-8">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <input 
                                                            type="text"
                                                            value={news.title}
                                                            onChange={(e) => updateNewsletter(news.id, { title: e.target.value })}
                                                            className="text-2xl font-bold bg-transparent border-none p-0 focus:outline-none text-white w-full"
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                                                news.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                                                            }`}>
                                                                {news.status}
                                                            </span>
                                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Last Edited: {new Date().toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                            <div className="flex items-center gap-3">
                                                                <select 
                                                                    value={news.targetListId || ''}
                                                                    onChange={(e) => updateNewsletter(news.id, { targetListId: e.target.value })}
                                                                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] font-bold text-gray-300 uppercase tracking-widest focus:outline-none"
                                                                >
                                                                    <option value="">Select List</option>
                                                                    {mailingLists.map(l => (
                                                                        <option key={l.id} value={l.id}>{l.name}</option>
                                                                    ))}
                                                                </select>
                                                                <button 
                                                                    disabled={isSendingNewsletter || !news.targetListId}
                                                                    onClick={async () => {
                                                                        setIsSendingNewsletter(true);
                                                                        const res = await sendNewsletter(news.id);
                                                                        setIsSendingNewsletter(false);
                                                                        if (res.success) alert(`Sent to ${res.count} contacts!`);
                                                                        else alert(`Failed to send newsletter: ${res.error || 'Check Gmail connection'}`);
                                                                    }}
                                                                    className={`px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 ${isSendingNewsletter || !news.targetListId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                >
                                                                    <Send size={14} /> {isSendingNewsletter ? 'Sending...' : 'Send Now'}
                                                                </button>
                                                                <button onClick={() => deleteNewsletter(news.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                                            </div>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                                    <div className="lg:col-span-8 space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject Line</label>
                                                            <input 
                                                                type="text"
                                                                value={news.subject}
                                                                onChange={(e) => updateNewsletter(news.id, { subject: e.target.value })}
                                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Newsletter Body (HTML Supported)</label>
                                                            <textarea 
                                                                value={news.content}
                                                                onChange={(e) => updateNewsletter(news.id, { content: e.target.value })}
                                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-white/20 min-h-[300px] font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="lg:col-span-4 space-y-6">
                                                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={12} /> Newsletter Assets</h4>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {news.images.map((img, idx) => (
                                                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group">
                                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                                        <button 
                                                                            onClick={() => updateNewsletter(news.id, { images: news.images.filter((_, i) => i !== idx) })}
                                                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <label className="aspect-square rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-white hover:border-white/20 cursor-pointer transition-all">
                                                                    <Plus size={20} />
                                                                    <span className="text-[8px] font-bold uppercase tracking-widest">Add Photo</span>
                                                                    <input 
                                                                        type="file" 
                                                                        className="hidden" 
                                                                        onChange={async (e) => {
                                                                            const file = e.target.files?.[0];
                                                                            if (file) {
                                                                                const url = await uploadImage(file);
                                                                                if (url) updateNewsletter(news.id, { images: [...news.images, url] });
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Settings size={12} /> Sending Options</h4>
                                                            <div className="space-y-4">
                                                                <button 
                                                                    onClick={() => setPreviewNewsletterId(news.id)}
                                                                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-300 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <Eye size={14} /> Preview Email
                                                                </button>
                                                                <button 
                                                                    onClick={async () => {
                                                                        if (!gmailConfig.isConnected) return alert("Connect Gmail first");
                                                                        const tokens = localStorage.getItem('gmail_tokens');
                                                                        const res = await fetch('/api/gmail/send', {
                                                                            method: 'POST',
                                                                            headers: { 
                                                                                'Content-Type': 'application/json',
                                                                                ...(tokens ? { 'x-gmail-tokens': tokens } : {})
                                                                            },
                                                                            credentials: 'include',
                                                                            body: JSON.stringify({
                                                                                to: 'hello@mavestone.com',
                                                                                subject: `[TEST] ${news.subject}`,
                                                                                content: news.content.replace('{{name}}', 'Liam')
                                                                            })
                                                                        });
                                                                        if (res.ok) alert("Test email sent to hello@mavestone.com");
                                                                        else {
                                                                            const err = await res.json();
                                                                            alert(`Failed to send test email: ${err.details || err.error}`);
                                                                        }
                                                                    }}
                                                                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-300 uppercase tracking-widest hover:bg-white/10 transition-all"
                                                                >
                                                                    Send Test to Me
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                )}
                {/* Newsletter Preview Modal */}
                <AnimatePresence>
                    {previewNewsletterId && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                            >
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="w-full max-w-4xl bg-[#0F0F11] rounded-3xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
                                >
                                    <div className="p-6 border-bottom border-white/5 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-white">Email Preview</h3>
                                        <button onClick={() => setPreviewNewsletterId(null)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-8 bg-white">
                                        <div className="max-w-2xl mx-auto text-black">
                                            <div className="mb-8 pb-8 border-b border-gray-100">
                                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                                                <p className="text-lg font-bold">{newsletters.find(n => n.id === previewNewsletterId)?.subject}</p>
                                            </div>
                                            <div 
                                                className="prose prose-sm max-w-none newsletter-preview"
                                                dangerouslySetInnerHTML={{ __html: newsletters.find(n => n.id === previewNewsletterId)?.content.replace('{{name}}', 'Liam') || '' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Gmail Settings Modal */}
                    <AnimatePresence>
                        {isGmailSettingsOpen && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                            >
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="w-full max-w-lg bg-[#0F0F11] rounded-3xl border border-white/10 overflow-hidden"
                                >
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Mail className="text-red-400" /> Gmail Integration</h3>
                                        <button onClick={() => setIsGmailSettingsOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        {gmailConfig.isConnected ? (
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                        <CheckCircle2 size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Connected</p>
                                                        <p className="text-white font-medium">{gmailConfig.email}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">Your Gmail account is linked. You can now send newsletters and automated emails directly from the dashboard.</p>
                                                <button 
                                                    onClick={() => {
                                                        disconnectGmail();
                                                        setIsGmailSettingsOpen(false);
                                                    }} 
                                                    className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                                                >
                                                    Disconnect Account
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6 text-center">
                                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-600">
                                                    <Mail size={40} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-lg font-bold text-white">Link your Gmail</h4>
                                                    <p className="text-sm text-gray-500">Connect your account to enable automated welcome emails, newsletters, and client communication tracking.</p>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        connectGmail();
                                                        setIsGmailSettingsOpen(false);
                                                    }} 
                                                    className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Link2 size={18} /> Connect Gmail Account
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
