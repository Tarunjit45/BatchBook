# 🎓 BatchBook — Digital Yearbook & Nostalgic Alumni Vault

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**BatchBook** is a modern, responsive full-stack web application crafted to preserve school and college memories. It serves as a digital yearbook and nostalgia vault where students, teachers, and alumni can share photo memories, engage in social comment threads, and reminisce about their school batches.

---

## ✨ Key Features

* 📸 **Curated Memory Gallery:** High-resolution photo cards showcasing batch events, sports days, cultural festivals, and candid campus moments.
* 🔍 **Smart Alumni Search:** Instant filtering by student name, roll number, batch year, or memory category via `SearchBar.tsx`.
* 💬 **Interactive Memory Threads:** Community comment system on individual memories powered by Mongoose schema models.
* ☁️ **Media Ingestion Pipeline:** File uploads managed through `multer` middleware with integration for Google Cloud Storage.
* 📱 **Mobile-First Nostalgic UI:** Fluid animations powered by Framer Motion and nostalgic styling styled with Tailwind CSS.
* 🔐 **Authentication Ready:** Integrated with NextAuth.js and MongoDB adapter for secure student verification.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Next.js (App / Pages router), React 18, Tailwind CSS, Framer Motion, React Icons.
* **Backend:** Next.js API Routes, Next-Connect, Multer (multipart upload handling).
* **Database & ORM:** MongoDB, Mongoose (`models/Photo.ts`, `models/Comment.ts`).
* **Cloud Storage:** Google Cloud Storage (`@google-cloud/storage`).
* **Auth:** NextAuth.js (`@auth/mongodb-adapter`).

---

## 📁 Project Structure

```text
BatchBook/
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header & brand logo
│   ├── Footer.tsx         # Site footer
│   ├── PhotoCard.tsx      # Interactive memory photo card
│   └── SearchBar.tsx      # Instant alumni/photo search bar
├── lib/                   # Utility functions & database connection
│   ├── dbConnect.ts       # Cached MongoDB Mongoose connection
│   ├── db.ts              # Database helpers
│   └── storage.ts         # Google Cloud Storage client helpers
├── middleware/            # Custom API middlewares
│   └── multer.ts          # Multer memory/disk file upload handler
├── models/                # Mongoose database schemas
│   ├── Photo.ts           # Photo memory metadata & tags
│   └── Comment.ts         # Photo comment thread schema
├── next.config.js         # Next.js build & image domain configuration
├── package.json           # Dependencies & scripts
├── LICENSE                # MIT License
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** and a running **MongoDB** instance (local or MongoDB Atlas).

### 2. Installation
```bash
git clone https://github.com/Tarunjit45/BatchBook.git
cd BatchBook

npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/batchbook
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google Cloud Storage (Optional for cloud media hosting)
GCP_PROJECT_ID=your_project_id
GCP_CLIENT_EMAIL=your_service_account_email
GCP_PRIVATE_KEY="your_private_key"
GCP_BUCKET_NAME=your_storage_bucket
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
