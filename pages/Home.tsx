
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { LatestVideo } from '../components/LatestVideo';
import { Shorts } from '../components/Shorts';
import { Collaboration } from '../components/Collaboration';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { AdminPanel } from '../components/AdminPanel';
import { ScrollIndicator } from '../components/ui/ScrollIndicator';

export const Home: React.FC = () => {
  return (
    <>
        <ScrollIndicator />
        <Navbar />
        <main>
            <Hero />
            <LatestVideo />
            <Shorts />
            <Collaboration />
            <Contact />
        </main>
        <Footer />
        <AdminPanel />
    </>
  );
};
