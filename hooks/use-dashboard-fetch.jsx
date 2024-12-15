"use client";
import {
  isFunctionAPromise,
  resolvePromise,
} from "@/utils/is-function-a-promise";
import useFetch from "./useFetch";
import { isResponseOk } from "@/utils/is-response-ok";

export default function useDashboardFetch() {
  const { privateAPI } = useFetch();
  // Session management functions
  const createSession = async (callback) => {
    try {
      const response = await privateAPI.post("/api/session/", {
        status: "Start",
      });

      if (!isResponseOk(response))
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = response.data

      // if (callback) {
      //   setSessionId(data.id);
      //   setSessionStatus("Start");
      //   return data;
      await resolvePromise(callback, data);
      // }
      return data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  /**
   *
   * @param {'Stop'|'Start'|'Pause'} newStatus
   * @param {string|number} sessionId
   * @param {Function} callback
   */
  const updateSessionStatus = async (sessionId, newStatus, callback) => {
    try {
      const response = await privateAPI.patch(`/api/session/${sessionId}/`, {
        status: newStatus,
      });

      if (!isResponseOk(response))
        throw new Error(`HTTP error! status: ${response.status}`);
      //   setSessionStatus(newStatus);
      await resolvePromise(callback);
      return response.data;
    } catch (error) {
      console.error("Error updating session status:", error);
    }
  };
  /**
   * @param {string} savedSessionId
   */
  const resumeSession = async (savedSessionId, callback) => {
    try {
      const response = await privateAPI.get(
        `/api/session/${savedSessionId}/responses/`
      );
      if (!isResponseOk(response))
        throw new Error(`HTTP error! status: ${response.status}`);

      const sessionData = response.data;

      await resolvePromise(callback, sessionData);
      // setSessionId(savedSessionId);
      // setSessionStatus("Resume");
      // setAnswers(
      //   sessionData.reduce((acc, answer) => {
      //     acc[answer.question] = { answer: answer.selected_choice };
      //     return acc;
      //   }, {})
      // );

      // setShowSavedSessions(false);
      // setShowModal(true);
    } catch (error) {
      console.error("Error resuming session:", error);
    }
  };

  const getSavedSessions = async (callback) => {
    try {
      const response = await privateAPI.get("/api/session/");
      if (!isResponseOk(response)) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // const data = await response.json();
      // setSavedSessions(data);
      await resolvePromise(callback, response.data);
    } catch (error) {
      console.error("Error fetching saved sessions:", error);
    }
  };

  const fetchScoreCardData = async () => {
    try {
      const { data } = await privateAPI.get("/api/scorecard/");
      return data;
    } catch (error) {
      console.error("Error fetching scorecard data:", error.response);
    }
  };

  const fetchSessionData = async () => {
    try {
      const { data } = await privateAPI.get("/api/session/");

      return data;
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };
  return {
    createSession,
    updateSessionStatus,
    resumeSession,
    getSavedSessions,
    fetchScoreCardData,
    fetchSessionData,
  };
}
