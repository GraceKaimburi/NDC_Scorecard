"use client";
import { useDashboardData } from "@/store/DashboardContext";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
export const DashboardHeader = () => {
  const {
    selectedSection,
    resumableSessions,
    setShowModal,
    handleCreateSession,
    handleResumeSession,
    setSelectedSection
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
        <h1 className="text-2xl font-bold">Dashboard</h1>
      )}
      <div className="flex gap-2">
        {resumableSessions.actionType == "Resume" ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resume}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
          >
            Resume Assessment
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
          >
            New Assessment
          </motion.button>
        )}
      </div>
    </motion.header>
  );
};
