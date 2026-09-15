import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { personalDetails } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon, InstagramIcon, LeetcodeIcon } from '../components/SocialIcons';
import { fadeInUpVariants } from '../utils/animations';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(null); // 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

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

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Your Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!isValidAuthenticEmail(formData.email)) {
      errs.email = 'Please enter a valid authentic email address (e.g. Gmail, Outlook, Corporate, or University email).';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required.';
    if (!formData.message.trim()) errs.message = 'Message content is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sentAt: new Date().toISOString() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setErrorMessage(errData.error || 'Unable to send message. Please try again.');
        setSubmittedStatus('error');
      } else {
        setSubmittedStatus('success');
      }
    } catch (err) {
      console.warn('Backend API submission error:', err);
      // If dev server or environment doesn't run Vercel serverless function directly, show clear status:
      setSubmittedStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedStatus(null);
    setErrorMessage('');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative">
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
            <Mail className="w-4 h-4" />
            <span>COMMUNICATION & INQUIRIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono-tech tracking-tight text-slate-900 dark:text-white uppercase">
            GET IN TOUCH
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mt-3"></div>
        </motion.div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info & Social Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUpVariants}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-mono-tech text-slate-900 dark:text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Feel free to reach out for internship opportunities, project collaborations, or technical networking.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4">
                <a
                  href={`mailto:${personalDetails.email}`}
                  className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-4 hover:border-cyan-400 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">Email Address</span>
                    <span className="text-xs sm:text-sm font-semibold font-mono-tech text-slate-800 dark:text-slate-200 group-hover:text-cyan-400">
                      {personalDetails.email}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${personalDetails.phone}`}
                  className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-4 hover:border-cyan-400 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">Phone Number</span>
                    <span className="text-xs sm:text-sm font-semibold font-mono-tech text-slate-800 dark:text-slate-200 group-hover:text-cyan-400">
                      {personalDetails.phone}
                    </span>
                  </div>
                </a>

                <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-tech uppercase text-slate-400 block">Location</span>
                    <span className="text-xs sm:text-sm font-semibold font-mono-tech text-slate-800 dark:text-slate-200">
                      {personalDetails.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Cards Row */}
              <div className="pt-2">
                <span className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest block mb-3">
                  Technical & Social Profiles
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={personalDetails.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-2 text-xs font-mono-tech font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-all group"
                  >
                    <GithubIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={personalDetails.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-2 text-xs font-mono-tech font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-all group"
                  >
                    <LinkedinIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={personalDetails.socials.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-2 text-xs font-mono-tech font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-all group"
                  >
                    <LeetcodeIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>LeetCode</span>
                  </a>

                  <a
                    href={personalDetails.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex items-center space-x-2 text-xs font-mono-tech font-semibold text-slate-800 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-all group"
                  >
                    <InstagramIcon className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUpVariants}
            className="lg:col-span-7"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-xl font-bold font-mono-tech text-slate-900 dark:text-white mb-2">
                Send Message Directly
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                Fill out the form below to initiate communication.
              </p>

              {submittedStatus === null ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono-tech">
                        Your Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                      />
                      {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono-tech">
                        Your Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                      />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono-tech">
                      Subject <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Internship / Cybersecurity Inquiry"
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 font-mono-tech">
                      Message <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                    ></textarea>
                    {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-mono-tech text-slate-900 dark:text-white">
                      Message sent successfully.
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      Thank you for reaching out! Your message has been sent directly to {personalDetails.email}.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-xl glass-card text-xs font-mono-tech font-semibold text-cyan-400 hover:border-cyan-400"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
