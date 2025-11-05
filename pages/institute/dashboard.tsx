import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import { FiCheckCircle, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCalendar } from 'react-icons/fi';

interface Institute {
  _id: string;
  name: string;
  email: string;
  domain: string;
  adminName: string;
  designation: string;
  contactNumber: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export default function InstituteDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    // Check if institute info is stored in localStorage
    if (typeof window !== 'undefined') {
      const storedInstitute = localStorage.getItem('instituteInfo');
      if (storedInstitute) {
        setInstitute(JSON.parse(storedInstitute));
        setLoading(false);
        return;
      }
    }

    // If no stored info, check session
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchInstituteProfile();
  }, [session, status, router]);

  const fetchInstituteProfile = async () => {
    try {
      setLoading(true);
      
      // First try to get from localStorage (for custom login)
      if (typeof window !== 'undefined') {
        const storedInstitute = localStorage.getItem('instituteInfo');
        if (storedInstitute) {
          setInstitute(JSON.parse(storedInstitute));
          setLoading(false);
          return;
        }
      }
      
      // Fallback to API (for Google login)
      const response = await fetch('/api/institute/profile');
      const data = await response.json();

      if (data.success) {
        setInstitute(data.institute);
      } else {
        setError(data.message || 'Failed to fetch institute profile');
      }
    } catch (err) {
      setError('Failed to fetch institute profile');
      console.error('Error fetching institute profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <FiMail className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="btn-primary px-6 py-3"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If institute is not approved
  if (institute?.verificationStatus !== 'approved') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <FiCalendar className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Institute Not Approved</h1>
              <p className="text-gray-600 mb-6">
                Your institute registration is currently {institute?.verificationStatus || 'pending'}. 
                Please wait for admin approval.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  You'll receive an email notification once your institute is approved.
                </p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="btn-primary px-6 py-3"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Institute Dashboard - {institute?.name}</title>
        <meta name="description" content="Institute dashboard for BatchBook" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Institute Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{institute?.name}</h1>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <FiCheckCircle className="mr-1" />
                      Verified Institute
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-primary-100">Institute ID: {institute?._id.substring(0, 8)}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Institute Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Admin Name</p>
                        <p className="text-gray-900">{institute?.adminName}</p>
                        <p className="text-sm text-gray-500">{institute?.designation}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FiMail className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{institute?.email}</p>
                        <p className="text-sm text-gray-500">Domain: {institute?.domain}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FiPhone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Contact</p>
                        <p className="text-gray-900">{institute?.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FiMapPin className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-gray-900">
                          {institute?.address?.street && `${institute.address.street}, `}
                          {institute?.address?.city && `${institute.address.city}, `}
                          {institute?.address?.state}
                        </p>
                        <p className="text-gray-900">
                          {institute?.address?.pincode && `${institute.address.pincode}, `}
                          {institute?.address?.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FiCalendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Registration Details</p>
                        <p className="text-gray-900">
                          Registered: {institute?.createdAt && new Date(institute.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-900">
                          Approved: {institute?.verifiedAt && new Date(institute.verifiedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">Approved by: {institute?.verifiedBy}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Verified Staff</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiGlobe className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Memories Shared</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Verification Status</p>
                  <p className="text-2xl font-bold text-green-600">Verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Institute Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/register-staff')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiUser className="mr-2" />
                Register Staff Members
              </button>
              <button
                onClick={() => router.push('/upload')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiGlobe className="mr-2" />
                Share Memories
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}