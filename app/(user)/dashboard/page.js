"use client";
import React, { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
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
import { Bar, Line } from "react-chartjs-2";
import {
  ArrowLeft,
  ChartBar,
  ClipboardList,
  Settings,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthMiddleware from "@/AuthMiddleware";
import { getAccessToken } from "@/utils/access-token";
import { fetchWithAuth } from "@/utils/fetch";

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
// After imports and ChartJS setup

const getRatingColor = (rating) => {
  switch (rating?.toLowerCase()) {
    case "good":
      return "text-green-600";
    case "average":
      return "text-yellow-600";
    case "poor":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const SectorCapacityCards = ({ implementationData, developmentData }) => {
  const sectors = [
    { name: "Finance", icon: ChartBar },
    { name: "Technical", icon: Settings },
    { name: "Governance", icon: ClipboardList },
    { name: "Monitoring", icon: Activity }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
      {sectors.map((sector) => {
        const Icon = sector.icon;
        const key = sector.name.toLowerCase();
        return (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">{sector.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Implementation:</span>
                <span className={`text-sm font-medium ${getRatingColor(implementationData[key])}`}>
                  {implementationData[key]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Development:</span>
                <span className={`text-sm font-medium ${getRatingColor(developmentData[key])}`}>
                  {developmentData[key]}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};


const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scorecardData, setScorecardData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [currentSector, setCurrentSector] = useState(0);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const sectors = ["Financial", "Technical", "Governance", "Monitoring"];

  const accessToken = getAccessToken();

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
            return ["Poor", "Average", "Good"][value - 1] || "";
          },
        },
      },
      x: {
        grid: {
          display: false,
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
            const value = context.parsed.y;
            return ["Poor", "Average", "Good"][Math.floor(value) - 1] || "";
          },
        },
      },
    },
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
            return ["Poor", "Average", "Good"][value - 1] || "";
          },
        },
      },
      x: {
        grid: {
          display: false,
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
            const dataIndex = context.dataIndex;
            return `Rating: ${context.dataset.data[dataIndex]}`;
          },
        },
      },
    },
  };

  const barChartData = (type) => {
    const data =
      type === "implementation" ? implementationData : developmentData;
    const ratingValues = Object.values(data).map((rating) =>
      ratingToNumber(rating)
    );

    return {
      labels: ["Finance", "Technical", "Governance", "M&E"],
      datasets: [
        {
          data: ratingValues,
          backgroundColor: "#3B82F6",
          borderRadius: 6,
          label: "Rating",
        },
      ],
    };
  };

  const resourceLinks = {
    finance: [
      {
        title: "NDC Investment Planning Guide",
        url: "https://ndcpartnership.org/sites/default/files/2023-12/ndc-investment-planning-guide-best-practice-brief2023.pdf",
      },
      {
        title: "Finance at the NDC Partnership",
        url: "https://ndcpartnership.org/sites/default/files/2023-09/finance-ndc-partnership-insight-brief.pdf",
      },
      {
        title: "NDC Partnership Finance Strategy",
        url: "https://ndcpartnership.org/sites/default/files/2023-09/ndc-partnership-finance-strategy.pdf",
      },
    ],
    technical: [
      {
        title:
          "Enhancing NDCs: A Guide to Strengthening National Climate Plans",
        url: "https://ndcpartnership.org/knowledgeportal/climatetoolbox/enhancingndcsguidestrengtheningnationalclimateplans",
      },
      {
        title: "UNFCCC Capacity-Building Portal",
        url: "https://unfccc.int/topics/capacity-building/workstreams/capacity-building-portal/capacity-building-portal-resources-on-ndc",
      },
      {
        title: "NDC Partnership's Climate Toolbox",
        url: "https://ndcpartnership.org/knowledgeportal/climate-toolbox/capacity-building-resources-accessing-mobilizing-scaling-climate-finance",
      },
    ],
    governance: [
      {
        title: "Planning for NDC Implementation: A Quick-Start Guide",
        url: "https://ndcguide.cdkn.org/book/planning-for-ndc-implementation-a-quick-start-guide/delivering-the-plan/",
      },
      {
        title: "Institutional Capacities for NDC Implementation",
        url: "https://ndcpartnership.org/knowledgeportal/climate-toolbox/institutional-capacities-ndc-implementation-guidance-document",
      },
      {
        title: "Enhancing Capacities for NDC Preparation and Implementation",
        url: "https://unfccc.int/sites/default/files/resource/NDC%20Workshop.pdf",
      },
    ],
    monitoring: [
      {
        title: "Planning for NDC Implementation: MRV Guide",
        url: "https://ndcguide.cdkn.org/book/planning-for-ndc-implementation-a-quick-start-guide/measuring-reporting-and-verification/",
      },
      {
        title: "NDC Implementation Monitoring and Tracking Training Manual",
        url: "https://atpsnet.org/wp-content/uploads/2024/03/NDC-English.pdf",
      },
      {
        title: "Capacity-Building Resource E-Booklets",
        url: "https://ndcpartnership.org/knowledge-portal/climate-toolbox/capacity-building-resource-e-booklets",
      },
    ],
  };
  

  // Implementation and Development data states
  const [implementationData, setImplementationData] = useState({
    finance: "No Data",
    technical: "No Data",
    governance: "No Data",
    monitoring: "No Data",
  });

  const [developmentData, setDevelopmentData] = useState({
    finance: "No Data",
    technical: "No Data",
    governance: "No Data",
    monitoring: "No Data",
  });

  // Fetch scorecard data from API
  useEffect(() => {
    async function getImplementationData() {
      const res = await fetch(
        "https://ndcbackend.agnesafrica.org/api/analysis/",
        {
          // add bearer token
          headers: {
            Authorization: `JWT ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      const json = await res.json();
      console.log(json);
    }

    getImplementationData();

    const fetchScorecardData = async () => {
      try {
        const response = await fetch(
          "https://ndcbackend.agnesafrica.org/api/scorecard/",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
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
        console.log(allQuestions);
        setQuestions(allQuestions);
      } catch (error) {
        console.error("Error fetching scorecard data:", error);
      }
    };

    fetchScorecardData();
  }, []);

  // Function to get questions for current sector
  const getCurrentSectorQuestions = () => {
    console.log(`Current Sector: ${sectors[currentSector]}`);
    return questions.filter((q) => q.sector === sectors[currentSector]);
  };

  const calculateSectorScore = (answers, sector, category) => {
    const sectorQuestions = questions.filter(
      (q) =>
        q.sector.toLowerCase() === sector.toLowerCase() &&
        q.category.toLowerCase() === category.toLowerCase()
    );

    if (!sectorQuestions.length) return "Poor";

    let totalWeight = 0;
    let weightedSum = 0;
    let answeredQuestions = 0;

    sectorQuestions.forEach((question) => {
      const answer = answers[question.id]?.answer;
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

    if (answeredQuestions === 0) return "Poor";

    const normalizedScore = (weightedSum / totalWeight) * 100;

    if (normalizedScore >= 70) return "Good";
    if (normalizedScore >= 40) return "Average";
    return "Poor";
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: value,
        // sector: questions.find((q) => q.id === questionId).sector,
      },
    }));
  };

  

  const handleSubmit = async () => {
    console.log(answers);
    setIsLoading(true);
    try {
      const session = await createSession();

      console.log(JSON.stringify({ session, answers }));

      const answerInArray = {
        session: session,
        answers: Object.entries(answers).map(([question_id, details]) => ({
          question_id: question_id, 
          ...details,
        })),
      };

      //   {
      //     "session": {
      //         "id": 39,
      //         "start_date": "2024-11-24T09:48:07.873878+03:00"
      //     },
      //     "answers": [
      //         {
      //             "question_id": 93,
      //             "answer": "less than 4 billion usd (very low)",
      //             "sector": "Financial"
      //         },
      //         {
      //             "question_id": 99,
      //             "answer": "partially in place",
      //             "sector": "Financial"
      //         }
      //     ]
      // }

      //  [ {
      //     "id": 93,
      //     "text": "What is the total amount of financial support received from international climate funds (including GCF, GEF, AF etc)?",
      //     "choices": [
      //         {
      //             "id": 437,
      //             "description": "Less than 4 billion USD (Very low)"
      //         },
      //         {
      //             "id": 438,
      //             "description": "4-12 billion USD (Low)"
      //         },
      //         {
      //             "id": 439,
      //             "description": "12-24 billion USD (Average)"
      //         },
      //         {
      //             "id": 440,
      //             "description": "24-36 billion USD (High)"
      //         },
      //         {
      //             "id": 441,
      //             "description": "Above 36 billion USD (Very high)"
      //         }
      //     ],
      //     "sector": "Financial",
      //     "category": "Implementation Capacity"
      // }]
      const updatedObj = {
        session: {
          id: session.id.toString(),
        },
        answers: answerInArray.answers.map((a) => {
          return {
            question_id: a.question_id,
            selected_choice_id: a.answer,
          };
        }),
      };

      console.log(updatedObj, "updatedObj");

      console.log(JSON.stringify(updatedObj));

      const newImplementationData = {
        finance: calculateSectorScore(
          answers,
          "Financial",
          "Implementation Capacity"
        ),
        technical: calculateSectorScore(
          answers,
          "Technical",
          "Implementation Capacity"
        ),
        governance: calculateSectorScore(
          answers,
          "Governance",
          "Implementation Capacity"
        ),
        monitoring: calculateSectorScore(
          answers,
          "Monitoring",
          "Implementation Capacity"
        ),
      };

      const newDevelopmentData = {
        finance: calculateSectorScore(
          answers,
          "Financial",
          "Development Capacity"
        ),
        technical: calculateSectorScore(
          answers,
          "Technical",
          "Development Capacity"
        ),
        governance: calculateSectorScore(
          answers,
          "Governance",
          "Development Capacity"
        ),
        monitoring: calculateSectorScore(
          answers,
          "Monitoring",
          "Development Capacity"
        ),
      };

      setImplementationData(newImplementationData);
      setDevelopmentData(newDevelopmentData);

      console.log("posting to analysis endpoint");
      const response = await fetchWithAuth(
        `https://ndcbackend.agnesafrica.org/api/session/${session.id}/responses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedObj),
        }
      );
      console.log("response from analysis endpoint", response);

      const json = await response.text();
      console.log(json);

      setShowModal(false);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ratingToNumber = (rating) => {
    switch (rating.toLowerCase()) {
      case "good":
        return 3;
      case "average":
        return 2;
      case "poor":
        return 1;
      default:
        return 0;
    }
  };

  const numberToRating = (num) => {
    const normalizedScore = (num / 6) * 100;
    if (normalizedScore >= 70) return "Good";
    if (normalizedScore >= 40) return "Average";
    return "Poor";
  };

  const cumulativeData = [
    {
      category: "Finance",
      value:
        ratingToNumber(implementationData.finance) +
        ratingToNumber(developmentData.finance),
      displayRating: numberToRating(
        ratingToNumber(implementationData.finance) +
          ratingToNumber(developmentData.finance)
      ),
    },
    {
      category: "Technical",
      value:
        ratingToNumber(implementationData.technical) +
        ratingToNumber(developmentData.technical),
      displayRating: numberToRating(
        ratingToNumber(implementationData.technical) +
          ratingToNumber(developmentData.technical)
      ),
    },
    {
      category: "Governance",
      value:
        ratingToNumber(implementationData.governance) +
        ratingToNumber(developmentData.governance),
      displayRating: numberToRating(
        ratingToNumber(implementationData.governance) +
          ratingToNumber(developmentData.governance)
      ),
    },
    {
      category: "M&E",
      value:
        ratingToNumber(implementationData.monitoring) +
        ratingToNumber(developmentData.monitoring),
      displayRating: numberToRating(
        ratingToNumber(implementationData.monitoring) +
          ratingToNumber(developmentData.monitoring)
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
            return selectedSection === "implementation"
              ? `Rating: ${implementationData[dataset.toLowerCase()]}`
              : `Rating: ${developmentData[dataset.toLowerCase()]}`;
          },
        },
      },
    },
  };

  const getDetailedData = (type) => {
    const data =
      type === "implementation" ? implementationData : developmentData;
    return [
      {
        category: "Finance",
        rating: data.finance,
        value: ratingToNumber(data.finance),
      },
      {
        category: "Technical",
        rating: data.technical,
        value: ratingToNumber(data.technical),
      },
      {
        category: "Governance",
        rating: data.governance,
        value: ratingToNumber(data.governance),
      },
      {
        category: "M&E",
        rating: data.monitoring,
        value: ratingToNumber(data.monitoring),
      },
    ];
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "finance":
        return <ChartBar className="w-5 h-5" />;
      case "technical":
        return <Settings className="w-5 h-5" />;
      case "governance":
        return <ClipboardList className="w-5 h-5" />;
      case "monitoring":
      case "m&e":
        return <Activity className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getSessions = async () => {
    try {
      const response = await fetch(
        "https://ndcbackend.agnesafrica.org/api/session/",
        {
          headers: {
            Authorization: `JWT ${accessToken}`,  
            Accept: "application/json",
          },
        }
      );

      const getSession = async () => {
        const session = await getSessions();
        console.log(session);
      };
    
      getSession()

      const data = await response.json();

      if (response.ok) {
        console.log(data);
      } else {
        console.log("Error Fetching Sessions Data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createSession = async () => {
    try {
      const response = await fetchWithAuth(
        "https://ndcbackend.agnesafrica.org/api/session/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Empty body since no data needs to be sent
          body: JSON.stringify({}),
          // Adding cache control for NextJS
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const QuestionModal = () => {
    // const [currentSector, setCurrentSector] = useState(0);
    const modalContentRef = useRef(null);
    if (!showModal) return null;

    const sectorQuestions = getCurrentSectorQuestions();
    const isLastSector = currentSector === sectors.length - 1;

    // Memoize scroll to top function
    const scrollToTop =
      (() => {
        if (modalContentRef.current) {
          modalContentRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      },
      []);

    const handleNext = () => {
      const questionsAnswered = sectorQuestions.every((q) => answers[q.id]);
      // if (!questionsAnswered) {
      //   alert('Please answer all questions in this section before proceeding.');
      //   return;
      // }
      if (isLastSector) {
        handleSubmit();
      } else {
        setCurrentSector((prev) => prev + 1);
        // Scroll to top of modal
        const modalContent = document.querySelector(".modal-content");
        if (modalContent) modalContent.scrollTop = 0;
      }
    };

    const handleBack = () => {
      setCurrentSector((prev) => prev - 1);
      // Scroll to top of modal
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) modalContent.scrollTop = 0;
    };

    // Memoize answer change handler to prevent re-renders
    // const handleSelectChange =
    //   ((questionId, value) => {
    //     Prevent default is not needed here as select onChange doesn't need it
    //     handleAnswerChange(questionId, value);
    //   },
    //   [handleAnswerChange]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] relative">
          <button
            onClick={() => {
              setShowModal(false);
              setCurrentSector(0);
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-bold mb-2">
            {sectors[currentSector]} Assessment
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Section {currentSector + 1} of {sectors.length}
          </p>

          <div
            ref={modalContentRef}
            className="modal-content overflow-y-auto max-h-[50vh] mb-6 space-y-6"
          >
            {sectorQuestions.map((question) => (
              <div key={question.id} className="space-y-2">
                <p className="font-medium">{question.text}</p>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={answers[question.id]?.answer || ""}
                  onChange={(e) => {
                    //prevent rerender

                    e.preventDefault();
                    handleAnswerChange(question.id, e.target.value);
                    // Scroll to top after answer selection
                    const modalContent =
                      document.querySelector(".modal-content");
                    if (modalContent) modalContent.scrollTop = 0;
                  }}
                >
                  <option value="">Select an answer</option>
                  {question.choices.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.description}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentSector === 0}
              className={`px-4 py-2 flex items-center gap-2 ${
                currentSector === 0
                  ? "text-gray-400"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              {isLastSector ? "Submit" : "Next"}
              {!isLastSector && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
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
          console.error("Error fetching historical data:", error);
          setHistoricalData([]);
        }
      };

      fetchHistoricalData();
    }, [type]);

    const sectorGraphs = sectors.map((sector, index) => {
      const sectorData = {
        labels: historicalData.map((d) => d.date),
        datasets: [
          {
            label: sector,
            data: historicalData.map((d) => d[sector.toLowerCase()]),
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
          },
        ],
      };

      return (
        <div
          key={sector}
          className={`${index === currentGraphIndex ? "block" : "hidden"}`}
        >
          <h3 className="text-lg font-semibold mb-4">
            {sector} Historical Trend
          </h3>
          <div className="h-[400px]">
            <Line data={sectorData} options={lineChartOptions} />
          </div>
        </div>
      );
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Current Ratings</h3>
              <div className="h-[400px]">
                <Bar data={barChartData(type)} options={barChartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="relative">
                {sectorGraphs}
                <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
                  <button
                    onClick={() =>
                      setCurrentGraphIndex(
                        (prev) => (prev - 1 + sectors.length) % sectors.length
                      )
                    }
                    className="p-2 bg-white rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <button
                    onClick={() =>
                      setCurrentGraphIndex(
                        (prev) => (prev + 1) % sectors.length
                      )
                    }
                    className="p-2 bg-white rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  };

  const getRatingColor = (rating) => {
    switch (rating.toLowerCase()) {
      case "good":
        return "text-green-600";
      case "average":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const RecommendationSection = ({ implementationData, developmentData }) => {
    const findLowestRatedSectors = () => {
      const ratings = { poor: 1, average: 2, good: 3 };
      const sectors = ["finance", "technical", "governance", "monitoring"];

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
      return combinedRatings
        .filter((s) => s.rating === minRating)
        .map((s) => s.sector);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {lowestRatedSectors.map((sector) => (
            <div key={sector} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">
                {sector === "monitoring" ? "M&E" : sector} Resources
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
          backgroundColor: "#3B82F6",
          borderRadius: 6,
          label: "Rating",
        },
      ],
    };

    return (
      <AuthMiddleware>
        <SectorCapacityCards 
          implementationData={implementationData}
          developmentData={developmentData}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-2"
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

          <div className="grid grid-rows-2 gap-2">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSection("implementation")}
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-bold mb-4">Implementation</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(implementationData).map(
                  ([key, value], index) => (
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
                  )
                )}
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
              <h3 className="text-xl font-bold mb-4">Development</h3>
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
        </motion.div>
      </AuthMiddleware>
    );
  };

  const Header = () => (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-8 flex justify-between items-center"
    >
      {selectedSection ? (
        <button
          onClick={() => setSelectedSection(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Back to Dashboard</span>
        </button>
      ) : (
        <h1 className="text-2xl font-bold">Dashboard</h1>
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setShowModal(true);
          createSession();
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Update Assessment
      </motion.button>
    </motion.header>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <Header />

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
    </motion.div>
  );
};

export default Dashboard;
