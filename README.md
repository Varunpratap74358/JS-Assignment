# ME-API. Playground

A high-fidelity, production-ready MERN stack application designed to manage and showcase professional portfolios. This project features a robust RESTful architecture, a premium "glassmorphism" UI, and advanced data handling systems.

---

## 🚀 Key Features

### 🔐 Multi-Layered Security
- **Smart Auth Strategy**: Token persistence via **HTTP-only Cookies** and fallback **Authorization Headers**.
- **Secure Middleware**: Multi-source token verification (Header > Cookie) for resilient sessions.
- **Fail-safe Logic**: Automatic session recovery and cross-browser cookie synchronization.

### 🎨 Premium UI/UX
- **Aesthetic Excellence**: Vibrant glassmorphism design with smooth animations and state-of-the-art onboarding.
- **Portfolio Hub**: A dedicated dashboard for managing projects and work history with real-time updates.
- **Discovery Port**: **Paginated search engine** for professionals with debounced logic (300ms).
- **Projects Library**: Dynamic, paginated project feed with **Newest-First sorting** and skill filters.

### 🛠️ Technical Prowess
- **Pure REST Architecture**: Optimized Express routes for high performance and scalability.
- **Centralized API Layer**: Unified `restClient` for consistent data fetching and error handling.
- **Advanced Pagination**: Server-side pagination (`page`/`limit`) for all major discovery views.
- **Global Search Engine**: Contextual searching across Names, Emails, Education, and Skills.

---

## 💻 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB + Mongoose.
- **API Architecture**: Pure RESTful API (Express Router).
- **Auth**: JSON Web Tokens (JWT), Cookie-parser.

---

## 📡 API Documentation

### 🛠️ REST API Reference

#### Authentication
- `POST /api/auth/signup` - Create new account.
- `POST /api/auth/login` - Secure login (returns Token + Sets Cookie).
- `GET /api/auth/me` - Fetch current authenticated user.
- `POST /api/auth/logout` - Clear session.

#### Profile & Portfolio Management
- `GET /api/profile` - Fetch profile (Authenticated user or public fallback).
- `POST /api/profile` - Update main profile/Onboarding.
- `POST /api/projects` - Add a project milestone.
- `PUT /api/projects/:id` - Update project details.
- `DELETE /api/projects/:id` - Remove a project.
- `POST /api/work` - Add work experience.
- `PUT /api/work/:id` - Update work history.
- `DELETE /api/work/:id` - Remove work entry.

#### Discovery & Search
- `GET /api/search?q={query}&page=1&limit=6` - Paginated professional search.
- `GET /api/projects?skill={skill}&page=1&limit=6` - Paginated projects feed (Newest first).

---

## ⚙️ Installation & Setup

1. **Clone & Install**:
   ```bash
   # Backend
   cd backend && npm install
   # Frontend
   cd frontend && npm install
   ```

2. **Environment Configuration**:
   Create a `.env` in the `backend` folder:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   ```

3. **Database Preparation**:
   ```bash
   # Clean & Seed 10+ professional results
   node seed.js
   # Fix/Clean old indexes
   node fix-indexes.js
   ```

4. **Launch**:
   ```bash
   # Backend
   npm run dev
   # Frontend
   npm run dev
   ```

---

## 📊 Database Design

The `User` model is the core of the system, storing authenticated credentials and nested portfolio data:
- **Profile Fields**: Name, Email (Unique), Education, Skills (Searchable).
- **Projects Array**: Title, Description, Skills Used, External Links, Timestamps.
- **Work Array**: Company, Role, Duration, Impact Description.

---

**Developed with ❤️ and Antigravity AI.**
