
import { Film, Short, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'Films', href: '#films' },
  { label: 'Shorts', href: '#shorts' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

// Unified cinematic placeholder for clean editing start
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop";

export const LATEST_VIDEO = {
  title: "The Escape",
  description: "Clive Owen returns as The Driver in this action-packed short film featuring high-stakes driving and cinematic storytelling.",
  image: PLACEHOLDER_IMAGE, 
  videoId: "jfopjfSYLcM",
};

export const SHORTS: Short[] = [
  { 
    id: '1', 
    title: "Sintel", 
    views: "5.4M", 
    image: PLACEHOLDER_IMAGE, 
    videoId: "eRsGyueVLvQ" 
  },
  { 
    id: '2', 
    title: "Coffee Run", 
    views: "850K", 
    image: PLACEHOLDER_IMAGE, 
    videoId: "YeUX1l56l7k" 
  },
  { 
    id: '3', 
    title: "Spring", 
    views: "2.1M", 
    image: PLACEHOLDER_IMAGE, 
    videoId: "WhWc3b3KhnY" 
  },
  { 
    id: '4', 
    title: "Cosmos Laundromat", 
    views: "1.2M", 
    image: PLACEHOLDER_IMAGE, 
    videoId: "Y-rmzh0PI3c" 
  },
];

export const FILMS: Film[] = [
  {
    id: '1',
    title: "Vantage Point",
    category: "Documentary",
    tagline: "Perspective shifts everything.",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: '2',
    title: "Apex",
    category: "Commercial",
    tagline: "Performance at its peak.",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: '3',
    title: "Blue Horizon",
    category: "Short Film",
    tagline: "How far would you go?",
    image: PLACEHOLDER_IMAGE,
  },
];
