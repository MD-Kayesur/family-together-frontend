# 🌲 FamilyRoots Platform - Comprehensive System Architecture & Operating Documentation

> **Platform Name:** FamilyRoots Platform ("Family Together")  
> **Repository Workspaces:** `family-together` (Frontend) & `family-together-backend` (Backend API)  
> **Status:** Fully Functional Multi-Role Family Sanctuary & Admin Control Platform  

---

## 📌 1. Executive Summary

**FamilyRoots** is a privacy-first, multi-generational family tree, archive, and memory-preservation platform. It provides a secure, invite-only sanctuary for families to document their lineage, preserve photo and story archives, store legal family documents, coordinate events, and manage inter-relative relationships under strict role-based access controls.

---

## 🏗️ 2. Technology Stack & System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       Next.js 16 (App Router)           │
                               │ React 19 + TypeScript + TailwindCSS v4  │
                               │  Redux Toolkit (RTK Query Cache)        │
                               └────────────────────┬────────────────────┘
                                                    │ REST APIs (JWT Auth)
                               ┌────────────────────▼────────────────────┐
                               │           NestJS 11 Backend             │
                               │   Express + Passport JWT + Nodemailer   │
                               └──────────┬──────────────────────┬───────┘
                                          │                      │
                       ┌──────────────────▼───────┐    ┌─────────▼────────┐
                       │ PostgreSQL Database      │    │  Redis Server    │
                       │ Prisma ORM 7 Multi-Schema│    │ Token & Sessions │
                       └──────────────────────────┘    └──────────────────┘
