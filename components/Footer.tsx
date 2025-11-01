import { FiMail, FiLinkedin, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Copyright */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">BatchBook</h3>
            <p className="text-sm mb-4">
              Your school memories, preserved forever.
            </p>
            <p className="text-sm text-gray-400">
              © {currentYear} BatchBook. All rights reserved.
            </p>
          </div>

          {/* Right Section - Developer Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">Developed By</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-white font-medium">Tarunjit Biswas</span>
              </p>
              <div className="flex items-center space-x-4">
                <a 
                  href="mailto:tarunjitbiswas24@gmail.com"
                  className="flex items-center text-sm hover:text-primary-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiMail className="mr-2" />
                  tarunjitbiswas24@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.linkedin.com/in/tarunjit-biswas-a5248131b/"
                  className="flex items-center text-sm hover:text-primary-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiLinkedin className="mr-2" />
                  LinkedIn Profile
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-4 flex items-center">
                <FiHeart className="mr-1 text-red-500" />
                Made with passion for preserving memories
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-xs text-gray-500">
            Developed and maintained by Tarunjit Biswas. Unauthorized copying or distribution is prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
}
