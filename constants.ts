
import { Film, Short, NavItem, InProductionData, ProjectHeroConfig } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Work', href: '#work' },
  { label: 'Shorts', href: '#shorts' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

// High-end cinematic portrait of a creator in a vast landscape (matches drone pilot vibe)
export const LIAM_PORTRAIT = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"; 

export const TESTIMONIALS = [
  {
    id: '1',
    name: "Zoe Grace",
    company: "Levee",
    text: "Mavestone doesn't just deliver content; they deliver a feeling. The cinematic weight of their work is unmatched.",
    // Using abstract geometric shapes/symbols to simulate logos
    avatar: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: '2',
    name: "Rob Robinson",
    company: "ILAN",
    text: "Working with Liam transformed our brand's visual identity. He brings an editorial soul to commercial briefs.",
    avatar: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: '3',
    name: "Sarah Jenkins",
    company: "Flux Media",
    text: "The ability to find the human heart in a complex story is what makes Mavestone a global standout.",
    avatar: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: '4',
    name: "Mark Thorne",
    company: "Peak Performance",
    text: "Absolute precision from storyboard to screen. Professional, visionary, and technically flawless.",
    avatar: "https://images.unsplash.com/photo-1563694983011-6f4d90358083?q=80&w=200&auto=format&fit=crop"
  }
];

// Generated SVG Data URI for 'M ORIGINAL' Logo placeholder
const DEFAULT_LOGO_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100' fill='none'%3E%3Ctext x='10' y='80' font-family='sans-serif' font-weight='900' font-size='80' fill='%23E50914'%3EM%3C/text%3E%3Ctext x='90' y='75' font-family='sans-serif' font-weight='700' font-size='24' letter-spacing='8' fill='%23FFFFFF'%3EORIGINAL%3C/text%3E%3C/svg%3E";

export const PROJECT_PAGE_CONFIG: ProjectHeroConfig = {
  heroVideoId: "jfopjfSYLcM",
  label: "Original",
  featuredFilmId: "1", // Default to Vantage Point
  logoImage: DEFAULT_LOGO_IMAGE 
};

export const LATEST_VIDEO = {
  title: "The Escape",
  description: "Clive Owen returns as The Driver in this action-packed short film featuring high-stakes driving and cinematic storytelling.",
  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop", 
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
    location: "Tokyo, Japan",
    filmType: "Feature",
    duration: "1h 45m",
    genres: "Documentary, Travel, Society"
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
    location: "Munich, Germany",
    filmType: "Spot",
    duration: "2m 30s",
    genres: "Automotive, Action"
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
    location: "Pacific Ocean",
    filmType: "Short",
    duration: "15m",
    genres: "Drama, Sci-Fi"
  },
];

export const CLIENT_WORK: Film[] = [
  {
    id: 'c1',
    title: "Porsche: 911 Legacy",
    category: "Commercial",
    tagline: "Timeless machine.",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2000&auto=format&fit=crop",
    videoId: "jfopjfSYLcM",
    description: "A commercial celebrating 60 years of the Porsche 911. Precision engineering meets cinematic storytelling.",
    year: "2023",
    location: "Stuttgart, Germany",
    filmType: "Commercial",
    duration: "60s",
    genres: "Automotive, Luxury"
  },
  {
    id: 'c2',
    title: "Nike: Run Forever",
    category: "Brand Campaign",
    tagline: "Unstoppable motion.",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop",
    videoId: "jfopjfSYLcM",
    description: "High energy global campaign for the new running lineup. Capturing the raw emotion of movement.",
    year: "2024",
    location: "Portland, USA",
    filmType: "Spot",
    duration: "45s",
    genres: "Sports, Lifestyle"
  },
  {
    id: 'c3',
    title: "Aesop: Tactility",
    category: "Brand Film",
    tagline: "Sensory design.",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2000&auto=format&fit=crop",
    videoId: "jfopjfSYLcM",
    description: "Exploring the texture and scent of the new collection through a purely visual and auditory journey.",
    year: "2023",
    location: "Melbourne, Australia",
    filmType: "Brand Film",
    duration: "2m",
    genres: "Beauty, Design"
  }
];
