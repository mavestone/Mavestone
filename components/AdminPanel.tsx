
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { X, Save, Camera, Loader2, Layout, Clapperboard, Mail, Plus, Trash2, LogOut, Youtube, GripVertical, User, Users, CheckCircle2, Clock, Phone, FileText, TrendingUp, MessageSquare, Table, List, AlertCircle, Edit3, PhoneCall, Search, ChevronDown, PanelLeftClose, PanelLeftOpen, Megaphone, Zap, Image as ImageIcon, Send, Settings, Link2, FileUp, Eye, Sparkles, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Message } from '../types';
import { AnimatedAIChat } from './ui/animated-ai-chat';

const GmailIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.16 1.075 3 1.5 3H3.9l8.1 5.85L20.1 3H22.5c.425 0 .8.162 1.069.432.27.268.431.643.431 1.068z"/>
    </svg>
);

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const SMSIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

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
    outboundEmails: any[];
    onSendEmail: (email: string, name: string) => void;
}> = ({ msg, updateMessage, deleteMessage, markMessageRead, isHighlighted, onViewContact, outboundEmails, onSendEmail }) => {
    const [localNotes, setLocalNotes] = useState(msg.notes || '');
    const [localValue, setLocalValue] = useState(msg.value || 0);
    const [isAiDrafting, setIsAiDrafting] = useState(false);

    const handleAiAnalyze = async () => {
        setIsAiDrafting(true);
        try {
            const { GoogleGenAI } = await import("@google/genai");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [{
                    role: 'user',
                    parts: [{ text: `Analyze this lead: Name: ${msg.name}, Message: "${msg.message}", Notes: "${msg.notes || 'None'}", Value: $${msg.value || 0}. System: Analyze the lead and provide a 2-sentence summary with a suggested priority (low/medium/high) and next best action.` }]
                }]
            });
            const analysis = response.text || '';
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
                    <button 
                        onClick={() => onSendEmail(msg.email, msg.name)}
                        className="w-full py-3 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <Mail size={14} /> Send Email
                    </button>
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
    onSendEmail: (email: string, name: string) => void;
    isHighlighted?: boolean;
}> = ({ msg, updateMessage, deleteMessage, onEdit, onViewContact, onSendEmail, isHighlighted }) => {
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
                    <button 
                        onClick={() => onSendEmail(msg.email, msg.name)}
                        className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                        title="Email"
                    >
                        <Mail size={14} />
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
    automations, updateAutomation, addAutomation, deleteAutomation, newsletters, updateNewsletter, addNewsletter, deleteNewsletter,
    mailingLists, addMailingList, updateMailingList, deleteMailingList, addContactToList,
    gmailConfig, connectGmail, disconnectGmail,
    saveChanges, uploadImage,
    isAuthenticated, fetchMessages, messages, outboundEmails, addOutboundEmail, markMessageRead, updateMessage, deleteMessage, logout
  } = useContent();

  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'shorts' | 'about' | 'crm' | 'communication' | 'automations' | 'agent' | 'production'>('home');
  
  // Production State
  const [productionItems, setProductionItems] = useState<any[]>([
    {id:1,title:'LinkedIn Monetisation',cat:'education',status:'idea',platforms:['LinkedIn'],date:'',notes:'',comments:[]},
    {id:2,title:'Why Every Social Media Editor Needs to Step Up Their Game',cat:'education',status:'idea',platforms:['LinkedIn','TikTok','Instagram Reels'],date:'',notes:'',comments:[]},
    {id:3,title:'Being a Creative in 2025',cat:'lifestyle',status:'idea',platforms:[],date:'',notes:'',comments:[]},
    {id:4,title:'MAVESTONE BRAND FILM',cat:'brand',status:'idea',platforms:[],date:'',notes:'',comments:[]},
    {id:5,title:'23 | E01',cat:'documentary',status:'idea',platforms:['Instagram Reels'],date:'',notes:'First episode of the 23 series.',comments:[]},
    {id:6,title:'Hey Amara — Episode 1',cat:'documentary',status:'scripted',platforms:['YouTube'],date:'2026-03-25',notes:'Harvey intro, Bali office, remote recruitment angle. Open on the traffic noise, not a talking head.',comments:[]},
  ]);
  const [productionView, setProductionView] = useState<'kanban' | 'table' | 'calendar'>('kanban');
  const [activeProductionId, setActiveProductionId] = useState<number | null>(null);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [newProductionStatus, setNewProductionStatus] = useState<string>('idea');
  const [newProductionDate, setNewProductionDate] = useState('');
  const [newProductionTitle, setNewProductionTitle] = useState('');
  const [calY, setCalY] = useState(new Date().getFullYear());
  const [calM, setCalM] = useState(new Date().getMonth());
  const [productionComment, setProductionComment] = useState('');

  const updateProductionItem = (id: number, data: any) => {
    setProductionItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const addProductionItem = () => {
    if (!newProductionTitle.trim()) return;
    const newItem = {
        id: Date.now(),
        title: newProductionTitle,
        cat: '',
        status: newProductionStatus,
        platforms: [],
        date: newProductionDate,
        notes: '',
        comments: []
    };
    setProductionItems(prev => [...prev, newItem]);
    setIsProductionModalOpen(false);
    setNewProductionTitle('');
  };

  const deleteProductionItem = (id: number) => {
    setProductionItems(prev => prev.filter(item => item.id !== id));
    setActiveProductionId(null);
  };
  const [crmView, setCrmView] = useState<'cards' | 'spreadsheet'>('spreadsheet');
  const [outboundFilter, setOutboundFilter] = useState<'all' | 'warm' | 'cold'>('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [highlightedLeadId, setHighlightedLeadId] = useState<string | null>(null);
  const [crmSort, setCrmSort] = useState<'date' | 'status' | 'priority' | 'value'>('date');
  const [crmSearch, setCrmSearch] = useState('');
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [automationsTab, setAutomationsTab] = useState<'workflows' | 'newsletters' | 'lists'>('workflows');
  const [commApp, setCommApp] = useState<'gmail' | 'whatsapp' | 'instagram' | 'sms'>('gmail');
  const [commSearch, setCommSearch] = useState('');
  const [selectedCommId, setSelectedCommId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previewNewsletterId, setPreviewNewsletterId] = useState<string | null>(null);
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [isGmailSettingsOpen, setIsGmailSettingsOpen] = useState(false);
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['content', 'operations']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
        prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [isSendingCompose, setIsSendingCompose] = useState(false);

  const handleSendEmail = (email: string, name: string) => {
    setActiveTab('communication');
    setCommApp('gmail');
    setComposeTo(email);
    setComposeSubject(`Re: Inquiry from ${name}`);
    setComposeContent('');
    setIsComposeOpen(true);
  };

  const handleAiReply = async () => {
    if (!selectedCommId) return;
    
    // Find the email thread first
    const email = outboundEmails.find(e => e.id === selectedCommId);
    if (!email) return;

    // Find the associated lead
    const lead = messages.find(m => m.id === email.leadId || m.email === email.leadId);

    setIsAiReplying(true);
    try {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '' });
        
        // Get the last message from the lead to provide context
        const lastLeadMessage = [...email.thread].reverse().find(m => m.from !== 'hello@mavestone.com');
        const threadHistory = email.thread.map(m => `${m.from === 'hello@mavestone.com' ? 'Liam (Mavestone)' : email.leadName}: ${m.content}`).join('\n');

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{
                role: 'user',
                parts: [{ text: `Generate a professional reply to ${email.leadName}. 
                
Context:
Last message from lead: "${lastLeadMessage?.content || 'No previous message'}"
Full Conversation History:
${threadHistory}

Lead Details:
Name: ${email.leadName}
Notes: "${lead?.notes || 'None'}"

System: You are Liam from Mavestone. Draft a professional, helpful, and concise email reply. Use a friendly tone. Sign off as Liam.` }]
            }]
        });
        setReplyContent(response.text || '');
    } catch (error) {
        console.error("AI Reply failed:", error);
    } finally {
        setIsAiReplying(false);
    }
  };
  const [agentMessages, setAgentMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [selectedAgentModel] = useState('gemini-3-flash-preview');

  const handleAgentSend = async (content: string) => {
    const userMessage = { role: 'user' as const, content };
    const newMessages = [...agentMessages, userMessage];
    setAgentMessages(newMessages);
    setIsAgentLoading(true);

    try {
        const { GoogleGenAI, Type } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        const tools: any = [
          {
            functionDeclarations: [
              {
                name: "searchLeads",
                description: "Search for leads in the CRM by name or email.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    query: { type: Type.STRING, description: "The name or email to search for." }
                  },
                  required: ["query"]
                }
              },
              {
                name: "getLeadDetails",
                description: "Get detailed information about a specific lead, including their message history and internal notes.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    leadId: { type: Type.STRING, description: "The unique ID of the lead." }
                  },
                  required: ["leadId"]
                }
              },
              {
                name: "sendEmail",
                description: "Send an email to a lead using the connected Gmail account.",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    leadId: { type: Type.STRING, description: "The ID of the lead to email." },
                    subject: { type: Type.STRING, description: "The subject line of the email." },
                    body: { type: Type.STRING, description: "The body content of the email." }
                  },
                  required: ["leadId", "subject", "body"]
                }
              }
            ]
          }
        ];

        const systemInstruction = "You are Ava, a world-class studio assistant for Mavestone. You have access to the CRM and can search for leads, get their details (including notes), and send emails via Gmail. When a user asks about a lead or client, use the searchLeads tool first. If you find a lead, use getLeadDetails to see their history and notes. You can then draft and send emails using the sendEmail tool. IMPORTANT: When mentioning a lead in your response, ALWAYS format their name as a markdown link using the lead ID, like this: [Lead Name](lead:lead_id). This allows the user to click the name to view the lead in the CRM. Always be professional, helpful, and concise.";

        let response = await ai.models.generateContent({
            model: selectedAgentModel,
            contents: newMessages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            })),
            config: { 
              tools,
              systemInstruction
            }
        });

        let functionCalls = response.functionCalls;
        
        if (functionCalls) {
          const functionResponses = [];
          for (const call of functionCalls) {
            let result;
            const args = call.args as any;
            if (call.name === "searchLeads") {
              const query = args.query?.toLowerCase() || '';
              result = messages.filter(m => 
                m.name.toLowerCase().includes(query) || 
                m.email.toLowerCase().includes(query)
              ).map(m => ({ id: m.id, name: m.name, email: m.email, status: m.status, lead_type: m.lead_type }));
            } else if (call.name === "getLeadDetails") {
              const lead = messages.find(m => m.id === args.leadId);
              result = lead || { error: "Lead not found" };
            } else if (call.name === "sendEmail") {
              const lead = messages.find(m => m.id === args.leadId);
              if (!lead) {
                result = { error: "Lead not found" };
              } else {
                const tokens = localStorage.getItem('gmail_tokens');
                const emailRes = await fetch('/api/gmail/send', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    ...(tokens ? { 'x-gmail-tokens': tokens } : {})
                  },
                  body: JSON.stringify({
                    to: lead.email,
                    subject: args.subject,
                    content: args.body
                  })
                });
                if (emailRes.ok) {
                  const { threadId } = await emailRes.json();
                  addOutboundEmail({
                    id: Math.random().toString(36).substr(2, 9),
                    leadId: lead.id,
                    leadName: lead.name,
                    subject: args.subject,
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                    type: 'outreach',
                    threadId,
                    thread: [{
                      from: 'hello@mavestone.com',
                      to: lead.email,
                      timestamp: new Date().toISOString(),
                      content: args.body
                    }]
                  });
                  result = { success: true, message: `Email sent to ${lead.name}` };
                } else {
                  const err = await emailRes.json();
                  result = { error: `Failed to send email: ${err.details || err.error}` };
                }
              }
            }
            
            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: { content: result }
              }
            });
          }

          // Get final response from model after function execution
          const modelTurn = response.candidates?.[0]?.content;
          if (modelTurn) {
            response = await ai.models.generateContent({
              model: selectedAgentModel,
              contents: [
                ...newMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
                modelTurn,
                { role: 'user', parts: functionResponses }
              ],
              config: { 
                tools,
                systemInstruction
              }
            });
          }
        }

        const assistantMessage = response.text || "I've processed your request.";
        setAgentMessages([...newMessages, { role: 'assistant' as const, content: assistantMessage }]);
    } catch (error: any) {
        console.error('Error in Agent chat:', error);
        let errorMessage = `Error: ${error.message}. Please ensure your API key is configured.`;
        
        // Handle 429 Resource Exhausted
        if (error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED') {
            const retryMatch = error.message?.match(/retry in ([\d.]+s)/);
            const retryTime = retryMatch ? retryMatch[1] : 'a few seconds';
            errorMessage = `⚠️ Quota Exceeded for ${selectedAgentModel}. Please retry in ${retryTime}.`;
        }
        
        setAgentMessages([...newMessages, { role: 'assistant' as const, content: errorMessage }]);
    } finally {
        setIsAgentLoading(false);
    }
  };

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

  const handleLeadClick = (leadId: string) => {
    setActiveTab('crm');
    setCrmSearch(leadId); // Use ID as search term to filter directly
    setHighlightedLeadId(leadId);
    
    // Scroll into view after tab switch and filter
    setTimeout(() => {
        const element = document.getElementById(`lead-${leadId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);

    setTimeout(() => setHighlightedLeadId(null), 3000); // Clear highlight after 3s
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div>
                            <button 
                                onClick={() => toggleCategory('operations')}
                                className="w-full flex items-center justify-between admin-label mb-4 px-2 hover:text-white transition-colors group"
                            >
                                <span className="font-manrope">Operations</span>
                                <motion.div
                                    animate={{ rotate: expandedCategories.includes('operations') ? 0 : -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={14} className="opacity-40 group-hover:opacity-100" />
                                </motion.div>
                            </button>
                            <AnimatePresence initial={false}>
                                {expandedCategories.includes('operations') && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-1"
                                    >
                                        <NavItem id="crm" label="CRM" icon={Users} />
                                        <NavItem id="communication" label="Communication" icon={PhoneCall} />
                                        <NavItem id="automations" label="Automations" icon={Megaphone} />
                                        <NavItem id="agent" label="Agent" icon={Sparkles} />
                                        <NavItem id="production" label="Production" icon={FileText} />
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
                        activeTab === 'communication' ? 'radial-gradient(ellipse at top right, rgba(139,92,246,0.06) 0%, transparent 60%)' :
                        activeTab === 'automations' ? 'radial-gradient(ellipse at top left, rgba(16,185,129,0.06) 0%, transparent 60%)' :
                        activeTab === 'agent' ? 'radial-gradient(ellipse at top right, rgba(234,179,8,0.06) 0%, transparent 60%)' :
                        'none'
                }}
            >
                <div className="flex-shrink-0 sticky top-0 z-20 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 px-10 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-white tracking-tight font-manrope">
                            {activeTab === 'crm' ? 'CRM' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        {processingImage && <span className="flex items-center gap-2 text-blue-400 text-[11px] font-semibold animate-pulse"><Loader2 size={14} className="animate-spin" /> Uploading...</span>}
                        <button onClick={handleClose} className="p-2.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                </div>

                <div className={`flex-1 overflow-y-auto relative ${activeTab === 'agent' ? 'p-0 overflow-hidden' : 'p-10 pb-32 w-full max-w-[1600px] mx-auto'}`}>
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
                                        <input type="text" placeholder="Label (e.g. M ORIGINAL)" value={projectConfig.label} onChange={(e) => updateProjectConfig({ label: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" />
                                    </div>
                                    <div className="space-y-6">
                                        <label className="admin-label opacity-45 ml-1">Overlay Logo Image</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Logo Image URL" value={projectConfig.logoImage || ''} onChange={(e) => updateProjectConfig({ logoImage: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 focus:outline-none focus:border-white/20 transition-all" />
                                            <label className="flex items-center px-5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"><Camera size={18} className="text-white/60" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => updateProjectConfig({ logoImage: url }))} /></label>
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

                    {/* CRM TAB */}
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
                                                                setSelectedLeadId(id);
                                                                setActiveTab('communication');
                                                            }}
                                                            outboundEmails={outboundEmails}
                                                            onSendEmail={handleSendEmail}
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
                                                                    onSendEmail={handleSendEmail}
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

                    {/* COMMUNICATION TAB */}
                    {activeTab === 'communication' && (
                        <div className="flex h-[calc(100vh-160px)] -mx-10 -mb-10 bg-transparent overflow-hidden border-t border-white/5">
                            {/* Column 1: Platform Selector (Narrow) */}
                            <div className="w-20 flex flex-col items-center py-8 gap-6 border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-xl overflow-y-auto scrollbar-hide">
                                <button 
                                    onClick={() => setCommApp('gmail')}
                                    className={`p-4 rounded-2xl transition-all duration-300 ${commApp === 'gmail' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-110' : 'text-white/20 hover:text-white/40 hover:bg-white/5'}`}
                                    title="Gmail"
                                >
                                    <GmailIcon size={24} />
                                </button>
                                <button 
                                    onClick={() => setCommApp('whatsapp')}
                                    className={`p-4 rounded-2xl transition-all duration-300 ${commApp === 'whatsapp' ? 'bg-[#22c55e] text-white shadow-lg shadow-[#22c55e]/20 scale-110' : 'text-white/20 hover:text-white/40 hover:bg-white/5'}`}
                                    title="WhatsApp"
                                >
                                    <WhatsAppIcon size={24} />
                                </button>
                                <button 
                                    onClick={() => setCommApp('instagram')}
                                    className={`p-4 rounded-2xl transition-all duration-300 ${commApp === 'instagram' ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-pink-500/20 scale-110' : 'text-white/20 hover:text-white/40 hover:bg-white/5'}`}
                                    title="Instagram"
                                >
                                    <InstagramIcon size={24} />
                                </button>
                                <button 
                                    onClick={() => setCommApp('sms')}
                                    className={`p-4 rounded-2xl transition-all duration-300 ${commApp === 'sms' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 scale-110' : 'text-white/20 hover:text-white/40 hover:bg-white/5'}`}
                                    title="SMS"
                                >
                                    <SMSIcon size={24} />
                                </button>
                            </div>

                            {/* Inbox Content */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Column 2: Message List (Medium) */}
                                <div className={`flex-1 flex flex-col border-r border-white/5 transition-all duration-500 ${selectedCommId ? 'max-w-md' : 'max-w-none'}`}>
                                    {/* Search Bar Area */}
                                    <div className="p-8 border-b border-white/5 bg-[#111111]/50 backdrop-blur-xl flex items-center gap-4">
                                        <div className="relative flex-1 group">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-white/60 transition-colors">
                                                <Search size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder={`Search ${commApp === 'gmail' ? 'Gmail' : commApp === 'whatsapp' ? 'WhatsApp' : commApp === 'instagram' ? 'Instagram' : 'SMS'}...`}
                                                value={commSearch}
                                                onChange={(e) => setCommSearch(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 focus:ring-4 focus:ring-white/5 transition-all placeholder:text-white/20"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setComposeTo('');
                                                setComposeSubject('');
                                                setComposeContent('');
                                                setIsComposeOpen(true);
                                            }}
                                            className="p-4 bg-white/10 border border-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all shadow-xl shadow-black/20 flex-shrink-0"
                                            title="Compose New Message"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    {/* Inbox List */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 mb-4 gap-4">
                                            <h2 className="admin-label">
                                                {commApp === 'gmail' ? 'Gmail' : 
                                                 commApp === 'whatsapp' ? 'WhatsApp' :
                                                 commApp === 'instagram' ? 'Instagram' : 'SMS'}
                                            </h2>
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => fetchMessages()}
                                                    className="p-1.5 text-white/20 hover:text-white transition-colors"
                                                    title="Refresh Messages"
                                                >
                                                    <Clock size={14} />
                                                </button>
                                                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                                                    {['all', 'warm', 'cold'].map(f => (
                                                        <button 
                                                            key={f}
                                                            onClick={() => setOutboundFilter(f as any)}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${outboundFilter === f ? 'bg-white/10 text-white border border-white/10' : 'text-white/30 hover:text-white/60'}`}
                                                        >
                                                            {f}
                                                        </button>
                                                    ))}
                                                </div>
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
                                                        className={`p-5 rounded-2xl border transition-all group cursor-pointer ${
                                                            selectedCommId === email.id 
                                                            ? 'bg-white/10 border-white/20 shadow-xl' 
                                                            : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                                                        }`}
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 font-medium text-sm border border-white/10">
                                                                {email.leadName.charAt(0)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <h4 className="font-medium text-white truncate text-sm">{email.leadName}</h4>
                                                                    <span className="text-[10px] text-white/20 whitespace-nowrap ml-2">{new Date(email.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                                </div>
                                                                <p className="text-[11px] text-white/40 font-medium truncate mb-1">{email.subject}</p>
                                                                <p className="text-[10px] text-white/20 line-clamp-1 opacity-60">{email.thread[email.thread.length - 1]?.content}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                        ) : commApp === 'whatsapp' ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
                                                    <WhatsAppIcon size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">WhatsApp Integration</h3>
                                                    <p className="text-sm text-white/40 max-w-[200px] mx-auto mt-2">Connect your business account to start messaging.</p>
                                                </div>
                                                <button className="px-6 py-2 bg-[#22c55e] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1eb054] transition-all">Connect Account</button>
                                            </div>
                                        ) : commApp === 'instagram' ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500">
                                                    <InstagramIcon size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">Instagram DMs</h3>
                                                    <p className="text-sm text-white/40 max-w-[200px] mx-auto mt-2">Manage your Instagram direct messages here.</p>
                                                </div>
                                                <button className="px-6 py-2 bg-gradient-to-tr from-purple-600 to-pink-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">Connect Instagram</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                    <SMSIcon size={32} />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">SMS Marketing</h3>
                                                    <p className="text-sm text-white/40 max-w-[200px] mx-auto mt-2">Send and receive text messages from your business line.</p>
                                                </div>
                                                <button className="px-6 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">Setup SMS</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Column 3: Message Detail View (Wide) */}
                                <AnimatePresence mode="wait">
                                    {selectedCommId ? (
                                        <motion.div 
                                            key={selectedCommId}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex-1 flex overflow-hidden bg-[#0f0f0f]"
                                        >
                                            <div className="flex-1 flex flex-col border-r border-white/5">
                                                {commApp === 'gmail' ? (
                                                    (() => {
                                                        const email = outboundEmails.find(e => e.id === selectedCommId);
                                                        if (!email) return null;
                                                        return (
                                                            <>
                                                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111111]/50 backdrop-blur-xl">
                                                                    <div className="flex items-center gap-6">
                                                                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/60 font-medium text-2xl border border-white/10">
                                                                            {email.leadName.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-medium text-white text-xl">{email.leadName}</h3>
                                                                            <p className="text-xs text-white/30 mt-1">{email.subject}</p>
                                                                        </div>
                                                                    </div>
                                                                    <button onClick={() => setSelectedCommId(null)} className="p-2.5 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-colors"><X size={24} /></button>
                                                                </div>
                                                                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                                                                    {email.thread.map((msg, idx) => (
                                                                        <div key={idx} className={`flex flex-col ${msg.from === 'hello@mavestone.com' ? 'items-end' : 'items-start'}`}>
                                                                            <div className="flex items-center gap-3 mb-3 px-1">
                                                                                <span className="admin-label">{msg.from === 'hello@mavestone.com' ? 'You' : email.leadName}</span>
                                                                                <span className="text-[10px] text-white/20">{new Date(msg.timestamp).toLocaleString()}</span>
                                                                            </div>
                                                                            <div className={`max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed ${
                                                                                msg.from === 'hello@mavestone.com' 
                                                                                ? 'bg-white/10 border border-white/20 text-white shadow-2xl shadow-black/20 rounded-tr-none' 
                                                                                : 'bg-white/[0.03] border border-white/5 text-white/80 rounded-tl-none'
                                                                            }`}>
                                                                                {msg.content}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="p-8 border-t border-white/5 bg-[#111111]/50 backdrop-blur-xl">
                                                                    <div className="flex justify-between items-center mb-4 px-2">
                                                                        <span className="admin-label">Your Reply</span>
                                                                        <button 
                                                                            onClick={handleAiReply}
                                                                            disabled={isAiReplying}
                                                                            className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors disabled:opacity-50 group"
                                                                        >
                                                                            <Zap size={12} className="group-hover:scale-110 transition-transform" fill="currentColor" /> {isAiReplying ? 'Drafting...' : 'AI Magic Reply'}
                                                                        </button>
                                                                    </div>
                                                                    <div className="relative">
                                                                        <textarea 
                                                                            placeholder="Write a reply..."
                                                                            value={replyContent}
                                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                                            rows={4}
                                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all resize-none placeholder:text-white/20"
                                                                        />
                                                                        <div className="absolute bottom-5 right-5 flex items-center gap-4">
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
                                                                                className="px-8 py-3 bg-white text-black hover:bg-gray-200 disabled:opacity-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-black/20"
                                                                            >
                                                                                {isSendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                                                                <span>Send</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()
                                                ) : (
                                                    <div className="flex-1 flex items-center justify-center text-white/20">
                                                        <div className="text-center space-y-4">
                                                            <MessageSquare size={48} className="mx-auto opacity-10" />
                                                            <p className="text-sm uppercase tracking-widest font-bold">Select a conversation</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Column 4: Contact Info (Collapsible) */}
                                            <div className="w-80 bg-[#0a0a0a]/40 backdrop-blur-xl p-8 space-y-8 hidden xl:block">
                                                <h3 className="admin-label">Contact Details</h3>
                                                {(() => {
                                                    const email = outboundEmails.find(e => e.id === selectedCommId);
                                                    const lead = messages.find(m => m.id === email?.leadId || m.email === email?.leadId);
                                                    if (!lead) return <p className="text-white/20 text-xs italic">No linked lead found</p>;
                                                    return (
                                                        <div className="space-y-6">
                                                            <div className="space-y-1">
                                                                <p className="text-white font-medium">{lead.name}</p>
                                                                <p className="text-xs text-white/40">{lead.email}</p>
                                                                {lead.phone && <p className="text-xs text-white/40">{lead.phone}</p>}
                                                            </div>
                                                            <div className="pt-6 border-t border-white/5 space-y-4">
                                                                <div>
                                                                    <p className="admin-label mb-2">Lead Status</p>
                                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                                        lead.status === 'converted' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                                        lead.status === 'contacted' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                                        'bg-white/5 border-white/10 text-white/40'
                                                                    }`}>
                                                                        {lead.status || 'New'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="admin-label mb-2">Pipeline Value</p>
                                                                    <p className="text-emerald-400 font-bold">${lead.value || 0}</p>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => {
                                                                    setActiveTab('crm');
                                                                    setCrmSearch(lead.name);
                                                                }}
                                                                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                                            >
                                                                View in CRM
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center bg-[#0f0f0f] text-white/10">
                                            <div className="text-center space-y-4">
                                                <Mail size={64} className="mx-auto opacity-5" />
                                                <p className="text-sm uppercase tracking-widest font-bold">Select a message to read</p>
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
                                    <div className="w-1" />
                                    <button 
                                        onClick={() => setIsGmailSettingsOpen(true)}
                                        className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                        title="Gmail Settings"
                                    >
                                        <Settings size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
                                    {[
                                        { id: 'workflows', label: 'Workflows', icon: Zap },
                                        { id: 'newsletters', label: 'Newsletters', icon: Megaphone },
                                        { id: 'lists', label: 'Mailing Lists', icon: Users }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setAutomationsTab(tab.id as any)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
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
                                <section className="space-y-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                                        {[
                                            { label: 'Emails Sent', value: '0', color: 'text-blue-400' },
                                            { label: 'Open Rate', value: '0%', color: 'text-emerald-400' },
                                            { label: 'Reply Rate', value: '0%', color: 'text-violet-400' },
                                            { label: 'Active Workflows', value: automations.filter(a => a.isActive).length.toString(), color: 'text-orange-400' }
                                        ].map((stat, i) => (
                                            <div key={i} className="admin-card !p-4 flex flex-col gap-1">
                                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</span>
                                                <span className={`text-xl font-medium ${stat.color}`}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="admin-label">Automated Workflows</h3>
                                        <button onClick={addAutomation} className="admin-btn-secondary">
                                            <Plus size={14} /> New Workflow
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {automations.map(auto => (
                                            <div key={auto.id} className="admin-card group">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className="space-y-3 flex-1 mr-6">
                                                        <input 
                                                            type="text"
                                                            value={auto.name}
                                                            onChange={(e) => updateAutomation(auto.id, { name: e.target.value })}
                                                            className="text-xl font-medium text-white bg-transparent border-none p-0 focus:outline-none w-full placeholder:text-white/20"
                                                            placeholder="Workflow Name"
                                                        />
                                                        
                                                        <div className="flex items-center gap-2 py-2">
                                                            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 rounded-xl border border-white/10 shadow-sm">
                                                                <Zap size={10} className="text-orange-400" />
                                                                <span className="text-[9px] font-bold text-white/80 uppercase tracking-tight">{auto.trigger.replace('_', ' ')}</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <div className="w-4 h-px bg-white/10" />
                                                                <div className="w-1 h-1 rounded-full bg-white/20 -ml-0.5" />
                                                            </div>
                                                            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 rounded-xl border border-white/10 shadow-sm">
                                                                <Clock size={10} className="text-blue-400" />
                                                                <span className="text-[9px] font-bold text-white/80 uppercase tracking-tight">{auto.delayDays || 0}d Delay</span>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <div className="w-4 h-px bg-white/10" />
                                                                <div className="w-1 h-1 rounded-full bg-white/20 -ml-0.5" />
                                                            </div>
                                                            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 rounded-xl border border-white/10 shadow-sm">
                                                                <Mail size={10} className="text-emerald-400" />
                                                                <span className="text-[9px] font-bold text-white/80 uppercase tracking-tight">Send Email</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <select 
                                                                value={auto.trigger}
                                                                onChange={(e) => updateAutomation(auto.id, { trigger: e.target.value as any })}
                                                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest focus:outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all"
                                                            >
                                                                <option value="new_lead" className="bg-[#111111]">New Lead</option>
                                                                <option value="newsletter_signup" className="bg-[#111111]">Newsletter Signup</option>
                                                                <option value="manual" className="bg-[#111111]">Manual</option>
                                                            </select>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Delay:</span>
                                                                <input 
                                                                    type="number"
                                                                    value={auto.delayDays || 0}
                                                                    onChange={(e) => updateAutomation(auto.id, { delayDays: parseInt(e.target.value) })}
                                                                    className="w-14 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-bold text-white/60 focus:outline-none focus:border-white/20 transition-all"
                                                                />
                                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Days</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button 
                                                            onClick={() => updateAutomation(auto.id, { isActive: !auto.isActive })}
                                                            className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                                auto.isActive 
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                                                                : 'bg-white/5 text-white/20 border border-white/10'
                                                            }`}
                                                        >
                                                            {auto.isActive ? 'Active' : 'Paused'}
                                                        </button>
                                                        <button onClick={() => deleteAutomation(auto.id)} className="p-2 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="admin-label block px-1">Email Subject</label>
                                                        <input 
                                                            type="text"
                                                            value={auto.subject}
                                                            onChange={(e) => updateAutomation(auto.id, { subject: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                                                            placeholder="Subject Line"
                                                        />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="admin-label block px-1">Email Content</label>
                                                        <textarea 
                                                            value={auto.content}
                                                            onChange={(e) => updateAutomation(auto.id, { content: e.target.value })}
                                                            rows={5}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-white/20 transition-all min-h-[140px] resize-none leading-relaxed placeholder:text-white/20"
                                                            placeholder="Email Body..."
                                                        />
                                                        <p className="text-[10px] text-white/20 italic px-1">Tip: Use {"{{name}}"} to personalize the email.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {automationsTab === 'lists' && (
                                <section className="space-y-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                                        {[
                                            { label: 'Total Lists', value: mailingLists.length.toString(), color: 'text-blue-400' },
                                            { label: 'Total Contacts', value: mailingLists.reduce((acc, l) => acc + l.contacts.length, 0).toString(), color: 'text-emerald-400' },
                                            { label: 'Avg List Size', value: mailingLists.length > 0 ? Math.round(mailingLists.reduce((acc, l) => acc + l.contacts.length, 0) / mailingLists.length).toString() : '0', color: 'text-violet-400' },
                                            { label: 'New This Month', value: '0', color: 'text-orange-400' }
                                        ].map((stat, i) => (
                                            <div key={i} className="admin-card !p-4 flex flex-col gap-1">
                                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</span>
                                                <span className={`text-xl font-medium ${stat.color}`}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="admin-label">Mailing Lists</h3>
                                        <div className="flex items-center gap-4">
                                            <label className="admin-btn-secondary cursor-pointer">
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
                                            <button onClick={() => addMailingList("New List")} className="admin-btn-secondary">
                                                <Plus size={14} /> Create List
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {mailingLists.map(list => (
                                            <div key={list.id} className="admin-card group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="space-y-1">
                                                        <input 
                                                            type="text"
                                                            value={list.name}
                                                            onChange={(e) => updateMailingList(list.id, { name: e.target.value })}
                                                            className="text-lg font-medium text-white bg-transparent border-none p-0 focus:outline-none w-full placeholder:text-white/20"
                                                            disabled={list.id === 'all-crm'}
                                                            placeholder="List Name"
                                                        />
                                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{list.contacts.length} Contacts</p>
                                                    </div>
                                                    {list.id !== 'all-crm' && (
                                                        <button onClick={() => deleteMailingList(list.id)} className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex -space-x-2">
                                                        {list.contacts.slice(0, 3).map((c, i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full bg-white/5 border border-[#111111] flex items-center justify-center text-[10px] font-bold text-white/40">
                                                                {c.name[0]}
                                                            </div>
                                                        ))}
                                                        {list.contacts.length > 3 && (
                                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-[#111111] flex items-center justify-center text-[10px] font-bold text-white/20">
                                                                +{list.contacts.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-white/5 space-y-4">
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Name" 
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
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
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
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
                                                    <div className="flex items-center justify-between gap-4">
                                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">Or add from CRM:</p>
                                                        <select 
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest focus:outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all"
                                                            onChange={(e) => {
                                                                const email = e.target.value;
                                                                const contact = messages.find(m => m.email === email);
                                                                if (contact) {
                                                                    addContactToList(list.id, { name: contact.name, email: contact.email });
                                                                }
                                                                e.target.value = '';
                                                            }}
                                                        >
                                                            <option value="" className="bg-[#111111]">Select Contact</option>
                                                            {messages.filter(m => !list.contacts.some(c => c.email === m.email)).map(m => (
                                                                <option key={m.id} value={m.email} className="bg-[#111111]">{m.name}</option>
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
                                <section className="space-y-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                                        {[
                                            { label: 'Total Campaigns', value: newsletters.length.toString(), color: 'text-blue-400' },
                                            { label: 'Total Sent', value: newsletters.filter(n => n.status === 'sent').length.toString(), color: 'text-emerald-400' },
                                            { label: 'Avg Open Rate', value: '0%', color: 'text-violet-400' },
                                            { label: 'Avg Click Rate', value: '0%', color: 'text-orange-400' }
                                        ].map((stat, i) => (
                                            <div key={i} className="admin-card !p-4 flex flex-col gap-1">
                                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</span>
                                                <span className={`text-xl font-medium ${stat.color}`}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="admin-label">Newsletter Campaigns</h3>
                                        <button onClick={addNewsletter} className="admin-btn-secondary">
                                            <Plus size={14} /> Create Newsletter
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {newsletters.length === 0 ? (
                                            <div className="py-24 text-center admin-card">
                                                <Megaphone className="mx-auto w-12 h-12 text-white/10 mb-4" />
                                                <p className="text-white/20 text-sm">No newsletters created yet.</p>
                                            </div>
                                        ) : (
                                            newsletters.map(news => (
                                                <div key={news.id} className="admin-card group">
                                                    <div className="flex flex-col lg:flex-row gap-8">
                                                        <div className="flex-1 space-y-6">
                                                            <div className="flex justify-between items-start">
                                                                <div className="space-y-1 flex-1 mr-6">
                                                                    <input 
                                                                        type="text"
                                                                        value={news.title}
                                                                        onChange={(e) => updateNewsletter(news.id, { title: e.target.value })}
                                                                        className="text-2xl font-medium text-white bg-transparent border-none p-0 focus:outline-none w-full placeholder:text-white/20"
                                                                        placeholder="Campaign Title"
                                                                    />
                                                                    <div className="flex items-center gap-4">
                                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                                                                            news.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                                                                        }`}>
                                                                            {news.status}
                                                                        </span>
                                                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Last Sent: {news.status === 'sent' ? new Date().toLocaleDateString() : 'Never'}</p>
                                                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Last Edited: {new Date().toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => deleteNewsletter(news.id)} className="p-2 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={20} /></button>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <label className="admin-label block px-1">Subject Line</label>
                                                                    <input 
                                                                        type="text"
                                                                        value={news.subject}
                                                                        onChange={(e) => updateNewsletter(news.id, { subject: e.target.value })}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                                                                        placeholder="Subject Line"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="admin-label block px-1">Newsletter Body (HTML Supported)</label>
                                                                    <textarea 
                                                                        value={news.content}
                                                                        onChange={(e) => updateNewsletter(news.id, { content: e.target.value })}
                                                                        rows={10}
                                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white/80 focus:outline-none focus:border-white/20 transition-all min-h-[300px] font-mono resize-none leading-relaxed placeholder:text-white/20"
                                                                        placeholder="Write your newsletter content here..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full lg:w-80 space-y-6">
                                                            <div className="admin-card !bg-white/[0.02] border-white/5">
                                                                <h4 className="admin-label mb-4 flex items-center gap-2"><ImageIcon size={12} /> Newsletter Assets</h4>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {news.images.map((img, idx) => (
                                                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group/asset border border-white/10">
                                                                            <img src={img} alt="" className="w-full h-full object-cover opacity-60 group-hover/asset:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                                                                            <button 
                                                                                onClick={() => updateNewsletter(news.id, { images: news.images.filter((_, i) => i !== idx) })}
                                                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover/asset:opacity-100 transition-opacity flex items-center justify-center text-white hover:text-red-400"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    <label className="aspect-square rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 cursor-pointer transition-all">
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
                                                        <div className="space-y-6">
                                                            <div className="space-y-3">
                                                                <label className="admin-label block px-1">Target List</label>
                                                                <select 
                                                                    value={news.targetListId || ''}
                                                                    onChange={(e) => updateNewsletter(news.id, { targetListId: e.target.value })}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white/40 uppercase tracking-widest focus:outline-none appearance-none cursor-pointer hover:bg-white/10 transition-all"
                                                                >
                                                                    <option value="" className="bg-[#111111]">Select List</option>
                                                                    {mailingLists.map(l => (
                                                                        <option key={l.id} value={l.id} className="bg-[#111111]">{l.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                                <h4 className="admin-label px-1 flex items-center gap-2"><Settings size={12} /> Sending Options</h4>
                                                                <div className="space-y-3">
                                                                    <button 
                                                                        onClick={() => setPreviewNewsletterId(news.id)}
                                                                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                                                    >
                                                                        <Eye size={14} /> Preview Email
                                                                    </button>
                                                                        <button 
                                                                            disabled={isSendingNewsletter || !news.targetListId}
                                                                            onClick={async () => {
                                                                                if (!gmailConfig.isConnected) return alert("Connect Gmail first");
                                                                                setIsSendingNewsletter(true);
                                                                                const tokens = localStorage.getItem('gmail_tokens');
                                                                                const res = await fetch('/api/gmail/send', {
                                                                                    method: 'POST',
                                                                                    headers: { 
                                                                                        'Content-Type': 'application/json',
                                                                                        ...(tokens ? { 'x-gmail-tokens': tokens } : {})
                                                                                    },
                                                                                    credentials: 'include',
                                                                                    body: JSON.stringify({
                                                                                        newsletterId: news.id,
                                                                                        targetListId: news.targetListId
                                                                                    })
                                                                                });
                                                                                const data = await res.json();
                                                                                setIsSendingNewsletter(false);
                                                                                if (data.success) alert(`Sent to ${data.count} contacts!`);
                                                                                else alert(`Failed to send: ${data.error}`);
                                                                            }}
                                                                            className={`admin-btn-primary w-full py-3 justify-center ${isSendingNewsletter || !news.targetListId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        >
                                                                            <Send size={14} /> {isSendingNewsletter ? 'Sending...' : 'Send Now'}
                                                                        </button>
                                                                </div>
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
                {/* AGENT TAB */}
                {activeTab === 'agent' && (
                    <div className="absolute inset-0 top-[61px] z-10 bg-transparent">
                        <AnimatedAIChat 
                            messages={agentMessages}
                            onSend={handleAgentSend}
                            isLoading={isAgentLoading}
                            agentName="Ava"
                            onLeadClick={handleLeadClick}
                        />
                    </div>
                )}
                {activeTab === 'production' && (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Production</h2>
                                <p className="text-gray-400 text-sm">Manage your content pipeline from idea to publication.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
                                    <button 
                                        onClick={() => setProductionView('kanban')}
                                        className={`p-2 rounded-lg transition-all ${productionView === 'kanban' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <Layout size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setProductionView('table')}
                                        className={`p-2 rounded-lg transition-all ${productionView === 'table' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setProductionView('calendar')}
                                        className={`p-2 rounded-lg transition-all ${productionView === 'calendar' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <Calendar size={18} />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => setIsProductionModalOpen(true)}
                                    className="admin-btn-primary"
                                >
                                    <Plus size={18} /> Add Item
                                </button>
                            </div>
                        </div>

                        {productionView === 'kanban' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-x-auto pb-8">
                                {['idea', 'scripted', 'production', 'post-production', 'done'].map(status => (
                                    <div key={status} className="flex flex-col gap-4 min-w-[280px]">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    status === 'idea' ? 'bg-gray-500' :
                                                    status === 'scripted' ? 'bg-blue-500' :
                                                    status === 'production' ? 'bg-yellow-500' :
                                                    status === 'post-production' ? 'bg-purple-500' : 'bg-green-500'
                                                }`} />
                                                {status.replace('-', ' ')}
                                                <span className="ml-1 text-white/20">({productionItems.filter(i => i.status === status).length})</span>
                                            </h3>
                                        </div>
                                        <div className="flex flex-col gap-4 min-h-[500px] p-2 rounded-2xl bg-white/[0.02] border border-white/5">
                                            {productionItems.filter(item => item.status === status).map(item => (
                                                <motion.div 
                                                    key={item.id}
                                                    layoutId={`prod-${item.id}`}
                                                    onClick={() => setActiveProductionId(item.id)}
                                                    className="p-4 rounded-xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-400/10 rounded-full">
                                                            {item.cat || 'Uncategorized'}
                                                        </span>
                                                        <div className="flex gap-1">
                                                            {item.platforms?.map((p: string) => (
                                                                <div key={p} className="text-white/40">
                                                                    {p === 'YouTube' && <Youtube size={12} />}
                                                                    {p === 'LinkedIn' && <FileText size={12} />}
                                                                    {p === 'Instagram Reels' && <ImageIcon size={12} />}
                                                                    {p === 'TikTok' && <Zap size={12} />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <h4 className="text-sm font-medium text-white mb-3 line-clamp-2">{item.title}</h4>
                                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                                            <Clock size={12} />
                                                            {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {item.comments?.length > 0 && (
                                                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                                    <MessageSquare size={12} />
                                                                    {item.comments.length}
                                                                </div>
                                                            )}
                                                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white/40">
                                                                {item.title.charAt(0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            <button 
                                                onClick={() => {
                                                    setNewProductionStatus(status);
                                                    setIsProductionModalOpen(true);
                                                }}
                                                className="w-full py-3 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 text-xs"
                                            >
                                                <Plus size={14} /> Add Item
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {productionView === 'table' && (
                            <div className="admin-card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="p-4 admin-label">Title</th>
                                                <th className="p-4 admin-label">Category</th>
                                                <th className="p-4 admin-label">Status</th>
                                                <th className="p-4 admin-label">Platforms</th>
                                                <th className="p-4 admin-label">Date</th>
                                                <th className="p-4 admin-label"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productionItems.map(item => (
                                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-4">
                                                        <div className="font-medium text-white">{item.title}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-1 bg-blue-400/10 rounded-lg">
                                                            {item.cat || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                                item.status === 'idea' ? 'bg-gray-500' :
                                                                item.status === 'scripted' ? 'bg-blue-500' :
                                                                item.status === 'production' ? 'bg-yellow-500' :
                                                                item.status === 'post-production' ? 'bg-purple-500' : 'bg-green-500'
                                                            }`} />
                                                            <span className="text-xs text-gray-400 capitalize">{item.status.replace('-', ' ')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            {item.platforms?.map((p: string) => (
                                                                <div key={p} className="text-white/40" title={p}>
                                                                    {p === 'YouTube' && <Youtube size={14} />}
                                                                    {p === 'LinkedIn' && <FileText size={14} />}
                                                                    {p === 'Instagram Reels' && <ImageIcon size={14} />}
                                                                    {p === 'TikTok' && <Zap size={14} />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-xs text-gray-500">{item.date || 'TBD'}</div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button 
                                                            onClick={() => setActiveProductionId(item.id)}
                                                            className="p-2 text-gray-500 hover:text-white transition-colors"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {productionView === 'calendar' && (
                            <div className="admin-card p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white">
                                        {new Date(calY, calM).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                if (calM === 0) { setCalM(11); setCalY(calY - 1); }
                                                else setCalM(calM - 1);
                                            }}
                                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                                        >
                                            <ChevronDown className="rotate-90" size={18} />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (calM === 11) { setCalM(0); setCalY(calY + 1); }
                                                else setCalM(calM + 1);
                                            }}
                                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                                        >
                                            <ChevronDown className="-rotate-90" size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="p-4 text-center admin-label bg-[#161618]">{day}</div>
                                    ))}
                                    {Array.from({ length: new Date(calY, calM, 1).getDay() }).map((_, i) => (
                                        <div key={`empty-${i}`} className="min-h-[120px] bg-[#0F0F11]/50" />
                                    ))}
                                    {Array.from({ length: new Date(calY, calM + 1, 0).getDate() }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${calY}-${String(calM + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const dayItems = productionItems.filter(item => item.date === dateStr);
                                        return (
                                            <div key={day} className="min-h-[120px] p-2 bg-[#0F0F11] border border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <div className="text-xs font-bold text-white/20 mb-2">{day}</div>
                                                <div className="flex flex-col gap-1">
                                                    {dayItems.map(item => (
                                                        <div 
                                                            key={item.id}
                                                            onClick={() => setActiveProductionId(item.id)}
                                                            className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-medium truncate cursor-pointer hover:bg-blue-500/20 transition-all"
                                                        >
                                                            {item.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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

                    {/* Production Item Details Modal */}
                    <AnimatePresence>
                        {activeProductionId && (
                            <div className="fixed inset-0 z-[150] flex items-center justify-end p-0 md:p-4 bg-black/60 backdrop-blur-sm">
                                <motion.div 
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="w-full max-w-2xl h-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl overflow-hidden flex flex-col"
                                >
                                    {(() => {
                                        const item = productionItems.find(i => i.id === activeProductionId);
                                        if (!item) return null;
                                        return (
                                            <>
                                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                                    <div className="flex items-center gap-4">
                                                        <button 
                                                            onClick={() => setActiveProductionId(null)}
                                                            className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors"
                                                        >
                                                            <X size={24} />
                                                        </button>
                                                        <div>
                                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-1 bg-blue-400/10 rounded-lg mb-1 inline-block">
                                                                {item.cat || 'Uncategorized'}
                                                            </span>
                                                            <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => deleteProductionItem(item.id)}
                                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="admin-label">Status</label>
                                                            <select 
                                                                value={item.status}
                                                                onChange={(e) => updateProductionItem(item.id, { status: e.target.value })}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                                            >
                                                                <option value="idea">Idea</option>
                                                                <option value="scripted">Scripted</option>
                                                                <option value="production">Production</option>
                                                                <option value="post-production">Post-Production</option>
                                                                <option value="done">Done</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="admin-label">Due Date</label>
                                                            <input 
                                                                type="date"
                                                                value={item.date || ''}
                                                                onChange={(e) => updateProductionItem(item.id, { date: e.target.value })}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="admin-label">Platforms</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['YouTube', 'LinkedIn', 'Instagram Reels', 'TikTok', 'Twitter'].map(p => (
                                                                <button 
                                                                    key={p}
                                                                    onClick={() => {
                                                                        const platforms = item.platforms || [];
                                                                        const newPlatforms = platforms.includes(p) 
                                                                            ? platforms.filter((pl: string) => pl !== p)
                                                                            : [...platforms, p];
                                                                        updateProductionItem(item.id, { platforms: newPlatforms });
                                                                    }}
                                                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                                                        item.platforms?.includes(p)
                                                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                                                        : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                                                                    }`}
                                                                >
                                                                    {p}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="admin-label">Notes</label>
                                                        <textarea 
                                                            value={item.notes || ''}
                                                            onChange={(e) => updateProductionItem(item.id, { notes: e.target.value })}
                                                            placeholder="Add detailed notes about this production..."
                                                            rows={6}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-4">
                                                        <label className="admin-label flex items-center gap-2">
                                                            <MessageSquare size={14} /> Comments ({item.comments?.length || 0})
                                                        </label>
                                                        <div className="space-y-4">
                                                            {item.comments?.map((c: any, idx: number) => (
                                                                <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">You</span>
                                                                        <span className="text-[9px] text-gray-600">{new Date(c.date).toLocaleString()}</span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-300">{c.text}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input 
                                                                type="text"
                                                                placeholder="Add a comment..."
                                                                value={productionComment}
                                                                onChange={(e) => setProductionComment(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && productionComment.trim()) {
                                                                        const newComment = { text: productionComment, date: new Date().toISOString() };
                                                                        updateProductionItem(item.id, { comments: [...(item.comments || []), newComment] });
                                                                        setProductionComment('');
                                                                    }
                                                                }}
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                                                            />
                                                            <button 
                                                                onClick={() => {
                                                                    if (!productionComment.trim()) return;
                                                                    const newComment = { text: productionComment, date: new Date().toISOString() };
                                                                    updateProductionItem(item.id, { comments: [...(item.comments || []), newComment] });
                                                                    setProductionComment('');
                                                                }}
                                                                className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                                            >
                                                                <Send size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Add Production Item Modal */}
                    <AnimatePresence>
                        {isProductionModalOpen && (
                            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                                >
                                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <Clapperboard size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">New Production</h3>
                                        </div>
                                        <button onClick={() => setIsProductionModalOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-2">
                                            <label className="admin-label">Project Title</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. LinkedIn Monetisation Strategy"
                                                value={newProductionTitle}
                                                onChange={(e) => setNewProductionTitle(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="admin-label">Initial Status</label>
                                                <select 
                                                    value={newProductionStatus}
                                                    onChange={(e) => setNewProductionStatus(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                                >
                                                    <option value="idea">Idea</option>
                                                    <option value="scripted">Scripted</option>
                                                    <option value="production">Production</option>
                                                    <option value="post-production">Post-Production</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="admin-label">Target Date</label>
                                                <input 
                                                    type="date" 
                                                    value={newProductionDate}
                                                    onChange={(e) => setNewProductionDate(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end gap-4">
                                        <button 
                                            onClick={() => setIsProductionModalOpen(false)}
                                            className="px-8 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={addProductionItem}
                                            disabled={!newProductionTitle.trim()}
                                            className="px-10 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20"
                                        >
                                            <Plus size={14} /> Create Item
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
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

                    {/* Compose Modal */}
                    <AnimatePresence>
                        {isComposeOpen && (
                            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                                >
                                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <Mail size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">New Message</h3>
                                        </div>
                                        <button onClick={() => setIsComposeOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">To</label>
                                            <input 
                                                type="email" 
                                                placeholder="recipient@example.com"
                                                value={composeTo}
                                                onChange={(e) => setComposeTo(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                                            <input 
                                                type="text" 
                                                placeholder="Subject line..."
                                                value={composeSubject}
                                                onChange={(e) => setComposeSubject(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message</label>
                                            <textarea 
                                                placeholder="Write your message here..."
                                                value={composeContent}
                                                onChange={(e) => setComposeContent(e.target.value)}
                                                rows={8}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border-t border-white/5 flex justify-end gap-4">
                                        <button 
                                            onClick={() => setIsComposeOpen(false)}
                                            className="px-8 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={async () => {
                                                if (!composeTo || !composeContent) return;
                                                setIsSendingCompose(true);
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
                                                            to: composeTo,
                                                            subject: composeSubject || '(No Subject)',
                                                            content: composeContent
                                                        })
                                                    });
                                                    if (response.ok) {
                                                        const { threadId } = await response.json();
                                                        const lead = messages.find(m => m.email === composeTo);
                                                        addOutboundEmail({
                                                            id: Math.random().toString(36).substr(2, 9),
                                                            leadId: lead?.id || composeTo,
                                                            leadName: lead?.name || composeTo,
                                                            subject: composeSubject || '(No Subject)',
                                                            timestamp: new Date().toISOString(),
                                                            status: 'sent',
                                                            type: 'outreach',
                                                            threadId,
                                                            thread: [{
                                                                from: 'hello@mavestone.com',
                                                                to: composeTo,
                                                                timestamp: new Date().toISOString(),
                                                                content: composeContent
                                                            }]
                                                        });
                                                        setIsComposeOpen(false);
                                                        fetchMessages();
                                                    }
                                                } finally {
                                                    setIsSendingCompose(false);
                                                }
                                            }}
                                            disabled={isSendingCompose || !composeTo || !composeContent}
                                            className="px-10 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20"
                                        >
                                            {isSendingCompose ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                            Send Message
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
