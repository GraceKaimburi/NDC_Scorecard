'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/Hero';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import CTABanner from '@/components/home/CTABanner';

const carouselData = [ 
  {
    id: 'ndcs-overview',
    title: "What are NDCs?",
    description: "Nationally Determined Contributions (NDCs) are country-driven commitments to develop and implement climate action plans. These plans aim to reduce emissions and build resilience to climate change under the Paris Agreement.",
    imagePath: "/images/whatndc.jpg",
    alt: "NDCs Overview Illustration",
    expandedContent: {
      title: "Understanding NDCs: A Framework for Climate Action",
      sections: [
        {
          title: "What are NDCs?",
          content: "Nationally Determined Contributions (NDCs) are climate action plans that each country develops to meet the goals of the Paris Agreement. These plans outline targets for reducing greenhouse gas emissions and adapting to climate impacts, reflecting national priorities and capabilities."
        },
        {
          title: "Role in Climate Action",
          content: "NDCs play a critical role in uniting global efforts to combat climate change by providing a roadmap for emission reduction, enhancing resilience and adaptive capacity, and promoting sustainable development goals through low-carbon strategies."
        },
        {
          title: "NDCs and Paris Agreement",
          content: "Under the Paris Agreement, countries commit to limiting global warming to below 2°C and aiming for 1.5°C, updating NDCs every five years to reflect increased ambition, and collaborating on technology, finance, and capacity-building to support implementation."
        }
      ]
    }
  },
  {
    id: 'tool-purpose',
    title: "How the Tool Helps You",
    description: "The NDC Capacity Scorecard empowers you to measure progress in the development and implementation of NDCs. It provides a structured approach to identify achievements, address challenges, and drive impactful climate action for policymakers, stakeholders, and the public.",
    imagePath: "/images/help.jpg",
    alt: "Tool Purpose Illustration",
    expandedContent: {
      title: "Empowering Stakeholders Through Innovative Tools",
      sections: [
        {
          title: "How the Tool Helps Users",
          content: "Our tool supports governments, organizations, and individuals by simplifying the tracking of NDC implementation progress, highlighting key gaps and opportunities for improvement, and enhancing data accessibility and user engagement."
        },
        {
          title: "Key Tool Functionalities",
          content: "The platform offers interactive dashboards for data visualization, real-time reporting on climate action progress, and integration of local and global climate datasets."
        },
        {
          title: "Identify Gaps and Track Progress",
          content: "Easily pinpoint areas needing urgent attention, compare sectoral progress against targets, access detailed analytics on resource allocation, and measure effectiveness of climate policies and actions."
        }
      ]
    }
  },
  {
    id: 'benefits',
    title: "Why Use This Tool?",
    description: "Get actionable insights to support the development and implementation of NDCs. Track progress across sectors, identify capacity gaps, and access resources to strengthen climate initiatives.",
    imagePath: "/images/progress.jpg",
    alt: "Benefits Illustration",
    expandedContent: {
      title: "Transforming Climate Data Into Actionable Insights",
      sections: [
        {
          title: "Data Insights",
          content: "Gain access to comprehensive climate datasets, visual analytics for easier interpretation of trends, and key metrics to inform decision-making and policy adjustments."
        },
        {
          title: "Capacity-Building Support",
          content: "Enhance institutional capacity through training modules for understanding NDCs, resource-sharing platforms for collaboration, and technical support for local and regional stakeholders."
        },
        {
          title: "User Testimonials",
          content: "'This platform revolutionized how we track our NDC goals.' - Climate Officer, Kenya\n'A game-changer for capacity-building efforts!' - NGO Representative"
        }
      ]
    }
  }
];

// Animation variants for the blinking button
const blinkingButtonVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

export const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section>
      <HeroSection />
      <motion.div
        id='overview'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        className="relative max-w-6xl mx-auto px-4 py-12"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8"
        >
          Overview 
        </motion.h1>

        <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
          <div className="relative h-full">
            <motion.div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              <div className="flex">
                {carouselData.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 2 }}
                        className="md:w-1/2"
                      >
                        <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                        <p className="text-gray-600 mb-4 text-lg">{slide.description}</p>
                        <motion.div
                          variants={blinkingButtonVariants}
                          initial="initial"
                          animate="animate"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            href={`/expanded/${slide.id}`}
                            // target="_blank"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Read More
                          </Link>
                        </motion.div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1, duration: 2 }}
                        className="md:w-1/2 mx-auto"
                      >
                        <Image
                          src={slide.imagePath}
                          alt={slide.alt}
                          width={500}
                          height={300}
                          className="rounded-lg w-full h-64 object-contain"
                        />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="Previous slide"
          >
            <IoChevronBackCircle className="w-8 h-8" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors"
            aria-label="Next slide"
          >
            <IoChevronForwardCircle className="w-8 h-8" />
          </motion.button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselData.map((_, index) => (
              <motion.button
                key={index}
                initial={false}
                animate={{
                  scale: activeSlide === index ? 1.2 : 1,
                  backgroundColor: activeSlide === index ? "#2563EB" : "#D1D5DB"
                }}
                whileHover={{ scale: 1.2 }}
                onClick={() => setActiveSlide(index)}
                className="w-2 h-2 rounded-full transition-colors"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div id="testimonials">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          {/* User Testimonials */}
        </h2>
        {/* <TestimonialCarousel /> */}
      </div>

      <CTABanner />
    </section>
  );
};

export default Carousel;