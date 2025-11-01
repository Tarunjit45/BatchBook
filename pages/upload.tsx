import { useState, useCallback } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type FormData = {
  fullName: string;
  schoolName: string;
  graduationYear: number;
  memoryTitle: string;
  description: string;
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
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    schoolName: '',
    graduationYear: new Date().getFullYear(),
    memoryTitle: '',
    description: ''
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) : value
    }));
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
          description: ''
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
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Share Your School Memories</h1>
            <p className="text-primary-100 mt-1">Upload photos, yearbooks, or documents to preserve them forever</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
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
      <Footer />
    </div>
  );
}
