"use client";

import { useDashboardData } from "@/store/DashboardContext";
import { SUPPORTED_MIME_INPUTS } from "@/utils/constants";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { X } from "lucide-react";
import React, { useRef } from "react";

// Question Modal Component
export function QuestionModal() {
  const {
    showModal,
    getCurrentSectorQuestions,
    currentSector,
    sectors,
    answers,
    setCurrentSector,
    handleSubmit,
    handleAnswerChange,
    setShowModal,
    handleSaveProgress,
    handleSectorChange,
    handleQuestionFileChange,
    // questionAnswerCheck,
    // currentUpdatableSessionStatus,
    questionFiles,
  } = useDashboardData();
  const modalContentRef = useRef(null);
  if (!showModal) return null;
  /**@type {import("@/types").SectorDataType[]} */
  const sectorQuestions = getCurrentSectorQuestions();
  const isLastSector = currentSector === sectors.length - 1;
  const handleNext = () => {
    // const allAnswered = sectorQuestions.every((q) => answers[q.id]);
    // if (!allAnswered) {
    //   alert("Please answer all questions in this section before proceeding.");
    //   return;
    // }
    // const atLeastOneAnswered = sectorQuestions.some((q) => answers[q.id]);
    // if (!atLeastOneAnswered) {
    //   alert("Please answer at least one question in this section before proceeding.");
    //   return;
    // }

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

  // console.log({ sectorQuestions });
  /**
   *
   * @param {React.FormEvent} e
   * @returns
   */
  const submitForm = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await handleSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={submitForm}
        className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] relative overflow-hidden"
      >
        <button
          onClick={() => {
            setShowModal(false);
            setCurrentSector(0);
          }}
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            <div className="flex items-center space-x-4">
              <label
                htmlFor="sector-select"
                className="text-md font-normal text-gray-700"
              >
                Select Sector:
              </label>
              <select
                id="sector-select"
                name="sector"
                className="block w-full max-w-sm p-2 border border-gray-300 rounded-md shadow-sm focus:ring-0 focus:border-blue-500 sm:text-sm"
                defaultValue={currentSector}
                onChange={handleSectorChange}
              >
                {sectors.map((sector, index) => (
                  <option key={index} value={index}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>
          </h2>
          <p className="text-xl font-bold text-gray-600">
            {sectors[currentSector]} Assessment
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Section {currentSector + 1} of {sectors.length}
        </p>

        <div
          ref={modalContentRef}
          className="modal-content overflow-y-auto max-h-[60vh] mb-6 space-y-6"
        >
          {sectorQuestions.map((question, index) => (
            <div key={question.id} className="space-y-2">
              <p className="font-medium">
                (<span className={`text-sm font-normal`}>{index + 1}</span>)
                {". "}
                {question.text}
                {question["is_required"] && (
                  <span className="text-red-500">*</span>
                )}
              </p>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={answers[question.id]?.answer || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                required={question.is_required}
              >
                <option value="" disabled>
                  Select an answer
                </option>
                {question.choices.map((choice) => (
                  <option key={choice.id} value={choice.id}>
                    {choice.description}
                  </option>
                ))}
              </select>
              {question["requires_file_upload"] && (
                <>
                  <input
                    type="file"
                    accept={SUPPORTED_MIME_INPUTS.join(",")}
                    name={question.id}
                    // required
                    id={question.id}
                    onChange={handleQuestionFileChange}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          {/* <button
            onClick={handleBack}
            disabled={currentSector === 0}
            className={`px-4 py-2 flex items-center gap-2 ${
              currentSector === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button> */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveProgress}
              type="button"
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
            >
              Save Progress
            </button>
            {/* <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              {isLastSector ? "Submit" : "Next"}
              {!isLastSector && <ChevronRight className="w-4 h-4" />}
            </button> */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              Submit
              {!isLastSector && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
