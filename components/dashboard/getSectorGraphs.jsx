"use client";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
/**
 *
 * @param {{data:import("@/types").SesctorGraphDataAnalysisType[]}} param0
 * @returns
 */

export function GetSectorGraphs({
	sectors,
	historicalData,
	currentGraphIndex,
	lineChartOptions,
	data,
}) {
	// return <> </>;
	const processed = useMemo(() => {
		return data.flatMap((d) => {
			return d.analysis;
		});
	}, [data]);
	const sectorGraphs = sectors.map((sector, index) => {
		const sectorData = {
			labels: processed.map((d) => {
				return d.session_date;
			}),
			datasets: [
				{
					label: sector,
					data: processed
						.map((g) => ({ [g.sector]: g.score }))
						.map((d) => d[sector.toLowerCase()] || 0), // Added fallback to 0
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
