"use client";
import { useDashboardData } from "@/store/DashboardContext";
import { capitalize } from "@/utils/capitalize";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
export const DashboardHeader = () => {
	const {
		selectedSection,
		resumableSessions,
		setShowModal,
		handleCreateSession,
		handleResumeSession,
		setSelectedSection,
		currentSectorCategory
	} = useDashboardData();
	const resumableFirstSession = useMemo(() => {
		if (resumableSessions.actionType == "Resume") {
			return resumableSessions.onPause[0];
		}
		return null;
	}, [resumableSessions]);

	const resume = () => {
		// console.log("Resuming session:", resumableFirstSession.id);

		handleResumeSession(resumableFirstSession.id);
	};

	return (
		<motion.header
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className="mb-8 flex justify-between items-center"
		>
			{selectedSection ? (
				<button
					onClick={() => setSelectedSection(null)}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="text-lg font-medium">Back to Dashboard</span>
				</button>
			) : (
				<Link href={"/dashboard"} className="text-2xl font-bold text-blue-500 hover:underline">
					Dashboard <span className="">({capitalize(currentSectorCategory)} Capacity)</span>
				</Link>
			)}
			<div className="flex gap-2">
				{resumableSessions.actionType == "Resume" ? (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={resume}
						className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
						tour-selector="resume-assessment"
					>
						<motion.span
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 2, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							Resume Assessment
						</motion.span>
					</motion.button>
				) : (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							setShowModal(true);
							handleCreateSession();
						}}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
						tour-selector="new-assessment"
					>
						<motion.span
							initial={{ opacity: 0, x: 10 }}
							animate={{ opacity: 2, x: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							New Assessment
						</motion.span>
					</motion.button>
				)}
			</div>
		</motion.header>
	);
};
