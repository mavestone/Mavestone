
export interface Film {
  id: string;
  title: string;
  category: string;
  tagline: string;
  image: string;
}

export interface Short {
  id: string;
  title: string;
  views: string;
  image: string;
  videoId: string;
}

export interface LatestVideoData {
  title: string;
  description: string;
  image: string;
  videoId: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  key: string;
  data: any;
}

// Global types for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}