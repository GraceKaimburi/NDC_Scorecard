'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowLeft, ChartBar, ClipboardList, Settings, Activity, X } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Existing state
  const [implementationData, setImplementationData] = useState({
    finance: 'Good',
    technical: 'Average',
    governance: 'Poor',
    monitoring: 'Good'
  });

  const [developmentData, setDevelopmentData] = useState({
    finance: 'Average',
    technical: 'Good',
    governance: 'Average',
    monitoring: 'Average'
  });

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });
      
      const data = await response.json();
      
      // Update the dashboard data with the new ratings
      setImplementationData(data.implementation);
      setDevelopmentData(data.development);
      
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal Component
  const QuestionModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl font-bold mb-6">Assessment Questions</h2>
          
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <p className="font-medium">{question.text}</p>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
                  <option value="">Select an answer</option>
                  <option value="poor">Poor</option>
                  <option value="average">Average</option>
                  <option value="good">Good</option>
                </select>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Rest of your existing code...
  const ratingToNumber = (rating) => {
    switch(rating.toLowerCase()) {
      case 'good': return 3;
      case 'average': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  };

  const numberToRating = (num) => {
    if (num >= 5) return 'Good';
    if (num >= 3) return 'Average';
    return 'Poor';
  };

  // Calculate cumulative data
  const cumulativeData = [
    {
      category: 'Finance',
      value: ratingToNumber(implementationData.finance) + ratingToNumber(developmentData.finance),
      displayRating: numberToRating(ratingToNumber(implementationData.finance) + ratingToNumber(developmentData.finance))
    },
    {
      category: 'Technical',
      value: ratingToNumber(implementationData.technical) + ratingToNumber(developmentData.technical),
      displayRating: numberToRating(ratingToNumber(implementationData.technical) + ratingToNumber(developmentData.technical))
    },
    {
      category: 'Governance',
      value: ratingToNumber(implementationData.governance) + ratingToNumber(developmentData.governance),
      displayRating: numberToRating(ratingToNumber(implementationData.governance) + ratingToNumber(developmentData.governance))
    },
    {
      category: 'M&E',
      value: ratingToNumber(implementationData.monitoring) + ratingToNumber(developmentData.monitoring),
      displayRating: numberToRating(ratingToNumber(implementationData.monitoring) + ratingToNumber(developmentData.monitoring))
    },
  ];

  // Your existing chart options...
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        max: 6
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex;
            const dataset = context.chart.data.labels[dataIndex];
            return selectedSection === 'implementation' 
              ? `Rating: ${implementationData[dataset.toLowerCase()]}`
              : `Rating: ${developmentData[dataset.toLowerCase()]}`;
          }
        }
      }
    }
  };

  // Your existing helper functions...
  const getDetailedData = (type) => {
    const data = type === 'implementation' ? implementationData : developmentData;
    return [
      { category: 'Finance', rating: data.finance, value: ratingToNumber(data.finance) },
      { category: 'Technical', rating: data.technical, value: ratingToNumber(data.technical) },
      { category: 'Governance', rating: data.governance, value: ratingToNumber(data.governance) },
      { category: 'M&E', rating: data.monitoring, value: ratingToNumber(data.monitoring) },
    ];
  };

  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'finance':
        return <ChartBar className="w-5 h-5" />;
      case 'technical':
        return <Settings className="w-5 h-5" />;
      case 'governance':
        return <ClipboardList className="w-5 h-5" />;
      case 'monitoring':
      case 'm&e':
        return <Activity className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const DetailedView = ({ type }) => {
    const detailedData = getDetailedData(type);
    const chartData = {
      labels: detailedData.map(d => d.category),
      datasets: [
        {
          data: detailedData.map(d => d.value),
          backgroundColor: '#3B82F6',
          borderRadius: 6,
          label: 'Rating'
        }
      ]
    };

    return (
      <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{type.charAt(0).toUpperCase() + type.slice(1)} Analysis</h2>
          <button 
            onClick={() => setSelectedSection(null)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const getRatingColor = (rating) => {
    switch(rating.toLowerCase()) {
      case 'good': return 'text-green-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const MainDashboard = () => {
    const chartData = {
      labels: cumulativeData.map(d => d.category),
      datasets: [
        {
          data: cumulativeData.map(d => d.value),
          backgroundColor: '#3B82F6',
          borderRadius: 6,
          label: 'Rating'
        }
      ]
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Overall Capacity Ratings</h2>
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="grid grid-rows-2 gap-6">
          {/* Implementation Card */}
          <div 
            onClick={() => setSelectedSection('implementation')}
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">Implementation</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(implementationData).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {getCategoryIcon(key)}
                  <p className={`text-sm ${getRatingColor(value)}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Development Card */}
          <div 
            onClick={() => setSelectedSection('development')}
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">Development</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(developmentData).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  {getCategoryIcon(key)}
                  <p className={`text-sm ${getRatingColor(value)}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">NDC Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Update Assessment
        </button>
      </header>

      {selectedSection ? (
        <DetailedView type={selectedSection} />
      ) : (
        <MainDashboard />
      )}

      <QuestionModal />
    </main>
  );
};

export default Dashboard;