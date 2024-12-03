import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-24 h-24 animate-spin rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-lg"></div>
    </div>
  );
};

export default Loading;