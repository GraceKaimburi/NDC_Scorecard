import React from 'react';
import { FiDownload } from "react-icons/fi";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 px-4 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main heading with two-tone effect */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          The modern landing page for{' '}
          <span className="block mt-2 text-blue-500">
            React developers
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600">
          The easiest way to build a React landing page in seconds.
        </p>

        {/* CTA Button */}
        <button 
          className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 space-x-2"
        >
          <FiDownload className="w-5 h-5" />
          <span>Download Your Free Theme</span>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;