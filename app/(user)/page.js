'use client'
import HeroSection from "@/components/Hero";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Image from "next/image";
import CTABanner from "@/components/CTABanner";
import { useState, useEffect } from 'react';
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";

const Carousel = ({ title, data }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [data.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        {title}
      </h1>

      <div className="relative overflow-hidden rounded-lg shadow-lg bg-white">
        <div className="relative h-full">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`
            }}
          >
            <div className="flex">
              {data.map((content, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 p-6 md:p-8"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/2">
                      <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
                      <div className="text-gray-600">{content.description}</div>
                    </div>
                    <div className="md:w-1/2">
                      <Image
                        src={content.imagePath}
                        alt={content.alt}
                        width={500}
                        height={300}
                        className="rounded-lg shadow-md w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handlePrevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors"
          aria-label="Previous slide"
        >
          <IoChevronBackCircle className="w-8 h-8" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors"
          aria-label="Next slide"
        >
          <IoChevronForwardCircle className="w-8 h-8" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeSlide === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const mergedCarouselData = [
    {
      title: "What are NDCs?",
      description: "Nationally Determined Contributions (NDCs) are climate action plans by countries under the Paris Agreement, detailing targets to reduce emissions and adapt to climate change. They are updated periodically to increase ambition and track global progress toward climate goals.",
      imagePath: "/images/whatndc.jpg",
      alt: "Rocket illustration"
    },
    {
      title: "Role in Climatic action",
      description: "NDCs drive global climate action by setting national targets for reducing emissions and adapting to climate impacts, fostering accountability, and encouraging collective progress toward limiting global warming.",
      imagePath: "/images/role.jpg",
      alt: "Trophy illustration"
    },
    {
      title: "NDCs and Paris Agreement",
      description: "NDCs are climate plans submitted by countries under the Paris Agreement, detailing emissions reduction and adaptation targets to limit global warming to 1.5–2°C. Updated every five years, they form a core part of the Agreement's approach, fostering global accountability and climate action.",
      imagePath: "/images/agreement.jpg",
      alt: "Innovation illustration"
    },
    {
      title: "How NPCs Scorecard Helps You",
      description: "The NPC scorecard helps you by providing a clear, accessible overview of each country's climate action progress. It tracks and evaluates commitments in emissions reduction, adaptation, and resilience-building, highlighting gaps and achievements. This transparency enables governments, stakeholders, and the public to monitor accountability, compare efforts, and identify areas for improvement or collaboration.",
      imagePath: "/images/help.jpg",
      alt: "Rocket illustration"
    },
    {
      title: "Identify Gaps and Track Progress",
      description: "The NPC scorecard helps users see gaps between climate goals and actions, tracking each country's progress to highlight areas needing improvement and foster accountability.",
      imagePath: "/images/progress.jpg",
      alt: "Innovation illustration"
    }
  ];

  return (
    <div>
      <HeroSection />

      {/* Merged Carousel */}
      {/* <section id="overview-and-purpose">
        <Carousel title="Overview & Purpose" data={mergedCarouselData} />
      </section> */}
      
      {/* Discover the Tool Section */}
      <section id="discover" className="max-w-6xl mx-auto px-4 py-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Discover the Tool
        </h2>
        <p className="text-gray-600">
          The NDC Scorecard is your gateway to tracking global climate action. This user-friendly platform provides insights into Nationally Determined Contributions (NDCs), offering data-driven visuals, performance metrics, and comparisons. Whether you&apos;re a policymaker, researcher, or advocate, explore the tool to support informed decisions and drive sustainability efforts.
        </p>
      </section>

      {/* Key Functionalities Section */}
      <section id="key-functionalities" className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Key Functionalities
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <ol className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <span className="font-bold mr-2">1.</span>
                  Tracking Progress: Monitor and evaluate climate action implementation
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">2.</span>
                  Data Visualization: Clear presentation of complex climate data
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">3.</span>
                  Accountability and Transparency: Foster open reporting and verification
                </li>
                <li className="flex items-center">
                  <span className="font-bold mr-2">4.</span>
                  Policy and Accountability Support: Guide decision-making and ensure compliance
                </li>
              </ol>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/images/functions.jpg"
                alt="Key functionalities illustration"
                width={500}
                height={300}
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      {/* <div id="testimonials">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          User Testimonials
        </h2>
        <TestimonialCarousel />
      </div> */}

      {/* CTA Banner */}
      <CTABanner />
    </div>
  );
}