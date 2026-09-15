import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CheckCircle2, FileText, ArrowRight, MailCheck, KeyRound, ShieldAlert, Mail, Clock, XCircle } from 'lucide-react';
import { modalBackdropVariants, modalContainerVariants } from '../utils/animations';
import { personalDetails } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  // Steps: 
  // 1: Form (Request Resume)
  // 2: Verify Email (Enter Visitor OTP)
  // 3: Pending Owner Approval (Waiting / Polling)
  // 4: Approved (View / Download Access)
  // 5: Rejected (Access Denied)
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [visitorOtp, setVisitorOtp] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const [verificationToken, setVerificationToken] = useState('');
  const [statusCheckToken, setStatusCheckToken] = useState('');
  const [approvedAccessUrl, setApprovedAccessUrl] = useState('');
  const [unlockedBlobUrl, setUnlockedBlobUrl] = useState('');

  const pollingRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Status Polling when in Step 3 (Pending)
  useEffect(() => {
    if (step === 3 && statusCheckToken) {
      const checkStatus = async () => {
        try {
          const res = await fetch(`/api/resume-status?token=${encodeURIComponent(statusCheckToken)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'APPROVED' && data.accessUrl) {
              setApprovedAccessUrl(data.accessUrl);
              // Fetch PDF blob securely for seamless viewing/downloading in UI
              const pdfRes = await fetch(data.accessUrl);
              if (pdfRes.ok) {
                const blob = await pdfRes.blob();
                const blobUrl = URL.createObjectURL(blob);
                setUnlockedBlobUrl(blobUrl);
              }
              setStep(4);
            } else if (data.status === 'REJECTED') {
              setStep(5);
            }
          }
        } catch (err) {
          console.warn('Status polling error:', err);
        }
      };

      checkStatus();
      pollingRef.current = setInterval(checkStatus, 3000);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [step, statusCheckToken]);

  const isValidAuthenticEmail = (emailStr) => {
    if (!emailStr || typeof emailStr !== 'string') return false;
    const clean = emailStr.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return false;

    const [username, domain] = clean.split('@');
    if (!username || !domain) return false;

    const blockedDomains = [
      'hi.com', 'hello.com', 'test.com', 'example.com', 'fake.com',
      'temp.com', 'asdf.com', '123.com', 'xyz.com', 'abc.com',
      'foo.bar', 'domain.com', 'sample.com', 'mailinator.com', 'yopmail.com',
      'guerrillamail.com', 'tempmail.com', 'dispostable.com'
    ];

    if (blockedDomains.includes(domain) || domain.startsWith('test') || domain.startsWith('temp')) return false;

    const keyMashPatterns = [
      /qwerty/i, /asdfgh/i, /zxcvbn/i, /12345/i, /fhusfh/i, /fghj/i,
      /(.)\1{4,}/i
    ];
    if (keyMashPatterns.some((pattern) => pattern.test(username))) return false;

    const consecutiveConsonants = /[^aeiouy0-9._-]{5,}/i;
    if (consecutiveConsonants.test(username)) return false;

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

  // Step 1: Submit Form & Send Email Verification OTP to Visitor
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/resume-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          purpose: purpose || 'Internship / Recruitment Evaluation'
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (response.ok && resData.token) {
        setVerificationToken(resData.token);
        setStep(2); // Move to Step 2: Verify Email OTP
      } else {
        setSubmitError(resData.error || 'Failed to send email verification code.');
      }
    } catch (err) {
      console.warn('Request submit error:', err);
      setSubmitError('Unable to send verification code. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify Visitor Email OTP
  const handleVerifyVisitorEmail = async (e) => {
    e.preventDefault();
    setVerifyError('');

    if (!visitorOtp.trim()) {
      setVerifyError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: verificationToken,
          otp: visitorOtp.trim()
        })
      });

      const resData = await response.json().catch(() => ({}));
      if (response.ok && resData.token) {
        setStatusCheckToken(resData.token);
        setStep(3); // Move to Step 3: Pending Owner Approval
      } else {
        setVerifyError(resData.error || 'Invalid verification code. Please enter the exact code sent to your email.');
      }
    } catch (err) {
      console.error('Email verification error:', err);
      setVerifyError('Failed to verify code with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setStep(1);
    setName('');
    setEmail('');
    setPurpose('');
    setVisitorOtp('');
    setVerificationToken('');
    setStatusCheckToken('');
    setApprovedAccessUrl('');
    if (unlockedBlobUrl) {
      URL.revokeObjectURL(unlockedBlobUrl);
      setUnlockedBlobUrl('');
    }
    setErrors({});
    setSubmitError('');
    setVerifyError('');
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
                  Email verification & owner approval required
                </p>
              </div>
            </div>

            {/* STEP 1: Request Resume */}
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
                    Email Address <span className="text-cyan-400">*</span>
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
                        <span>Send Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Verify Email */}
            {step === 2 && (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-800 dark:text-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-bold font-mono-tech">
                    <Mail className="w-4 h-4" />
                    <span>Email Verification OTP Sent</span>
                  </div>
                  <p>
                    A 6-digit verification code was sent to <strong>{email}</strong>. Please check your inbox and enter the code below to verify your email.
                  </p>
                </div>

                <form onSubmit={handleVerifyVisitorEmail} className="space-y-3 pt-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono-tech flex items-center space-x-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enter Verification OTP</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={visitorOtp}
                      onChange={(e) => setVisitorOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 tracking-wider font-mono-tech"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs tracking-wide shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                  {verifyError && <p className="text-xs text-rose-500">{verifyError}</p>}
                </form>
              </div>
            )}

            {/* STEP 3: Pending Approval */}
            {step === 3 && (
              <div className="space-y-5 py-3 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 relative">
                  <Clock className="w-7 h-7 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-tech">
                    <MailCheck className="w-3.5 h-3.5" />
                    <span>Your email has been verified.</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono-tech pt-1">
                    Pending Owner Approval
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                    Your resume access request is pending owner approval. A notification has been dispatched to <strong>GALI VENKATA SIDDHARDHA REDDY</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>Waiting for owner approval... This window updates automatically.</span>
                </div>
              </div>
            )}

            {/* STEP 4: Approved */}
            {step === 4 && (
              <div className="text-center py-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-mono-tech">
                    Access Approved
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Your resume access has been approved. You can view or download the resume below.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  {unlockedBlobUrl || approvedAccessUrl ? (
                    <>
                      <a
                        href={unlockedBlobUrl || approvedAccessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>VIEW RESUME (PDF)</span>
                      </a>

                      <a
                        href={unlockedBlobUrl || approvedAccessUrl}
                        download="Gali_Venkata_Siddhardha_Reddy_Resume.pdf"
                        className="px-5 py-3 rounded-xl glass-card text-slate-900 dark:text-slate-100 hover:border-cyan-400 font-bold text-xs tracking-wide flex items-center justify-center space-x-2"
                      >
                        <span>DOWNLOAD RESUME</span>
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {/* STEP 5: Rejected */}
            {step === 5 && (
              <div className="text-center py-4 space-y-5">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <XCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white font-mono-tech">
                    Access Rejected
                  </h4>
                  <p className="text-xs text-rose-400 dark:text-rose-300 max-w-xs mx-auto font-semibold">
                    Your resume access request was rejected.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    The document owner has declined access for this email address.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

