"use client";
import useFetch from "@/hooks/useFetch";
import AuthMiddleware from "@/middlewares/AuthMiddleware";
import { isResponseOk } from "@/utils/is-response-ok";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SectorCapacityCards } from "./SectorCapacityCards";
import { capitalize } from "@/utils/capitalize";
import { getRatingColor } from "@/utils/getRatingColor";
import { motion } from "framer-motion";
import { useDashboardData } from "@/store/DashboardContext";
import { Bar } from "react-chartjs-2";
import { RecommendationSection } from "@/app/(user)/dashboard/RecommendationSection";
import { ratingToNumber } from "@/utils/ratingToNumber";
import { numberToRating } from "@/utils/numberToRating";
import { getCategoryIcon } from "./getCategoryIcon";

export const MainDashboard = () => {
  const { privateAPI } = useFetch();
  const {
    sessionData,
    stoppedSessionsWithAnalysis,
    setSelectedSection,
    sectorCapacityData,
    structuredData,
    historicalData,
    implementationData,
    developmentData,
  } = useDashboardData();

  const dashboardChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        max: 100,
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataIndex = context.dataIndex;
            const dataset = context.chart.data.labels[dataIndex];
            const dataValue = context.dataset.data[dataIndex];
            // return dataset ? `Rating: ${dataset}(${dataValue})` : '';
            return dataset ? `Rating: ${dataValue}` : "";
          },
        },
      },
    },
  };
  const cumulativeData = [
    {
      category: "Finance",
      value:
        ratingToNumber(implementationData.finance) +
        ratingToNumber(developmentData.finance),
      displayRating: numberToRating(
        ratingToNumber(implementationData.finance) +
          ratingToNumber(developmentData.finance)
      ),
    },
    {
      category: "Technical",
      value:
        ratingToNumber(implementationData.technical) +
        ratingToNumber(developmentData.technical),
      displayRating: numberToRating(
        ratingToNumber(implementationData.technical) +
          ratingToNumber(developmentData.technical)
      ),
    },
    {
      category: "Governance",
      value:
        ratingToNumber(implementationData.governance) +
        ratingToNumber(developmentData.governance),
      displayRating: numberToRating(
        ratingToNumber(implementationData.governance) +
          ratingToNumber(developmentData.governance)
      ),
    },
    {
      category: "M&E",
      value:
        ratingToNumber(implementationData.monitoring) +
        ratingToNumber(developmentData.monitoring),
      displayRating: numberToRating(
        ratingToNumber(implementationData.monitoring) +
          ratingToNumber(developmentData.monitoring)
      ),
    },
  ];

  // const chartData = {
  //   labels: cumulativeData.map((d) => d.category),
  //   datasets: [
  //     {
  //       data: cumulativeData.map((d) => d.value),
  //       backgroundColor: "#3B82F6",
  //       borderRadius: 6,
  //       label: "Rating",
  //     },
  //   ],
  // };
  const chartData = useMemo(() => {
    const { overall_sector_scores } = stoppedSessionsWithAnalysis;
    // console.log({ overall_sector_scores });
    if (!overall_sector_scores) {
      return {
        labels: cumulativeData.map((d) => d.category),
        datasets: [
          {
            data: cumulativeData.map((d) => d.value),
            backgroundColor: "#3B82F6",
            borderRadius: 6,
            label: "Rating",
          },
        ],
      };
    } else {
      return {
        labels: overall_sector_scores.map((d) => d.sector),
        datasets: [
          {
            data: overall_sector_scores.map((d) => d.total_score),
            backgroundColor: "#3B82F6",
            borderRadius: 6,
            label: "Rating",
          },
        ],
      };
    }
  }, [stoppedSessionsWithAnalysis]);

  // console.log({ structuredData });

  return (
    <AuthMiddleware>
      <SectorCapacityCards data={sectorCapacityData} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-2"
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4">Overall Capacity Ratings</h2>
          <div className="h-72">
            <Bar data={chartData} options={dashboardChartOptions} />
          </div>
        </motion.div>
        {Object.keys(structuredData).length < 1 ? (
          <div className="grid grid-rows-2 gap-2">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSection("implementation")}
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-4">Implementation</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(implementationData).map(
                  ([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      {getCategoryIcon(key)}
                      <p className={`text-sm ${getRatingColor(value)}`}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSection("development")}
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-4">Development</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(developmentData).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    {getCategoryIcon(key)}
                    <p className={`text-sm ${getRatingColor(value)}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-rows-2 gap-2">
           
            {Object.entries(structuredData).map(([parentKey, parentValue]) => (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={parentKey}
                onClick={() => setSelectedSection(parentKey)}
                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4">
                  {capitalize(parentKey)} Capacity
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(parentValue).map(([key, objVal], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <objVal.Icon className="w-5 h-5" />
                      <p className={`text-sm ${getRatingColor(objVal.label)}`}>
                        {capitalize(key)}: {objVal.score}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <RecommendationSection className={"col-span-2"} />
      </motion.div>
    </AuthMiddleware>
  );
};
