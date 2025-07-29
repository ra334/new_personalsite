# 🧑‍💻 Mykhailo Savchuk — Personal Website

![Preview](./screenshots/homepage.png)

This is my personal website and blog — a place to share thoughts, experiments, and full-stack projects. Built with performance, accessibility, and developer experience in mind.

🌐 **Live demo**: [msavchuk.com](https://msavchuk.com)

---

## ✨ Features

- 🌗 Light/dark mode toggle
- 🌍 i18n (English / Ukrainian)
- ✍️ Blog engine with admin panel (custom CMS)
- 📄 Editor using Tiptap
- 📦 Modern full-stack stack (Next.js 15, Drizzle, PostgreSQL)
- 🔒 Basic security practices
- 📱 Fully responsive (except admin — in progress)

---

## 🖼 Screenshots

| Home Page                           | Editor                              | Articles Management                     |
| ----------------------------------- | ----------------------------------- | --------------------------------------- |
| ![Home](./screenshots/homepage.png) | ![Editor](./screenshots/editor.png) | ![Articles](./screenshots/articles.png) |

---

## 📌 Roadmap

### ✅ Done

- Admin panel for writing and managing articles
- Meta fields per article
- Draft/publish workflow
- Language switcher
- Blog layout and styling

### 🛠️ In Progress

- [ ] Analytics (admin & public)
- [ ] Article view counter
- [ ] Roadmap page with project-specific breakdown
- [ ] Subscribe page / homepage form
- [ ] 404 error page with personality
- [ ] Easter egg for failed admin login attempts
- [ ] Article tags
- [ ] Article search
- [ ] Comments
- [ ] Polls under articles

### 💡 Ideas

- [ ] Google Gemini meta autofill
- [ ] Project timeline page (maybe risky to reveal real-time progress)
- [ ] Micro-posts (like tweets)
- [ ] Reading time indicator

---

## ⚙️ Stack

| Type       | Tech                                           |
| ---------- | ---------------------------------------------- |
| Frontend   | React 19, Next.js 15, TailwindCSS              |
| Backend    | Next.js Server Actions, DrizzleORM, PostgreSQL |
| Auth       | NextAuth.js, Drizzle adapter                   |
| Editor     | Tiptap                                         |
| Validation | Zod                                            |
| Deployment | Docker Compose + optional NGINX                |

---

## 🚀 Getting Started

### Development

```bash
npm install
npm run dev
```

### Production (without Docker)

```bash
npm install
npm run build
npm start
```

### With Docker Compose

```bash
docker compose up -d
```

### Set up .env file based on .env.example

```bash
cp .env.example .env
```

```
DATABASE_URL=postgresql://postgres:postgres@postgres_db:5433/main
SECRET=...
ADMIN_EMAIL=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

NEXTAUTH_URL=https://msavchuk.com
NEXT_PUBLIC_SITE_URL=https://msavchuk.com
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=...

GOOGLE_ANALYTICS_ID=...

```
