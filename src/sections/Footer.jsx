import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { personalDetails } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon, InstagramIcon, LeetcodeIcon } from '../components/SocialIcons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800/80 bg-slate-900/5 dark:bg-slate-950/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base font-mono-tech tracking-wider text-slate-900 dark:text-white">
                {personalDetails.fullName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
                {personalDetails.title} • {personalDetails.college}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3">
            <a
              href={personalDetails.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={personalDetails.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={personalDetails.socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LeetCode Profile"
              className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center"
            >
              <LeetcodeIcon className="w-4 h-4" />
            </a>
            <a
              href={personalDetails.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="p-2.5 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors flex items-center justify-center"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-3 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all group flex items-center justify-center"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono-tech text-slate-500 dark:text-slate-400 gap-3">
          <p>"Building practical skills. Exploring cybersecurity. Creating secure solutions."</p>
          <p>© 2026 Gali Venkata Siddhardha Reddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
