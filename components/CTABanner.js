import React from 'react';
import Link from 'next/link';

const CTABanner = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Global Climate Action Community
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Start tracking and improving your country&apos;s climate commitments today. Get access to powerful tools, real-time analytics, and connect with climate action leaders worldwide.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              href="/register" 
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-md"
            >
              Register
            </Link>
            <p className="text-blue-100 mt-4 text-sm">
              Join over 1000+ organizations already using NDC Scorecard
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;