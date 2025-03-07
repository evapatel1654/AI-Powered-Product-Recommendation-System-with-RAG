import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2025 BakedBot.ai - AI-Powered Recommendations</p>
          </div>
          <div>
            <p>This is a prototype for demonstration purposes only</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
