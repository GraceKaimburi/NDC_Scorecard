'use client'
import React, { useState } from 'react';
import { 
  FiInfo, 
  FiCheck,
  FiAlertCircle,
  FiSave,
  FiClipboard,
  FiBook,
  FiSend,
  FiLoader
} from 'react-icons/fi';

const NDCScorecardSystem = () => {
  const [activeTab, setActiveTab] = useState('completion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    questionTitle: '',
    feedback: '',
    isAnonymous: false,
    description: '',
    basicInput: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      // Handle error
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* Tab Navigation */}
      <div className="bg-teal-500 p-4">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('completion')}
            className={`px-4 py-2 rounded-t-lg flex items-center ${
              activeTab === 'completion' ? 'bg-white text-teal-600' : 'bg-teal-600 text-white'
            }`}
          >
            <FiBook className="mr-2" />
            Scorecard Completion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-t-lg flex items-center ${
              activeTab === 'questions' ? 'bg-white text-teal-600' : 'bg-teal-600 text-white'
            }`}
          >
            <FiClipboard className="mr-2" />
            Sample Question Set
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'completion' ? (
          // ... (Previous Scorecard Completion content remains the same)
          <div className="space-y-6">
            {/* Data Entry Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <FiInfo className="mr-2 text-teal-500" />
                Data Entry Instructions
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>Please follow these instructions carefully when entering data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete all required fields marked with an asterisk (*)</li>
                  <li>Use appropriate units as specified in each field</li>
                  <li>Double-check your entries before submission</li>
                </ul>
              </div>
            </div>

            {/* Follow Guidelines */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <FiCheck className="mr-2 text-teal-500" />
                Follow Guidelines
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">Data Quality</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Ensure data accuracy</li>
                    <li>• Provide complete information</li>
                    <li>• Use consistent formats</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium mb-2">Documentation</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Include relevant references</li>
                    <li>• Document assumptions</li>
                    <li>• Note any data gaps</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Validation and Saving Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <FiAlertCircle className="mr-2 text-teal-500" />
                Validation and Saving Tips
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-blue-800">
                    Remember to save your progress regularly using the save button below
                  </p>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <FiCheck className="mt-1 mr-2 text-green-500" />
                    Review all entries before final submission
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mt-1 mr-2 text-green-500" />
                    Address any validation errors highlighted in red
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mt-1 mr-2 text-green-500" />
                    Save progress after completing each section
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Sample Question Set Screen with Form Submissions
          <div className="space-y-6">
            {/* Form Question */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Form Question</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-gray-700">
                    Question Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                    placeholder="Enter your answer"
                    value={formData.questionTitle}
                    onChange={(e) => handleInputChange('questionTitle', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Feedback Form</h2>
              <div className="space-y-4">
                <textarea 
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  rows="4"
                  placeholder="Provide your feedback here..."
                  value={formData.feedback}
                  onChange={(e) => handleInputChange('feedback', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                  />
                  <label htmlFor="anonymous">Submit anonymously</label>
                </div>
              </div>
            </div>

            {/* Form with Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-2">Form with Description</h2>
              <p className="text-gray-600 mb-4">
                Please provide detailed information about your climate action initiatives.
              </p>
              <div className="space-y-4">
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  placeholder="Enter details here"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>

            {/* Basic Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Form</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  placeholder="Basic input field"
                  value={formData.basicInput}
                  onChange={(e) => handleInputChange('basicInput', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Submit */}
      <div className="border-t bg-gray-50 p-4 mt-6">
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 flex items-center"
            >
              <FiSave className="mr-2" />
              Save Progress
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Submission Success Message */}
      {submitted && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 p-4 rounded-lg shadow-lg">
          <div className="flex items-center text-green-700">
            <FiCheck className="mr-2" />
            Form submitted successfully!
          </div>
        </div>
      )}
    </form>
  );
};

export default NDCScorecardSystem;