import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function QuizResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
      No result data found. Start a quiz first.
      </div>
    );
  }

  const { questions, selectedOptions, score, time } = data;
  const percentage = Math.round((score.correct / questions.length) * 100);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold text-center text-gray-800">
          Quiz Results
        </h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-5 bg-green-100 rounded-xl">
            <h2 className="text-xl font-semibold text-green-700">Correct</h2>
            <p className="text-3xl font-bold text-green-800">{score.correct}</p>
          </div>
          <div className="p-5 bg-red-100 rounded-xl">
            <h2 className="text-xl font-semibold text-red-700">Wrong</h2>
            <p className="text-3xl font-bold text-red-800">{score.wrong}</p>
          </div>
          <div className="p-5 bg-blue-100 rounded-xl">
            <h2 className="text-xl font-semibold text-blue-700">Score %</h2>
            <p className="text-3xl font-bold text-blue-800">{percentage}%</p>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-700 text-lg">
          ⏳ <span className="font-semibold">Time Taken:</span> {formatTime(time)}
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-800">
          Answer Review
        </h2>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = selectedOptions[idx];
            const isCorrect = userAnswer === q.answer;

            return (
              <div key={idx} className="border p-5 rounded-xl bg-gray-50 shadow-sm">
                <p className="text-lg font-semibold text-gray-800">
                  {idx + 1}. {q.question}
                </p>

                <p className={`mt-2 font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  Your Answer: {userAnswer || "Not Answered"}
                </p>

                {!isCorrect && (
                  <p className="text-gray-800 font-medium mt-1">
                    ✔ Correct Answer: <span className="text-green-700">{q.answer}) {q.options?.find(o => o.label === q.answer)?.text || ""}</span>
                  </p>
                )}

                <p className="mt-3 text-gray-700 bg-white p-3 rounded-lg border">
                  <span className="font-semibold text-gray-900">Explanation:</span>{" "}
                  {q.explanation || "No explanation provided."}
                </p>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-between flex-wrap gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400"
          >
            ⬅ Back
          </button>

          <button
            onClick={() => navigate("/topics")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            📚 Back to Topics
          </button>

          <button
            onClick={() => navigate(0)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            🔄 Retry Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
