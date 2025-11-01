import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function Header() {
  const router = useRouter()

  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Show loading state on the server to prevent hydration mismatch
  if (!isClient || status === 'loading') {
    return (
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-primary-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/upload');
  };

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
            <Link 
              href="/feed" 
              className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                router.pathname === '/feed' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Memory Feed
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {session.user?.image && (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {session.user?.name || 'User'}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={handleSignIn}
                className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                </svg>
                Sign In with Google
              </button>
            )}
            <button 
              onClick={handleUploadClick}
              className="btn-primary text-sm"
            >
              Upload Memories
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
