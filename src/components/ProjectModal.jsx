import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Shield, Sparkles, Building2 } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { modalBackdropVariants, modalContainerVariants } from '../utils/animations';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && project) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-2xl rounded-2xl glass-card border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-labelledby="project-modal-title"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono-tech font-bold text-lg shrink-0">
                {project.number || <Shield className="w-6 h-6" />}
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono-tech font-semibold bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 mb-2">
                  {project.category}
                </span>
                <h3 id="project-modal-title" className="text-xl sm:text-2xl font-bold font-mono-tech text-slate-900 dark:text-white">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-xs sm:text-sm text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">
                    {project.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Description & Detailed Information */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              <p>{project.description}</p>
              {project.details && (
                <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/10 text-xs sm:text-sm">
                  <h4 className="font-bold text-slate-900 dark:text-slate-200 mb-1 font-mono-tech flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Technical Architecture Focus</span>
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">{project.details}</p>
                </div>
              )}

              {project.institution && (
                <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>{project.institution}</span>
                </div>
              )}
            </div>

            {/* Technologies Used */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono-tech mb-2">
                Technologies & Concepts
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-cyan-500/20 flex items-center space-x-2"
                >
                  <span>VIEW LIVE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.referenceDemo && (
                <a
                  href={project.referenceDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold text-xs flex items-center space-x-2 hover:bg-purple-500/20 transition-all"
                >
                  <span>REFERENCE DEMO</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl glass-card text-slate-900 dark:text-slate-100 hover:border-cyan-400 font-semibold text-xs tracking-wide flex items-center space-x-2"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>VIEW GITHUB</span>
                </a>
              )}

              {project.statusNote && !project.github && !project.liveDemo && (
                <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono-tech">
                  {project.statusNote}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
