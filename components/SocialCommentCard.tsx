import React from 'react';
import { Card } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Heart, ThumbsUp, ThumbsDown, MessageCircle, Repeat, Share2 } from 'lucide-react';
import { Testimonial } from '../types';
import { cn } from '../lib/utils';

interface SocialCommentCardProps {
  testimonial: Testimonial;
  className?: string;
}

export const SocialCommentCard: React.FC<SocialCommentCardProps> = ({ testimonial, className }) => {
  const platform = testimonial.platform || 'instagram';
  const username = testimonial.username || (testimonial.name ? testimonial.name.toLowerCase().replace(/\s+/g, '_') : 'creator');
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  const timeAgo = testimonial.timeAgo || '3d';
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
          <span key={index} className="text-[#0095F6]/90 hover:underline cursor-pointer">
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
              <span className="text-white/35 text-[11px] ml-1 font-sans">{timeAgo}</span>
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
                <span className="text-white/40 text-[11px]">{timeAgo}</span>
              </div>
              <YouTubeGlyph />
            </div>

            <p className="text-[13px] text-white/90 leading-snug mt-1 font-normal break-words font-sans">
              {renderFormattedText(testimonial.text)}
            </p>

            <div className="flex items-center gap-4 mt-2.5 text-[11px] text-white/50">
              <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                <ThumbsUp size={13} />
                <span className="text-[10px] font-mono">{likes}</span>
              </div>
              <div className="hover:text-white cursor-pointer transition-colors">
                <ThumbsDown size={13} />
              </div>
              <span className="font-medium hover:text-white cursor-pointer transition-colors ml-1">
                Reply
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // 3. TWITTER / X REPLY LAYOUT
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
              <span className="text-white/30 text-[11px]">·</span>
              <span className="text-white/40 text-[11px] shrink-0 font-sans">{timeAgo}</span>
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
