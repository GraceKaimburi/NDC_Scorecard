'use client'

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const carouselData = [
    {
      id: 'ndcs-overview',
      title: "What are NDCs?",
      description: "Nationally Determined Contributions (NDCs) are country-driven climate action plans. They outline national goals to reduce emissions and adapt to climate change as part of the Paris Agreement.",
      expandedContent: {
        title: "Understanding NDCs: A Framework for Climate Action",
        sections: [
          {
            title: "What are NDCs?",
            content: "Nationally Determined Contributions NDCs are the climate action plans that countries develop and implement to achieve the targets of the Paris Agreement. Each NDC outlines commitments to reduce greenhouse gas emissions and adapt to the impacts of climate change. These plans reflect national circumstances, priorities, and capabilities, creating a tailored roadmap for sustainable development.",
            link: {
              url: "https://unfccc.int/process-and-meetings/the-paris-agreement/nationally-determined-contributions-ndcs",
              text: "Read more from UNFCCC"
            }
          },
          {
            title: "Role in Climate Action",
            content: "NDCs are central to global efforts to address climate change. They provide a framework for nations to outline mitigation strategies, build resilience to climate impacts, and align development goals with low-carbon growth. By fostering collaboration and accountability, NDCs help bridge the gap between national actions and the global goal of limiting temperature increases to 1.5°C.",
            link: {
              url: "https://www.ipcc.ch/report/ar6/syr/",
              text: "Get more insights from the IPCC Report"
            }
          },
          {
            title: "NDCs and Paris Agreement",
            content: "As a cornerstone of the Paris Agreement, NDCs represent a collective commitment to limit global warming to below 2°C and pursue efforts to keep it within 1.5°C. Countries must update and enhance their NDCs every five years to reflect greater ambition and progress. This cycle of planning, implementation, and revision ensures continuous improvement and adaptation to emerging challenges. To support implementation, the Paris Agreement promotes collaboration in areas such as financing, capacity building, and technology transfer UN Climate Change.",
            link: {
              url: "https://unfccc.int/",
              text: "Read more about it from the UNFCCC"
            }
          }
        ]
      }
    },
    {
      id: 'tool-purpose',
      title: "How the Tool Helps You",
      description: "Nationally Determined Contributions (NDCs) are country-driven climate action plans. They outline national goals to reduce emissions and adapt to climate change as part of the Paris Agreement.",
      expandedContent: {
        title: "How the Tool Helps You",
        sections: [
          {
            title: "NDC Capacity Scorecard",
            content: "The NDC Capacity Scorecard transforms climate data into actionable insights, supporting countries in the effective development and implementation of their NDCs. This tool empowers stakeholders with resources and analytics to track progress, build capacity, and inform climate policies.",
          },
          {
            title: "Transforming Climate Data Into Actionable Insights",
            content: "Gain access to comprehensive climate datasets, visual analytics, and tailored metrics. These features simplify interpreting trends, evaluating resource allocation, and identifying gaps in NDC implementation, ensuring decisions are data-driven and impactful.",
          },
          {
            title: "Capacity-Building Support",
            content: "The tool offers training modules, collaborative platforms, and technical assistance to support institutional and local capacities for NDC-related work. Users can share resources and knowledge to align their efforts with climate action priorities.",
          },
          {
            title: "Key Features for Stakeholders",
            content: [
              "Real-Time Progress Tracking: Access up-to-date reports on sectoral climate action efforts.",
              "Highlight Gaps and Opportunities: Use visual dashboards to identify focus areas for policy or funding adjustments.",
              "Capacity-Building Resources: Equip teams with tools and guidance for effective NDC implementation.",
              "By empowering stakeholders with real-time data and advanced visualization tools, the NDC Capacity Scorecard ensures measurable progress toward sustainable development "
            ],

            link: {
              url: "https://unfccc.int/",
              text: "Related Sources"
            }
          },
        ]
      }
    },
    
    
    {
      id: 'benefits',
      title: "Tool Purpose",
      description: "Nationally Determined Contributions (NDCs) are country-driven climate action plans. They outline national goals to reduce emissions and adapt to climate change as part of the Paris Agreement.",
      expandedContent: {
        title: "Tool Purpose",
        sections: [
          {
            title: "NDC Capacity Scorecard",
            content: "The NDC Capacity Scorecard is a groundbreaking tool designed to assist stakeholders in achieving the development and implementation of Nationally Determined Contributions  NDCs). It simplifies the complex process of climate action by providing a centralized platform for tracking progress, identifying challenges, and accessing vital resources to enhance implementation efforts.",
          },
          {
            title: "Empowering Stakeholders Through Innovative Tools",
            content: "This tool supports governments, organizations, and individuals by simplifying the tracking of NDC implementation progress. It highlights key gaps and opportunities for improvement, promotes data accessibility, and fosters user engagement for impactful climate action.",
          },
          {
            title: "Key Tool Functionalities ",
            content: [
              "Monitoring Progress: Interactive dashboards for tracking NDC development and sectoral achievements.",
              "Identifying Gaps: Pinpoint areas requiring immediate attention in capacity, technology, and finance.",
              "Data Accessibility: Integrates local and global datasets for a comprehensive overview of climate action.",
              "Actionable Insights: Provides detailed analytics to align actions with national and global goals.",
              "By empowering stakeholders with real-time data and advanced visualization tools, the NDC Capacity Scorecard ensures measurable progress toward sustainable development"
            ],
          },
          {
            link: {
              url: "https://www.wri.org/ndcs",
              text: "Get more insights from World Resources Institute"
            }
          },
        ]
      }
    },
    // ... other carousel data items (not shown for brevity)
  ];

// Animation variants
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
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
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-8 space-y-6"
        variants={cardVariants}
        whileHover="hover"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200">
          {content.title}
        </h1>
        
        <div className="space-y-6">
          {content.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {section.title}
              </h2>
              {Array.isArray(section.content) ? (
                <ul className="space-y-3 mb-4 text-gray-600">
                  {section.content.map((item, itemIndex) => (
                    <li 
                      key={itemIndex} 
                      className="flex items-start"
                    >
                      <CheckCircle2 className="mr-3 mt-1 text-blue-500 flex-shrink-0" size={20} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {section.content}
                </p>
              )}
              {section.link && (
                <a 
                  href={section.link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out shadow-md"
                >
                  {section.link.text}
                </a>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}