'use client'
import React from 'react';
import { 
  FiStar, 
  FiArrowRight,
  FiBarChart2,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';

const ResultsPage = () => {
  // Sample data - in real app would come from props or API
  const results = {
    score: 4.2,
    totalQuestions: 10,
    completedQuestions: 10,
    recommendations: [
      "Enhance adaptation strategies",
      "Improve documentation of mitigation efforts",
      "Consider additional stakeholder engagement"
    ]
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-teal-500 p-4 text-white">
        <h1 className="text-2xl font-bold">Results</h1>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Analyze Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiBarChart2 className="mr-2 text-teal-500" />
            Analyze Results
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">
                {(results.completedQuestions / results.totalQuestions * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Questions Completed</span>
              <span className="font-medium">
                {results.completedQuestions}/{results.totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* How You Scored */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiAward className="mr-2 text-teal-500" />
            How You Scored
          </h2>
          <div className="text-center py-4">
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-8 h-8 ${
                    star <= results.score 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800">
              {results.score} / 5
            </p>
            <p className="text-gray-600 mt-1">
              {results.score >= 4 ? 'Excellent' : 
               results.score >= 3 ? 'Good' :
               results.score >= 2 ? 'Fair' : 'Needs Improvement'}
            </p>
          </div>
        </div>

        {/* Next Steps Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiTrendingUp className="mr-2 text-teal-500" />
            Next Steps Recommendations
          </h2>
          <div className="space-y-4">
            {results.recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className="flex items-start p-3 bg-gray-50 rounded"
              >
                <FiArrowRight className="mt-1 mr-2 text-teal-500 flex-shrink-0" />
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-100 p-4 mt-6">
        <div className="flex justify-between items-center">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Download Report
          </button>
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center"
          >
            Share Results
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;