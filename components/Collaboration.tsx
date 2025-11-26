
import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { MagneticButton } from './ui/MagneticButton';
import { motion } from 'framer-motion';

const features = [
  { title: "Story First", desc: "We lead with story, not templates. Every pixel serves the narrative." },
  { title: "Cinematic Default", desc: "Every frame feels intentional. High-end visual fidelity is our baseline." },
  { title: "Built for Attention", desc: "Designed for the scroll economy. We hook audiences in seconds." },
  { title: "Human Process", desc: "Real collaboration. No black boxes. We build with you." },
];

export const Collaboration: React.FC = () => {
  return (
    <SectionWrapper id="about">
      {/* Collaboration Text */}
      <div className="py-24 border-b border-white/10">
        <div className="max-w-4xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-8">
                We collaborate with brands, founders and creators who want to tell <span className="text-gray-500">real stories</span>.
            </h2>
            <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl">
                If you’re building something that matters — we should talk. We don't just make videos; we engineer emotions.
            </p>
            <MagneticButton variant="primary">
                Start a Collaboration
            </MagneticButton>
        </div>
      </div>

      {/* Why Mavestone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        {features.map((feature, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300"
            >
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};
