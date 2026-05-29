

HireNest is a job application assistant that transforms your job search into an efficient, intelligent workflow. Powered by Grok AI, the platform generates tailored CVs and cover letters for every role, tracks all your applications, interviews, and deadlines in one place.



| Feature | Summary |
|---|---|
| **User Authentication** | JWT login, Google OAuth, email verification, password reset, disposable email blocking |
| **Job Application Management** | AI job extraction from URLs, dashboard view, status tracking, follow-up eligibility nudges |
| **CV Management** | Multi-branch CV system, AI parsing to freeform + tags, dynamic editor, AI analysis |
| **AI-Powered Features** | Tailored CV & cover letter generation, ATS scoring, chat assistant, draft generation |
| **Gmail Email Automation** | On-demand inbox scanning, batch AI classification, suggest-then-confirm flow |
| **Analytics Dashboard** | Key metrics, visual charts, weekly goal tracker, pipeline conversion |
| **Portfolio System** | GitHub/LinkedIn import, public portfolio page, project management |
| **Settings & Configuration** | Profile management, credit balance & usage stats, subscription plans |
| **Admin Dashboard** | AI call tracking, system statistics, user management *(admin only)* |
| **Review & Finalization** | AI draft review, tailoring change log (before/after), inline diff preview, PDF generation |
| **Interview Prep Library** | Per-job materials, bulk upload, inline preview, global library, favourites |
| **Work Tracker** | Session logging with type filters, reminders, Google Calendar integration |
| **Mock Interview** | AI-powered practice with first and second round prompt options |
| **Google Calendar** | Interview scheduling and calendar event management |
| **AI Interview Buddy** | Electron companion app — *currently in development, available to admins only* |

## Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **File Handling:** Multer
- **Image Hosting:** Cloudinary
- **AI:** Google Generative AI SDK (`@google/generative-ai`), Web Speech API
- **Web Scraping:** Apify (for LinkedIn profile scraping)
- **PDF Generation:** Puppeteer
- **CV Schema:** JSON Resume ([https://jsonresume.org/](https://jsonresume.org/))
- **Charts:** Recharts (for analytics visualizations)
- **Payments:** Stripe (for subscription plans and checkout)




