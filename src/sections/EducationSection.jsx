import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { educationData } from '../data/portfolioData';
import { fadeInUpVariants, timelineNodeVariants } from '../utils/animations';

export default function EducationSection() {
  return (
    <section id="education" className="py-16 md:py-24 relative">
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
            <GraduationCap className="w-4 h-4" />
            <span>ACADEMIC BACKGROUND</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            EDUCATION
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="max-w-4xl mx-auto space-y-6">
          {educationData.map((item) => (
            <div key={item.id} className="relative pl-6 sm:pl-10 border-l-2 border-cyan-500/30 pb-6 last:pb-0">
              {/* Timeline Bullet Node */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={timelineNodeVariants}
                className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  item.isCurrent
                    ? 'bg-slate-950 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/40 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
              </motion.div>

              {/* Glass Card */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeInUpVariants}
                className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md hover:border-cyan-500/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    {item.isCurrent && (
                      <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-1">
                        CURRENTLY STUDYING (3RD YEAR — 1ST SEM)
                      </span>
                    )}
                    <h3 className="text-lg font-bold font-mono-tech text-slate-900 dark:text-white">
                      {item.institution}
                    </h3>
                    <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                      {item.degree}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end text-xs font-mono-tech text-slate-500 dark:text-slate-400 space-y-1">
                    <span className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.period}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </span>
                  </div>
                </div>

                {/* Score / CGPA Highlight */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech">
                  {item.cgpa && (
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      <Award className="w-4 h-4" />
                      <span>CGPA: <strong className="text-sm font-extrabold">{item.cgpa}</strong></span>
                    </div>
                  )}

                  {item.marks && (
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                      <Award className="w-4 h-4" />
                      <span>Marks: <strong className="text-sm font-extrabold">{item.marks}</strong></span>
                    </div>
                  )}

                  <span className="text-slate-400">{item.status}</span>
                </div>

              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
