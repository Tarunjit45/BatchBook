import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUpload, FiBookOpen, FiUsers, FiAward, FiArrowRight } from 'react-icons/fi';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

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
  },
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  }
};

const featureItems = [
  {
    icon: <FiSearch className="w-8 h-8 text-primary-600" />,
    title: 'Find Your School',
    description: 'Search through thousands of schools and years to find your specific yearbook and class memories.'
  },
  {
    icon: <FiUpload className="w-8 h-8 text-primary-600" />,
    title: 'Preserve Forever',
    description: 'Upload and preserve your school photos, yearbooks, and memories in high quality for future generations.'
  },
  {
    icon: <FiUsers className="w-8 h-8 text-primary-600" />,
    title: 'Share & Connect',
    description: 'Share your memories with classmates and discover photos you never knew existed from your school days.'
  }
];

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
  
  // Search states
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/upload');
  };

  const handleBrowseSchools = (e: React.MouseEvent) => {
    e.preventDefault();
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const school = formData.get('school') as string;
    const year = formData.get('year') as string;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const params = new URLSearchParams();
      if (school) params.append('school', school);
      if (year) params.append('year', year);
      
      const response = await fetch(`/api/photos?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.photos);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      
      setTimeout(() => {
        const resultsSection = document.getElementById('search-results');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>BatchBook - Your school memories, preserved forever.</title>
        <meta name="description" content="Discover and share precious school memories from yearbooks, photos, and more with BatchBook" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <motion.main 
        className="container mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Title */}
          <motion.div 
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-nostalgic font-bold text-primary-800 mb-4 md:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              BatchBook
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl text-primary-600 font-medium mb-4 md:mb-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your school memories, preserved forever.
            </motion.p>
            
            <motion.p 
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Rediscover the joy of school days through yearbooks, class photos, and shared memories. 
              Search by school and year to find your precious moments.
            </motion.p>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            id="search-section" 
            className="max-w-4xl mx-auto mb-16 md:mb-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-primary-100 p-4 md:p-6 transition-all duration-300 hover:shadow-2xl">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-primary-700 mb-2 text-left">
                      🏫 School Name
                    </label>
                    <input
                      type="text"
                      name="school"
                      placeholder="Enter school name..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-sm font-medium text-primary-700 mb-2 text-left">
                      📅 Year
                    </label>
                    <select 
                      name="year"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200"
                    >
                      <option value="">Any year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="submit"
                      className="btn-primary h-[46px] w-full md:w-auto flex items-center justify-center px-6"
                    >
                      <FiSearch className="mr-2" />
                      Find Memories
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

            {/* Search Results Section */}
            {hasSearched && (
              <motion.div
                id="search-results"
                className="max-w-4xl mx-auto mb-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isSearching ? 'Searching...' : `Search Results (${searchResults.length})`}
                </h2>
                
                {isSearching ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((photo) => (
                      <motion.div
                        key={photo.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative h-48 bg-gray-200">
                          <Image
                            src={photo.imageUrl}
                            alt={photo.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{photo.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{photo.schoolName}</p>
                          <p className="text-xs text-gray-500 mb-3">Class of {photo.year}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{photo.description}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">by {photo.uploaderName}</span>
                            <button
                              onClick={() => router.push('/feed')}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <FiSearch className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No memories found</h3>
                    <p className="text-gray-500">Try searching with different criteria</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Decorative Elements */}
            <motion.div 
              className="flex justify-center items-center space-x-6 md:space-x-10 mb-20 text-4xl md:text-5xl opacity-60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                📚
              </motion.span>
              <motion.span 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                📸
              </motion.span>
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.2, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎓
              </motion.span>
              <motion.span 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3.7, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                🏫
              </motion.span>
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.3, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                📝
              </motion.span>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mt-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {featureItems.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  variants={itemVariants}
                  whileHover="hover"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-nostalgic font-bold mb-4 text-primary-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              className="mt-28 mb-16 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 md:p-10 max-w-4xl mx-auto text-white">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
                  <div className="absolute bottom-10 -left-10 w-60 h-60 bg-white rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 font-nostalgic">
                    Ready to rediscover your school days?
                  </h2>
                  <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                    Join thousands of others who have already reconnected with their school memories.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button 
                      onClick={handleUploadClick}
                      className="flex items-center justify-center px-8 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiUpload className="mr-2" />
                      Upload Memories
                    </motion.button>
                    
                    <motion.button 
                      onClick={handleBrowseSchools}
                      className="flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiBookOpen className="mr-2" />
                      Browse Schools
                    </motion.button>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-100">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
                        ))}
                      </div>
                      <span className="ml-3">+10,000 memories shared</span>
                    </div>
                    <div className="h-4 w-px bg-white/30"></div>
                    <div className="flex items-center">
                      <FiAward className="mr-2 text-yellow-300" />
                      Trusted by 500+ schools
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.main>
        <Footer />
      </div>
  )
}
