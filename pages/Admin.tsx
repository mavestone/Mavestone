import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Home } from './Home';

export const Admin: React.FC = () => {
  const { isAuthenticated, isLoading, openAdmin } = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    // If loading finishes and we aren't authenticated, go to login
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (isAuthenticated) {
      // If logged in, show the site but auto-open the admin panel
      openAdmin();
    }
  }, [isLoading, isAuthenticated, navigate, openAdmin]);

  if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  
  // Security fallback: if not authenticated, don't render admin content
  if (!isAuthenticated) return null;

  return <Home />;
};