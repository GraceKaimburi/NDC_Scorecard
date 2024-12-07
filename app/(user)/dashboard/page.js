"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import ResultsModal from "@/components/Results";
import { capitalize } from "@/utils/capitalize";
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

const getRatingColor = (rating) => {
  switch ((rating || "")?.toLowerCase()) {
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

const SectorCapacityCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Object.keys(data).map((sectorKey) => {
        const sector = data[sectorKey];
        const Icon = sector.Icon;

        return (
          <motion.div
            key={sectorKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">
                {sectorKey === "Monitoring and Evaluation" ? "M&E" : sectorKey}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Implementation:</span>
                <span
                  className={`text-sm font-medium ${getRatingColor(
                    sector.implementation.label
                  )}`}
                >
                  {sector.implementation.score} ({sector.implementation.label})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Development:</span>
                <span
                  className={`text-sm font-medium ${getRatingColor(
                    sector.development.label
                  )}`}
                >
                  {sector.development.score} ({sector.development.label})
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
  // State declarations
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scorecardData, setScorecardData] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentSector, setCurrentSector] = useState(0);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("Start");
  const [savedSessions, setSavedSessions] = useState([]);
  const [showSavedSessions, setShowSavedSessions] = useState(false);
  const sectors = [
    "Financial",
    "Technical",
    "Governance",
    "Monitoring and Evaluation",
  ];
  const accessToken = getAccessToken();

  const RecommendationSection = ({ implementationData, developmentData }) => {
    const findLowestRatedSectors = () => {
      const ratings = { poor: 1, average: 2, good: 3 };
      const sectors = ["finance", "technical", "governance", "monitoring"];

      const combinedRatings = sectors.map((sector) => ({
        sector,
        rating: Math.min(
          ratings[implementationData[sector]?.toLowerCase()],
          ratings[developmentData[sector]?.toLowerCase()]
        ),
      }));

      const minRating = Math.min(...combinedRatings.map((s) => s.rating));
      return combinedRatings
        .filter((s) => s.rating === minRating)
        .map((s) => s.sector);
    };

    const lowestRatedSectors = findLowestRatedSectors();

    return lowestRatedSectors.length === 0 ? null : (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">Recommended Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowestRatedSectors.map((sector) => (
            <div key={sector} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">
                {sector === "monitoring" ? "M&E" : sector} Resources
              </h3>
              <div className="space-y-2">
                {resourceLinks[sector]
                  ?.slice(0, lowestRatedSectors.length === 1 ? 3 : 1)
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
        title: "Planning for NDC Implementation:  A Quick-Start Guide",
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
        title: "Planning for NDC Implementation:  MRV Guide",
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
  // Chart configurations
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

  // Session management functions
  const createSession = async () => {
    try {
      const response = await fetchWithAuth(
        "https://ndcbackend.agnesafrica.org/api/session/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Start" }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSessionId(data.id);
      setSessionStatus("Start");
      return data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const updateSessionStatus = async (newStatus) => {
    try {
      const response = await fetchWithAuth(
        `https://ndcbackend.agnesafrica.org/api/session/${sessionId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setSessionStatus(newStatus);
    } catch (error) {
      console.error("Error updating session status:", error);
    }
  };
  /**
   * @param {string} savedSessionId
   */
  const resumeSession = async (savedSessionId) => {
    // debugger;
    try {
      const response = await fetchWithAuth(
        `https://ndcbackend.agnesafrica.org/api/session/${savedSessionId}/responses/`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const sessionData = await response.json();
      setSessionId(savedSessionId);
      setSessionStatus("Resume");
      setAnswers(
        sessionData.reduce((acc, answer) => {
          acc[answer.question] = { answer: answer.selected_choice };
          return acc;
        }, {})
      );

      setShowSavedSessions(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error resuming session:", error);
    }
  };

  const getSavedSessions = async () => {
    try {
      const response = await fetchWithAuth(
        "https://ndcbackend.agnesafrica.org/api/session/"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setSavedSessions(data);
    } catch (error) {
      console.error("Error fetching saved sessions:", error);
    }
  };

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, scorecardRes] = await Promise.all([
          fetchWithAuth("https://ndcbackend.agnesafrica.org/api/session/"),
          fetchWithAuth("https://ndcbackend.agnesafrica.org/api/scorecard/"),
        ]);

        const [sessionResData, scorecardData] = await Promise.all([
          sessionRes.json(),
          scorecardRes.json(),
        ]);

        setScorecardData(scorecardData);
        setSessionData(sessionResData);
        // Load saved sessions on initial load
        await getSavedSessions();

        const allQuestions = scorecardData.flatMap((category) =>
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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);
  console.log({ sessionData });

  const resumableSessions = useMemo(
    function () {
      const onPause = sessionData.filter(
        (session) => session.session_status === "Pause"
      );
      const pendingStart = sessionData.filter(
        (session) => session.session_status === "Start"
      );
      const stopped = sessionData.filter(
        (session) => session.session_status === "Stop"
      );
      const actionType = /**@type {const} */ (
        onPause.length > 0 ? "Resume" : "Start"
      );
      return { onPause, pendingStart, stopped, actionType };
    },
    [savedSessions, sessionData]
  );

  const stoppedSessionsWithAnalysis = useMemo(
    function () {
      const stopped = sessionData.filter(
        (session) => session.session_status === "Stop"
      );
      if (stopped.length > 0) {
        const firstSorted = stopped.sort(
          (a, b) => new Date(b.session_date) - new Date(a.session_date)
        )[0];

        const {
          analyses: {
            category_analyses,
            sector_analyses,
            overall_sector_scores,
          },
          overall_score,
        } = firstSorted;
        return {
          category_analyses,
          sector_analyses,
          overall_sector_scores,
          overall_score,
        };
      }
      return {};
    },
    [sessionData]
  );

  // Question and Answer Handling
  const getCurrentSectorQuestions = () => {
    return questions.filter((q) => q.sector === sectors[currentSector]);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: value,
      },
    }));
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate all questions are answered
      const sectorQuestions = getCurrentSectorQuestions();
      const unansweredQuestions = sectorQuestions.filter((q) => !answers[q.id]);

      if (unansweredQuestions.length > 0) {
        alert("Please answer all questions before submitting.");
        setIsLoading(false);
        return;
      }

      await updateSessionStatus("Stop");

      const formattedAnswers = Object.entries(answers).map(
        ([question_id, details]) => ({
          question_id,
          selected_choice_id: details.answer,
        })
      );

      const response = await fetchWithAuth(
        `https://ndcbackend.agnesafrica.org/api/session/${sessionId}/responses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            session_status: "Stop",
            answers: formattedAnswers,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit answers");

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
      setShowModal(false);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProgress = async () => {
    try {
      await updateSessionStatus("Pause");

      const formattedAnswers = Object.entries(answers).map(
        ([question_id, details]) => ({
          question_id,
          selected_choice_id: details.answer,
        })
      );

      const response = await fetchWithAuth(
        `https://ndcbackend.agnesafrica.org/api/session/${sessionId}/responses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            session_status: "Pause",
            answers: formattedAnswers,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save progress");
      alert("Progress saved successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("Failed to save progress. Please try again.");
    }
  };

  //RESUME SESSION
  const handleResumeProgress = async () => {
    try {
      await updateSessionStatus("Pause");

      const formattedAnswers = Object.entries(answers).map(
        ([question_id, details]) => ({
          question_id,
          selected_choice_id: details.answer,
        })
      );

      const response = await fetchWithAuth(
        `https://ndcbackend.agnesafrica.org/api/session/${sessionId}/responses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            session_status: "Resume",
            answers: formattedAnswers,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to Resume progress");
      alert("Progress Resumed successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error resuming progress:", error);
      alert("Failed to Resume progress. Please try again.");
    }
  };
  //RESUME SESSION

  // Rating and Chart Data Functions
  const ratingToNumber = (rating) => {
    switch (rating?.toLowerCase()) {
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

  // Question Modal Component
  const QuestionModal = () => {
    const modalContentRef = useRef(null);
    if (!showModal) return null;

    const sectorQuestions = getCurrentSectorQuestions();
    const isLastSector = currentSector === sectors.length - 1;

    const handleNext = () => {
      const allAnswered = sectorQuestions.every((q) => answers[q.id]);
      if (!allAnswered) {
        alert("Please answer all questions in this section before proceeding.");
        return;
      }

      if (isLastSector) {
        handleSubmit();
      } else {
        setCurrentSector((prev) => prev + 1);
        if (modalContentRef.current) {
          modalContentRef.current.scrollTop = 0;
        }
      }
    };

    const handleBack = () => {
      setCurrentSector((prev) => prev - 1);
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] relative overflow-hidden">
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
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  required
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

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleBack}
              disabled={currentSector === 0}
              className={`px-4 py-2 flex items-center gap-2 ${
                currentSector === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProgress}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
              >
                Save Progress
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
      </div>
    );
  };
  const DetailedView = ({ type }) => {
    const [historicalData, setHistoricalData] = useState([]);
    // const detailedData = getDetailedData(type);

    useEffect(() => {
      const fetchHistoricalData = async () => {
        try {
          const response = await fetchWithAuth(
            `https://ndcbackend.agnesafrica.org/api/session/` // Removed 'analyses'
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
          console.log("Historical Data:", data); // For debugging

          // Check if data exists and has the expected structure
          if (data && Array.isArray(data)) {
            // Access the analysis field correctly
            setHistoricalData(data.map((item) => item.analyses || {}));
          } else {
            console.error("Invalid data structure received:", data);
            setHistoricalData([]);
          }
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
            data: historicalData.map((d) => d[sector.toLowerCase()] || 0), // Added fallback to 0
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

  const SavedSessionsModal = () => {
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
                    onClick={() => resumeSession(session.id)}
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

  const MainDashboard = () => {
    const [historicalData, setHistoricalData] = useState([]);
    // const detailedData = getDetailedData(type);

    useEffect(() => {
      const fetchHistoricalData = async () => {
        try {
          const response = await fetchWithAuth(
            `https://ndcbackend.agnesafrica.org/api/session/` // Removed 'analyses'
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
          // console.log('Historical Data:', data); // For debugging

          // Check if data exists and has the expected structure
          // if (data && Array.isArray(data)) {
          //   // Access the analysis field correctly
          //   // setHistoricalData(data.map(item => item.analyses || {}));
          //   setHistoricalData(data[0].analyses || {});
          if (data && Array.isArray(data)) {
            // Just set the data directly
            setHistoricalData(data.analyses || {});
          } else {
            console.error("Invalid data structure received:", data);
            setHistoricalData([]);
          }
        } catch (error) {
          console.error("Error fetching historical data:", error);
          setHistoricalData([]);
        }
      };

      fetchHistoricalData();
    }, []);
    console.log("Historical Data:", historicalData); // For debugging

    const dashboardChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          max: 100,
          min: 0,
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
              const dataValue = context.dataset.data[dataIndex];
              // return dataset ? `Rating: ${dataset}(${dataValue})` : '';
              return dataset ? `Rating: ${dataValue}` : "";
            },
          },
        },
      },
    };

    // const chartData = {
    //   labels: cumulativeData.map((d) => d.category),
    //   datasets: [
    //     {
    //       data: cumulativeData.map((d) => d.value),
    //       backgroundColor: "#3B82F6",
    //       borderRadius: 6,
    //       label: "Rating",
    //     },
    //   ],
    // };
    const chartData = useMemo(() => {
      const { overall_sector_scores } = stoppedSessionsWithAnalysis;
      if (!overall_sector_scores) return { labels: [], datasets: [] };
      return {
        labels: overall_sector_scores.map((d) => d.sector),
        datasets: [
          {
            data: overall_sector_scores.map((d) => d.total_score),
            backgroundColor: "#3B82F6",
            borderRadius: 6,
            label: "Rating",
          },
        ],
      };
    }, []);
    const sectorCapacityData = useMemo(() => {
      const { sector_analyses: data } = stoppedSessionsWithAnalysis;
      if (!data || !Array.isArray(data) || data.length === 0) return {};

      const processedData = data
        .map((item) => {
          const [sType, sector] = item.sector.split(" - ");
          return {
            sector: sector.trim(),
            type: sType.trim(),
            score: parseFloat(item.score),
            label: item.label,
          };
        })
        .reduce(
          (acc, item) => {
            if (!acc[item.sector]) {
              acc[item.sector] = {
                implementation: { score: "No Data", label: "No Data" },
                development: { score: "No Data", label: "No Data" },
              };
            }

            const typeKey = item.type.toLowerCase().includes("implementation")
              ? "implementation"
              : "development";

            acc[item.sector][typeKey] = {
              score: item.score,
              label: item.label,
            };

            return acc;
          },
          {
            Financial: {
              implementation: { score: "No Data", label: "Good" },
              development: { score: "No Data", label: "Good" },
              Icon: ChartBar,
            },
            Technical: {
              implementation: { score: "No Data", label: "Good" },
              development: { score: "No Data", label: "Good" },
              Icon: Settings,
            },
            Governance: {
              implementation: { score: "No Data", label: "Good" },
              development: { score: "No Data", label: "Good" },
              Icon: ClipboardList,
            },
            "Monitoring and Evaluation": {
              implementation: { score: "No Data", label: "Good" },
              development: { score: "No Data", label: "Good" },
              Icon: Activity,
            },
          }
        );

      return processedData;
    }, []);

    const structuredData = useMemo(() => {
      const { sector_analyses: data } = stoppedSessionsWithAnalysis;
      if (!data || !Array.isArray(data) || data.length === 0) return {};
      const initialStructure = {
        development: {
          Financial: { score: "No Data", label: "No Data", Icon: ChartBar },
          "Monitoring and Evaluation": {
            score: "No Data",
            label: "No Data",
            Icon: Activity,
          },
          Technical: { score: "No Data", label: "No Data", Icon: Settings },
          Governance: {
            score: "No Data",
            label: "No Data",
            Icon: ClipboardList,
          },
        },
        implementation: {
          Financial: { score: "No Data", label: "No Data", Icon: ChartBar },
          "Monitoring and Evaluation": {
            score: "No Data",
            label: "No Data",
            Icon: Activity,
          },
          Technical: { score: "No Data", label: "No Data", Icon: Settings },
          Governance: {
            score: "No Data",
            label: "No Data",
            Icon: ClipboardList,
          },
        },
      };

      return data.reduce((acc, item) => {
        const [sType, sector] = item.sector.split(" - ");
        const typeKey = sType.toLowerCase().includes("implementation")
          ? "implementation"
          : "development";

        if (!acc[typeKey][sector.trim()]) {
          // In case sectors are dynamic
          acc[typeKey][sector.trim()] = {
            score: "No Data",
            label: "No Data",
            Icon: null,
          };
        }

        acc[typeKey][sector.trim()] = {
          score: parseFloat(item.score),
          label: item.label,
          Icon: acc[typeKey][sector.trim()].Icon, // Preserve existing icon if present
        };

        return acc;
      }, initialStructure);
    }, []);

    return (
      <AuthMiddleware>
        <SectorCapacityCards data={sectorCapacityData} />
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
            <div className="h-72">
              <Bar data={chartData} options={dashboardChartOptions} />
            </div>
          </motion.div>
          <div className="grid grid-rows-2 gap-2">
            {Object.entries(structuredData).map(([parentKey, parentValue]) => (
              <motion.div
                key={parentKey}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSection("implementation")}
                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4">
                  {capitalize(parentKey)}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(parentValue).map(([key, objVal], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <objVal.Icon className="w-5 h-5" />
                      <p className={`text-sm ${getRatingColor(objVal.label)}`}>
                        {capitalize(key)}: {objVal.score}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
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
            onClick={() =>
              /*setShowSavedSessions(true)*/ resumeSession(
                resumableSessions.onPause[0].id
              )
            }
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
              createSession();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            New Assessment
          </motion.button>
        )}
      </div>
    </motion.header>
  );

  // Main return statement with all components
  return (
    <AuthMiddleware>
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
        <SavedSessionsModal />
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

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </motion.div>
    </AuthMiddleware>
  );
};

export default Dashboard;
