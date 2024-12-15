"use client";
import useFetch from "@/hooks/useFetch";
import { useDashboardData } from "@/store/DashboardContext";
import { isResponseOk } from "@/utils/is-response-ok";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { getSectorGraphs } from "./getSectorGraphs";

export default function DetailedView() {
  const { privateAPI } = useFetch();
  const [historicalData, setHistoricalData] = useState([]);
  const {
    selectedSection: type,
    sectors,
    currentGraphIndex,
    lineChartOptions,
    setCurrentGraphIndex,
    barChartData,
    barChartOptions,
  } = useDashboardData();
  // const detailedData = getDetailedData(type);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await privateAPI.get(
          `/api/session/` // Removed 'analyses'
        );
        if (!isResponseOk(response))
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = response.data;
        // console.log("Historical Data:", data); // For debugging

        // Check if data exists and has the expected structure
        if (data && Array.isArray(data)) {
          const formatted = data
          .filter(({ session_status }) => session_status === "Stop")
          .map(({sector_analyses}) => sector_analyses || {});
          // Access the analysis field correctly
          console.log("Data structure is valid:", { formatted });
          setHistoricalData(formatted);
        } else {
          console.error("Invalid data structure received:", data);
          setHistoricalData([]);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setHistoricalData([]);
      }
    };

    fetchHistoricalData();
  }, [type]);
  const barchatInfo = useMemo(() => {
    return barChartData(type);
    // return {
    //   labels: Array.isArray(labels) ? labels : [],
    //   data_sets: Array.isArray(data_sets) ? data_sets : [],
    // };
  }, [type]);


  console.log({ historicalData });

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Current Ratings</h3>
            <div className="h-[400px]">
              <Bar data={barchatInfo} options={barChartOptions} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="relative">
              {getSectorGraphs({
                sectors,
                currentGraphIndex,
                historicalData,
                lineChartOptions,
              })}
              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                <button
                  onClick={() =>
                    setCurrentGraphIndex(
                      (prev) => (prev - 1 + sectors.length) % sectors.length
                    )
                  }
                  className="p-2 bg-white rounded-full shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                <button
                  onClick={() =>
                    setCurrentGraphIndex((prev) => (prev + 1) % sectors.length)
                  }
                  className="p-2 bg-white rounded-full shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
