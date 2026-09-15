import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Award, Download } from 'lucide-react';
import { modalBackdropVariants, modalContainerVariants } from '../utils/animations';

export default function CertificateModal({ cert, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && cert) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cert, onClose]);

  if (!cert) return null;

  const certAssetPath = new URL(`../assets/certificates/${cert.file}`, import.meta.url).href;
  const isPdf = cert.file.toLowerCase().endsWith('.pdf');

  return (
    <AnimatePresence>
      {cert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-4xl rounded-2xl glass-card border border-cyan-500/30 p-6 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col"
            role="dialog"
            aria-labelledby="cert-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="cert-modal-title" className="text-lg font-bold font-mono-tech text-slate-900 dark:text-white">
                    {cert.title}
                  </h3>
                  {cert.issuer && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Issuer: {cert.issuer}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={certAssetPath}
                  download={cert.file}
                  className="p-2 rounded-xl glass-card text-slate-400 hover:text-cyan-400 transition-colors"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </a>

                <a
                  href={certAssetPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl glass-card text-slate-400 hover:text-cyan-400 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Viewer */}
            <div className="flex-1 overflow-hidden py-4 flex items-center justify-center bg-slate-950/40 rounded-xl my-2 border border-slate-800/40">
              {isPdf ? (
                <iframe
                  src={certAssetPath}
                  title={cert.title}
                  className="w-full h-[65vh] rounded-lg border-0"
                />
              ) : (
                <img
                  src={certAssetPath}
                  alt={cert.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
                />
              )}
            </div>

            <div className="text-center pt-1 text-[11px] text-slate-400 font-mono-tech">
              Document File: {cert.file}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
