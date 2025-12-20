
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
  externalSource?: 'youtube' | 'instagram' | 'manual';
}

export interface Short {
  id: string;
  title: string;
  views: string;
  image: string;
  videoId: string; // Used for YouTube ID or Instagram Permalink/Embed URL
  showViews?: boolean;
  year?: string;
  category?: string;
  externalSource?: 'youtube' | 'instagram' | 'manual';
}

export interface SyncSettings {
  youtubeChannelId: string;
  youtubeApiKey: string;
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
  message: string;
  read: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
