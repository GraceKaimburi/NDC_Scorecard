/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['ndcbackend.agnesafrica.org'],
    },
    experimental: {
      serverActions: {
        enabled: true
      }
    }
  };
  
  export default nextConfig;
