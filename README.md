# Gali Venkata Siddhartha Reddy — Personal Cybersecurity Portfolio

A professional cybersecurity student portfolio website for **Gali Venkata Siddhartha Reddy**, featuring projects, skills, education, achievements, certifications, research work, internship experience, contact information, and a secure serverless Resume Access Authorization workflow.

---

## Deployment & Repository

- **Frontend Framework**: React (Vite)
- **Deployment Platform**: Vercel
- **Production Environment**: Vercel Serverless Functions & Private Blob Storage
- **GitHub Repository**: [Gali-Venkata-Siddhartha-Reddy-Portfolio](https://github.com/SiddhardhaReddy881/Gali-Venkata-Siddhartha-Reddy-Portfolio.git)

---

## Current Status

- **Resume OTP Delivery**: WORKING (via Brevo Transactional Email API)
- **Brevo API Authentication**: WORKING
- **Production Deployment**: WORKING (Vercel)
- **Private Resume Storage**: WORKING (Private Vercel Blob Storage)
- **Contact Form**: WORKING (via Resend API)
- **Secure Approval Workflow**: IMPLEMENTED & ACTIVE
- **Build**: PASSING

---

## Secure Resume Access System

Access to the official resume document uses a multi-step secure authorization workflow:

### Authorization Workflow:

1. **Request Initiation**: Visitor clicks the **Resume** button.
2. **Access Request Modal**: Visitor provides:
   - Full Name
   - Email Address
   - Purpose / Organization (optional)
3. **Server-Side OTP Generation**: Server generates a 6-digit verification OTP valid for 15 minutes.
4. **OTP Dispatch**: OTP email is sent to the visitor using the **Brevo Transactional Email API**.
5. **Visitor OTP Verification**: Visitor inputs the OTP in the modal for server-side verification.
6. **Pending Request**: Once verified, the request status is saved as `PENDING`.
7. **Owner Notification**: An approval email is sent to the portfolio owner (`OWNER_EMAIL`).
8. **Owner Approval / Rejection**: The owner clicks `APPROVE` or `REJECT` via signed token links.
9. **Authorized Streamed Access**: Only approved visitors receive access via a signed, expiring access token.
10. **Private Storage**: The resume PDF is stored exclusively in **Private Vercel Blob Storage** and is streamed securely from the serverless API. It is never stored as a public asset in the repository or frontend build.

---

## Email Services & Quota Management

- **Resume Access Transactional Emails**: Powered by **Brevo API** (server-side integration).
  - **Plan**: Brevo Free Plan
  - **Quota**: 300 emails per day (resets daily; unused sends do not roll over).
  - **Scope**: Serves visitor email verification OTPs.
  - **Security**: `BREVO_API_KEY` is stored strictly in Vercel environment variables and is never exposed to frontend client code.
- **Contact Form Emails**: Powered by **Resend API** (server-side integration).
  - **Scope**: Dispatches contact form inquiries directly to the portfolio owner.
  - *Note: Brevo and Resend operate independently with separate API keys and quotas.*

*MailerSend was previously tested during earlier development iterations but is NOT used in the current production environment.*

---

## Architecture & Storage

- **Private Document Store**: Vercel Private Blob Storage (`BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`).
- **Persistent Request Tracking**: Vercel KV / Upstash Redis (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) with local fallback during development.
- **Token Security**: Cryptographically signed tokens (HMAC SHA-256) via `RESUME_TOKEN_SECRET`.

---

## Environment Variable Names

Configure the following variable names in your server environment (e.g. Vercel Project Settings):

```
BREVO_API_KEY
BREVO_FROM_EMAIL
BREVO_FROM_NAME
OWNER_EMAIL
RESUME_TOKEN_SECRET
KV_REST_API_URL
KV_REST_API_TOKEN
BLOB_READ_WRITE_TOKEN
BLOB_STORE_ID
RESEND_API_KEY
```

> **IMPORTANT**: Never document or expose actual API key values, tokens, secrets, or passwords.

---

## Security Notes

> [!CAUTION]
> - **Zero Exposure Policy**: Never commit `.env` files, API keys, tokens, passwords, or private resume PDF files to GitHub or any public version control.
> - **Server-Side Authorization**: All verification, token signing, and OTP generation logic remains strictly server-side inside Vercel Serverless Functions (`/api/*`).
> - **Disposable Domain Filtering**: Temporary and disposable email addresses are automatically blocked during verification.

---

## Development Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Production build:**
   ```bash
   npm run build
   ```

---

## License

© 2026 Gali Venkata Siddhartha Reddy. All rights reserved.
