'use client'
import React from 'react';
import { FiChevronDown } from "react-icons/fi";

const HeroSection = () => {
  const scrollToContent = () => {
    // Calculate scroll position to be just past the hero section
    const viewportHeight = window.innerHeight * 0.7; // 70vh of viewport
    const scrollOffset = Math.max(viewportHeight, 400); // minimum 400px scroll

    window.scrollTo({
      top: scrollOffset,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 px-4 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main heading with two-tone effect */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
        Your Guide to Climate Progress and Accountability
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600">
        Track global climate commitments and see where improvements are needed, all in one place.
        </p>

        {/* Scroll Down Button */}
        <button 
          onClick={scrollToContent}
          className="inline-flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors duration-200 animate-bounce"
          aria-label="Scroll down"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <FiChevronDown className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;