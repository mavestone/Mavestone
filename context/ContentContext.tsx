
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LATEST_VIDEO, SHORTS, FILMS } from '../constants';
import { Film, Short, LatestVideoData } from '../types';

interface ContentContextType {
  latestVideo: LatestVideoData;
  shorts: Short[];
  films: Film[];
  isAdminOpen: boolean;
  toggleAdmin: () => void;
  updateLatestVideo: (data: Partial<LatestVideoData>) => void;
  updateShort: (id: string, data: Partial<Short>) => void;
  updateFilm: (id: string, data: Partial<Film>) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Initialize state with Lazy Initializers to check LocalStorage first
  const [latestVideo, setLatestVideo] = useState<LatestVideoData>(() => {
    const saved = localStorage.getItem('mavestone_latest_video');
    return saved ? JSON.parse(saved) : LATEST_VIDEO;
  });

  const [shorts, setShorts] = useState<Short[]>(() => {
    const saved = localStorage.getItem('mavestone_shorts');
    return saved ? JSON.parse(saved) : SHORTS;
  });

  const [films, setFilms] = useState<Film[]>(() => {
    const saved = localStorage.getItem('mavestone_films');
    return saved ? JSON.parse(saved) : FILMS;
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('mavestone_latest_video', JSON.stringify(latestVideo));
  }, [latestVideo]);

  useEffect(() => {
    localStorage.setItem('mavestone_shorts', JSON.stringify(shorts));
  }, [shorts]);

  useEffect(() => {
    localStorage.setItem('mavestone_films', JSON.stringify(films));
  }, [films]);

  const toggleAdmin = () => setIsAdminOpen(prev => !prev);

  const updateLatestVideo = (data: Partial<LatestVideoData>) => {
    setLatestVideo(prev => ({ ...prev, ...data }));
  };

  const updateShort = (id: string, data: Partial<Short>) => {
    setShorts(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const updateFilm = (id: string, data: Partial<Film>) => {
    setFilms(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const resetContent = () => {
    setLatestVideo(LATEST_VIDEO);
    setShorts(SHORTS);
    setFilms(FILMS);
  };

  return (
    <ContentContext.Provider value={{
      latestVideo,
      shorts,
      films,
      isAdminOpen,
      toggleAdmin,
      updateLatestVideo,
      updateShort,
      updateFilm,
      resetContent
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
