
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { LatestVideo } from '../components/LatestVideo';
import { Shorts } from '../components/Shorts';
import { Collaboration } from '../components/Collaboration';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { ScrollIndicator } from '../components/ui/ScrollIndicator';
import { SmoothScroll } from '../components/ui/SmoothScroll';

export const Home: React.FC = () => {
  return (
    <>
        <ScrollIndicator />
        <Navbar />
        <SmoothScroll>
            <main>
                <Hero />
                <LatestVideo />
                <Shorts />
                <Collaboration />
                <Contact />
            </main>
            <Footer />
        </SmoothScroll>
    </>
  );
};
