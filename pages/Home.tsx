import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { LatestVideo } from '../components/LatestVideo';
import { Shorts } from '../components/Shorts';
import { Films } from '../components/Films';
import { Collaboration } from '../components/Collaboration';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { AdminPanel } from '../components/AdminPanel';

export const Home: React.FC = () => {
  return (
    <>
        <Navbar />
        <main>
            <Hero />
            <LatestVideo />
            <Shorts />
            <Films />
            <Collaboration />
            <Contact />
        </main>
        <Footer />
        <AdminPanel />
    </>
  );
};