"use client";
import { Line } from "react-chartjs-2";

export function getSectorGraphs({
  sectors,
  historicalData,
  currentGraphIndex,
  lineChartOptions,
}) {
  const sectorGraphs = sectors.map((sector, index) => {
    const sectorData = {
      labels: historicalData.map((d) => {
        return d.date;
      }),
      datasets: [
        {
          label: sector,
          data: historicalData.map((d) => d[sector.toLowerCase()] || 0), // Added fallback to 0
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
        },
      ],
    };
    return (
      <div
        key={sector}
        className={`${index === currentGraphIndex ? "block" : "hidden"}`}
      >
        <h3 className="text-lg font-semibold mb-4">
          {sector} Historical Trend
        </h3>
        <div className="h-[400px]">
          <Line data={sectorData} options={lineChartOptions} />
        </div>
      </div>
    );
  });

  return sectorGraphs;
}
