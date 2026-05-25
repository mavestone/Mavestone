
import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

export const InProduction: React.FC = () => {
  const { inProduction } = useContent();

  return (
    <SectionWrapper id="in-production" className="bg-soft-black/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 text-left">
            <div>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-2">In Production</h2>
                <p className="text-gray-400">Currently in the works.</p>
            </div>
        </div>

        <div className="flex flex-col gap-8">
            {/* Image Container */}
            <motion.div 
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.5 }}
                className="w-full aspect-[21/9] rounded-3xl overflow-hidden bg-black shadow-2xl relative"
            >
                <img 
                    src={inProduction.image} 
                    alt={inProduction.title} 
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                />
                
                {/* Status Tag Overlay */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8">
                    <span className="px-3 py-1 bg-red-600/90 text-white text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md shadow-lg">
                        {inProduction.status}
                    </span>
                </div>
            </motion.div>

            {/* Text Box Underneath */}
            <div className="max-w-2xl text-left">
                <h3 className="text-xl md:text-3xl font-bold text-white mb-4">{inProduction.title}</h3>
                <p className="text-sm md:text-lg text-gray-400 leading-relaxed font-light whitespace-pre-wrap">
                    {inProduction.description}
                </p>
            </div>
        </div>
    </SectionWrapper>
  );
};
