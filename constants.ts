
import { Film, Short, NavItem, InProductionData, ProjectHeroConfig } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Work', href: '#work' },
  { label: 'Shorts', href: '#shorts' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

// Unified cinematic placeholder for clean editing start
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop";

export const PROJECT_PAGE_CONFIG: ProjectHeroConfig = {
  heroVideoId: "jfopjfSYLcM",
  label: "Original",
  featuredFilmId: "1" // Default to Vantage Point
};

export const LATEST_VIDEO = {
  title: "The Escape",
  description: "Clive Owen returns as The Driver in this action-packed short film featuring high-stakes driving and cinematic storytelling.",
  image: PLACEHOLDER_IMAGE, 
  videoId: "jfopjfSYLcM",
};

export const IN_PRODUCTION: InProductionData = {
  title: "The Kyrgyzstan Film",
  description: "This film documents a journey through Kyrgyzstan’s remote mountains and wide open valleys, capturing nomadic life, untamed landscapes, and the human stories woven through one of the world’s most underrated countries. A raw and honest look at adventure, isolation, and connection.",
  status: "Post-Production",
  image: "https://images.unsplash.com/photo-1533240332313-0dbdd31c99a3?q=80&w=2000&auto=format&fit=crop",
};

export const SHORTS: Short[] = [
  { 
    id: '1', 
    title: "Sintel", 
    views: "5.4M", 
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop", 
    videoId: "eRsGyueVLvQ",
    showViews: true,
    year: "2023",
    category: "Fantasy"
  },
  { 
    id: '2', 
    title: "Coffee Run", 
    views: "850K", 
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop", 
    videoId: "YeUX1l56l7k",
    showViews: true,
    year: "2024",
    category: "Animation"
  },
  { 
    id: '3', 
    title: "Spring", 
    views: "2.1M", 
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1000&auto=format&fit=crop", 
    videoId: "WhWc3b3KhnY",
    showViews: true,
    year: "2023",
    category: "Nature"
  },
  { 
    id: '4', 
    title: "Cosmos", 
    views: "1.2M", 
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", 
    videoId: "Y-rmzh0PI3c",
    showViews: true,
    year: "2022",
    category: "Sci-Fi"
  },
];

export const FILMS: Film[] = [
  {
    id: '1',
    title: "Vantage Point",
    category: "Documentary",
    tagline: "Perspective shifts everything.",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2000&auto=format&fit=crop",
    videoId: "jfopjfSYLcM",
    description: "A deep dive into the human condition seen from the edge of the world. This documentary challenges how we see our environment and ourselves.",
    year: "2024",
    match: "98% Match",
    maturityRating: "TV-14",
    duration: "1h 45m"
  },
  {
    id: '2',
    title: "Apex",
    category: "Commercial",
    tagline: "Performance at its peak.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop",
    videoId: "jfopjfSYLcM",
    description: "High-octane commercial work for leading automotive brands. Speed, precision, and cinematic excellence.",
    year: "2023",
    match: "95% Match",
    maturityRating: "TV-PG",
    duration: "2m 30s"
  },
  {
    id: '3',
    title: "Blue Horizon",
    category: "Short Film",
    tagline: "How far would you go?",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2000&auto=format&fit=crop",
    videoId: "jfopjfSYLcM",
    description: "A narrative short film about exploration and the cost of discovery set against the backdrop of the deep ocean.",
    year: "2023",
    match: "92% Match",
    maturityRating: "TV-14",
    duration: "15m"
  },
];
