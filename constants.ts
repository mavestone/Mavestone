
import { Film, Short, NavItem, InProductionData, ProjectHeroConfig, HiringData } from './types';

export const HIRING_DATA: HiringData = {
  titleLine1: "I'm hiring a",
  titleLine2: "cinematic storyteller/editor",
  titleLine3: "to join the team.",
  introParagraph1: "I'm Liam, a filmmaker and founder. I'm looking for a monthly retainer video editor to cut reels for my personal brand Instagram @liamcinema.",
  introParagraph2: "You’ll be working with footage from professional cinema cameras across travel films, reels and documentary content.",
  introParagraph3: "\"If your edits feel like short films instead of 'content', send your work.\"",
  roleRequirements: [
    "Edit high-end travel & documentary style content",
    "Follow story and pacing, not just make flashy edits",
    "Colour grade professionally in DaVinci Resolve",
    "Add motion graphics/text when needed",
    "Understand cinematic composition, sound design & emotion"
  ],
  applicantParagraph: "I hire on attitude and taste as much as technical skill. You should be hungry to make the best work possible, not just clock in and drag clips onto a timeline. If you watch a cut and know it could be 1% better, you make it 1% better before sending it. You communicate clearly, hit deadlines effortlessly, and take pride in the craft.",
  processSteps: [
    "Download our raw footage from the Google Drive link below.",
    "Edit the footage and craft an engaging reel. Take your time, show your skills.",
    "Upload your finished cut and submit it for review."
  ],
  callToActionURL: "https://drive.google.com/drive/folders/14TULwn541F9Jh1nV42A0fPf93Qi7Di1R?usp=sharing",
  cta1Label: "Download Footage",
  cta1URL: "https://drive.google.com/drive/folders/14TULwn541F9Jh1nV42A0fPf93Qi7Di1R?usp=sharing",
  cta1Color: "#E8A020",
  cta2Label: "Submit Your Edit",
  cta2URL: "",
  cta2Color: "#FFFFFF",
  heroImage: "",
  card1Media: "",
  card2Media: "",
  card3Media: ""
};

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
    name: "Marcus Vance",
    username: "marcusvance.cin",
    platform: "instagram" as const,
    text: "The color grade on this project is unreal. That 35mm film emulation in the intro gave me actual chills 🔥",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    likes: "418",
    timeAgo: "2d",
    verified: true,
    company: "Levee"
  },
  {
    id: '2',
    name: "Elena Rostova",
    username: "elenarostova",
    platform: "instagram" as const,
    text: "Watched this three times back to back. The sound design alone deserves an award. Pure cinema 🙌",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    likes: "285",
    timeAgo: "4d",
    verified: true,
    company: "ILAN"
  },
  {
    id: '3',
    name: "Kai Takahashi",
    username: "kaitakahashi_",
    platform: "instagram" as const,
    text: "Mavestone never misses. That anamorphic flare transition into the final scene was masterclass 👏",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    likes: "192",
    timeAgo: "1w",
    verified: false,
    company: "Flux Media"
  },
  {
    id: '4',
    name: "David Chen",
    username: "davidchenfilms",
    platform: "youtube" as const,
    text: "This isn't just commercial work, this is genuine narrative filmmaking. Inspiring as always!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    likes: "1.2k",
    timeAgo: "3 weeks ago",
    verified: true,
    company: "Peak Performance"
  },
  {
    id: '5',
    name: "Sofia Alvarez",
    username: "sofia.alvarez",
    platform: "instagram" as const,
    text: "Every single frame could be printed and hung in a gallery. Extraordinary visual storytelling.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    likes: "340",
    timeAgo: "5d",
    verified: true,
    company: "Vogue Creative"
  },
  {
    id: '6',
    name: "Julian Gray",
    username: "juliangray",
    platform: "twitter" as const,
    text: "Still thinking about the pacing in that last short. Liam’s team operate on a completely different level.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    likes: "892",
    timeAgo: "18h",
    verified: true,
    company: "Aperture"
  },
  {
    id: '7',
    name: "Maya Sterling",
    username: "mayasterling_",
    platform: "instagram" as const,
    text: "The storytelling is so raw and authentic. Best production studio in the game right now.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
    likes: "512",
    timeAgo: "6d",
    verified: true,
    company: "Monolith"
  },
  {
    id: '8',
    name: "Leo Dubois",
    username: "leodubois",
    platform: "instagram" as const,
    text: "That transition at 0:42 made my jaw drop. The craft in your edits is unmatched 🤯",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop",
    likes: "167",
    timeAgo: "2w",
    verified: false,
    company: "CineCore"
  }
];

// Generated SVG Data URI for 'M ORIGINAL' Logo placeholder
const DEFAULT_LOGO_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100' fill='none'%3E%3Ctext x='10' y='80' font-family='sans-serif' font-weight='900' font-size='80' fill='%23E50914'%3EM%3C/text%3E%3Ctext x='90' y='75' font-family='sans-serif' font-weight='700' font-size='24' letter-spacing='8' fill='%23FFFFFF'%3EORIGINAL%3C/text%3E%3C/svg%3E";

export const PROJECT_PAGE_CONFIG: ProjectHeroConfig = {
  heroVideoId: "jfopjfSYLcM",
  label: "Original",
  featuredFilmId: "1", // Default to Vantage Point
  logoImage: DEFAULT_LOGO_IMAGE,
  customLogoSvg: ""
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
