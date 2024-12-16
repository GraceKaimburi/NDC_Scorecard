"use client";
import React, { useState } from "react";
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
              <MainDashboard key="main" />
            )}
          </AnimatePresence>

          <QuestionModal />
          <SavedSessionsModal />

          <ResultsModal />

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
