"use client";
import React from "react";
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

const Dashboard = () => {
  const dsData = useDashboardData();

  // const cumulativeData = [
  //   {
  //     category: "Finance",
  //     value:
  //       ratingToNumber(implementationData.finance) +
  //       ratingToNumber(developmentData.finance),
  //     displayRating: numberToRating(
  //       ratingToNumber(implementationData.finance) +
  //         ratingToNumber(developmentData.finance)
  //     ),
  //   },
  //   {
  //     category: "Technical",
  //     value:
  //       ratingToNumber(implementationData.technical) +
  //       ratingToNumber(developmentData.technical),
  //     displayRating: numberToRating(
  //       ratingToNumber(implementationData.technical) +
  //         ratingToNumber(developmentData.technical)
  //     ),
  //   },
  //   {
  //     category: "Governance",
  //     value:
  //       ratingToNumber(implementationData.governance) +
  //       ratingToNumber(developmentData.governance),
  //     displayRating: numberToRating(
  //       ratingToNumber(implementationData.governance) +
  //         ratingToNumber(developmentData.governance)
  //     ),
  //   },
  //   {
  //     category: "M&E",
  //     value:
  //       ratingToNumber(implementationData.monitoring) +
  //       ratingToNumber(developmentData.monitoring),
  //     displayRating: numberToRating(
  //       ratingToNumber(implementationData.monitoring) +
  //         ratingToNumber(developmentData.monitoring)
  //     ),
  //   },
  // ];

  // Main return statement with all components
  return (
    <AuthMiddleware>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50 p-6"
      >
        <MaxWidth>
          <DashboardHeader />

          <AnimatePresence mode="wait">
            {dsData.selectedSection ? (
              <DetailedView key="detailed" type={dsData.selectedSection} />
            ) : (
              <MainDashboard
                // sessionData={sessionData}
                // stoppedSessionsWithAnalysis={stoppedSessionsWithAnalysis}
                key="main"
              />
            )}
          </AnimatePresence>

          <QuestionModal />
          <SavedSessionsModal />
          {/* <RecommendationSection
          implementationData={implementationData}
          developmentData={developmentData}
        /> */}

          <ResultsModal
          // isOpen={showResults}
          // onClose={() => setShowResults(false)}
          // results={answers}
          // implementationData={implementationData}
          // developmentData={developmentData}
          />

          {dsData.isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
        </MaxWidth>
      </motion.div>
    </AuthMiddleware>
  );
};

export default Dashboard;
