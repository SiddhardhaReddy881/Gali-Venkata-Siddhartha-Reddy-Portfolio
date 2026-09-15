# Gali Venkata Siddhartha Reddy — Cybersecurity Student Portfolio

A personal portfolio website designed for **Gali Venkata Siddhartha Reddy**, a B.Tech Computer Science (Cybersecurity) student at Vignan University.

Built with a **Glassmorphism design language**, supporting **Dark Theme** (deep navy `#050811`) and **Light Theme**, responsive layouts, interactive modals for resume access authorization & project case studies, and serverless email integration.

---

## Features & Enhancements

- **Full Name Display**: Displays complete full name **GALI VENKATA SIDDHARTHA REDDY** across Navbar, Hero, About, Footer, metadata, and modals.
- **Section-Specific Profile Photographs**:
  - **Hero Section**: Suit photograph (`src/assets/hero-photo.jpg`) with natural aspect ratio and direct download option.
  - **About Me Section**: White shirt photograph (`src/assets/about-photo.jpg`) in a two-column layout.
- **Protected Resume Access Workflow**:
  - Visible button text: **`Resume`**.
  - Form submission dispatches a `"New Resume Access Request"` email notification to `galisiddhardhareddy881@gmail.com` with applicant Name, Email, and Timestamp.
  - Document access requires owner approval before unlocking PDF viewing or download.
- **Contact Form Email Dispatch**:
  - Form submission dispatches emails to `galisiddhardhareddy881@gmail.com` with the `Reply-To` header set to the visitor's email address for direct replies.

---

## Environment Variables Setup

For Vercel deployment or production serverless email delivery, configure the following environment variable:

```env
# Transactional Email Service API Key (Resend / Email Provider)
RESEND_API_KEY=re_123456789_your_resend_api_key
```

*Note: Frontend code never exposes API keys. All email dispatches are processed through server-side serverless functions (`api/contact.js` and `api/resume-request.js`).*

---

## Local Setup & Development Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Vite development server:**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

3. **Production build:**
   ```bash
   npm run build
   ```

---

## Project Structure

```
Portfolio/
├── api/
│   ├── contact.js          # Contact Form Email Dispatch API
│   └── resume-request.js   # Resume Access Request Email API
├── src/
│   ├── assets/
│   │   ├── hero-photo.jpg  # Suit photo for Hero section
│   │   ├── about-photo.jpg # White shirt photo for About section
│   │   ├── resume.pdf      # Official PDF Resume
│   │   └── certificates/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ResumeModal.jsx
│   │   ├── ProjectModal.jsx
│   │   ├── CertificateModal.jsx
│   │   └── SocialIcons.jsx
│   ├── sections/
│   │   ├── HeroSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── SkillsSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── AchievementsSection.jsx
│   │   ├── CertificationsSection.jsx
│   │   ├── ResearchSection.jsx
│   │   ├── ContactSection.jsx
│   │   └── Footer.jsx
│   └── data/
│       └── portfolioData.js
└── index.html
```

---

## License

© 2026 Gali Venkata Siddhartha Reddy. All rights reserved.
