import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Sparkles, Mail, Shield } from 'lucide-react';
import { personalDetails } from '../data/portfolioData';
import heroPhoto from '../assets/hero-photo.jpg';
import { heroContainerVariants, heroItemVariants, heroPhotoVariants } from '../utils/animations';

export default function HeroSection() {
  const handleExploreProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactMe = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Subtle Ambient Glow Shapes in Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Student Status Badge */}
            <motion.div variants={heroItemVariants} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-500/30 text-xs font-mono-tech text-cyan-600 dark:text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Sparkles className="w-3.5 h-3.5" />
              <span>3rd Year B.Tech — CS (Cybersecurity) @ Vignan University</span>
            </motion.div>

            {/* Complete Full Name Heading */}
            <motion.div variants={heroItemVariants}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none font-mono-tech">
                GALI VENKATA
                <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  SIDDHARTHA REDDY
                </span>
              </h1>

              {/* Title Label */}
              <div className="mt-3 inline-block px-3.5 py-1 rounded-lg bg-slate-900/5 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700/60">
                <span className="text-sm sm:text-base font-bold font-mono-tech text-cyan-600 dark:text-cyan-400 tracking-widest uppercase flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>{personalDetails.title}</span>
                </span>
              </div>
            </motion.div>

            {/* Short Description */}
            <motion.p variants={heroItemVariants} className="text-base sm:text-lg text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed font-normal">
              "{personalDetails.bioHeadline}"
            </motion.p>

            {/* Security Tags */}
            <motion.div variants={heroItemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {personalDetails.heroTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold font-mono-tech bg-slate-200/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 shadow-xs"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>

            {/* Action CTA Buttons */}
            <motion.div variants={heroItemVariants} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#projects"
                onClick={handleExploreProjects}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center space-x-2 group transform active:scale-95"
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                onClick={handleContactMe}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-card text-slate-900 dark:text-white font-bold text-sm tracking-wide hover:border-cyan-400 transition-all flex items-center justify-center space-x-2 shadow-md transform active:scale-95"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>CONTACT ME</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Hero Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              variants={heroPhotoVariants}
              initial="hidden"
              animate="visible"
              className="relative group max-w-md w-full"
            >
              <div className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 glass-card border border-slate-300 dark:border-cyan-500/30 shadow-2xl overflow-hidden">
                <img
                  src={heroPhoto}
                  alt="Gali Venkata Siddhartha Reddy Hero Photograph"
                  className="w-full h-auto aspect-[4/5] max-h-[480px] sm:max-h-[520px] lg:max-h-[540px] object-cover object-top rounded-xl sm:rounded-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                />

                {/* Glass Badge: CYBERSECURITY STUDENT */}
                <div className="absolute bottom-4 right-4 p-2.5 sm:p-3 rounded-xl glass-card border border-cyan-400/40 text-cyan-400 shadow-xl flex items-center space-x-2 backdrop-blur-md">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-mono-tech font-bold tracking-wider text-slate-900 dark:text-white">
                    CYBERSECURITY STUDENT
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
