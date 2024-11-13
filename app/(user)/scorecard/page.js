'use client'
import React, { useState } from 'react';
import { 
  FiAlertCircle, 
  FiCheckCircle, 
  FiSave, 
  FiArrowRight,
  FiInfo
} from 'react-icons/fi';

const NDCScorecard = () => {
  const [formData, setFormData] = useState({
    adaptation: 0,
    mitigation: 0,
    implementation: 0,
    comments: ''
  });
  
  const [showSaveReminder, setShowSaveReminder] = useState(false);
  const [savedProgress, setSavedProgress] = useState(false);

  // Reminder to save after 2 minutes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSaveReminder(true);
    }, 120000);
    return () => clearTimeout(timer);
  }, []);

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSavedProgress(false);
  };

  const handleSave = () => {
    // Simulate saving data
    setTimeout(() => {
      setSavedProgress(true);
      setShowSaveReminder(false);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">NDC Scorecard Completion</h1>
        <p className="text-gray-600 mt-2">
          Please evaluate the following climate action criteria
        </p>
      </div>

      {/* Main Form */}
      <div className="space-y-8">
        {/* Adaptation Strategy Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Adaptation Strategy Effectiveness
            </span>
            <div className="flex items-center mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.adaptation}
                onChange={(e) => handleSliderChange('adaptation', e.target.value)}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-4 w-12 text-gray-600">
                {formData.adaptation}%
              </span>
            </div>
          </label>
        </div>

        {/* Mitigation Measures Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Mitigation Measures Impact
            </span>
            <div className="flex items-center mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.mitigation}
                onChange={(e) => handleSliderChange('mitigation', e.target.value)}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-4 w-12 text-gray-600">
                {formData.mitigation}%
              </span>
            </div>
          </label>
        </div>

        {/* Implementation Progress Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">
              Implementation Progress
            </span>
            <div className="flex items-center mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.implementation}
                onChange={(e) => handleSliderChange('implementation', e.target.value)}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-4 w-12 text-gray-600">
                {formData.implementation}%
              </span>
            </div>
          </label>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block">
            <span className="text-gray-700 font-medium">Additional Comments</span>
            <textarea
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              rows="3"
              value={formData.comments}
              onChange={(e) => handleSliderChange('comments', e.target.value)}
              placeholder="Add any notes or comments here..."
            />
          </label>
        </div>
      </div>

      {/* Save Reminder Popup */}
      {showSaveReminder && (
        <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-lg flex items-center">
          <FiAlertCircle className="text-yellow-500 mr-2" />
          <span className="text-sm text-yellow-700">
            Don't forget to save your progress!
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiSave className="mr-2" />
          Save Progress
        </button>
        
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit
          <FiArrowRight className="ml-2" />
        </button>
      </div>

      {/* Save Confirmation */}
      {savedProgress && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
          <FiCheckCircle className="mr-2" />
          Progress saved successfully!
        </div>
      )}
    </div>
  );
};

export default NDCScorecard;