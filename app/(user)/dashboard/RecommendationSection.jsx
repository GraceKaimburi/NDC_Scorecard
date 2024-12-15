"use client";
import {
  resourceLinks,
  transformResourceLinksToSelectOptions,
} from "@/data/resource-links";
import { useDashboardData } from "@/store/DashboardContext";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";


export const RecommendationSection = ({ className }) => {
  const { structuredData } = useDashboardData();

  const sectorGroupedData = useMemo(() => {
    const MIN_RATING = "Poor";
    const implementation = structuredData?.["implementation"] ?? {};
    const development = structuredData?.["development"] ?? {};
    const implementationSectores = Object.keys(implementation);
    const developmentSectores = Object.keys(development);

    const combinedSectors = [...implementationSectores, ...developmentSectores];

    const sectorGroupedData = combinedSectors.reduce((acc, sector) => {
      const implementationRating = implementation[sector].score ?? 0;
      const developmentRating = development[sector].score ?? 0;
      const rating = Math.min(implementationRating, developmentRating);
      const selectedPoorest =
        rating === implementationRating ? "implementation" : "development";
      const hasPoorRating =
        implementation[sector].label === MIN_RATING ||
        development[sector].label === MIN_RATING;

      if (!acc[sector] && hasPoorRating) {
        const { label, score } =
          selectedPoorest === "implementation"
            ? implementation[sector]
            : development[sector];
        acc[sector] = { label, score };
      }

      return acc;
    }, {});

    return Object.keys(sectorGroupedData);
  }, [structuredData]);
  const resources = useMemo(() => {
    return transformResourceLinksToSelectOptions(sectorGroupedData);
  }, [sectorGroupedData]);
  return sectorGroupedData.length === 0 ? null : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={cn("mt-6 bg-white rounded-lg shadow-lg p-6", className)}
    >
      <h2 className="text-xl font-bold mb-4 underline">Recommended Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sectorGroupedData.map((sector) => (
          <div key={sector} className="space-y-4">
            <h3 className="text-lg font-medium capitalize">
              {sector === "monitoring" ? "M&E" : sector} Resources
            </h3>
            <div className="space-y-2">
              {resources[sector]
                ?.slice(0, sectorGroupedData.length === 1 ? 3 : 1)
                .map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {link.title}
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
