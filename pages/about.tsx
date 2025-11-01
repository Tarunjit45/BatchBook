import Head from 'next/head';
import Header from '@/components/Header';

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
              Founded in 2023, BatchBook was created to solve the problem of lost or damaged physical yearbooks and photos. 
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

            <h2 className="text-2xl font-semibold text-primary-700 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              Have questions or feedback? We'd love to hear from you!<br />
              Email us at: <a href="mailto:contact@batchbook.app" className="text-primary-600 hover:underline">contact@batchbook.app</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
