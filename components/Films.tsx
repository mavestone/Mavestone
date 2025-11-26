
import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const Films: React.FC = () => {
  const { films } = useContent();

  return (
    <SectionWrapper id="films" className="bg-charcoal">
      <div className="flex flex-col mb-16">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">Selected Works</h2>
        <div className="h-[1px] w-full bg-white/10"></div>
      </div>

      <div className="flex flex-col gap-12 md:gap-24">
        {films.map((film, index) => (
          <motion.div 
            key={film.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
          >
            {/* Image Card */}
            <div className="w-full md:w-3/5">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden group">
                     <motion.img
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.7 }}
                        src={film.image}
                        alt={film.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/5 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-[1px] bg-white/50"></span>
                    <span className="text-sm uppercase tracking-widest text-gray-400">{film.category}</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white">{film.title}</h3>
                <p className="text-xl text-gray-400 font-light italic">"{film.tagline}"</p>
                
                <button className="group flex items-center gap-2 mt-6 text-white text-sm font-medium hover:text-gray-300 transition-colors">
                    Explore Case Study
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};