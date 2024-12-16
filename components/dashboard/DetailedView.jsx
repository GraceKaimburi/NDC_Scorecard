"use client";
import useFetch from "@/hooks/useFetch";
import { useDashboardData } from "@/store/DashboardContext";
import { isResponseOk } from "@/utils/is-response-ok";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { GetSectorGraphs } from "./getSectorGraphs";
import moment from "moment";

export default function DetailedView() {
  const { privateAPI } = useFetch();
  /**@type {import("@/types/react").ReactUseStateType<import("@/types").SessionDataType[]>} */
  const [historicalData, setHistoricalData] = useState([]);
  const {
    selectedSection,
    sectors,
    currentGraphIndex,
    lineChartOptions,
    setCurrentGraphIndex,
    barChartData,
    // barChartOptions,
  } = useDashboardData();
  // const detailedData = getDetailedData(selectedSection);
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        ticks: {
          stepSize: 1,

        },
      },
      x: {
        grid: {
          display: true,

        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      // tooltip: {
      //   callbacks: {
      //     label: function (context) {
      //       console.log({ context });

      //       const dataIndex = context.dataIndex;
      //       // return `Rating: ${context.dataset.data[dataIndex].label}`;
      //       const dataset = context.chart.data.labels[dataIndex];
      //       const dataValue = context.dataset.data[dataIndex];
      //       return dataset ? `Rating: ${dataValue}` : "";
      //     },
      //   },
      // },
    },
  };

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
          const formatted = data.filter(({ session_status }) =>
            ["Stop", "PartialStop"].includes(session_status)
          );
          // .map(({sector_analyses}) => sector_analyses || {});
          // Access the analysis field correctly
          console.log("Data structure is valid:", { formatted });
          if (formatted.length === 0) return setHistoricalData([]);
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
  }, [selectedSection]);
  const barchatInfo = useMemo(() => {
    if (!historicalData.length)
      return {
        analysis: [],
        currentAnalysis: {
          labels: [],
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: "#3B82F6",
              borderRadius: 6,
            },
          ],
        },
      };
    // return barChartData(selectedSection);
    const analysis = historicalData
      .sort((a, b) => new Date(b.session_date) - new Date(a.session_date))
      .flatMap(({ analyses: { sector_analyses }, session_date }) => {
        const session = sector_analyses.map((an) => {
          const [category, sector] = an.sector.split("-");
          const date = moment(session_date).format("MM/DD");
          const [sectorCategory] = category.split(" ");
          return {
            ...an,
            sector: sector.trim(),
            category: sectorCategory.toLowerCase(),
            session_date: date,
          };
        });
        return {
          session_date: moment(session_date).toISOString(),
          analysis: session.filter(
            ({ category }) => category === selectedSection
          ),
        };
      });
    const currentAnalysis = analysis[0];
    const standardData = {
      labels: currentAnalysis.analysis.map((d) => d.sector),
      datasets: [
        {
          label: selectedSection,
          data: currentAnalysis.analysis.flatMap((d) => d.score),
          backgroundColor: "#3B82F6",
          borderRadius: 6,
        },
      ],
    };
    return { analysis, currentAnalysis: standardData };
  }, [selectedSection, historicalData]);

  // console.log({ barchatInfo });

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
              <Bar
                data={barchatInfo.currentAnalysis}
                options={barChartOptions}
                className="h-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="relative">
              {GetSectorGraphs({
                sectors,
                currentGraphIndex,
                historicalData,
                lineChartOptions,
                data: barchatInfo.analysis,
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