```

### Frontend (`family-together`)
* **Framework:** Next.js v16.2.6 (App Router & Turbopack) with React 19.2.4 & TypeScript.
* **State & Data Fetching:** Redux Toolkit (`@reduxjs/toolkit` & `react-redux`) with RTK Query (`familyApi`, `authApi`).
* **Styling & Aesthetics:** "Kinship Modern" design system using TailwindCSS v4, Lucide React icons, and `next-themes` (Dark/Light mode).

### Backend (`family-together-backend`)
* **Framework:** NestJS v11 (TypeScript, Express).
* **Database & ORM:** PostgreSQL managed via Prisma ORM 7 (`@prisma/client`, `@prisma/adapter-pg`) with modular multi-schema files.
* **Caching & In-Memory Store:** Redis (`ioredis`) for session validation, token blacklisting, and email verification tokens.
* **Security & Mailing:** Passport JWT authentication, `bcryptjs` password hashing, cookie parser, CORS protection, and Nodemailer email delivery.

---

## 👥 3. User Roles & Permission Matrix

| Role | Default Redirect Route | Core Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | [`/admin-dashboard/super`](file:///c:/Projects/family-together/src/app/admin-dashboard/super) | Full infrastructure oversight, database backup triggers, node health monitoring, and encryption key management. |
| **`ADMIN`** | [`/admin-dashboard`](file:///c:/Projects/family-together/src/app/admin-dashboard) | Platform user account administration, growth analytics, activity audit log oversight, and support ticket management. |
| **`OWNER`** | [`/owner-dashboard`](file:///c:/Projects/family-together/src/app/owner-dashboard) | Complete sanctuary manager: member directory control, family tree editing, relationship linking, media vault uploads, event coordination, magic invites, and person deduplication. |
| **`MEMBER` / `USER`** | [`/user-dashboard`](file:///c:/Projects/family-together/src/app/user-dashboard) | Verified family relative: view family tree, share milestone memories, RSVP to family events, and update personal account credentials. |
| **`VIEWER`** | [`/user-dashboard`](file:///c:/Projects/family-together/src/app/user-dashboard) | Read-only sanctuary access: view tree and shared memories without modification permissions. |

---

## 💾 4. Database Schema & Domain Models

Located in [`prisma/schema/`](file:///c:/Projects/family-together-backend/prisma/schema):

### 1. Base Auth Domain ([`base.prisma`](file:///c:/Projects/family-together-backend/prisma/schema/base.prisma))
* **`User`:** Stores account credentials (`email`, `password` hash, `role`, `status`, `emailVerified`, `avatarUrl`, `bio`).
* **`Session` / `PasswordResetToken` / `EmailVerificationToken`:** Handles JWT refresh tokens, email verification codes, and password resets.

### 2. Person Domain ([`person.prisma`](file:///c:/Projects/family-together-backend/prisma/schema/person.prisma))
* **`Person`:** Decoupled relative profile (`firstName`, `middleName`, `lastName`, `nickname`, `gender`, `dob`, `birthPlace`, `isAlive`, `dateOfDeath`, `occupation`, `photoUrl`, `bio`).
* **`PersonClaim` & `PersonAlias`:** Enables claiming unassigned relative nodes and recording nicknames.

### 3. Family Domain ([`family.prisma`](file:///c:/Projects/family-together-backend/prisma/schema/family.prisma))
* **`Family` & `FamilyMember`:** Represents family sanctuary hubs and ties `Person` entities to `Family` with granular roles (`OWNER`, `ADMIN`, `MEMBER`, `VIEWER`).

### 4. Relationship Engine ([`relationship.prisma`](file:///c:/Projects/family-together-backend/prisma/schema/relationship.prisma))
* **`RelationshipType` & `Relationship`:** Maps biological and legal connections between `fromPersonId` and `toPersonId` with inverse lookups (Parent-Child, Spouse, Sibling).

### 5. Vault & Media Domain ([`vault.prisma`](file:///c:/Projects/family-together-backend/prisma/schema/vault.prisma))
* **`Memory`:** Photo galleries, video links, stories, tagged relatives, and categories.
* **`Event`:** Reunions, anniversaries, birthdays, and virtual meetings.
* **`Document`:** Historical documents, wills, and legal certificates.
* **`Invitation`:** Magic link invites and status tracking (`PENDING`, `ACCEPTED`).

---

## 💻 5. Complete Screen & Module Inventory

### Public & Authentication Suite
* **`GET /`** – Platform Landing Page ([`page.tsx`](file:///c:/Projects/family-together/src/app/page.tsx))
* **`GET /signin`** – Sign In Console ([`signin/page.tsx`](file:///c:/Projects/family-together/src/app/signin/page.tsx))
* **`GET /signup`** – Account Registration & Verification ([`signup/page.tsx`](file:///c:/Projects/family-together/src/app/signup/page.tsx))
* **`GET /support`** – Member Help Desk ([`support/page.tsx`](file:///c:/Projects/family-together/src/app/support/page.tsx))

### Owner Sanctuary Dashboard (`/owner-dashboard`)
* **`GET /owner-dashboard`** – Sanctuary Overview & Dashboard Console ([`page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/page.tsx))
* **`GET /owner-dashboard/members`** – Members Directory & Deduplication Tool ([`members/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/members/page.tsx))
* **`GET /owner-dashboard/tree`** – Interactive Visual Family Tree ([`tree/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/tree/page.tsx))
* **`GET /owner-dashboard/relationships`** – Relationship Connection Matrix ([`relationships/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/relationships/page.tsx))
* **`GET /owner-dashboard/memories`** – Media Vault & Interactive Slider Carousel ([`memories/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/memories/page.tsx))
* **`GET /owner-dashboard/events`** – Family Event Calendar & RSVPs ([`events/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/events/page.tsx))
* **`GET /owner-dashboard/documents`** – Encrypted Document Archive ([`documents/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/documents/page.tsx))
* **`GET /owner-dashboard/invitations`** – Join Requests & Magic Links ([`invitations/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/invitations/page.tsx))
* **`GET /owner-dashboard/activity`** – Chronological Sanctuary Activity Logs ([`activity/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/activity/page.tsx))
* **`GET /owner-dashboard/settings`** – Sanctuary Branding & Policies ([`settings/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/settings/page.tsx))
* **`GET /owner-dashboard/profile`** – Owner Account Settings ([`profile/page.tsx`](file:///c:/Projects/family-together/src/app/owner-dashboard/profile/page.tsx))

### Admin Control Center (`/admin-dashboard`)
* **`GET /admin-dashboard`** – System Monitor & Infrastructure Metrics ([`page.tsx`](file:///c:/Projects/family-together/src/app/admin-dashboard/page.tsx))
* **`GET /admin-dashboard/users`** – Global User Account Management ([`users/page.tsx`](file:///c:/Projects/family-together/src/app/admin-dashboard/users/page.tsx))
* **`GET /admin-dashboard/analytics`** – Growth Metrics & Analytics ([`analytics/page.tsx`](file:///c:/Projects/family-together/src/app/admin-dashboard/analytics/page.tsx))
* **`GET /admin-dashboard/activity`** – Global Activity Audit Log ([`activity/page.tsx`](file:///c:/Projects/family-together/src/app/admin-dashboard/activity/page.tsx))
* **`GET /admin-dashboard/super`** – Super Admin Portal & Database Controls ([`super/page.tsx`](file:///c:/Projects/family-together/src/app/admin-dashboard/super/page.tsx))
* **`GET /admin-dashboard/settings`** – Global Platform Settings ([`settings/page.tsx`](file:///c:/Projects/family-together/src/app/admin-dashboard/settings/page.tsx))

### User / Member Dashboard (`/user-dashboard`)
* **`GET /user-dashboard`** – Member Timeline & Memory Feed ([`page.tsx`](file:///c:/Projects/family-together/src/app/user-dashboard/page.tsx))
* **`GET /user-dashboard/profile`** – Personal Member Profile & Security ([`profile/page.tsx`](file:///c:/Projects/family-together/src/app/user-dashboard/profile/page.tsx))

---

## ⚡ 6. Core Business Workflows & Special Features

1. **Role-Based Authentication & Redirection:**  
   Signing in resolves the user's role via [`getDashboardRouteByRole`](file:///c:/Projects/family-together/src/lib/utils/roleUtils.ts#L17-L34) and automatically routes `ADMIN` / `SUPER_ADMIN` to `/admin-dashboard`, `OWNER` to `/owner-dashboard`, and `USER` / `MEMBER` to `/user-dashboard`.

2. **Real-Time Member Deduplication & Profile Linking:**  
   When adding a relative in [`AddMemberModal.tsx`](file:///c:/Projects/family-together/src/components/modals/AddMemberModal.tsx), typing a name searches existing database profiles in real time. An Info Eye Icon (`<Eye />`) previews profile details in a modal, and a "Link Person" (`<Link2 />`) button links the existing person profile without creating duplicate rows in PostgreSQL.

3. **Auto User Credential Provisioning:**  
   When an Owner adds a member with an email address, `FamilyService` creates an `ACTIVE` user account with default password (`Family@123`), verified email status, and dispatches a welcome email via Nodemailer for immediate login access.

4. **Encrypted Vault & Interactive Media Carousel:**  
   The memories page features an interactive multi-card slider carousel and full-screen lightbox modal for high-res photo viewing.

---

## 🚀 7. Key REST API Endpoints (`family-together-backend`)

* **Auth:** `POST /auth/login`, `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/forgot-password`
* **Sanctuary Data:** `GET /family/sanctuary`, `PATCH /family/update`
* **Members:** `GET /family/members`, `GET /family/members/search?q=...`, `POST /family/members`, `PATCH /family/members/:id`, `DELETE /family/members/:id`
* **Memories & Media:** `GET /family/memories`, `POST /family/memories`
* **Events Calendar:** `GET /family/events`, `POST /family/events`
* **Relationships:** `GET /family/relationships`, `POST /family/relationships`
* **Documents Vault:** `GET /family/documents`, `POST /family/documents`, `DELETE /family/documents/:id`
* **Invitations:** `GET /family/invitations`, `POST /family/invitations`, `PATCH /family/invitations/:id`
* **Admin Stats:** `GET /family/admin/stats`
