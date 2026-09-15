import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ExternalLink, Eye, Sparkles } from 'lucide-react';
import { projectsData } from '../data/portfolioData';
import { GithubIcon } from '../components/SocialIcons';
import { fadeInUpVariants, staggerContainerVariants, cardRevealVariants } from '../utils/animations';

export default function ProjectsSection({ onSelectProject }) {
  return (
    <section id="projects" className="py-16 md:py-24 relative">
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
            <FolderGit2 className="w-4 h-4" />
            <span>PRACTICAL IMPLEMENTATIONS & RESEARCH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            FEATURED PROJECTS
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* Project Cards Grid with Framer Motion Stagger */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              variants={cardRevealVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/60 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-lg cursor-pointer"
              onClick={() => onSelectProject(project)}
            >
              {/* Subtle Corner Glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all"></div>

              <div>
                {/* Header Badge & Project Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-extrabold font-mono-tech text-cyan-500/40 dark:text-cyan-400/30 group-hover:text-cyan-400 transition-colors">
                    #{project.number}
                  </span>
                  <div className="flex items-center space-x-2">
                    {project.isAiUsed && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Utilized</span>
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono-tech font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl font-bold font-mono-tech text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                {project.subtitle && (
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono-tech mt-1">
                    {project.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  "{project.description}"
                </p>

                {project.institution && (
                  <div className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium">
                    <span>{project.institution}</span>
                  </div>
                )}

                {/* Tech Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono-tech font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-2">
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs hover:from-cyan-400 hover:to-blue-500 transition-all"
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
                      className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold text-xs flex items-center space-x-1.5 hover:bg-purple-500/20 transition-all"
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
                      className="px-3.5 py-1.5 rounded-xl glass-card text-slate-800 dark:text-slate-200 hover:border-cyan-400 text-xs font-semibold flex items-center space-x-1.5"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>VIEW GITHUB</span>
                    </a>
                  )}

                  {project.statusNote && !project.github && !project.liveDemo && (
                    <span className="text-xs font-mono-tech text-amber-500 dark:text-amber-400 font-medium">
                      {project.statusNote}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSelectProject(project)}
                  className="text-xs font-mono-tech text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1 font-bold group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Details</span>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
