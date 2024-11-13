import HeroSection from "@/components/Hero";
import ContentBlock from "@/components/ContentBlock";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Image from "next/image";
import CTABanner from "@/components/CTABanner";

export default function Home() {
  const overviewContentData = [
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
    }
  ];
  const purposeContentData = [
    {
      title: "How NPCs Scorecard Helps You",
      description: "The NPC scorecard helps you by providing a clear, accessible overview of each country's climate action progress. It tracks and evaluates commitments in emissions reduction, adaptation, and resilience-building, highlighting gaps and achievements. This transparency enables governments, stakeholders, and the public to monitor accountability, compare efforts, and identify areas for improvement or collaboration.",
      imagePath: "/images/help.jpg",
      alt: "Rocket illustration"
    },
    {
      title: "Key Functionalities",
      description: (
        <div>
          <ol className="text-left">
            <li>1. Tracking Progress</li>
            <li>2. Data Visualization</li>
            <li>3. Accountability and Transparency</li>
            <li>4. Policy and Accountability Support</li>
          </ol>
        </div>
      ),
      imagePath: "/images/functions.jpg",
      alt: "Trophy illustration"
    },
    {
      title: "Identify Gaps and Track Progress",
      description: "The NPC scorecard helps users see gaps between climate goals and actions, tracking each country’s progress to highlight areas needing improvement and foster accountability.",
      imagePath: "/images/progress.jpg",
      alt: "Innovation illustration"
    }
  ];
  

  return (
    <div>
      <HeroSection />

      {/* Overview Section */}
      <section className="px-4">
        <h1 id="overview" className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Overview</h1>
        <div className="bg-white">
        {overviewContentData.map((content, index) => (
          <ContentBlock
            key={index}
            title={content.title}
            description={content.description}
            imagePath={content.imagePath}
            alt={content.alt}
            reverse={index % 2 !== 0}
          />
        ))}
        </div>
      </section>

      {/* Purpose Section */}
      <section className="px-4">
        <h1 id="purpose" className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Purpose</h1>
        <div className="bg-white">
        {purposeContentData.map((content, index) => (
          <ContentBlock
            key={index}
            title={content.title}
            description={content.description}
            imagePath={content.imagePath}
            alt={content.alt}
            reverse={index % 2 !== 0}
          />
        ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-12">
        <h1 id="benefits" className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Benefits
        </h1>
        <div className="bg-white max-w-7xl mx-auto">
          {/* Data Insights */}
          <div className="mb-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Data Insights
              </h2>
              <p className="text-lg text-gray-600">
                Access comprehensive analytics and visualizations that transform complex climate data into actionable insights. Our platform enables informed decision-making through detailed analysis of NDC implementations, progress tracking, and impact assessment.
              </p>
            </div>
          </div>

          {/* Capacity Building Support */}
          <div className="mb-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Capacity Building Support
              </h2>
              <p className="text-lg text-gray-600">
                Enhance your team&apo;s capability to implement and monitor climate actions effectively. Our platform provides resources, training materials, and best practices to strengthen institutional capacity for NDC implementation and reporting.
              </p>
            </div>
          </div>

          {/* User Testimonials */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
              User Testimonials
            </h2>
            <TestimonialCarousel />
          </div>
        </div>
      </section>


      {/* CTA Banner */}
      <CTABanner />


    </div>
  );
}
