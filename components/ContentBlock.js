import React from 'react';
import Image from 'next/image';

const ContentBlock = ({ title, description, imagePath, alt, reverse = false }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-2">
      <div className={`flex flex-col-reverse ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between gap-1`}>
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {title}
          </h2>
          <div className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
            {typeof description === 'string' ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 bg-blue-50 rounded-full opacity-20 blur-3xl"></div>
            <Image
              src={imagePath}
              alt={alt}
              fill
              priority
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentBlock;