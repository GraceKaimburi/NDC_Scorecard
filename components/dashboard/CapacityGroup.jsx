"use client";
import { motion } from "framer-motion";
import { useDashboardData } from "@/store/DashboardContext";
import { getCategoryIcon } from "./getCategoryIcon";
import { getRatingColor } from "@/utils/getRatingColor";
import { capitalize } from "@/utils/capitalize";

export default function CapacityGroup() {
	const {
		setSelectedSection,
		structuredData,
		implementationData,
		developmentData,
		currentSectorCategory,
	} = useDashboardData();
	return Object.keys(structuredData).length < 1 ? (
		<div className="grid grid-rows-2 gap-2">
			<motion.div
				initial={{ x: 20, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ delay: 0.3 }}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={() => setSelectedSection(currentSectorCategory)}
				className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
			>
				<h3 className="text-xl font-bold mb-4">Implementation</h3>
				<div className="grid grid-cols-2 gap-2">
					{Object.entries(implementationData).map(([key, value], index) => (
						<motion.div
							key={key}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 + index * 0.1 }}
							className="flex items-center gap-2"
						>
							{getCategoryIcon(key)}
							<p className={`text-sm ${getRatingColor(value)}`}>
								{capitalize(key)}: {value}z
							</p>
						</motion.div>
					))}
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
				<h3 className="text-xl font-bold mb-4">
					{capitalize(currentSectorCategory)}
				</h3>
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
		<div className="grid grid-rows-1 gap-2 p-4 bg-white  rounded-lg shadow-lg  cursor-pointer hover:shadow-xl transition-shadow">
			{Object.entries(structuredData).map(
				([parentKey, parentValue]) =>
					parentKey === currentSectorCategory && (
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							key={parentKey}
							onClick={() => setSelectedSection(parentKey)}
							className=" flex flex-col"
						>
							<h3 className="text-xl font-bold">
								{capitalize(parentKey)} Capacity
							</h3>
							<div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1 p-2">
								{Object.entries(parentValue).map(([key, objVal], index) => (
									<motion.div
										key={key}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 + index * 0.1 }}
										className="flex items-center gap-2 p-4 border rounded"
									>
										<objVal.Icon className="w-5 h-5" />
										<p className={`text-sm ${getRatingColor(objVal.label)}`}>
											{/* {capitalize(key)}: {objVal.score} */}
											{capitalize(key)}: {objVal.score}
										</p>
									</motion.div>
								))}
							</div>
						</motion.div>
					)
			)}
		</div>
	);
}
