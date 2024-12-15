"use client";

import useDashboardFetch from "@/hooks/use-dashboard-fetch";
import useFetch from "@/hooks/useFetch";
import { calculateSectorScore } from "@/utils/calculate-sector-scores";
import { isResponseOk } from "@/utils/is-response-ok";
import { ratingToNumber } from "@/utils/ratingToNumber";
import { ChartBar } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { Settings } from "lucide-react";
import { Activity } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const DashboardContext = createContext({});

const DashboardProvider = ({ children }) => {
  const { privateAPI } = useFetch();
  const {
    createSession,
    getSavedSessions,
    resumeSession,
    updateSessionStatus,
    fetchScoreCardData,
    fetchSessionData,
  } = useDashboardFetch();
  // State declarations
  /**@type {import("@/types/react").ReactUseStateType<string>} */
  const [selectedSection, setSelectedSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  /**@type {import("@/types/react").ReactUseStateType<import("@/types").SectorDataType[]>} */
  const [questions, setQuestions] = useState([]);
  /**@type {import("@/types/react").ReactUseStateType<import("@/types").QuestionAnswerType>} */
  const [answers, setAnswers] = useState({});
  /**@type {import("@/types/react").ReactUseStateType<import("@/types").UploadedQuestionAnswerType>} */
  const [questionFiles, setQuestionFiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [scoreCardData, setScoreCardData] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currentSector, setCurrentSector] = useState(0);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("Start");
  const [savedSessions, setSavedSessions] = useState([]);
  const [showSavedSessions, setShowSavedSessions] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  // const detailedData = getDetailedData(type);

  const sectors = [
    "Financial",
    "Technical",
    "Governance",
    "Monitoring and Evaluation",
  ];

  const handleSectorChange = (event) => {
    const { value } = event.target;
    // console.log("Selected Sector:", value);

    setCurrentSector(Number(value));
  };
  const isLastSector = currentSector === sectors.length - 1;
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

  const fetchData = useCallback(async () => {
    try {
      const [sessionResData, scoreData] = await Promise.all([
        fetchSessionData(),
        fetchScoreCardData(),
      ]);

      setScoreCardData(scoreData);
      setSessionData(sessionResData);

      // Load saved sessions on initial load
      await getSavedSessions();

      const allQuestions = scoreData.flatMap((category) =>
        category.sectors.flatMap((sector) =>
          sector.questions.map((question) => ({
            // id: question.id,
            // text: question.text,
            // choices: question.choices,
            sector: sector.name,
            category: category.name,
            ...question,
          }))
        )
      );
      setQuestions(allQuestions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  const fetchHistoricalData = useCallback(async () => {
    try {
      const response = await privateAPI.get(
        `/api/session/` // Removed 'analyses'
      );
      if (!isResponseOk(response))
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = response.data;
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
  }, []);
  /**
   *
   * @param {string} savedSessionId
   * @returns
   */
  const handleResumeSession = async (savedSessionId) => {
    await resumeSession(savedSessionId, (sessionData) => {
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
    });
  };
  const handleCreateSession = async () => {
    await createSession((data) => {
      setSessionId(data.id);
      setSessionStatus("Start");
    });
  };

  const questionAnswerCheck = useMemo(
    /**
     * @returns {import("@/types").QuestionAnswerAnalysisPreCheckType}
     */
    () => {
      const sectorQuestions = sectors
        .map((sec) => {
          const secQuestions = questions.filter((q) => q.sector === sec);
          const reqQuestions = secQuestions
            .filter((q) => q.is_required)
            .map((q) => q.id.toString());
          const reqCount = reqQuestions.length;
          const answeredReqCount = Object.keys(answers).filter((id) =>
            reqQuestions.includes(id)
          ).length;
          const answeredNonReqCount = Object.keys(answers).filter(
            (id) => !reqQuestions.includes(id)
          ).length;
          const allAnswered = secQuestions.every((q) => answers[q.id]);
          const allReqAnswered = reqCount === answeredReqCount;
          const someAnswered = answeredReqCount > 0 || answeredNonReqCount > 0;
          return {
            sec,
            allAnswered,
            allReqAnswered,
            someAnswered,
          };
        })
        .reduce((acc, {sec,...rest}) => {
          acc[sec] = rest;
          return acc;
        },/** @type {QuestionAnswerAnalysisPreCheckType}*/({}));

      return sectorQuestions;
    },
    [answers]
  );
  const currentUpdatableSessionStatus = useMemo(
    function () {
      const ans = Object.values(questionAnswerCheck);
      const howManyAreAnswered = ans.filter((a) => a.allReqAnswered).length;
      const totalSectors = sectors.length;
      
      const areAllAnswered = howManyAreAnswered === totalSectors;

      // return ans//.some((a) => !a.allAnswered) ? "PartialStop" : "Stop";
      return {
        status:/**@type {const} */ (areAllAnswered ? "Stop" : "PartialStop"),
        howManyAreAnswered,
        totalSectors
      }
    },
    [questionAnswerCheck,answers]
  );

  const resumableSessions = useMemo(
    function () {
      const onPause = sessionData.filter(
        (session) => ["Pause",'PartialStop'].includes(session.session_status)
      );
      const pendingStart = sessionData.filter(
        (session) => session.session_status === "Start"
      );
      const partialStopped = sessionData.filter(
        (session) => session.session_status === "PartialStop"
      );
      const stopped = sessionData.filter(
        (session) => session.session_status === "Stop"
      );
      const actionType = /**@type {const} */ (
        onPause.length > 0 ? "Resume" : "Start"
      );
      return { onPause, pendingStart, partialStopped, stopped, actionType };
    },
    [savedSessions, sessionData]
  );

  const stoppedSessionsWithAnalysis = useMemo(
    function () {
      const stopped = sessionData.filter(
        (session) =>
          session.session_status === "Stop" ||
          session.session_status === "PartialStop"
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
  /**
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   * @returns
   */
  const handleQuestionFileChange = (event) => {
    const inputName = event.target.name;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      setQuestionFiles((prev) => ({
        ...prev,
        [inputName]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate all questions are answered
      const sectorQuestions = getCurrentSectorQuestions();
      // const unansweredQuestions = sectorQuestions.filter((q) => !answers[q.id]);

      // if (unansweredQuestions.length > 0) {
      //   alert("Please answer all questions before submitting.");
      //   setIsLoading(false);
      //   return;
      // }
      const atLeastOneAnswered = sectorQuestions.some((q) => answers[q.id]);
      if (!atLeastOneAnswered) {
        alert(
          "Please answer at least one question in this section before submitting."
        );
        setIsLoading(false);
        return;
      }

      await updateSessionStatus(sessionId, currentUpdatableSessionStatus.status);

      const formattedAnswers = Object.entries(answers)
        .map(([question_id, details]) => ({
          question_id,
          selected_choice_id: details.answer,
          uploaded_file: questionFiles?.[question_id] ?? null,
        }))
        .map(({ uploaded_file, ...rest }) =>
          uploaded_file ? { ...rest, uploaded_file } : rest
        );

      const response = await privateAPI.post(
        `/api/session/${sessionId}/responses/`,
        {
          session_id: sessionId,
          session_status: "PartialStop",
          answers: formattedAnswers,
        }
      );

      if (!isResponseOk(response)) throw new Error("Failed to submit answers");

      const newImplementationData = {
        finance: calculateSectorScore(
          answers,
          "Financial",
          "Implementation Capacity",
          sectorQuestions
        ),
        technical: calculateSectorScore(
          answers,
          "Technical",
          "Implementation Capacity",
          sectorQuestions
        ),
        governance: calculateSectorScore(
          answers,
          "Governance",
          "Implementation Capacity",
          sectorQuestions
        ),
        monitoring: calculateSectorScore(
          answers,
          "Monitoring",
          "Implementation Capacity",
          sectorQuestions
        ),
      };

      const newDevelopmentData = {
        finance: calculateSectorScore(
          answers,
          "Financial",
          "Development Capacity",
          sectorQuestions
        ),
        technical: calculateSectorScore(
          answers,
          "Technical",
          "Development Capacity",
          sectorQuestions
        ),
        governance: calculateSectorScore(
          answers,
          "Governance",
          "Development Capacity",
          sectorQuestions
        ),
        monitoring: calculateSectorScore(
          answers,
          "Monitoring",
          "Development Capacity",
          sectorQuestions
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
      await updateSessionStatus(sessionId, "Pause");

      const formattedAnswers = Object.entries(answers).map(
        ([question_id, details]) => ({
          question_id,
          selected_choice_id: details.answer,
        })
      );

      const response = await privateAPI.post(
        `/api/session/${sessionId}/responses/`,
        {
          session_id: sessionId,
          session_status: "Pause",
          answers: formattedAnswers,
        }
      );

      if (!isResponseOk(response)) throw new Error("Failed to save progress");
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

      const response = await privateAPI.post(
        `/api/session/${sessionId}/responses/`,
        {
          session_id: sessionId,
          session_status: "Resume",
          answers: formattedAnswers,
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
  }, [sessionData]);

  const structuredData = useMemo(() => {
    const { sector_analyses: data } = stoppedSessionsWithAnalysis;
    if (!data || !Array.isArray(data) || data.length === 0) return {};
    const initialStructure = {
      development: {
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
        Financial: { score: "No Data", label: "No Data", Icon: ChartBar },
      },
      implementation: {
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
        Financial: { score: "No Data", label: "No Data", Icon: ChartBar },
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
  }, [sessionData]);

  // Data fetching effect
  useEffect(() => {
    fetchData();
    fetchHistoricalData();
  }, []);
  // console.log({ sessionData });
  // console.log({scoreCardData});
  const state = {
    handleQuestionFileChange,
    questionFiles,
    selectedSection,
    setSelectedSection,
    showModal,
    setShowModal,
    questions,
    setQuestions,
    answers,
    setAnswers,
    isLoading,
    setIsLoading,
    scorecardData: scoreCardData,
    setScorecardData: setScoreCardData,
    sessionData,
    setSessionData,
    showResults,
    setShowResults,
    currentSector,
    setCurrentSector,
    currentGraphIndex,
    setCurrentGraphIndex,
    sessionId,
    setSessionId,
    sessionStatus,
    setSessionStatus,
    savedSessions,
    setSavedSessions,
    showSavedSessions,
    setShowSavedSessions,
    sectors,
    isLastSector,
    implementationData,
    setImplementationData,
    developmentData,
    setDevelopmentData,
    lineChartOptions,
    barChartOptions,
    handleResumeSession,
    handleCreateSession,
    resumableSessions,
    stoppedSessionsWithAnalysis,
    getCurrentSectorQuestions,
    handleAnswerChange,
    handleSubmit,
    handleSaveProgress,
    handleResumeProgress,
    barChartData,
    sectorCapacityData,
    structuredData,
    historicalData,
    setHistoricalData,
    handleSectorChange,
    questionAnswerCheck,
    currentUpdatableSessionStatus
  };
  return (
    <DashboardContext.Provider value={state}>
      {children}
    </DashboardContext.Provider>
  );
};

const useDashboardData = () => {
  const state = useContext(DashboardContext);
  return state;
};

export { DashboardProvider, useDashboardData };
