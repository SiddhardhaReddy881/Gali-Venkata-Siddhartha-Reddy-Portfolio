import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Layers, Cloud, ShieldCheck, Database, Wrench, Cpu } from 'lucide-react';
import { skillCategories } from '../data/portfolioData';
import { fadeInUpVariants, staggerContainerVariants, cardRevealVariants } from '../utils/animations';

const iconMap = {
  Code2: Code2,
  Layers: Layers,
  Cloud: Cloud,
  ShieldCheck: ShieldCheck,
  Database: Database,
  Wrench: Wrench,
};

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 md:py-24 relative">
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
            <Cpu className="w-4 h-4" />
            <span>DOMAINS & COMPETENCIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            TECHNICAL SKILLS
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* 6 Glass Cards Grid with Staggered Scroll Reveal */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => {
            const IconComponent = iconMap[category.iconName] || Cpu;
            return (
              <motion.div
                key={category.id}
                variants={cardRevealVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-cyan-500 dark:text-cyan-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold font-mono-tech text-slate-900 dark:text-white tracking-wide">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skill Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold font-mono-tech bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:-translate-y-0.5 transition-all shadow-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-between items-center text-[10px] font-mono-tech text-slate-400">
                  <span>CATEGORY #{category.id.toUpperCase()}</span>
                  <span className="text-cyan-500 font-semibold">{category.skills.length} MODULES</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
