"use client";
import { useDashboardData } from "@/store/DashboardContext";
import { getRatingColor } from "@/utils/getRatingColor";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { Activity } from "lucide-react";
import { Settings } from "lucide-react";
import { ChartBar } from "lucide-react";
export const SectorCapacityCards = ({ data }) => {
  const { implementationData, developmentData } = useDashboardData();
  const sectors = [
    { name: "Finance", icon: ChartBar },
    { name: "Technical", icon: Settings },
    { name: "Governance", icon: ClipboardList },
    { name: "Monitoring", icon: Activity },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Object.keys(data).length === 0
        ? sectors.map((sector) => {
            const Icon = sector.icon;
            const key = sector.name.toLowerCase();
            return (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">{sector.name} capacity</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Implementation:{" "}
                    </span>
                    <span
                      className={`text-sm font-medium ${getRatingColor(
                        implementationData[key]
                      )}`}
                    >
                      {implementationData[key]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Development:</span>
                    <span
                      className={`text-sm font-medium ${getRatingColor(
                        developmentData[key]
                      )}`}
                    >
                      {developmentData[key]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        : Object.keys(data).map((sectorKey) => {
            const sector = data[sectorKey];
            const Icon = sector.Icon;

            return (
              <motion.div
                key={sectorKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">
                    {sectorKey === "Monitoring and Evaluation"
                      ? "M&E"
                      : sectorKey} Capacity
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Implementation:
                    </span>
                    <span
                      className={`text-sm font-medium ${getRatingColor(
                        sector.implementation.label
                      )}`}
                    >
                      {sector.implementation.score} (
                      {sector.implementation.label})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Development:</span>
                    <span
                      className={`text-sm font-medium ${getRatingColor(
                        sector.development.label
                      )}`}
                    >
                      {sector.development.score} ({sector.development.label})
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
    </div>
  );
};
