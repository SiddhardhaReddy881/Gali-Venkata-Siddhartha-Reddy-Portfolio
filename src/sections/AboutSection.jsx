import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, BookOpen, Shield, Network, Eye, Brain } from 'lucide-react';
import { personalDetails } from '../data/portfolioData';
import aboutPhoto from '../assets/about-photo.jpg';
import { fadeInUpVariants, staggerContainerVariants, cardRevealVariants } from '../utils/animations';

export default function AboutSection() {
  const highlights = [
    { label: 'Cybersecurity', icon: Shield, color: 'text-cyan-400' },
    { label: 'Network Security', icon: Network, color: 'text-blue-400' },
    { label: 'Threat Detection', icon: Eye, color: 'text-purple-400' },
    { label: 'Continuous Learning', icon: Brain, color: 'text-emerald-400' },
  ];

  return (
    <section id="about" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUpVariants}
          className="flex flex-col items-center mb-12 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-500/30 text-xs font-mono-tech text-cyan-600 dark:text-cyan-400 mb-3">
            <UserCheck className="w-4 h-4" />
            <span>BACKGROUND & VISION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            ABOUT ME
          </h2>
          <p className="mt-2 text-sm sm:text-base font-semibold text-cyan-600 dark:text-cyan-400 font-mono-tech">
            {personalDetails.degree} — {personalDetails.branch} @ {personalDetails.college}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* Professional 2-Column Layout with Neat Photo Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Suit Photo (Neat, balanced executive portrait frame) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUpVariants}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-slate-300 dark:border-cyan-500/30 shadow-2xl overflow-hidden">
                <img
                  src={aboutPhoto}
                  alt="Gali Venkata Siddhartha Reddy About Photograph"
                  className="w-full h-auto aspect-[4/5] max-h-[480px] sm:max-h-[520px] object-cover object-top rounded-xl sm:rounded-2xl"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: About Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUpVariants}
            className="lg:col-span-7 space-y-6"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                {personalDetails.aboutText.map((paragraph, idx) => (
                  <p key={idx}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Highlights Pills Grid */}
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {highlights.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      variants={cardRevealVariants}
                      className="p-3 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-700/50 flex flex-col items-center text-center space-y-1.5 hover:border-cyan-400 transition-all group"
                    >
                      <div className={`p-2 rounded-xl bg-slate-900/5 dark:bg-slate-800/60 ${item.color} group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono-tech font-bold text-slate-800 dark:text-slate-200">
                        {item.label}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Academic Snapshot Bar */}
              <div className="mt-4 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech text-slate-700 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>College: <strong className="text-slate-900 dark:text-white">{personalDetails.college}</strong></span>
                </div>
                <div>
                  Status: <strong className="text-cyan-600 dark:text-cyan-400">{personalDetails.academicStatus}</strong>
                </div>
                <div>
                  CGPA: <strong className="text-emerald-500 dark:text-emerald-400">{personalDetails.cgpa}</strong>
                </div>
                <div>
                  Graduation: <strong className="text-purple-600 dark:text-purple-400">{personalDetails.graduationYear}</strong>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
