import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CTABanner = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-8 mx-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-gray-900 mb-0 font-bold text-4xl md:text-5xl lg:text-[30px] text-center">
              Start tracking and improving your country&apos;s climate commitments today.
            </h1>

          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <Link 
              href="/register" 
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 2, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Get Started
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTABanner;