"use client";

import { useDashboardData } from "@/store/DashboardContext";
import { X } from "lucide-react";

export default function SavedSessionsModal() {
  const {
    savedSessions,
    showSavedSessions,
    setShowSavedSessions,
    resumableSessions,
    handleResumeSession,
  } = useDashboardData();
  if (!showSavedSessions) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Saved Sessions</h2>
          <button
            onClick={() => setShowSavedSessions(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {savedSessions.length === 0 ? (
          <p className="text-gray-600">No saved sessions found.</p>
        ) : (
          <div className="space-y-4">
            {resumableSessions.onPause.map((session) => (
              <div
                key={session.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">Session #{session.id}</p>
                  <p className="text-sm text-gray-600">
                    Started: {new Date(session.start_date).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleResumeSession(session.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Resume
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
