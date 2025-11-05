import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn, useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiUser } from 'react-icons/fi'

export default function Header() {
  const router = useRouter()
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = () => {
    // Clear institute info from localStorage if it exists
    if (typeof window !== 'undefined') {
      localStorage.removeItem('instituteInfo');
    }
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
    router.push('/auth/signin');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-primary-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3" onClick={closeMobileMenu}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg md:text-xl">📚</span>
            </div>
            <span className="text-xl md:text-2xl font-nostalgic font-bold text-primary-800">BatchBook</span>
          </Link>

          {/* Desktop Navigation */}
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

            
            {/* Admin Panel Link - Only visible to admin */}
            {session?.user?.email === 'tarunjitbiswas24@gmail.com' && (
              <Link 
                href="/admin" 
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                  router.pathname === '/admin' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Admin Panel
              </Link>
            )}
                          

          </nav>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {/* Institute Authority Profile Button */}
                {session.user?.email && session.user.email.endsWith('.edu.in') ? (
                  <button 
                    onClick={() => router.push('/institute/dashboard')}
                    className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
                  >
                    <FiMenu className="w-4 h-4 mr-2" />
                    Institute Dashboard
                  </button>
                ) : (
                  <>
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
                  </>
                )}
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => router.push('/auth/signin')}
                className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                </svg>
                Sign In
              </button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors px-4 py-3 rounded-lg ${
                  router.pathname === '/' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/upload" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors px-4 py-3 rounded-lg ${
                  router.pathname === '/upload' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Upload
              </Link>
              <Link 
                href="/about" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors px-4 py-3 rounded-lg ${
                  router.pathname === '/about' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                About
              </Link>
              <Link 
                href="/feed" 
                onClick={closeMobileMenu}
                className={`text-base font-medium transition-colors px-4 py-3 rounded-lg ${
                  router.pathname === '/feed' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Memory Feed
              </Link>

              
              {/* Mobile Admin Panel Link - Only visible to admin */}
              {session?.user?.email === 'tarunjitbiswas24@gmail.com' && (
                <Link 
                  href="/admin" 
                  onClick={closeMobileMenu}
                  className={`text-base font-medium transition-colors px-4 py-3 rounded-lg ${
                    router.pathname === '/admin' 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Admin Panel
                </Link>
              )}

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                {session ? (
                  <>
                    {/* Institute Authority Profile Button - Mobile */}
                    {session.user?.email && session.user.email.endsWith('.edu.in') ? (
                      <button 
                        onClick={() => {
                          router.push('/institute/dashboard');
                          closeMobileMenu();
                        }}
                        className="w-full flex items-center text-base font-medium text-primary-600 hover:text-primary-700 transition-colors px-4 py-3 rounded-lg hover:bg-primary-50"
                      >
                        <FiMenu className="w-5 h-5 mr-2" />
                        Institute Dashboard
                      </button>
                    ) : (
                      <div className="flex items-center space-x-3 px-4 py-2">
                        {session.user?.image && (
                          <img 
                            src={session.user.image} 
                            alt={session.user.name || 'User'}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {session.user?.name || 'User'}
                        </span>
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        // Clear institute info from localStorage if it exists
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('instituteInfo');
                        }
                        handleSignOut();
                        closeMobileMenu();
                      }}
                      className="w-full text-left text-base font-medium text-primary-600 hover:text-primary-700 transition-colors px-4 py-3 rounded-lg hover:bg-primary-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      router.push('/auth/signin');
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center text-base font-medium text-primary-600 hover:text-primary-700 transition-colors px-4 py-3 rounded-lg hover:bg-primary-50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                    </svg>
                    Sign In
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
