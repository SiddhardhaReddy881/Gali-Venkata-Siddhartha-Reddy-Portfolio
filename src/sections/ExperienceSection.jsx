import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, UserCheck, ShieldAlert, Award } from 'lucide-react';
import { experienceData } from '../data/portfolioData';
import { fadeInUpVariants, timelineLineVariants, timelineNodeVariants } from '../utils/animations';

export default function ExperienceSection({ onViewCertificate }) {
  return (
    <section id="experience" className="py-16 md:py-24 relative">
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
            <Briefcase className="w-4 h-4" />
            <span>RESEARCH & PROFESSIONAL INTERNSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            EXPERIENCE
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto">
          {experienceData.map((exp) => (
            <div key={exp.id} className="relative pl-6 sm:pl-10 border-l-2 border-cyan-500/40 pb-8 last:pb-0">
              
              {/* Timeline Bullet Node with Scale Animation */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={timelineNodeVariants}
                className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/30"
              >
                <Briefcase className="w-4 h-4" />
              </motion.div>

              {/* Main Card with Fade-Up Animation */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeInUpVariants}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
              >
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono-tech font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
                      {exp.role}
                    </span>
                    <h3 className="text-xl font-bold font-mono-tech text-slate-900 dark:text-white">
                      {exp.institution}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {exp.department}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end text-xs font-mono-tech text-slate-500 dark:text-slate-400 space-y-1">
                    <span className="flex items-center space-x-1.5 text-cyan-500 dark:text-cyan-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                {/* Internship Topic & Supervisor */}
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2 text-xs sm:text-sm font-mono-tech">
                  <div className="flex items-start space-x-2 text-slate-800 dark:text-slate-200">
                    <ShieldAlert className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Research Topic: </span>
                      <strong className="text-cyan-600 dark:text-cyan-400">{exp.topic}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                    <UserCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Supervisor: </span>
                      <strong className="text-slate-900 dark:text-white">{exp.supervisor}</strong>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{exp.description}"
                </p>

                {/* View Certificate CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() =>
                      onViewCertificate({
                        title: `${exp.institution} — Summer Internship Certificate`,
                        issuer: exp.institution,
                        file: exp.certificateFile,
                      })
                    }
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-cyan-500/20 flex items-center space-x-2 transition-all transform active:scale-95"
                  >
                    <Award className="w-4 h-4" />
                    <span>View IIITA Internship Certificate</span>
                  </button>
                </div>

              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
