
import { Film, Short, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'Films', href: '#films' },
  { label: 'Shorts', href: '#shorts' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const LATEST_VIDEO = {
  title: "The Escape",
  description: "Clive Owen returns as The Driver in this action-packed short film featuring high-stakes driving and cinematic storytelling.",
  image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2500&auto=format&fit=crop", // Cinematic Car Shot
  videoId: "jfopjfSYLcM", // The Escape (BMW Films)
};

export const SHORTS: Short[] = [
  { 
    id: '1', 
    title: "Sintel", 
    views: "5.4M", 
    image: "https://images.unsplash.com/photo-1635323067131-0b8cb5541624?q=80&w=1000&auto=format&fit=crop", 
    videoId: "eRsGyueVLvQ" 
  },
  { 
    id: '2', 
    title: "Coffee Run", 
    views: "850K", 
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop", 
    videoId: "YeUX1l56l7k" 
  },
  { 
    id: '3', 
    title: "Spring", 
    views: "2.1M", 
    image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1000&auto=format&fit=crop", 
    videoId: "WhWc3b3KhnY" 
  },
  { 
    id: '4', 
    title: "Cosmos Laundromat", 
    views: "1.2M", 
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop", 
    videoId: "Y-rmzh0PI3c" 
  },
];

export const FILMS: Film[] = [
  {
    id: '1',
    title: "Vantage Point",
    category: "Documentary",
    tagline: "Perspective shifts everything.",
    image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: '2',
    title: "Apex",
    category: "Commercial",
    tagline: "Performance at its peak.",
    image: "https://images.unsplash.com/photo-1515787366009-7cbdd225c5b9?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: '3',
    title: "Blue Horizon",
    category: "Short Film",
    tagline: "How far would you go?",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
  },
];