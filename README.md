<div align="center">

# Plinth — PYQ Hub Portal

### *India's Collaborative Previous Year Question Paper Repository*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-question--paper--vault.vercel.app-6366f1?style=for-the-badge&logoColor=white)](https://question-paper-vault.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=black)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> A premium, neobrutalist-themed academic platform where students discover, upload, and verify previous year question papers across CBSE, JEE, NEET, GATE, UPSC, B.Tech, Banking, SSC, and Railway exams — all in one collaborative vault.

<br/>

![PYQ Hub Banner](https://question-paper-vault.vercel.app/assets/hero_illustration.png)

</div>

---

## Features

### Core Platform
- **Smart Fuzzy Search** — Search by subject, university, year, semester, or exam type in real-time
- **Category Filters** — Filter papers by CBSE, JEE, NEET, GATE, UPSC, B.Tech, Banking, SSC, Railway and more
- **Native PDF Viewer** — Preview papers directly in the browser before downloading
- **One-Click Download** — Download any paper as a PDF instantly
- **Bookmarks** — Save favourite papers to a personal collection for quick access
- **Upload Papers** — Share your own sessional papers in under 60 seconds
- **Download Analytics** — Track how many students have downloaded each paper

### Authentication
- **Email & Password** — Standard sign-up and sign-in with full validation
- **Google OAuth** — One-click sign-in via Google Account (Firebase SSO)
- **Forgot Password** — Firebase password reset email flow with inline success/error feedback
- **Auto Avatars** — Every new account is assigned a unique Dicebear Adventurer character avatar

### Admin Dashboard
- **Paper Verification** — Approve or reject user-uploaded papers with one click
- **Plinth Official Uploads** — Admin-uploaded papers are auto-tagged as `Plinth Official` (verified)
- **Moderation Tools** — Permanently delete fake or low-quality papers from storage
- **Stats Bento Grid** — Live counts of pending, verified, and official papers
- **Archive View** — Browse all papers in the database in a dense tabular editorial layout

### Design & UX
- **Dark / Light Mode** — System-aware theme toggle with smooth transitions
- **Fully Responsive** — Mobile-first design, works perfectly from 320px to 4K
- **Neobrutalist UI** — Premium tactile design with 2px ink borders, offset shadows, and Space Grotesk typography
- **Micro-animations** — Hover lifts, parallax papers, split-title effects, and smooth modal transitions
- **Toast Notifications** — Live success, error, and info feedback for every user action

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 | UI component framework |
| **Build Tool** | Vite 8 | Lightning-fast HMR & bundler |
| **Authentication** | Firebase Auth v12 | Email/Password + Google OAuth + Password Reset |
| **Database** | Supabase (PostgreSQL) | Paper metadata, bookmarks, verification status |
| **Storage** | Supabase Storage | PDF file hosting & CDN delivery |
| **Styling** | Vanilla CSS | Custom design system, CSS variables, animations |
| **Icons** | Lucide React | Consistent icon library |
| **Avatars** | DiceBear API | Unique auto-generated character avatars |
| **Deployment** | Vercel | CI/CD from GitHub with instant preview URLs |

---

## Live Demo

> **[https://question-paper-vault.vercel.app/](https://question-paper-vault.vercel.app/)**

| Page | Description |
|---|---|
| Home | Browse all papers, search, filter by category |
| Upload | Submit your own sessional papers with metadata |
| Bookmarks | Your personally saved paper collection |
| My Uploads | Track and manage papers you have contributed |
| Admin Panel | *(Admin only)* Moderate, verify, and delete papers |

---

## Screenshots

> *Screenshots coming soon — visit the [Live Demo](https://question-paper-vault.vercel.app/) to explore the platform!*

| View | Preview |
|---|---|
| Home / Explorer | *Add screenshot here* |
| PDF Modal Viewer | *Add screenshot here* |
| Auth Modal | *Add screenshot here* |
| Admin Dashboard | *Add screenshot here* |
| Mobile Layout | *Add screenshot here* |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** `>= 18.x` — [Download](https://nodejs.org/)
- **npm** `>= 9.x` (comes with Node.js)
- A **Firebase** project with Auth enabled
- A **Supabase** project with the database schema set up

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/question-paper-vault.git
cd question-paper-vault
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Copy the example env file and fill in your credentials:
```bash
cp .env.example .env
```

*(See the [Environment Variables](#environment-variables) section below for all required keys.)*

**4. Run locally**
```bash
npm run dev
```

The app will be live at **[http://localhost:5173](http://localhost:5173)**

---

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to Vercel, Netlify, or any static host.

**Preview the production build locally:**
```bash
npm run preview
```

---

## Supabase Database Schema

Run the following SQL in your Supabase **SQL Editor** to create the required tables:

```sql
-- Papers metadata table
CREATE TABLE public.papers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subjectName text NOT NULL,
  examType text NOT NULL,
  category text NOT NULL,
  year integer NOT NULL,
  semester text DEFAULT 'N/A',
  boardOrUniversity text NOT NULL,
  description text,
  fileUrl text NOT NULL,
  fileSize text NOT NULL,
  uploaderName text NOT NULL,
  uploaderId text NOT NULL,
  verificationStatus text DEFAULT 'pending',
  downloadsCount integer DEFAULT 0,
  createdAt timestamp with time zone DEFAULT now()
);

-- Bookmarks association table
CREATE TABLE public.bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  userId text NOT NULL,
  paperId uuid REFERENCES public.papers(id) ON DELETE CASCADE NOT NULL,
  createdAt timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_user_paper UNIQUE (userId, paperId)
);
```

**Create a public storage bucket** named exactly `paper-pdfs` in Supabase Storage with public read access enabled.

---

## Environment Variables

Create a `.env` file in the root of the project with these variables:

```env
# Firebase Authentication
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Supabase Database & Storage
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Warning:** Never commit your `.env` file to version control. It is already listed in `.gitignore`.

> **Tip:** If Firebase or Supabase keys are missing, the app automatically falls back to a local **mock/demo mode** — perfect for testing without any cloud credentials.

---

## Project Structure

```
question-paper-vault/
├── public/                     # Static assets (illustrations, icons)
├── src/
│   ├── components/
│   │   ├── Admin/              # AdminPanel, moderation UI
│   │   ├── Common/             # Navbar, Sidebar, AuthModal, Footer, Toast
│   │   ├── Dashboard/          # PaperCard, PaperViewer, FilterSidebar, SearchBar
│   │   └── Upload/             # UploadForm
│   ├── config/
│   │   ├── firebase.js         # Firebase app initialization
│   │   └── supabase.js         # Supabase client initialization
│   ├── context/
│   │   ├── AuthContext.jsx     # Firebase auth state & methods
│   │   ├── PaperContext.jsx    # Papers, bookmarks, filters state
│   │   ├── ThemeContext.jsx    # Dark / Light mode
│   │   └── ToastContext.jsx    # Global toast notification system
│   ├── services/
│   │   ├── authService.js      # Firebase auth + mock fallback
│   │   └── dbService.js        # Supabase queries + mock fallback
│   ├── App.jsx                 # Root layout, page routing
│   ├── App.css                 # Global design system tokens
│   └── index.css               # CSS reset & base styles
├── .env                        # Your local environment variables (not committed)
├── .env.example                # Template for environment variables
├── vite.config.js
└── package.json
```

---

## Contributing

Contributions are welcome and appreciated.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** — ensure code is clean and well-commented
4. **Commit** with a descriptive message:
   ```bash
   git commit -m "feat: add subject-wise paper grouping"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** — describe what you changed and why

### Contribution Guidelines

- Follow the existing **neobrutalist CSS design system** (no Tailwind, no Bootstrap)
- Keep components small and focused — one component per responsibility
- Never expose API keys or credentials in code
- Update the README if you add new features or environment variables
- Test your changes on both mobile and desktop viewports before submitting

---

## Known Issues & Roadmap

### Coming Soon
- [ ] Email notifications when a paper is verified/rejected
- [ ] Subject-wise paper grouping and filtering
- [ ] User profile page with contribution stats
- [ ] Paper rating and review system
- [ ] Multi-language support (Hindi, Tamil, Bengali)
- [ ] Offline mode with service workers

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```
MIT License — Copyright (c) 2025 PYQ Hub Portal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, subject to the conditions of the MIT License.
```

---

## Support & Contact

If you run into any issues or have feature requests:

- **Bug Reports** — [Open a GitHub Issue](https://github.com/your-username/question-paper-vault/issues)
- **Feature Requests** — [Start a Discussion](https://github.com/your-username/question-paper-vault/discussions)
- **Email** — chetan.prajapat.work@gmail.com

---

<div align="center">

### If this project helped you, please give it a star!

[![GitHub Stars](https://img.shields.io/github/stars/your-username/question-paper-vault?style=social)](https://github.com/your-username/question-paper-vault)

<br/>

*Made with care for students across India*

**[Visit Live Demo](https://question-paper-vault.vercel.app/) · [Read the Docs](#getting-started) · [Contribute](#contributing)**

</div>
