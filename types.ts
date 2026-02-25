
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
  value?: number;
  source?: string;
  notes?: string;
  tags?: string[];
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
