"use client";
import React, { useEffect } from "react";
import ResultsModal from "@/components/Results";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	PointElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import AuthMiddleware from "@/middlewares/AuthMiddleware";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import DetailedView from "@/components/dashboard/DetailedView";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { QuestionModal } from "@/components/dashboard/QuestionModal";
import SavedSessionsModal from "@/components/dashboard/SavedSessionsModal";
import MaxWidth from "@/components/max-width";
import { useDashboardData } from "@/store/DashboardContext";
import { useParams } from "next/navigation";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	PointElement,
	Title,
	Tooltip,
	Legend
);

export default function CategoryDashboard() {
	const { selectedSection, setCurrentSectorCategory, isLoading } =
		useDashboardData();
	const { category } = useParams(); // This is the [category] from the path
	useEffect(() => {
		// currentSectorCategory,
		setCurrentSectorCategory(category);
	}, []);
	return (
		<AuthMiddleware>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="min-h-screen p-6"
			>
				{/* <MaxWidth> */}
				<DashboardHeader />

				<AnimatePresence mode="wait">
					{selectedSection ? (
						<DetailedView key="detailed" type={selectedSection} />
					) : (
						<MainDashboard key="main" />
					)}
				</AnimatePresence>

				<QuestionModal />
				<SavedSessionsModal />

				<ResultsModal />

				{isLoading && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
					</div>
				)}
				{/* </MaxWidth> */}
			</motion.div>
		</AuthMiddleware>
	);
}
