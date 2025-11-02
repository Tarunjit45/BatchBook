import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiMail, FiLinkedin } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>About - BatchBook</title>
        <meta name="description" content="Learn more about BatchBook - Preserving school memories forever" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-6">About BatchBook</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              BatchBook is a digital memory vault designed to preserve school and college memories for generations to come. 
              Our mission is to create a permanent, searchable archive of yearbooks, class photos, and shared memories.
            </p>

            <h2 className="text-2xl font-semibold text-primary-700 mt-8 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Founded in 2025, BatchBook was created to solve the problem of lost or damaged physical yearbooks and photos. 
              We believe that these precious memories should be preserved and easily accessible to everyone who was part of those special moments.
            </p>

            <h2 className="text-2xl font-semibold text-primary-700 mt-8 mb-4">Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Search and browse school memories by name, year, or location</li>
              <li>Upload and share your own photos and yearbooks</li>
              <li>Connect with former classmates</li>
              <li>High-quality digital preservation of your memories</li>
              <li>Secure and private storage options</li>
            </ul>

            <h2 className="text-2xl font-semibold text-primary-700 mt-8 mb-4">Credits</h2>
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-3">Special Thanks</h3>
              <p className="text-gray-700 mb-2">
                This project was inspired and guided by <span className="font-semibold text-primary-700">Prof. Parag Chatterjee</span>,
                whose vision and mentorship made BatchBook possible.
              </p>
              <p className="text-sm text-gray-600 italic">
                Thank you for encouraging innovation and providing the idea to preserve memories digitally.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-primary-700 mt-8 mb-4">Developer</h2>
            <div className="border-l-4 border-primary-600 pl-6 py-4 bg-gray-50 rounded">
              <p className="text-lg font-semibold text-gray-900 mb-2">Tarunjit Biswas</p>
              <p className="text-gray-700 mb-4">
                Full-stack developer passionate about building meaningful applications that preserve memories and connect people.
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:tarunjitbiswas24@gmail.com"
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FiMail className="mr-2" />
                  tarunjitbiswas24@gmail.com
                </a>
                <a 
                  href="https://www.linkedin.com/in/tarunjit-biswas-a5248131b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FiLinkedin className="mr-2" />
                  Connect on LinkedIn
                </a>
              </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="text-sm text-gray-700">
                <strong>Copyright Notice:</strong> This application and its source code are protected by copyright.
                Unauthorized copying, distribution, or reproduction is strictly prohibited.
              </p>
              <p className="text-xs text-gray-600 mt-2">
                © {new Date().getFullYear()} Tarunjit Biswas. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
