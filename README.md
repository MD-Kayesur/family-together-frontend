# 🌳 FamilyRoots — Frontend Application

> **A Next-Generation Private Family Sanctuary & Lineage Preservation Platform.**

[![Live Application](https://img.shields.io/badge/Live%20Application-Vercel-6366f1?style=for-the-badge&logo=vercel)](https://family-together-eta.vercel.app)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge)](https://family-together-eta.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Core Platform Features](#-core-platform-features)
- [User Roles & Permission Matrix](#-user-roles--permission-matrix)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
- [Available Commands](#-available-commands)
- [Production Deployment](#-production-deployment)
- [License](#-license)

---

## 🚀 Project Overview

**FamilyRoots** is a modern, privacy-first web application built to help families construct interactive lineage trees, preserve high-resolution historical archives, collaborate on shared family vaults, and prevent duplicate relative records through real-time deduplication algorithms.

### 🌐 Live Production Application
👉 **[https://family-together-eta.vercel.app](https://family-together-eta.vercel.app)**

---

## ✨ Core Platform Features

### 🌳 1. Interactive Family Tree Canvas
- Dynamic visual canvas mapping parents, spouses, siblings, and extended generations.
- Real-time relationship rendering with fluid navigation controls.

### 🛡️ 2. Real-Time Relative Deduplication UI
- Live validation warnings during relative creation when matching names or emails are detected.
- Built-in deduplication management center (`/admin-dashboard/members`) to resolve potential duplicate record conflicts.

### 🔔 3. Top Navbar Notification Menu (`NavbarNotificationMenu.tsx`)
- Interactive bell dropdown menu integrated into every sanctuary dashboard header.
- Real-time alerts when new accounts are created, activated, or updated.

### 🔒 4. Viewport-Height Sanctuary Dashboards
- Non-scrolling full-screen viewport layout (`h-screen overflow-hidden`) with smooth inner container scrolling across all role workspaces:
  - **Owner Sanctuary Dashboard** (`/owner-dashboard/*`)
  - **Admin Workspace** (`/admin-dashboard/*`)
  - **Member Dashboard** (`/user-dashboard/*`)

### 🚫 5. Strict Viewer Role Guards
- Users registered under the `VIEWER` role are strictly restricted to public website browsing (`/`).
- Automated route guards intercept and block viewers attempting to access private family dashboard endpoints.

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

## 📁 Project Architecture & Directory Structure

```
family-together/
├── src/
│   ├── app/                         # Application Pages & Routes
│   │   ├── (auth)/                  # Authentication Pages (Sign In / Sign Up)
│   │   ├── admin-dashboard/         # Admin Management Workspace & Deduplication
│   │   ├── owner-dashboard/         # Owner Sanctuary & User Governance
│   │   ├── user-dashboard/          # Standard Family Member Dashboard
│   │   └── page.tsx                 # Public Landing Page & FAQ
│   ├── components/                  # UI & Layout Components
│   │   ├── common/                  # Shared Components (NavbarNotificationMenu)
│   │   ├── layout/                  # Sanctuary & Admin Layout Wrappers
│   │   └── ui/                      # Base UI Elements
│   ├── redux/                       # Application State & API Services
│   │   ├── api/                     # API Slices (Auth, Family, Members, Users)
│   │   └── slices/                  # Local State Slices
│   └── lib/                         # Role Utilities & Navigation Guards
│       └── utils/roleUtils.ts       # Role Redirects & Label Resolvers
└── public/                          # Static Assets & Icons
```

---

## ⚙️ Environment Configuration

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
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MD-Kayesur/family-together-frontend.git
   cd family-together-frontend
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start local development server:**
   ```bash
   npm run dev
   ```
   Access the application at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server |
| `npm run build` | Builds production bundle & runs type checks |
| `npm run start` | Runs compiled production build locally |
| `npm run lint` | Performs code analysis & lint checking |

---

## 📦 Production Deployment

Deploy the application to Vercel production:

```bash
vercel --prod --yes
```

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with ❤️ by **MD Kayesur** & the FamilyRoots Team.
