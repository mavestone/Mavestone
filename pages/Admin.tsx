import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Home } from './Home';

export const Admin: React.FC = () => {
  const { isAuthenticated, isLoading, openAdmin } = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated) {
      // If logged in, show the site but auto-open the admin panel
      openAdmin();
    }
  }, [isLoading, isAuthenticated, navigate, openAdmin]);

  if (isLoading) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!isAuthenticated) return null;

  return <Home />;
};