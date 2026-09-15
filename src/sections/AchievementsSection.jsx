import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Building2, FileText } from 'lucide-react';
import { achievementsData } from '../data/portfolioData';
import { fadeInUpVariants, staggerContainerVariants, cardRevealVariants } from '../utils/animations';

export default function AchievementsSection({ onViewCertificate }) {
  return (
    <section id="achievements" className="py-16 md:py-24 relative">
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
            <Trophy className="w-4 h-4" />
            <span>HACKATHONS & LEADERSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            ACHIEVEMENTS & ACTIVITIES
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* Grid of Achievement Cards */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {achievementsData.map((item) => (
            <motion.div
              key={item.id}
              variants={cardRevealVariants}
              whileHover={{ y: -3 }}
              className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {item.type}
                  </span>
                  {item.date && (
                    <span className="text-xs font-mono-tech text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.date}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-mono-tech text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono-tech">
                  Status: {item.achievement}
                </p>

                {item.institution && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{item.institution}</span>
                  </p>
                )}

                {item.description && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    "{item.description}"
                  </p>
                )}
              </div>

              {item.certificateFile && (
                <div className="mt-5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                  <button
                    onClick={() =>
                      onViewCertificate({
                        title: item.title,
                        issuer: item.institution || item.type,
                        file: item.certificateFile,
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl glass-card hover:border-cyan-400 text-xs font-mono-tech font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Participation Certificate</span>
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
