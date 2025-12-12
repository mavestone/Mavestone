
export interface Film {
  id: string;
  title: string;
  category: string;
  tagline: string;
  image: string;
  videoId?: string;
  description?: string;
  // New Metadata
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
  // New Metadata
  year?: string;
  category?: string;
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
  label: string; // e.g. "Original"
  featuredFilmId: string; // The ID of the film to show details for
  logoImage?: string; // URL for the 'N Series' style logo
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  key: string;
  data: any;
}

export interface Message {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
}

// Global types for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
