import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import { FiCheck, FiX, FiRefreshCw, FiUsers, FiFileText, FiShield } from 'react-icons/fi';

interface Institute {
  _id: string;
  name: string;
  email: string;
  domain: string;
  adminName: string;
  designation: string;
  contactNumber: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

interface Statistics {
  institutes: {
    total: number;
    approved: number;
    pending: number;
  };
  staff: {
    total: number;
    verified: number;
  };
  photos: {
    total: number;
  };
}

export default function AdminPanel() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('institutes');

  // Check if user is admin
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check if user is admin (only tarunjitbiswas24@gmail.com)
    if (session.user?.email !== 'tarunjitbiswas24@gmail.com') {
      router.push('/');
      return;
    }

    fetchInstitutes();
    fetchStatistics();
  }, [session, status, router]);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institute/admin-list');
      const data = await response.json();

      if (data.success) {
        setInstitutes(data.institutes);
      } else {
        setError(data.message || 'Failed to fetch institutes');
      }
    } catch (err) {
      setError('Failed to fetch institutes');
      console.error('Error fetching institutes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/statistics');
      const data = await response.json();

      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleVerification = async (instituteId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/institute/admin-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instituteId,
          action,
          adminEmail: session?.user?.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setInstitutes(prev => 
          prev.map(inst => 
            inst._id === instituteId 
              ? { 
                  ...inst, 
                  verificationStatus: action === 'approve' ? 'approved' : 'rejected',
                  verifiedAt: new Date().toISOString(),
                  verifiedBy: session?.user?.email || undefined,
                } 
              : inst
          )
        );
        
        // Refresh statistics
        fetchStatistics();
      } else {
        alert(data.message || 'Failed to update institute status');
      }
    } catch (err) {
      console.error('Error updating institute:', err);
      alert('Failed to update institute status');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Panel - BatchBook</title>
        <meta name="description" content="Admin panel for BatchBook" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage institutes and platform settings</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('institutes')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'institutes'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FiUsers className="inline mr-2" />
                  Institute Requests
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FiShield className="inline mr-2" />
                  Platform Settings
                </button>
              </nav>
            </div>

            {/* Institute Requests Tab */}
            {activeTab === 'institutes' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Institute Verification Requests</h2>
                  <button
                    onClick={fetchInstitutes}
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Institute
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Domain
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {institutes.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              No institute requests found
                            </td>
                          </tr>
                        ) : (
                          institutes.map((institute) => (
                            <tr key={institute._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{institute.name}</div>
                                <div className="text-sm text-gray-500">{institute.adminName}</div>
                                <div className="text-xs text-gray-400">
                                  {new Date(institute.createdAt).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{institute.email}</div>
                                <div className="text-sm text-gray-500">{institute.contactNumber}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {institute.domain}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  institute.verificationStatus === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : institute.verificationStatus === 'approved' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {institute.verificationStatus.charAt(0).toUpperCase() + institute.verificationStatus.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {institute.verificationStatus === 'pending' && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleVerification(institute._id, 'approve')}
                                      className="text-green-600 hover:text-green-900 flex items-center"
                                    >
                                      <FiCheck className="mr-1" /> Approve
                                    </button>
                                    <button
                                      onClick={() => handleVerification(institute._id, 'reject')}
                                      className="text-red-600 hover:text-red-900 flex items-center"
                                    >
                                      <FiX className="mr-1" /> Reject
                                    </button>
                                  </div>
                                )}
                                {institute.verificationStatus !== 'pending' && (
                                  <span className="text-gray-500">
                                    {institute.verificationStatus === 'approved' ? 'Approved' : 'Rejected'} by {institute.verifiedBy}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Settings</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiShield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Admin Access Only:</strong> This panel is restricted to tarunjitbiswas24@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Institutes</span>
                        <span className="font-medium">{statistics?.institutes.total || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved Institutes</span>
                        <span className="font-medium">{statistics?.institutes.approved || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Requests</span>
                        <span className="font-medium">{statistics?.institutes.pending || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verified Staff</span>
                        <span className="font-medium">{statistics?.staff.verified || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Memories</span>
                        <span className="font-medium">{statistics?.photos.total || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
                    <div className="space-y-4">
                      <button
                        onClick={fetchInstitutes}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FiRefreshCw className="mr-2" />
                        Refresh Data
                      </button>
                      <button
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FiFileText className="mr-2" />
                        Export Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}