import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-primary-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">📚</span>
            </div>
            <span className="text-2xl font-nostalgic font-bold text-primary-800">BatchBook</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                router.pathname === '/' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/upload" 
              className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                router.pathname === '/upload' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Upload
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                router.pathname === '/about' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              About
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50">
              Sign In
            </button>
            <button className="btn-primary text-sm">
              Upload Memories
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
