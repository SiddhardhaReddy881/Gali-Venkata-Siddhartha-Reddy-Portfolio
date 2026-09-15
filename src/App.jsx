import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ResumeModal from './components/ResumeModal';
import ProjectModal from './components/ProjectModal';
import CertificateModal from './components/CertificateModal';

import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import AchievementsSection from './sections/AchievementsSection';
import CertificationsSection from './sections/CertificationsSection';
import ResearchSection from './sections/ResearchSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return true; // Default to dark cybersecurity aesthetic
  });

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#050811] text-slate-900 dark:text-slate-100 bg-cyber-grid selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300">
      {/* Sticky Navbar */}
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onRequestResume={() => setIsResumeModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative">
        <HeroSection onRequestResume={() => setIsResumeModalOpen(true)} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection onSelectProject={(project) => setSelectedProject(project)} />
        <ExperienceSection onViewCertificate={(cert) => setSelectedCert(cert)} />
        <EducationSection />
        <AchievementsSection onViewCertificate={(cert) => setSelectedCert(cert)} />
        <CertificationsSection onViewCertificate={(cert) => setSelectedCert(cert)} />
        <ResearchSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CertificateModal
        cert={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
