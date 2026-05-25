
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
  heroVideoId?: string;
  label: string;
  featuredFilmId: string;
  logoImage?: string;
  customLogoSvg?: string;
}

export interface NavItem {
  label: string;
  href: string;
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
  lead_type?: 'warm' | 'cold';
  lead_number?: number;
}

export interface HiringData {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  introParagraph1: string;
  introParagraph2: string;
  introParagraph3: string;
  roleRequirements: string[];
  applicantParagraph: string;
  processSteps: string[];
  callToActionURL: string;
  cta1Label?: string;
  cta1URL?: string;
  cta1Color?: string;
  cta2Label?: string;
  cta2URL?: string;
  cta2Color?: string;
  heroImage?: string;
  card1Media?: string;
  card2Media?: string;
  card3Media?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
