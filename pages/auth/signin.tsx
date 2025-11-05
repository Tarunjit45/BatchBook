import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import { FiShield, FiUser, FiUsers, FiLogIn } from 'react-icons/fi';

export default function CustomSignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { callbackUrl } = router.query;

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      // Check if there's a callback URL
      const redirectUrl = callbackUrl ? callbackUrl.toString() : null;
      
      // Check user type and redirect accordingly
      if (session.user?.email === 'tarunjitbiswas24@gmail.com') {
        router.push(redirectUrl || '/admin');
      } else if (session.user?.email?.endsWith('.edu.in')) {
        router.push(redirectUrl || '/institute/dashboard');
      } else {
        // For general users, check if they were trying to access a specific page
        if (redirectUrl && redirectUrl !== '/' && !redirectUrl.includes('signin')) {
          router.push(redirectUrl);
        } else {
          router.push('/');
        }
      }
    }
  }, [status, session, router, callbackUrl]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleInstituteLogin = () => {
    router.push('/auth/institute-login');
  };

  const handleStaffLogin = () => {
    router.push('/auth/staff-login');
  };

  const handleRegisterStaff = () => {
    router.push('/register-staff');
  };

  const handleGeneralLogin = () => {
    setIsLoading(true);
    // Use the callback URL if present, otherwise default to home
    const redirectUrl = callbackUrl ? callbackUrl.toString() : '/';
    signIn('google', { callbackUrl: redirectUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Login Options - BatchBook</title>
        <meta name="description" content="Choose your login option on BatchBook" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to BatchBook
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Preserve and share your school memories with your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Institute Login Option */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Institute Authority</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  For principals, deans, and other institutional authorities to register and manage your institute.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => router.push('/register-institute')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <FiLogIn className="mr-2" />
                    Register Institute
                  </button>
                  <button
                    onClick={handleInstituteLogin}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <FiLogIn className="mr-2" />
                    Login as Institute
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Only for registered institute authorities with .edu.in email addresses
                </p>
              </div>
            </div>

            {/* Staff Login Option */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Staff Member</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  For teachers and staff to register and upload official memories.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleRegisterStaff}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiLogIn className="mr-2" />
                    Register as Staff
                  </button>
                  <button
                    onClick={handleStaffLogin}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <FiLogIn className="mr-2" />
                    Login as Staff
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Only verified staff members can upload memories
                </p>
              </div>
            </div>

            {/* General User Option */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">General User</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Browse, search, like, and comment on memories shared by others.
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> General users cannot upload memories. Only verified staff and admins can upload.
                    </p>
                  </div>
                  <button
                    onClick={handleGeneralLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FiLogIn className="mr-2" />
                        Login with Google
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  For browsing, searching, and engaging with memories
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-medium text-gray-900">Institute Authority</h4>
                <p className="text-sm text-gray-600">Manage institute profile and register staff</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Verified Staff</h4>
                <p className="text-sm text-gray-600">Upload and share official memories</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">General Users</h4>
                <p className="text-sm text-gray-600">Browse, search, like, and comment</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}