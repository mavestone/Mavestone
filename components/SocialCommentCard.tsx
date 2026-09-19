import React from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Heart, ThumbsUp, ThumbsDown, MessageCircle, Repeat, Share2 } from 'lucide-react';
import { Testimonial } from '../types';
import { cn } from '../lib/utils';
import { LIAM_PORTRAIT } from '../constants';

export const LINKEDIN_REACTION_MAP: Record<string, { label: string; emoji: string; bg: string }> = {
  like: { label: 'Like', emoji: '👍', bg: 'bg-[#0A66C2]' },
  celebrate: { label: 'Celebrate', emoji: '👏', bg: 'bg-[#2E7D32]' },
  support: { label: 'Support', emoji: '🤝', bg: 'bg-[#705FC9]' },
  love: { label: 'Love', emoji: '❤️', bg: 'bg-[#DF704D]' },
  insightful: { label: 'Insightful', emoji: '💡', bg: 'bg-[#E7A33E]' },
  funny: { label: 'Funny', emoji: '😂', bg: 'bg-[#00A0DC]' },
};

interface SocialCommentCardProps {
  testimonial: Testimonial;
  className?: string;
}

export const SocialCommentCard: React.FC<SocialCommentCardProps> = ({ testimonial, className }) => {
  const platform = testimonial.platform || 'instagram';
  const username = testimonial.username || (testimonial.name ? testimonial.name.toLowerCase().replace(/\s+/g, '_') : 'creator');
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  const likes = testimonial.likes || '245';
  const isVerified = testimonial.verified ?? true;

  // Instagram Verified Badge SVG
  const VerifiedBadge = () => (
    <svg className="w-3.5 h-3.5 text-[#0095F6] inline-block shrink-0 fill-current ml-1" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.8 14.2l-3.7-3.7 1.41-1.41 2.29 2.29 5.88-5.88 1.41 1.41-7.29 7.29z" />
    </svg>
  );

  // Instagram Platform Icon
  const InstagramGlyph = () => (
    <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-pink-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );

  // YouTube Glyph
  const YouTubeGlyph = () => (
    <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-red-500 transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );

  // Twitter/X Glyph
  const TwitterGlyph = () => (
    <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-sky-400 transition-colors shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  // LinkedIn Glyph
  const LinkedInGlyph = () => (
    <svg className="w-3.5 h-3.5 text-[#0A66C2] shrink-0 fill-current" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );

  // Helper to format comment text and highlight @mentions and #hashtags
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-[#0095F6] font-medium hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-[#0095F6] font-medium hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // 1. INSTAGRAM COMMENT LAYOUT
  if (platform === 'instagram') {
    return (
      <Card
        className={cn(
          "w-72 sm:w-80 shrink-0 p-4 bg-[#0d0d12] border border-white/10 rounded-2xl shadow-xl hover:border-white/30 hover:bg-[#14141c] hover:shadow-2xl transition-all duration-300 group select-none text-left [backface-visibility:hidden] [transform:translateZ(0)]",
          className
        )}
      >
        <div className="flex items-start gap-3">
          {/* Avatar with subtle gradient story ring effect */}
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] opacity-75 group-hover:opacity-100 transition-opacity blur-[1px]"></div>
            <Avatar className="relative h-9 w-9 border border-black">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
              <AvatarFallback className="bg-white/10 text-white text-[10px] font-bold">
                {testimonial.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Comment Body */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-xs text-white tracking-tight hover:underline cursor-pointer font-sans">
                {cleanUsername}
              </span>
              {isVerified && <VerifiedBadge />}
            </div>

            <p className="text-[13px] text-white/90 leading-snug mt-1 font-normal break-words font-sans">
              {renderFormattedText(testimonial.text)}
            </p>

            {/* Instagram Footer Actions */}
            <div className="flex items-center gap-4 mt-2.5 text-[11px] text-white/40 font-semibold font-sans">
              <span className="hover:text-white transition-colors cursor-pointer">Reply</span>
              <span className="hover:text-white transition-colors cursor-pointer">Share</span>
              <div className="ml-auto flex items-center gap-1">
                <InstagramGlyph />
              </div>
            </div>
          </div>

          {/* Right Like Column */}
          <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5 pl-1">
            <button 
              className="text-white/30 hover:text-red-500 group-hover:text-white/50 transition-colors p-1"
              aria-label="Like comment"
            >
              <Heart size={14} className="hover:fill-red-500 hover:text-red-500 transition-colors" />
            </button>
            <span className="text-[10px] text-white/40 font-mono tracking-tighter">
              {likes}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // 2. YOUTUBE COMMENT LAYOUT
  if (platform === 'youtube') {
    return (
      <Card
        className={cn(
          "w-72 sm:w-80 shrink-0 p-4 bg-[#0f0f15] border border-white/10 rounded-2xl shadow-xl hover:border-white/30 hover:bg-[#14141c] hover:shadow-2xl transition-all duration-300 group select-none text-left [backface-visibility:hidden] [transform:translateZ(0)]",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 shrink-0 border border-white/10">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
            <AvatarFallback className="bg-white/10 text-white text-[10px] font-bold">
              {testimonial.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="font-semibold text-xs text-white/95 truncate">
                  @{cleanUsername}
                </span>
                {isVerified && <VerifiedBadge />}
              </div>
              <YouTubeGlyph />
            </div>

            <p className="text-[13px] text-white/90 leading-snug mt-1 font-normal break-words font-sans">
              {renderFormattedText(testimonial.text)}
            </p>

            <div className="flex items-center gap-3 mt-2.5 text-[11px] text-white/50">
              <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <ThumbsUp size={13} />
                <span className="text-[10px] font-mono">{likes}</span>
              </div>
              <div className="hover:text-white cursor-pointer transition-colors">
                <ThumbsDown size={13} />
              </div>

              {/* YouTube Creator Heart Badge */}
              {testimonial.likedByMe && (
                <div className="flex items-center ml-0.5" title="Hearted by creator">
                  <div className="relative flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full overflow-hidden border border-white/20">
                      <img 
                        src={LIAM_PORTRAIT} 
                        alt="Creator" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#0f0f15] rounded-full p-[1px]">
                      <svg className="w-2.5 h-2.5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <span className="font-medium hover:text-white cursor-pointer transition-colors ml-1">
                Reply
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // 3. LINKEDIN COMMENT / RECOMMENDATION LAYOUT
  if (platform === 'linkedin') {
    const headline = testimonial.company || (testimonial.username ? `@${cleanUsername}` : 'Creative Director & Producer');
    const activeReactions = (testimonial.reactions && testimonial.reactions.length > 0)
      ? testimonial.reactions
      : (['like', 'love', 'celebrate'] as (keyof typeof LINKEDIN_REACTION_MAP)[]);

    return (
      <Card
        className={cn(
          "w-72 sm:w-80 shrink-0 p-4 bg-[#0a0f16] border border-white/10 rounded-2xl shadow-xl hover:border-[#0A66C2]/40 hover:bg-[#0e141f] hover:shadow-2xl transition-all duration-300 group select-none text-left [backface-visibility:hidden] [transform:translateZ(0)]",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 shrink-0 border border-white/10 rounded-full">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
            <AvatarFallback className="bg-white/10 text-white text-[10px] font-bold">
              {testimonial.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-xs text-white hover:text-[#70B5F9] transition-colors cursor-pointer font-sans truncate">
                    {testimonial.name}
                  </span>
                  <span className="text-white/35 text-[10px] font-medium font-sans">· 1st</span>
                </div>
                <p className="text-[10px] text-white/50 font-normal truncate font-sans max-w-[185px] leading-tight mt-0.5">
                  {headline}
                </p>
              </div>
              <LinkedInGlyph />
            </div>

            <p className="text-[13px] text-white/90 leading-snug mt-2 font-normal break-words font-sans">
              {renderFormattedText(testimonial.text)}
            </p>

            {/* LinkedIn Reactions & Actions */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] text-white/40">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex -space-x-1 items-center">
                  {activeReactions.map((rKey) => {
                    const r = LINKEDIN_REACTION_MAP[rKey] || LINKEDIN_REACTION_MAP.like;
                    return (
                      <span 
                        key={rKey} 
                        className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white border border-[#0a0f16]", r.bg)}
                        title={r.label}
                      >
                        {r.emoji}
                      </span>
                    );
                  })}
                </span>
                <span className="text-[10px] font-mono text-white/50">{likes}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-white/40">
                <span className="hover:text-white transition-colors cursor-pointer">Like</span>
                <span className="text-white/20">·</span>
                <span className="hover:text-white transition-colors cursor-pointer">Reply</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // 4. TWITTER / X REPLY LAYOUT
  return (
    <Card
      className={cn(
        "w-72 sm:w-80 shrink-0 p-4 bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-xl hover:border-white/30 hover:bg-[#14141c] hover:shadow-2xl transition-all duration-300 group select-none text-left [backface-visibility:hidden] [transform:translateZ(0)]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0 border border-white/10">
          <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
          <AvatarFallback className="bg-white/10 text-white text-[10px] font-bold">
            {testimonial.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-xs text-white truncate font-sans">
                {testimonial.name}
              </span>
              {isVerified && <VerifiedBadge />}
              <span className="text-white/40 text-[11px] truncate font-sans">
                @{cleanUsername}
              </span>
            </div>
            <TwitterGlyph />
          </div>

          <p className="text-[13px] text-white/90 leading-snug mt-1.5 font-normal break-words font-sans">
            {renderFormattedText(testimonial.text)}
          </p>

          <div className="flex items-center justify-between mt-3 text-[11px] text-white/40 max-w-[200px]">
            <div className="flex items-center gap-1 hover:text-sky-400 cursor-pointer transition-colors">
              <MessageCircle size={13} />
              <span className="text-[10px]">12</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-400 cursor-pointer transition-colors">
              <Repeat size={13} />
              <span className="text-[10px]">4</span>
            </div>
            <div className="flex items-center gap-1 hover:text-pink-500 cursor-pointer transition-colors">
              <Heart size={13} />
              <span className="text-[10px]">{likes}</span>
            </div>
            <div className="hover:text-white cursor-pointer transition-colors">
              <Share2 size={13} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SocialCommentCard;
