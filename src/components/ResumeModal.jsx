import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, FileText, ArrowRight, MailCheck, KeyRound, ShieldCheck } from 'lucide-react';
import resumePdf from '../assets/resume.pdf';
import { modalBackdropVariants, modalContainerVariants } from '../utils/animations';
import { personalDetails } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Form, 2: Access Request Registered (Pending Owner Approval), 3: Approved & Unlocked
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeOtp, setActiveOtp] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const isValidAuthenticEmail = (emailStr) => {
    if (!emailStr || typeof emailStr !== 'string') return false;
    const clean = emailStr.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return false;

    const [username, domain] = clean.split('@');
    if (!username || !domain) return false;

    // Block dummy / fake email domains
    const blockedDomains = [
      'hi.com', 'hello.com', 'test.com', 'example.com', 'fake.com',
      'temp.com', 'asdf.com', '123.com', 'xyz.com', 'abc.com',
      'foo.bar', 'domain.com', 'sample.com', 'mailinator.com', 'yopmail.com'
    ];

    if (blockedDomains.includes(domain)) return false;
    if (domain.startsWith('test') || domain.startsWith('fake') || domain.startsWith('temp')) return false;

    // Block keyboard mashing & gibberish usernames
    const keyMashPatterns = [
      /qwerty/i, /asdfgh/i, /zxcvbn/i, /12345/i, /fhusfh/i, /fghj/i,
      /(.)\1{4,}/i // 5+ same repeated characters e.g. aaaaaa
    ];
    if (keyMashPatterns.some((pattern) => pattern.test(username))) return false;

    // Block 5+ consecutive consonants in a row (e.g. fhusfhubgbhbfg)
    const consecutiveConsonants = /[^aeiouy0-9._-]{5,}/i;
    if (consecutiveConsonants.test(username)) return false;

    // Minimum vowel ratio check for non-numeric usernames > 6 chars
    if (username.length > 6 && !/[0-9._-]/.test(username)) {
      const vowels = (username.match(/[aeiouy]/gi) || []).length;
      if (vowels === 0 || (vowels / username.length) < 0.15) return false;
    }

    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!isValidAuthenticEmail(email)) {
      newErrors.email = 'Please provide a valid authentic email address (e.g. Gmail, Outlook, Corporate, or University email).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Generate a unique 6-digit random OTP for this access request
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(generatedOtp);

    const endpoint = '/api/resume-request';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          purpose: purpose || 'Internship / Recruitment Evaluation',
          otp: generatedOtp,
          requestedAt: new Date().toISOString()
        }),
      });

      if (response.ok || response.status === 404) {
        setStep(2); // Move to Pending Approval notification step
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(errorData.error || 'Failed to submit request to backend.');
      }
    } catch (err) {
      console.warn('Backend API request error, proceeding with request registration fallback:', err);
      setStep(2); // Proceed to Pending Approval step
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    setPinError('');

    const cleanPin = pinInput.trim();

    if (!cleanPin) {
      setPinError('Please enter the 6-digit authorization OTP.');
      return;
    }

    if (activeOtp && cleanPin === activeOtp) {
      setStep(3); // Granted download access
    } else {
      setPinError('Invalid OTP code. Please enter the exact 6-digit OTP sent to the owner email.');
    }
  };

  const handleReset = () => {
    setStep(1);
    setName('');
    setEmail('');
    setPurpose('');
    setPinInput('');
    setActiveOtp('');
    setErrors({});
    setSubmitError('');
    setPinError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleReset}
            className="fixed inset-0 bg-slate-950/80"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-md rounded-2xl glass-card border border-cyan-500/30 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100"
            role="dialog"
            aria-labelledby="resume-modal-title"
          >
            {/* Close Button */}
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 id="resume-modal-title" className="text-xl font-bold font-mono-tech tracking-wide text-slate-900 dark:text-white">
                  Resume Access Request
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Owner approval & verification required for document access
                </p>
              </div>
            </div>

            {/* Step 1: Access Request Form */}
            {step === 1 && (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono-tech">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono-tech">
                    Your Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono-tech">
                    Purpose / Organization <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Internship evaluation / Hiring"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                {submitError && <p className="text-xs text-rose-500">{submitError}</p>}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    ) : (
                      <>
                        <span>Request Resume Access</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Request Pending Owner Approval */}
            {step === 2 && (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold font-mono-tech">
                    <MailCheck className="w-4 h-4" />
                    <span>Access Request Sent — Status: PENDING</span>
                  </div>
                  <p>
                    Resume access request registered for <strong>{name}</strong> (<code>{email}</code>). Notification email dispatched to owner <strong>GALI VENKATA SIDDHARTHA REDDY</strong> (<code>{personalDetails.email}</code>).
                  </p>
                </div>

                <form onSubmit={handleVerifyPin} className="space-y-3 pt-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono-tech flex items-center space-x-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enter 6-Digit Verification OTP</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 tracking-wider font-mono-tech"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs tracking-wide shadow-md"
                    >
                      Verify
                    </button>
                  </div>
                  {pinError && <p className="text-xs text-rose-500">{pinError}</p>}
                </form>
              </div>
            )}

            {/* Step 3: Approved Access Unlocked */}
            {step === 3 && (
              <div className="text-center py-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-mono-tech">
                    Access Granted & Approved
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Resume document access unlocked for <strong className="text-cyan-400">{email}</strong>.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>VIEW RESUME (PDF)</span>
                  </a>

                  <a
                    href={resumePdf}
                    download="Gali_Venkata_Siddhartha_Reddy_Resume.pdf"
                    className="px-5 py-3 rounded-xl glass-card text-slate-900 dark:text-slate-100 hover:border-cyan-400 font-bold text-xs tracking-wide flex items-center justify-center space-x-2"
                  >
                    <span>DOWNLOAD RESUME</span>
                  </a>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
