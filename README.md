# 🌸 Maternova Digital Care

> Empowering mothers across Nigeria with digital maternal healthcare — from first trimester to postpartum.

---

## 📖 About

Maternova Digital Care is a web-based maternal health platform designed to support expectant mothers and healthcare providers in Nigeria. Built with accessibility and simplicity in mind, Maternova bridges the gap between quality maternal healthcare information and the everyday Nigerian mother — including support for Pidgin English.

Whether you're tracking your pregnancy week by week, checking symptoms, preparing for delivery, or connecting with a community of mothers — Maternova has you covered.

---

## ✨ Features

- **🤰 Pregnancy Tracker** — Enter your LMP date and track your pregnancy week by week, with developmental updates, trimester info, and estimated due date
- **🩺 Symptom Checker** — Check symptoms with text input, get severity assessments (normal, warning, emergency) with bilingual results in English and Pidgin
- **📚 Articles & Education** — Curated maternal health articles organised by trimester and category
- **👩‍👩‍👧 Community** — Connect with other mothers, share experiences, ask questions, and offer support
- **📋 Preparation Checklist** — A complete delivery checklist with item costs, vendors, and personal progress tracking
- **🧠 Maternal Health Quiz** — Test your knowledge and earn badges
- **🏥 Nearby Clinics** — Find verified maternal health clinics in your area
- **👩‍⚕️ Healthcare Provider Portal** — Verified providers get a dedicated dashboard (admin-approved signups)
- **🌍 Bilingual Support** — English and Nigerian Pidgin throughout the app

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + Shadcn UI |
| Routing | React Router v6 |
| Data Fetching | TanStack React Query |
| Forms | React Hook Form + Zod |
| Backend & Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Charts | Recharts |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Supabase account and project

### Installation

```bash
# Clone the repository
git clone https://github.com/Osifo1/maternova_csr.git

# Navigate into the project
cd maternova_csr

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root of the project:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🗄️ Database

The database schema is built on Supabase (PostgreSQL) and includes tables for:

- `profiles` — user accounts and roles
- `pregnancy_records` — per-user pregnancy data
- `symptom_checks` — symptom checker history
- `community_posts`, `post_replies`, `post_likes` — community features
- `articles`, `saved_articles` — education content
- `prep_items`, `user_prep_items` — delivery checklist
- `clinics` — nearby healthcare facilities
- `quiz_questions`, `quiz_results` — maternal health quiz
- `provider_profiles` — verified healthcare provider data

---

## 🔐 Authentication

- **Mothers** — Email/password signup, instant access after registration
- **Healthcare Providers** — Email/password signup, access only after **admin approval** to ensure only qualified professionals are verified on the platform

---

## 📦 Deployment

This app is deployed via **Vercel**. Every push to the `main` branch triggers an automatic redeployment.

---

## 🙏 Acknowledgements

- Built with [Lovable.dev](https://lovable.dev) for rapid UI prototyping
- Backend powered by [Supabase](https://supabase.com)
- UI components from [Shadcn UI](https://ui.shadcn.com)

---

## 📄 License

This project is private and proprietary. All rights reserved © Maternova 2025.
