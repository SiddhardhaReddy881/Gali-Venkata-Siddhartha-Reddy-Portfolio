import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Filter, FileText, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { certificationsData } from '../data/portfolioData';
import { fadeInUpVariants, cardRevealVariants } from '../utils/animations';

const filterCategories = ['All', 'Cybersecurity', 'Networking', 'Programming', 'Cloud', 'Hackathons'];

export default function CertificationsSection({ onViewCertificate }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filteredCerts = certificationsData.filter((cert) => {
    if (!showAll && !cert.featured) return false;
    if (activeFilter === 'All') return true;
    return cert.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const hiddenCount = certificationsData.filter((c) => !c.featured).length;

  return (
    <section id="certifications" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUpVariants}
          className="flex flex-col items-center mb-10 text-center"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-500/30 text-xs font-mono-tech text-cyan-600 dark:text-cyan-400 mb-3">
            <Award className="w-4 h-4" />
            <span>VERIFIED CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            CERTIFICATIONS
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <span className="text-xs font-mono-tech text-slate-400 mr-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-mono-tech transition-all ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-md shadow-cyan-500/20'
                  : 'glass-card text-slate-700 dark:text-slate-300 hover:border-cyan-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Certificate Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCerts.map((cert) => (
              <motion.div
                key={cert.id}
                layout
                variants={cardRevealVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -3 }}
                className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {cert.category}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>

                  <h3 className="text-base font-bold font-mono-tech text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                    {cert.title}
                  </h3>

                  {cert.issuer && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
                      Issuer: {cert.issuer}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                  <button
                    onClick={() => onViewCertificate(cert)}
                    className="w-full py-2 rounded-xl glass-card hover:bg-cyan-500/10 hover:border-cyan-400 text-xs font-mono-tech font-semibold text-slate-900 dark:text-white flex items-center justify-center space-x-2 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Certificate</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Certifications Toggle */}
        {!showAll && hiddenCount > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-3 rounded-xl glass-card border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:border-cyan-400 font-semibold font-mono-tech text-xs tracking-wider inline-flex items-center space-x-2 shadow-md hover:shadow-cyan-500/20 transition-all"
            >
              <span>View All Certificates ({hiddenCount} Additional)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {showAll && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(false)}
              className="px-6 py-3 rounded-xl glass-card text-slate-500 hover:text-slate-300 font-semibold font-mono-tech text-xs tracking-wider inline-flex items-center space-x-2 transition-all"
            >
              <span>Show Featured Only</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
