'use client'

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

const carouselData = [
    {
      id: 'ndcs-overview',
      title: "What are NDCs?",
      description: "Nationally Determined Contributions (NDCs) are country-driven climate action plans. They outline national goals to reduce emissions and adapt to climate change as part of the Paris Agreement.",
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
      description: "The NDC Scorecard offers a clear way to track climate progress. It highlights gaps, achievements, and actionable insights for policymakers, stakeholders, and the public.",
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
      description: "Gain access to valuable data insights, track sectoral progress, and receive capacity-building resources to accelerate climate action effectively.",
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

// Animation variants for the container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// Animation variants for the title
const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Animation variants for the sections
const sectionVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function ExpandedContent() {
  const params = useParams();
  const content = carouselData.find(item => item.id === params.id)?.expandedContent;

  if (!content) {
    return <div>Content not found</div>;
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-4xl font-bold text-gray-900 mb-8"
        variants={titleVariants}
      >
        {content.title}
      </motion.h1>
      
      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <motion.section 
            key={index} 
            className="bg-white rounded-lg shadow-lg p-6"
            variants={sectionVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {section.content}
            </p>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}