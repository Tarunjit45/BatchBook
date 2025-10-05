# BatchBook

A modern web application built with Next.js and TailwindCSS for discovering, organizing, and sharing amazing content.

## Features

- 🔍 **Smart Search**: Intelligent search functionality with filtering and sorting
- 🎨 **Modern UI**: Beautiful, responsive design with TailwindCSS
- 📱 **Mobile First**: Optimized for all device sizes
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🎯 **Type Safety**: Full TypeScript support
- 🔧 **Scalable Architecture**: Well-organized component structure

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **Icons**: Heroicons (SVG)
- **Images**: Next.js Image Optimization
- **Deployment**: Vercel

## Project Structure

```
BatchBook/
├── components/           # Reusable React components
│   ├── Header.tsx       # Navigation header
│   ├── SearchBar.tsx    # Search input component
│   └── PhotoCard.tsx    # Content card component
├── pages/               # Next.js pages
│   ├── _app.tsx         # App wrapper
│   ├── index.tsx        # Landing page
│   └── results.tsx      # Search results page
├── public/              # Static assets
│   └── images/          # Image assets
├── styles/              # Global styles
│   └── globals.css      # TailwindCSS imports
├── utils/               # Utility functions
│   ├── helpers.ts       # General helper functions
│   └── mockData.ts      # Mock data for development
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
└── next.config.js       # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the directory
   cd BatchBook
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Vercel

Vercel provides free hosting for Next.js applications with excellent performance and global CDN.

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? `N`
   - Project name: `batchbook` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? `N`

4. **Your app will be deployed!**
   Vercel will provide you with a URL like `https://batchbook.vercel.app`

### Method 2: Deploy via GitHub Integration

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/batchbook.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings (usually auto-detected)
   - Click "Deploy"

3. **Automatic deployments**
   - Every push to main branch will trigger a new deployment
   - Pull requests get preview deployments automatically

### Environment Variables (if needed)

If you need environment variables:

1. **Create `.env.local` file**
   ```bash
   # Add your environment variables
   NEXT_PUBLIC_API_URL=https://api.example.com
   ```

2. **Add to Vercel**
   - Go to your project dashboard
   - Settings → Environment Variables
   - Add your variables

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `styles/globals.css` for global styles
- Use Tailwind utility classes throughout components

### Components
- All components are in the `components/` directory
- Follow the existing patterns for consistency
- Use TypeScript interfaces for props

### Content
- Update `utils/mockData.ts` to change sample data
- Replace placeholder images in `public/images/`
- Modify page content in `pages/` directory

## Performance Tips

- Images are automatically optimized by Next.js Image component
- Use dynamic imports for code splitting
- Implement proper loading states
- Optimize bundle size with proper imports

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help, please open an issue in the repository.
