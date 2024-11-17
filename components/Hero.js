'use client'
import React, { useState, useEffect } from 'react';
import { FiChevronDown } from "react-icons/fi";

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const phrases = [
    'Climate Progress',
    'Accountability',
    'Positive Climate Action'
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
          setTypingSpeed(100);
        } else {
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        } else {
          setCurrentText(currentText.slice(0, -1));
          setTypingSpeed(50);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, typingSpeed]);

  const scrollToContent = () => {
    const viewportHeight = window.innerHeight * 0.7;
    const scrollOffset = Math.max(viewportHeight, 400);
    window.scrollTo({
      top: scrollOffset,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen overflow-hidden py-20">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/images/nature.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-60"
        aria-hidden="true"
      />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 px-4 mt-32">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          <span>Your Guide to </span>
          <span className="text-white">
            {currentText}
            <span className="animate-pulse inline-block align-bottom">|</span>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80">
          Track global climate commitments and see where improvements are needed, all in one place.
        </p>
      </div>

      <div className="relative z-10 mb-12 pt-4">
        <button
          onClick={scrollToContent}
          className="inline-flex flex-col items-center text-white hover:text-blue-300 transition-colors duration-200 animate-bounce"
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