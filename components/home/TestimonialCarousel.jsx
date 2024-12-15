'use client'
import React, { useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "The NDC Scorecard has been instrumental in helping us track and improve our climate action commitments. It's an invaluable tool for policy makers.",
      author: "Sarah Chen",
      role: "Climate Policy Advisor",
      organization: "Environmental Protection Agency"
    },
    {
      quote: "The visualization tools and data insights have transformed how we approach climate action planning and implementation.",
      author: "Dr. Michael Roberts",
      role: "Environmental Scientist",
      organization: "Climate Research Institute"
    },
    {
      quote: "This platform has significantly improved our ability to monitor and report on climate action progress across different regions.",
      author: "Elena Martinez",
      role: "Sustainability Director",
      organization: "Global Climate Initiative"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg shadow-gray-400 p-8">
        <div className="relative h-64">
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl md:text-2xl text-gray-700 mb-6 italic">
                &quot;{testimonials[currentIndex].quote}&quot;
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">
                  {testimonials[currentIndex].author}
                </p>
                <p className="text-gray-600">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-gray-500">
                  {testimonials[currentIndex].organization}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-4 mt-4">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <AiOutlineLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <AiOutlineRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;