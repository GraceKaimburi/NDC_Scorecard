"use client";
import AuthMiddleware from "@/middlewares/AuthMiddleware";
import { SectorCapacityCards } from "./SectorCapacityCards";
import { motion } from "framer-motion";
import { useDashboardData } from "@/store/DashboardContext";
import { RecommendationSection } from "@/app/(user)/dashboard/RecommendationSection";
import CapacityGroup from "./CapacityGroup";
import CapacityChart from "./CapacityChart";

export const MainDashboard = () => {
	const { sectorCapacityData } = useDashboardData();

	return (
		<AuthMiddleware>
			<SectorCapacityCards data={sectorCapacityData} />
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="grid grid-cols-1 lg:grid-cols-2 gap-2"
			>
				<CapacityChart />
				<CapacityGroup />
				<RecommendationSection className={"col-span-2"} />
			</motion.div>
		</AuthMiddleware>
	);
};
