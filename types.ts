
export interface Film {
  id: string;
  title: string;
  category: string;
  tagline: string;
  image: string;
  videoId?: string;
  description?: string;
  year?: string;
  location?: string;
  filmType?: string;
  duration?: string;
  genres?: string;
}

export interface Short {
  id: string;
  title: string;
  views: string;
  image: string;
  videoId: string;
  showViews?: boolean;
  year?: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  text: string;
  avatar: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  portrait: string;
  testimonials: Testimonial[];
  testimonialsBackground?: string;
}

export interface LatestVideoData {
  title: string;
  description: string;
  image: string;
  videoId: string;
}

export interface InProductionData {
  title: string;
  description: string;
  status: string;
  image: string;
}

export interface ProjectHeroConfig {
  heroVideoId: string;
  label: string;
  featuredFilmId: string;
  logoImage?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface OutboundCall {
  id: string;
  leadId: string;
  leadName: string;
  timestamp: string;
  duration: string;
  status: 'completed' | 'missed' | 'voicemail';
  transcript: string;
  recordingUrl?: string;
}

export interface OutboundEmail {
  id: string;
  leadId: string;
  leadName: string;
  subject: string;
  timestamp: string;
  status: 'sent' | 'opened' | 'replied';
  type: 'inbound' | 'outreach'; // New: distinguish lead type
  thread: {
    from: string;
    to: string;
    timestamp: string;
    content: string;
  }[];
}

export interface AutomationEmail {
  id: string;
  name: string;
  subject: string;
  content: string;
  isActive: boolean;
  trigger: 'new_lead';
}

export interface MailingList {
  id: string;
  name: string;
  contacts: { name: string; email: string }[];
}

export interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'sent';
  images: string[];
  targetListId?: string; // New: target a specific list
}

export interface GmailConfig {
  isConnected: boolean;
  email?: string;
  accessToken?: string;
}

export interface Message {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  read: boolean;
  status?: 'new' | 'contacted' | 'qualified' | 'lost' | 'converted';
  priority?: 'low' | 'medium' | 'high';
  scope?: 'one-off' | 'retainer';
  value?: number;
  source?: string;
  notes?: string;
  tags?: string[];
  lead_type?: 'warm' | 'cold'; // New: lead categorization
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
