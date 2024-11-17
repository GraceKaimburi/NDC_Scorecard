import React from 'react';
import Link from 'next/link';

const CTABanner = () => {
  return (
    <section className="bg-[#f0f9ff] py-8 mx-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            {/* <h2 className="text-2xl text-gray-900 font-semibold mb-2">
              Join the Global Climate Action Community
            </h2> */}
            <p className="text-gray-900 mb-0 font-semibold">
              Start tracking and improving your country&apos;s climate commitments today.
            </p>
          </div>
          
          <Link 
            href="/register" 
            className="inline-flex items-center px-6 py-3 bg-[#00a6ff] text-white font-medium text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;