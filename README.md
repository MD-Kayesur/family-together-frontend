# 🌳 FamilyRoots — Frontend Platform

> **A Next-Generation Private Family Sanctuary & Lineage Preservation Platform.**  
> Built with Next.js 16 (App Router), React 19, Redux Toolkit, RTK Query, and TailwindCSS.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-6366f1?style=for-the-badge&logo=vercel)](https://family-together-eta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [User Roles & Permission Matrix](#-user-roles--permission-matrix)
- [Project Architecture](#-project-architecture)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🚀 Overview

**FamilyRoots** is a modern, privacy-first web application engineered to help families build interactive lineage trees, preserve high-resolution historical archives, collaborate on shared family vaults, and prevent duplicate records through real-time deduplication algorithms.

### 🌐 Live Production URL
👉 **[https://family-together-eta.vercel.app](https://family-together-eta.vercel.app)**

---

## ✨ Key Features

### 🌳 1. Interactive Family Tree Canvas
- Dynamic node rendering tracing parents, spouses, siblings, and extended generations.
- Smooth relationship mapping with real-time visual feedback.

### 🛡️ 2. Real-Time Relative Deduplication UI
- Admins receive live warnings when creating relatives with matching names or emails.
- Built-in deduplication control center (`/admin-dashboard/members`) to resolve potential duplicate profile conflicts.

### 🔔 3. Navbar Notification Menu (`NavbarNotificationMenu.tsx`)
- Interactive bell dropdown menu integrated into every dashboard header.
- Instant notifications when new accounts are created, activated, or updated.

### 🔒 4. Viewport-Height Dashboard Layouts
- Strict zero-main-scrollbar layout (`h-screen overflow-hidden`) with smooth inner container scrolling across all role dashboards:
  - **Owner Sanctuary Dashboard** (`/owner-dashboard/*`)
  - **Admin Workspace** (`/admin-dashboard/*`)
  - **Member Dashboard** (`/user-dashboard/*`)

### 🚫 5. Strict Viewer Role Guards
- Users registered under the `VIEWER` role are strictly restricted to public website browsing (`/`).
- Automated route guards intercept and block viewers attempting to navigate to private dashboard endpoints.

---

## 👥 User Roles & Permission Matrix

| Feature / Action | OWNER / SUPER_ADMIN | ADMIN | MEMBER | VIEWER (Guest) |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Landing Page & FAQ** | ✅ | ✅ | ✅ | ✅ |
| **View Family Tree** | ✅ | ✅ | ✅ | ❌ |
| **Add / Edit Family Members** | ✅ | ✅ | ❌ | ❌ |
| **Real-Time Deduplication Manager** | ✅ | ✅ | ❌ | ❌ |
| **Upload Memories & Documents** | ✅ | ✅ | ✅ | ❌ |
| **User Role Management** | ✅ | ❌ | ❌ | ❌ |
| **Navbar Notifications** | ✅ | ✅ | ✅ | ❌ |

---

## 📁 Project Architecture

```
family-together/
├── src/
│   ├── app/                         # Next.js App Router Routes
│   │   ├── (auth)/                  # Authentication Pages
│   │   │   ├── signin/page.tsx      # Sign In Page
│   │   │   └── signup/page.tsx      # Sign Up Page
│   │   ├── admin-dashboard/         # Admin Management Workspace
│   │   │   ├── members/page.tsx     # Deduplication & Member Manager
│   │   │   └── users/page.tsx       # User Governance
│   │   ├── owner-dashboard/         # Owner Dashboard Sanctuary
│   │   │   ├── members/page.tsx     # Family Member List
│   │   │   ├── tree/page.tsx        # Interactive Tree Canvas
│   │   │   └── users/page.tsx       # User & Role Manager
│   │   ├── user-dashboard/          # Standard Family Member Dashboard
│   │   └── page.tsx                 # Public Landing Page & FAQ
│   ├── components/                  # UI Components
│   │   ├── common/                  # Shared Components (NavbarNotificationMenu, etc.)
│   │   ├── layout/                  # Sanctuary & Admin Layout Wrappers
│   │   └── ui/                      # Base Reusable UI Elements
│   ├── redux/                       # State Management (Redux Toolkit + RTK Query)
│   │   ├── api/                     # API Service Slices (auth, family, member, etc.)
│   │   └── slices/                  # Local State Slices (authSlice, etc.)
│   └── lib/                         # Helper Utilities & Role Guards
│       └── utils/roleUtils.ts       # Role Redirects & Label Resolvers
├── public/                          # Static Assets & Icons
└── postcss.config.mjs / tailwind    # Styling Configuration
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=https://family-together-backend.vercel.app/api
# Or for local development:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or v20.x or higher
- **npm**: v9.x or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MD-Kayesur/family-together-frontend.git
   cd family-together-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up local environment:**
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Compiles production bundle & runs TypeScript type checking |
| `npm run start` | Runs the compiled Next.js production build locally |
| `npm run lint` | Runs ESLint analysis across codebase |

---

## 📦 Deployment

This project is configured for seamless deployment on **Vercel**:

```bash
# Deploy to Vercel Production
vercel --prod --yes
```

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with ❤️ by **MD Kayesur** & the FamilyRoots Team.
