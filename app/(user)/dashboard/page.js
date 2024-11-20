'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import ResultsModal from '@/components/Results';
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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { ArrowLeft, ChartBar, ClipboardList, Settings, Activity, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthMiddleware from '@/AuthMiddleware';

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
  // State variables
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scorecardData, setScorecardData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Pagination state for QuestionModal
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;

  const resourceLinks = {
    finance: [
      {
        title: 'NDC Investment Planning Guide',
        url: 'https://ndcpartnership.org/sites/default/files/2023-12/ndc-investment-planning-guide-best-practice-brief2023.pdf',
      },
      {
        title: 'Finance at the NDC Partnership',
        url: 'https://ndcpartnership.org/sites/default/files/2023-09/finance-ndc-partnership-insight-brief.pdf',
      },
      {
        title: 'NDC Partnership Finance Strategy',
        url: 'https://ndcpartnership.org/sites/default/files/2023-09/ndc-partnership-finance-strategy.pdf',
      },
    ],
    technical: [
      {
        title: 'Enhancing NDCs: A Guide to Strengthening National Climate Plans',
        url: 'https://ndcpartnership.org/knowledgeportal/climatetoolbox/enhancingndcsguidestrengtheningnationalclimateplans',
      },
      {
        title: 'UNFCCC Capacity-Building Portal',
        url: 'https://unfccc.int/topics/capacity-building/workstreams/capacity-building-portal/capacity-building-portal-resources-on-ndc',
      },
      {
        title: "NDC Partnership's Climate Toolbox",
        url: 'https://ndcpartnership.org/knowledgeportal/climate-toolbox/capacity-building-resources-accessing-mobilizing-scaling-climate-finance',
      },
    ],
    governance: [
      {
        title: 'Planning for NDC Implementation: A Quick-Start Guide',
        url: 'https://ndcguide.cdkn.org/book/planning-for-ndc-implementation-a-quick-start-guide/delivering-the-plan/',
      },
      {
        title: 'Institutional Capacities for NDC Implementation',
        url: 'https://ndcpartnership.org/knowledgeportal/climate-toolbox/institutional-capacities-ndc-implementation-guidance-document',
      },
      {
        title: 'Enhancing Capacities for NDC Preparation and Implementation',
        url: 'https://unfccc.int/sites/default/files/resource/NDC%20Workshop.pdf',
      },
    ],
    monitoring: [
      {
        title: 'Planning for NDC Implementation: MRV Guide',
        url: 'https://ndcguide.cdkn.org/book/planning-for-ndc-implementation-a-quick-start-guide/measuring-reporting-and-verification/',
      },
      {
        title: 'NDC Implementation Monitoring and Tracking Training Manual',
        url: 'https://atpsnet.org/wp-content/uploads/2024/03/NDC-English.pdf',
      },
      {
        title: 'Capacity-Building Resource E-Booklets',
        url: 'https://ndcpartnership.org/knowledge-portal/climate-toolbox/capacity-building-resource-e-booklets',
      },
    ],
  };

  // Implementation and Development data states
  const [implementationData, setImplementationData] = useState({
    finance: 'No data',
    technical: 'No data',
    governance: 'No data',
    monitoring: 'No data',
  });

  const [developmentData, setDevelopmentData] = useState({
    finance: 'No data',
    technical: 'No data',
    governance: 'No data',
    monitoring: 'No data',
  });

  // Fetch scorecard data from API
  useEffect(() => {
    const fetchScorecardData = async () => {
      try {
        const response = await fetch('https://ndcbackend.agnesafrica.org/api/scorecard/', {
          headers: {
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        setScorecardData(data);

        const allQuestions = data.flatMap((category) =>
          category.sectors.flatMap((sector) =>
            sector.questions.map((question) => ({
              id: question.id,
              text: question.text,
              choices: question.choices,
              sector: sector.name,
              category: category.name,
            }))
          )
        );
        setQuestions(allQuestions);
      } catch (error) {
        console.error('Error fetching scorecard data:', error);
      }
    };

    fetchScorecardData();
  }, []);

  const calculateSectorScore = (answers, sector, category) => {
    const sectorQuestions = questions.filter(
      (q) =>
        q.sector.toLowerCase() === sector.toLowerCase() &&
        q.category.toLowerCase() === category.toLowerCase()
    );

    if (!sectorQuestions.length) return 'Poor';

    let totalWeight = 0;
    let weightedSum = 0;
    let answeredQuestions = 0;

    sectorQuestions.forEach((question) => {
      const answer = answers[question.id];
      if (answer) {
        const choice = question.choices.find(
          (c) => c.description.toLowerCase() === answer.toLowerCase()
        );
        if (choice) {
          const maxWeight = Math.max(...question.choices.map((c) => c.value));
          totalWeight += maxWeight;
          weightedSum += choice.value;
          answeredQuestions++;
        }
      }
    });

    if (answeredQuestions === 0) return 'Poor';

    const normalizedScore = (weightedSum / totalWeight) * 100;

    if (normalizedScore >= 70) return 'Good';
    if (normalizedScore >= 40) return 'Average';
    return 'Poor';
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newImplementationData = {
        finance: calculateSectorScore(answers, 'Financial', 'Implementation Capacity'),
        technical: calculateSectorScore(answers, 'Technical', 'Implementation Capacity'),
        governance: calculateSectorScore(answers, 'Governance', 'Implementation Capacity'),
        monitoring: calculateSectorScore(answers, 'Monitoring', 'Implementation Capacity'),
      };

      const newDevelopmentData = {
        finance: calculateSectorScore(answers, 'Financial', 'Development Capacity'),
        technical: calculateSectorScore(answers, 'Technical', 'Development Capacity'),
        governance: calculateSectorScore(answers, 'Governance', 'Development Capacity'),
        monitoring: calculateSectorScore(answers, 'Monitoring', 'Development Capacity'),
      };

      setImplementationData(newImplementationData);
      setDevelopmentData(newDevelopmentData);

      await fetch('https://ndcbackend.agnesafrica.org/api/session/{$id}/responses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id, // Include the session ID here
          answers: Object.entries(answers).map(([questionId, value]) => ({
            question_id: parseInt(questionId),
            answer: value,
          })),
        }),
      });

      setShowModal(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async () => {
    try {
      const response = await fetch('https://ndcbackend.agnesafrica.org/api/session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSessionId(data.id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const ratingToNumber = (rating) => {
    switch (rating.toLowerCase()) {
      case 'good':
        return 3;
      case 'average':
        return 2;
      case 'poor':
        return 1;
      default:
        return 0;
    }
  };

  const numberToRating = (num) => {
    const normalizedScore = (num / 6) * 100;
    if (normalizedScore >= 70) return 'Good';
    if (normalizedScore >= 40) return 'Average';
    return 'Poor';
  };

  const cumulativeData = [
    {
      category: 'Finance',
      value: ratingToNumber(implementationData.finance) + ratingToNumber(developmentData.finance),
      displayRating: numberToRating(
        ratingToNumber(implementationData.finance) + ratingToNumber(developmentData.finance)
      ),
    },
    {
      category: 'Technical',
      value:
        ratingToNumber(implementationData.technical) + ratingToNumber(developmentData.technical),
      displayRating: numberToRating(
        ratingToNumber(implementationData.technical) + ratingToNumber(developmentData.technical)
      ),
    },
    {
      category: 'Governance',
      value:
        ratingToNumber(implementationData.governance) + ratingToNumber(developmentData.governance),
      displayRating: numberToRating(
        ratingToNumber(implementationData.governance) + ratingToNumber(developmentData.governance)
      ),
    },
    {
      category: 'M&E',
      value:
        ratingToNumber(implementationData.monitoring) + ratingToNumber(developmentData.monitoring),
      displayRating: numberToRating(
        ratingToNumber(implementationData.monitoring) + ratingToNumber(developmentData.monitoring)
      ),
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        max: 6,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataIndex = context.dataIndex;
            const dataset = context.chart.data.labels[dataIndex];
            return selectedSection === 'implementation'
              ? `Rating: ${implementationData[dataset.toLowerCase()]}`
              : `Rating: ${developmentData[dataset.toLowerCase()]}`;
          },
        },
      },
    },
  };

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
    switch (category.toLowerCase()) {
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

  const QuestionModal = () => {
    if (!showModal) return null;

    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const startIndex = currentPage * questionsPerPage;
    const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

    const isCurrentPageValid = currentQuestions.every((q) => answers[q.id]);
    const isSurveyComplete = questions.every((q) => answers[q.id]);

    const handleNextPage = () => {
      if (isCurrentPageValid) {
        setCurrentPage((prev) => prev + 1);
      } else {
        alert('Please answer all questions on this page before proceeding.');
      }
    };

    const handlePreviousPage = () => {
      setCurrentPage((prev) => prev - 1);
    };

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
          >
            <button
              onClick={() => {
                setShowModal(false);
                setCurrentPage(0); // Reset to first page when closing modal
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-bold mb-6">Assessment Questions</h2>

            <div className="space-y-6">
              {currentQuestions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <p className="font-medium">
                    {startIndex + index + 1}. {question.text}{' '}
                    <span className="text-red-500">*</span>
                  </p>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  >
                    <option value="">Select an answer</option>
                    {question.choices.map((choice) => (
                      <option key={choice.id} value={choice.description.toLowerCase()}>
                        {choice.description}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div>
                {currentPage > 0 && (
                  <button
                    onClick={handlePreviousPage}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNextPage}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                      !isCurrentPageValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!isCurrentPageValid}
                  >
                    Next
                  </button>
                )}
                {currentPage === totalPages - 1 && (
                  <button
                    onClick={handleSubmit}
                    disabled={!isSurveyComplete || isLoading}
                    className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ${
                      !isSurveyComplete ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const DetailedView = ({ type }) => {
    const [historicalData, setHistoricalData] = useState([]);
    const detailedData = getDetailedData(type);

    useEffect(() => {
      const fetchHistoricalData = async () => {
        try {
          const response = await fetch(
            `https://ndcbackend.agnesafrica.org/api/scorecard/history/${type}/`
          );
          const data = await response.json();
          setHistoricalData(data);
        } catch (error) {
          console.error('Error fetching historical data:', error);
          setHistoricalData([
            { date: '2024-01', finance: 2, technical: 1, governance: 3, monitoring: 2 },
            { date: '2024-02', finance: 2, technical: 2, governance: 3, monitoring: 2 },
            { date: '2024-03', finance: 3, technical: 2, governance: 3, monitoring: 3 },
          ]);
        }
      };

      fetchHistoricalData();
    }, [type]);

    const barChartData = {
      labels: detailedData.map((d) => d.category),
      datasets: [
        {
          data: detailedData.map((d) => d.value),
          backgroundColor: '#3B82F6',
          borderRadius: 6,
          label: 'Current Rating',
        },
      ],
    };

    const lineChartData = {
      labels: historicalData.map((d) => d.date),
      datasets: [
        {
          label: 'Finance',
          data: historicalData.map((d) => d.finance),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Technical',
          data: historicalData.map((d) => d.technical),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Governance',
          data: historicalData.map((d) => d.governance),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
        },
        {
          label: 'M&E',
          data: historicalData.map((d) => d.monitoring),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
      ],
    };

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 3,
          ticks: {
            stepSize: 1,
            callback: function (value) {
              return ['Poor', 'Average', 'Good'][value - 1] || '';
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return `Rating: ${value === 3 ? 'Good' : value === 2 ? 'Average' : 'Poor'}`;
            },
          },
        },
      },
    };

    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 3,
          ticks: {
            stepSize: 1,
            callback: function (value) {
              return ['Poor', 'Average', 'Good'][value - 1] || '';
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return `${context.dataset.label}: ${
                value === 3 ? 'Good' : value === 2 ? 'Average' : 'Poor'
              }`;
            },
          },
        },
      },
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6"
        >
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSection(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </motion.button>
            </div>
          </div>

          {/* Charts Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart Container */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Current Ratings</h3>
              <div className="h-[400px]">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </motion.div>

            {/* Line Chart Container */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Historical Trends</h3>
              <div className="h-[400px]">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };

  const getRatingColor = (rating) => {
    switch (rating.toLowerCase()) {
      case 'good':
        return 'text-green-600';
      case 'average':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const RecommendationSection = ({ implementationData, developmentData }) => {
    const findLowestRatedSectors = () => {
      const ratings = { poor: 1, average: 2, good: 3 };
      const sectors = ['finance', 'technical', 'governance', 'monitoring'];

      // Combine implementation and development ratings
      const combinedRatings = sectors.map((sector) => ({
        sector,
        rating: Math.min(
          ratings[implementationData[sector].toLowerCase()],
          ratings[developmentData[sector].toLowerCase()]
        ),
      }));

      // Find the minimum rating
      const minRating = Math.min(...combinedRatings.map((s) => s.rating));

      // Return all sectors with the minimum rating
      return combinedRatings.filter((s) => s.rating === minRating).map((s) => s.sector);
    };

    const lowestRatedSectors = findLowestRatedSectors();

    if (lowestRatedSectors.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">Recommended Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowestRatedSectors.map((sector) => (
            <div key={sector} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">
                {sector === 'monitoring' ? 'M&E' : sector} Resources
              </h3>
              <div className="space-y-2">
                {resourceLinks[sector]
                  .slice(0, lowestRatedSectors.length === 1 ? 3 : 1)
                  .map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {link.title}
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const MainDashboard = () => {
    const chartData = {
      labels: cumulativeData.map((d) => d.category),
      datasets: [
        {
          data: cumulativeData.map((d) => d.value),
          backgroundColor: '#3B82F6',
          borderRadius: 6,
          label: 'Rating',
        },
      ],
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4">Overall Capacity Ratings</h2>
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        <div className="grid grid-rows-2 gap-6">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSection('implementation')}
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">Implementation</h3>
            <div className="grid grid-cols-2 gap-4">
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
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
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
            onClick={() => setSelectedSection('development')}
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">Development</h3>
            <div className="grid grid-cols-2 gap-4">
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
      </motion.div>
    );
  };

  return (
    <AuthMiddleware>
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold">NDC Dashboard</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowModal(true);
            setCurrentPage(0); // Reset to the first page
            setAnswers({}); // Clear previous answers
            startSession(); // Start a new session
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Update Assessment
        </motion.button>
      </motion.header>

      <AnimatePresence mode="wait">
        {selectedSection ? (
          <DetailedView key="detailed" type={selectedSection} />
        ) : (
          <MainDashboard key="main" />
        )}
      </AnimatePresence>

      <QuestionModal />

      <RecommendationSection
        implementationData={implementationData}
        developmentData={developmentData}
      />

      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={answers}
        implementationData={implementationData}
        developmentData={developmentData}
      />
    </motion.main>
    </AuthMiddleware>
  );
};

export default Dashboard;
