import { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCheck, FiX, FiLoader, FiLock, FiAlertTriangle } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type FormData = {
  fullName: string;
  schoolName: string;
  graduationYear: number;
  memoryTitle: string;
  description: string;
  isPublic: boolean;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const dropZoneVariants = {
  initial: { scale: 1 },
  drag: { 
    scale: 1.02,
    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)'
  }
};

export default function Upload() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPublicWarning, setShowPublicWarning] = useState(false);
  const [staffStatus, setStaffStatus] = useState<null | { isStaff: boolean; isVerified: boolean }>(null);
  const [loadingStaffStatus, setLoadingStaffStatus] = useState(true);

  // Form fields
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    schoolName: '',
    graduationYear: new Date().getFullYear(),
    memoryTitle: '',
    description: '',
    isPublic: false
  });

  // Check staff status on mount
  useEffect(() => {
    const checkStaffStatus = async () => {
      try {
        const response = await fetch('/api/staff/status');
        const data = await response.json();
        
        if (data.success) {
          setStaffStatus({
            isStaff: data.isStaff,
            isVerified: data.isVerified
          });
        }
      } catch (error) {
        console.error('Error checking staff status:', error);
      } finally {
        setLoadingStaffStatus(false);
      }
    };

    if (sessionStatus === 'authenticated') {
      checkStaffStatus();
    } else {
      setLoadingStaffStatus(false);
    }
  }, [sessionStatus]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) : value
    }));
  };

  const handlePublicToggle = (checked: boolean) => {
    if (checked) {
      // Show warning when enabling public
      setShowPublicWarning(true);
    } else {
      // Directly set to private without warning
      setFormData(prev => ({ ...prev, isPublic: false }));
    }
  };

  const confirmPublic = () => {
    setFormData(prev => ({ ...prev, isPublic: true }));
    setShowPublicWarning(false);
  };

  const cancelPublic = () => {
    setFormData(prev => ({ ...prev, isPublic: false }));
    setShowPublicWarning(false);
  };

  // Handle file selection
  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Check if user is authenticated
    if (!session) {
      alert('Please sign in to upload memories');
      signIn('google');
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.schoolName || !formData.graduationYear) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    setStatus(null);
    setUploadProgress(0);

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('fullName', formData.fullName);
    uploadData.append('schoolName', formData.schoolName);
    uploadData.append('graduationYear', formData.graduationYear.toString());
    uploadData.append('memoryTitle', formData.memoryTitle);
    uploadData.append('description', formData.description);
    uploadData.append('isPublic', formData.isPublic.toString());

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      clearInterval(interval);
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Upload failed:', result);
        throw new Error(result.message || 'Upload failed');
      }
      
      setUploadProgress(100);
      setStatus('success');
      
      // Reset form after successful upload
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setUploadProgress(0);
        setFormData({
          fullName: '',
          schoolName: '',
          graduationYear: new Date().getFullYear(),
          memoryTitle: '',
          description: '',
          isPublic: false
        });
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      
      // Show error message to user
      if (error instanceof Error) {
        alert(`Upload failed: ${error.message}`);
      } else {
        alert('An unknown error occurred during upload');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Upload Memories - BatchBook</title>
        <meta name="description" content="Upload your school memories to BatchBook" />
      </Head>

      <Header />

      {/* Loading state */}
      {(sessionStatus === 'loading' || loadingStaffStatus) && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
            <FiLoader className="animate-spin w-12 h-12 text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* Not authenticated - Show sign-in prompt */}
      {sessionStatus === 'unauthenticated' && (
        <motion.div 
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Sign In Required</h1>
              <p className="text-primary-100">You need to sign in to upload memories</p>
            </div>
            <div className="p-8 md:p-12 text-center">
              <p className="text-gray-600 mb-8 text-lg">
                Create an account or sign in to start sharing your school memories with BatchBook.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => signIn('google')}
                  className="w-full max-w-sm mx-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Sign in with Google
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  By signing in, you agree to our{' '}
                  <a href="/terms" className="text-primary-600 hover:underline">Terms</a> and{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why sign in?</h3>
                <ul className="text-left space-y-2 max-w-md mx-auto text-gray-600">
                  <li className="flex items-start">
                    <FiCheck className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Upload and share your school memories</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Connect with former classmates</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Like and comment on memories</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Keep your memories safe forever</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Authenticated but not staff or not verified - Show access restriction */}
      {sessionStatus === 'authenticated' && session && (!staffStatus?.isStaff || !staffStatus?.isVerified) && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Staff Access Required</h1>
              <p className="text-yellow-100">Only verified institute staff can upload memories</p>
            </div>
            <div className="p-8 md:p-12 text-center">
              {!staffStatus?.isStaff ? (
                <>
                  <p className="text-gray-600 mb-8 text-lg">
                    You are not registered as staff. Please register first to upload memories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/register-staff')}
                      className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors font-medium"
                    >
                      Register as Staff
                    </button>
                    <button
                      onClick={() => router.push('/')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-medium"
                    >
                      Back to Home
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-8 text-lg">
                    Your staff account is pending verification. You will receive an email once approved.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                    <p className="text-blue-800 text-sm">
                      Only verified staff members can upload memories to ensure platform security and authenticity.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-medium"
                  >
                    Back to Home
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authenticated, staff, and verified - Show upload form */}
      {sessionStatus === 'authenticated' && session && staffStatus?.isStaff && staffStatus?.isVerified && (
      <motion.main 
        className="container mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 md:p-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Share Your School Memories</h1>
            <p className="text-sm md:text-base text-primary-100 mt-1">Upload photos, yearbooks, or documents to preserve them forever</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Passing <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="graduationYear"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white"
                      required
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                    School/College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="schoolName"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your school or college name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="memoryTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Memory Title
                  </label>
                  <input
                    type="text"
                    id="memoryTitle"
                    name="memoryTitle"
                    value={formData.memoryTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="E.g., Graduation Day 2023, Sports Meet, etc."
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell us more about this memory..."
                  />
                </div>

                {/* Public/Private Toggle */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <label htmlFor="isPublic" className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.isPublic}
                            onChange={(e) => handlePublicToggle(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full transition-colors ${
                            formData.isPublic ? 'bg-primary-600' : 'bg-gray-300'
                          }`}></div>
                          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                            formData.isPublic ? 'transform translate-x-6' : ''
                          }`}></div>
                        </div>
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900">
                            {formData.isPublic ? 'Public Memory' : 'Private Memory'}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formData.isPublic 
                              ? 'This memory will appear in the Memory Feed for all users'
                              : 'This memory will only be searchable by school name and year'}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                    💡 <strong>Note:</strong> Regardless of this setting, all memories are searchable when users filter by school name and graduation year.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Memory</h3>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {!file ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <FiUpload className="w-8 h-8 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Drag and drop your file here</h3>
                        <p className="text-sm text-gray-500 mt-1">or</p>
                      </div>
                      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                        Browse Files
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e.target.files?.[0] || null)} 
                          accept="image/*,.pdf" 
                        />
                      </label>
                      <p className="text-xs text-gray-500">Supports JPG, PNG, PDF (Max 10MB)</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCheck className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                        <p className="text-sm text-gray-500">
                          {file.size > 1024 * 1024 
                            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                            : `${Math.round(file.size / 1024)} KB`}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove file
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                    By uploading, you agree to our{' '}
                    <a href="/terms" className="text-primary-600 hover:underline">Terms</a> and{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
                  </p>
                  <button
                    type="submit"
                    disabled={!file || isUploading || !formData.fullName || !formData.schoolName || !formData.graduationYear}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                      !file || isUploading || !formData.fullName || !formData.schoolName || !formData.graduationYear 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  >
                    {isUploading ? (
                      <>
                        <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="-ml-1 mr-3 h-5 w-5" />
                        Upload Memory
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {status && (
              <motion.div
                className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg ${
                  status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  {status === 'success' ? (
                    <>
                      <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-sm font-medium">Upload successful!</p>
                    </>
                  ) : (
                    <>
                      <FiX className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-sm font-medium">Upload failed. Please try again.</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.main>
      )}
      
      {/* Public Warning Modal */}
      <AnimatePresence>
        {showPublicWarning && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelPublic}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Make Memory Public?</h3>
                <p className="text-gray-600 mb-6">
                  By enabling public, your memory will be visible to <strong>all users</strong> on the Memory Feed. Everyone on this platform will be able to see, like, and comment on this post.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-blue-800">
                    🔍 <strong>Search Visibility:</strong> Your memory will still appear in search results when users filter by your school name and graduation year, regardless of this setting.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={cancelPublic}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPublic}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition-colors"
                  >
                    Yes, Make Public
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
