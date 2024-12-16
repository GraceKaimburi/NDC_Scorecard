"use client";
import { useDashboardData } from "@/store/DashboardContext";
import React,{useMemo} from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

export default function CapacityChart() {
	const {
		sessionData,
		stoppedSessionsWithAnalysis,
		setSelectedSection,
		sectorCapacityData,
		structuredData,
		historicalData,
		implementationData,
		developmentData,
		currentSectorCategory,
		cumulativeData
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
	return (
		<motion.div
			initial={{ x: -20, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ delay: 0.2 }}
			className="bg-white p-6 rounded-lg shadow-lg"
		>
			<h2 className="text-xl font-bold ">Overall Capacity Ratings</h2>
			<div className="h-72">
				<Bar data={chartData} options={dashboardChartOptions} />
			</div>
		</motion.div>
	);
}
