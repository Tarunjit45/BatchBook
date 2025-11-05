import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Header from '@/components/Header';
import { FiUser, FiBriefcase, FiMail, FiCheckCircle } from 'react-icons/fi';

interface Institute {
  _id: string;
  name: string;
  domain: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
}

export default function RegisterStaff() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    department: '',
    instituteId: '',
    instituteName: '',
    employeeId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [autoVerified, setAutoVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Store the intended destination in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('intendedDestination', '/register-staff');
      }
      // Redirect to sign in with callback URL
      router.push(`/auth/signin?callbackUrl=/register-staff`);
    } else if (status === 'authenticated' && session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || '',
      }));
      fetchInstitutes();
    }
  }, [status, session, router]);

  const fetchInstitutes = async () => {
    try {
      const response = await fetch('/api/institute/list');
      const data = await response.json();
      
      if (data.success) {
        setInstitutes(data.institutes);
      }
    } catch (err) {
      console.error('Error fetching institutes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill institute name when institute is selected
    if (name === 'instituteId') {
      const selectedInstitute = institutes.find(inst => inst._id === value);
      if (selectedInstitute) {
        setFormData(prev => ({
          ...prev,
          instituteName: selectedInstitute.name,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/staff/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setAutoVerified(data.autoVerified || false);
      } else {
        setError(data.message || 'Failed to register as staff');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>Staff Registration - BatchBook</title>
          <meta name="description" content="Register as staff on BatchBook" />
        </Head>
        
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FiCheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {autoVerified ? 'Registration Successful!' : 'Verification Request Sent!'}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {autoVerified 
                  ? `Your staff account has been automatically verified. You can now upload and share memories.` 
                  : `Your verification request has been sent to the institute administration. You will receive an email once approved.`}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  {autoVerified
                    ? 'You now have permission to upload verified memories to BatchBook.'
                    : 'Please check your email for updates on your verification status.'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="btn-primary px-6 py-3"
                >
                  Back to Home
                </button>
                {autoVerified && (
                  <button
                    onClick={() => router.push('/upload')}
                    className="btn-secondary px-6 py-3"
                  >
                    Upload Memory
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Register as Staff - BatchBook</title>
        <meta name="description" content="Register as staff on BatchBook to upload verified memories" />
      </Head>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Register as Staff</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join as a verified staff member to upload official memories and events.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Staff Information</h2>
              <p className="text-gray-600 text-sm mt-1">
                Please provide accurate information for verification.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This email will be used for verification. If it matches your institute domain, you'll be auto-verified.
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Teacher, HOD, Professor"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Computer Science, Mathematics"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institute *
                </label>
                <select
                  name="instituteId"
                  value={formData.instituteId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select your institute</option>
                  {institutes
                    .map(institute => (
                      <option key={institute._id} value={institute._id}>
                        {institute.name} - Verified Institute
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Only verified institutes are available for staff registration.
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID (Optional)
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Employee ID"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-3 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Register as Staff'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
