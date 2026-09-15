import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, ShieldAlert, Building2, UserCheck, Sparkles } from 'lucide-react';
import { researchData } from '../data/portfolioData';
import { fadeInUpVariants } from '../utils/animations';

export default function ResearchSection() {
  return (
    <section id="research" className="py-16 md:py-24 relative">
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
            <Microscope className="w-4 h-4" />
            <span>ACADEMIC & INTERNSHIP EXPLORATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            RESEARCH & TECHNICAL INTERESTS
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* Main Research Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUpVariants}
          className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono-tech font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {researchData.label}
            </span>
            <span className="text-xs font-mono-tech text-slate-400 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{researchData.association}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-mono-tech text-slate-900 dark:text-white">
            {researchData.title}
          </h3>

          <div className="mt-3 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2 text-xs sm:text-sm font-mono-tech">
            <div className="flex items-start space-x-2 text-slate-800 dark:text-slate-200">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 dark:text-slate-400">Research Topic: </span>
                <strong className="text-cyan-600 dark:text-cyan-400">{researchData.topic}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400">Supervisor: </span>
                <strong className="text-slate-900 dark:text-white">{researchData.supervisor}</strong>
              </div>
            </div>
          </div>

          <p className="mt-6 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            "{researchData.description}"
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-xs font-mono-tech text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Focus Area: Smart Contract Vulnerability vectors, Attack Evaluation, Defense Robustness</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
