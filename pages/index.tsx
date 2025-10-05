import Head from 'next/head'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'

export default function Home() {
  return (
    <>
      <Head>
        <title>BatchBook - Your school memories, preserved forever.</title>
        <meta name="description" content="Discover and share precious school memories from yearbooks, photos, and more with BatchBook" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-nostalgic font-bold text-primary-800 mb-6">
                BatchBook
              </h1>
              
              <p className="text-2xl md:text-3xl text-primary-600 font-medium mb-4">
                Your school memories, preserved forever.
              </p>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Rediscover the joy of school days through yearbooks, class photos, and shared memories. 
                Search by school and year to find your precious moments.
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto mb-20">
              <SearchBar />
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center items-center space-x-8 mb-16 text-4xl opacity-60">
              <span>📚</span>
              <span>📸</span>
              <span>🎓</span>
              <span>🏫</span>
              <span>📝</span>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="card text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-primary-300 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-nostalgic font-bold mb-4 text-primary-800">Find Your School</h3>
                <p className="text-gray-600 leading-relaxed">
                  Search through thousands of schools and years to find your specific yearbook and class memories.
                </p>
              </div>

              <div className="card text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💾</span>
                </div>
                <h3 className="text-xl font-nostalgic font-bold mb-4 text-primary-800">Preserve Forever</h3>
                <p className="text-gray-600 leading-relaxed">
                  Upload and preserve your school photos, yearbooks, and memories in high quality for future generations.
                </p>
              </div>

              <div className="card text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-200 to-accent-300 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-nostalgic font-bold mb-4 text-primary-800">Share & Connect</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share your memories with classmates and discover photos you never knew existed from your school days.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-3xl p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-nostalgic font-bold text-primary-800 mb-4">
                  Ready to rediscover your school days?
                </h2>
                <p className="text-primary-600 mb-6">
                  Start your search above or upload your own memories to share with the community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-primary">
                    <span className="mr-2">📤</span>
                    Upload Memories
                  </button>
                  <button className="btn-secondary">
                    <span className="mr-2">📖</span>
                    Browse Schools
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
