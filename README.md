# BatchBook 📚

Your school memories, preserved forever.

BatchBook is a modern web application that helps you discover, share, and preserve precious school memories from yearbooks, photos, and more. Search by school and year to find and relive your cherished moments.

## ✨ Features

- **Smart Search** - Search memories by school name and graduation year
- **Photo Upload** - Upload and share your school memories with detailed metadata
- **Memory Feed** - Browse through all shared memories in a beautiful, interactive feed
- **Social Interactions** - Like, comment, and share memories with others
- **Responsive Design** - Beautiful UI that works on all devices
- **Cloud Storage** - Secure file storage using Google Cloud Storage
- **Authentication** - Google OAuth integration with NextAuth

## 🚀 Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom animations
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: NextAuth.js with Google OAuth
- **File Upload**: Multer middleware
- **Cloud Storage**: Google Cloud Storage
- **UI/UX**: Framer Motion, React Icons, Heroicons

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account
- Google Cloud Platform account (for OAuth and Storage)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Tarunjit45/BatchBook.git
cd BatchBook
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=BatchBook
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GCS_BUCKET_NAME=your_gcs_bucket_name
GOOGLE_CLOUD_PROJECT_ID=your_project_id
```

4. Set up Google Cloud Storage:
   - Create a service account and download the key file
   - Save it as `service-account-key.json` in the root directory
   - Grant necessary permissions (Storage Admin)

5. Configure MongoDB Atlas:
   - Whitelist your IP address
   - Create a database user
   - Update connection string in `.env.local`

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
BatchBook/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   └── PhotoCard.tsx
├── lib/                 # Utility functions
│   ├── db.ts           # MongoDB connection
│   ├── dbConnect.ts    # Database helper
│   └── storage.ts      # Google Cloud Storage
├── middleware/          # Custom middleware
│   └── multer.ts       # File upload handling
├── models/             # Mongoose schemas
│   ├── User.ts
│   ├── Photo.ts
│   ├── Memory.ts
│   ├── Comment.ts
│   └── Institution.ts
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   ├── auth/      # Authentication
│   │   ├── photos/    # Photo endpoints
│   │   ├── memories/  # Memory CRUD
│   │   └── upload.ts  # File upload
│   ├── index.tsx      # Home page with search
│   ├── feed.tsx       # Memory feed
│   ├── upload.tsx     # Upload page
│   └── about.tsx      # About page
├── public/            # Static assets
├── styles/            # Global styles
└── types/             # TypeScript types
```

## 🔧 Configuration

### MongoDB Connection
If you encounter SSL/TLS errors, add this to your connection string:
```
?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true
```

### Image Domains
Google Cloud Storage is configured in `next.config.js`:
```javascript
images: {
  domains: ['storage.googleapis.com']
}
```

## 🌐 API Endpoints

- `GET /api/photos` - Fetch all photos (with optional search filters)
- `POST /api/upload` - Upload a new memory with photo
- `GET /api/memories` - Get all memories
- `POST /api/memories/create` - Create a new memory
- `POST /api/memories/[id]/like` - Like a memory
- `POST /api/memories/[id]/comments` - Add a comment

## 🎨 Features in Detail

### Search Functionality
Users can search for memories by:
- School name (case-insensitive)
- Graduation year
- Combined filters

Results are displayed on the home page with smooth animations.

### Upload System
- Supports JPEG, PNG, and WebP images
- Max file size: 10MB
- Automatic signed URL generation for secure access
- Metadata collection: name, school, year, title, description

### Memory Feed
- Interactive card-based layout
- Like and comment functionality
- Social sharing options (Facebook, Twitter, WhatsApp)
- Real-time updates

## 🔒 Security

- Google OAuth authentication
- Secure file uploads with validation
- MongoDB with proper connection encryption
- Environment variables for sensitive data
- Service account key for GCS (not committed to repo)

## 🐛 Known Issues

See `ISSUES_AND_FIXES.md` for common issues and solutions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Tarunjit Biswas
- GitHub: [@Tarunjit45](https://github.com/Tarunjit45)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- MongoDB Atlas for database services
- Google Cloud Platform for storage and authentication

---

Made with ❤️ for preserving school memories
